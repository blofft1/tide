// Generates stardust/prototypes/en-us-how-to-wash-clothes-how-to-remove-stains-proposed.html (topic-hub archetype:
// the live .tide-article-listing-page — ALP intro, stain picker, stain index, guide header icons, step guide).
// Header + footer (+ locale modal): lifted verbatim from the gated home prototype (our own authored markup,
// en-us.build.mjs) — the live header/footer markup of this page is identical to home's (md5 of both, style/data-* stripped).
// Main content: authored here; strings, hrefs and alt text parsed verbatim from the captured DOM sidecar
// stardust/current/pages/<slug>.html; icons are the live inline SVGs.
import fs from 'fs';

const root = '/workspace/5db7d055/stardust';
const slug = 'en-us-how-to-wash-clothes-how-to-remove-stains';
const page = JSON.parse(fs.readFileSync(`${root}/current/pages/${slug}.json`, 'utf8'));
const home = fs.readFileSync(`${root}/prototypes/en-us-proposed.html`, 'utf8');
const raw = fs.readFileSync(`${root}/current/pages/${slug}.html`, 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const must = (cond, msg) => { if (!cond) throw new Error(msg); };

const chromeTop = home.slice(home.indexOf('<header class="site-header"'), home.indexOf('<main'));
const chromeBottom = home.slice(home.indexOf('</main>') + 7, home.lastIndexOf('</div>\n<script'));
must(chromeTop.includes('site-header') && chromeBottom.includes('site-footer'), 'chrome lift failed');

const mainRaw = raw.slice(raw.indexOf('<main'), raw.indexOf('</main>'))
  .replace(/\s(?:itemprop|itemscope|itemtype|data-[\w-]+|style|loading|draggable|role|tabindex|aria-hidden|aria-current|aria-expanded|aria-controls|rel|target|title)(?:="[^"]*")?(?=[\s>/])/g, '');
if (process.env.DUMP) fs.writeFileSync(process.env.DUMP, mainRaw);
const I = 'assets/img/';
const alt = (file) => { const m = mainRaw.match(new RegExp(`<img[^>]*alt="([^"]*)"[^>]*src="[^"]*/${file}`)) || mainRaw.match(new RegExp(`<img[^>]*src="[^"]*/${file}[^"]*"[^>]*alt="([^"]*)"`)); must(m, `alt for ${file}`); return m[1]; };
const chevron = (mainRaw.match(/<div class="expandable-content-header"[^>]*>[^<]*(<svg[\s\S]*?<\/svg>)/) || [])[1];
must(chevron, 'chevron svg');

// ---- share icons (live inline SVGs) ----
const shareRaw = mainRaw.match(/<div class="share-buttons">([\s\S]*?)<\/div>/)[1];
const shareLinks = [...shareRaw.matchAll(/<a [^>]*aria-label="([^"]+)"[^>]*>(<svg[\s\S]*?<\/svg>)<\/a>/g)]
  .map(([, label, svg]) => `<a class="alp-share__item" href="/" aria-label="${label}">${svg.replace(/ clip-path="url\(#clip-path\)"/, '')}</a>`).join('');
must(shareLinks.split('alp-share__item').length === 6, 'share icons');

// ---- intro ----
const t = (re) => { const m = mainRaw.match(re); must(m, `missing ${re}`); return m[1]; };
const h1 = t(/<h1 class="alp-intro-title">([^<]*)<\/h1>/);
const shortText = t(/<p class="alp-intro-short-text">([^<]*)<\/p>/);
const mainText = t(/<p class="alp-intro-main-text">([^<]*)<\/p>/);
const crumbs = [...mainRaw.matchAll(/<li class="breadcrumbs-list-item"[^>]*>([\s\S]*?)<\/li>/g)].map(([, li]) => {
  const a = li.match(/<a [^>]*href="([^"]+)"[^>]*><span>([^<]*)<\/span><\/a>/);
  const al = li.match(/<a [^>]*aria-label="([^"]+)"/);
  return a ? `<li class="alp-crumbs__item"><a href="${a[1]}"${al ? ` aria-label="${al[1]}"` : ''}>${a[2]}</a></li>` : `<li class="alp-crumbs__item" aria-current="page">${li.match(/<span><span>([^<]*)<\/span>/)[1]}</li>`;
});
must(crumbs.length === 3, 'crumbs');
const jumpAria = [...mainRaw.matchAll(/<li><span class="" aria-label="([^"]*)">[^<]*<\/span><\/li>/g)].map((m) => m[1]);
const jump = [...mainRaw.matchAll(/<li><span class=""[^>]*>([^<]*)<\/span><\/li>/g)].map((m) => m[1]);
must(jumpAria.length === 2, 'jump aria');
const navAria = t(/<div class="breadcrumbs "><nav aria-label="([^"]*)">/);
const selText = t(/<div [^>]*class="visually-hidden">([^<]*)<\/div>/);
must(jump.length === 2, 'jump nav');

