# BrokeyDokey — Tech Project Board

> Updated each session. Status: [ ] todo · [~] in progress · [x] done · [!] blocked

---

## STRAND 1 — Infrastructure & Deployment

- [x] Supabase project identified: `nwpuxtypddaqcqonrgqb`
- [x] Codebase confirmed: React/TypeScript/Vite + Supabase + Stripe escrow
- [ ] **Get Supabase access token** → paste into session so we can deploy edge functions directly
  - Supabase Dashboard → Account → Access Tokens → Generate new token
- [ ] Set up Supabase CLI deployment (unblocks all future backend work)

---

## STRAND 2 — Edge Functions

### create-checkout (shipping fix)
- [x] Fixed shipping calculation to use CATEGORY_WEIGHTS
- [x] Added proper moderation error message
- [ ] **Deploy to Supabase** (blocked until access token sorted)

### trigger-social-post (social pipeline)
- [x] Written: Claude Haiku generates captions
- [x] Added Placid branded image rendering
- [x] Added Ayrshare multi-platform posting
- [x] Added manual trigger mode (for existing listings)
- [ ] **Deploy to Supabase** (blocked until access token sorted)
- [ ] Add Adrian's voice guide to Claude prompt (needs voice brief from Adrian)

---

## STRAND 3 — API Keys & Secrets (all need adding to Supabase)

- [ ] `ANTHROPIC_API_KEY` — console.anthropic.com
- [ ] `AYRSHARE_API_KEY` — ayrshare.com
- [ ] `PLACID_API_KEY` — placid.app
- [ ] `PLACID_TEMPLATE_UUID` — after template designed in Placid
- [ ] `SOCIAL_WEBHOOK_SECRET` — make up any random string

---

## STRAND 4 — Social Pipeline Activation

- [ ] Ayrshare account set up + platforms connected (Instagram, TikTok, X, Reddit)
- [ ] Create r/BrokeyDokey subreddit (needed before Reddit posting)
- [ ] Design Placid template (layer names: photo, title, price, condition, category)
- [ ] Create Supabase database webhook pointing at trigger-social-post
- [ ] Test full pipeline end-to-end (list item → approve → check all 4 platforms)
- [ ] Backfill existing listings (SQL query → curl loop)

---

## STRAND 5 — UX Fixes (done)

- [x] Moderation status UI (pending/flagged/rejected states shown to user)
- [x] Multi-image gallery in listing detail view
- [x] Live category counts on home page
- [x] Category deep links from home → browse
- [x] Geolocation toast (replaced alert())

---

## STRAND 6 — Future Features (backlog)

- [ ] Adrian's voice guide → rewrite Claude caption prompt
- [ ] Reddit karma strategy (post manually to r/gameswap etc. until karma built)
- [ ] Consider moving off Lovable AI gateway → direct Anthropic API for moderation
- [ ] Seller dashboard improvements (listing analytics)
- [ ] Consider Vercel migration (when dev workflow needs it — not urgent)

---

## OPEN BLOCKERS

| Blocker | What it unlocks |
|---------|----------------|
| Supabase access token | Deploying all edge functions |
| Ayrshare account | Social automation going live |
| Placid template designed | Branded images in posts |
| Anthropic API key | Both edge functions |
