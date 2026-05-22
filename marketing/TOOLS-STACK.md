# BROKEYDOBKEY — MARKETING TOOLS STACK
## The Set-and-Forget Growth Machine

> **Core Principle:** Every tool in this stack can run while you sleep. No daily scrolling. No manual posting. No grinding. This is the anti-influencer marketing playbook.

---

## 1. SEO

### **Ahrefs** (Primary SEO Tool)
- **What it does:** Keyword research, backlink analysis, site audits, competitor tracking, content gap analysis
- **Why it fits BrokeyDokey:** The broken tech niche has high-intent, low-competition keywords ("sell broken PS4 UK", "broken MacBook value", "cracked screen trade in"). These searchers have cash intent. Ahrefs finds those gaps before competitors do.
- **Free tier:** Ahrefs Webmaster Tools (free for verified site owners — site audit + backlink checker)
- **Cost:** Starter £29/mo | Standard £179/mo (Standard is worth it for content team)
- **Automation:**
  - Set weekly email digests for rank tracking (zero login required)
  - Create Alerts for brand mentions + competitor new content
  - Export keyword clusters → pass to AI → auto-generate blog briefs
  - Workflow: Ahrefs Alert fires → Zapier catches webhook → creates Notion draft with keyword data pre-filled

### **Google Search Console** (Free Essential)
- **What it does:** Monitors search performance, flags indexing issues, shows which queries drive clicks
- **Why it fits BrokeyDokey:** Free and essential. Real data from Google on what broken tech queries people actually search.
- **Free tier:** 100% free
- **Cost:** £0
- **Automation:**
  - Connect to Looker Studio (free) for automated weekly report emailed to you
  - Set up Performance Alerts for drops over 20% — instant email notification

### **Screaming Frog SEO Spider** (Technical SEO)
- **What it does:** Crawls your site for broken links, missing meta, duplicate content, speed issues
- **Why it fits BrokeyDokey:** Marketplace sites with thousands of listings can develop technical SEO rot fast. Catch it early.
- **Free tier:** Up to 500 URLs free
- **Cost:** £149/year (one-time annual licence)
- **Automation:**
  - Schedule monthly crawl → export CSV → set conditional alert if error count > 50
  - Pair with Google Sheets + Apps Script to auto-flag issues

### **RankMath** (On-Site SEO for CMS blog)
- **What it does:** WordPress/CMS SEO plugin — meta optimisation, schema markup, XML sitemap auto-generation
- **Why it fits BrokeyDokey:** When you launch the BrokeyDokey blog (week 2 of launch), every post should be pre-optimised without thinking about it
- **Free tier:** Very generous free tier covers all core needs
- **Cost:** £0 (free) | Pro £59/year
- **Automation:**
  - Auto-generates meta descriptions from first paragraph
  - Auto-submits new posts to Google Indexing API (instant indexing)
  - Schema markup (Product, HowTo, FAQ) applied automatically by template

---

## 2. EMAIL MARKETING

### **Klaviyo** (Primary Email + SMS Platform)
- **What it does:** Behavioural email automation, SMS, segmentation, A/B testing, predictive analytics
- **Why it fits BrokeyDokey:** Klaviyo is built for marketplaces and e-commerce. It triggers emails based on BEHAVIOUR (item listed, item viewed, no activity). This is the automation engine for the whole user lifecycle.
- **Free tier:** Up to 250 contacts / 500 emails/month free
- **Cost:** From £20/mo (500 contacts) — scales with list size
- **Automation Workflows:**

  **Seller Flow:**
  ```
  User registers as seller
  → Day 0: "Welcome to the Scrapyard" email (tone: warm, funny, quick-start tips)
  → Day 1: "Your first listing is waiting" nudge (if no listing created)
  → Day 3: If listed: "Your item has 12 views — here's how to get offers faster"
  → Day 3: If not listed: "Your broken stuff is losing value by the minute" FOMO email
  → Day 7: If no activity: "Your junk called. It wants a new home." re-engagement
  → Day 14: If still no listing: "Don't be a div — takes 3 minutes to list" final push
  → Day 30: If listed & sold: "You beauty! Here's what to sell next" cross-sell
  → Day 30: If listed & unsold: "Not sold yet? Here's a price drop nudge"
  ```

  **Buyer Flow:**
  ```
  User saves/views item → didn't buy
  → 2 hours later: "That [item] is still broken and still available" reminder
  → 24 hours later: "Someone else is looking at your future PS4..." scarcity email
  → If item sells: "Gutted? Here's similar kit" alternative recommendation
  ```

  **Winback Flow:**
  ```
  No login in 30 days
  → "We miss your broken stuff" re-engagement (BrokeyPoints reminder)
  → 7 days later: "Right. Last chance before we assume you've gone full normie"
  → 14 days later: Sunset email (we're removing you from list — clean list hygiene)
  ```

  **Post-Purchase:**
  ```
  Purchase confirmed
  → Day 0: BrokeyGuard™ confirmation + tracking
  → Day 5 (estimated delivery): "Should have arrived — how's the repair going?"
  → Day 14: Review request ("Roast Your Experience — 2 stars minimum if you're feeling kind")
  → Day 30: "Ready to flip something else?" back-in-marketplace nudge
  ```

