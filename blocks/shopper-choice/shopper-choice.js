/**
 * shopper-choice — the click2cart "buy now" panel (hero asset, headline, one pill per retailer,
 * panel footer with zip, Click2Cart mark and privacy link). Commerce stays on click2cart.com
 * (dynamic-features row 8): pills are static unless the author links them out.
 * Schema: stardust/eds-schema/en-us-click2cart-0060001.json (1 section, 4 × retailer units).
 *
 * Authoring rows (container shape, classified by content, never by index):
 *   head rows (before the first retailer row):
 *     - a cell with the hero <picture>/<img> (alt kept)
 *     - a cell with the headline (<h1>; the page's only h1)
 *   retailer rows (one per retailer, two cells; order = display order):
 *     cell 1: retailer logo <img> (alt "<Name> logo")
 *     cell 2: name <p> (first paragraph), optional offer <p> lines ("45 ct"),
 *             optional <ul> of product names (the collapsed product accordion),
 *             optional link on the name (link-out: the whole pill becomes that link)
 *     A retailer with an offer line, product list or link is "available"; one with only
 *     a name renders the disabled (grey chevron) state, as on the source.
 *   footer rows (after the last retailer row): zip <p>, Click2Cart mark <img>,
 *     privacy <p><a></p>; anything else lands in the footer (leftovers pass).
 *
 * Optional head row: `Background | <picture>` — the page ground image (variant ground-image).
 * A product <li> carrying an <em> (e.g. `<em>View</em>`) renders that label as the product's
 * link-style control instead of the quantity stepper (the source's "View" products).
 *
 * Variants (mirror the live widget configuration, see shopper-choice.css):
 *   ground-grey | ground-image, ink-grey, accent-teal | accent-navy, panel-white, rating,
 *   products (retailer product-choice pills: offer line = "select products" toggle),
 *   desktop (two-column panel from 761px), muted (disabled pills greyed).
 *
 * Template-slotted for head + footer; reconstructive for the retailer group.
 * Pill colour comes from the retailer name (walmart | instacart | amazon | target) via a class;
 * the look lives in shopper-choice.css.
 * Generated (not authored) UI strings: screen-reader labels on the quantity steppers and the
 * zip control, and the empty role=dialog shells the source keeps for its modals.
 */

const RETAILERS = ['walmart', 'instacart', 'amazon', 'target'];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function icon(name, extra = '') {
  const i = el('i', `fa fa-${name}${extra}`, { 'aria-hidden': 'true' });
  return i;
}

function srOnly(label) {
  const s = el('span', 'sr-only');
  s.textContent = label;
  return s;
}

const BLOCK_TAGS = 'p, div, ul, ol, h1, h2, h3, h4, h5, h6, picture, img, table, blockquote, pre';

/**
 * The authored nodes of a cell. The pipeline unwraps a single-paragraph cell into bare text
 * (`<div>WALMART</div>`); such a cell (no block-level child) is itself the authored node.
 */
function cellNodes(cell) {
  const kids = [...cell.children];
  if (kids.some((k) => k.matches(BLOCK_TAGS))) return kids;
  return (cell.textContent.trim() || kids.length) ? [cell] : [];
}

const rowNodes = (rows) => rows.flatMap((r) => [...r.children]).flatMap(cellNodes);

const text = (node) => (node ? node.textContent.trim() : '');
const media = (node) => (node.matches('picture, img') ? node : node.querySelector('picture, img'));

/** a retailer row: 2+ cells, the first holding an image */
function isRetailerRow(row) {
  const cells = [...row.children];
  return cells.length >= 2 && !!cells[0].querySelector('picture, img');
}

