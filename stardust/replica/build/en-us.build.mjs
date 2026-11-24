// Generates stardust/prototypes/en-us-proposed.html (stain picker lists come from the captured DOM list).
import fs from 'fs';
const root = '/workspace/5db7d055/stardust';
const stains = fs.readFileSync(`${root}/.work/en-us/stains.txt`, 'utf8').trim().split('\n').map(l => l.split('|'));
const SEL = 108;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const pickerItems = stains.map(([label, text], i) =>
  `<button class="picker__item${i === SEL ? ' is-selected' : ''}" type="button" aria-label="${esc(label)}">${esc(text)}</button>`).join('');
const chev = (fill = '#13259c', extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10"${extra}><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)" fill="${fill}"/></svg>`;
const arrowSvg = chev('#fff');
const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16.605" height="19.271" viewBox="0 0 16.605 19.271"><g transform="translate(1.5 1.5)"><circle cx="6" cy="6" r="6" fill="none" stroke-miterlimit="10" stroke-width="3"/><path d="M-3.306,0l3.07,3.952" transform="translate(13.236 11.715)" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3"/></g></svg>`;
const userSvg = `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 12.5C1.25 6.56294 6.06294 1.75 12 1.75C17.9371 1.75 22.75 6.56294 22.75 12.5C22.75 18.4371 17.9371 23.25 12 23.25C6.06294 23.25 1.25 18.4371 1.25 12.5ZM12 3.25C6.89136 3.25 2.75 7.39136 2.75 12.5C2.75 17.6086 6.89136 21.75 12 21.75C17.1086 21.75 21.25 17.6086 21.25 12.5C21.25 7.39136 17.1086 3.25 12 3.25Z" fill="#1B3392" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 9.5C8.75 7.70509 10.2051 6.25 12 6.25C13.7949 6.25 15.25 7.70509 15.25 9.5C15.25 11.2949 13.7949 12.75 12 12.75C10.2051 12.75 8.75 11.2949 8.75 9.5ZM12 7.75C11.0335 7.75 10.25 8.53351 10.25 9.5C10.25 10.4665 11.0335 11.25 12 11.25C12.9665 11.25 13.75 10.4665 13.75 9.5C13.75 8.53351 12.9665 7.75 12 7.75Z" fill="#1B3392" stroke="white" stroke-width="0.5" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10 15.75C7.74849 15.75 5.90541 17.5012 5.75939 19.7154C5.73213 20.1287 5.37497 20.4416 4.96166 20.4144C4.54834 20.3871 4.23538 20.03 4.26264 19.6166C4.46031 16.6194 6.95314 14.25 10 14.25H14C17.0429 14.25 19.5332 16.6131 19.7366 19.6048C19.7647 20.018 19.4525 20.3758 19.0393 20.4039C18.626 20.432 18.2682 20.1198 18.2401 19.7065C18.0898 17.4966 16.2486 15.75 14 15.75H10Z" fill="#1B3392" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I = 'assets/img/';
const menu = {
  'By Type': [['Pacs', '/en-us/shop/type/laundry-pods'], ['Liquid', '/en-us/shop/type/liquid'], ['Powder', '/en-us/shop/type/powder'], ['Stain Remover', '/en-us/shop/type/stain-remover'], ['Laundry Booster', '/en-us/shop/type/laundry-booster'], ['Fabric Care', '/en-us/shop/type/fabric-care'], ['Fabric Rinse', '/en-us/shop/type/fabric-rinse'], ['Laundry Tiles', '/en-us/shop/type/laundry-tiles']],
  'By Need': [['Stain Removal', '/en-us/shop/special-needs/stain-removal'], ['Odor Removal', '/en-us/shop/special-needs/odor-removal'], ['Freshness/Scent', '/en-us/shop/special-needs/freshness'], ['Whiteness', '/en-us/shop/special-needs/whiteness'], ['Bright Colors', '/en-us/shop/special-needs/bright-colors'], ['Sensitive', '/en-us/shop/special-needs/sensitive'], ['Additives', '/en-us/shop/special-needs/additives'], ['Deep Clean', '/en-us/shop/special-needs/deep-clean']],
  'Top Collection': [['Tide Free &amp; Gentle', '/en-us/shop/top-collections/tide-free-and-gentle'], ['Tide Plus Febreze', '/en-us/shop/top-collections/tide-plus-febreze'], ['Tide Simply', '/en-us/shop/top-collections/tide-simply'], ['Tide Plus Downy', '/en-us/shop/top-collections/tide-plus-downy'], ['Tide Ultra OXI', '/en-us/shop/top-collections/tide-ultra-oxi'], ['Tide POWER PODS®', '/en-us/shop/top-collections/tide-power-pods']],
};
const commit = [['Tide Coming Clean', '/en-us/our-commitment/superbowlLX'], ['Tide Boosted', '/en-us/our-commitment/tide-boosted'], ['Turn to Cold ', '/en-us/our-commitment/turn-to-cold'], ['Tide evo', '/en-us/our-commitment/tide-evo'], ['Don’t Pay for Water, Pay for Clean', '/en-us/our-commitment/dont-pay-for-water'], ['Tide in Space', '/en-us/our-commitment/tide-in-space'], ['America’s #1 Detergent', '/en-us/our-commitment/americas-number-one-detergent'], ['Loads of Hope', '/en-us/our-commitment/loads-of-hope'], ['Ingredients and Safety', '/en-us/our-commitment/ingredients-and-safety'], ['Tide Cleaners', '/en-us/our-commitment/tide-cleaners-laundry-service'], ['Sustainability', '/en-us/our-commitment/sustainability']];
const howto = [['How to Remove Stains', '/en-us/how-to-wash-clothes/how-to-remove-stains'], ['How to Do Laundry', '/en-us/how-to-wash-clothes/how-to-do-laundry'], ['Washing Different Fabrics and Colors', '/en-us/how-to-wash-clothes/washing-different-fabrics-and-colors'], ['Washing Machine 101', '/en-us/how-to-wash-clothes/washing-machine-101']];
const deals = [['Coupons and Rewards', '/en-us/rewards'], ['Laundry Deals', 'https://jebbit.tide.com/wljshvha?L=Full+Page&amp;JC=TideNAV'], ['Laundry Tips', '/en-us/rewards/laundrytips']];
const mi = ([t, h]) => `<div class="menu-item"><a href="${h}" role="menuitem" aria-label="${t}">${t}</a></div>`;
const dItem = ([t, h]) => `<li class="drawer__item"><a href="${h}">${t}</a></li>`;
const sub = (title, items) => `<li class="drawer__item"><button type="button" aria-expanded="false" data-sub>${title}${chev('#1b3392')}</button></li><li class="drawer__sub"><div><button class="drawer__back" type="button" data-back>${chev('#1b3392')}${title}</button><ul>${items}</ul></div></li>`;
const locLinks = `<a href="/"><img alt="USA flag" src="${I}CountrFlag_USA.jpg" width="32" height="20">US - English</a><a href="https://tide.com/es-us"><img alt="USA flag" src="${I}CountrFlag_USA.jpg" width="32" height="20">US - Spanish</a><a href="https://tide.ca"><img alt="USA flag" src="${I}CountrFlag_Canada.jpg" width="32" height="20">Canada - English</a><a href="https://tide.ca/fr-ca"><img alt="USA flag" src="${I}CountrFlag_Canada.jpg" width="32" height="20">Canada - French</a>`;
const panel = (id, title, items) => `<div class="drawer__panel" id="${id}"><button class="drawer__back" type="button" data-back>${chev('#1b3392')}${title}</button><ul>${items}</ul></div>`;

const header = `<header class="site-header" id="site-header"><a class="skip-to-content-link" href="#site-content">Skip to Content</a>
<div class="topbar"><div class="container"><div class="topbar__row">
 <div class="topbar__left"><span>Part of the P&amp;G Family</span>
  <div class="topbar__brands"><a href="https://us.pg.com"><picture><img src="${I}header_logo_png.webp" alt="P&amp;G icon" width="32" height="41"></picture></a><a href="https://downy.com/en-us"><picture><img src="${I}header_logo_downy.webp" alt="Downy icon" width="43" height="41"></picture></a><a href="https://www.bouncefresh.com/en-us"><picture><img src="${I}header_logo_bounce.webp" alt="Bounce icon" width="47" height="41"></picture></a></div></div>
 <div class="topbar__right" aria-label="Menu"><a href="/en-us/contact-us">Contact Us</a><button class="locale-btn" type="button" aria-label="Language selector US English selected" data-locale-open>US - English${chev()}</button><span class="user-link">${userSvg}<button role="link" type="button" data-signin>Sign in</button></span></div>
</div></div></div>
<div class="searchbar"><div class="container"><div class="searchbar__row">
 <button class="burger" aria-label="navigation menu" aria-expanded="false" aria-controls="mobile-nav-menu" type="button"><span></span><span></span><span></span><span></span></button>
 <div><a class="header-logo" href="/en-us"><img src="${I}brand_main_logo.svg" alt="Tide logo"></a></div>
 <div class="search"><form action="/en-us/search" role="search"><div class="input-wrap"><input type="search" placeholder="Search" aria-label="Search" name="q"><button type="submit" aria-label="Submit Search">${searchSvg}</button></div></form></div>
</div></div></div>
<div class="mainbar"><div class="container"><div class="mainbar__row"><div class="mainmenu" role="menu">
 <div class="menu-item" role="menuitem" aria-label="Shop Products" aria-expanded="false" tabindex="0"><a class="menu-item-title" href="/en-us/shop">Shop Products</a><div class="submenu submenu--cols" role="menu">${Object.entries(menu).map(([t, l]) => `<div class="submenu__col" role="menu"><span class="submenu__title">${t}</span>${l.map(mi).join('')}</div>`).join('')}</div></div>
 <div class="menu-item" role="menuitem" aria-label="Our Commitment" aria-expanded="false" tabindex="0"><a class="menu-item-title" href="/en-us/our-commitment">Our Commitment</a><div class="submenu" role="menu">${commit.map(mi).join('')}</div></div>
 <div class="menu-item" role="menuitem" aria-label="How to Wash Clothes" aria-expanded="false" tabindex="0"><a class="menu-item-title" href="/en-us/how-to-wash-clothes">How to Wash Clothes</a><div class="submenu" role="menu">${howto.map(mi).join('')}</div></div>
 <div class="menu-item" role="menuitem" aria-label="What’s New"><a class="menu-item-title" href="/en-us/latest-news">What’s New</a></div>
 <div class="menu-item" role="menuitem" aria-label="Coupons and Deals" aria-expanded="false" tabindex="0"><a class="menu-item-title" href="/en-us/rewards">Coupons and Deals</a><div class="submenu" role="menu">${deals.map(mi).join('')}</div></div>
</div></div></div></div>
<template id="drawer-tpl"><nav class="drawer" id="mobile-nav-menu" aria-label="Mobile navigation" tabindex="-1">
 <ul>
  ${sub('Shop Products', Object.entries(menu).map(([t, l]) => sub(t, l.map(dItem).join(''))).join(''))}
  ${sub('Our Commitment', commit.map(dItem).join(''))}
  ${sub('How to Wash Clothes', howto.map(dItem).join(''))}
  <li class="drawer__item"><a href="/en-us/latest-news">What’s New${chev('#1b3392')}</a></li>
  ${sub('Coupons and Deals', deals.map(dItem).join(''))}
 </ul>
 <a href="/en-us/contact-us">Contact Us</a>
 <button type="button" data-loc-open>Select Location</button>
 <span class="user-link">${userSvg}<button role="link" type="button" data-signin>Sign in</button></span>
 <div class="loc-panel"><div class="loc-panel__inner"><button type="button" data-loc-close><h6>${chev('#1b3392')}Please select a location</h6></button>${locLinks}</div></div>
</nav></template>
</header>
<div class="locale-overlay" id="locale-modal"><div class="locale-modal" role="dialog" aria-modal="true" aria-label="Please select a location" tabindex="-1"><button class="modal-close" type="button" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M1 1l14 14M15 1L1 15" stroke="#1b3392" stroke-width="2"/></svg></button><div><h6>Please select a location</h6><a href="/"><img alt="USA flag" src="${I}CountrFlag_USA.jpg" width="32" height="20">US - English</a><a href="https://tide.com/es-us"><img alt="USA flag" src="${I}CountrFlag_USA.jpg" width="32" height="20">US - Spanish</a><a href="https://tide.ca"><img alt="USA flag" src="${I}CountrFlag_Canada.jpg" width="32" height="20">Canada - English</a><a href="https://tide.ca/fr-ca"><img alt="USA flag" src="${I}CountrFlag_Canada.jpg" width="32" height="20">Canada - French</a></div></div></div>`;

const footerMenu = l => l.map(([t, h]) => `<div class="menu-item"><a href="${h}" role="menuitem" aria-label="${t}">${t}</a></div>`).join('');
const footer = `<footer class="site-footer" id="site-footer">
<div class="footer-social"><div class="container"><span>Ways to connect with us:</span><ul>
 <li><a href="https://www.facebook.com/Tide?fref=ts" aria-label="Facebook"><img src="${I}social_facebook.svg" alt="Facebook icon"></a></li>
 <li><a href="https://twitter.com/tide" aria-label="Twitter"><img src="${I}social_twitter.svg" alt="Twitter icon"></a></li>
 <li><a href="https://www.pinterest.com/tide/" aria-label="Pinterest"><img src="${I}social_pinterest.svg" alt="Pinterest icon"></a></li>
 <li><a href="https://www.youtube.com/channel/UCEPeWPjaF1CWCKXa3xTp7vw" aria-label="YouTube"><img src="${I}social_youtube.svg" alt="YouTube icon"></a></li>
</ul></div></div>
<div class="container"><div class="row">
 <div class="col col-lg-8 footer-nav"><div class="row">
  <div class="col"><p class="footer-nav__title">Shop Products</p></div>
  ${[['by-type', 'By Type'], ['by-need', 'By Need'], ['top-collection', 'Top Collection']].map(([id, t]) => `<div class="col col-md-4"><div class="expandable" id="${id}"><div class="expandable__header" role="heading" aria-level="4" aria-label="${t}" aria-expanded="false" tabindex="0">${t}<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)" fill="#13259c"/></svg></div><div class="expandable__content"></div></div></div>`).join('\n  ')}
 </div></div>
 <div class="col col-lg-4 footer-nav"><div class="row">
  <div class="col col-md-6 col-lg-12" role="menu"><p class="footer-nav__title" id="footer-washing-machine-title">How to Wash Clothes</p>${footerMenu(howto)}</div>
  <div class="col col-md-6 col-lg-12" role="menu"><p class="footer-nav__title" id="footer-help-support-title">Help &amp; Support</p><div class="menu-item"><a href="/en-us/contact-us" role="menuitem">Contact Us</a></div></div>
 </div></div>
 <div class="col footer-related" role="menu"><span id="footer-related-title">Related:</span><div class="footer-related-nav">${footerMenu([['P&amp;G Brands', 'http://pg.com/en_US'], ['MrClean', 'https://www.mrclean.com/en-us'], ['Downy', 'http://www.downy.com/en-us'], ['Bounce', 'http://www.bouncefresh.com/'], ['P&amp;G Everyday', 'http://www.pgeveryday.com/tag/tide']])}</div></div>
 <div class="col footer-icons"><div>
  <a href="http://www.goodhousekeeping.com/product-reviews/history/welcome-gh-seal"><picture><img src="${I}footer_GoodHousekeeping.webp" alt="Good Housekeeping icon" width="82" height="62"></picture></a><a href="https://www.bbb.org/cincinnati/business-reviews/detergent/the-procter-gamble-company-in-cincinnati-oh-3036"><picture><img src="${I}footer_BBB.webp" alt="BBB icon" width="38" height="62"></picture></a><a href="http://www.junkfoodclothing.com/"><picture><img src="${I}footer_JunkFood.webp" alt="Junk Food icon" width="58" height="62"></picture></a><a href="https://www.tidecleaners.com/"><picture><img src="${I}footer_TideCleaners.webp" alt="Tide Cleaners icon" width="56" height="62"></picture></a>
 </div></div>
 <div class="col footer-general" role="menu" aria-label="General navigation"><div>
  <div class="menu-item"><a href="https://accessibility.pg.com/en-US" role="menuitem" aria-label="Accessibility Statement">Accessibility Statement</a></div><div class="menu-item"><a href="https://termsandconditions.pg.com/en-us/" role="menuitem" aria-label="Terms &amp; Conditions">Terms &amp; Conditions</a></div><div class="menu-item"><a href="/en-us/rewards/loyalty/terms-and-conditions" role="menuitem" aria-label="Tide Rewards Terms and Conditions">Tide Rewards Terms and Conditions</a></div><div class="menu-item"><a href="https://www.pgcareers.com/" role="menuitem" aria-label="Careers">Careers</a></div><div class="menu-item"><a href="https://privacypolicy.pg.com/en-US/#statePrivacyNotice" role="menuitem" aria-label="Privacy">Privacy</a></div><div class="menu-item"><a href="https://privacypolicy.pg.com/CHD-en" role="menuitem" aria-label="Consumer Health Data Privacy Policy">Consumer Health Data Privacy Policy</a></div><div class="menu-item"><a class="with-ccpa-logo" href="https://preferencecenter.pg.com/" role="menuitem" aria-label="Your Privacy Choices">Your Privacy Choices</a></div><div class="menu-item"><span>NOTICE: We may sell your sensitive personal data.</span></div><div class="menu-item"><button type="button" role="menuitem" aria-label="Do Not Sell or Share My Personal Information / Opt-Out of Targeted Advertising">Do Not Sell or Share My Personal Information / Opt-Out of Targeted Advertising</button></div><div class="menu-item footer-copyright"><div>© 2026 Procter &amp; Gamble</div></div>
 </div><div class="menu-item"><a href="/en-us/sitemap" role="menuitem">Sitemap</a></div></div>
