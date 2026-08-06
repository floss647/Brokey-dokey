import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import {
  getSellers,
  getSeller,
  getSellerListings,
  updateSellerStatus,
  updateSellerContact,
  saveOutreach,
  markOutreachSent,
  getStats,
} from './db.js';
import { generateOutreachMessage, generateEmailSubject } from './messages.js';
import type { SellerAggregate } from './scorer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/stats', (_req, res) => {
  res.json(getStats());
});

app.get('/api/sellers', (req, res) => {
  const { status } = req.query as { status?: string };
  const sellers = getSellers(status);
  res.json(sellers);
});

app.get('/api/sellers/:username', (req, res) => {
  const seller = getSeller(req.params.username);
  if (!seller) return res.status(404).json({ error: 'Not found' });
  const listings = getSellerListings(req.params.username);
  res.json({ seller, listings });
});

app.get('/api/sellers/:username/message', (req, res) => {
  const seller = getSeller(req.params.username);
  if (!seller) return res.status(404).json({ error: 'Not found' });
  const listings = getSellerListings(req.params.username) as any[];

  const sellerAgg: SellerAggregate = {
    username: seller.username,
    feedbackScore: seller.feedback_score,
    feedbackPercentage: seller.feedback_percentage,
    brokenListingCount: seller.broken_listing_count,
    totalListingValue: seller.total_listing_value,
    categories: JSON.parse(seller.categories || '[]'),
    score: seller.score,
    listings: listings.map((l) => ({
      itemId: l.item_id,
      title: l.title,
      price: l.price,
      seller: { username: seller.username, feedbackScore: seller.feedback_score, feedbackPercentage: seller.feedback_percentage },
      categoryId: l.category_id,
      categoryName: l.category_name,
      itemWebUrl: l.url,
      image: l.image,
    })),
  };

  res.json({
    subject: generateEmailSubject(sellerAgg),
    message: generateOutreachMessage(sellerAgg),
  });
});

app.patch('/api/sellers/:username/status', (req, res) => {
  const { status } = req.body as { status: string };
  updateSellerStatus(req.params.username, status);
  res.json({ ok: true });
});

app.patch('/api/sellers/:username/contact', (req, res) => {
  updateSellerContact(req.params.username, req.body);
  res.json({ ok: true });
});

app.post('/api/sellers/:username/outreach', (req, res) => {
  const { channel, message } = req.body as { channel: string; message: string };
  saveOutreach(req.params.username, channel, message);
  res.json({ ok: true });
});

app.post('/api/sellers/:username/send-email', async (req, res) => {
  const { email, subject, message } = req.body as { email: string; subject: string; message: string };

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(400).json({ error: 'SMTP not configured in .env' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      text: message,
    });

    saveOutreach(req.params.username, 'email', message);
    markOutreachSent(req.params.username);
    updateSellerStatus(req.params.username, 'contacted');

    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\nBrokeyDokey Seller Finder running at http://localhost:${PORT}\n`);
});
