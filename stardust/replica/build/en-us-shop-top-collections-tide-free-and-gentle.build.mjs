// Generates stardust/prototypes/en-us-shop-top-collections-tide-free-and-gentle-proposed.html (collection-landing archetype).
// Header + footer: lifted verbatim from the gated home prototype (our own authored markup, en-us.build.mjs) — the live
// chrome inventory of this page is identical to home's (spec/*-chrome.json diff: 0 fields beyond y offsets).
// Body copy: the verbatim rich-text runs and product-card fields of the captured page
// (stardust/current/pages/<slug>.html), re-wrapped in our own collection markup; attributes reduced to href, id, aria-label.
import fs from 'fs';

const root = '/workspace/5db7d055/stardust';
const slug = 'en-us-shop-top-collections-tide-free-and-gentle';
const page = JSON.parse(fs.readFileSync(`${root}/current/pages/${slug}.json`, 'utf8'));
const home = fs.readFileSync(`${root}/prototypes/en-us-proposed.html`, 'utf8');
const raw = fs.readFileSync(`${root}/current/pages/${slug}.html`, 'utf8');
const src = raw.slice(raw.indexOf('<main'), raw.indexOf('</main>'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const I = 'assets/img/';

// ---- chrome from the home prototype ----
const chromeTop = home.slice(home.indexOf('<header class="site-header"'), home.indexOf('<main'));
const chromeBottom = home.slice(home.indexOf('</main>') + 7, home.lastIndexOf('</div>\n<script'));
if (!chromeTop.includes('site-header') || !chromeBottom.includes('site-footer')) throw new Error('chrome lift failed');

// ---- rich-text runs: inner HTML of every .richtext-container, in order ----
function containers(html, cls) {
  const out = [];
  let from = 0;
  for (;;) {
    const start = html.indexOf(`<div class="${cls}`, from);
    if (start < 0) break;
    const open = html.indexOf('>', start) + 1;
    let depth = 1; let i = open;
    const re = /<div\b|<\/div>/g; re.lastIndex = open;
    let m;
    while ((m = re.exec(html))) { depth += m[0] === '</div>' ? -1 : 1; if (!depth) { i = m.index; break; } }
    out.push(html.slice(open, i));
    from = i;
  }
  return out;
}
const rts = containers(src, 'richtext-container');
if (rts.length !== 10) throw new Error(`expected 10 rich-text runs, got ${rts.length}`);
const [rtHero, , rtFresh, rtSensitive, rtNea, rtNeaNote, rtNoPerfumes, rtWorks, rtAvailable, rtTogether] = rts;
const strip = (h) => h.replace(/<p><\/p>/g, '');

// fresh & gentle run: own picture markup in place of the live <picture>
const freshPic = '<picture class="fresh__logo"><img src="' + I + 'GRAPHICS.webp" alt="fresh &amp; gentle" width="567" height="90" loading="lazy"></picture>';
const fresh = rtFresh
  .replace(/<picture[\s\S]*?<\/picture>/, freshPic)
  .replace(/ class="event_internal_link"/g, '')
  .replace(/ data-action-detail="[^"]*"/g, '');
if (!fresh.includes('Learn more')) throw new Error('fresh run');

// ---- product cards ----
const starPath = 'M26.8,9.7l-7.4-1.1l-3.3-6.7c-0.2-0.4-0.5-0.7-0.9-0.8C14.8,1,14.4,1,14,1.1c-0.4,0.1-0.7,0.4-0.9,0.8L9.8,8.6 L2.4,9.7C2,9.7,1.6,10,1.4,10.3C1.1,10.6,1,11,1,11.4c0,0.4,0.2,0.8,0.5,1.1l5.4,5.2l-1.3,7.4c-0.1,0.4,0,0.8,0.2,1.1 C6,26.6,6.4,26.9,6.8,27c0.4,0.1,0.8,0,1.2-0.2l6.6-3.5l6.7,3.5c0.2,0.1,0.5,0.2,0.8,0.2c0.1,0,0.3,0,0.4-0.1 c0.4-0.1,0.7-0.3,0.9-0.7c0.2-0.3,0.3-0.7,0.2-1.1l-1.3-7.4l5.4-5.2c0.3-0.3,0.5-0.7,0.5-1.1c0-0.4-0.1-0.8-0.4-1.1 C27.6,10,27.2,9.7,26.8,9.7z';
if (!raw.includes(starPath)) throw new Error('star path drift');
const star = (kind) => `<svg class="star star--${kind}" viewBox="0 0 29.2 28" aria-hidden="true"><path d="${starPath}"/></svg>`;
const stars = (rating, pct) => {
  const full = Math.floor(rating);
  const out = [];
  for (let i = 0; i < 5; i++) {
    let inner;
    if (i < full) inner = `<span>${star('full')}</span>`;
    else if (i === full) inner = `<span class="stars__container"><span class="stars__fill" style="width: ${pct}%;">${star('full')}</span>${star('empty')}</span>`;
    else inner = `<span>${star('empty')}</span>`;
    out.push(`<span class="stars__item" role="img" aria-label="${i + 1} out of 5 stars"><span class="visually-hidden">Star</span>${inner}</span>`);
  }
  return `<span class="stars" aria-label="${rating} out of 5 stars">${out.join('')}</span>`;
};
const cardsRaw = src.split('<div class="product-preview">').slice(1);
if (cardsRaw.length !== 6) throw new Error(`expected 6 product cards, got ${cardsRaw.length}`);
const cards = cardsRaw.map((c) => {
  const g = (re) => { const m = c.match(re); if (!m) throw new Error(`card field ${re}`); return m[1]; };
  const imgSrc = g(/<img[^>]*src="([^"]+)"/).split('?')[0].split('/').pop().replace(/\.[a-z]+$/i, '.webp');
  return {
    href: g(/<a href="([^"]+)"/),
    img: imgSrc,
    alt: g(/<img[^>]*alt="([^"]*)"/),
    title: g(/<a class="product-preview-title"[^>]*>(<p>[\s\S]*?<\/p>)<\/a>/),
    ratingLabel: g(/class="product-preview-rating-wrapper"[^>]*aria-label="([^"]+)"/),
    rating: Number(g(/class="star-rating-wrapper small" aria-label="([\d.]+) out of 5 stars"/)),
    pct: Number(g(/class="full-star-container" style="width: (\d+)%;"/)),
    count: g(/<span class="product-preview-rating-count"[^>]*>\((\d+)\)<\/span>/),
    desc: g(/<p class="product-preview-description">([\s\S]*?)<\/p>/),
    retail: [...c.matchAll(/<div class="ps-widget[^"]*"([^>]*)><span class="ps-button-label">Find Retailers<\/span><\/div>/g)]
      .map((m) => (m[1].match(/aria-label="([^"]+)"/) || [])[1] || null),
  };
});
const retailer = (aria, mod) => `<button class="retailer-btn retailer-btn--${mod}" type="button"${aria ? ` aria-label="${aria}"` : ''}>Find Retailers</button>`;
const card = (p) => `<div class="collection-grid__col">
 <div class="product-card">
  <div class="product-card__image"><a href="${p.href}"><picture><img src="${I}${p.img}" alt="${p.alt}" width="520" height="520" loading="lazy"></picture></a></div>
  <div class="product-card__body">
   <div class="product-card__content"><a class="product-card__title" href="${p.href}">${p.title}</a>
    <div class="product-card__rating" role="img" aria-label="${p.ratingLabel}"><span aria-hidden="true">${stars(p.rating, p.pct)}</span><span class="product-card__count" aria-hidden="true">(<!-- -->${p.count}<!-- -->)</span></div>
    <p class="product-card__desc">${p.desc}</p>
   </div>
   ${retailer(p.retail[0] || p.retail[1], 'desktop')}
  </div>
  ${retailer(p.retail[1], 'mobile')}
 </div>
</div>`;