</div></div>
</footer>`;

const card = (href, img, text, i) => `<li class="rail__item"><a class="card" href="${href}"><div class="card__media"><picture><img src="${I}${img}" alt="" width="322" height="210"></picture></div><div class="card__content"><div class="card__text"><p>${text}</p></div><div class="card__cta"><span>Learn More</span></div></div></a></li>`;
const picker = (cls) => `<div class="picker ${cls}"><div class="picker__mask picker__mask--top"></div><div class="picker__mask picker__mask--bottom"></div><div class="picker__indicator"></div><div class="picker__scroll"><div class="picker__list">${pickerItems}</div></div></div><div class="visually-hidden" aria-live="polite">Selected: mayonnaise </div>`;

const main = `<main id="site-content" class="tide-home-page">
<section class="banner banner--evo">
 <div class="banner__wrap container"><div class="banner__box">
  <h1><strong>new</strong>&nbsp;Tide evo</h1>
  <h1>6x concentrated layers</h1>
  <p><a class="btn btn--orange" href="/en-us/shop/type/laundry-tiles/tide-evo-laundry-detergent-tiles-original" aria-label="tide evo laundry detergent tiles original try it now!">try it now!</a></p>
 </div></div>
 <picture><source media="(min-width: 1400px)" srcset="${I}Tide_EVO_enahncement_HP_hero_20260205_min1400px.webp"><source media="(min-width: 992px)" srcset="${I}Tide_EVO_enahncement_HP_hero_20260205_min992px.webp"><source media="(min-width: 576px)" srcset="${I}Tide_EVO_enahncement_HP_hero_20260205_min576px.webp"><img src="${I}Tide_EVO_enahncement_HP_hero_20260205_default.webp" alt=""></picture>
