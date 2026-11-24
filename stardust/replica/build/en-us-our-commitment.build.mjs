// Generates stardust/prototypes/en-us-our-commitment-proposed.html (section-landing archetype).
// Header + footer (+ locale modal): lifted verbatim from the gated home prototype (our own authored markup,
// en-us.build.mjs) — the live header/footer markup of this page is byte-identical to home's.
// Main content: authored here from stardust/current/pages/en-us-our-commitment.{json,html} (verbatim strings).
import fs from 'fs';

const root = '/workspace/5db7d055/stardust';
const slug = 'en-us-our-commitment';
const page = JSON.parse(fs.readFileSync(`${root}/current/pages/${slug}.json`, 'utf8'));
const home = fs.readFileSync(`${root}/prototypes/en-us-proposed.html`, 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const chromeTop = home.slice(home.indexOf('<header class="site-header"'), home.indexOf('<main'));
const chromeBottom = home.slice(home.indexOf('</main>') + 7, home.lastIndexOf('</div>\n<script'));
if (!chromeTop.includes('site-header') || !chromeBottom.includes('site-footer')) throw new Error('chrome lift failed');

const I = 'assets/img/';
const chevron = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)" fill="#13259c"/></svg>';

// cards parsed from the captured DOM sidecar (href, image file, alt, title, text — verbatim)
const raw = fs.readFileSync(`${root}/current/pages/${slug}.html`, 'utf8');
const cards = [...raw.matchAll(/<div class="article-preview preview-box">[\s\S]*?<img [^>]*alt="([^"]*)"[^>]*src="([^"]+)"[\s\S]*?<a (?:class="article-preview-title" href="([^"]+)"|href="([^"]+)" class="article-preview-title")><p>([\s\S]*?)<\/p><\/a><p>([\s\S]*?)<\/p>/g)]
  .map(([, alt, src, h1, h2, title, text]) => ({ alt, file: decodeURIComponent(src.split('?')[0].split('/').pop()).replace(/\.(jpg|png)$/, '.webp'), href: h1 || h2, title, text }));
if (cards.length !== 9) throw new Error(`expected 9 cards, got ${cards.length}`);
for (const c of cards) if (!fs.existsSync(`${root}/prototypes/assets/img/${c.file}`)) throw new Error(`missing asset ${c.file}`);
const body = page.body;
for (const c of cards) {
  const t = c.title.replace(/&amp;/g, '&');
  if (!body.includes(t)) throw new Error(`title not in capture: ${t}`);
}
const imgs = page.media.imgs.filter((i) => i.src.includes('ctfassets'));
const main = cards[0];
const small = cards.slice(1);

const preview = ({ href, file: src, alt, title, text }, w, h) => `<div class="preview"><div class="preview__image"><picture><img src="${I}${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy"></picture></div><div class="preview__body"><div class="preview__content"><a class="preview__title" href="${href}"><p>${title}</p></a><p>${text}</p><a class="btn btn--orange" href="${href}" aria-label="${title.replace(/"/g, '&quot;')} Learn More">Learn More</a></div></div>${chevron}</div>`;

const deck = body[0];
const hero = imgs[0];
const mainHtml = `<main id="site-content" class="commitment">
<section class="commitment-hero">
 <div class="commitment-hero__image"><picture><img src="${I}OUR_COMMITMENT_Header_1920x653.webp" alt="${esc(hero.alt)}" width="1920" height="653"></picture></div>
 <div class="container commitment-hero__box">
  <div class="commitment-hero__head"><div class="commitment-hero__title"><h1>Our <strong>Commitment</strong></h1></div></div>
  <div class="commitment-hero__deck"><p>${deck}</p></div>
 </div>
</section>
<section class="commitment-main"><div class="container"><div class="commitment-main__grid">
 <div class="commitment-main__col">${preview(main, 570, 310)}</div>
</div></div></section>
<section class="commitment-cards"><div class="container"><div class="commitment-cards__grid">
${small.map((c) => ` <div class="commitment-cards__col">${preview(c, 370, 320)}</div>`).join('\n')}
</div></div></section>
<section class="commitment-video"><div class="container"><div class="commitment-video__grid">
 <div class="commitment-video__col"><div class="yt"><div class="yt__overlay" role="button" aria-label="Play video" tabindex="0" data-embed="https://www.youtube.com/embed/Roli4tLwRgk?autoplay=1" style="background-image: url(&quot;${I}yt_Roli4tLwRgk_maxresdefault.jpg&quot;);"></div></div></div>
</div></div></section>
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
${chromeTop}${mainHtml}${chromeBottom}</div>
<script src="canon/canon.js" defer></script>
<script src="${slug}.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(`${root}/prototypes/${slug}-proposed.html`, html);
console.log('wrote', html.length, 'cards', small.length);
