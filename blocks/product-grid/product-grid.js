/**
 * product-grid — product-listing body (live .plp-action-bar + .plp-filter-bar + .plp-grid +
 * "Load more products"): the product count / sort / grid-list controls, the optional
 * "Filter by …" link bar, the product and article-promo tiles, and paging.
 * Decode tier: reconstructive (repeat group — one row per tile, classified by content,
 * never by row index). Dynamic row 17 (plp-controls): sort, view toggle and load-more run
 * client-side over the authored tiles.
 *
 * Authored shape — one row per unit, cells in any order:
 *   filter row  : a cell holding a `<ul>` of links (the need/type pages) + a cell with the
 *                 bar title (`Filter by Need`). Optional; at most one.
 *   product row : image cell (`<picture>`/`<img>`, alt = product) | title cell = ONE link
 *                 to the product page (bold run = the heavy part of the name) | rating cell
 *                 = two paragraphs `4.4008` and `(3206)` (average, review count) | text
 *                 cell = description (hidden, as live) | link cell = `Find Retailers` (live
 *                 renders a button: the link is unwrapped, the slot acts as a button).
 *   promo row   : image cell | title cell = plain text (NOT a link — that is what makes
 *                 the row a promo) | link cell = `Read More` to the article.
 *   A link `title` becomes the link's accessible name (live aria-label).
 * Rows keep the source order (= "Popularity"); promos sit at their authored slots.
 *
 * @ew-exempt generated UI labels — product count suffix, "Sort by:", sort option names,
 *   view-toggle and filter-toggle aria-labels, "Load more products": site-wide PLP labels
 *   (live globalLabels.plp), not page content.
 */

const PAGE_SIZE = 9;
const STAR_PATH = 'M26.8,9.7l-7.4-1.1l-3.3-6.7c-0.2-0.4-0.5-0.7-0.9-0.8C14.8,1,14.4,1,14,1.1'
  + 'c-0.4,0.1-0.7,0.4-0.9,0.8L9.8,8.6L2.4,9.7C2,9.7,1.6,10,1.4,10.3C1.1,10.6,1,11,1,11.4'
  + 'c0,0.4,0.2,0.8,0.5,1.1l5.4,5.2l-1.3,7.4c-0.1,0.4,0,0.8,0.2,1.1C6,26.6,6.4,26.9,6.8,27'
  + 'c0.4,0.1,0.8,0,1.2-0.2l6.6-3.5l6.7,3.5c0.2,0.1,0.5,0.2,0.8,0.2c0.1,0,0.3,0,0.4-0.1'
  + 'c0.4-0.1,0.7-0.3,0.9-0.7c0.2-0.3,0.3-0.7,0.2-1.1l-1.3-7.4l5.4-5.2c0.3-0.3,0.5-0.7,0.5-1.1'
  + 'c0-0.4-0.1-0.8-0.4-1.1C27.6,10,27.2,9.7,26.8,9.7z';
const CHEVRON_PATH = 'M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2'
  + 'L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082'
  + 'a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17';
const SORTS = [
  ['default', 'Popularity'],
  ['rating', 'Product Rating'],
  ['title_az', 'Product A-Z'],
  ['title_za', 'Product Z-A'],
];
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function svgNode(tag, attrs, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  children.forEach(([t, a, c]) => node.append(svgNode(t, a, c)));
  return node;
}

function svg(attrs, children) {
  const node = svgNode('svg', attrs, children);
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('focusable', 'false');
  return node;
}

const rect = (x, y, width, height) => ['rect', {
  x, y, width, height,
}];
const line = (y) => ['line', {
  x1: '0', y1: y, x2: '13', y2: y,
}];
const CLOSE_PATH = 'M7.813,7l4.915-5.292a1.055,1.055,0,0,0,0-1.415.883.883,0,0,0-1.313,0L6.5,5.586,'
  + '1.585.293a.881.881,0,0,0-1.313,0,1.054,1.054,0,0,0,0,1.414L5.187,7,.272,12.293a1.054,1.054,'
  + '0,0,0,0,1.414A.893.893,0,0,0,.929,14a.893.893,0,0,0,.656-.293L6.5,8.414l4.915,5.293a.882.882,'
  + '0,0,0,1.313,0,1.054,1.054,0,0,0,0-1.414Z';

const chevron = () => svg(
  { width: '17', height: '10', viewBox: '0 0 17 10' },
  [['path', { d: CHEVRON_PATH, transform: 'translate(0 10) rotate(-90)' }]],
);
const star = (kind) => svg(
  { class: `product-grid-star ${kind}`, viewBox: '0 0 29.2 28' },
  [['path', { d: STAR_PATH }]],
);