### **Mailchimp** (Backup / Newsletter Option)
- **What it does:** Email newsletters, basic automations, landing pages
- **Why it fits BrokeyDokey:** If budget is tight pre-launch, Mailchimp's free tier covers the basics. Migrate to Klaviyo at 1,000+ subscribers.
- **Free tier:** Up to 500 contacts / 1,000 emails/month
- **Cost:** £0 (free tier) | £11.35/mo (Essentials)
- **Automation:** Basic welcome sequence and abandoned cart — functional but less sophisticated than Klaviyo

---

## 3. VIDEO CREATION

### **CapCut** (Short-Form Video Editing)
- **What it does:** Auto-captions, templates, AI voiceover, trending audio, one-click ratio exports (9:16, 1:1, 16:9)
- **Why it fits BrokeyDokey:** The "Roast My Junk" UGC content and YouTube Shorts are the highest-ROI content format. CapCut lets non-editors produce shareable videos fast. Template + brand colour = consistent output.
- **Free tier:** Very generous — all core features free
- **Cost:** £0 (free) | Pro ~£8/mo (for brand kits and advanced AI tools)
- **Automation:**
  - CapCut's "Auto Cut" and "AI Script to Video" can convert a blog post into a rough cut with zero timeline editing
  - Batch-render multiple aspect ratios from one project

### **Descript** (Long-Form Video + Podcast Editing)
- **What it does:** Edit video like a text document — delete words to cut footage. Auto-transcription, screen recording, AI voice correction.
- **Why it fits BrokeyDokey:** For YouTube tutorials ("How to Diagnose PS4 BLOD"), Descript makes editing non-technical. Record, transcribe, delete ums, export. Done.
- **Free tier:** 1 hour transcription/month free
- **Cost:** Hobbyist £12/mo | Creator £24/mo
- **Automation:**
  - Overdub AI voice fills in re-recorded sections in your voice
  - Auto-publish to YouTube via Descript integration
  - "Studio Sound" AI removes background noise in one click

### **HeyGen** (AI Presenter Videos)
- **What it does:** AI avatar lip-sync video — upload a script, get a talking-head video with an AI presenter
- **Why it fits BrokeyDokey:** For explainer content and ad creatives, HeyGen lets you produce "presenter" style videos without filming. Use sparingly — brand voice needs real humans too.
- **Free tier:** 1 free video/month (watermarked)
- **Cost:** Essential £24/mo
- **Automation:**
  - Feed blog post → HeyGen API → AI turns it into presenter video → auto-post to YouTube
  - Works well for product category explainers (e.g., "What is drift and what's a drifting Joy-Con worth?")

### **OpusClip** (AI Clip Repurposing)
- **What it does:** Takes long-form video (YouTube/podcast) and auto-cuts the best 60-90 second clips for Shorts/Reels
- **Why it fits BrokeyDokey:** Record one 15-minute repair walkthrough → OpusClip creates 8 short clips → schedule them over 2 weeks. One shoot = 2 weeks of content.
- **Free tier:** 60 minutes/month free
- **Cost:** Starter £15/mo
- **Automation:**
  - Connect YouTube channel → auto-clip new uploads → auto-add captions → export to Zapier → schedule via Buffer

---

## 4. IMAGE CREATION

