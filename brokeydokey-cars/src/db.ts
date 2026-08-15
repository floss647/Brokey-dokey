import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'content.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      excerpt     TEXT,
      body        TEXT,
      image_url   TEXT,
      status      TEXT DEFAULT 'draft',
      category    TEXT DEFAULT 'general',
      featured    INTEGER DEFAULT 0,
      published_at TEXT,
      created_at  TEXT DEFAULT (datetime('now')),
      updated_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS listings (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      description  TEXT,
      price        REAL,
      status       TEXT DEFAULT 'draft',
      source_url   TEXT,
      images       TEXT DEFAULT '[]',
      location     TEXT,
      postcode     TEXT,
      make         TEXT,
      model        TEXT,
      year         INTEGER,
      mileage      INTEGER,
      fuel_type    TEXT,
      engine_size  TEXT,
      colour       TEXT,
      transmission TEXT,
      body_type    TEXT,
      doors        INTEGER,
      mot_expiry   TEXT,
      created_at   TEXT DEFAULT (datetime('now')),
      updated_at   TEXT DEFAULT (datetime('now'))
    );
  `);
  return _db;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  status: string;
  category: string;
  featured: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
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

// ── Posts ─────────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function savePost(data: {
  title: string; excerpt?: string; body?: string; image_url?: string;
  status?: string; category?: string; featured?: number;
}): number {
  const base = slugify(data.title);
  let slug = base;
  let n = 1;
  while (getDb().prepare('SELECT id FROM posts WHERE slug = ?').get(slug)) slug = `${base}-${n++}`;

  const result = getDb().prepare(`
    INSERT INTO posts (slug, title, excerpt, body, image_url, status, category, featured, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug, data.title, data.excerpt ?? null, data.body ?? null, data.image_url ?? null,
    data.status ?? 'draft', data.category ?? 'general', data.featured ?? 0,
    data.status === 'published' ? new Date().toISOString() : null,
  );
  return result.lastInsertRowid as number;
}

export function updatePost(id: number, data: Partial<Post>): void {
  const now = new Date().toISOString();
  const entries = Object.entries(data).filter(([k]) => !['id', 'slug', 'created_at'].includes(k));
  if (!entries.length) return;
  const sql = entries.map(([k]) => `${k} = ?`).join(', ');
  const vals = entries.map(([, v]) => v);
  getDb().prepare(
    `UPDATE posts SET ${sql}, updated_at = ?,
     published_at = CASE WHEN status = 'published' AND published_at IS NULL THEN ? ELSE published_at END
     WHERE id = ?`
  ).run(...vals, now, now, id);
}

export function getPosts(status?: string): Post[] {
  if (status) return getDb().prepare('SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC').all(status) as Post[];
  return getDb().prepare('SELECT * FROM posts ORDER BY created_at DESC').all() as Post[];
}

export function getPost(id: number): Post | null {
  return getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | null;
}

export function getPostBySlug(slug: string): Post | null {
  return getDb().prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").get(slug) as Post | null;
}

export function getPostsByCategory(category: string, limit = 10): Post[] {
  return getDb().prepare(
    "SELECT * FROM posts WHERE category = ? AND status = 'published' ORDER BY published_at DESC LIMIT ?"
  ).all(category, limit) as Post[];
}

export function getFeaturedPosts(limit = 3): Post[] {
  return getDb().prepare(
    "SELECT * FROM posts WHERE featured = 1 AND status = 'published' ORDER BY published_at DESC LIMIT ?"
  ).all(limit) as Post[];
}

export function deletePost(id: number): void {
  getDb().prepare('DELETE FROM posts WHERE id = ?').run(id);
}

// ── Listings ──────────────────────────────────────────────────────────────────

export function saveListing(data: Partial<Listing> & { title: string }): number {
  const result = getDb().prepare(`
    INSERT INTO listings
      (title, description, price, status, source_url, images, location, postcode,
       make, model, year, mileage, fuel_type, engine_size, colour, transmission, body_type, doors, mot_expiry)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    data.title, data.description ?? null, data.price ?? null,
    data.status ?? 'draft', data.source_url ?? null, data.images ?? '[]',
    data.location ?? null, data.postcode ?? null,
    data.make ?? null, data.model ?? null, data.year ?? null, data.mileage ?? null,
    data.fuel_type ?? null, data.engine_size ?? null, data.colour ?? null,
    data.transmission ?? null, data.body_type ?? null, data.doors ?? null, data.mot_expiry ?? null,
  );
  return result.lastInsertRowid as number;
}

export function updateListing(id: number, data: Partial<Listing>): void {
  const fields = Object.entries(data).filter(([k]) => k !== 'id' && k !== 'created_at').map(([k]) => `${k} = ?`).join(', ');
  const vals = Object.entries(data).filter(([k]) => k !== 'id' && k !== 'created_at').map(([, v]) => v);
  if (!fields) return;
  getDb().prepare(`UPDATE listings SET ${fields}, updated_at = datetime('now') WHERE id = ?`).run(...vals, id);
}

export function getListings(status?: string): Listing[] {
  if (status) return getDb().prepare('SELECT * FROM listings WHERE status = ? ORDER BY created_at DESC').all(status) as Listing[];
  return getDb().prepare('SELECT * FROM listings ORDER BY created_at DESC').all() as Listing[];
}

export function getListing(id: number): Listing | null {
  return getDb().prepare('SELECT * FROM listings WHERE id = ?').get(id) as Listing | null;
}

export function deleteListing(id: number): void {
  getDb().prepare('DELETE FROM listings WHERE id = ?').run(id);
}
