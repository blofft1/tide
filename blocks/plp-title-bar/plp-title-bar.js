/**
 * plp-title-bar — product-listing title row (live .plp-title-bar): the page `<h1>` on the
 * left, the orange "Browse other products" pill on the right.
 * Decode tier: template-slotted (fixed composition: one heading slot + one action slot).
 *
 * Authored shape (any cells, any order): the `<h1>` (bold run = the heavy part of the title)
 * and an optional link paragraph (the browse action; live renders a <button>, so the link
 * is unwrapped after its href is read and the slot acts as a button). A link `title` becomes
 * the accessible name. Every node is MOVED; nothing is rebuilt.
 * The block also owns the product-listing page frame (see plp-title-bar.css): breadcrumb
 * offset, the features heading (default `<h3>` in the section after the grid) and the
 * bottom padding of `main`.
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return; // EW9: already decorated
  const nodes = [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.childNodes])
    .filter((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim());

  const container = document.createElement('div');
  container.className = 'container';
  const bar = document.createElement('div');
  bar.className = 'plp-title-bar-row';
  const heading = document.createElement('div');
  heading.className = 'plp-title-bar-heading';
  const action = document.createElement('div');
  action.className = 'plp-title-bar-action';

  nodes.forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE && /^H[1-6]$/.test(n.tagName)) {
      // live nests the title run in a paragraph inside the heading (h1 > p): move the
      // heading's own nodes into one
      if (!n.querySelector('p')) {
        const run = document.createElement('p');
        run.append(...n.childNodes);
        n.append(run);
      }
      heading.append(n);
    } else if (n.nodeType === Node.ELEMENT_NODE && (n.matches('a') || n.querySelector('a'))) {
      action.append(n);
    } else {
      heading.append(n);
    }
  });

  // live renders this action as a <button> (it opens the type/need browser): the authored
  // link's href is read, the anchor unwrapped (EW6) and the slot acts as a button to it
  const link = action.querySelector('a[href]');
  if (link) {
    const href = link.getAttribute('href');
    const title = link.getAttribute('title');
    if (title && title.trim() !== link.textContent.trim()) action.setAttribute('aria-label', title);
    link.replaceWith(...link.childNodes);
    action.setAttribute('role', 'button');
    action.setAttribute('tabindex', '0');
    action.dataset.href = href;
    const go = () => window.location.assign(href);
    action.addEventListener('click', go);
    action.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      go();
    });
  }

  bar.append(heading);
  if (action.childNodes.length) bar.append(action);
  container.append(bar);
  block.replaceChildren(container);
}