// ---- stain picker (3 cycles of 72 labels, as the live picker renders; index 108 selected) ----
const pickSeg = mainRaw.slice(mainRaw.indexOf('class="m-style-picker-content'));
const labels = [...pickSeg.slice(0, pickSeg.indexOf('m-style-picker-grids')).matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);
must(labels.length === 216 && labels[108].trim() === 'mayonnaise', `picker labels ${labels.length} ${labels[108]}`);
const SEL = 108;
const picker = (mod) => `<div class="alp-picker alp-picker--${mod}" data-picker data-selected="${SEL}">
    <div class="alp-picker__mask alp-picker__mask--top"></div><div class="alp-picker__mask alp-picker__mask--bottom"></div>
    <div class="alp-picker__indicator"></div>
    <div class="alp-picker__scroll"><div class="alp-picker__list">${labels.map((l, i) => `<button type="button" class="alp-picker__item${i === SEL ? ' is-selected' : ''}" aria-label="${esc(l)}" tabindex="${i === SEL ? 0 : -1}">${esc(l.trim())}</button>`).join('')}</div></div>
   </div>
   <div class="visually-hidden" aria-live="polite" aria-atomic="true" data-picker-status>${selText}</div>`;
const learnMore = t(/<button class="event_button_click"[^>]*>([^<]*)<\/button>/);
const cantFind = mainRaw.match(/<a class="event_internal_link" href="([^"]+)">(Can[^<]*)<\/a>/);
must(cantFind, 'cant find link');

