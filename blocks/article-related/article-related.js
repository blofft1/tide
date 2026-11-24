/**
 * article-related — an article's closing "Related products" carousel (live .carousel-wrapper
 * .products-carousel-white) or "Related articles" band (live .related-articles).
 * Decode tier: reconstructive (repeat group — one row per item, classified by content).
 *
 * Authored shape:
 *   head row : one cell with the label paragraph ("Related products" / "Related articles").
 *   item rows: image cell (`<picture>`) | [title cell] | [summary cell] | link cell (one link:
 *              the item URL). products: image | link (link text = product name, strong kept);
 *              articles: image | title | summary | "Read More" link (title attr = aria-label).
 * The image becomes a link to the item (as live — its alt is the link's accessible name).
 *
 * @variants block class: products — carousel (label + active product name | slides);
 *   default — related articles (orange band head, image cards with a white text box).
 */

const CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" '
  + 'aria-hidden="true" focusable="false"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,'
  + '9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,'
  + '8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) '
  + 'rotate(-90)" fill="currentColor"/></svg>';

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

const text = (node) => node.textContent.replace(/\s+/g, ' ').trim();
const isMedia = (cell) => !!cell.querySelector('picture, img') && !text(cell);
const linkOf = (cell) => {
  const links = cell.querySelectorAll('a[href]');
  return links.length === 1 && text(links[0]) === text(cell) ? links[0] : null;
};

function parse(block) {
  let head = null;
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const item = {
      image: null, title: null, texts: [], link: null,
    };
    cells.filter((cell) => isMedia(cell) || text(cell)).forEach((cell) => {
      if (isMedia(cell)) item.image = cell.querySelector('picture') || cell.querySelector('img');
      else if (linkOf(cell) && (item.title || cells.length < 3)) item.link = linkOf(cell);
      else if (!item.title) item.title = cell;
      else item.texts.push(cell);
    });
    if (!item.image && !item.link && item.title && !head) head = item.title;
    else items.push(item);
  });
  return { head, items };
}

function imageLink(item, className) {
  const a = el('a', className);
  a.href = item.link ? item.link.href : '#';
  if (item.image) a.append(item.image);
  return a;
}

function products(block, { head, items }) {
  const label = el('div', 'article-related-label');
  if (head) label.append(...head.childNodes);
  const names = el('div', 'article-related-names');
  const track = el('div', 'article-related-track');
  items.forEach((item, i) => {
    // product name: the authored link's content (or a title cell, if one is authored)
    let titleNodes = [];
    if (item.title) titleNodes = [...item.title.childNodes];
    else if (item.link) titleNodes = [el('p', '', ...item.link.childNodes)];
    const name = el('div', `article-related-name${i === 0 ? ' active' : ''}`);
    name.append(...titleNodes.map((n) => n.cloneNode(true)));
    name.setAttribute('aria-hidden', 'true');
    names.append(name);
    // the authored link is the slide (live: a > title + image); its paragraph stays around it
    const slide = item.link || el('a');
    if (!item.link) slide.href = '#';
    slide.classList.remove('button');
    slide.classList.add('article-related-slide');
    const title = el('div', 'article-related-slide-title', ...titleNodes);
    const image = el('div', 'article-related-slide-image');
    if (item.image) image.append(item.image);
    slide.replaceChildren(title, image);
    const holder = item.link?.closest('p') || el('p');
    holder.className = 'article-related-slide-holder';
    holder.replaceChildren(slide);
    track.append(holder);
  });
  const textCol = el('div', 'article-related-text', label, names);
  const slides = el('div', 'article-related-slides', track);
  block.replaceChildren(el('div', 'container', el('div', 'article-related-row', textCol, slides)));
}

function articles(block, { head, items }) {
  const top = el('div', 'article-related-top');
  const title = el('div', 'article-related-title');
  if (head) title.append(...head.childNodes);
  top.append(el('div', 'container', title));
  const grid = el('div', 'article-related-grid');
  items.forEach((item) => {
    const card = el('div', 'article-related-card');
    card.append(el('div', 'article-related-image', imageLink(item)));
    const content = el('div', 'article-related-content');
    if (item.title) content.append(el('div', 'article-related-card-title', ...item.title.childNodes));
    item.texts.forEach((t) => content.append(...t.childNodes));
    if (item.link) {
      const p = item.link.closest('p') || el('p', '', item.link);
      p.className = 'article-related-more';
      item.link.classList.remove('button');
      p.parentElement?.classList.remove('button-container');
      content.append(p);
    }
    card.append(el('div', 'article-related-content-wrapper', content));
    const arrow = el('a', 'article-related-arrow');
    arrow.href = item.link ? item.link.href : '#';
    arrow.setAttribute('aria-label', item.link ? (item.link.getAttribute('aria-label') || text(item.link)) : '');
    arrow.innerHTML = CHEVRON;
    card.append(arrow);
    grid.append(card);
  });
  block.replaceChildren(top, el('div', 'article-related-bottom', el('div', 'container', grid)));
}

// authored link title = the live aria-label (decorateButtons would echo the label into title)
function labelLinks(block) {
  block.querySelectorAll('a[title]').forEach((a) => {
    const t = a.getAttribute('title').trim();
    if (t && t !== a.textContent.trim()) a.setAttribute('aria-label', t);
    a.removeAttribute('title');
  });
}

export default function decorate(block) {
  labelLinks(block);
  const parsed = parse(block);
  if (block.classList.contains('products')) products(block, parsed);
  else articles(block, parsed);
}
