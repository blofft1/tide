/**
 * stain-steps — the wide numbered how-to guide of a stain page (live .guide-wrapper
 * .guide-wrapper-list): per step a ring mark on a vertical rail, the step number and title,
 * the step text, optional "Recommended Products:" / "Recommended Articles:" and the step
 * photo beside it (below it under 992px).
 * Decode tier: reconstructive (one step per row), slots filled by content, never by index.
 *
 * Authored shape, one row per step:
 *   - cell 1: `<p>Step n</p>` + `<p>` step title
 *   - cell 2: the step text (rich text)
 *   - optional cell: `<h5>` label, then per product an image paragraph followed by its link
 *     paragraph (the product card links), or per article a link paragraph
 *   - last cell: the step image
 */

function make(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// live .guide-step-article right chevron (decorative)
const CHEVRON = '<svg class="stain-steps-chevron" xmlns="http://www.w3.org/2000/svg" width="10" '
  + 'height="17" viewBox="0 0 17 10" aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,'
  + '1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,'
  + '1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" '
  + 'transform="translate(0 10) rotate(-90)" fill="currentColor"/></svg>';

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

function buildExtra(cell) {
  const extra = make('div', 'stain-steps-extra');
  const list = make('div', 'stain-steps-list');
  let pending = null;
  [...cell.children].forEach((el) => {
    const m = media(el);
    if (/^H[1-6]$/.test(el.tagName)) {
      extra.append(el);
    } else if (m && !el.textContent.trim()) {
      pending = el;
    } else if (el.querySelector('a')) {
      const item = make('div', pending ? 'stain-steps-product' : 'stain-steps-article');
      if (pending) {
        const img = make('div', 'stain-steps-product-image');
        img.append(pending);
        item.append(img);
      }
      const name = make('div', pending ? 'stain-steps-product-name' : 'stain-steps-article-link');
      name.append(el);
      item.append(name);
      if (!pending) el.querySelector('a').insertAdjacentHTML('beforeend', CHEVRON);
      pending = null;
      list.append(item);
    } else {
      extra.append(el);
    }
  });
  extra.append(list);
  if (list.querySelector('.stain-steps-product')) extra.classList.add('products');
  return extra;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .stain-steps-step')) return; // EW9 re-entrant
  const steps = [...block.children].map((row) => {
    const cells = [...row.children];
    const step = make('div', 'stain-steps-step');
    const rail = make('div', 'stain-steps-rail');
    const content = make('div', 'stain-steps-content');
    const image = make('div', 'stain-steps-image');
    const last = cells[cells.length - 1];
    if (cells.length > 1 && last && media(last) && !last.textContent.trim()) {
      image.append(media(last).closest('picture') || media(last));
      cells.pop();
    }
    const [head, text, ...rest] = cells;
    if (head) {
      const h = make('div', 'stain-steps-head');
      h.append(...head.children);
      content.append(h);
    }
    if (text) {
      const t = make('div', 'stain-steps-text');
      t.append(...text.children);
      content.append(t);
    }
    rest.forEach((cell) => content.append(buildExtra(cell)));
    const body = make('div', 'stain-steps-body');
    body.append(content, image);
    step.append(rail, body);
    return step;
  });
  block.replaceChildren(...steps);
  // live step-text links carry the CMS "<target> <label>" aria-label (authored as title)
  block.querySelectorAll('.stain-steps-text a[title]').forEach((a) => {
    a.setAttribute('aria-label', a.title);
  });
}
