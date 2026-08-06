import type { EbayListing } from './ebay.js';

export interface SellerAggregate {
  username: string;
  feedbackScore: number;
  feedbackPercentage: number;
  brokenListingCount: number;
  totalListingValue: number;
  categories: string[];
  score: number;
  listings: EbayListing[];
}

export function aggregateSellers(listings: EbayListing[]): SellerAggregate[] {
  const map = new Map<string, SellerAggregate>();

  for (const listing of listings) {
    const { username, feedbackScore, feedbackPercentage } = listing.seller;
    if (!username) continue;

    if (!map.has(username)) {
      map.set(username, {
        username,
        feedbackScore,
        feedbackPercentage,
        brokenListingCount: 0,
        totalListingValue: 0,
        categories: [],
        score: 0,
        listings: [],
      });
    }

    const agg = map.get(username)!;
    agg.brokenListingCount++;
    agg.totalListingValue += listing.price;
    if (!agg.categories.includes(listing.categoryName)) {
      agg.categories.push(listing.categoryName);
    }
    agg.listings.push(listing);
    if (feedbackScore > agg.feedbackScore) {
      agg.feedbackScore = feedbackScore;
      agg.feedbackPercentage = feedbackPercentage;
    }
  }

  for (const agg of map.values()) {
    agg.score = scoreSeller(agg);
  }

  return Array.from(map.values()).sort((a, b) => b.score - a.score);
}

function scoreSeller(agg: SellerAggregate): number {
  let score = 0;

  if (agg.feedbackScore >= 1000) score += 30;
  else if (agg.feedbackScore >= 500) score += 25;
  else if (agg.feedbackScore >= 100) score += 20;
  else if (agg.feedbackScore >= 50) score += 15;
  else if (agg.feedbackScore >= 20) score += 10;
  else score += 5;

  if (agg.brokenListingCount >= 20) score += 40;
  else if (agg.brokenListingCount >= 10) score += 30;
  else if (agg.brokenListingCount >= 5) score += 20;
  else if (agg.brokenListingCount >= 3) score += 15;
  else if (agg.brokenListingCount >= 2) score += 10;
  else score += 5;

  if (agg.feedbackPercentage >= 99) score += 20;
  else if (agg.feedbackPercentage >= 97) score += 15;
  else if (agg.feedbackPercentage >= 95) score += 10;
  else if (agg.feedbackPercentage >= 90) score += 5;

  score += Math.min(agg.categories.length * 3, 10);

  return score;
}

export function formatScore(score: number): string {
  if (score >= 80) return 'Hot';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'OK';
  return 'Low';
}
