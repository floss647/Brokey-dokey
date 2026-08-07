import 'dotenv/config';
import fetch from 'node-fetch';

const appId = process.env.EBAY_APP_ID;
console.log('App ID present:', !!appId);
console.log('App ID:', appId);

const params = new URLSearchParams({
  'OPERATION-NAME': 'findItemsByKeywords',
  'SERVICE-VERSION': '1.13.0',
  'SECURITY-APPNAME': appId || '',
  'RESPONSE-DATA-FORMAT': 'JSON',
  'keywords': 'broken iphone spares repairs',
  'categoryId': '9355',
  'itemFilter(0).name': 'Condition',
  'itemFilter(0).value': '7000',
  'itemFilter(1).name': 'LocatedIn',
  'itemFilter(1).value': 'GB',
  'paginationInput.entriesPerPage': '3',
  'outputSelector(0)': 'SellerInfo',
});

const res = await fetch(`https://svcs.ebay.com/services/search/FindingService/v1?${params}`);
console.log('\nHTTP Status:', res.status);
const data = await res.json() as any;
const response = data.findItemsByKeywordsResponse?.[0];
console.log('Total results:', response?.paginationOutput?.[0]?.totalEntries?.[0]);
console.log('Items found:', response?.searchResult?.[0]?.['@count']);
const items = response?.searchResult?.[0]?.item || [];
if (items.length > 0) {
  const first = items[0];
  console.log('\nFirst item:');
  console.log('  Title:', first.title?.[0]);
  console.log('  Seller:', first.sellerInfo?.[0]?.sellerUserName?.[0]);
  console.log('  Price: £', first.sellingStatus?.[0]?.currentPrice?.[0]?.['__value__']);
} else {
  console.log('\nFull response:', JSON.stringify(data, null, 2).substring(0, 800));
}