// ---- stain index ----
const searchLabel = t(/<div class="col-12 col-lg-8 article-listing-search"><span>([^<]*)<\/span>/);
const placeholder = t(/id="article-listing-search-input"[^>]*placeholder="([^"]*)"/);
const cats = [...mainRaw.matchAll(/<div class="expandable-content\s+undefined" id="([^"]+)"[^>]*><div class="expandable-content-header"[^>]*>([^<]*)<svg[\s\S]*?<div class="article-listing-links-container">([\s\S]*?)<\/div><\/div><\/div><\/div>/g)]
  .map(([, id, name, links]) => ({ id, name, links: [...links.matchAll(/<a href="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map(([, href, text]) => ({ href, text })) }));
must(cats.length === 6 && cats.reduce((n, c) => n + c.links.length, 0) === 73, `cats ${cats.length}`);
const bgs = ['Stain-L1', 'Stain-R1', 'Stain-L2', 'Stain-R2', 'Stain-L3', 'Stain-R3'];
const dims = { 'Stain-L1': [246, 362], 'Stain-R1': [371, 397], 'Stain-L2': [330, 499], 'Stain-R2': [368, 604], 'Stain-L3': [431, 734], 'Stain-R3': [351, 395] };

// ---- guide header icons ----
const icons = [...mainRaw.matchAll(/<div class="row no-gutters\s+justify-content-start\s+alp-icons-section-icon[\s\S]*?<source srcset="[^"]*\/([\w-]+)\.png\?fm=webp" type="image\/webp" media="\(min-width: 992px\)">[\s\S]*?<img[^>]*alt="([^"]*)"[^>]*src="[^"]*\/([\w-]+)\.png[\s\S]*?<div class="richtext-container ">([\s\S]*?)<\/div>/g)]
  .map(([, desk, a, mob, rt]) => ({ desk, alt: a, mob, rt: rt.replace(/<p><\/p>/, '<p></p>') }));
must(icons.length === 5, `icons ${icons.length}`);
const iconDims = { 'alp-blood-and-grass-icon-v2': [91, 100], 'alp-body-soils-icon-v2': [90, 100], 'alp-bleachable-icon': [111, 104], 'alp-clay-soil-dirt-icon-v2': [91, 100] };
const guideH2 = t(/<h2 id="your-comprehensive-stain-removal-guide">([^<]*)<\/h2>/);
const guideH5 = t(/<h2 id="your-comprehensive-stain-removal-guide">[^<]*<\/h2><h5>([^<]*)<\/h5>/);

// ---- step guide ----
const gh = mainRaw.match(/<div class="col-12 col-lg-6"><h3>([^<]*)<\/h3><p>([^<]*)<\/p>/);
must(gh, 'guide headline');
const stepsRaw = mainRaw.slice(mainRaw.indexOf('guide-steps-container'), mainRaw.indexOf('direction-column'));
const steps = stepsRaw.split('<div class="guide-step-wrapper">').slice(1).map((s) => {
  const title = s.match(/<div class="guide-step-title"><p>([^<]*)<\/p>/)[1];
  const text = s.match(/<div class="richtext-container guide-step-text">([\s\S]*?)<\/div>/)[1];
  const subs = s.split('<div class="guide-substep">').slice(1).map((ss) => {
    const prods = [...ss.matchAll(/<div class="guide-substep-product"><a href="([^"]+)"[^>]*>[\s\S]*?<img[^>]*src="[^"]*\/([\w.-]+)\.png[^"]*"[^>]*alt="([^"]*)"|<div class="guide-substep-product"><a href="([^"]+)"[^>]*>[\s\S]*?<img[^>]*alt="([^"]*)"[^>]*src="[^"]*\/([\w.-]+)\.png/g)];
    return {
      title: ss.match(/<div class="guide-substep-title"><p>([^<]*)<\/p>/)[1],
      text: ss.match(/<div class="guide-substep-text">([\s\S]*?)<\/div>/)[1],
      h5: (ss.match(/<div class="guide-substep-products"><h5>([^<]*)<\/h5>/) || [])[1],
      prods: [...ss.matchAll(/<div class="guide-substep-product">([\s\S]*?)<\/a><\/div>/g)].map(([, p]) => ({
        href: p.match(/<a href="([^"]+)"/)[1],
        file: p.match(/ctfassets\.net\/[^"]*\/([\w.-]+)\.png/)[1],
        alt: p.match(/<img[^>]*alt="([^"]*)"/)[1],
        name: p.match(/<span class="guide-substep-product-name">([\s\S]*?)<\/span>/)[1],
      })),
    };
  });
  return { title, text, subs };
});
must(steps.length === 5 && steps[1].subs.length === 5, `steps ${steps.length}`);
const prodDims = { '92OZ_UltraStainRelease_v01_smpl_1200x1200': [1200, 1200], Tide_Plus_Bleach_Powder_hero_521x480: [521, 480] };
const closing = t(/direction-column[\s\S]*?<div class="richtext-container ">([\s\S]*?)<\/div>/);
const toTop = mainRaw.match(/<button class="scroll-to-top-btn[^>]*>(<svg[\s\S]*?<\/svg>)<span>([^<]*)<\/span>/);
must(toTop, 'back to top');

const cleanLinks = (html) => html.replace(/ class="event_internal_link"/g, '').replace(/\s+data-[\w-]+="[^"]*"/g, '');
const body = page.body.join('\n');
for (const s of [h1, shortText, steps[0].title, steps[4].title, gh[1]]) must(body.includes(s.replace(/&amp;/g, '&')) || page.headings.some((h) => h.text === s), `not in capture: ${s}`);

const mainHtml = `<main id="site-content" class="alp">
<section class="alp-intro">
 <div class="alp-intro__image"><picture><img src="${I}ALP_header_1_How_to_remove_stains_1437x400.webp" alt="${alt('ALP_header_1_How_to_remove_stains_1437x400.jpg')}" width="1437" height="400"></picture></div>
 <div class="alp-intro__bottom">
  <div class="container">
   <div class="alp-intro__bar">
    <nav class="alp-crumbs" aria-label="${navAria}"><ul class="alp-crumbs__list">${crumbs.join('')}</ul></nav>
    <div class="alp-share"><div class="alp-share__buttons">${shareLinks}</div></div>
   </div>
   <div class="alp-intro__text">
    <h1 class="alp-intro__title">${h1}</h1>
    <p class="alp-intro__short">${shortText}</p>
    <p class="alp-intro__main">${mainText}</p>
   </div>
  </div>
 </div>
 <div id="sticky-nav-anchor"></div>
 <div class="anchor-nav" id="sticky-nav"><div class="container"><nav><ul>
  <li><span role="button" tabindex="0" aria-label="${jumpAria[0]}" data-target="browse-by-stain-type">${jump[0]}</span></li>
  <li><span role="button" tabindex="0" aria-label="${jumpAria[1]}" data-target="stain-removal-guide">${jump[1]}</span></li>
 </ul></nav></div></div>
</section>
<div class="alp-content">
<span class="alp-anchor"><span id="browse-by-stain-type"></span></span>
<section class="alp-spinner">
 <div class="alp-spinner__inner">
  <picture><img class="alp-spinner__image" src="${I}how_to_remove_stains.webp" alt="${alt('how_to_remove_stains.png')}" width="874" height="861"></picture>
  <div class="container">
   <h2 class="alp-spinner__title">${t(/<h2>(Stain removal guide)<\/h2>/)}</h2>
   <div class="alp-spinner__row">
    <div class="alp-spinner__left"><span class="alp-spinner__ihavea">${t(/<span class="ihavea">([^<]*)<\/span>/)}</span></div>
    <div class="alp-spinner__mobile">
   ${picker('mobile')}
    </div>
    <div class="alp-spinner__desktop">
   ${picker('desktop')}
     <button type="button" class="alp-spinner__arrow alp-spinner__arrow--up" aria-label="Previous item"></button><button type="button" class="alp-spinner__arrow alp-spinner__arrow--down" aria-label="Next item"></button>
    </div>
    <div class="alp-spinner__right"><span class="alp-spinner__stain">${t(/<span class="stain">([^<]*)<\/span>/)}</span><div><button type="button" class="alp-spinner__go" aria-label="Stain removal guide: Learn more">${learnMore}</button><a class="alp-spinner__cant" href="${cantFind[1]}">${cantFind[2]}</a></div></div>
   </div>
  </div>
 </div>
</section>
<section class="alp-listing">
 <div class="alp-listing__bgs" aria-hidden="false">${bgs.map((b) => `<picture><img src="${I}${b}.webp" alt="${alt(`${b}.png`)}" width="${dims[b][0]}" height="${dims[b][1]}" loading="lazy"></picture>`).join('')}</div>
 <div class="container"><div class="alp-listing__row">
  <div class="alp-search"><label class="alp-search__label" for="article-listing-search-input">${searchLabel}</label><div class="alp-search__field"><input id="article-listing-search-input" type="text" placeholder="${placeholder}" autocomplete="off"><div class="alp-search__results" hidden></div></div></div>
  <div class="alp-listing__list">
${cats.map((c) => `   <div class="alp-cat" id="${c.id}"><div class="alp-cat__header" role="button" tabindex="0" aria-expanded="false" aria-controls="${c.id}-content" aria-label="${c.name}">${c.name}${chevron.replace('<svg ', '<svg aria-hidden="true" ').replace(' aria-hidden="true" aria-hidden="true"', ' aria-hidden="true"')}</div><div class="alp-cat__content" id="${c.id}-content"><div class="alp-cat__links">${c.links.map((l) => `<div><a href="${l.href}">${l.text}</a></div>`).join('')}</div></div></div>`).join('\n')}
  </div>
 </div></div>
</section>
<span class="alp-anchor"><span id="stain-removal-guide"></span></span>
<section class="alp-types">
 <div class="container">
  <div class="alp-types__head"><h2 id="your-comprehensive-stain-removal-guide">${guideH2}</h2><h5>${guideH5}</h5><p></p></div>
  <div class="alp-types__icons">
${icons.map((ic) => { const [w, h] = iconDims[ic.desk]; return `   <div class="alp-types__icon"><picture><source srcset="${I}${ic.desk}.webp" media="(min-width: 992px)" width="${w}" height="${h}"><img src="${I}${ic.mob}.webp" alt="${ic.alt}"></picture><div class="alp-types__text">${ic.rt}</div></div>`; }).join('\n')}
  </div>
 </div>
</section>
<section class="alp-guide">
 <div class="container">
  <div class="alp-guide__head"><div class="alp-guide__stripe"></div><div class="alp-guide__intro"><h3>${gh[1]}</h3><p>${gh[2]}</p></div></div>
  <div class="alp-steps">
${steps.map((s) => `   <div class="alp-step"><div class="alp-step__bar" aria-hidden="true"><span class="alp-step__top"></span><span class="alp-step__mark"></span><span class="alp-step__bottom"></span></div><div class="alp-step__content"><div class="alp-step__title"><p>${s.title}</p></div><div class="alp-step__text">${cleanLinks(s.text)}</div>${s.subs.length ? `<div class="alp-substeps">${s.subs.map((ss) => `<div class="alp-substep"><div class="alp-substep__title"><p>${ss.title}</p></div><div class="alp-substep__text">${cleanLinks(ss.text)}</div>${ss.prods.length ? `<div class="alp-substep__products"><h5>${ss.h5}</h5><div class="alp-substep__grid">${ss.prods.map((p) => `<div class="alp-product"><a href="${p.href}"><div class="alp-product__image"><picture><img src="${I}${p.file}.webp" alt="${p.alt}" width="${prodDims[p.file][0]}" height="${prodDims[p.file][1]}" loading="lazy"></picture></div><div class="alp-product__name">${p.name}</div></a></div>`).join('')}</div></div>` : ''}</div>`).join('')}</div>` : ''}</div></div>`).join('\n')}
  </div>
 </div>
</section>
<section class="alp-closing"><div class="container"><div class="alp-closing__col">${cleanLinks(closing)}</div></div></section>
</div>
<div class="alp-totop"><button type="button" class="alp-totop__btn" aria-label="${toTop[2]}">${toTop[1]}<span>${toTop[2]}</span></button></div>
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
console.log('wrote', html.length, 'cats', cats.length, 'steps', steps.length, 'icons', icons.length);
