// Generates stardust/prototypes/en-us-click2cart-0060001-proposed.html (click2cart archetype).
// The live page has NO site header: the click2cart "shopper choice" widget fills the first viewport,
// followed by the standard tide.com footer. Footer lifted verbatim from the gated home prototype
// (en-us-proposed.html); the widget is authored here from stardust/current/pages/en-us-click2cart-0060001.json
// (+ its rendered-DOM sidecar for the hidden Instacart product accordion and sr-only strings).
// Retailer order is randomised per load on live (nondeterministic) — frozen to the extract capture's order.
import fs from 'fs';
const root = '/workspace/5db7d055/stardust';
const slug = 'en-us-click2cart-0060001';
const page = JSON.parse(fs.readFileSync(`${root}/current/pages/${slug}.json`, 'utf8'));
const home = fs.readFileSync(`${root}/prototypes/en-us-proposed.html`, 'utf8');
const footer = home.slice(home.indexOf('<footer'), home.indexOf('</footer>') + '</footer>'.length);
if (!footer.includes('site-footer')) throw new Error('footer lift failed');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const I = 'assets/img/c2c/';
// [name, logo file, alt, background, enabled (has an offer)]
const retailers = [
  ['WALMART', 'walmart_usa_dark.svg', 'Walmart logo', 'rgb(0, 113, 220)', false],
  ['INSTACART', 'instacart_usa_dark.svg', 'Instacart logo', 'rgb(0, 62, 41)', true],
  ['AMAZON', 'amazon_usa_dark.svg', 'Amazon logo', 'rgb(0, 0, 0)', false],
  ['TARGET', 'target_usa_dark.svg', 'Target logo', 'rgb(205, 32, 39)', false],
];
const product = 'Tide OXI Boost Power PODS 45 ct';
const offer = '45 ct';

const retailer = ([name, logo, alt, bg, on]) => {
  const label = name[0] + name.slice(1).toLowerCase();
  const inner = on
    ? `<span class="retailer-name"> ${name} <br><p class="single-offer-info"><span> ${offer} </span></p></span>`
    : `<span class="retailer-name"> ${name} </span>`;
  const accordion = on
    ? `<div class="accordion-wrapper"><div class="product-container"><div class="product-image"></div><div class="product-content"><div class="product-description"><div class="product-name"> ${product}</div></div><div class="product-input"><div class="quantity"><div class="number-action up"><i class="fa fa-caret-up" aria-hidden="true"></i></div><span class="sr-only">Add quantity to ${product}</span><input aria-label="Quantity. Use your arrow keys to add or subtract." type="number" value="1" min="1"><div class="number-action down"><i class="fa fa-caret-down" aria-hidden="true"></i><span class="sr-only">Subtract quantity to ${product}</span></div></div></div></div></div></div>`
    : '<div class="accordion-wrapper"></div>';
  return `<div class="retailer">
 <div class="retailer-button-container" style="background-color: ${bg};">
  <div class="retailer-button" role="button" tabindex="0" aria-label="${on ? `Click or press enter to trigger ${label}'s transfer process` : ''}"${on ? ` data-retailer="${label}"` : ''}>
   <div class="retailer-button-logo"><img src="${I}${logo}" alt="${alt}" width="60" height="60"></div>
   <div class="retailer-button-content"><span class="main-text">${inner}<br></span></div>
   <div class="retailer-type-icon${on ? '' : ' disabled'}"><i class="fa fa-angle-right" aria-hidden="true" style="-webkit-text-stroke: 1px ${on ? bg : 'rgb(157, 157, 157)'};"></i></div>
  </div>
 </div>
 <div class="break"></div>
 <div class="retailer-button-accordion"><div class="accordion-body">${accordion}</div></div>
 <div class="sc-modal" role="dialog" aria-label="${label} oauth info modal"></div>
</div>`;
};

const h1 = page.headings[0].text;
const hero = page.media.imgs[0];
const main = `<div class="shopper-choice">
<div class="container bordered" id="shopper-choice-container" role="main">
<div class="scrolling-container" id="scrolling-container">
 <div class="header-container">
  <div class="custom-banner-wrapper"><div class="banner-img"><img id="asset-banner-image" src="${I}shopper-choice-hero.jpeg" alt="${esc(hero.alt)}" width="2000" height="2000"></div></div>
  <div class="custom-header-wrapper"><div class="header-text"><h1><p><span class="h1-strut"></span>${esc(h1)}</p></h1></div></div>
 </div>
 <div class="sc-content" id="branded-sc-container" role="complementary" aria-label="Product availability and purchase options">
  <div class="overflow-wrapper" id="retailer-buttons-wrapper" role="region" aria-label="Retailer buttons list container">
${retailers.map(retailer).join('\n')}
  </div>
 </div>
</div>
<div class="footer-content" id="sc-footer-content">
 <div class="bottom-footer-actions">
  <div class="change-zip"><div class="zip-code-change-container" role="button" tabindex="0"><i class="fa fa-map-marker zip-code-icon" aria-hidden="true"></i><span class="sr-only">Open zip code change dialog</span><span class="current-zip">95141</span></div><div class="sc-modal" role="dialog" aria-label="Zipcode change modal"></div></div>
  <div class="smartcommerce-brand"><img src="${I}c2c-logo.svg" alt="Click2Cart logo" width="145" height="27"></div>
 </div>
 <div class="footer-links"><a class="privacy-policy-link" href="https://www.smartcommerce.com/privacy-policy">Privacy Policy</a></div>
</div>
</div>
</div>
`;

const html = `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<link rel="icon" href="assets/favicon.ico">
<link rel="stylesheet" href="canon/canon.css">
<link rel="stylesheet" href="${slug}.css">
</head>
<body>
<div id="app-root">
${main}${footer}</div>
<script src="canon/canon.js" defer></script>
<script src="${slug}.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(`${root}/prototypes/${slug}-proposed.html`, html);
console.log('wrote', html.length);
