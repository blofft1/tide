// Generates stardust/prototypes/en-us-our-commitment-sustainability-compaction-proposed.html
// (sustainability-topic archetype: jump navigation, orange article intro with breadcrumbs + lead image,
// rich-text / image rows, checkmark list).
// Header + footer: lifted verbatim from the gated home prototype (our own authored markup, en-us.build.mjs).
// Body copy: the verbatim rich-text runs of the captured page (stardust/current/pages/<slug>.html),
// re-wrapped in our own markup; attributes reduced to href, aria-label and id.
import fs from 'fs';

const root = '/workspace/5db7d055/stardust';
const slug = 'en-us-our-commitment-sustainability-compaction';
const page = JSON.parse(fs.readFileSync(`${root}/current/pages/${slug}.json`, 'utf8'));
const home = fs.readFileSync(`${root}/prototypes/en-us-proposed.html`, 'utf8');
const raw = fs.readFileSync(`${root}/current/pages/${slug}.html`, 'utf8');
const src = raw.slice(raw.indexOf('<main'), raw.indexOf('</main>'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// ---- chrome from the home prototype ----
const chromeTop = home.slice(home.indexOf('<header class="site-header"'), home.indexOf('<main'));
const chromeBottom = home.slice(home.indexOf('</main>') + 7, home.lastIndexOf('</div>\n<script'));
if (!chromeTop.includes('site-header') || !chromeBottom.includes('site-footer')) throw new Error('chrome lift failed');

// ---- share icons (the live inline SVGs, desktop copy) ----
const shareRaw = src.match(/<div class="share-block d-none d-lg-flex"><div class="share-buttons">([\s\S]*?)<\/div><\/div>/)[1];
const shareLinks = [...shareRaw.matchAll(/<a [^>]*aria-label="([^"]+)"[^>]*>(<svg[\s\S]*?<\/svg>)<\/a>/g)]
  .map(([, label, svg]) => `<a class="share__item" href="/" aria-label="${label}">${svg.replace(/ clip-path="url\(#clip-path\)"/, '')}</a>`).join('');
const share = (mod) => `<div class="share share--${mod}"><div class="share__buttons">${shareLinks}</div></div>`;

// ---- rich-text runs ----
const clean = (h) => h
  .replace(/ class="event_internal_link"/g, '')
  .replace(/<p><\/p>/g, '')
  .replace(/\n+/g, '\n').trim();
const rts = [...src.matchAll(/<div class="richtext-container[^"]*">([\s\S]*?)<\/div>/g)].map((m) => clean(m[1]));
if (rts.length !== 5) throw new Error(`expected 5 rich-text runs, got ${rts.length}`);

// ---- jump navigation (labels verbatim) ----
const navItems = [...src.matchAll(/<li><span class="[^"]*" role="button" aria-label="([^"]+)"[^>]*>([^<]+)<\/span><\/li>/g)];
const targets = ['how-does-tide-do-this', 'why-does-tide-do-this', 'more-cleaning-power-with-less-product'];
if (navItems.length !== 3) throw new Error(`expected 3 nav items, got ${navItems.length}`);
const nav = navItems.map(([, label, text], i) => `<li><span role="button" tabindex="0" aria-label="${label}" data-target="${targets[i]}">${text}</span></li>`).join('');

// ---- breadcrumbs ----
const crumbs = [...src.matchAll(/<li class="breadcrumbs-list-item"[^>]*>(?:<a [^>]*aria-label="([^"]+)" href="([^"]+)"><span[^>]*>([^<]+)<\/span><\/a>|<span[^>]*><span[^>]*>([^<]+)<\/span><\/span>)/g)]
  .map(([, label, href, text, cur]) => (href
    ? `<li class="crumbs__item"><a href="${href}" aria-label="${label}"><span>${text}</span></a></li>`
    : `<li class="crumbs__item"><span><span>${cur}</span></span></li>`)).join('');

const h1 = page.headings.find((h) => h.tag === 'h1').text;
const lead = src.match(/<div class="article-intro-main-text">\s*([\s\S]*?)\s*<\/div>/)[1];

const I = 'assets/img/';
const imgs = page.media.imgs.filter((i) => i.src.includes('ctfassets'));
const file = (u) => decodeURIComponent(u.split('?')[0].split('/').pop()).replace(/\.(jpg|png|svg)$/, '.webp');
for (const i of imgs) if (!fs.existsSync(`${root}/prototypes/assets/img/${file(i.src)}`)) throw new Error(`missing asset ${file(i.src)}`);
const pic = (i, cls = '') => `<picture${cls ? ` class="${cls}"` : ''}><img src="${I}${file(i.src)}" alt="${esc(i.alt)}" width="${i.w}" height="${i.h}" loading="lazy"></picture>`;

const row = (id, left, right) => `<section class="topic-row" data-section="${id}"><div class="container"><div class="topic-row__grid">
 <div class="topic-row__left"><div class="rt">\n${left}\n</div></div>
 <div class="topic-row__right">${right}</div>
</div></div></section>`;

const main = `<main id="site-content" class="topic-page">
<div id="sticky-nav-anchor"></div>
<div class="anchor-nav" id="sticky-nav"><div class="container"><nav><ul>${nav}</ul></nav></div></div>
<section class="topic-intro">
 <div class="topic-intro__crumbs"><div class="container"><nav aria-label="Breadcrumbs"><ul class="crumbs">${crumbs}</ul></nav></div></div>
 <div class="container"><div class="topic-intro__grid">
  <div class="topic-intro__content">
   <h1 class="topic-intro__title">${h1}</h1>
   ${share('mobile')}
   <div class="topic-intro__lead">${lead}</div>
   ${share('desktop')}
  </div>
  <div class="topic-intro__image">${pic(imgs[0])}</div>
 </div></div>
</section>
<div class="topic-body">
${row(targets[0], rts[0], pic(imgs[1]))}
${row(targets[1], rts[1], `<div class="rt checklist">\n${rts[2]}\n</div>`)}
${row(targets[2], rts[3], pic(imgs[2]))}
<section class="topic-row"><div class="container"><div class="topic-row__grid topic-row__grid--center"><div class="topic-row__wide"><div class="rt">${rts[4]}</div></div></div></div></section>
</div>
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
console.log('wrote', html.length, 'rt', rts.length, 'nav', navItems.length, 'imgs', imgs.length);
