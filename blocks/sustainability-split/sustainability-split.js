/**
 * sustainability-split — the rich-text / image rows of a sustainability topic page (live
 * .dynamic-content-wrapper > .row: .left-column rich text, .right-column picture or a
 * checkmark list; a one-column row is the centered wide rich text, col-lg-10).
 * Decode tier: reconstructive — one authored row = one live row; the authored row and cell
 * elements stay in place (classes only), nothing is rebuilt.
 *
 * Authored shape (one block per section, so every row keeps the live 35/80px row margins):
 *   - two-cell row: cell 1 = rich text (`<h2>` + `<p>`s), cell 2 = a picture, or rich text;
 *     a cell 2 whose first element is a list renders as the orange checkmark list
 *     (live .list-checkmarks-secondary)
 *   - one-cell row: wide centered rich text
 * Variant `centered` (live .content-centered-vertically): 6/6 columns, vertically centered.
 * Internal prose links get live's aria-label "<target slug words> <link text>" (attribute only).
 */

function labelLinks(block) {
  block.querySelectorAll('a[href]').forEach((a) => {
    if (a.hasAttribute('aria-label')) return;
    let url;
    try {
      url = new URL(a.getAttribute('href'), window.location.href);
    } catch (e) {
      return;
    }
    if (url.origin !== window.location.origin) return;
    const leaf = url.pathname.split('/').filter(Boolean).pop();
    if (!leaf) return;
    a.setAttribute('aria-label', `${leaf.replace(/-/g, ' ')} ${a.textContent.trim()}`);
  });
}

const isMedia = (cell) => !!cell.querySelector('picture, img') && !cell.textContent.trim();

export default function decorate(block) {
  labelLinks(block);
  const container = document.createElement('div');
  container.className = 'container';
  [...block.children].forEach((row) => {
    row.classList.add('sustainability-split-row');
    const cells = [...row.children];
    if (cells.length === 1) {
      row.classList.add('wide');
      cells[0].classList.add('sustainability-split-wide', 'sustainability-split-text');
    } else {
      cells.forEach((cell, i) => {
        cell.classList.add(i === 0 ? 'sustainability-split-left' : 'sustainability-split-right');
        if (isMedia(cell)) {
          cell.classList.add('sustainability-split-media');
          return;
        }
        cell.classList.add('sustainability-split-text');
        const first = cell.firstElementChild;
        if (i > 0 && first && first.matches('ul, ol')) {
          cell.classList.add('sustainability-split-checklist');
          // live li > p: a single-paragraph item arrives unwrapped; its nodes MOVE into a <p>
          first.querySelectorAll(':scope > li').forEach((li) => {
            if (li.querySelector(':scope > p')) return;
            const p = document.createElement('p');
            p.append(...li.childNodes);
            li.append(p);
          });
        }
      });
    }
    container.append(row);
  });
  block.append(container);
}
