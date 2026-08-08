import 'dotenv/config';
import { crawlAllBrokenListings } from './scraper.js';
import { aggregateSellers } from './scorer.js';
import { saveSeller, saveListing } from './db.js';

console.log('BrokeyDokey Seller Finder — starting crawl\n');

const listings = await crawlAllBrokenListings();
console.log(`\nTotal listings found: ${listings.length}`);

const sellers = aggregateSellers(listings);
console.log(`Unique sellers: ${sellers.length}\n`);

for (const seller of sellers) {
  saveSeller(
    seller.username,
    seller.feedbackScore,
    seller.feedbackPercentage,
    seller.brokenListingCount,
    seller.totalListingValue,
    seller.categories,
    seller.score
  );
  for (const listing of seller.listings) {
    saveListing(listing);
  }
}

console.log('Top 20 sellers by score:');
console.log('─'.repeat(80));
for (const seller of sellers.slice(0, 20)) {
  console.log(
    `${String(seller.score).padStart(3)} | ${seller.username.padEnd(28)} | ${String(seller.brokenListingCount).padStart(3)} listings | FB: ${seller.feedbackScore} (${seller.feedbackPercentage}%) | ${seller.categories.join(', ')}`
  );
}

console.log('\nDone. Run `npm run server` to open the dashboard.\n');
