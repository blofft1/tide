/**
 * article-prose — one live article rich-text row (.dynamic-content-wrapper > .row) whose layout
 * the plain default-content prose cannot carry: a column narrower than the container, a
 * coloured band, an info box, or sub-headings (h3/h4) the article prose does not style.
 * Decode tier: template-slotted (one cell of rich text, moved verbatim).
 *
 * Authored shape: one row, one cell of rich text (headings, paragraphs, lists, links).
 * The cell's nodes are MOVED into a `.default-content-wrapper` container so the article
 * prose metrics (article-title-band.css) apply unchanged; this block adds only the variant
 * layout and the h3/h4 metrics.
 *
 * @variants block class (combinable):
 *   w5 | w9 | w10  — live col-lg-5 / col-lg-9 / col-lg-10 column (>= 992px)
 *   center         — the column centred (live justify-content-center)
 *   orange | blue  — full-bleed coloured band, white text (live section-*-bg-white-text)
 *   info           — grey info box with the "!" mark (live .article-info-box)
 *   citations      — hanging-indent reference list (live .rt-citations)
 */

function labelLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    if (a.hasAttribute('aria-label') || a.classList.contains('button')) return;
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

export default function decorate(block) {
  const col = document.createElement('div');
  col.className = 'article-prose-col';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => col.append(...cell.childNodes));
  });
  labelLinks(col);
  const container = document.createElement('div');
  container.className = 'default-content-wrapper';
  container.append(col);
  block.replaceChildren(container);
}
