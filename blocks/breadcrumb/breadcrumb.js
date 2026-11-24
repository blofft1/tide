/**
 * breadcrumb — trail of links ending in the current page title (live .breadcrumbs).
 *
 * Authored shape: ONE cell holding a list — `<li><a href="/en-us">Home</a></li>` per ancestor
 * and a plain-text last item for the current page. The list MOVES as authored (one editable
 * unit). Off-shape content (links in paragraphs) is moved as-is and laid out inline.
 * Colour follows `--breadcrumb-color` (navy by default; white inside an orange title band or
 * with the `light` variant).
 * Variant: `breadcrumb (light)` forces white text.
 */
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'container';
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumbs');
  container.append(nav);
  const list = block.querySelector('ul, ol');
  if (list) {
    nav.append(list);
  } else {
    const trail = document.createElement('div');
    trail.className = 'breadcrumb-trail';
    [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
      trail.append(...cell.childNodes);
    });
    nav.append(trail);
  }
  // live labels each crumb link with its own text
  nav.querySelectorAll('a[href]').forEach((a) => {
    if (!a.hasAttribute('aria-label')) a.setAttribute('aria-label', a.textContent.trim());
  });
  const last = nav.querySelector('li:last-child');
  if (last && !last.querySelector('a')) last.setAttribute('aria-current', 'page');
  block.replaceChildren(container);
}
