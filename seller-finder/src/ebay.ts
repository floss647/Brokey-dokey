import fetch from 'node-fetch';

const AUTH_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const BROWSE_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

let tokenCache: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  // If a pre-generated token is provided in .env, use it directly
  if (process.env.EBAY_ACCESS_TOKEN) {
    return process.env.EBAY_ACCESS_TOKEN;
  }

  if (tokenCache && Date.now() < tokenCache.expires) return tokenCache.token;

  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });

  const data = (await res.json()) as any;
  if (!data.access_token) throw new Error(`eBay auth failed: ${JSON.stringify(data)}`);

  tokenCache = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1000 - 60000,
  };

  return tokenCache.token;
}

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
  offset = 0
): Promise<{ items: EbayListing[]; total: number }> {
  const token = await getToken();

  const params = new URLSearchParams({
    q: query,
    category_ids: categoryId,
    filter: 'conditionIds:{7000},itemLocationCountry:GB',
    sort: 'newlyListed',
    limit: '100',
    offset: String(offset),
  });

  const res = await fetch(`${BROWSE_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
      'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=GB',
    },
  });

  const data = (await res.json()) as any;

  const items: EbayListing[] = (data.itemSummaries || []).map((item: any) => ({
    itemId: item.itemId,
    title: item.title,
    price: parseFloat(item.price?.value || '0'),
    seller: {
      username: item.seller?.username || '',
      feedbackScore: item.seller?.feedbackScore || 0,
      feedbackPercentage: parseFloat(item.seller?.feedbackPercentage || '0'),
    },
    categoryId,
    categoryName: CATEGORIES.find((c) => c.id === categoryId)?.name || categoryId,
    itemWebUrl: item.itemWebUrl || '',
    image: item.image?.imageUrl,
  }));

  return { items, total: data.total || 0 };
}

export async function crawlAllBrokenListings(): Promise<EbayListing[]> {
  const all: EbayListing[] = [];
  const seen = new Set<string>();

  for (const category of CATEGORIES) {
    for (const query of SEARCH_QUERIES) {
      console.log(`  Searching "${query}" in ${category.name}...`);
      try {
        const { items, total } = await searchBrokenListings(query, category.id);
        for (const item of items) {
          if (!seen.has(item.itemId)) {
            seen.add(item.itemId);
            all.push(item);
          }
        }
        await new Promise((r) => setTimeout(r, 300));

        if (total > 100) {
          const { items: more } = await searchBrokenListings(query, category.id, 100);
          for (const item of more) {
            if (!seen.has(item.itemId)) {
              seen.add(item.itemId);
              all.push(item);
            }
          }
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch (err) {
        console.warn(`  Failed ${query}/${category.name}:`, err);
      }
    }
  }

  return all;
}
