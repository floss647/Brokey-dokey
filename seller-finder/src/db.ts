import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import type { EbayListing } from './scraper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'sellers.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.exec(`
    CREATE TABLE IF NOT EXISTS sellers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      feedback_score INTEGER DEFAULT 0,
      feedback_percentage REAL DEFAULT 0,
      broken_listing_count INTEGER DEFAULT 0,
      total_listing_value REAL DEFAULT 0,
      categories TEXT DEFAULT '[]',
      score INTEGER DEFAULT 0,
      status TEXT DEFAULT 'new',
      email TEXT,
      instagram TEXT,
      tiktok TEXT,
      website TEXT,
      notes TEXT,
      contacted_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id TEXT UNIQUE NOT NULL,
      seller_username TEXT NOT NULL,
      title TEXT,
      price REAL,
      category_name TEXT,
      url TEXT,
      image TEXT,
      scraped_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bd_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL,
      category TEXT DEFAULT 'Cars',
      status TEXT DEFAULT 'draft',
      source_url TEXT,
      images TEXT DEFAULT '[]',
      location TEXT,
      postcode TEXT,
      make TEXT,
      model TEXT,
      year INTEGER,
      mileage INTEGER,
      fuel_type TEXT,
      engine_size TEXT,
      colour TEXT,
      transmission TEXT,
      body_type TEXT,
      doors INTEGER,
      mot_expiry TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      body TEXT,
      image_url TEXT,
      status TEXT DEFAULT 'draft',
      published_at TEXT,
      category TEXT DEFAULT 'general',
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS outreach (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_username TEXT NOT NULL,
      channel TEXT,
      message TEXT,
      status TEXT DEFAULT 'draft',
      sent_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  // Migrate existing DBs that predate the category/featured columns
  try { _db.exec(`ALTER TABLE posts ADD COLUMN category TEXT DEFAULT 'general'`); } catch {}
  try { _db.exec(`ALTER TABLE posts ADD COLUMN featured INTEGER DEFAULT 0`); } catch {}
  return _db;
}

export interface Seller {
  id: number;
  username: string;
  feedback_score: number;
  feedback_percentage: number;
  broken_listing_count: number;
  total_listing_value: number;
  categories: string;
  score: number;
  status: string;
  email: string | null;
  instagram: string | null;
  tiktok: string | null;
  website: string | null;
  notes: string | null;
  contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export function saveSeller(
  username: string,
  feedbackScore: number,
  feedbackPct: number,
  listingCount: number,
  totalValue: number,
  categories: string[],
  score: number
) {
  getDb().prepare(`
    INSERT INTO sellers (username, feedback_score, feedback_percentage, broken_listing_count, total_listing_value, categories, score, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(username) DO UPDATE SET
      feedback_score = excluded.feedback_score,
      feedback_percentage = excluded.feedback_percentage,
      broken_listing_count = excluded.broken_listing_count,
      total_listing_value = excluded.total_listing_value,
      categories = excluded.categories,
      score = excluded.score,
      updated_at = datetime('now')
  `).run(username, feedbackScore, feedbackPct, listingCount, totalValue, JSON.stringify(categories), score);
}

export function saveListing(listing: EbayListing) {
  getDb().prepare(`
    INSERT OR IGNORE INTO listings (item_id, seller_username, title, price, category_name, url, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(listing.itemId, listing.seller.username, listing.title, listing.price, listing.categoryName, listing.itemWebUrl, listing.image || null);
}

export function getSellers(status?: string): Seller[] {
  if (status) return getDb().prepare('SELECT * FROM sellers WHERE status = ? ORDER BY score DESC').all(status) as Seller[];
  return getDb().prepare('SELECT * FROM sellers ORDER BY score DESC').all() as Seller[];
}

export function getSeller(username: string): Seller | null {
  return getDb().prepare('SELECT * FROM sellers WHERE username = ?').get(username) as Seller | null;
}

export function getSellerListings(username: string) {
  return getDb().prepare('SELECT * FROM listings WHERE seller_username = ? ORDER BY price DESC LIMIT 10').all(username);
}

export function updateSellerStatus(username: string, status: string) {
  getDb().prepare(`
    UPDATE sellers SET status = ?,
      contacted_at = CASE WHEN ? = 'contacted' THEN datetime('now') ELSE contacted_at END,
      updated_at = datetime('now')
    WHERE username = ?
  `).run(status, status, username);
}

export function updateSellerContact(username: string, fields: {
  email?: string; instagram?: string; tiktok?: string; website?: string; notes?: string;
}) {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (!entries.length) return;
  const sql = entries.map(([k]) => `${k} = ?`).join(', ');
  const vals = entries.map(([, v]) => v);
  getDb().prepare(`UPDATE sellers SET ${sql}, updated_at = datetime('now') WHERE username = ?`).run(...vals, username);
}

export function saveOutreach(username: string, channel: string, message: string) {
  getDb().prepare('INSERT INTO outreach (seller_username, channel, message) VALUES (?, ?, ?)').run(username, channel, message);
}

export function markOutreachSent(username: string) {
  getDb().prepare("UPDATE outreach SET status = 'sent', sent_at = datetime('now') WHERE seller_username = ? AND status = 'draft'").run(username);
}

export interface BdListing {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  category: string;
  status: string;
  source_url: string | null;
  images: string;
  location: string | null;
  postcode: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  mileage: number | null;
  fuel_type: string | null;
  engine_size: string | null;
  colour: string | null;
  transmission: string | null;
  body_type: string | null;
  doors: number | null;
  mot_expiry: string | null;
  created_at: string;
  updated_at: string;
}

export function saveBdListing(data: Partial<BdListing> & { title: string }): number {
  const result = getDb().prepare(`
    INSERT INTO bd_listings
      (title, description, price, category, status, source_url, images, location, postcode,
       make, model, year, mileage, fuel_type, engine_size, colour, transmission, body_type, doors, mot_expiry)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    data.title, data.description ?? null, data.price ?? null,
    data.category ?? 'Cars', data.status ?? 'draft',
    data.source_url ?? null, data.images ?? '[]',
    data.location ?? null, data.postcode ?? null,
    data.make ?? null, data.model ?? null, data.year ?? null,
    data.mileage ?? null, data.fuel_type ?? null, data.engine_size ?? null,
    data.colour ?? null, data.transmission ?? null, data.body_type ?? null,
    data.doors ?? null, data.mot_expiry ?? null,
  );
  return result.lastInsertRowid as number;
}

export function updateBdListing(id: number, data: Partial<BdListing>) {
  const fields = Object.entries(data)
    .filter(([k]) => k !== 'id' && k !== 'created_at')
    .map(([k]) => `${k} = ?`).join(', ');
  const vals = Object.entries(data)
    .filter(([k]) => k !== 'id' && k !== 'created_at')
    .map(([, v]) => v);
  if (!fields) return;
  getDb().prepare(`UPDATE bd_listings SET ${fields}, updated_at = datetime('now') WHERE id = ?`).run(...vals, id);
}

export function getBdListings(status?: string): BdListing[] {
  if (status) return getDb().prepare('SELECT * FROM bd_listings WHERE status = ? ORDER BY created_at DESC').all(status) as BdListing[];
  return getDb().prepare('SELECT * FROM bd_listings ORDER BY created_at DESC').all() as BdListing[];
}

export function getBdListing(id: number): BdListing | null {
  return getDb().prepare('SELECT * FROM bd_listings WHERE id = ?').get(id) as BdListing | null;
}

export function deleteBdListing(id: number) {
  getDb().prepare('DELETE FROM bd_listings WHERE id = ?').run(id);
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  status: string;
  published_at: string | null;
  category: string;
  featured: number;
  created_at: string;
  updated_at: string;
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function savePost(data: { title: string; excerpt?: string; body?: string; image_url?: string; status?: string; category?: string; featured?: number }): number {
  const base = slugify(data.title);
  let slug = base;
  let n = 1;
  while (getDb().prepare('SELECT id FROM posts WHERE slug = ?').get(slug)) {
    slug = `${base}-${n++}`;
  }
  const result = getDb().prepare(`
    INSERT INTO posts (slug, title, excerpt, body, image_url, status, published_at, category, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug, data.title, data.excerpt ?? null, data.body ?? null,
    data.image_url ?? null, data.status ?? 'draft',
    data.status === 'published' ? new Date().toISOString() : null,
    data.category ?? 'general',
    data.featured ?? 0,
  );
  return result.lastInsertRowid as number;
}

export function updatePost(id: number, data: Partial<Post>) {
  const now = new Date().toISOString();
  const publishedAt = data.status === 'published'
    ? getDb().prepare('SELECT published_at FROM posts WHERE id = ?').get(id) as any
    : null;
  const entries = Object.entries(data).filter(([k]) => !['id','slug','created_at'].includes(k));
  if (!entries.length) return;
  const sql = entries.map(([k]) => `${k} = ?`).join(', ');
  const vals = entries.map(([, v]) => v);
  getDb().prepare(`UPDATE posts SET ${sql}, updated_at = ?, published_at = CASE WHEN status = 'published' AND published_at IS NULL THEN ? ELSE published_at END WHERE id = ?`).run(...vals, now, now, id);
}

export function getPosts(status?: string): Post[] {
  if (status) return getDb().prepare('SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC').all(status) as Post[];
  return getDb().prepare('SELECT * FROM posts ORDER BY created_at DESC').all() as Post[];
}

export function getPostsByCategory(category: string, limit = 10): Post[] {
  return getDb().prepare(
    `SELECT * FROM posts WHERE category = ? AND status = 'published' ORDER BY published_at DESC LIMIT ?`
  ).all(category, limit) as Post[];
}

export function getFeaturedPosts(limit = 3): Post[] {
  return getDb().prepare(
    `SELECT * FROM posts WHERE featured = 1 AND status = 'published' ORDER BY published_at DESC LIMIT ?`
  ).all(limit) as Post[];
}

export function getPost(id: number): Post | null {
  return getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | null;
}

export function getPostBySlug(slug: string): Post | null {
  return getDb().prepare('SELECT * FROM posts WHERE slug = ? AND status = ?').get(slug, 'published') as Post | null;
}

export function deletePost(id: number) {
  getDb().prepare('DELETE FROM posts WHERE id = ?').run(id);
}

export function getStats() {
  const db = getDb();
  const count = (sql: string) => (db.prepare(sql).get() as any).c;
  return {
    total: count('SELECT COUNT(*) as c FROM sellers'),
    new: count("SELECT COUNT(*) as c FROM sellers WHERE status = 'new'"),
    contacted: count("SELECT COUNT(*) as c FROM sellers WHERE status = 'contacted'"),
    replied: count("SELECT COUNT(*) as c FROM sellers WHERE status = 'replied'"),
    listed: count("SELECT COUNT(*) as c FROM sellers WHERE status = 'listed'"),
    declined: count("SELECT COUNT(*) as c FROM sellers WHERE status = 'declined'"),
  };
}
