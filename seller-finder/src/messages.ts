import type { SellerAggregate } from './scorer.js';

export function generateOutreachMessage(seller: SellerAggregate): string {
  const topItems = seller.listings
    .slice(0, 3)
    .map((l) => `"${l.title.substring(0, 60)}"`)
    .join(', ');

  const categoryList = seller.categories.join(', ');
  const avgPrice = seller.totalListingValue / seller.brokenListingCount;

  const templates = [
    `Hi ${seller.username},

I came across your listings on eBay (${topItems}) and I think you'd be a great fit for BrokeyDokey — a new UK marketplace specifically built for broken, unused and outdated electronics.

A few reasons it might work better for you than eBay for this kind of stock:

• We charge lower fees — more in your pocket per sale
• Our buyers are repair shops and refurbishers who actively search for exactly what you're listing
• No competing with hundreds of identical listings — your items get seen by the right people

You can list in about 2 minutes at brokeydokey.co.uk — completely free to list, we only take a small cut when it sells.

I'd love to get you set up as one of our first sellers. Happy to jump on a quick call if you want to know more.

Adrian Simpson
Founder, BrokeyDokey
brokeydokey.co.uk`,

    `Hi ${seller.username},

Quick question — are you finding that broken ${categoryList} take a while to shift on eBay, or do they move pretty quickly for you?

I'm Adrian, founder of BrokeyDokey (brokeydokey.co.uk) — a UK marketplace built specifically for broken, unused and outdated tech. We connect sellers like you directly with repair shops and refurbishers who are actively looking for parts and projects.

I spotted your listings and thought you'd be a natural fit. Lower fees than eBay, targeted buyers, and your listings stand out rather than getting buried.

Worth a look? Happy to answer any questions.

Adrian
brokeydokey.co.uk`,

    `Hi ${seller.username},

I run BrokeyDokey — a new UK marketplace for broken and unused electronics. Your listings caught my eye.

We're built for exactly what you sell. Lower fees than eBay, and our buyers are repair shops and refurbishers actively hunting for stock like yours (avg listing value in your categories: ~£${Math.round(avgPrice)}).

Free to list. Quick to set up. brokeydokey.co.uk

Worth trying alongside eBay?

Adrian Simpson
Founder, BrokeyDokey`,
  ];

  const index = seller.username.charCodeAt(0) % templates.length;
  return templates[index];
}

export function generateEmailSubject(seller: SellerAggregate): string {
  const subjects = [
    `Your ${seller.categories[0] || 'electronics'} listings — a better home for them?`,
    `BrokeyDokey — lower fees, better buyers for broken tech`,
    `Quick question about your eBay listings`,
    `Found your listings — worth a look at this`,
  ];
  const index = seller.username.charCodeAt(1) % subjects.length;
  return subjects[index];
}
