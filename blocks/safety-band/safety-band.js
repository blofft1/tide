/**
 * safety-band — the blue "Safety" band of product-listing pages (live
 * .section-blue-bg-white-text: header column h3, left column of three centred icon
 * columns, right column h4 + body + Read More button).
 * Decode tier: reconstructive (rows classified by content).
 *
 * Authored shape (rows, any order of the cell content kinds):
 *   title row : a heading only (`<h3>Safety</h3>`).
 *   icon row  : one cell per icon column — image `<p>`, then its text `<p>`s
 *               (`KEEP THEM`, `<strong>UP</strong>`). Several icon rows are merged.
 *   text row  : heading (h4), body `<p>`s, CTA `<p><a>` (rendered as the orange button;
 *               the link `title` = the live aria-label).
 * Missing rows are simply omitted from the output.
 */
const text = (node) => node.textContent.replace(/\s+/g, ' ').trim();
const contentOf = (cell) => [...cell.childNodes]
  .filter((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim());

function div(className) {
  const node = document.createElement('div');
  node.className = className;
  return node;
}

function labelLinks(root) {
  root.querySelectorAll('a[title]').forEach((a) => {
    const t = a.getAttribute('title').trim();
    if (t && t !== text(a)) a.setAttribute('aria-label', t);
    a.removeAttribute('title');
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .safety-band-inner')) return; // already decorated
  const inner = div('safety-band-inner container');
  const head = div('safety-band-title');
  const icons = div('safety-band-icons');
  const body = div('safety-band-text');

  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (row.querySelector('picture, img')) {
      cells.filter((c) => c.querySelector('picture, img') || text(c)).forEach((cell) => {
        const item = div('safety-band-icon');
        item.append(...contentOf(cell));
        item.querySelectorAll('picture, img').forEach((m) => {
          const holder = m.closest('p') || m;
          holder.classList.add('safety-band-icon-media');
        });
        icons.append(item);
      });
      return;
    }
    const nodes = cells.flatMap(contentOf);
    const onlyHeading = nodes.length > 0 && nodes.every((n) => /^H[1-6]$/.test(n.tagName));
    if (onlyHeading && !head.childNodes.length && !body.childNodes.length) {
      head.append(...nodes);
    } else if (nodes.length) {
      body.append(...nodes);
    }
  });

  body.querySelectorAll('a[href]').forEach((a) => {
    const p = a.closest('p');
    if (p && text(p) === text(a)) {
      p.className = 'safety-band-cta';
      a.className = 'safety-band-button';
    }
  });

  if (head.childNodes.length) inner.append(head);
  const row = div('safety-band-row');
  if (icons.childNodes.length) {
    const left = div('safety-band-left');
    left.append(icons);
    row.append(left);
  }
  if (body.childNodes.length) row.append(body);
  inner.append(row);
  block.replaceChildren(inner);
  labelLinks(block);
}
