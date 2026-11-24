/**
 * sitemap — the tide.com /en-us/sitemap link index (live .sitemap-page).
 * Authored rows: first row = the page h1; then one row per column: an h2 (linked to its
 * own anchor), lists of links and h3-titled sublists. A row without an h2 continues the
 * column above it (the list that follows a sublist); a row holding only a linked
 * paragraph is an extra link column (live .sitemap-additional-links).
 * @param {Element} block the block element
 */
export default function decorate(block) {
  let column = null;
  [...block.children].forEach((row, i) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    if (i === 0 && cell.querySelector('h1')) {
      row.classList.add('sitemap-title');
      return;
    }
    const hasHeading = cell.querySelector('h2');
    const onlyLink = !hasHeading && !cell.querySelector('ul, h3') && cell.querySelector('a');
    if (onlyLink) {
      row.classList.add('sitemap-column', 'sitemap-extra');
      column = null;
      return;
    }
    if (!hasHeading && column) {
      column.append(...cell.childNodes);
      row.remove();
      return;
    }
    row.classList.add('sitemap-column');
    column = cell;
  });
  // live menu links carry their label as aria-label (attribute only; text untouched)
  block.querySelectorAll('li a, .sitemap-extra a').forEach((a) => {
    if (!a.hasAttribute('aria-label')) a.setAttribute('aria-label', a.title || a.textContent.trim());
  });
  block.querySelectorAll(':scope > .sitemap-column').forEach((col, i) => {
    if (i === 1 || i === 2) col.classList.add('sitemap-wide');
  });
}
