/**
 * columns — a text | image split row (live article .row with .left-column / .right-column,
 * col-lg-6 each). Text cells carry the article prose; an image-only cell keeps the image's
 * natural size (live renders the icon art unscaled, capped by the column).
 *
 * Authored shape: one row, one cell per column (rich text or a lone picture).
 * @variants block class: top — columns top-aligned (default: vertically centred, live
 *   content-centered-vertically); numbered — ordered lists with circled numbers (live
 *   .list-numbers-secondary).
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && !col.textContent.trim()) {
        col.classList.add('columns-img-col');
      } else {
        // the article prose metrics (article-title-band.css) apply to the text column
        col.classList.add('columns-text-col', 'default-content-wrapper');
      }
    });
  });
}
