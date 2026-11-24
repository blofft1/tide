// Generates stardust/prototypes/en-us-research-best-quality-detergent-proposed.html (article archetype).
// Header + footer: lifted verbatim from the gated home prototype (our own authored markup, en-us.build.mjs).
// Body copy: the verbatim rich-text runs of the captured page (stardust/current/pages/<slug>.html, read through
// html-slice into .work/<slug>/main.html), re-wrapped in our own article markup; attributes reduced to href,
// aria-label and id.
import fs from 'fs';

const root = '/workspace/5db7d055/stardust';
const slug = 'en-us-research-best-quality-detergent';
const page = JSON.parse(fs.readFileSync(`${root}/current/pages/${slug}.json`, 'utf8'));
const home = fs.readFileSync(`${root}/prototypes/en-us-proposed.html`, 'utf8');
const raw = fs.readFileSync(`${root}/current/pages/${slug}.html`, 'utf8');
const src = fs.readFileSync(`${root}/.work/${slug}/main.html`, 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// ---- chrome from the home prototype ----
const chromeTop = home.slice(home.indexOf('<header class="site-header"'), home.indexOf('<main'));
const chromeBottom = home.slice(home.indexOf('</main>') + 7, home.lastIndexOf('</div>\n<script'));

// ---- share icons (the live inline SVGs, desktop copy) ----
const shareRaw = raw.match(/<div class="share-block d-none d-lg-flex"><div class="share-buttons">([\s\S]*?)<\/div><\/div>/)[1];
const shareLinks = [...shareRaw.matchAll(/<a [^>]*aria-label="([^"]+)"[^>]*>(<svg[\s\S]*?<\/svg>)<\/a>/g)]
  .map(([, label, svg]) => `<a class="share__item" href="/" aria-label="${label}">${svg.replace(/ clip-path="url\(#clip-path\)"/, '')}</a>`).join('');
const share = (mod) => `<div class="share share--${mod}"><div class="share__buttons">${shareLinks}</div></div>`;

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
const clean = (h) => h
  .replace(/ class="event_internal_link"/g, '')
  .replace(/<div class="richtext-table-wrapper">/g, '<div class="rt__table">')
  .replace(/<p><\/p>/g, '')
  .replace(/\n+/g, '\n').trim();
const rts = containers(src, 'richtext-container').map(clean);
if (rts.length !== 8) throw new Error(`expected 8 rich-text runs, got ${rts.length}`);

// ---- FAQ items ----
const faqs = [...src.matchAll(/<div class="expandable-content undefined" id="([^"]+)">\s*<div class="expandable-content-header" role="button" aria-label="([^"]*)">([\s\S]*?)<svg\/><\/div>\s*<div class="expandable-content__content" id="[^"]+">\s*([\s\S]*?)<\/div>\s*<\/div>/g)]
  .map(([, id, label, q, a]) => ({ id, label, q, a: a.trim() }));
if (faqs.length !== 5) throw new Error(`expected 5 FAQ items, got ${faqs.length}`);
const chevron = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)" fill="#13259c"/></svg>';
const faq = ({ id, label, q, a }) => `<div class="faq" id="${id}"><div class="faq__q" role="button" tabindex="0" aria-expanded="false" aria-controls="${id}-content" aria-label="${label}">${q}${chevron}</div><div class="faq__a" id="${id}-content" aria-hidden="true">${a}</div></div>`;

// ---- jump navigation (labels verbatim) ----
const navItems = [...src.matchAll(/<li><span class="" role="button" aria-label="([^"]+)">([^<]+)<\/span><\/li>/g)];
const targets = ['1-what-defines-a-high-quality-detergent', '2-technical-foundations-of-a-high-quality-detergent', '3-how-to-recognize-a-high-quality-detergent-in-practice', '4-persistent-myths-about-detergent-quality-a-scientific-rebuttal', '5-the-risk-of-ineffective-cleaning-and-associated-residues', '6-faqs'];
const nav = navItems.map(([, label, text], i) => `<li><span role="button" tabindex="0" aria-label="${label}" data-target="${targets[i]}">${text}</span></li>`).join('');

const title = page.headings.find((h) => h.level === 1 || h.tag === 'h1')?.text || 'What Is the Best Detergent in Terms of Quality? What the Science Actually Shows';
const lead = src.match(/<div class="article-intro-main-text">\s*([\s\S]*?)\s*<\/div>/)[1];
const crumb = src.match(/<li class="breadcrumbs-list-item"><span><span>([^<]+)<\/span><\/span>/)[1];

const row = (body, id = '') => `<section class="rt-row"${id ? ` id="${id}"` : ''}><div class="container"><div class="rt-col"><div class="rt">\n${body}\n</div></div></div></section>`;

const main = `<main id="site-content" class="tide-article-page">
<div id="sticky-nav-anchor"></div>
<div class="anchor-nav" id="sticky-nav"><div class="container"><nav><ul>${nav}</ul></nav></div></div>
<section class="article-intro">
 <div class="article-intro__crumbs"><div class="container"><nav aria-label="Breadcrumbs"><ul class="crumbs"><li class="crumbs__item"><a href="/en-us" aria-label="Home"><span>Home</span></a></li><li class="crumbs__item"><span><span>${crumb}</span></span></li></ul></nav></div></div>
 <div class="container"><div class="article-intro__content">
  <h1 class="article-intro__title">${title}</h1>
  ${share('mobile')}
  <div class="article-intro__lead">${lead}</div>
  ${share('desktop')}
 </div></div>
</section>
<div class="article-body">
${row(rts[0])}
${rts.slice(1, 6).map((r) => row(r)).join('\n')}
<section class="rt-row rt-row--faq" id="6-faqs"><div class="container">
 <div class="rt-col"><div class="rt">\n${rts[6]}\n</div></div>
 <div class="rt-col"><div class="faqs">${faqs.map(faq).join('')}</div></div>
 <div class="rt-col"><div class="rt">\n${rts[7]}\n</div></div>
</div></section>
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
console.log('wrote', html.length, 'rt', rts.length, 'faqs', faqs.length, 'nav', navItems.length);
