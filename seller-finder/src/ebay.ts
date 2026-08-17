import fetch from 'node-fetch';

const FINDING_API = 'https://svcs.ebay.com/services/search/FindingService/v1';

export interface EbayListing {
  itemId: string;
  title: string;
  price: number;
  seller: {
    username: string;
    feedbackScore: number;
    feedbackPercentage: number;
  };
  categoryId: string;
  categoryName: string;
  itemWebUrl: string;
  image?: string;
}

export const CATEGORIES = [
  { id: '9355', name: 'Mobile Phones' },
  { id: '175672', name: 'Tablets' },
  { id: '171485', name: 'Laptops' },
  { id: '1051', name: 'Cameras' },
  { id: '139971', name: 'Games Consoles' },
];

const SEARCH_QUERIES = ['spares repairs', 'broken', 'faulty', 'cracked screen', 'water damage'];

export async function searchBrokenListings(
  query: string,
  categoryId: string,
  page = 1
): Promise<{ items: EbayListing[]; total: number }> {
  const appId = process.env.EBAY_APP_ID;
  if (!appId) throw new Error('EBAY_APP_ID not set in .env');

  const params = new URLSearchParams({
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-VERSION': '1.13.0',
    'SECURITY-APPNAME': appId,
    'RESPONSE-DATA-FORMAT': 'JSON',
    'keywords': query,
    'categoryId': categoryId,
    'itemFilter(0).name': 'Condition',
    'itemFilter(0).value': '7000',
    'itemFilter(1).name': 'LocatedIn',
    'itemFilter(1).value': 'GB',
    'paginationInput.entriesPerPage': '100',
    'paginationInput.pageNumber': String(page),
    'outputSelector(0)': 'SellerInfo',
    'outputSelector(1)': 'GalleryInfo',
  });

  const res = await fetch(`${FINDING_API}?${params}`);
  const data = (await res.json()) as any;

  const response = data.findItemsByKeywordsResponse?.[0];
  const searchResult = response?.searchResult?.[0];
  const rawItems = searchResult?.item || [];
  const total = parseInt(response?.paginationOutput?.[0]?.totalEntries?.[0] || '0');

  const items: EbayListing[] = rawItems.map((item: any) => ({
    itemId: item.itemId?.[0] || '',
    title: item.title?.[0] || '',
    price: parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.['__value__'] || '0'),
    seller: {
      username: item.sellerInfo?.[0]?.sellerUserName?.[0] || '',
      feedbackScore: parseInt(item.sellerInfo?.[0]?.feedbackScore?.[0] || '0'),
      feedbackPercentage: parseFloat(item.sellerInfo?.[0]?.positiveFeedbackPercent?.[0] || '0'),
    },
    categoryId,
    categoryName: CATEGORIES.find((c) => c.id === categoryId)?.name || categoryId,
    itemWebUrl: item.viewItemURL?.[0] || '',
    image: item.galleryURL?.[0],
  }));

  return { items, total };
}

export async function crawlAllBrokenListings(): Promise<EbayListing[]> {
  const all: EbayListing[] = [];
  const seen = new Set<string>();

  for (const category of CATEGORIES) {
    for (const query of SEARCH_QUERIES) {
      console.log(`  Searching "${query}" in ${category.name}...`);
      try {
        const { items, total } = await searchBrokenListings(query, category.id, 1);
        for (const item of items) {
          if (!seen.has(item.itemId)) {
            seen.add(item.itemId);
            all.push(item);
          }
        }
        await new Promise((r) => setTimeout(r, 300));

        if (total > 100) {
          const { items: more } = await searchBrokenListings(query, category.id, 2);
          for (const item of more) {
            if (!seen.has(item.itemId)) {
              seen.add(item.itemId);
              all.push(item);
            }
          }
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch (err) {
        console.warn(`  Failed "${query}" in ${category.name}:`, err);
      }
    }
  }

  return all;
}