/** the cell's content nodes (elements + non-blank text: the pipeline unwraps lone `<p>`s) */
const contentOf = (cell) => [...cell.childNodes]
  .filter((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim());
const text = (cell) => cell.textContent.replace(/\s+/g, ' ').trim();
const isMediaCell = (cell) => !!cell.querySelector('picture, img') && !text(cell);
const isLinkCell = (cell) => {
  const links = cell.querySelectorAll('a[href]');
  return links.length === 1 && text(cell) !== '' && text(links[0]) === text(cell);
};
const isRatingCell = (cell) => /\d/.test(text(cell)) && /^[\d.,()\s]+$/.test(text(cell));

function moveInto(target, cell) {
  target.append(...contentOf(cell));
  return target;
}

/** authored link `title` = live aria-label; drop the foundation's button classes */
function labelLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    const t = a.getAttribute('title');
    if (t && t.trim() !== text(a)) a.setAttribute('aria-label', t.trim());
    a.removeAttribute('title');
    a.closest('.button-wrapper')?.classList.remove('button-wrapper');
  });
}

/**
 * Live renders "Find Retailers" as a <button> (PriceSpider, dynamic row 7 — interim: the
 * product page). The authored link's href is read, the anchor unwrapped (EW6) and the slot
 * acts as a button to it, so the text stays the authored node.
 */
function actAsButton(slot) {
  const link = slot.querySelector('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  const title = link.getAttribute('title');
  if (title && title.trim() !== text(link)) slot.setAttribute('aria-label', title.trim());
  link.replaceWith(...link.childNodes);
  slot.setAttribute('role', 'button');
  slot.setAttribute('tabindex', '0');
  slot.dataset.href = href;
  const go = () => window.location.assign(href);
  slot.addEventListener('click', go);
  slot.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    go();
  });
}

function buildStars(rating) {
  const stars = el('span', 'product-grid-stars', { 'aria-label': `${rating} out of 5 stars` });
  for (let i = 0; i < 5; i += 1) {
    const frac = Math.round(Math.min(Math.max(rating - i, 0), 1) * 10) / 10;
    const item = el('span', 'product-grid-stars-item', {
      role: 'img',
      'aria-label': `${i + 1} out of 5 stars`,
    });
    const sr = el('span', 'visually-hidden');
    sr.textContent = 'Star';
    const holder = el('span');
    if (frac >= 1) {
      holder.append(star('full'));
    } else if (frac > 0) {
      holder.className = 'product-grid-stars-box';
      const fill = el('span', 'product-grid-stars-fill');
      fill.style.width = `${frac * 100}%`;
      fill.append(star('full'));
      holder.append(fill, star('empty'));
    } else {
      holder.append(star('empty'));
    }
    item.append(sr, holder);
    stars.append(item);
  }
  return stars;
}

/** live prints the count as three text nodes "(", "N", ")": split the authored text node */
function splitCount(root) {
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const m = n.textContent.match(/^(\s*\(\s*)(\d[\d,]*)(\s*\)\s*)$/);
    if (m) {
      n.splitText(m[1].length).splitText(m[2].length);
      return;
    }
  }
}

function decodeRating(cell) {
  const nums = text(cell).match(/\d+(?:\.\d+)?/g) || [];
  const rating = parseFloat(nums[0]) || 0;
  const count = nums[1] || '';
  const wrap = el('div', 'product-grid-rating', { role: 'img' });
  wrap.setAttribute('aria-label', count
    ? `${rating} out of 5 stars, ${count} reviews`
    : `${rating} out of 5 stars`);
  const stars = el('span', 'product-grid-rating-stars', { 'aria-hidden': 'true' });
  stars.append(buildStars(rating));
  wrap.append(stars);
  const parts = contentOf(cell);
  const value = el('span', 'product-grid-rating-value');
  const shown = el('span', 'product-grid-rating-count', { 'aria-hidden': 'true' });
  if (parts.length > 1) {
    // first part = the average (read by the role=img label), the rest = "(count)"
    value.append(parts[0]);
    shown.append(...parts.slice(1));
    splitCount(shown);
    wrap.append(value, shown);
  } else {
    shown.append(...parts);
    wrap.append(shown);
  }
  return { wrap, rating };
}

/**
 * Live nests the name paragraph INSIDE the product link (a > p). The authored `<p><a>`
 * (or the bare `<a>` the pipeline leaves for a one-paragraph cell) is turned inside out:
 * href read, anchor unwrapped (EW6), the paragraph — or the moved text when the pipeline
 * dropped it — wrapped in a block link.
 */
