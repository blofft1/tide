/**
 * plp-related — product-listing "Related articles" list (live .plp-related-articles), shown
 * below 992px only (live renders it at mobile widths; the desktop grid carries the same
 * articles as promo tiles).
 * Decode tier: reconstructive (repeat group — one row per article, classified by content).
 *
 * Authored shape:
 *   heading row : the list title (`<h3>Related articles</h3>`). Optional.
 *   item rows   : image cell (`<picture>`, hidden as on live) | title paragraph | summary
 *                 paragraph | link cell (`Read More` to the article; its `title` = the live
 *                 aria-label). Text cells are told apart by order: first = title, then summary.
 * The authored link stays (hidden, as live); a text-less arrow link to the same target is
 * generated beside it (presentational, carries the link's label).
 *
 * @variants block class: desktop — the page has no promo tiles in the grid (live
 *   relatedArticlesPosition null), so live also renders the list >= 992px as a row of
 *   article-preview cards (image, white box with title, summary, Read More).
 */
const CHEVRON_PATH = 'M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2'
  + 'L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082'
  + 'a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17';
const SVG_NS = 'http://www.w3.org/2000/svg';

const text = (node) => node.textContent.replace(/\s+/g, ' ').trim();
const contentOf = (cell) => [...cell.childNodes]
  .filter((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim());
const isMediaCell = (cell) => !!cell.querySelector('picture, img') && !text(cell);
const isLinkCell = (cell) => {
  const links = cell.querySelectorAll('a[href]');
  return links.length === 1 && text(cell) !== '' && text(links[0]) === text(cell);
};

function div(className) {
  const node = document.createElement('div');
  node.className = className;
  return node;
}

function arrow() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 17 10');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON_PATH);
  path.setAttribute('transform', 'translate(0 10) rotate(-90)');
  svg.append(path);
  return svg;
}

function decodeItem(cells) {
  const li = document.createElement('li');
  li.className = 'plp-related-item';
  const image = div('plp-related-image');
  const content = div('plp-related-content');
  const title = div('plp-related-item-title');
  const summary = div('plp-related-item-text');
  const link = div('plp-related-link');
  let texts = 0;
  cells.forEach((cell) => {
    if (isMediaCell(cell)) {
      image.append(...contentOf(cell));
    } else if (isLinkCell(cell)) {
      link.append(...contentOf(cell));
    } else if (text(cell)) {
      (texts === 0 ? title : summary).append(...contentOf(cell));
      texts += 1;
    }
  });
  let arrowLink = null;
  link.querySelectorAll('a[href]').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    a.closest('.button-wrapper')?.classList.remove('button-wrapper');
    const label = a.getAttribute('title');
    if (label && label.trim() !== text(a)) a.setAttribute('aria-label', label.trim());
    a.removeAttribute('title');
    // live: the "Read More" link is hidden and a text-less arrow link (same target and
    // label) sits at the row's right edge
    arrowLink = document.createElement('a');
    arrowLink.className = 'plp-related-arrow';
    arrowLink.href = a.getAttribute('href');
    const name = a.getAttribute('aria-label');
    if (name) arrowLink.setAttribute('aria-label', name);
    arrowLink.append(arrow());
  });
  // live: the image is a link to the article (a > picture), named by the image alt
  if (arrowLink && image.childNodes.length) {
    const imageLink = document.createElement('a');
    imageLink.href = arrowLink.getAttribute('href');
    imageLink.append(...image.childNodes);
    image.append(imageLink);
  }
  content.append(title);
  if (summary.childNodes.length) content.append(summary);
  // live keeps the Read More link inside the content box (hidden < 992, shown by `desktop`)
  if (link.childNodes.length) content.append(link);
  li.append(image, content);
  if (arrowLink) li.append(arrowLink);
  return li;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return; // EW9: already decorated
  const container = div('container');
  const head = div('plp-related-title');
  const list = document.createElement('ul');
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && !row.querySelector('picture, img, a[href]')) {
      cells.forEach((cell) => head.append(...contentOf(cell)));
    } else if (cells.some((cell) => text(cell) || isMediaCell(cell))) {
      list.append(decodeItem(cells));
    }
  });
  if (head.childNodes.length) container.append(head);
  container.append(list);
  block.replaceChildren(container);
}
