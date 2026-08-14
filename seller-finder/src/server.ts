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
  saveBdListing,
  updateBdListing,
  getBdListings,
  getBdListing,
  deleteBdListing,
  savePost,
  updatePost,
  getPosts,
  getPost,
  getPostBySlug,
  deletePost,
  getPostsByCategory,
  getFeaturedPosts,
} from './db.js';
import { homepageHtml, sectionHtml, articleHtml, allPostsHtml } from './site.js';
import { generateOutreachMessage, generateEmailSubject } from './messages.js';
import { importFromUrl } from './import-url.js';
import type { SellerAggregate } from './scorer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3456;

app.use(express.json());

// ── Public site ───────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  const featured = getFeaturedPosts(1);
  const theFind = getPostsByCategory('the-find', 3);
  const reviews = getPostsByCategory('review', 1);
  const rollingStop = getPostsByCategory('rolling-stop', 1);
  res.send(homepageHtml(featured, theFind, reviews, rollingStop));
});

app.get('/the-find', (_req, res) => {
  res.send(sectionHtml('the-find', getPostsByCategory('the-find', 30)));
});

app.get('/reviews', (_req, res) => {
  res.send(sectionHtml('review', getPostsByCategory('review', 30)));
});

app.get('/rolling-stop', (_req, res) => {
  res.send(sectionHtml('rolling-stop', getPostsByCategory('rolling-stop', 30)));
});

// ── Admin dashboard ───────────────────────────────────────────────────────────
app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/stats', (_req, res) => {
  res.json(getStats());
});

app.get('/api/sellers', (req, res) => {
  const { status } = req.query as { status?: string };
  res.json(getSellers(status));
});

app.get('/api/sellers/:username', (req, res) => {
  const seller = getSeller(req.params.username);
  if (!seller) return res.status(404).json({ error: 'Not found' });
  res.json({ seller, listings: getSellerListings(req.params.username) });
});

app.get('/api/sellers/:username/message', (req, res) => {
  const seller = getSeller(req.params.username);
  if (!seller) return res.status(404).json({ error: 'Not found' });
  const listings = getSellerListings(req.params.username) as any[];

  const agg: SellerAggregate = {
    username: seller.username,
    feedbackScore: seller.feedback_score,
    feedbackPercentage: seller.feedback_percentage,
    brokenListingCount: seller.broken_listing_count,
    totalListingValue: seller.total_listing_value,
    avgListingValue: seller.total_listing_value / Math.max(1, seller.broken_listing_count),
    categories: JSON.parse(seller.categories || '[]'),
    score: seller.score,
    label: seller.score >= 80 ? 'Hot' : seller.score >= 60 ? 'Good' : seller.score >= 40 ? 'OK' : 'Low',
    listings: listings.map((l) => ({
      itemId: l.item_id,
      title: l.title,
      price: l.price,
      seller: { username: seller.username, feedbackScore: seller.feedback_score, feedbackPercentage: seller.feedback_percentage },
      categoryName: l.category_name,
      itemWebUrl: l.url,
      image: l.image,
    })),
  };

  res.json({ subject: generateEmailSubject(agg), message: generateOutreachMessage(agg) });
});

app.patch('/api/sellers/:username/status', (req, res) => {
  updateSellerStatus(req.params.username, req.body.status);
  res.json({ ok: true });
});

app.patch('/api/sellers/:username/contact', (req, res) => {
  updateSellerContact(req.params.username, req.body);
  res.json({ ok: true });
});

app.post('/api/sellers/:username/outreach', (req, res) => {
  saveOutreach(req.params.username, req.body.channel, req.body.message);
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

// ── Blog (server-rendered for OG crawlers) ────────────────────────────────────

app.get('/blog', (_req, res) => {
  const posts = getPosts('published');
  res.send(allPostsHtml(posts));
});

app.get('/blog/:slug', (req, res) => {
  const post = getPostBySlug(req.params.slug);
  if (!post) return res.status(404).send('<h1>Post not found</h1>');
  res.send(articleHtml(post));
});

// ── Blog admin API ────────────────────────────────────────────────────────────

app.get('/api/posts', (_req, res) => res.json(getPosts()));

app.post('/api/posts', (req, res) => {
  const id = savePost(req.body);
  res.json({ id, ok: true });
});

app.get('/api/posts/:id', (req, res) => {
  const post = getPost(Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

app.patch('/api/posts/:id', (req, res) => {
  updatePost(Number(req.params.id), req.body);
  res.json({ ok: true });
});

app.delete('/api/posts/:id', (req, res) => {
  deletePost(Number(req.params.id));
  res.json({ ok: true });
});

// ── BD Listings ──────────────────────────────────────────────────────────────

app.post('/api/import-url', async (req, res) => {
  const { url } = req.body as { url: string };
  if (!url) return res.status(400).json({ error: 'url required' });
  try {
    const data = await importFromUrl(url);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/listings', (req, res) => {
  const { status } = req.query as { status?: string };
  res.json(getBdListings(status));
});

app.post('/api/listings', (req, res) => {
  try {
    const id = saveBdListing(req.body);
    res.json({ id, ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/listings/:id', (req, res) => {
  const listing = getBdListing(Number(req.params.id));
  if (!listing) return res.status(404).json({ error: 'Not found' });
  res.json(listing);
});

app.patch('/api/listings/:id', (req, res) => {
  updateBdListing(Number(req.params.id), req.body);
  res.json({ ok: true });
});

app.delete('/api/listings/:id', (req, res) => {
  deleteBdListing(Number(req.params.id));
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`\nBrokeyDokey Seller Finder running at http://localhost:${PORT}\n`);
});
