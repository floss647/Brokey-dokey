import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { existsSync } from 'fs';

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.5',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  });
  return res.text();
}

export interface ImportedListing {
  title: string;
  description: string;
  price: number | null;
  images: string[];
  location: string;
  postcode: string;
  sourceUrl: string;
  make: string;
  model: string;
  year: number | null;
  mileage: number | null;
  fuelType: string;
  engineSize: string;
  colour: string;
  transmission: string;
  bodyType: string;
  doors: number | null;
  motExpiry: string;
}

function detectSite(url: string): 'autotrader' | 'ebay' | 'gumtree' | 'unknown' {
  if (url.includes('autotrader.co.uk')) return 'autotrader';
  if (url.includes('ebay.co.uk') || url.includes('ebay.com')) return 'ebay';
  if (url.includes('gumtree.com')) return 'gumtree';
  return 'unknown';
}

function clean(s: unknown): string {
  return String(s || '').trim();
}

function parseNum(s: unknown): number | null {
  const m = String(s || '').replace(/,/g, '').match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

function parseYear(s: unknown): number | null {
  const m = String(s || '').match(/\b(19|20)\d{2}\b/);
  return m ? parseInt(m[0]) : null;
}

function parseMileage(s: unknown): number | null {
  const m = String(s || '').replace(/,/g, '').match(/[\d]+/);
  return m ? parseInt(m[0]) : null;
}

function parsePostcode(s: string): string {
  const m = s.match(/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/i);
  return m ? m[0].toUpperCase() : '';
}

// ── AutoTrader ────────────────────────────────────────────────────────────────

function scrapeAutoTraderHtml(html: string, url: string): ImportedListing {
  const $ = cheerio.load(html);

  const ogTitle = clean($('meta[property="og:title"]').attr('content') ?? '');
  const ogDesc = clean($('meta[property="og:description"], meta[name="description"]').first().attr('content') ?? '');
  const ogImage = clean($('meta[property="og:image"]').attr('content') ?? '');

  let jsonLd: any = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    if (jsonLd) return;
    try { jsonLd = JSON.parse($(el).text()); } catch { /* skip */ }
  });
  const ldPrice = jsonLd?.offers?.price ?? jsonLd?.price ?? null;
  const ldDesc = clean(jsonLd?.description ?? '');

  let nextData: any = null;
  try {
    const raw = $('#__NEXT_DATA__').text();
    if (raw) nextData = JSON.parse(raw);
  } catch { /* skip */ }

  const pp = nextData?.props?.pageProps ?? {};
  const advert: any = pp.advert ?? pp.vehicle ?? pp.car ?? pp.listing
    ?? pp.initialState?.advert ?? pp.initialState?.vehicle ?? null;

  console.log('[import-url] advert keys:', advert ? Object.keys(advert).slice(0, 20) : 'null');
  console.log('[import-url] ogTitle:', ogTitle.slice(0, 60));

  let title = clean(advert?.title ?? advert?.heading ?? advert?.name ?? '');
  if (!title) title = ogTitle || clean($('h1').first().text());

  let price: number | null = null;
  if (advert?.price) price = parseNum(advert.price);
  if (!price) price = parseNum(advert?.priceGBP ?? advert?.advertisedPrice ?? '');
  if (!price && ldPrice) price = parseNum(ldPrice);
  if (!price) price = parseNum($('[data-testid="hero-price"], [data-testid*="price"], .hero-price, [class*="price"]').first().text());

  let description = clean(
    advert?.description ?? advert?.sellerComments ?? advert?.sellerDescription ??
    advert?.fullDescription ?? advert?.advertDescription ?? ''
  );
  if (!description) {
    const KEYS = ['description', 'sellercomments', 'sellerdescription', 'sellertext', 'advertdescription', 'comments'];
    const findByKey = (obj: any, depth = 0): string => {
      if (depth > 10 || !obj || typeof obj !== 'object') return '';
      for (const [k, v] of Object.entries(obj)) {
        if (KEYS.includes(k.toLowerCase()) && typeof v === 'string' && v.length > 20) return v;
        const found = findByKey(v, depth + 1);
        if (found) return found;
      }
      return '';
    };
    description = clean(findByKey(nextData));
  }
  if (!description) description = ogDesc || ldDesc;
  if (!description) {
    description = clean(
      $('[data-testid="advert-description"], [data-testid*="description"], .seller-comments, .advert-description, [class*="description"]')
        .first().text()
    );
  }

  console.log('[import-url] title:', title.slice(0, 60), '| price:', price, '| desc chars:', description.length);

  let images: string[] = [];
  if (advert?.imageUrls?.length) images = advert.imageUrls;
  else if (advert?.images?.length) images = advert.images.map((i: any) => i.url ?? i.src ?? i);
  if (!images.length) {
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? $(el).attr('data-src') ?? '';
      if (src && !src.includes('icon') && !src.includes('logo') && src.startsWith('http')) images.push(src);
    });
    images = images.slice(0, 10);
  }
  if (!images.length && ogImage) images = [ogImage];

  let location = clean(
    advert?.location?.town ?? advert?.location?.postTown ?? advert?.location?.county ??
    advert?.dealerProfile?.location?.town ?? advert?.dealerAddress?.town ??
    advert?.dealerAddress?.postcode ?? ''
  );
  if (!location || /miles?\s+away/i.test(location)) {
    const locEl = $('[data-testid="seller-location"], [data-testid*="location"]').first().text();
    const cleaned = locEl.replace(/\d+(\.\d+)?\s*miles?\s*(away)?/gi, '').trim();
    if (cleaned) location = cleaned;
  }
  location = location.replace(/\d+(\.\d+)?\s*miles?\s*(away)?/gi, '').trim();

  const postcode = parsePostcode(location || html.slice(0, 50000));

  const specs: Record<string, string> = {};
  if (advert?.keyFacts) {
    for (const [k, v] of Object.entries(advert.keyFacts)) specs[k.toLowerCase()] = clean(v);
  }
  $('[data-testid*="key-fact"], [data-testid*="spec"], li, .key-facts li, .specs li').each((_, el) => {
    const text = $(el).text().trim();
    const kv = text.split(/:\s*/);
    if (kv.length === 2) specs[kv[0].toLowerCase().trim()] = kv[1].trim();
  });

  const make = clean(advert?.make ?? specs['make'] ?? '');
  const model = clean(advert?.model ?? specs['model'] ?? '');
  const year = parseYear(advert?.year ?? specs['year'] ?? advert?.derivative ?? title);
  const mileage = parseMileage(advert?.mileage ?? specs['mileage'] ?? specs['miles'] ?? '');
  const fuelType = clean(advert?.fuelType ?? specs['fuel type'] ?? specs['fuel'] ?? '');
  const engineSize = clean(advert?.engineSize ?? specs['engine size'] ?? specs['engine'] ?? '');
  const colour = clean(advert?.colour ?? advert?.color ?? specs['colour'] ?? specs['color'] ?? '');
  const transmission = clean(advert?.transmission ?? specs['transmission'] ?? specs['gearbox'] ?? '');
  const bodyType = clean(advert?.bodyType ?? specs['body type'] ?? specs['body style'] ?? '');
  const doors = parseNum(advert?.doors ?? specs['doors'] ?? '');
  const motExpiry = clean(advert?.motExpiry ?? advert?.mot ?? specs['mot'] ?? specs['mot expiry'] ?? '');

  return {
    title: title || 'Untitled listing',
    description, price, images, location, postcode, sourceUrl: url,
    make, model, year, mileage, fuelType, engineSize, colour, transmission, bodyType,
    doors: doors ? Math.round(doors) : null, motExpiry,
  };
}

