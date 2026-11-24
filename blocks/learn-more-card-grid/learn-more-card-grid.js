/**
 * learn-more-card-grid — article preview cards (image, title link, excerpt, "Read More" /
 * "Learn More" button) under an optional section heading. Home "Learn more", our-commitment
 * article previews, how-to-wash-clothes listings (live .preview-box / .article-preview).
 * Schema: stardust/eds-schema/en-us.json (sections articles-head + articles). Decode tier:
 * reconstructive (repeat group: one card per row).
 *
 * Authoring:
 *   1. optional head row: the section heading (<h2>)
 *   2..n. one row per card: image | title (a paragraph holding one plain link, or a heading)
 *      + excerpt paragraph(s) + CTA paragraph (italic link = orange button, bold = navy).
 *      A card that ends in a plain link paragraph ("Read More", live .article-preview without
 *      .preview-box) reads that link as a text CTA and its first text paragraph as the title;
 *      its image may be linked.
 *
 * @variants block class: three-up — 3 columns from 992px (default 2, centred when fewer);
 *   flush — no row margins (live .margin-vertical-none); main-row — a three-up row in the
 *   main-articles slot (no top margin on its cards)
 */

// live keeps a (hidden) chevron glyph in every preview box
const CHEVRON = '<svg class="lmc-chevron" xmlns="http://www.w3.org/2000/svg" width="17" '
  + 'height="10" viewBox="0 0 17 10" aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,'
  + '1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,'
  + '1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" '
  + 'transform="translate(0 10) rotate(-90)" fill="#13259c"/></svg>';

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function cellNodes(cell) {
  const kids = [...cell.children];
  if (kids.length) return kids;
  if (!cell.textContent.trim()) return [];
  // HARNESS-ONLY fallback (EW5): a bare-text cell; DA content always carries a <p>.
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

// Authored link title = the source's accessible name (aria-label); the foundation's
// decorateButtons echoes the label into title, which live never carries.
function labelLinks(root) {
  root.querySelectorAll('a[title]').forEach((a) => {
    const t = a.getAttribute('title').trim();
    if (t && t !== a.textContent.trim()) a.setAttribute('aria-label', t);
    a.removeAttribute('title');
  });
}

const linkOnly = (el) => {
  const a = el.tagName === 'P' ? el.querySelector('a') : null;
  return a && el.textContent.trim() === a.textContent.trim() ? a : null;
};
const isButton = (el) => {
  const a = linkOnly(el);
  return !!a && (a.classList.contains('button') || !!a.closest('strong, em'));
};

function buildCard(nodes) {
  const col = document.createElement('div');
  col.className = 'lmc-col';
  const card = document.createElement('div');
  card.className = 'lmc-card';
  const image = document.createElement('div');
  image.className = 'lmc-image';
  const body = document.createElement('div');
  body.className = 'lmc-body';
  const content = document.createElement('div');
  content.className = 'lmc-content';

  let title = null;
  const ctas = [];
  // a trailing plain link after text = "Read More" text CTA (live .article-preview-link)
  const texts = nodes.filter((el) => !(media(el) && !el.textContent.trim()));
  const tail = texts.length > 1 ? texts[texts.length - 1] : null;
  const textCta = tail && linkOnly(tail) && !isButton(tail) ? tail : null;
  if (textCta) card.classList.add('lmc-plain');
  nodes.forEach((el) => {
    const m = media(el);
    if (m && !el.textContent.trim()) {
      // a linked image (live .article-preview-image a) keeps its link
      const link = m.closest('a');
      image.append(link && el.contains(link) ? link : (m.closest('picture') || m));
    } else if (el === textCta) {
      ctas.push(el);
    } else if (!title && (isHeading(el) || (linkOnly(el) && !isButton(el))
      || (textCta && el === texts[0]))) {
      title = el;
      content.append(wrapNode(el, 'lmc-title'));
    } else if (isButton(el)) {
      ctas.push(el);
    } else {
      content.append(wrapNode(el, 'lmc-text'));
    }
  });
  ctas.forEach((p) => content.append(wrapNode(p, 'lmc-cta')));
  body.append(content);
  if (image.children.length) card.append(image);
  card.append(body);
  const ctaLink = textCta && textCta.querySelector('a');
  if (ctaLink) {
    // live .article-preview-arrow: a text-less (hidden) chevron link to the same target,
    // carrying the CTA's label
    const arrow = document.createElement('a');
    arrow.className = 'lmc-arrow';
    arrow.href = ctaLink.href;
    if (ctaLink.title) arrow.title = ctaLink.title;
    arrow.innerHTML = CHEVRON;
    card.append(arrow);
  } else {
    card.insertAdjacentHTML('beforeend', CHEVRON);
  }
  col.append(card);
  return col;
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = document.createElement('div');
  head.className = 'lmc-head';
  const grid = document.createElement('div');
  grid.className = 'lmc-grid';

  rows.forEach((row) => {
    const nodes = [...row.children].flatMap(cellNodes);
    const isCard = nodes.some(media) || nodes.some(isButton);
    if (isCard) {
      grid.append(buildCard(nodes));
    } else {
      nodes.forEach((el) => head.append(wrapNode(el, isHeading(el) ? 'lmc-heading' : 'lmc-intro')));
    }
  });

  const container = document.createElement('div');
  container.className = 'container';
  if (head.children.length) container.append(head);
  container.append(grid);
  block.replaceChildren(container);
  labelLinks(block);
}