</section>
<section class="banner banner--rock">
 <div class="banner__wrap container"><div class="banner__box">
  <h1>Less Work, Better Clean*</h1>
  <p><u>*vs. pretreating and washing with Tide Simply</u></p>
  <p><a class="btn" href="/en-us/our-commitment/tide-boosted" aria-label="tide boosted Check it out!">Check it out!</a></p>
 </div></div>
 <picture><source media="(min-width: 1400px)" srcset="${I}Tide_TheRock_HP_hero_20250812_min1400px.webp"><source media="(min-width: 992px)" srcset="${I}Tide_TheRock_HP_hero_20250812_min992px.webp"><source media="(min-width: 576px)" srcset="${I}Tide_TheRock_HP_hero_20250812_min576px_taller.webp"><img src="${I}Tide_TheRock_HP_hero_20250812_default_taller.webp" alt=""></picture>
</section>
<section class="pods">
 <div class="pods__text"><div class="rt">
  <p class="pods__eyebrow">Tide</p>
  <h2 id="power-pods">POWER
PODS<strong>®</strong></h2>
  <p>Life is messier. Washing machines are bigger.</p>
  <p>Bigger PODS<strong>®</strong> means a better clean in every load.</p>
  <p>Now there’s a Tide Power PODS<strong>®</strong> product for any mess.</p>
  <p><a class="btn btn--orange" href="/en-us/shop/top-collections/tide-power-pods" aria-label="tide power pods Shop Collection">Shop Collection</a></p>
 </div></div>
 <div class="pods__media"><picture><source media="(min-width: 1600px)" srcset="${I}Tide_Power_Pods_module2_20250320_min1600px.webp"><source media="(min-width: 1200px)" srcset="${I}Tide_Power_Pods_module2_20250320_min1200px.webp"><source media="(min-width: 992px)" srcset="${I}Tide_Power_Pods_module2_20250320_min992px.webp"><source media="(min-width: 768px)" srcset="${I}Tide_Power_Pods_module2_20250320_min768px.webp"><source media="(min-width: 576px)" srcset="${I}Tide_Power_Pods_module2_20250320_min576px.webp"><img src="${I}Tide_Power_Pods_module2_20250320_default.webp" alt="New Tide Hygienic Clean is designed to remove both visible and invisible dirt "></picture></div>
