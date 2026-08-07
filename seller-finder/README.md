# BrokeyDokey Seller Finder

Finds eBay UK sellers of broken electronics and helps you reach out to recruit them to BrokeyDokey.

## Setup (one time)

```bash
cd seller-finder
npm install
cp .env.example .env
# Edit .env with your Gmail App Password (optional — only needed to send emails directly)
```

## Run a crawl

```bash
npm run crawl
```

This scrapes eBay UK for broken electronics listings, identifies the sellers, scores them, and saves everything to a local database (`sellers.db`).

Takes about 5–10 minutes. Run it again any time to find new sellers.

## Open the dashboard

```bash
npm run server
```

Then open **http://localhost:3456** in your browser.

From the dashboard you can:
- Browse sellers sorted by score (Hot / Good / OK / Low)
- See all their eBay listings
- Add their email and contact details
- Generate and edit a personalised outreach message
- Send the email directly (requires Gmail App Password in `.env`)
- Or copy the message and send manually via eBay Messages

## Scoring

- **Hot (80+)** — high feedback, lots of broken listings, great target
- **Good (60–79)** — solid seller worth contacting
- **OK (40–59)** — worth a look
- **Low (<40)** — small seller or low feedback

## Email setup (optional)

To send emails directly from the dashboard:
1. Go to **myaccount.google.com → Security → 2-Step Verification → App passwords**
2. Create an app password for "Mail"
3. Add to `.env`:
   ```
   SMTP_USER=your@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   SMTP_FROM=Adrian Simpson <your@gmail.com>
   ```
