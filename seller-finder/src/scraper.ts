import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const BASE = 'https://www.ebay.co.uk';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
};

export interface EbayListing {
  itemId: string;
  title: string;
  price: number;
  seller: {
    username: string;
    feedbackScore: number;
    feedbackPercentage: number;
  };
  categoryName: string;
  itemWebUrl: string;
  image?: string;
}

const SEARCHES = [
  { query: 'broken iphone spares repairs', category: 'Phones' },
  { query: 'faulty samsung phone spares', category: 'Phones' },
  { query: 'broken laptop spares not working', category: 'Laptops' },
  { query: 'broken macbook spares repairs', category: 'Laptops' },
  { query: 'cracked ipad screen spares', category: 'Tablets' },
  { query: 'broken playstation 5 faulty', category: 'Consoles' },
  { query: 'broken nintendo switch spares', category: 'Consoles' },
  { query: 'faulty camera spares repairs', category: 'Cameras' },
  { query: 'water damaged phone spares', category: 'Phones' },
  { query: 'broken iphone water damage', category: 'Phones' },
  { query: 'broken tablet faulty', category: 'Tablets' },
  { query: 'broken xbox series spares', category: 'Consoles' },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parsePrice(text: string): number {
  const m = text.match(/[\d,]+\.?\d*/);
  return m ? parseFloat(m[0].replace(',', '')) : 0;
}

async function scrapeSearchPage(query: string, category: string, page = 1) {
  const params = new URLSearchParams({
    _nkw: query,
    LH_ItemCondition: '7000', // For Parts or Not Working
    _sop: '10', // Newest first
    _ipg: '120',
    LH_BIN: '1', // Buy It Now only
    _pgn: String(page),
  });

  const url = `${BASE}/sch/i.html?${params}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const items: Array<{
    itemId: string;
    title: string;
    price: number;
    seller?: { username: string; feedbackScore: number; feedbackPercentage: number };
    url: string;
    image?: string;
    category: string;
  }> = [];

  $('li.s-item').each((_, el) => {
    const $el = $(el);

    const title = $el.find('.s-item__title span[role="heading"],.s-item__title').first().text().trim();
    if (!title || title.toLowerCase().includes('shop on ebay')) return;

    const href = $el.find('a.s-item__link').attr('href') || '';
    const idMatch = href.match(/\/itm\/(\d+)/);
    if (!idMatch) return;
    const itemId = idMatch[1];

    const price = parsePrice($el.find('.s-item__price').first().text());
    if (price <= 0 || price > 5000) return;

    const image = $el.find('.s-item__image-img').attr('src') ||
      $el.find('.s-item__image-img').attr('data-src') || undefined;

    // Try to get seller from search results (present for BIN listings)
    let seller: { username: string; feedbackScore: number; feedbackPercentage: number } | undefined;
    const sellerEl = $el.find('.s-item__seller-info-text');
    if (sellerEl.length) {
      const txt = sellerEl.text().trim();
      // Format: "username (1234) 99.5%"
      const m = txt.match(/^([^\s(]+)\s+\((\d+)\)\s+([\d.]+)%/);
      if (m) {
        seller = {
          username: m[1],
          feedbackScore: parseInt(m[2]),
          feedbackPercentage: parseFloat(m[3]),
        };
      }
    }

    items.push({ itemId, title, price, seller, url: href, image, category });
  });

  return items;
}

async function fetchItemSeller(itemId: string) {
  try {
    const res = await fetch(`${BASE}/itm/${itemId}`, { headers: HEADERS });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Try multiple selectors for the seller info panel
    let username = '';
    let feedbackScore = 0;
    let feedbackPercentage = 0;

    // Modern eBay UK item page selectors
    const sellerCard = $('.x-sellercard-atf, [data-testid="x-sellercard-atf"]');
    if (sellerCard.length) {
      username = sellerCard.find('.x-sellercard-atf__short-feedback a, [data-testid="str-title-link"]').first().text().trim();
      const feedbackTxt = sellerCard.find('.x-sellercard-atf__short-feedback').text();
      const fm = feedbackTxt.match(/\((\d+)\)/);
      const pm = feedbackTxt.match(/([\d.]+)%/);
      if (fm) feedbackScore = parseInt(fm[1]);
      if (pm) feedbackPercentage = parseFloat(pm[1]);
    }

    // Fallback: look for seller name in page
    if (!username) {
      const aboutSeller = $('#about-seller, .str-seller-card').text();
      const um = aboutSeller.match(/([A-Za-z0-9_\-]+)\s+\((\d+)\)\s+([\d.]+)%/);
      if (um) {
        username = um[1];
        feedbackScore = parseInt(um[2]);
        feedbackPercentage = parseFloat(um[3]);
      }
    }

    if (!username) return null;
    return { username, feedbackScore, feedbackPercentage };
  } catch {
    return null;
  }
}

export async function crawlAllBrokenListings(): Promise<EbayListing[]> {
  const all: EbayListing[] = [];
  const seen = new Set<string>();
  const pendingSeller: Array<{
    itemId: string;
    title: string;
    price: number;
    url: string;
    image?: string;
    category: string;
  }> = [];

  for (const search of SEARCHES) {
    console.log(`  Searching "${search.query}"...`);
    try {
      const items = await scrapeSearchPage(search.query, search.category);
      let found = 0;
      let withSeller = 0;

      for (const item of items) {
        if (seen.has(item.itemId)) continue;
        seen.add(item.itemId);
        found++;

        if (item.seller) {
          withSeller++;
          all.push({
            itemId: item.itemId,
            title: item.title,
            price: item.price,
            seller: item.seller,
            categoryName: item.category,
            itemWebUrl: item.url,
            image: item.image,
          });
        } else {
          pendingSeller.push({
            itemId: item.itemId,
            title: item.title,
            price: item.price,
            url: item.url,
            image: item.image,
            category: item.category,
          });
        }
      }
      console.log(`    ${found} listings (${withSeller} with seller, ${found - withSeller} need fetch)`);
      await sleep(800 + Math.random() * 400);
    } catch (err) {
      console.warn(`  Failed: ${err}`);
      await sleep(2000);
    }
  }

  // Fetch seller info for up to 60 items missing it
  const toFetch = pendingSeller.slice(0, 60);
  if (toFetch.length > 0) {
    console.log(`\nFetching seller info for ${toFetch.length} items...`);
    for (let i = 0; i < toFetch.length; i++) {
      const item = toFetch[i];
      process.stdout.write(`  ${i + 1}/${toFetch.length} `);
      const seller = await fetchItemSeller(item.itemId);
      if (seller) {
        all.push({
          itemId: item.itemId,
          title: item.title,
          price: item.price,
          seller,
          categoryName: item.category,
          itemWebUrl: item.url,
          image: item.image,
        });
        process.stdout.write(`✓ ${seller.username}\n`);
      } else {
        process.stdout.write(`-\n`);
      }
      await sleep(600 + Math.random() * 400);
    }
  }

  return all;
}