</section>
<section class="rail-head"><div class="container"><h2 id="see-what-weve-been-working-on-lately"><strong>See what we've been working on lately</strong></h2></div></section>
<section class="rail-section"><div class="container">
 <div class="rail" id="hp-rail" data-rail>
  <div class="rail__viewport"><ul class="rail__track">
   ${card('/en-us/our-commitment/tide-evo', 'Tide_BlackWidow_LP_20240308_322x210_blue.webp', '<strong>Meet Tide evo. Detergent entirely made of clean.</strong>')}
   ${card('/en-us/shop/special-needs/deep-clean', 'Tide_hygenic_clean_Card_322x210_144ppi_20250513.webp', '<strong>Remove visible and invisible dirt</strong>')}
   ${card('/en-us/shop/type/laundry-pods', 'TIDE_most_trusted_Card_322x210_144ppi_20240513.webp', 'Tide is consumers\' <strong>#1 Trusted laundry detergent</strong> brand in BrandSpark survey')}
   ${card('/en-us/our-commitment/tide-in-space', 'Tide_Nasa_3722x210.webp', '<strong>Tide signs Space Act Agreement with NASA</strong>')}
  </ul><ul class="rail__dots"></ul></div>
  <div class="rail__arrows"><button class="rail__arrow rail__arrow--prev" aria-label="Previous slide" type="button">${arrowSvg}</button><button class="rail__arrow rail__arrow--next" aria-label="Next slide" type="button">${arrowSvg}</button></div>
 </div>
