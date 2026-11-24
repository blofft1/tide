/**
 * step-timeline — a numbered how-to guide on a vertical progress rail (live
 * .guide-wrapper-list-narrow: optional white-stripe headline, then one .guide-step per step,
 * each with a ring mark on a line; steps may carry sub-steps with recommended products).
 * Decode tier: template-slotted headline + reconstructive steps (one step per row).
 *
 * Authored shape:
 *   - optional headline row (one cell starting with a heading): `<h3>` + optional `<p>`(s)
 *   - step rows: cell 1 = step title ("Step 1. Remove the excess stain"), cell 2 = step text
 *     (any rich text: paragraphs, lists, links); cells 3+ = sub-steps, one per cell:
 *     first `<p>` = sub-step title, then its text; an optional `<h5>` ("Recommended
 *     Products:") starts the product list: each product = an image paragraph followed by a
 *     paragraph holding the product link (the whole card becomes clickable).
 */

function make(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function moveCell(cell, className) {
  const box = make('div', className);
  box.append(...cell.childNodes);
  return box;
}

const isImageOnly = (el) => !el.textContent.trim() && !!el.querySelector('picture, img')
  && !el.querySelector('a');

// One product = an image paragraph + a paragraph holding the product link. Live renders the
// card as one link (a > image + name p): the authored <a> MOVES out to become the card, the
// authored <p> keeps the link's text (EW: both authored elements survive).
function finishCard(card, image, nameP) {
  const link = nameP ? nameP.querySelector('a[href]') : null;
  const name = make('div', 'step-timeline-product-name');
  if (link) {
    nameP.append(...link.childNodes);
    link.remove();
    name.append(nameP);
    link.className = 'step-timeline-product-link';
    if (image) link.append(image);
    link.append(name);
    card.append(link);
    return;
  }
  if (image) card.append(image);
  if (nameP) {
    name.append(nameP);
    card.append(name);
  }
}

function buildProducts(nodes) {
  const wrap = make('div', 'step-timeline-products');
  const grid = make('div', 'step-timeline-product-grid');
  let pending = null;
  const flush = (nameP) => {
    const card = make('div', 'step-timeline-product');
    finishCard(card, pending, nameP);
    grid.append(card);
    pending = null;
  };
  nodes.forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) {
      wrap.append(node);
    } else if (isImageOnly(node) || node.matches('picture, img')) {
      if (pending) flush(null);
      pending = make('div', 'step-timeline-product-image');
      pending.append(node.matches('picture, img') ? node
        : (node.querySelector('picture') || node.querySelector('img')));
    } else {
      flush(node);
    }
  });
  if (pending) flush(null);
  if (grid.children.length) wrap.append(grid);
  return wrap;
}

function buildSubstep(cell) {
  const nodes = [...cell.children];
  if (!nodes.length && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    nodes.push(p);
  }
  if (!nodes.length) return null;
  const sub = make('div', 'step-timeline-substep');
  const title = make('div', 'step-timeline-substep-title');
  title.append(nodes.shift());
  sub.append(title);
  const split = nodes.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const textNodes = split < 0 ? nodes : nodes.slice(0, split);
  if (textNodes.length) {
    const text = make('div', 'step-timeline-substep-text');
    text.append(...textNodes);
    sub.append(text);
  }
  if (split >= 0) sub.append(buildProducts(nodes.slice(split)));
  return sub;
}

/**
 * Live rich text labels internal links "<target slug words> <link text>" (CMS convention) in
 * the step texts and the closing prose; attribute only, the authored text is untouched.
 */
function labelLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    if (a.hasAttribute('aria-label')) return;
    let url;
    try {
      url = new URL(a.getAttribute('href'), window.location.href);
    } catch (e) {
      return;
    }
    if (url.origin !== window.location.origin) return;
    const leaf = url.pathname.split('/').filter(Boolean).pop();
    if (leaf) a.setAttribute('aria-label', `${leaf.replace(/-/g, ' ')} ${a.textContent.trim()}`);
  });
}

function buildBar() {
  const bar = make('div', 'step-timeline-bar');
  bar.setAttribute('aria-hidden', 'true');
  bar.append(
    make('span', 'step-timeline-line-top'),
    make('span', 'step-timeline-mark'),
    make('span', 'step-timeline-line-bottom'),
  );
  return bar;
}

export default function decorate(block) {
  const headline = make('div', 'step-timeline-headline');
  const steps = make('div', 'step-timeline-steps');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const first = cells[0];
    if (!first) return;
    const lead = first.firstElementChild;
    if (cells.length === 1 && lead && /^H[1-6]$/.test(lead.tagName) && !steps.children.length) {
      const intro = moveCell(first, 'step-timeline-intro');
      headline.append(make('div', 'step-timeline-stripe'), intro);
      return;
    }
    const step = make('div', 'step-timeline-step');
    const content = make('div', 'step-timeline-content');
    content.append(moveCell(first, 'step-timeline-title'));
    if (cells[1]) {
      const text = moveCell(cells[1], 'step-timeline-text');
      labelLinks(text);
      content.append(text);
    }
    const subs = cells.slice(2).map(buildSubstep).filter(Boolean);
    if (subs.length) {
      const list = make('div', 'step-timeline-substeps');
      list.append(...subs);
      content.append(list);
    }
    step.append(buildBar(), content);
    steps.append(step);
  });

  const container = make('div', 'container');
  if (headline.children.length) container.append(headline);
  container.append(steps);
  block.replaceChildren(container);
  const main = block.closest('main');
  if (main) {
    main.querySelectorAll('.section.topic-hub-prose .default-content-wrapper')
      .forEach(labelLinks);
  }
}
