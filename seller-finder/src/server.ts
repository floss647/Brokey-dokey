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
} from './db.js';
import { generateOutreachMessage, generateEmailSubject } from './messages.js';
import { importFromUrl } from './import-url.js';
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

// ── Blog (server-rendered so Facebook/OG crawlers see real HTML) ─────────────

const SITE_URL = process.env.SITE_URL || 'https://brokeydokey.co.uk';

function blogLayout(title: string, metaTags: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — BrokeyDokey</title>
${metaTags}
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f1117;color:#e8eaf0;line-height:1.7}
  a{color:#ff6b2b;text-decoration:none}a:hover{text-decoration:underline}
  header{background:#1a1d27;border-bottom:1px solid #2a2d3a;padding:16px 24px;display:flex;align-items:center;gap:16px}
  .logo{font-size:18px;font-weight:700;color:#ff6b2b}
  .logo span{color:#e8eaf0}
  .container{max-width:760px;margin:0 auto;padding:48px 24px}
  h1{font-size:2rem;font-weight:800;line-height:1.25;margin-bottom:12px}
  .meta{color:#7a7e96;font-size:14px;margin-bottom:32px}
  .hero-img{width:100%;border-radius:10px;margin-bottom:32px;max-height:420px;object-fit:cover}
  .body{font-size:16px;line-height:1.8}
  .body p{margin-bottom:1.2em}
  .body h2{font-size:1.3rem;font-weight:700;margin:2em 0 0.6em}
  .body h3{font-size:1.1rem;font-weight:700;margin:1.5em 0 0.5em}
  .body ul,.body ol{padding-left:1.4em;margin-bottom:1.2em}
  .body li{margin-bottom:0.4em}
  .body blockquote{border-left:3px solid #ff6b2b;padding-left:1em;color:#7a7e96;margin:1.5em 0}
  .back{margin-bottom:32px;font-size:14px}
  .post-card{background:#1a1d27;border:1px solid #2a2d3a;border-radius:10px;overflow:hidden;margin-bottom:16px}
  .post-card img{width:100%;height:200px;object-fit:cover}
  .post-card-body{padding:20px}
  .post-card h2{font-size:1.2rem;font-weight:700;margin-bottom:8px}
  .post-card p{color:#7a7e96;font-size:14px;margin-bottom:12px}
  .post-card a.read{color:#ff6b2b;font-size:14px;font-weight:600}
</style>
</head>
<body>
<header>
  <a class="logo" href="/">Brokey<span>Dokey</span></a>
  <a href="/blog" style="font-size:14px;color:#7a7e96">Blog</a>
</header>
${bodyHtml}
</body>
</html>`;
}

function renderBody(text: string): string {
  return text
    .split('\n\n')
    .map(p => {
      if (p.startsWith('## ')) return `<h2>${p.slice(3)}</h2>`;
      if (p.startsWith('### ')) return `<h3>${p.slice(4)}</h3>`;
      if (p.startsWith('> ')) return `<blockquote>${p.slice(2)}</blockquote>`;
      if (p.startsWith('- ') || p.startsWith('* ')) {
        const items = p.split('\n').map(l => `<li>${l.replace(/^[-*] /, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

app.get('/blog', (_req, res) => {
  const posts = getPosts('published');
  const cards = posts.length
    ? posts.map(p => `
      <div class="post-card">
        ${p.image_url ? `<img src="${p.image_url}" alt="">` : ''}
        <div class="post-card-body">
          <h2>${p.title}</h2>
          ${p.excerpt ? `<p>${p.excerpt}</p>` : ''}
          <a class="read" href="/blog/${p.slug}">Read →</a>
        </div>
      </div>`).join('')
    : '<p style="color:#7a7e96">No posts yet.</p>';

  const meta = `
    <meta property="og:type" content="website">
    <meta property="og:title" content="BrokeyDokey Blog">
    <meta property="og:description" content="News, tips and stories from BrokeyDokey — the UK marketplace for broken and unused items.">
    <meta property="og:url" content="${SITE_URL}/blog">`;

  res.send(blogLayout('Blog', meta, `<div class="container"><h1>Blog</h1><br>${cards}</div>`));
});

app.get('/blog/:slug', (req, res) => {
  const post = getPostBySlug(req.params.slug);
  if (!post) return res.status(404).send(blogLayout('Not found', '', '<div class="container"><h1>Post not found</h1></div>'));

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const meta = `
    <meta name="description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    <meta property="og:url" content="${postUrl}">
    ${post.image_url ? `<meta property="og:image" content="${post.image_url}">` : ''}
    <meta property="og:site_name" content="BrokeyDokey">
    <meta property="og:locale" content="en_GB">
    <meta name="twitter:card" content="${post.image_url ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${post.title.replace(/"/g, '&quot;')}">
    <meta name="twitter:description" content="${(post.excerpt || '').replace(/"/g, '&quot;')}">
    ${post.image_url ? `<meta name="twitter:image" content="${post.image_url}">` : ''}`;

  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '';
  const body = `<div class="container">
    <div class="back"><a href="/blog">← All posts</a></div>
    <h1>${post.title}</h1>
    <div class="meta">${date}</div>
    ${post.image_url ? `<img class="hero-img" src="${post.image_url}" alt="">` : ''}
    <div class="body">${renderBody(post.body || '')}</div>
  </div>`;

  res.send(blogLayout(post.title, meta, body));
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
