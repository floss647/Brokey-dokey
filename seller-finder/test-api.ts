import 'dotenv/config';
import fetch from 'node-fetch';

const token = process.env.EBAY_ACCESS_TOKEN;
console.log('Token present:', !!token);
console.log('Token starts with:', token?.substring(0, 30) + '...');

const res = await fetch(
  'https://api.ebay.com/buy/browse/v1/item_summary/search?q=broken+iphone&limit=3&filter=itemLocationCountry:GB',
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
      'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=GB',
    },
  }
);

console.log('\nHTTP Status:', res.status, res.statusText);
const data = await res.json() as any;
console.log('\nResponse:');
console.log(JSON.stringify(data, null, 2).substring(0, 1000));
