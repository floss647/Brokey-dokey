import type { Post, BdListing } from './db.js';

function esc(s: string | null | undefined): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderBody(text: string): string {
  return text
    .split('\n\n')
    .map(p => {
      if (p.startsWith('## ')) return `<h2>${p.slice(3)}</h2>`;
      if (p.startsWith('### ')) return `<h3>${p.slice(4)}</h3>`;
      if (p.startsWith('> ')) return `<blockquote>${p.slice(2)}</blockquote>`;
      if (p.startsWith('- ') || p.startsWith('* ')) {
        const items = p.split('\n').map(l => `<li>${l.replace(/^[-*] /, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

const CATEGORY_META: Record<string, { label: string; url: string; color: string }> = {
  'the-find':     { label: 'The Find',     url: '/the-find',    color: '#e8470a' },
  'review':       { label: 'Review',       url: '/reviews',     color: '#2563eb' },
  'rolling-stop': { label: 'Rolling Stop', url: '/rolling-stop', color: '#16a34a' },
  'general':      { label: '',             url: '/',            color: '#6b6b6b' },
};

const SECTION_CONFIG: Record<string, { title: string; tag: string; description: string }> = {
  'the-find': {
    title: 'The Find',
    tag: 'Best Buys',
    description: "The most interesting secondhand cars we've spotted — cool, underrated, and priced to move.",
  },
  'review': {
    title: 'Reviews',
    tag: 'Behind the Wheel',
    description: 'New cars, classic cars. First drives and long-term tests. Honest opinions, every time.',
  },
  'rolling-stop': {
    title: 'Rolling Stop',
    tag: 'On the Road',
    description: "We get on our bikes, find cool cars, and stop to talk to the people who own them.",
  },
};

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #fafaf8;
  --text: #111110;
  --muted: #6b6b6b;
  --border: #e4e4e0;
  --accent: #e8470a;
  --white: #ffffff;
  --serif: 'DM Serif Display', Georgia, 'Times New Roman', serif;
  --sans: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; height: auto; }

/* ─── Nav ─── */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(250,250,248,0.96);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 0 48px;
  display: flex; align-items: center; justify-content: space-between;
  height: 64px;
}
.nav-logo {
  font-family: var(--serif);
  font-size: 23px; letter-spacing: -0.4px; color: var(--text);
}
.nav-links { display: flex; gap: 36px; list-style: none; }
.nav-links a {
  font-size: 12px; font-weight: 600; letter-spacing: 0.07em;
  text-transform: uppercase; color: var(--muted); transition: color 0.15s;
}
.nav-links a:hover { color: var(--text); }

/* ─── Three-panel hero ─── */
.hero-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 88vh;
  min-height: 540px;
}
.hp {
  position: relative;
  overflow: hidden;
  display: block;
  background: #111;
  border-right: 1px solid rgba(255,255,255,0.07);
}
.hp:last-child { border-right: none; }
.hp-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.5;
  transition: opacity 0.4s ease, transform 0.7s ease;
}
.hp:hover .hp-bg { opacity: 0.68; transform: scale(1.05); }
.hp-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%);
}
.hp-label {
  position: absolute; top: 28px; left: 28px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
}
.hp-body {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 32px 28px;
}
.hp-title {
  font-family: var(--serif);
  font-size: clamp(1.05rem, 1.6vw, 1.5rem);
  line-height: 1.22; color: #fff; text-wrap: balance;
}
.hp-cta {
  display: inline-block; margin-top: 14px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
}
.hp:hover .hp-cta { color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.5); }

/* ─── Section ─── */
.section { padding: 80px 56px; border-top: 1px solid var(--border); }
.section-header {
  display: flex; align-items: flex-end;
  justify-content: space-between; margin-bottom: 52px;
}
.section-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.section-heading { font-family: var(--serif); font-size: 2.25rem; line-height: 1.15; }
.section-more {
  font-size: 13px; font-weight: 500; color: var(--text); opacity: 0.5;
  border-bottom: 1px solid currentColor; padding-bottom: 1px; transition: opacity 0.15s;
}
.section-more:hover { opacity: 1; }

/* ─── Card grid ─── */
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 44px; }
.grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 44px; }

/* ─── Small card ─── */
.card { display: block; }
.card-img {
  aspect-ratio: 16/10; overflow: hidden; background: #e4e4e0; margin-bottom: 18px;
}
.card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.card:hover .card-img img { transform: scale(1.04); }
.card-cat { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
.card-title {
  font-family: var(--serif); font-size: 1.3rem; line-height: 1.22;
  color: var(--text); margin-bottom: 10px; transition: color 0.15s;
}
.card:hover .card-title { color: var(--accent); }
.card-blurb { font-size: 14px; color: var(--muted); line-height: 1.65;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* ─── Wide card ─── */
.wcard {
  display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: center;
}
.wcard-img { aspect-ratio: 4/3; overflow: hidden; background: #e4e4e0; }
.wcard-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.wcard:hover .wcard-img img { transform: scale(1.03); }
.wcard-cat { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 16px; }
.wcard-title {
  font-family: var(--serif);
  font-size: clamp(1.75rem, 3vw, 2.75rem); line-height: 1.12; margin-bottom: 20px; transition: color 0.15s;
}
.wcard:hover .wcard-title { color: var(--accent); }
.wcard-blurb { font-size: 16px; color: var(--muted); line-height: 1.75; margin-bottom: 28px; font-weight: 300; }
.wcard-link {
  display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600;
  letter-spacing: 0.04em; color: var(--text); border-bottom: 1.5px solid currentColor; padding-bottom: 2px; transition: color 0.15s;
}
.wcard-link:hover { color: var(--accent); }

/* ─── Section page ─── */
.sp-header { padding: 80px 56px 56px; border-bottom: 1px solid var(--border); }
.sp-tag { font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }
.sp-title { font-family: var(--serif); font-size: clamp(2.75rem, 5vw, 4.5rem); line-height: 1.06; margin-bottom: 16px; }
.sp-desc { font-size: 1.1rem; color: var(--muted); max-width: 500px; line-height: 1.65; font-weight: 300; }
.sp-grid { padding: 64px 56px; display: grid; grid-template-columns: repeat(3,1fr); gap: 52px 44px; }

/* ─── Article ─── */
.art-wrap { max-width: 1080px; margin: 0 auto; padding: 0 32px; }
.art-header { padding: 72px 0 48px; max-width: 760px; }
.art-cat {
  display: inline-block; font-size: 12px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 18px;
}
.art-cat:hover { opacity: 0.75; }
.art-title { font-family: var(--serif); font-size: clamp(2rem, 4.5vw, 3.75rem); line-height: 1.07; margin-bottom: 24px; }
.art-lede { font-family: var(--serif); font-style: italic; font-size: 1.35rem; color: var(--muted); line-height: 1.58; margin-bottom: 28px; }
.art-meta { font-size: 13px; color: var(--muted); border-top: 1px solid var(--border); padding-top: 20px; }
.art-hero { width: 100%; max-height: 600px; object-fit: cover; margin-bottom: 64px; display: block; }
.art-body { max-width: 680px; font-size: 1.05rem; line-height: 1.88; padding-bottom: 96px; }
.art-body p { margin-bottom: 1.5em; }
.art-body h2 { font-family: var(--serif); font-size: 1.85rem; line-height: 1.14; margin: 2.5em 0 0.75em; }
.art-body h3 { font-family: var(--serif); font-size: 1.35rem; line-height: 1.22; margin: 2em 0 0.6em; }
.art-body ul, .art-body ol { padding-left: 1.5em; margin-bottom: 1.5em; }
.art-body li { margin-bottom: 0.5em; }
.art-body blockquote {
  font-family: var(--serif); font-style: italic; font-size: 1.4rem; color: var(--muted);
  border-left: 3px solid var(--accent); padding: 4px 0 4px 24px; margin: 2em 0; line-height: 1.48;
}

/* ─── Empty ─── */
.empty { padding: 80px 56px; color: var(--muted); }
.empty-h { font-family: var(--serif); font-size: 2rem; color: var(--text); margin-bottom: 12px; }

/* ─── Footer ─── */
footer { background: var(--text); color: #fff; padding: 60px 56px; display: flex; justify-content: space-between; align-items: flex-end; }
.ft-logo { font-family: var(--serif); font-size: 30px; color: #fff; display: block; margin-bottom: 8px; }
.ft-sub { font-size: 13px; color: rgba(255,255,255,0.42); font-weight: 300; }
.ft-nav { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.ft-nav a { font-size: 13px; color: rgba(255,255,255,0.45); transition: color 0.15s; font-weight: 300; }
.ft-nav a:hover { color: #fff; }

/* ─── Cars listing page ─── */
.cars-header { padding: 80px 56px 56px; border-bottom: 1px solid var(--border); }
.cars-grid { padding: 56px 56px; display: grid; grid-template-columns: repeat(3,1fr); gap: 44px; }

/* ─── Car card ─── */
.lcard { display: block; }
.lcard-img { aspect-ratio: 16/10; overflow: hidden; background: #e4e4e0; margin-bottom: 16px; position: relative; }
.lcard-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.lcard:hover .lcard-img img { transform: scale(1.04); }
.lcard-price {
  position: absolute; bottom: 12px; right: 12px;
  background: rgba(0,0,0,0.82); color: #fff; font-size: 14px; font-weight: 700;
  padding: 5px 11px; border-radius: 4px; letter-spacing: -0.2px;
}
.lcard-title { font-family: var(--serif); font-size: 1.25rem; line-height: 1.22; color: var(--text); margin-bottom: 8px; transition: color 0.15s; }
.lcard:hover .lcard-title { color: var(--accent); }
.lcard-specs { display: flex; gap: 0; flex-wrap: wrap; }
.lcard-spec { font-size: 12px; color: var(--muted); font-weight: 500; }
.lcard-spec:not(:last-child)::after { content: ' · '; white-space: pre; color: var(--border); }

/* ─── Car detail page ─── */
.car-hero { width: 100%; max-height: 560px; object-fit: cover; display: block; background: #e4e4e0; }
.car-wrap { max-width: 1080px; margin: 0 auto; padding: 0 48px; }
.car-header { padding: 48px 0 36px; display: flex; align-items: flex-start; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
.car-title { font-family: var(--serif); font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.08; }
.car-price { font-family: var(--serif); font-size: 2.75rem; color: var(--accent); font-weight: 400; white-space: nowrap; }
.car-specs-grid { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 52px; }
.car-spec-item { padding: 18px 22px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.car-spec-item:nth-child(3n) { border-right: none; }
.car-spec-label { font-size: 10px; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
.car-spec-value { font-size: 15px; font-weight: 500; color: var(--text); }
.car-gallery { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin: 0 0 48px; }
.car-gallery-img { flex: 0 0 220px; height: 148px; overflow: hidden; background: #e4e4e0; border-radius: 4px; }
.car-gallery-img img { width: 100%; height: 100%; object-fit: cover; }
.car-desc-head { font-family: var(--serif); font-size: 1.5rem; margin-bottom: 20px; }
.car-desc { font-size: 1.025rem; line-height: 1.85; color: var(--text); max-width: 680px; margin-bottom: 56px; white-space: pre-wrap; }
.car-contact { border-top: 1px solid var(--border); padding: 40px 0 80px; }
.car-contact-head { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
.car-contact-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 28px; background: var(--text); color: #fff;
  font-size: 14px; font-weight: 600; border-radius: 6px; transition: background 0.15s; text-decoration: none;
}
.car-contact-btn:hover { background: var(--accent); color: #fff; }
.car-source { display: inline-block; margin-top: 16px; font-size: 13px; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1px; }
.car-source:hover { color: var(--text); }
.car-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--muted); padding: 28px 0 0; transition: color 0.15s; }
.car-back:hover { color: var(--text); }

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .grid-3 { grid-template-columns: repeat(2,1fr); }
  .sp-grid { grid-template-columns: repeat(2,1fr); }
  .wcard { grid-template-columns: 1fr; gap: 32px; }
  .wcard-img { max-height: 380px; }
  .cars-grid { grid-template-columns: repeat(2,1fr); padding: 48px 40px; }
  .car-specs-grid { grid-template-columns: repeat(2,1fr); }
  .car-spec-item:nth-child(3n) { border-right: 1px solid var(--border); }
  .car-spec-item:nth-child(2n) { border-right: none; }
}
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; height: auto; }
  .hp { height: 40vh; min-height: 260px; }
  .hp:first-child { height: 52vh; }
}
@media (max-width: 720px) {
  .nav { padding: 0 20px; height: 56px; }
  .nav-links { gap: 20px; }
  .nav-links a { font-size: 11px; }
  .section { padding: 56px 24px; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .grid-3, .grid-2, .sp-grid { grid-template-columns: 1fr; }
  .sp-header { padding: 56px 24px 40px; }
  .sp-grid { padding: 48px 24px; }
  .art-wrap { padding: 0 20px; }
  .art-header { padding: 48px 0 32px; }
  .empty { padding: 56px 24px; }
  footer { padding: 44px 24px; flex-direction: column; gap: 32px; align-items: flex-start; }
  .ft-nav { align-items: flex-start; }
  .cars-header { padding: 56px 24px 40px; }
  .cars-grid { grid-template-columns: 1fr; padding: 40px 24px; }
  .car-wrap { padding: 0 20px; }
  .car-header { padding: 36px 0 28px; flex-direction: column; gap: 12px; }
  .car-specs-grid { grid-template-columns: repeat(2,1fr); }
  .car-spec-item:nth-child(3n) { border-right: 1px solid var(--border); }
  .car-spec-item:nth-child(2n) { border-right: none; }
}
`;

function navHtml(): string {
  return `<nav class="nav">
  <a class="nav-logo" href="/">BrokeyDokey</a>
  <ul class="nav-links">
    <li><a href="/the-find">The Find</a></li>
    <li><a href="/reviews">Reviews</a></li>
    <li><a href="/rolling-stop">Rolling Stop</a></li>
    <li><a href="/cars">Cars</a></li>
  </ul>
</nav>`;
}

function footerHtml(): string {
  return `<footer>
  <div>
    <a class="ft-logo" href="/">BrokeyDokey</a>
    <div class="ft-sub">Cars worth knowing about.</div>
  </div>
  <nav class="ft-nav">
    <a href="/the-find">The Find</a>
    <a href="/reviews">Reviews</a>
    <a href="/rolling-stop">Rolling Stop</a>
    <a href="/cars">Cars for Sale</a>
  </nav>
</footer>`;
}

function layout(title: string, meta: string, body: string): string {
  const pageTitle = title === 'BrokeyDokey'
    ? 'BrokeyDokey — Cars worth knowing about'
    : `${title} — BrokeyDokey`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
${FONTS}
${meta}
<style>${CSS}</style>
</head>
<body>
${navHtml()}
${body}
${footerHtml()}
</body>
</html>`;
}

function smallCard(p: Post, showCat = false): string {
  const cat = CATEGORY_META[p.category || 'general'] || CATEGORY_META['general'];
  return `<a class="card" href="/blog/${p.slug}">
    <div class="card-img">
      ${p.image_url
        ? `<img src="${esc(p.image_url)}" alt="" loading="lazy">`
        : '<div style="width:100%;height:100%;background:#e4e4e0"></div>'}
    </div>
    ${showCat && cat.label ? `<div class="card-cat" style="color:${cat.color}">${cat.label}</div>` : ''}
    <h3 class="card-title">${esc(p.title)}</h3>
    ${p.excerpt ? `<p class="card-blurb">${esc(p.excerpt)}</p>` : ''}
  </a>`;
}

function wideCard(p: Post, labelOverride?: string, colorOverride?: string): string {
  const cat = CATEGORY_META[p.category || 'general'] || CATEGORY_META['general'];
  const label = labelOverride ?? cat.label;
  const color = colorOverride ?? cat.color;
  return `<a class="wcard" href="/blog/${p.slug}">
    <div class="wcard-img">
      ${p.image_url
        ? `<img src="${esc(p.image_url)}" alt="">`
        : '<div style="width:100%;height:100%;background:#e4e4e0"></div>'}
    </div>
    <div>
      ${label ? `<div class="wcard-cat" style="color:${color}">${label}</div>` : ''}
      <h2 class="wcard-title">${esc(p.title)}</h2>
      ${p.excerpt ? `<p class="wcard-blurb">${esc(p.excerpt)}</p>` : ''}
      <span class="wcard-link">Read →</span>
    </div>
  </a>`;
}

// ── Exported page renderers ───────────────────────────────────────────────────

export function homepageHtml(
  featured: Post[],
  theFind: Post[],
  reviews: Post[],
  rollingStop: Post[],
): string {
  const siteUrl = process.env.SITE_URL || 'https://brokeydokey.co.uk';

  function heroPanel(label: string, color: string, href: string, post: Post | null, fallback: string): string {
    const bgStyle = post?.image_url
      ? `background-image:url('${esc(post.image_url)}')`
      : `background:${fallback}`;
    return `<a class="hp" href="${href}">
      <div class="hp-bg" style="${bgStyle}"></div>
      <div class="hp-overlay"></div>
      <div class="hp-label" style="color:${color}">${label}</div>
      <div class="hp-body">
        <h2 class="hp-title">${post ? esc(post.title) : 'Coming soon'}</h2>
        <span class="hp-cta">${post ? 'Read →' : 'On its way →'}</span>
      </div>
    </a>`;
  }

  const heroSection = `<div class="hero-grid">
    ${heroPanel('The Find',     '#e8470a', '/the-find',    theFind[0]    || null, 'linear-gradient(160deg,#1a1410,#2d1f14)')}
    ${heroPanel('Reviews',      '#5a9cf5', '/reviews',     reviews[0]    || null, 'linear-gradient(160deg,#0f1420,#181f2c)')}
    ${heroPanel('Rolling Stop', '#4dba70', '/rolling-stop',rollingStop[0]|| null, 'linear-gradient(160deg,#101a12,#162014)')}
  </div>`;

  const theFindSection = `<section class="section">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">This Week</div>
        <h2 class="section-heading">The Find</h2>
      </div>
      ${theFind.length ? `<a class="section-more" href="/the-find">All finds →</a>` : ''}
    </div>
    ${theFind.length
      ? `<div class="grid-3">${theFind.slice(0,3).map(p => smallCard(p)).join('')}</div>`
      : `<div class="empty"><div class="empty-h">Coming soon.</div><p>The best secondhand finds, posted weekly.</p></div>`}
  </section>`;

  const reviewsSection = `<section class="section">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">Behind the Wheel</div>
        <h2 class="section-heading">Reviews</h2>
      </div>
      ${reviews.length > 1 ? `<a class="section-more" href="/reviews">All reviews →</a>` : ''}
    </div>
    ${reviews.length
      ? wideCard(reviews[0], 'Review', '#2563eb')
      : `<div class="empty"><div class="empty-h">Coming soon.</div><p>New cars and classic cars. Honest opinions, every time.</p></div>`}
  </section>`;

  const rollingStopSection = `<section class="section">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">On the Road</div>
        <h2 class="section-heading">Rolling Stop</h2>
      </div>
      ${rollingStop.length > 1 ? `<a class="section-more" href="/rolling-stop">All episodes →</a>` : ''}
    </div>
    ${rollingStop.length
      ? wideCard(rollingStop[0], 'Rolling Stop', '#16a34a')
      : `<div class="empty"><div class="empty-h">Coming soon.</div><p>On the bike, finding cool cars, meeting their owners.</p></div>`}
  </section>`;

  const meta = `<meta name="description" content="BrokeyDokey — the best secondhand car finds, honest reviews, and stories from the road.">
<meta property="og:title" content="BrokeyDokey — Cars worth knowing about">
<meta property="og:description" content="The best secondhand finds, honest reviews, and stories from the road.">
<meta property="og:url" content="${siteUrl}">
<meta property="og:type" content="website">`;

  return layout('BrokeyDokey', meta, `${heroSection}${theFindSection}${reviewsSection}${rollingStopSection}`);
}

export function sectionHtml(category: string, posts: Post[]): string {
  const siteUrl = process.env.SITE_URL || 'https://brokeydokey.co.uk';
  const cfg = SECTION_CONFIG[category] || { title: 'Stories', tag: '', description: '' };
  const urlSlug = category === 'review' ? 'reviews' : category;

  const meta = `<meta name="description" content="${esc(cfg.description)}">
<meta property="og:title" content="${esc(cfg.title)} — BrokeyDokey">
<meta property="og:description" content="${esc(cfg.description)}">
<meta property="og:url" content="${siteUrl}/${urlSlug}">
<meta property="og:type" content="website">`;

  const body = `<div class="sp-header">
    <div class="sp-tag">${esc(cfg.tag)}</div>
    <h1 class="sp-title">${esc(cfg.title)}</h1>
    ${cfg.description ? `<p class="sp-desc">${esc(cfg.description)}</p>` : ''}
  </div>
  ${posts.length
    ? `<div class="sp-grid">${posts.map(p => smallCard(p)).join('')}</div>`
    : `<div class="empty"><div class="empty-h">Nothing yet.</div><p>Check back soon — content is on the way.</p></div>`}`;

  return layout(cfg.title, meta, body);
}

export function articleHtml(post: Post): string {
  const siteUrl = process.env.SITE_URL || 'https://brokeydokey.co.uk';
  const cat = CATEGORY_META[post.category || 'general'] || CATEGORY_META['general'];
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const meta = `<meta name="description" content="${esc(post.excerpt || '')}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(post.title)}">
<meta property="og:description" content="${esc(post.excerpt || '')}">
<meta property="og:url" content="${postUrl}">
${post.image_url ? `<meta property="og:image" content="${esc(post.image_url)}">` : ''}
<meta property="og:site_name" content="BrokeyDokey">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="${post.image_url ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${esc(post.title)}">
<meta name="twitter:description" content="${esc(post.excerpt || '')}">
${post.image_url ? `<meta name="twitter:image" content="${esc(post.image_url)}">` : ''}`;

  const body = `<div class="art-wrap">
    <div class="art-header">
      ${cat.label ? `<a class="art-cat" href="${cat.url}" style="color:${cat.color}">${cat.label}</a>` : ''}
      <h1 class="art-title">${esc(post.title)}</h1>
      ${post.excerpt ? `<p class="art-lede">${esc(post.excerpt)}</p>` : ''}
      ${date ? `<div class="art-meta">${date}</div>` : ''}
    </div>
    ${post.image_url ? `<img class="art-hero" src="${esc(post.image_url)}" alt="">` : ''}
    <div class="art-body">${renderBody(post.body || '')}</div>
  </div>`;

  return layout(post.title, meta, body);
}

// ── Car listing pages ─────────────────────────────────────────────────────────

function carTitle(l: BdListing): string {
  const parts = [l.year, l.make, l.model].filter(Boolean);
  return parts.length ? parts.join(' ') : l.title;
}

function carSpecItem(label: string, value: string | number | null | undefined): string {
  if (!value && value !== 0) return '';
  return `<div class="car-spec-item">
    <div class="car-spec-label">${label}</div>
    <div class="car-spec-value">${esc(String(value))}</div>
  </div>`;
}

export function carsHtml(listings: BdListing[]): string {
  const siteUrl = process.env.SITE_URL || 'https://brokeydokey.co.uk';

  const meta = `<meta name="description" content="Cars for sale from BrokeyDokey — hand-picked, honestly described.">
<meta property="og:title" content="Cars for Sale — BrokeyDokey">
<meta property="og:url" content="${siteUrl}/cars">
<meta property="og:type" content="website">`;

  const cards = listings.map(l => {
    const imgs = JSON.parse(l.images || '[]') as string[];
    const headline = carTitle(l);
    const specs = [
      l.mileage ? l.mileage.toLocaleString('en-GB') + ' miles' : '',
      l.fuel_type || '',
      l.transmission || '',
      l.location || '',
    ].filter(Boolean);

    return `<a class="lcard" href="/cars/${l.id}">
      <div class="lcard-img">
        ${imgs[0] ? `<img src="${esc(imgs[0])}" alt="${esc(headline)}" loading="lazy">` : ''}
        ${l.price ? `<div class="lcard-price">£${l.price.toLocaleString('en-GB')}</div>` : ''}
      </div>
      <h3 class="lcard-title">${esc(headline)}</h3>
      <div class="lcard-specs">${specs.map(s => `<span class="lcard-spec">${esc(s)}</span>`).join('')}</div>
    </a>`;
  }).join('');

  const body = `<div class="cars-header">
    <div class="sp-tag">For Sale</div>
    <h1 class="sp-title">Cars</h1>
    <p class="sp-desc">Hand-picked. Honestly described. No distance readings, no mystery mileage.</p>
  </div>
  ${listings.length
    ? `<div class="cars-grid">${cards}</div>`
    : `<div class="empty"><div class="empty-h">Nothing listed yet.</div><p>Check back soon — cars are added regularly.</p></div>`}`;

  return layout('Cars for Sale', meta, body);
}

export function carDetailHtml(l: BdListing): string {
  const siteUrl = process.env.SITE_URL || 'https://brokeydokey.co.uk';
  const imgs = JSON.parse(l.images || '[]') as string[];
  const headline = carTitle(l);

  const meta = `<meta name="description" content="${esc(l.description?.slice(0, 160) || headline)}">
<meta property="og:title" content="${esc(headline)} — BrokeyDokey">
<meta property="og:description" content="${esc(l.description?.slice(0, 200) || '')}">
<meta property="og:url" content="${siteUrl}/cars/${l.id}">
<meta property="og:type" content="website">
${imgs[0] ? `<meta property="og:image" content="${esc(imgs[0])}">` : ''}`;

  const heroImg = imgs[0]
    ? `<img class="car-hero" src="${esc(imgs[0])}" alt="${esc(headline)}">`
    : `<div class="car-hero" style="height:320px"></div>`;

  const gallery = imgs.slice(1).length
    ? `<div class="car-gallery">${imgs.slice(1, 9).map(u => `<div class="car-gallery-img"><img src="${esc(u)}" alt="" loading="lazy"></div>`).join('')}</div>`
    : '';

  const specs = [
    carSpecItem('Mileage', l.mileage ? l.mileage.toLocaleString('en-GB') + ' miles' : null),
    carSpecItem('Fuel', l.fuel_type),
    carSpecItem('Transmission', l.transmission),
    carSpecItem('Engine', l.engine_size),
    carSpecItem('Colour', l.colour),
    carSpecItem('Body', l.body_type),
    carSpecItem('Doors', l.doors),
    carSpecItem('MOT', l.mot_expiry),
    carSpecItem('Location', l.location),
  ].filter(Boolean).join('');

  const contactInfo = l.contact_info || '';
  const isWhatsApp = contactInfo.toLowerCase().includes('wa.me') || contactInfo.toLowerCase().includes('whatsapp');
  const isPhone = /^[\d\s+()-]{7,}$/.test(contactInfo);
  const contactHref = isWhatsApp
    ? (contactInfo.startsWith('http') ? contactInfo : `https://wa.me/${contactInfo.replace(/\D/g, '')}`)
    : isPhone
      ? `tel:${contactInfo.replace(/\s/g, '')}`
      : contactInfo;
  const contactLabel = isWhatsApp ? 'Message on WhatsApp' : isPhone ? `Call ${contactInfo}` : 'Get in touch';

  const descSection = l.description
    ? `<div class="car-desc-head">About this car</div>
       <div class="car-desc">${esc(l.description)}</div>`
    : '';

  const contactSection = contactInfo
    ? `<div class="car-contact">
        <div class="car-contact-head">Enquire</div>
        <a class="car-contact-btn" href="${esc(contactHref)}">${contactLabel} →</a>
        ${l.source_url ? `<br><a class="car-source" href="${esc(l.source_url)}" target="_blank" rel="noopener">View original listing ↗</a>` : ''}
      </div>`
    : l.source_url
      ? `<div class="car-contact">
          <div class="car-contact-head">Interested?</div>
          <a class="car-contact-btn" href="${esc(l.source_url)}" target="_blank" rel="noopener">View original listing ↗</a>
        </div>`
      : '';

  const body = `${heroImg}
  <div class="car-wrap">
    <div class="car-header">
      <h1 class="car-title">${esc(headline)}</h1>
      ${l.price ? `<div class="car-price">£${l.price.toLocaleString('en-GB')}</div>` : ''}
    </div>
    ${specs ? `<div class="car-specs-grid">${specs}</div>` : ''}
    ${gallery}
    ${descSection}
    ${contactSection}
    <a class="car-back" href="/cars">← All cars</a>
  </div>`;

  return layout(headline, meta, body);
}

export function allPostsHtml(posts: Post[]): string {
  const siteUrl = process.env.SITE_URL || 'https://brokeydokey.co.uk';

  const meta = `<meta name="description" content="All posts from BrokeyDokey.">
<meta property="og:title" content="All Posts — BrokeyDokey">
<meta property="og:url" content="${siteUrl}/blog">`;

  const body = `<div class="sp-header">
    <div class="sp-tag">Everything</div>
    <h1 class="sp-title">All Posts</h1>
  </div>
  ${posts.length
    ? `<div class="sp-grid">${posts.map(p => smallCard(p, true)).join('')}</div>`
    : `<div class="empty"><div class="empty-h">Nothing yet.</div><p>Posts will appear here once published.</p></div>`}`;

  return layout('All Posts', meta, body);
}