// ---- pictures (live renditions per breakpoint, webp); alts verbatim, in page order ----
const alts = [...src.matchAll(/<img[^>]*alt="([^"]*)"/g)].map((m) => m[1]);
if (alts.length !== 16) throw new Error(`expected 16 images, got ${alts.length}`);
const pic = (sources, fallback, alt, w, h, extra = '') => `<picture${extra}>${sources.map(([mq, f]) => `<source media="${mq}" srcset="${I}${f}">`).join('')}<img src="${I}${fallback}" alt="${alt}" width="${w}" height="${h}" loading="lazy"></picture>`;
const heroPic = pic([['(min-width: 1400px)', 'Tide_F_G_20250519_module1_min1400.webp'], ['(min-width: 992px)', 'Tide_F_G_20250519_module1_min992.webp'], ['(min-width: 576px)', 'Tide_F_G_20250519_module1_min576.webp']], 'Tide_F_G_20250519_module1_default.webp', alts[0], 720, 1354).replace(' loading="lazy"', ' fetchpriority="high"');
const freshBg = pic([['(min-width: 992px)', 'Tide_US_FreshGentle_section_20260914_min992.webp']], 'Tide_US_FreshGentle_section_20260914_deafault.webp', '', 1982, 1557);
const sensitivePic = pic([['(min-width: 376px)', 'module_01_bg.webp']], 'module_01_sp_0603.webp', alts[3], 375, 400);
const neaPic = pic([['(min-width: 376px)', 'Tide_F_G_20250519_module3_min768.webp']], 'Tide_F_G_20250519_module3_default.webp', alts[4], 767, 2045);
const sleepPic = pic([], 'module_04_sp_0603.webp', alts[7], 375, 448);
const iconsPic = pic([['(min-width: 376px)', 'Icons.webp']], 'Icons_sp_0603.webp', alts[8], 242, 155);
const togetherPic = pic([['(min-width: 376px)', 'module_07_bg.webp']], 'module_07_bg_sp_0603.webp', alts[15], 375, 545);