</div></section>
<section class="finder"><div class="container">
 <h2 id="find-the-right-tide-product-for-you">Find the right <strong>Tide product for you</strong></h2>
 <div class="finder__grid">
  <div class="finder__item"><div class="modal-card" role="button" tabindex="0"><h3>Browse by type</h3><p>Pacs, Liquid, Powder and more.</p><picture><img src="${I}Tide_HP_Product_by_type_20250513.webp" alt="Tide laundry products"></picture></div></div>
  <div class="finder__item"><div class="modal-card" role="button" tabindex="0"><h3>Browse by need</h3><p>Stain removal, Deep Cleaning, Bright Colors and more..</p><picture><img src="${I}browse_by_need.webp" alt="Stained t-shirts"></picture></div></div>
 </div>
</div></section>
<section class="stains">
 <picture class="stains__img"><img src="${I}how_to_remove_stains.webp" alt="A white T-shirt with brown liquid stains on it"></picture>
 <div class="container">
  <h2>Stain removal guide</h2>
  <div class="stains__row">
   <div class="stains__left"><span class="ihavea">I have a</span></div>
   <div class="stains__mobile">${picker('picker--mobile')}</div>
   <div class="picker-wrap--desktop">${picker('picker--desktop')}<button class="stains__arrow stains__arrow--up" type="button" aria-label="Previous item"></button><button class="stains__arrow stains__arrow--down" type="button" aria-label="Next item"></button></div>
   <div class="stains__right"><span class="stain">stain</span><div><button class="btn" type="button" role="link" aria-label="Stain removal guide: Learn more" data-stain-go>Learn More</button><a href="/en-us/how-to-wash-clothes/how-to-remove-stains">Can't find the right stain?</a></div></div>
  </div>
 </div>