function linkTitle(title, href) {
  const link = title.querySelector('a[href]');
  let para = link.closest('p');
  if (!para) {
    para = document.createElement('p');
    link.before(para);
    para.append(link);
  }
  link.replaceWith(...link.childNodes);
  const anchor = el('a', 'product-grid-title-link', { href });
  para.before(anchor);
  anchor.append(para);
}

function decodeProduct(cells, index) {
  const item = el('div', 'product-grid-item product');
  const card = el('div', 'product-grid-card');
  const image = el('div', 'product-grid-image');
  const content = el('div', 'product-grid-content');
  const title = el('div', 'product-grid-title');
  const desc = el('div', 'product-grid-desc');
  const cta = el('div', 'product-grid-cta');
  let rating = 0;
  let titleDone = false;
  const media = [];
  let ratingWrap = null;

  cells.forEach((cell) => {
    if (isMediaCell(cell)) {
      media.push(cell);
    } else if (!titleDone && isLinkCell(cell)) {
      moveInto(title, cell);
      titleDone = true;
    } else if (!ratingWrap && isRatingCell(cell)) {
      ({ wrap: ratingWrap, rating } = decodeRating(cell));
    } else if (isLinkCell(cell)) {
      moveInto(cta, cell);
    } else {
      moveInto(desc, cell);
    }
  });

  const href = title.querySelector('a[href]')?.getAttribute('href');
  if (href) linkTitle(title, href);
  const imageHost = href ? el('a', 'product-grid-image-link', { href }) : image;
  media.forEach((cell) => moveInto(imageHost, cell));
  if (imageHost !== image) image.append(imageHost);

  content.append(title);
  if (ratingWrap) content.append(ratingWrap);
  if (desc.childNodes.length) content.append(desc);
  card.append(image, content);
  if (cta.childNodes.length) {
    actAsButton(cta);
    card.append(cta);
  }
  item.append(card);
  item.dataset.order = index;
  item.dataset.rating = rating;
  item.dataset.title = text(title).toLowerCase();
  return item;
}

function decodePromo(cells) {
  const item = el('div', 'product-grid-item promo');
  const card = el('div', 'product-grid-promo');
  const content = el('div', 'product-grid-promo-content');
  const title = el('div', 'product-grid-promo-title');
  const link = el('div', 'product-grid-promo-link');
  const image = el('div', 'product-grid-promo-image');
  cells.forEach((cell) => {
    if (isMediaCell(cell)) moveInto(image, cell);
    else if (isLinkCell(cell)) moveInto(link, cell);
    else moveInto(title, cell);
  });
  content.append(title);
  if (link.childNodes.length) content.append(link);
  card.append(content, image);
  item.append(card);
  return item;
}

function decodeFilter(cells) {
  const filter = el('div', 'product-grid-filter');
  const head = el('div', 'product-grid-filter-title');
  const label = el('span', 'product-grid-filter-label');
  const links = el('div', 'product-grid-filter-links');
  cells.forEach((cell) => {
    if (cell.querySelector('ul, ol')) moveInto(links, cell);
    else moveInto(label, cell);
  });
  // the pills sit edge to edge as on live: drop the markup's inter-item whitespace
  // (formatting text nodes only — no authored text)
  links.querySelectorAll('ul, ol, li').forEach((node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
    });
  });
  links.querySelectorAll('a[href]').forEach((a) => {
    if (!a.hasAttribute('aria-label') && !a.title) a.setAttribute('aria-label', text(a));
    // live carries a (hidden) remove glyph in every filter pill
    const close = [['path', { d: CLOSE_PATH }]];
    a.prepend(svg({ width: '13', height: '14', viewBox: '0 0 13 14' }, close));
  });
  // live: the chevron svg itself is the toggle control
  const toggle = chevron();
  toggle.removeAttribute('aria-hidden');
  toggle.removeAttribute('focusable');
  toggle.classList.add('product-grid-filter-toggle');
  toggle.setAttribute('role', 'button');
  toggle.setAttribute('tabindex', '0');
  toggle.setAttribute('aria-label', 'Toggle filter bar');
  label.append(toggle);
  head.append(label);
  filter.append(head, links);

  const set = (on) => {
    filter.classList.toggle('is-expanded', on);
    toggle.setAttribute('aria-expanded', String(on));
  };
  // live: expanded from 992px, collapsed below; the chevron toggles
  set(window.matchMedia('(width >= 992px)').matches);
  toggle.addEventListener('click', () => set(!filter.classList.contains('is-expanded')));
  toggle.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    set(!filter.classList.contains('is-expanded'));
  });
  return filter;
}

