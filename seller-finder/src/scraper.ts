import * as cheerio from 'cheerio';
import { chromium, type Browser, type Page } from 'playwright';
import { writeFileSync } from 'fs';

const BASE = 'https://www.ebay.co.uk';

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

// Add or remove verticals here — each line is one search pass
const SEARCHES = [
  // ── Phones ──────────────────────────────────────────
  { query: 'broken iphone spares repairs', category: 'Phones' },
  { query: 'faulty samsung phone spares repairs', category: 'Phones' },
  { query: 'water damaged phone spares', category: 'Phones' },

  // ── Laptops & Computers ─────────────────────────────
  { query: 'broken laptop spares not working', category: 'Laptops' },
  { query: 'broken macbook spares repairs', category: 'Laptops' },
  { query: 'faulty desktop pc spares', category: 'Computers' },

  // ── Tablets ─────────────────────────────────────────
  { query: 'cracked ipad faulty spares', category: 'Tablets' },
  { query: 'broken android tablet spares', category: 'Tablets' },

  // ── Games Consoles ──────────────────────────────────
  { query: 'broken playstation 5 faulty spares', category: 'Consoles' },
  { query: 'broken nintendo switch spares', category: 'Consoles' },
  { query: 'broken xbox series faulty', category: 'Consoles' },

  // ── Cameras ─────────────────────────────────────────
  { query: 'broken dslr camera spares repairs', category: 'Cameras' },
  { query: 'faulty mirrorless camera spares', category: 'Cameras' },

  // ── White Goods ─────────────────────────────────────
  { query: 'broken washing machine spares repairs', category: 'White Goods' },
  { query: 'faulty dishwasher spares not working', category: 'White Goods' },
  { query: 'broken fridge freezer spares', category: 'White Goods' },
  { query: 'faulty tumble dryer spares', category: 'White Goods' },
  { query: 'broken oven cooker spares', category: 'White Goods' },

  // ── Power Tools ─────────────────────────────────────
  { query: 'broken power tools spares repairs', category: 'Power Tools' },
  { query: 'faulty cordless drill spares', category: 'Power Tools' },

  // ── Garden & Outdoor ────────────────────────────────
  { query: 'broken lawnmower spares not working', category: 'Garden' },
  { query: 'faulty garden machinery spares', category: 'Garden' },

  // ── E-bikes & Scooters ──────────────────────────────
  { query: 'broken electric bike faulty spares', category: 'E-bikes' },
  { query: 'faulty electric scooter spares', category: 'E-bikes' },

  // ── Musical Instruments ─────────────────────────────
  { query: 'broken guitar amp spares repairs', category: 'Music' },
  { query: 'faulty keyboard synthesizer spares', category: 'Music' },

  // ── Cars ────────────────────────────────────────────
  { query: 'non runner car spares repairs', category: 'Cars' },
  { query: 'salvage car spares not running', category: 'Cars' },
  { query: 'non runner van spares repairs', category: 'Cars' },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parsePrice(text: string): number {
  const m = text.match(/[\d,]+\.?\d*/);
  return m ? parseFloat(m[0].replace(',', '')) : 0;
}

function parseSearchHtml(html: string, category: string) {
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
    if (price <= 0 || price > 8000) return;

    const image = $el.find('.s-item__image-img').attr('src') ||
      $el.find('.s-item__image-img').attr('data-src') || undefined;

    let seller: { username: string; feedbackScore: number; feedbackPercentage: number } | undefined;
    const sellerEl = $el.find('.s-item__seller-info-text');
    if (sellerEl.length) {
      const txt = sellerEl.text().trim();
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

function parseItemHtml(html: string) {
  const $ = cheerio.load(html);
  let username = '';
  let feedbackScore = 0;
  let feedbackPercentage = 0;

  const sellerCard = $('.x-sellercard-atf, [data-testid="x-sellercard-atf"]');
  if (sellerCard.length) {
    username = sellerCard.find('.x-sellercard-atf__short-feedback a, [data-testid="str-title-link"]').first().text().trim();
    const feedbackTxt = sellerCard.find('.x-sellercard-atf__short-feedback').text();
    const fm = feedbackTxt.match(/\((\d+)\)/);
    const pm = feedbackTxt.match(/([\d.]+)%/);
    if (fm) feedbackScore = parseInt(fm[1]);
    if (pm) feedbackPercentage = parseFloat(pm[1]);
  }

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
}

async function getPage(page: Page, url: string, waitFor?: string): Promise<string> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (waitFor) {
    try {
      await page.waitForSelector(waitFor, { timeout: 8000 });
    } catch {
      // element didn't appear — page may have no results
    }
  }
  await sleep(800 + Math.random() * 400);
  return page.content();
}

export async function crawlAllBrokenListings(): Promise<EbayListing[]> {
  console.log('Launching browser...');
  const browser: Browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-GB',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    extraHTTPHeaders: {
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });

  // Remove the webdriver flag that eBay/Cloudflare uses to detect bots
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    // @ts-ignore
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
    // @ts-ignore
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
    // @ts-ignore
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
  });

  const page = await context.newPage();

  // Visit eBay homepage and accept cookie consent
  await page.goto('https://www.ebay.co.uk', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const homeTitle = await page.title();
  console.log(`  Homepage title: "${homeTitle}"`);

  // Save screenshot + HTML for debugging
  try {
    await page.screenshot({ path: '/tmp/ebay-home.png', fullPage: false });
    writeFileSync('/tmp/ebay-home-debug.html', await page.content());
    console.log(`  Debug snapshot: /tmp/ebay-home.png + /tmp/ebay-home-debug.html`);
  } catch { /* ignore */ }

  // Accept GDPR consent — try main frame first
  let consentClicked = false;
  for (const attempt of [
    () => page.getByRole('button', { name: /accept all/i }).first().click(),
    () => page.$eval('[data-tracking="button-ACCEPT_ALL"]', (el: HTMLElement) => el.click()),
    () => page.$eval('#gdpr-banner-accept, .gdpr-banner__accept', (el: HTMLElement) => el.click()),
    () => page.$eval('button[class*="accept" i]', (el: HTMLElement) => el.click()),
  ]) {
    if (consentClicked) break;
    try {
      await attempt();
      consentClicked = true;
      console.log('  Accepted cookie consent (main frame)');
      await sleep(1500);
    } catch { /* try next */ }
  }

  // Try consent inside iframes (Sourcepoint CMP common on eBay UK)
  if (!consentClicked) {
    try {
      await page.waitForSelector('iframe', { timeout: 3000 });
      for (const frame of page.frames()) {
        if (consentClicked) break;
        const url = frame.url();
        if (!url || url === 'about:blank') continue;
        try {
          const buttons = await frame.$$('button');
          for (const btn of buttons) {
            const text = (await btn.innerText().catch(() => '')).trim();
            if (/^accept/i.test(text)) {
              await btn.click();
              consentClicked = true;
              console.log(`  Accepted cookie consent (iframe ${url.slice(0, 50)})`);
              await sleep(1500);
              break;
            }
          }
        } catch { /* skip frame */ }
      }
    } catch { /* no iframes */ }
  }

  if (!consentClicked) {
    console.log('  No consent banner found — proceeding (may already have cookies)');
  }

  const all: EbayListing[] = [];
  const seen = new Set<string>();
  const pendingSeller: Array<{
    itemId: string; title: string; price: number;
    url: string; image?: string; category: string;
  }> = [];

  for (const search of SEARCHES) {
    console.log(`  Searching "${search.query}"...`);
    try {
      const params = new URLSearchParams({
        _nkw: search.query,
        LH_ItemCondition: '7000',
        _sop: '10',
        _ipg: '120',
      });
      const html = await getPage(page, `${BASE}/sch/i.html?${params}`, 'li.s-item');
      const rawCount = (html.match(/class="s-item/g) || []).length;
      if (rawCount === 0) {
        console.warn(`    [debug] No s-item elements — page title: "${await page.title()}"`);
        try { writeFileSync('/tmp/ebay-search-debug.html', html); } catch { /* ignore */ }
        console.warn(`    [debug] Search HTML saved to /tmp/ebay-search-debug.html`);
      }
      const items = parseSearchHtml(html, search.category);

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
            itemId: item.itemId, title: item.title, price: item.price,
            url: item.url, image: item.image, category: item.category,
          });
        }
      }
      console.log(`    ${found} listings (${withSeller} with seller, ${found - withSeller} need fetch)`);
      await sleep(1200 + Math.random() * 600);
    } catch (err) {
      console.warn(`  Failed: ${err}`);
      await sleep(3000);
    }
  }

  // Fetch seller info for items missing it
  const toFetch = pendingSeller.slice(0, 60);
  if (toFetch.length > 0) {
    console.log(`\nFetching seller info for ${toFetch.length} items...`);
    for (let i = 0; i < toFetch.length; i++) {
      const item = toFetch[i];
      process.stdout.write(`  ${i + 1}/${toFetch.length} `);
      try {
        const html = await getPage(page, `${BASE}/itm/${item.itemId}`);
        const seller = parseItemHtml(html);
        if (seller) {
          all.push({
            itemId: item.itemId, title: item.title, price: item.price,
            seller, categoryName: item.category, itemWebUrl: item.url, image: item.image,
          });
          process.stdout.write(`✓ ${seller.username}\n`);
        } else {
          process.stdout.write(`-\n`);
        }
      } catch {
        process.stdout.write(`-\n`);
      }
      await sleep(800 + Math.random() * 400);
    }
  }

  await browser.close();
  return all;
}
