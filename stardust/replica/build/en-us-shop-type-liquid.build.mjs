// Generates stardust/prototypes/en-us-shop-type-liquid-proposed.html (product-listing archetype).
// Header + footer + locale modal are lifted verbatim from the gated home prototype (en-us-proposed.html);
// main content is authored here from stardust/current/pages/en-us-shop-type-liquid.json (+ __NEXT_DATA__
// relatedArticles for the mobile-only "Related articles" list).
import fs from 'fs';
const root = '/workspace/5db7d055/stardust';
const home = fs.readFileSync(`${root}/prototypes/en-us-proposed.html`, 'utf8');
const header = home.slice(home.indexOf('<header class="site-header"'), home.indexOf('<main'));
const footer = home.slice(home.indexOf('<footer'), home.indexOf('</footer>') + '</footer>'.length);
if (!header.includes('locale-overlay') || !footer.includes('site-footer')) throw new Error('chrome lift failed');

const I = 'assets/img/';
const chevPath = 'M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17';
const chev = (cls = '', extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10"${cls ? ` class="${cls}"` : ''}${extra}><path d="${chevPath}" transform="translate(0 10) rotate(-90)" fill="#13259c"/></svg>`;
const starPath = 'M26.8,9.7l-7.4-1.1l-3.3-6.7c-0.2-0.4-0.5-0.7-0.9-0.8C14.8,1,14.4,1,14,1.1c-0.4,0.1-0.7,0.4-0.9,0.8L9.8,8.6 L2.4,9.7C2,9.7,1.6,10,1.4,10.3C1.1,10.6,1,11,1,11.4c0,0.4,0.2,0.8,0.5,1.1l5.4,5.2l-1.3,7.4c-0.1,0.4,0,0.8,0.2,1.1 C6,26.6,6.4,26.9,6.8,27c0.4,0.1,0.8,0,1.2-0.2l6.6-3.5l6.7,3.5c0.2,0.1,0.5,0.2,0.8,0.2c0.1,0,0.3,0,0.4-0.1 c0.4-0.1,0.7-0.3,0.9-0.7c0.2-0.3,0.3-0.7,0.2-1.1l-1.3-7.4l5.4-5.2c0.3-0.3,0.5-0.7,0.5-1.1c0-0.4-0.1-0.8-0.4-1.1 C27.6,10,27.2,9.7,26.8,9.7z';
const star = kind => `<svg class="star star--${kind}" viewBox="0 0 29.2 28" aria-hidden="true"><path d="${starPath}"/></svg>`;
// rating widget, structured like the live one (role=img per star with sr-only "Star"; partial star = clipped full over empty)
const stars = (rating, partialPct) => {
  const full = Math.floor(rating);
  const out = [];
  for (let i = 0; i < 5; i++) {
    let inner;
    if (i < full) inner = `<span>${star('full')}</span>`;
    else if (i === full) inner = `<span class="stars__container"><span class="stars__fill" style="width: ${partialPct}%;">${star('full')}</span>${star('empty')}</span>`;
    else inner = `<span>${star('empty')}</span>`;
    out.push(`<span class="stars__item" role="img" aria-label="${i + 1} out of 5 stars"><span class="visually-hidden">Star</span>${inner}</span>`);
  }
  return `<span class="stars" aria-label="${rating} out of 5 stars">${out.join('')}</span>`;
};
const xSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" aria-hidden="true"><path d="M7.813,7l4.915-5.292a1.055,1.055,0,0,0,0-1.415.883.883,0,0,0-1.313,0L6.5,5.586,1.585.293a.881.881,0,0,0-1.313,0,1.054,1.054,0,0,0,0,1.414L5.187,7,.272,12.293a1.054,1.054,0,0,0,0,1.414A.893.893,0,0,0,.929,14a.893.893,0,0,0,.656-.293L6.5,8.414l4.915,5.293a.882.882,0,0,0,1.313,0,1.054,1.054,0,0,0,0-1.414Z" fill="#13259c"/></svg>';
const gridSvg = '<svg width="39" height="34" viewBox="0 0 39 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="#FB4C06"><rect x="13" y="11" width="6" height="5"/><rect x="20" y="11" width="6" height="5"/><rect x="20" y="17" width="6" height="5"/><rect x="13" y="17" width="6" height="5"/></g></svg>';
const listSvg = '<svg width="39" height="34" viewBox="0 0 39 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(15 11)" stroke="#FB4C06" stroke-width="3"><line x1="0" y1="0.34375" x2="13" y2="0.34375"/><line x1="0" y1="5.15625" x2="13" y2="5.15625"/><line x1="0" y1="10.65625" x2="13" y2="10.65625"/></g><g fill="#FB4C06"><rect x="10" y="10" width="3" height="3"/><rect x="10" y="15" width="3" height="3"/><rect x="10" y="21" width="3" height="3"/></g></svg>';

const P = '/en-us/shop/type/liquid/';
const needs = [['Odor Removal', 'odor-removal'], ['Deep Clean', 'deep-clean'], ['Stain Removal', 'stain-removal'], ['Sensitive', 'sensitive'], ['Delicates', 'delicates'], ['Bright Colors', 'bright-colors'], ['Whiteness', 'whiteness'], ['Additives', 'additives'], ['Freshness/Scent', 'freshness']];

// [slug, image, alt, title html, rating, partial %, reviews, description, retailer aria-label]
const products = [
  ['tide-original-liquid', 'Tide_TheRock_EN-US_20250811_listing_520x520.webp', 'Bottle of Tide Original Scent Liquid Laundry Detergent', 'Tide <strong>Original</strong> Liquid Laundry Detergent', 4.4008, 40, 3206, 'Designed even for cold', 'Tide Original Scent Liquid Laundry Detergent Products Find Retailers'],
  ['tide-free-and-gentle-liquid', 'Tide_Free_and_Gentle_HDL_LI_520x520_20260930.webp', 'Tide&nbsp;Free and Gentle&nbsp;Liquid Laundry Detergent - 92 ounces, color white', 'Tide <strong>Free and Gentle</strong> Liquid Laundry Detergent', 4.3915, 40, 1106, 'Keeps your clothes brilliantly clean and your family’s skin safe.&nbsp;', 'Tide Free &amp; Gentle Liquid Laundry Detergent Find Retailers'],
  ['tide-ultra-oxi-he-liquid', '003131-22_BigMamma_Oxi_Boost_EN-US_HDL_listing_520x520.webp', 'Tide Ultra OXI High Efficiency Liquid Laundry Detergent', 'Tide <strong>Ultra OXI Boost</strong> High Efficiency Liquid Laundry Detergent', 4.3827, 40, 452, 'Built-in pre-treaters to remove even the toughest stains.', 'Tide Ultra HE Turbo Clean Concentrated Tide Ultra Oxi Liquid Detergent Find Retailers'],
  ['tide-plus-a-touch-of-downy-liquid', '_listing_520x520Tide_Downy_April_Fresh_US_HDL.webp', 'Tide Plus A Touch of Downy Liquid Laundry Detergent', 'Tide Plus A <strong>Touch of Downy</strong> Liquid Laundry Detergent', 4.1255, 10, 271, 'Offers the brilliant clean you know and love.', 'Tide Plus A Touch of Downy Liquid - April Fresh Find Retailers'],
  ['tide-oxi-with-odor-eliminators', '003131-22_BigMamma_Odor_EN-US_HDL_listing_520x520.webp', 'Tide Ultra OXI Liquid Laundry Detergent with Odor Eliminators - 69 ounces, color orange', 'Tide <strong>Ultra OXI</strong> Liquid Laundry Detergent with Odor Eliminators', 4.6351, 60, 370, 'Leaves laundry clothes looking good and smelling good, all at once!', 'Tide OXI with Odor Eliminators Liquid Laundry Detergent Find Retailers'],
  ['tide-spring-meadow-liquid', 'Tide_Spring_Meadow_HDL_listing_520x520.webp', 'Tide Spring Meadow Liquid Detergent', 'Tide <strong>Spring Meadow</strong> Liquid Laundry Detergent', 4.6711, 70, 149, 'Provides a powerful clean with a fresh floral scent, even in cold water.', 'Laundry Detergent and Fabric Care Products - Tide Find Retailers'],
  ['tide-simply-all-in-one-refreshing-breeze', 'Tide_Simply_All_in_One_RB_EN-US_20250520_listing_520x520.webp', 'Tide Simply Clean and Fresh Liquid Laundry Detergent Refreshing Breeze - 25 ounces, color yellow', 'Tide <strong>Simply All-In-One</strong> Liquid Laundry Detergent, <strong>Refreshing Breeze</strong>', 3.5342, 50, 322, 'Experience the right clean at just the right price.', 'Tide Simply Clean and Fresh - Refreshing Breeze Find Retailers'],
];
const promos = {
  2: ['How Does HE Turbo Work?', '/en-us/how-to-wash-clothes/washing-machine-101/how-to-use-an-he-washer/how-does-he-turbo-work', 'TideLiquidTowels_A005_C020_00_370x320.webp', 'How Does HE Turbo Work?', 'Read More about How Does HE Turbo Work?'],
  6: ['How Much Laundry Detergent to Use', '/en-us/how-to-wash-clothes/how-to-do-laundry/how-much-detergent-to-use', 'Tide_PouringLiquidMachine_096_S3_370x320_v2.webp', 'A hand pouring Tide liquid laundry detergent into the dispenser drawer of a washing machine', 'Read More about How Much Laundry Detergent to Use '],
};

const retailer = aria => `<button class="retailer-btn" type="button" aria-label="${aria}">Find Retailers</button>`;
const product = ([slug, img, alt, title, rating, pct, n, desc, aria]) => `<div class="plp-grid__col product">
 <div class="product-card">
  <div class="product-card__image"><a href="${P}${slug}"><picture><img src="${I}${img}" alt="${alt}" width="520" height="520" loading="lazy"></picture></a></div>
  <div class="product-card__body">
   <div class="product-card__content"><a class="product-card__title" href="${P}${slug}"><p>${title}</p></a>
    <div class="product-card__rating" role="img" aria-label="${rating} out of 5 stars, ${n} reviews"><span aria-hidden="true">${stars(rating, pct)}</span><span class="product-card__count" aria-hidden="true">(<!-- -->${n}<!-- -->)</span></div>
    <p class="product-card__desc">${desc}</p>
   </div>
   ${retailer(aria)}
  </div>
  ${retailer(aria).replace('retailer-btn', 'retailer-btn retailer-btn--mobile')}
 </div>
</div>`;
const promo = ([title, href, img, alt, aria]) => `<div class="plp-grid__col promo">
 <div class="promo-card">
  <div class="promo-card__content"><div class="promo-card__title"><p>${title}</p></div><a class="promo-card__link" href="${href}" aria-label="${aria}">Read More</a></div>
  <div class="promo-card__image"><picture><img src="${I}${img}" alt="${alt}" width="370" height="320" loading="lazy"></picture></div>
 </div>
</div>`;
const cells = [];
let pi = 0;
for (let i = 0; i < 9; i++) cells.push(promos[i] ? promo(promos[i]) : product(products[pi++]));

const related = [
  ['How Does HE Turbo Work?', 'Do you want to know how HE turbo works to improve your laundry experience? Visit the website and learn about Tide\'s HE Turbo and how it works!', '/en-us/how-to-wash-clothes/washing-machine-101/how-to-use-an-he-washer/how-does-he-turbo-work', 'Final_article_preview_TideLiquidBottle_In_A003_C066_00-370x320.webp', 'A hand holding a bottle of orange Tide Original liquid laundry detergent in front of a white washing machine', 'Read More about How Does HE Turbo Work?'],
  ['How Much Laundry Detergent to Use', 'Ever seen white residues on your clothes after washing and thought... “I’ve used too much detergent in that load!”', '/en-us/how-to-wash-clothes/how-to-do-laundry/how-much-detergent-to-use', 'Tide_PouringLiquidMachine_096_S3_370x320.webp', 'How Much Laundry Detergent to Use ', 'Read More about How Much Laundry Detergent to Use '],
  ['Unlock the Power of Tide PODS®: How They Work &amp; Their Key Benefits', 'Tide PODS® give you everything you need for a worry-free clean in easy-to-handle pacs.', '/en-us/our-commitment/americas-number-one-detergent/our-products/laundry-pacs/how-tide-pods-work', 'discover_how_tide_pods_and_power_pods_work_article_card.webp', 'A hand holding a Tide PODS capsule in front of a white washing machine', 'Read More about Unlock the Power of Tide PODS®: How They Work &amp; Their Key Benefits'],
];
const relArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="11" viewBox="0 0 17 10" aria-hidden="true"><path d="${chevPath}" transform="translate(0 10) rotate(-90)"/></svg>`;

// [modifier, title, paragraph, desktop image, mobile image, alt, trailing empty p]
const banners = [
  ['orange', 'Works in all washing machines', 'Whether you’re looking for a detergent that’s compatible with high-efficiency or regular washers, Tide has you covered.', 'Tide_Features_Machine_Care_DT_1168x578_img_1.webp', 'Tide_Features_Machine_Care_SP_700x1369_img.webp', 'Washing machine in operation', 1369],
  ['orange', 'A varied range of detergents', 'Tide liquid detergents can provide stain removal, whitening, or even the fresh scent of Febreze for great laundry results.', 'Tide_Features_Liquid_DT_1168x578_img.webp', 'Tide_Features_Liquid_SP_700x1369_img.webp', 'A person pouring Tide liquid detergent into the detergent dispenser', 1369],
  ['white', 'Powerful liquid laundry detergent', 'Tide liquid laundry detergent gives you the results you want.', 'Tide_Features_colorful_clothes_DT-right_1168x578_white_202211231429.webp', 'Tide_Features_colorful_clothes_SP_700x1073_white_202211231433.webp', 'A pile of neatly folded, colorful clothes', 1073],
];
const banner = ([mod, h, p, dt, sp, alt, spH]) => `<section class="feature-banner feature-banner--${mod}"><div class="container"><div class="feature-banner__inner">
 <picture><source media="(min-width: 992px)" srcset="${I}${dt}" width="1168" height="578"><img src="${I}${sp}" alt="${alt}" width="700" height="${spH}" loading="lazy"></picture>
 <div class="feature-banner__text"><h4>${h}</h4><p>${p}</p></div>
</div></div></section>`;

const main = `<main id="site-content" class="tide-product-listing-page">
<div class="container plp-top">
 <nav class="breadcrumbs" aria-label="Breadcrumbs"><ol itemscope itemtype="https://schema.org/BreadcrumbList"><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/en-us/shop" aria-label="Shop Products" itemprop="item"><span itemprop="name">Shop Products</span></a><meta itemprop="position" content="1"></li><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><span itemprop="name">Browse by Type</span><meta itemprop="position" content="2"></li><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><span itemprop="name" aria-current="page">Liquid</span><meta itemprop="position" content="3"></li></ol></nav>
 <div class="plp-title-bar"><h1>Shop <strong>Tide Liquid Detergents</strong></h1><button class="plp-title-bar__btn" type="button">Browse other products</button></div>
 <div class="plp-action-bar">
  <div class="plp-action-bar__count">20 Products</div>
  <div class="plp-action-bar__actions">
   <div class="plp-sorting"><span>Sort by:</span><label class="plp-sorting__select"><select name="sortBy" aria-label="Sort products by"><option value="default">Popularity</option><option value="rating">Product Rating</option><option value="title_az">Product A-Z</option><option value="title_za">Product Z-A</option></select>${chev()}</label></div>
   <div class="plp-display-type"><button class="is-active" type="button" aria-label="Change display to grid active">${gridSvg}</button><button type="button" aria-label="Change display to list inactive">${listSvg}</button></div>
  </div>
 </div>
 <div class="plp-filter-bar">
  <div class="plp-filter-bar__title"><span>Filter by Need${chev('plp-filter-bar__toggle', ' role="button" tabindex="0" aria-label="Toggle filter bar" aria-expanded="true"')}</span></div>
  <div class="plp-filter-bar__buttons">${needs.map(([t, s]) => `<a class="plp-filter-btn" href="${P}${s}" aria-label="${t}">${xSvg}${t}</a>`).join('')}</div>
 </div>
 <div class="plp-grid">
${cells.join('\n')}
 </div>
 <button class="plp-load-more" type="button">Load more products</button>
 <template id="plp-related-tpl"><section class="plp-related" aria-labelledby="plp-related-title">
  <h3 class="plp-related__title" id="plp-related-title">Related articles</h3>
  <ul>${related.map(([t, d, h, img, alt, aria]) => `<li class="plp-related__item"><div class="plp-related__image"><a href="${h}"><picture><img src="${I}${img}" alt="${alt}" width="370" height="320" loading="lazy"></picture></a></div><div class="plp-related__content"><p class="plp-related__item-title">${t}</p><p class="plp-related__item-text">${d}</p><a class="plp-related__link" href="${h}" aria-label="${aria}">Read More</a></div><a class="plp-related__arrow" href="${h}" aria-label="${aria}">${relArrow}</a></li>`).join('')}</ul>
 </section></template>
</div>
<div class="plp-features">
 <div class="container plp-features__intro"><h3>Why shop liquid detergent</h3></div>
${banners.map(banner).join('\n')}
</div>
</main>`;

const html = `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shop Liquid and HE Liquid Laundry Detergents - Tide</title>
<meta name="description" content="Looking for an effective laundry detergent? Regular or high-efficiency washers, Tide has you covered! Discover all the options available from Tide, right here! ">
<link rel="icon" href="assets/favicon.ico">
<link rel="stylesheet" href="canon/canon.css">
<link rel="stylesheet" href="en-us-shop-type-liquid.css">
</head>
<body>
<div id="page-wrapper">
${header}${main}
${footer}
</div>
<script src="canon/canon.js" defer></script>
<script src="en-us-shop-type-liquid.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(`${root}/prototypes/en-us-shop-type-liquid-proposed.html`, html);
console.log('wrote en-us-shop-type-liquid-proposed.html', html.length);