</section>
<section class="howto">
 <div class="container"><div class="howto__text"><div class="rt">
  <h2 id="how-to-do-laundry">How to do
<strong>laundry</strong></h2>
  <p>Whether you're a beginner or a seasoned pro, start here for some of our expert laundry tips and tricks.</p>
  <p><a class="btn" href="/en-us/how-to-wash-clothes/how-to-do-laundry" aria-label="how to do laundry Learn More">Learn More</a></p>
 </div></div></div>
 <div class="howto__media"><picture><source media="(min-width: 1200px)" srcset="${I}Tide_how_to_do_laundry_min1200_20220915.webp"><source media="(min-width: 992px)" srcset="${I}Tide_how_to_do_laundry_min992_20220915.webp"><source media="(min-width: 428px)" srcset="${I}Tide_how_to_do_laundry_below992_20220915.webp"><img src="${I}Tide_how_to_do_laundry_below428_202209191119.webp" alt="A person holding a Tide Original Liquid Detergent product"></picture></div>
</section>
<section class="articles-head"><div class="container"><h2 id="learn-more">Learn more</h2></div></section>
<section class="articles"><div class="container"><div class="articles__grid">
 <div class="articles__col"><div class="preview"><div class="preview__image"><picture><img src="${I}Tide_LoH-hero_570x310_v2.webp" alt="A child getting his clothes cleaned at a Tide Loads of Hope truck" width="570" height="310"></picture></div><div class="preview__body"><div class="preview__content"><a class="preview__title" href="/en-us/our-commitment/loads-of-hope"><p>Loads of Hope</p></a><p>Life after disasters — hurricanes, floods, tornadoes, wildfires — can feel like a nightmare. Families are...</p><a class="btn btn--orange" href="/en-us/our-commitment/loads-of-hope" aria-label="Loads of Hope Read More">Read More</a></div></div>${chev()}</div></div>
 <div class="articles__col"><div class="preview"><div class="preview__image"><picture><img src="${I}Tide_Safety_preview_570x310.webp" alt="The top part of a Tide PODS container, showing that it's child-proof" width="570" height="310"></picture></div><div class="preview__body"><div class="preview__content"><a class="preview__title" href="/en-us/our-commitment/ingredients-and-safety/home-safety-tips"><p>At Tide Safety Comes First, and It Never Stops</p></a><p>Keeping loved ones safe is a joint effort. We’ve been working closely with Safe Kids...</p><a class="btn btn--orange" href="/en-us/our-commitment/ingredients-and-safety/home-safety-tips" aria-label="At Tide Safety Comes First, and It Never Stops Read More">Read More</a></div></div>${chev()}</div></div>
</div></div></section>
</main>`;

const html = `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Laundry Detergent and Fabric Care Products - Tide</title>
<meta name="description" content="${esc(JSON.parse(fs.readFileSync(root + '/current/pages/en-us.json', 'utf8')).description)}">
<link rel="icon" href="assets/favicon.ico">
<link rel="stylesheet" href="canon/canon.css">
<link rel="stylesheet" href="en-us.css">
</head>
<body>
<div id="page-wrapper">
${header}
${main}
${footer}
</div>
<script src="canon/canon.js" defer></script>
<script src="en-us.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(`${root}/prototypes/en-us-proposed.html`, html);
console.log('wrote', html.length);