### **Canva** (Primary Design Tool)
- **What it does:** Drag-and-drop graphic design — social posts, thumbnails, email headers, banners, print ads
- **Why it fits BrokeyDokey:** The brutalist aesthetic is achievable without a designer. Black border + yellow fill + bold uppercase = BrokeyDokey. Set up Brand Kit once, create everything in 5 minutes.
- **Free tier:** Generous — most features free, Brand Kit requires Pro
- **Cost:** £0 (free) | Pro £13/mo per user (worth it for Brand Kit + background removal)
- **Automation:**
  - Magic Resize: Create one post → resize to all 8 formats in one click
  - Bulk Create: Feed a CSV of listing titles/prices → auto-generate 100 branded listing cards
  - Canva API (paid): Programmatically generate listing images from product data

### **Adobe Firefly / Midjourney** (AI Image Generation)
- **What it does:** Generate custom imagery from text prompts — product shots, backgrounds, lifestyle images
- **Why it fits BrokeyDokey:** For ad creatives showing "broken tech in real environments" when you don't have a photographer. Use real photos where possible, AI fill gaps.
- **Free tier:** Adobe Firefly — 25 credits/month free (in Creative Cloud)
- **Cost:** Adobe Firefly £3/mo | Midjourney £8/mo (Basic)
- **Automation:**
  - Midjourney → Zapier → auto-save to Google Drive for team access
  - Use consistent prompts: "broken PlayStation controller on concrete workbench, industrial lighting, high contrast photography"

### **Remove.bg** (Background Removal)
- **What it does:** Instantly removes image backgrounds
- **Why it fits BrokeyDokey:** For making listing images look clean and professional — sellers upload messy photos, platform can batch-clean them
- **Free tier:** 50 free low-res credits/month
- **Cost:** Pay-per-use: £0.13/image or £6.99/mo subscription
- **Automation:**
  - Integrate via API → auto-process all new listing uploads → clean background → re-upload
  - Zapier: New listing photo uploaded → Remove.bg API → cleaned image saved back

---

## 5. AD MANAGEMENT

### **Google Ads** (Search + Display)
- **What it does:** Pay-per-click search ads targeting specific keywords; display ads across Google network
- **Why it fits BrokeyDokey:** High-intent keywords like "sell broken iPhone UK", "broken laptop worth money", "where to sell damaged tech". These searchers are ready to list. Capture them.
- **Free tier:** No free tier — pay per click
- **Cost:** Start with £500/mo test budget. Target CPC: £0.40-£1.20 for broken tech terms
- **Key Campaigns:**
  - Campaign 1: Seller acquisition ("sell broken [device] UK")
  - Campaign 2: Buyer acquisition ("buy broken tech for parts UK")
  - Campaign 3: Branded (protect your own brand terms)
- **Automation:**
  - Smart Bidding: Target CPA or ROAS — Google's AI optimises bids automatically
  - Responsive Search Ads: Feed 15 headlines + 4 descriptions → Google tests combinations
  - Performance Max: One campaign type that runs across all Google channels automatically
  - Set budget alerts (email when spend hits 80% of budget — no overspend surprises)

### **Meta Ads Manager** (Facebook + Instagram)
- **What it does:** Interest + demographic targeting, retargeting, lookalike audiences, video ads
- **Why it fits BrokeyDokey:** Retargeting people who visited the site but didn't list. Lookalike audiences of your best sellers. Video ads showing "broken stuff → cash" journey.
- **Free tier:** No free tier
- **Cost:** Start £300/mo for testing
- **Automation:**
  - Advantage+ Shopping Campaigns: Meta's AI picks audiences, placements, bids automatically
  - Dynamic Creative: Upload 5 images + 5 headlines → Meta auto-tests all combinations
  - Retargeting Pixel: Automatically shows ads to site visitors with relevant listings
  - Lead gen forms: "What's your broken tech worth?" — zero-friction lead capture

### **Reddit Ads** (Niche Community Targeting)
- **What it does:** Promoted posts and display ads within specific subreddits
- **Why it fits BrokeyDokey:** r/GameDeals, r/PCMasterRace, r/techsupport, r/bapcsalesuk — these communities are full of people with broken tech who'd list it if they knew about BrokeyDokey
- **Free tier:** No free tier — £5 minimum daily spend
- **Cost:** £3-8 CPM; budget £150/mo for subreddit targeting
- **Automation:**
  - Schedule ads to run only Thur-Sun (highest engagement days on Reddit gaming/tech subs)
  - Auto-pause campaigns under performance threshold

