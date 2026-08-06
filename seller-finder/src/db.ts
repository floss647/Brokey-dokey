import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'sellers.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
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
      category_id TEXT,
      category_name TEXT,
      url TEXT,
      image TEXT,
      scraped_at TEXT DEFAULT (datetime('now'))
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

export function upsertSeller(seller: {
  username: string;
  feedback_score: number;
  feedback_percentage: number;
  broken_listing_count: number;
  total_listing_value: number;
  categories: string[];
  score: number;
}) {
  const db = getDb();
  db.prepare(`
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
  `).run(
    seller.username,
    seller.feedback_score,
    seller.feedback_percentage,
    seller.broken_listing_count,
    seller.total_listing_value,
    JSON.stringify(seller.categories),
    seller.score
  );
}

export function upsertListing(listing: {
  item_id: string;
  seller_username: string;
  title: string;
  price: number;
  category_id: string;
  category_name: string;
  url: string;
  image?: string;
}) {
  const db = getDb();
  db.prepare(`
    INSERT OR IGNORE INTO listings (item_id, seller_username, title, price, category_id, category_name, url, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    listing.item_id,
    listing.seller_username,
    listing.title,
    listing.price,
    listing.category_id,
    listing.category_name,
    listing.url,
    listing.image || null
  );
}

export function getSellers(status?: string): Seller[] {
  const db = getDb();
  if (status) {
    return db.prepare('SELECT * FROM sellers WHERE status = ? ORDER BY score DESC').all(status) as Seller[];
  }
  return db.prepare('SELECT * FROM sellers ORDER BY score DESC').all() as Seller[];
}

export function getSeller(username: string): Seller | null {
  const db = getDb();
  return db.prepare('SELECT * FROM sellers WHERE username = ?').get(username) as Seller | null;
}

export function getSellerListings(username: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM listings WHERE seller_username = ? ORDER BY price DESC LIMIT 10').all(username);
}

export function updateSellerStatus(username: string, status: string) {
  const db = getDb();
  db.prepare(`
    UPDATE sellers SET status = ?, contacted_at = CASE WHEN ? = 'contacted' THEN datetime('now') ELSE contacted_at END, updated_at = datetime('now')
    WHERE username = ?
  `).run(status, status, username);
}

export function updateSellerContact(username: string, fields: {
  email?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  notes?: string;
}) {
  const db = getDb();
  const updates = Object.entries(fields)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => `${k} = ?`)
    .join(', ');
  const values = Object.values(fields).filter((v) => v !== undefined);
  if (!updates) return;
  db.prepare(`UPDATE sellers SET ${updates}, updated_at = datetime('now') WHERE username = ?`).run(...values, username);
}

export function saveOutreach(username: string, channel: string, message: string) {
  const db = getDb();
  db.prepare(`
    INSERT INTO outreach (seller_username, channel, message) VALUES (?, ?, ?)
  `).run(username, channel, message);
}

export function markOutreachSent(username: string) {
  const db = getDb();
  db.prepare(`
    UPDATE outreach SET status = 'sent', sent_at = datetime('now') WHERE seller_username = ? AND status = 'draft'
  `).run(username);
}

export function getStats() {
  const db = getDb();
  return {
    total: (db.prepare('SELECT COUNT(*) as c FROM sellers').get() as any).c,
    new: (db.prepare("SELECT COUNT(*) as c FROM sellers WHERE status = 'new'").get() as any).c,
    contacted: (db.prepare("SELECT COUNT(*) as c FROM sellers WHERE status = 'contacted'").get() as any).c,
    replied: (db.prepare("SELECT COUNT(*) as c FROM sellers WHERE status = 'replied'").get() as any).c,
    listed: (db.prepare("SELECT COUNT(*) as c FROM sellers WHERE status = 'listed'").get() as any).c,
    declined: (db.prepare("SELECT COUNT(*) as c FROM sellers WHERE status = 'declined'").get() as any).c,
  };
}