// ── eBay item page ────────────────────────────────────────────────────────────

function scrapeEbayHtml(html: string, url: string): ImportedListing {
  const $ = cheerio.load(html);

  const title = clean($('h1.x-item-title__mainTitle, h1').first().text());
  const price = parseNum($('.x-price-primary, [data-testid="x-price-primary"]').first().text());
  const description = clean($('#desc_div, .item-desc, [data-testid="DESCRIPTION"]').first().text().slice(0, 2000));
  const location = clean($('.ux-seller-section__item--seller span, [data-testid="ux-seller-section"] .ux-textspans').first().text());

  const images: string[] = [];
  $('img.ux-image-carousel-item, .ux-image-magnify img').each((_, el) => {
    const src = $(el).attr('src') ?? '';
    if (src.startsWith('http')) images.push(src);
  });

  return {
    title: title || 'Untitled eBay listing',
    description, price, images: images.slice(0, 10), location,
    postcode: parsePostcode(location), sourceUrl: url,
    make: '', model: '', year: null, mileage: null,
    fuelType: '', engineSize: '', colour: '', transmission: '', bodyType: '', doors: null, motExpiry: '',
  };
}

// ── Gumtree ───────────────────────────────────────────────────────────────────

function scrapeGumtreeHtml(html: string, url: string): ImportedListing {
  const $ = cheerio.load(html);

  const title = clean($('h1').first().text());
  const price = parseNum($('.ad-price, [class*="price"]').first().text());
  const description = clean($('.ad-description, [itemprop="description"]').first().text().slice(0, 2000));
  const location = clean($('.ad-location, [class*="location"]').first().text());

  const images: string[] = [];
  $('[class*="gallery"] img, [class*="carousel"] img').each((_, el) => {
    const src = $(el).attr('src') ?? $(el).attr('data-src') ?? '';
    if (src.startsWith('http') && !src.includes('placeholder')) images.push(src);
  });

  return {
    title: title || 'Untitled Gumtree listing',
    description, price, images: images.slice(0, 10), location,
    postcode: parsePostcode(location), sourceUrl: url,
    make: '', model: '', year: parseYear(title + ' ' + description), mileage: parseMileage(description),
    fuelType: '', engineSize: '', colour: '', transmission: '', bodyType: '', doors: null, motExpiry: '',
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

async function playwrightFetch(url: string): Promise<string> {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH
    || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-GB',
    viewport: { width: 1280, height: 800 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    for (const sel of ['button[id*="accept" i]', 'button[class*="accept" i]', '[data-testid*="accept" i]']) {
      try {
        const btn = await page.$(sel);
        if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 800)); break; }
      } catch { /* skip */ }
    }
    return await page.content();
  } finally {
    await browser.close();
  }
}

export async function importFromUrl(url: string): Promise<ImportedListing> {
  const site = detectSite(url);

  if (site === 'autotrader') {
    // Plain fetch avoids Playwright bot detection on AutoTrader
    const html = await fetchHtml(url);
    return scrapeAutoTraderHtml(html, url);
  }

  // eBay and Gumtree need JS rendering for full content
  const html = await playwrightFetch(url);

  switch (site) {
    case 'ebay':    return scrapeEbayHtml(html, url);
    case 'gumtree': return scrapeGumtreeHtml(html, url);
    default: {
      const $ = cheerio.load(html);
      return {
        title: clean($('h1').first().text()) || 'Imported listing',
        description: clean($('main, article, [class*="description"]').first().text().slice(0, 2000)),
        price: null, images: [], location: '', postcode: '', sourceUrl: url,
        make: '', model: '', year: null, mileage: null,
        fuelType: '', engineSize: '', colour: '', transmission: '', bodyType: '', doors: null, motExpiry: '',
      };
    }
  }
}
