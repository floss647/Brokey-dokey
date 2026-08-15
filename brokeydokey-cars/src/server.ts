import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  savePost, updatePost, getPosts, getPost, getPostBySlug, deletePost,
  getPostsByCategory, getFeaturedPosts,
  saveListing, updateListing, getListings, getListing, deleteListing,
} from './db.js';
import { homepageHtml, sectionHtml, articleHtml, allPostsHtml } from './site.js';
import { importFromUrl } from './import-url.js';

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

app.get('/blog', (_req, res) => {
  res.send(allPostsHtml(getPosts('published')));
});

app.get('/blog/:slug', (req, res) => {
  const post = getPostBySlug(req.params.slug);
  if (!post) return res.status(404).send('<h1>Post not found</h1>');
  res.send(articleHtml(post));
});

// ── Admin dashboard ───────────────────────────────────────────────────────────

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'public')));

// ── Posts API ─────────────────────────────────────────────────────────────────

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

// ── Listings API ──────────────────────────────────────────────────────────────

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
  res.json(getListings(status));
});

app.post('/api/listings', (req, res) => {
  try {
    const id = saveListing(req.body);
    res.json({ id, ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/listings/:id', (req, res) => {
  const listing = getListing(Number(req.params.id));
  if (!listing) return res.status(404).json({ error: 'Not found' });
  res.json(listing);
});

app.patch('/api/listings/:id', (req, res) => {
  updateListing(Number(req.params.id), req.body);
  res.json({ ok: true });
});

app.delete('/api/listings/:id', (req, res) => {
  deleteListing(Number(req.params.id));
  res.json({ ok: true });
});

// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\nBrokeyDokey running at http://localhost:${PORT}\n`);
});