function displayName(logo, nameP) {
  const img = logo && (logo.matches('img') ? logo : logo.querySelector('img'));
  const alt = img ? img.getAttribute('alt') || '' : '';
  const fromAlt = alt.replace(/\s*logo\s*$/i, '').trim();
  if (fromAlt) return fromAlt;
  const t = text(nameP).toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** a product <li> whose control is a label (authored as <em>) instead of a quantity stepper */
const actionLabel = (li) => li.querySelector(':scope > em');

function buildProducts(list, wrapper) {
  wrapper.append(list);
  [...list.querySelectorAll(':scope > li')].forEach((li) => {
    const label = actionLabel(li);
    if (label) {
      label.remove();
      const name = text(li);
      li.textContent = name;
      const input = el('div', 'product-input');
      const price = el('span', 'pdp-hidden-price', {
        'aria-label': `Click or press enter to trigger ${name}'s transfer process`,
      });
      const a = el('a');
      a.textContent = text(label);
      price.append(a);
      input.append(price);
      li.classList.add('action');
      li.append(input);
      return;
    }
    const name = text(li);
    const input = el('div', 'product-input');
    const qty = el('div', 'quantity');
    const up = el('div', 'number-action up');
    up.append(icon('caret-up'));
    const field = el('input', '', {
      'aria-label': 'Quantity. Use your arrow keys to add or subtract.',
      type: 'number',
      value: '1',
      min: '1',
    });
    const down = el('div', 'number-action down');
    down.append(icon('caret-down'), srOnly(`Subtract quantity to ${name}`));
    qty.append(up, srOnly(`Add quantity to ${name}`), field, down);
    input.append(qty);
    li.append(input);
  });
}

function buildRetailer(row, products) {
  const cells = [...row.children];
  const logo = media(cells[0]);
  const items = cells.slice(1).flatMap(cellNodes);
  const paras = items.filter((n) => n.matches('p, div, h2, h3, h4, h5, h6') && !media(n));
  const lists = items.filter((n) => n.matches('ul, ol'));
  const nameP = paras[0] || null;
  const offers = paras.slice(1);
  const link = items.map((n) => (n.matches('a') ? n : n.querySelector('a'))).find(Boolean);
  const available = !!(offers.length || lists.length || link);
  // every product link-style ("View"): the pill opens the list instead of transferring
  const allActions = !!lists.length
    && lists.every((l) => [...l.children].every((li) => actionLabel(li)));
  const key = RETAILERS.find((r) => text(nameP).toLowerCase().includes(r));
  const name = displayName(logo, nameP);

  const retailer = el('div', key ? `retailer retailer-${key}` : 'retailer');
  const box = el(link ? 'a' : 'div', 'retailer-button-container');
  if (link) {
    box.href = link.href;
    link.replaceWith(...link.childNodes);
  }
  let label = available ? `Click or press enter to trigger ${name}'s transfer process` : '';
  if (allActions) label = products ? `Click or press enter to open ${name}'s product list` : '';
  const button = el('div', 'retailer-button', {
    role: 'button',
    tabindex: '0',
    'aria-label': label,
  });
  if (available) button.dataset.retailer = name;
  const logoBox = el('div', 'retailer-button-logo');
  if (logo) logoBox.append(logo);
  const content = el('div', 'retailer-button-content');
  const main = el('div', 'main-text');
  const nameBox = el('div', 'retailer-name');
  if (nameP) nameBox.append(nameP);
  if (offers.length && products) {
    // product-choice pill: the offer line is the product-list toggle ("SELECT PRODUCTS ⌄")
    offers.forEach((o) => {
      const toggle = el('p', 'products-number', {
        'aria-label': `Click or press enter to open ${name}'s product list`,
      });
      const caption = el('span');
      caption.append(...o.childNodes);
      toggle.append(caption, icon('angle-down'));
      nameBox.append(toggle);
    });
  } else if (offers.length) {
    const offer = el('div', 'single-offer-info');
    offer.append(...offers);
    nameBox.append(offer);
  }
  main.append(nameBox);
  content.append(main);
  const type = el('div', available ? 'retailer-type-icon' : 'retailer-type-icon disabled');
  type.append(icon(products ? 'angle-down' : 'angle-right'));
  // product-choice: a retailer whose products are all link-style ("View") shows no chevron
  if (products && allActions) type.classList.add('hidden');
  button.append(logoBox, content, type);
  box.append(button);

  const accordion = el('div', 'retailer-button-accordion');
  const body = el('div', 'accordion-body');
  const wrapper = el('div', 'accordion-wrapper');
  lists.forEach((list) => buildProducts(list, wrapper));
  body.append(wrapper);
  accordion.append(body);
  const modal = el('div', 'sc-modal', { role: 'dialog', 'aria-label': `${name} oauth info modal` });
  retailer.append(box, el('div', 'break'), accordion, modal);
  return retailer;
}

function buildFooter(nodes) {
  const footer = el('div', 'footer-content', { id: 'sc-footer-content' });
  const actions = el('div', 'bottom-footer-actions');
  const zipBox = el('div', 'change-zip');
  const zip = el('div', 'zip-code-change-container', { role: 'button', tabindex: '0' });
  zip.append(icon('map-marker', ' zip-code-icon'), srOnly('Open zip code change dialog'));
  const current = el('div', 'current-zip');
  zip.append(current);
  zipBox.append(zip, el('div', 'sc-modal', { role: 'dialog', 'aria-label': 'Zipcode change modal' }));
  const brand = el('div', 'smartcommerce-brand');
  const links = el('div', 'footer-links');
  const rest = el('div', 'footer-extra');
  nodes.forEach((node) => {
    if (media(node) && !text(node)) brand.append(node);
    else if (node.querySelector('a') || node.matches('a')) links.append(node);
    else if (!current.children.length && node.matches('p, div')) current.append(node);
    else rest.append(node);
  });
  actions.append(zipBox, brand);
  footer.append(actions, links);
  if (rest.children.length) footer.append(rest);
  return footer;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return; // re-entrant: already decorated
  const rows = [...block.children];
  const firstRetailer = rows.findIndex(isRetailerRow);
  const lastRetailer = rows.length - 1 - [...rows].reverse().findIndex(isRetailerRow);
  const headRows = firstRetailer < 0 ? rows : rows.slice(0, firstRetailer);
  const retailerRows = firstRetailer < 0 ? [] : rows.slice(firstRetailer, lastRetailer + 1);
  const footRows = firstRetailer < 0 ? [] : rows.slice(lastRetailer + 1);

  const container = el('div', 'container bordered', { id: 'shopper-choice-container' });
  const scroller = el('div', 'scrolling-container', { id: 'scrolling-container' });

  // optional ground row (`Background | <picture>`): the page ground image, behind the panel
  const isGroundRow = (row) => {
    const cells = [...row.children];
    return cells.length >= 2 && /^background$/i.test(text(cells[0])) && !!media(cells[1]);
  };
  const groundRow = headRows.find(isGroundRow);
  let ground = null;
  if (groundRow) {
    ground = el('div', 'ground', { 'aria-hidden': 'true' });
    ground.append(...cellNodes(groundRow.children[1]));
  }

  // head: hero asset + headline (template-slotted)
  const header = el('div', 'header-container');
  const banner = el('div', 'custom-banner-wrapper');
  const bannerImg = el('div', 'banner-img');
  banner.append(bannerImg);
  if (block.classList.contains('rating')) banner.append(el('div', 'rating-spacer'));
  const headWrap = el('div', 'custom-header-wrapper');
  const headText = el('div', 'header-text');
  headWrap.append(headText);
  rowNodes(headRows.filter((r) => r !== groundRow)).forEach((node) => {
    const m = media(node);
    if (m && !text(node) && !bannerImg.children.length) bannerImg.append(node);
    else headText.append(node);
  });
  header.append(banner);
  // the hero renders at its natural size, capped by the panel (live: max-width 100%)
  const heroImg = bannerImg.querySelector('img');
  if (heroImg) {
    const natural = () => {
      const w = Number(heroImg.getAttribute('width')) || heroImg.naturalWidth;
      if (w) bannerImg.style.setProperty('--hero-w', `${w}px`);
    };
    natural();
    if (!bannerImg.style.getPropertyValue('--hero-w')) heroImg.addEventListener('load', natural, { once: true });
  }

  // retailer pills (reconstructive: one pill per retailer row)
  const content = el('div', 'sc-content', {
    id: 'branded-sc-container',
    role: 'complementary',
    'aria-label': 'Product availability and purchase options',
  });
  const products = block.classList.contains('products');
  // product-choice lists carry no region label on the source
  const list = el('div', 'overflow-wrapper', products ? {} : {
    id: 'retailer-buttons-wrapper',
    role: 'region',
    'aria-label': 'Retailer buttons list container',
  });
  retailerRows.forEach((row) => {
    if (isRetailerRow(row)) list.append(buildRetailer(row, products));
    else list.append(...rowNodes([row]));
  });
  if (block.classList.contains('desktop')) {
    // two-column panel: hero left; headline + pills share the right (scrolling) column
    const action = el('div', 'action-ui');
    content.append(headWrap, list);
    action.append(content);
    scroller.append(header, action);
  } else {
    header.append(headWrap);
    content.append(list);
    scroller.append(header, content);
  }

  // panel footer: zip, Click2Cart mark, privacy link (template-slotted + leftovers)
  const footer = buildFooter(rowNodes(footRows));
  container.append(scroller, footer);
  block.replaceChildren(...(ground ? [ground, container] : [container]));

  // live sizes the scroller to the viewport minus the panel footer (inline max-height),
  // re-measured once laid out (live occasionally lands 40px shorter — load-timing residual)
  const twoColumn = block.classList.contains('desktop') && window.matchMedia('(width >= 761px)');
  const size = () => {
    if (twoColumn && twoColumn.matches) { // fixed-height two-column panel: CSS sizes it
      scroller.style.removeProperty('max-height');
      return;
    }
    if (!footer.offsetHeight) return; // not laid out yet: the CSS fallback holds
    scroller.style.maxHeight = `${window.innerHeight - footer.offsetHeight}px`;
  };
  new ResizeObserver(size).observe(footer);
  window.addEventListener('resize', size);
}
