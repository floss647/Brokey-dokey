import 'dotenv/config';
import { crawlAllBrokenListings } from './ebay.js';
import { aggregateSellers } from './scorer.js';
import { upsertSeller, upsertListing } from './db.js';

console.log('BrokeyDokey Seller Finder — Starting crawl...\n');

const listings = await crawlAllBrokenListings();
console.log(`\nFound ${listings.length} total broken electronics listings`);

const sellers = aggregateSellers(listings);
console.log(`Found ${sellers.length} unique sellers\n`);

console.log('Saving to database...');
for (const seller of sellers) {
  upsertSeller({
    username: seller.username,
    feedback_score: seller.feedbackScore,
    feedback_percentage: seller.feedbackPercentage,
    broken_listing_count: seller.brokenListingCount,
    total_listing_value: seller.totalListingValue,
    categories: seller.categories,
    score: seller.score,
  });

  for (const listing of seller.listings) {
    upsertListing({
      item_id: listing.itemId,
      seller_username: listing.seller.username,
      title: listing.title,
      price: listing.price,
      category_id: listing.categoryId,
      category_name: listing.categoryName,
      url: listing.itemWebUrl,
      image: listing.image,
    });
  }
}

console.log('\nTop 20 sellers by score:');
console.log('─'.repeat(80));
for (const seller of sellers.slice(0, 20)) {
  console.log(
    `${String(seller.score).padStart(3)} | ${seller.username.padEnd(30)} | ${String(seller.brokenListingCount).padStart(3)} listings | FB: ${seller.feedbackScore} (${seller.feedbackPercentage}%) | ${seller.categories.join(', ')}`
  );
}

console.log('\nDone. Open the dashboard to review and contact sellers:');
console.log('  npm run dev\n');
