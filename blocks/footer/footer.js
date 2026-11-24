import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer — template-slotted tide.com footer. The authored /footer document carries, in order:
 * social (label + linked icons), shop (title + accordion labels), wash (title + links),
 * help (title + links), related (label + links), badges (linked images), legal (two lists).
 * Authored nodes are MOVED into the slots; accordions open below 768px only.
 */

const CHEVRON = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10"
 viewBox="0 0 17 10" aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,
9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,
6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)"
 fill="#13259c"/></svg>`;

const ROLES = ['social', 'shop', 'wash', 'help', 'related', 'badges', 'legal'];
const TABLET = window.matchMedia('(width >= 768px)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function svg(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.replace(/\n/g, '');
  return t.content.firstElementChild;
}

// whitespace-only text nodes between inline footer items render as gaps the source has not
function tidy(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const blank = [];
  while (walker.nextNode()) {
    if (!walker.currentNode.textContent.trim()) blank.push(walker.currentNode);
  }
  blank.forEach((n) => n.remove());
}

function wrap(node, className) {
  const w = el('div', className);
  if (node) w.append(node);
  return w;
}

function navColumn(section, className) {
  const col = el('div', className, { role: 'menu' });
  if (!section) return col;
  const title = section.querySelector('p');
  const list = section.querySelector('ul');
  col.append(wrap(title, 'footer-nav-title'));
  if (list) col.append(list);
  return col;
}

function accordion(li) {
  const box = el('div', 'expandable');
  const label = li.textContent.trim();
  const head = el('div', 'expandable-header', {
    role: 'heading',
    'aria-level': '4',
    'aria-expanded': 'false',
    tabindex: '0',
  });
  if (label) head.setAttribute('aria-label', label);
  head.append(...li.childNodes, svg(CHEVRON));
  box.append(head, el('div', 'expandable-content'));
  li.append(box);
  const toggle = () => {
    if (TABLET.matches) return;
    box.classList.toggle('is-open');
    head.setAttribute('aria-expanded', String(box.classList.contains('is-open')));
  };
  head.addEventListener('click', toggle);
  head.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    toggle();
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  tidy(fragment);

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const part = Object.fromEntries(ROLES.map((r, i) => [r, sections[i] || null]));
  const site = el('div', 'site-footer', { id: 'site-footer' });

  // social band
  const social = el('div', 'footer-social');
  const socialBox = el('div', 'container');
  social.append(socialBox);
  if (part.social) {
    socialBox.append(wrap(part.social.querySelector('p'), 'footer-social-label'));
    const icons = part.social.querySelector('ul');
    // accessible name: the authored link title (live carries it as aria-label)
    if (icons) {
      icons.querySelectorAll('a[title]').forEach((a) => a.setAttribute('aria-label', a.title));
    }
    if (icons) socialBox.append(icons);
  }

  const container = el('div', 'container');
  const row = el('div', 'row');
  container.append(row);

  // shop products: title + accordions (col-lg-8)
  const shop = el('div', 'col col-lg-8 footer-nav');
  const shopRow = el('div', 'row footer-shop');
  shop.append(shopRow);
  if (part.shop) {
    shopRow.append(wrap(wrap(part.shop.querySelector('p'), 'footer-nav-title'), 'col'));
    const list = part.shop.querySelector('ul');
    if (list) {
      [...list.querySelectorAll(':scope > li')].forEach((li) => accordion(li));
      shopRow.append(list);
    }
  }

  // how to wash clothes + help & support (col-lg-4)
  const side = el('div', 'col col-lg-4 footer-nav');
  const sideRow = el('div', 'row');
  side.append(sideRow);
  sideRow.append(
    navColumn(part.wash, 'col col-md-6 col-lg-12'),
    navColumn(part.help, 'col col-md-6 col-lg-12'),
  );

  // related brands
  const related = el('div', 'col footer-related', { role: 'menu' });
  if (part.related) {
    related.append(wrap(part.related.querySelector('p'), 'footer-related-label'));
    related.append(wrap(part.related.querySelector('ul'), 'footer-related-nav'));
  }

  // badges
  const badges = el('div', 'col footer-icons');
  if (part.badges) badges.append(...part.badges.querySelectorAll('ul, p'));

  // legal / general navigation
  const general = el('div', 'col footer-general', {
    role: 'menu',
    'aria-label': 'General navigation',
  });
  if (part.legal) {
    const lists = [...part.legal.querySelectorAll('ul')];
    lists.forEach((ul) => [...ul.children].forEach((li) => {
      // a text-only notice renders as an inline run (a <span> on live); the © line stays a block
      const textOnly = !li.querySelector('a, picture') && li.textContent.trim();
      if (textOnly && !li.textContent.trim().startsWith('©')) {
        const run = el('span');
        run.append(...li.childNodes);
        li.append(run);
      }
    }));
    general.append(...lists);
    const consent = general.querySelector('a[href="#do-not-sell"]');
    if (consent) consent.addEventListener('click', (e) => e.preventDefault());
  }

  row.append(shop, side, related, badges, general);
  site.append(social, container);
  block.replaceChildren(site);
}