function buildActions(block, list, count) {
  const bar = el('div', 'product-grid-actions');
  const total = el('div', 'product-grid-count');
  total.textContent = `${count} ${count === 1 ? 'Product' : 'Products'}`;
  const controls = el('div', 'product-grid-controls');

  const sorting = el('div', 'product-grid-sort');
  const sortLabel = el('span');
  sortLabel.textContent = 'Sort by:';
  const selectWrap = el('label', 'product-grid-select');
  const select = el('select', '', { name: 'sortBy', 'aria-label': 'Sort products by' });
  SORTS.forEach(([value, name]) => {
    const opt = el('option', '', { value });
    opt.textContent = name;
    select.append(opt);
  });
  selectWrap.append(select, chevron());
  sorting.append(sortLabel, selectWrap);

  const views = el('div', 'product-grid-views');
  const gridBtn = el('button', 'is-active', { type: 'button' });
  const listBtn = el('button', '', { type: 'button' });
  gridBtn.append(svg({ width: '39', height: '34', viewBox: '0 0 39 34' }, [
    ['g', { class: 'icon-fill' }, [rect('13', '11', '6', '5'), rect('20', '11', '6', '5'),
      rect('20', '17', '6', '5'), rect('13', '17', '6', '5')]],
  ]));
  listBtn.append(svg({ width: '39', height: '34', viewBox: '0 0 39 34' }, [
    ['g', { class: 'icon-stroke', transform: 'translate(15 11)', 'stroke-width': '3' },
      [line('0.34375'), line('5.15625'), line('10.65625')]],
    ['g', { class: 'icon-fill' }, [rect('10', '10', '3', '3'), rect('10', '15', '3', '3'),
      rect('10', '21', '3', '3')]],
  ]));
  const setView = (listView) => {
    block.classList.toggle('list-view', listView);
    gridBtn.classList.toggle('is-active', !listView);
    listBtn.classList.toggle('is-active', listView);
    const state = (on) => (on ? 'active' : 'inactive');
    gridBtn.setAttribute('aria-label', `Change display to grid ${state(!listView)}`);
    listBtn.setAttribute('aria-label', `Change display to list ${state(listView)}`);
  };
  setView(false);
  gridBtn.addEventListener('click', () => setView(false));
  listBtn.addEventListener('click', () => setView(true));
  views.append(gridBtn, listBtn);

  controls.append(sorting, views);
  bar.append(total, controls);
  return { bar, select };
}

function sortItems(list, mode) {
  const items = [...list.children];
  const slots = items.map((item) => item.classList.contains('product'));
  const products = items.filter((item) => item.classList.contains('product'));
  const promos = items.filter((item) => !item.classList.contains('product'));
  const by = {
    default: (a, b) => a.dataset.order - b.dataset.order,
    rating: (a, b) => b.dataset.rating - a.dataset.rating || a.dataset.order - b.dataset.order,
    title_az: (a, b) => a.dataset.title.localeCompare(b.dataset.title),
    title_za: (a, b) => b.dataset.title.localeCompare(a.dataset.title),
  };
  products.sort(by[mode] || by.default);
  list.append(...slots.map((isProduct) => (isProduct ? products.shift() : promos.shift())));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return; // EW9: already decorated
  const rows = [...block.querySelectorAll(':scope > div')];
  const list = el('div', 'product-grid-list');
  let filter = null;
  let products = 0;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!filter && row.querySelector('ul, ol')) {
      filter = decodeFilter(cells);
      return;
    }
    const titleCell = cells.find((c) => !isMediaCell(c) && text(c));
    if (!titleCell) return;
    if (isLinkCell(titleCell)) {
      list.append(decodeProduct(cells, products));
      products += 1;
    } else {
      list.append(decodePromo(cells));
    }
  });

  const container = el('div', 'container');
  const { bar, select } = buildActions(block, list, products);
  container.append(bar);
  if (filter) container.append(filter);
  container.append(list);

  // paging: the first PAGE_SIZE tiles (promos included, as live), then PAGE_SIZE more per click
  let shown = PAGE_SIZE;
  const more = el('button', 'product-grid-more', { type: 'button' });
  more.textContent = 'Load more products';
  const page = () => {
    [...list.children].forEach((item, i) => item.classList.toggle('is-paged', i >= shown));
    more.hidden = shown >= list.children.length;
  };
  more.addEventListener('click', () => {
    shown += PAGE_SIZE;
    page();
  });
  select.addEventListener('change', () => {
    sortItems(list, select.value);
    page();
  });
  page();
  container.append(more);

  labelLinks(container);
  block.replaceChildren(container);
}
