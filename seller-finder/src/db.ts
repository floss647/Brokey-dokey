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