// NEA / NPF logos run (inside the third banner, between the statement and the disclaimer)
const logos = `<div class="nea__logos">
 <div class="nea__logo"><picture><img src="${I}NEA_logo.webp" alt="${alts[5]}" width="141" height="193" loading="lazy"></picture></div>
 <div class="nea__logo"><picture><img src="${I}NPF_logo.webp" alt="${alts[6]}" width="151" height="192" loading="lazy"></picture></div>
</div>`;

const nav = [['Overview section', 'Overview', 'overview'], ['Browse Collection section', 'Browse Collection', 'browse-collection']]
  .map(([label, text, t]) => `<li><span role="button" tabindex="0" aria-label="${label}" data-target="${t}">${text}</span></li>`).join('');

const main = `<main id="site-content" class="tide-collection-page">
<div id="sticky-nav-anchor"></div>
<div class="anchor-nav" id="sticky-nav"><div class="container"><nav><ul>${nav}</ul></nav></div></div>
<span class="anchor-target" id="overview"></span>
<section class="cl-hero">
 ${heroPic}
 <div class="cl-hero__content"><div class="container"><div class="rt cl-hero__rt">${strip(rtHero)}</div></div></div>
</section>
<section class="fresh">
 <div class="container fresh__wrap"><div class="rt fresh__rt">${fresh}</div></div>
 ${freshBg}
</section>
<section class="cl-banner sensitive">
 ${sensitivePic}
 <div class="rt sensitive__rt">${strip(rtSensitive)}</div>
</section>
<section class="nea">
 ${neaPic}
 <div class="nea__content"><div class="container"><div class="nea__col">
  <div class="nea__main"><div class="rt nea__rt">${rtNea}</div>
  ${logos}</div>
  <div class="rt nea__note">${rtNeaNote}</div>
 </div></div></div>
</section>
<section class="cl-banner sleep"><div class="sleep__col"><div class="sleep__row"><div class="sleep__flex">
 ${sleepPic}
 <div class="sleep__content"><div class="sleep__inner"><div class="rt sleep__rt">${strip(rtNoPerfumes)}</div></div></div>
</div></div></div></section>
<section class="works">
 <div class="container"><div class="works__row">
  <div class="works__left"><div class="rt works__rt">${strip(rtWorks)}</div></div>
  <div class="works__right">${iconsPic}</div>
 </div></div>
</section>
<span class="anchor-target" id="browse-collection"></span>
<section class="collection-title"><div class="container"><div class="rt">${strip(rtAvailable)}</div></div></section>
<section class="collection-grid"><div class="container"><div class="collection-grid__row">
${cards.map(card).join('\n')}
</div></div></section>
<section class="cl-banner together">
 ${togetherPic}
 <div class="together__content"><div class="container"><div class="together__col"><div class="rt together__rt">${rtTogether}</div></div></div></div>
</section>
</main>`;

const html = `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="icon" href="assets/favicon.ico">
<link rel="stylesheet" href="canon/canon.css">
<link rel="stylesheet" href="${slug}.css">
</head>
<body>
<div id="page-wrapper">
${chromeTop}${main}${chromeBottom}</div>
<script src="canon/canon.js" defer></script>
<script src="${slug}.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(`${root}/prototypes/${slug}-proposed.html`, html);
console.log('wrote', html.length, 'rts', rts.length, 'cards', cards.length, cards.map((c) => `${c.rating}/${c.pct}/${c.count}/${c.retail.map(Boolean).join('+')}`).join(' '));
