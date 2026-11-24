/**
 * jump-links — sticky in-page navigation (live .anchor-navigation).
 *
 * Authored shape: ONE cell holding a list; each item is the label of a section heading
 * (`<li>1. What defines a high-quality detergent</li>`), matched to the first h2/h3 whose
 * id or text starts with the label (a leading "6. " number is optional). An item may instead
 * be a link to a heading id (`<a href="#faqs">`). The list MOVES as authored.
 * Behaviour: click scrolls to the target minus the bar height, the item whose
 * target has scrolled past the bar is active, and once the bar's own position scrolls out of
 * view it freezes to the viewport top (fixed + shadow); a spacer keeps the page from jumping.
 */

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function findTarget(item) {
  const link = item.querySelector('a[href*="#"]');
  if (link) {
    const id = decodeURIComponent(link.getAttribute('href').split('#')[1] || '');
    const byId = id && document.getElementById(id);
    if (byId) return byId;
  }
  const key = slug(item.textContent);
  if (!key) return null;
  // "6. FAQs" also matches a heading "FAQs:" (the number is the nav's own prefix)
  const keys = [key, key.replace(/^\d+-/, '')].filter(Boolean);
  const headings = [...document.querySelectorAll('main :is(h2, h3)')];
  const hit = (h) => {
    const text = slug(h.textContent);
    return keys.some((k) => (h.id && (h.id === k || h.id.startsWith(k)))
      || (text && (text.startsWith(k) || k.startsWith(text))));
  };
  return headings.find(hit) || null;
}

export default function decorate(block) {
  const list = block.querySelector('ul, ol');
  const container = document.createElement('div');
  container.className = 'container';
  const nav = document.createElement('nav');
  container.append(nav);
  if (list) {
    nav.append(list);
  } else {
    // flattened fallback: every authored element becomes one item, moved as-is
    const ul = document.createElement('ul');
    [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => {
      const li = document.createElement('li');
      li.append(el);
      ul.append(li);
    });
    nav.append(ul);
  }
  block.replaceChildren(container);

  const wrapper = block.parentElement;
  let spacer = wrapper.querySelector(':scope > .jump-links-spacer');
  if (!spacer) {
    spacer = document.createElement('div');
    spacer.className = 'jump-links-spacer';
    block.before(spacer);
  }

  const items = [...nav.querySelectorAll('li')];
  let targets = [];
  const resolve = () => {
    targets = items.map(findTarget);
  };

  const go = (i) => {
    resolve();
    const t = targets[i];
    if (!t) return;
    const y = t.getBoundingClientRect().top + window.scrollY - block.offsetHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  items.forEach((li, i) => {
    // the item's authored nodes MOVE into a control span (live: li > span[role=button])
    let control = li.querySelector(':scope > .jump-links-item');
    if (!control) {
      control = document.createElement('span');
      control.className = 'jump-links-item';
      control.append(...li.childNodes);
      li.append(control);
    }
    control.setAttribute('role', 'button');
    control.setAttribute('aria-label', `${control.textContent.trim()} section`);
    control.tabIndex = 0;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      go(i);
    });
    control.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(i);
      }
    });
  });

  const onScroll = () => {
    const frozen = spacer.getBoundingClientRect().top < 0;
    if (frozen !== block.classList.contains('is-frozen')) {
      // live measures the bar with clientHeight (border excluded)
      spacer.style.height = frozen ? `${block.clientHeight}px` : '';
      block.classList.toggle('is-frozen', frozen);
    }
    let active = -1;
    targets.forEach((t, i) => {
      if (t && t.getBoundingClientRect().top - block.offsetHeight <= 1) active = i;
    });
    items.forEach((li, i) => li.classList.toggle('active', i === active));
  };

  // targets live in later sections: resolve once they are decorated
  resolve();
  window.addEventListener('scroll', () => {
    if (targets.some((t) => !t)) resolve();
    onScroll();
  }, { passive: true });
  onScroll();
}