---

## 6. ANALYTICS

### **Google Analytics 4** (Primary Web Analytics)
- **What it does:** Full traffic analysis, conversion tracking, user journeys, audience segments
- **Why it fits BrokeyDokey:** Essential. Tracks the full funnel from SEO landing page → listing page → first item listed. Every campaign performance measured here.
- **Free tier:** 100% free
- **Cost:** £0
- **Automation:**
  - Set up automated reports emailed weekly (Looker Studio integration)
  - Create Alerts for traffic drops or spike anomalies
  - Link to Google Ads for automated budget reallocation signals

### **Hotjar** (Behaviour Analytics)
- **What it does:** Session recordings, heatmaps, on-site surveys, funnel analysis
- **Why it fits BrokeyDokey:** See exactly where people drop off in the listing flow. If everyone abandons at step 3 of listing creation — you know where to fix the product.
- **Free tier:** 35 sessions/day free (enough for early stage)
- **Cost:** Plus £32/mo | Business £80/mo
- **Automation:**
  - Triggered micro-surveys: "What stopped you from listing today?" appears on exit intent
  - Auto-generates weekly digest of session recordings

### **Looker Studio** (Reporting Dashboards)
- **What it does:** Pulls data from GA4, Search Console, Google Ads, Klaviyo → beautiful automated dashboards
- **Why it fits BrokeyDokey:** One page that shows everything. Set it up once, check it monthly. No spreadsheets, no exports.
- **Free tier:** 100% free (Google product)
- **Cost:** £0
- **Automation:**
  - Set up scheduled email delivery of dashboard PDF to yourself weekly
  - Connects directly to all Google products — zero manual data pulls

---

## 7. SCHEDULING / AUTOMATION

### **Buffer** (Social Scheduling)
- **What it does:** Schedule posts across Twitter/X, Instagram, LinkedIn, TikTok, Facebook from one dashboard
- **Why it fits BrokeyDokey:** Queue up 4 weeks of social content in one afternoon. It posts while you sleep. This is the "no daily scrolling" tool.
- **Free tier:** 3 channels, 10 posts per channel queued
- **Cost:** Essentials £5/mo (unlimited posts, 6 channels)
- **Automation:**
  - "Ideas" tab: Paste blog posts → Buffer suggests social captions
  - Set content slots (e.g., "Tuesday 12pm, Friday 6pm") → it fills them automatically from queue
  - Connect Zapier: New blog post published → auto-draft social posts across channels

### **Zapier** (The Glue Between Everything)
- **What it does:** Connects apps via automated workflows ("Zaps") without code
- **Why it fits BrokeyDokey:** This is the automation backbone. Every system in this stack connects through Zapier.
- **Free tier:** 100 tasks/month, 5 Zaps
- **Cost:** Starter £16/mo | Professional £49/mo (recommended)
- **Key Zaps to Build:**

  ```
  ZAP 1 — New Blog Post Pipeline:
  WordPress publish → Klaviyo "new blog post" email → Buffer posts social → Ahrefs alert check

  ZAP 2 — New Listing Alert:
  BrokeyDokey new listing → Klaviyo trigger "listing live" email → Google Sheets log

  ZAP 3 — New User Registration:
  New user signed up → Klaviyo add to "new sellers" sequence → Slack notify team

  ZAP 4 — Stale Listing Alert:
  Google Sheets "listing age > 14 days" → Klaviyo trigger nudge email → log in Notion

  ZAP 5 — UGC Capture:
  Instagram hashtag #brokeydokey → save to Google Drive folder → Slack notify for review

  ZAP 6 — Review Request:
  Order status = delivered (in system) → 5-day delay → Klaviyo review email
  ```

### **Make (formerly Integromat)** (Advanced Automation)
- **What it does:** More powerful than Zapier — handles complex multi-step workflows, better for data transformation
- **Why it fits BrokeyDokey:** Use for complex scenarios like: "If new listing is PS4 + price under £50 + no image → trigger improvement email with Canva template link"
- **Free tier:** 1,000 operations/month free
- **Cost:** Core £9/mo | Pro £16/mo
- **Automation:** Build the Remove.bg listing image cleaning pipeline here — handles webhooks and API calls better than Zapier

