import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

console.log('Opening browser...');
const browser = await chromium.launch({ headless: false }); // headless: false so you can see it
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  locale: 'en-GB',
});
const page = await context.newPage();

console.log('Visiting eBay...');
await page.goto('https://www.ebay.co.uk', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 2000));

console.log('Searching...');
await page.goto(
  'https://www.ebay.co.uk/sch/i.html?_nkw=broken+iphone+spares+repairs&LH_ItemCondition=7000&_sop=10&_ipg=20',
  { waitUntil: 'networkidle', timeout: 30000 }
);
await new Promise(r => setTimeout(r, 3000));

const html = await page.content();
writeFileSync('/tmp/ebay-debug.html', html);
console.log(`\nHTML saved to /tmp/ebay-debug.html (${html.length} bytes)`);

// Count elements
const counts = {
  's-item': (html.match(/class="s-item/g) || []).length,
  'srp-results': (html.match(/srp-results/g) || []).length,
  'listingsList': (html.match(/listingsList/g) || []).length,
  'item-title': (html.match(/item-title/g) || []).length,
  'itemtitle': (html.match(/itemtitle/g) || []).length,
};
console.log('\nElement counts in HTML:');
Object.entries(counts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// Print first 500 chars of body
const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,500})/);
if (bodyMatch) console.log('\nFirst 500 chars of body:\n', bodyMatch[1]);

// Also take a screenshot
await page.screenshot({ path: '/tmp/ebay-debug.png', fullPage: false });
console.log('\nScreenshot saved to /tmp/ebay-debug.png');

await browser.close();
console.log('\nDone.');
