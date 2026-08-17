import 'dotenv/config';
import fetch from 'node-fetch';

const token = process.env.EBAY_ACCESS_TOKEN;
console.log('Token present:', !!token);
console.log('Token preview:', token?.substring(0, 40) + '...');

const res = await fetch(
  'https://api.ebay.com/buy/browse/v1/item_summary/search?q=broken+iphone+spares+repairs&limit=3&filter=itemLocationCountry:GB',
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
      'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=GB',
      'Content-Type': 'application/json',
    },
  }
);

console.log('\nHTTP Status:', res.status, res.statusText);
const text = await res.text();
console.log('\nRaw response (first 800 chars):');
console.log(text.substring(0, 800));