---

## 8. AFFILIATE / REFERRAL

### **Tapfiliate** (Affiliate Programme Management)
- **What it does:** Manages affiliate tracking, payouts, commission structures, affiliate dashboard
- **Why it fits BrokeyDokey:** Turn your early users into advocates. Pay them £2 per new seller they refer. iFixit YouTubers, repair Reddit mods, tech bloggers — all potential affiliates who'll promote for cash.
- **Free tier:** 14-day trial
- **Cost:** Essential £59/mo
- **Automation:**
  - Auto-creates unique tracking links for each affiliate
  - Auto-calculates commissions when a referred user lists first item
  - Weekly payout emails sent automatically
  - Tapfiliate → Zapier → Klaviyo: When affiliate earns first commission → send congratulations email

### **ReferralHero** (User Referral / Viral Loops)
- **What it does:** In-product referral programme — "Refer a friend, get £3 BrokeyPoints"
- **Why it fits BrokeyDokey:** The BrokeyPoints system is already in the product. Add a referral layer: "Share your link → friend lists an item → you both get 50 points." Viral growth mechanic baked in.
- **Free tier:** Up to 100 referrals/month free
- **Cost:** Starter £49/mo
- **Automation:**
  - Auto-generates referral links on user signup
  - Tracks conversions and credits BrokeyPoints automatically
  - Sends "Your friend just listed something — you've earned points!" email via Klaviyo integration

### **PartnerStack** (B2B / Partnership Programme)
- **What it does:** Manages partnerships with businesses (repair shops, refurb companies, schools)
- **Why it fits BrokeyDokey:** For the "Corporate Partner" tier — IT departments, councils, schools who donate bulk broken kit. Track their referrals, provide dashboards, automate impact reports.
- **Free tier:** Demo required — no self-serve free tier
- **Cost:** From ~£800/mo (enterprise tool, use after Series A)
- **Automation:** Full partner portal with automated commission tracking, co-marketing assets, and impact reports

---

## AUTOMATION MASTER WORKFLOW MAP

```
NEW USER SIGNS UP
├─→ Klaviyo: Seller welcome sequence starts
├─→ Zapier: Logs to Google Sheets CRM
└─→ Tapfiliate: Checks if referred (credits affiliate)

USER LISTS FIRST ITEM
├─→ Klaviyo: "Listing live" confirmation email
├─→ Make: Auto-clean listing image via Remove.bg
└─→ Google Analytics: "first_listing" conversion event

7 DAYS — NO ACTIVITY
└─→ Klaviyo: "Your broken stuff is still broken" nudge email

ITEM SOLD
├─→ Klaviyo: Purchase confirmation + BrokeyGuard™ update
├─→ Zapier: Update Google Sheets with GMV data
├─→ Klaviyo: Day 14 review request sequence
└─→ ReferralHero: Check if buyer is referral → credit points

BLOG POST PUBLISHED
├─→ RankMath: Auto-submit to Google Indexing API
├─→ Zapier: Draft social posts → Buffer queue
├─→ Klaviyo: Newsletter send (if in send schedule)
└─→ Ahrefs: Monitor new post's ranking progress (weekly digest)
```

---

## TOTAL MONTHLY COST ESTIMATE

| Category | Tool | Cost |
|----------|------|------|
| SEO | Ahrefs Starter + GSC (free) | £29 |
| Email | Klaviyo (500 contacts) | £20 |
| Video | CapCut (free) + OpusClip | £15 |
| Images | Canva Pro | £13 |
| Ads | Google Ads (test budget) | £500 |
| Analytics | GA4 + Hotjar Free | £0 |
| Scheduling | Buffer Essentials | £5 |
| Automation | Zapier Starter | £16 |
| Affiliate | Tapfiliate | £59 |
| **TOTAL** | | **~£657/mo** |

> **Pre-revenue / Bootstrap version (free tools only): ~£0/mo**
> GA4 + GSC + Canva Free + Buffer Free + Klaviyo Free + CapCut + Make Free = fully functional at £0 until you hit 500 email subscribers
