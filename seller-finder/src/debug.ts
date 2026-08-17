import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

console.log('Opening browser...');
const browser = await chromium.launch({
  headless: false, // headless: false so you can see it
  args: ['--disable-blink-features=AutomationControlled'],
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

console.log('Visiting eBay homepage...');
await page.goto('https://www.ebay.co.uk', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 3000));

const homeTitle = await page.title();
console.log('Homepage title:', homeTitle);

// List all frames (useful for finding consent iframe)
const frames = page.frames();
console.log('Frames on homepage:');
frames.forEach(f => console.log(' ', f.url().slice(0, 100)));

// Take a screenshot right after homepage loads (before any interaction)
await page.screenshot({ path: '/tmp/ebay-home.png', fullPage: false });
console.log('Homepage screenshot: /tmp/ebay-home.png');

console.log('\nSearching...');
await page.goto(
  'https://www.ebay.co.uk/sch/i.html?_nkw=broken+iphone+spares+repairs&LH_ItemCondition=7000&_sop=10&_ipg=20',
  { waitUntil: 'domcontentloaded', timeout: 30000 }
);
try { await page.waitForSelector('li.s-item', { timeout: 8000 }); } catch { /* ok */ }
await new Promise(r => setTimeout(r, 3000));

const html = await page.content();
writeFileSync('/tmp/ebay-debug.html', html);
console.log(`\nHTML saved to /tmp/ebay-debug.html (${html.length} bytes)`);

const counts = {
  's-item': (html.match(/class="s-item/g) || []).length,
  'srp-results': (html.match(/srp-results/g) || []).length,
  'listingsList': (html.match(/listingsList/g) || []).length,
  'item-title': (html.match(/item-title/g) || []).length,
};
console.log('\nElement counts in HTML:');
Object.entries(counts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// Print page title at search
console.log('\nSearch page title:', await page.title());

// Print first 600 chars of body
const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,600})/);
if (bodyMatch) console.log('\nFirst 600 chars of body:\n', bodyMatch[1]);

await page.screenshot({ path: '/tmp/ebay-search.png', fullPage: false });
console.log('\nSearch screenshot: /tmp/ebay-search.png');

await browser.close();
console.log('\nDone. Open /tmp/ebay-home.png and /tmp/ebay-search.png to see what eBay showed.');
