/**
 * topic-hub-guide-header — the head of a topic hub's guide (live .alp-guide-header): rich
 * text (h2 title, h5 / p deck) and an optional row of pictogram items (live
 * .alp-icons-section: icon above an h6 + text at >= 992px, icon left below).
 * Decode tier: template-slotted head + reconstructive icon items (one per row).
 *
 * Authored shape:
 *   - head row (one cell): `<h2>`, then any `<h5>` / `<p>` deck
 *   - icon rows: cell 1 = icon shown from 992px, cell 2 = icon below 992px (optional; one
 *     icon serves both widths), last cell = `<h6>` + optional `<p>`
 * Variant `orange`: the desktop band is orange with white text (stain hub).
 */

function make(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

const media = (cell) => cell.querySelector('picture') || cell.querySelector('img');

// the bare-text cell (single-paragraph cells arrive unwrapped) gets its paragraph back
function cellNodes(cell) {
  const kids = [...cell.children];
  if (kids.length) return kids;
  if (!cell.textContent.trim()) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

export default function decorate(block) {
  const head = make('div', 'thgh-head');
  const icons = make('div', 'thgh-icons');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const imageCells = cells.filter((c) => media(c) && !c.textContent.trim());
    if (!imageCells.length) {
      cells.forEach((c) => head.append(...cellNodes(c)));
      return;
    }
    const item = make('div', 'thgh-icon');
    const pics = make('div', 'thgh-icon-media');
    imageCells.forEach((c, i) => {
      const pic = media(c);
      if (imageCells.length > 1) pic.classList.add(i === 0 ? 'thgh-desktop' : 'thgh-mobile');
      pics.append(pic);
    });
    const text = make('div', 'thgh-icon-text');
    cells.filter((c) => !imageCells.includes(c)).forEach((c) => text.append(...cellNodes(c)));
    item.append(pics, text);
    icons.append(item);
  });

  const container = make('div', 'container');
  if (head.children.length) container.append(head);
  if (icons.children.length) container.append(icons);
  block.replaceChildren(container);
}
