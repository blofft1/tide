/**
 * topic-hub-stain-index — the stain index of a topic hub (live .article-listing): a search box
 * that filters the index links, and one collapsible category per group of stain links
 * (accordion below 992px, every list open above), over decorative-but-authored stain photos.
 * Decode tier: reconstructive (one category per row); the search row is template-slotted.
 *
 * Authored shape (rows, any order; classified by content):
 *   - photos row: one or more images (live left/right stain photos, alternating, >= 992px)
 *   - search row: label `<p>` ("Type the stain you're looking to remove"), then the
 *     placeholder `<p>` ("ex: grease" — a setting, kept hidden in the DOM)
 *   - category rows: cell 1 = the category name, cell 2 = a list of links to stain pages
 * The stain-guide-widget's CTA on the same page follows the index link whose label matches
 * the selected wheel item (live: Learn More opens the selected stain's guide).
 */

let uid = 0;

function make(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');

// the bare-text cell (single-paragraph cells arrive unwrapped) gets its paragraph back
function cellNodes(cell) {
  const kids = [...cell.children];
  if (kids.length) return kids;
  if (!cell.textContent.trim()) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

// live chevron glyph (decorative)
const CHEVRON = 'M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415'
  + 'a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2'
  + 'A1.431,1.431,0,0,1,8.571,17';

function chevron() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 17 10');
  svg.setAttribute('width', '17');
  svg.setAttribute('height', '10');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', CHEVRON);
  path.setAttribute('transform', 'translate(0 10) rotate(-90)');
  path.setAttribute('fill', '#13259c');
  svg.append(path);
  return svg;
}

function buildCategory(nameCell, listCell, desktop) {
  const cat = make('div', 'thsi-cat');
  const head = cellNodes(nameCell)[0];
  if (!head) return null;
  const label = head.textContent.trim();
  const id = slug(label) || `thsi-cat-${uid}`;
  if (!document.getElementById(id)) cat.id = id;
  uid += 1;
  head.classList.add('thsi-cat-header');
  head.setAttribute('role', 'button');
  head.tabIndex = 0;
  head.setAttribute('aria-expanded', 'false');
  head.setAttribute('aria-controls', `${id}-content`);
  head.setAttribute('aria-label', label);
  head.append(chevron());
  const content = make('div', 'thsi-cat-content');
  content.id = `${id}-content`;
  const list = listCell ? listCell.querySelector('ul, ol') : null;
  if (list) {
    list.classList.add('thsi-cat-links');
    content.append(list);
  } else if (listCell) {
    content.append(...listCell.childNodes);
  }
  cat.append(head, content);
  const toggle = () => {
    if (desktop.matches) return;
    const on = !cat.classList.contains('is-open');
    cat.classList.toggle('is-open', on);
    head.setAttribute('aria-expanded', String(on));
  };
  head.addEventListener('click', toggle);
  head.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
  return cat;
}

function buildSearch(nodes, links) {
  const search = make('div', 'thsi-search');
  const [label, placeholder] = nodes;
  const field = make('div', 'thsi-search-field');
  const input = make('input');
  input.type = 'text';
  input.id = 'article-listing-search-input';
  input.autocomplete = 'off';
  if (label) {
    label.classList.add('thsi-search-label');
    label.id = 'article-listing-search-label';
    input.setAttribute('aria-labelledby', label.id);
    search.append(label);
  }
  if (placeholder) {
    // @ew-exempt the placeholder is a setting: it stays in the DOM (hidden) for the author
    placeholder.classList.add('thsi-search-placeholder');
    placeholder.hidden = true;
    input.placeholder = placeholder.textContent.trim();
  }
  const results = make('div', 'thsi-search-results');
  results.hidden = true;
  field.append(input, results);
  if (placeholder) field.append(placeholder);
  search.append(field);
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (q) {
      links.filter((a) => a.textContent.toLowerCase().includes(q))
        .forEach((a) => results.append(a.cloneNode(true)));
    }
    results.hidden = !results.children.length;
  });
  return search;
}

// Learn More on the stain wheel follows the matching index link (capture: before the widget)
function bridgeWheel(links) {
  if (!links.length || document.body.dataset.thsiWheel) return;
  document.body.dataset.thsiWheel = 'true';
  const hrefFor = (label) => {
    const n = norm(label);
    if (!n) return null;
    const hit = links.find((a) => norm(a.textContent) === n)
      || links.find((a) => norm(a.textContent).startsWith(n) || n.startsWith(norm(a.textContent)));
    return hit ? hit.getAttribute('href') : null;
  };
  const follow = (e) => {
    const control = e.target.closest && e.target.closest('.stain-guide-widget .sg-cta-control');
    if (!control) return;
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    const sel = control.closest('.stain-guide-widget').querySelector('.sg-picker-wrap li.is-selected');
    const href = sel ? hrefFor(sel.textContent) : null;
    if (!href) return;
    e.stopPropagation();
    window.location.href = href;
  };
  document.addEventListener('click', follow, true);
  document.addEventListener('keydown', follow, true);
}

export default function decorate(block) {
  const desktop = window.matchMedia('(width >= 992px)');
  const photos = make('div', 'thsi-photos');
  const list = make('div', 'thsi-list');
  let searchNodes = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const hasList = cells.length > 1 && cells[1].querySelector('ul, ol, a');
    if (hasList) {
      const cat = buildCategory(cells[0], cells[1], desktop);
      if (cat) list.append(cat);
      return;
    }
    const nodes = cells.flatMap(cellNodes);
    const isPhoto = (n) => !n.textContent.trim() && n.matches('picture, img, :has(picture, img)');
    if (nodes.length && nodes.every(isPhoto)) {
      nodes.forEach((n) => {
        photos.append(...(n.matches('picture, img') ? [n]
          : n.querySelectorAll('picture, img:not(picture img)')));
      });
    } else if (!searchNodes) {
      searchNodes = nodes;
    }
  });

  const links = [...list.querySelectorAll('a[href]')];
  const row = make('div', 'thsi-row');
  if (searchNodes) row.append(buildSearch(searchNodes, links));
  row.append(list);
  const container = make('div', 'container');
  container.append(row);
  block.replaceChildren(...(photos.children.length ? [photos] : []), container);
  bridgeWheel(links);
}
