import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header — template-slotted tide.com chrome (topbar, search bar, mega-menu, mobile drawer,
 * locale modal). The authored /nav document carries four default-content sections, found by
 * content (order-tolerant): brand (logo link), menu (nested list), utility (family line,
 * brand-logo list, utility links) and locale (heading, locale links, "Select Location" link).
 * Authored nodes are MOVED into the slots; the mobile drawer is built on first open from
 * instrumentation-free clones (EW4). Behaviour follows stardust/chrome/header-contract.json.
 *
 * @ew-exempt <a> "Skip to Content", the search placeholder and aria labels — block UI strings
 */

const DESKTOP = window.matchMedia('(width >= 992px)');

const CHEVRON = (fill) => `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10"
 viewBox="0 0 17 10" aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,
9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,
6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)"
 fill="${fill}"/></svg>`;

const SEARCH = `<svg xmlns="http://www.w3.org/2000/svg" width="16.605" height="19.271"
 viewBox="0 0 16.605 19.271" aria-hidden="true"><g transform="translate(1.5 1.5)"><circle cx="6"
 cy="6" r="6" fill="none" stroke-miterlimit="10" stroke-width="3"/><path d="M-3.306,0l3.07,3.952"
 transform="translate(13.236 11.715)" fill="none" stroke-linecap="round" stroke-miterlimit="10"
 stroke-width="3"/></g></svg>`;

const USER = `<svg width="24" height="25" viewBox="0 0 24 25" fill="none"
 xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd"
 clip-rule="evenodd" d="M1.25 12.5C1.25 6.563 6.063 1.75 12 1.75C17.937 1.75 22.75 6.563 22.75
 12.5C22.75 18.437 17.937 23.25 12 23.25C6.063 23.25 1.25 18.437 1.25 12.5ZM12 3.25C6.891 3.25
 2.75 7.391 2.75 12.5C2.75 17.609 6.891 21.75 12 21.75C17.109 21.75 21.25 17.609 21.25 12.5C21.25
 7.391 17.109 3.25 12 3.25Z" fill="#1B3392" stroke="white" stroke-width="0.5"
 stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd"
 d="M8.75 9.5C8.75 7.705 10.205 6.25 12 6.25C13.795 6.25 15.25 7.705 15.25 9.5C15.25 11.295
 13.795 12.75 12 12.75C10.205 12.75 8.75 11.295 8.75 9.5ZM12 7.75C11.034 7.75 10.25 8.534 10.25
 9.5C10.25 10.467 11.034 11.25 12 11.25C12.967 11.25 13.75 10.467 13.75 9.5C13.75 8.534 12.967
 7.75 12 7.75Z" fill="#1B3392" stroke="white" stroke-width="0.5" stroke-linejoin="round"/><path
 fill-rule="evenodd" clip-rule="evenodd" d="M10 15.75C7.748 15.75 5.905 17.501 5.759
 19.715C5.732 20.129 5.375 20.442 4.962 20.414C4.548 20.387 4.235 20.03 4.263 19.617C4.46 16.619
 6.953 14.25 10 14.25H14C17.043 14.25 19.533 16.613 19.737 19.605C19.765 20.018 19.453 20.376
 19.039 20.404C18.626 20.432 18.268 20.12 18.24 19.707C18.09 17.497 16.249 15.75 14 15.75H10Z"
 fill="#1B3392" stroke="white" stroke-width="0.5" stroke-linecap="round"
 stroke-linejoin="round"/></svg>`;

const CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
 aria-hidden="true"><path d="M1 1l14 14M15 1L1 15" stroke="#1b3392" stroke-width="2"/></svg>`;

const NAVY = '#1b3392';
const BLUE = '#13259c';

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

// Presentational clones must not keep the editor's indices (EW4).
function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

const clone = (node) => stripInstrumentation(node.cloneNode(true));

// whitespace-only text nodes between inline chrome items render as gaps the source has not
function tidy(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const blank = [];
  while (walker.nextNode()) {
    if (!walker.currentNode.textContent.trim()) blank.push(walker.currentNode);
  }
  blank.forEach((n) => n.remove());
}

// the trigger of a list item: `<li><a>` (authored) or `<li><p><a>` (delivered, #98)
function trigger(li) {
  return li.querySelector(':scope > p, :scope > a') || null;
}

function classify(sections) {
  const roles = {};
  sections.forEach((s) => {
    if (!roles.menu && s.querySelector('ul ul')) roles.menu = s;
    else if (!roles.locale && s.querySelector('h1, h2, h3, h4, h5, h6')) roles.locale = s;
    else if (!roles.utility && s.querySelector('ul')) roles.utility = s;
    else if (!roles.brand && s.querySelector('a')) roles.brand = s;
  });
  return roles;
}

function buildTopbar(utility) {
  const topbar = el('div', 'topbar');
  const row = el('div', 'topbar-row');
  topbar.append(el('div', 'container'));
  topbar.firstElementChild.append(row);
  const left = el('div', 'topbar-left');
  const right = el('div', 'topbar-right', { 'aria-label': 'Menu' });
  row.append(left, right);
  if (!utility) return { topbar, links: [] };

  const family = utility.querySelector('p');
  const lists = [...utility.querySelectorAll('ul')];
  const brands = lists.find((ul) => ul.querySelector('img'));
  const tools = lists.find((ul) => ul !== brands);
  if (family) left.append(el('div', 'topbar-family'));
  if (family) left.lastElementChild.append(family);
  if (brands) {
    const box = el('div', 'topbar-brands');
    box.append(brands);
    left.append(box);
  }
  const links = [];
  if (tools) {
    [...tools.querySelectorAll(':scope > li')].forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#locale')) {
        li.classList.add('locale-btn');
        a.setAttribute('aria-haspopup', 'dialog');
        a.dataset.localeOpen = '';
        a.append(svg(CHEVRON(BLUE)));
      } else if (/account\./.test(href)) {
        li.classList.add('user-link');
        li.prepend(svg(USER));
      }
      links.push(li);
    });
    right.append(tools);
  }
  return { topbar, links };
}

function buildSearchbar(brand) {
  const bar = el('div', 'searchbar');
  const container = el('div', 'container');
  const row = el('div', 'searchbar-row');
  bar.append(container);
  container.append(row);

  const burger = el('button', 'burger', {
    type: 'button',
    'aria-label': 'navigation menu',
    'aria-expanded': 'false',
    'aria-controls': 'mobile-nav-menu',
  });
  burger.append(el('span'), el('span'), el('span'), el('span'));

  const logo = el('div', 'header-logo');
  const logoPara = brand ? (brand.querySelector('p') || brand.querySelector('a')) : null;
  if (logoPara) logo.append(logoPara);
  const logoCell = el('div');
  logoCell.append(logo);

  const search = el('div', 'search');
  // Search stays on tide.com: its results page is outside the migrated set (dynamics row 2).
  const form = el('form', '', { action: 'https://tide.com/en-us/search', role: 'search' });
  const wrap = el('div', 'input-wrap');
  const input = el('input', '', {
    type: 'search',
    placeholder: 'Search',
    'aria-label': 'Search',
    name: 'q',
  });
  const submit = el('button', '', { type: 'submit', 'aria-label': 'Submit Search' });
  submit.append(svg(SEARCH));
  wrap.append(input, submit);
  form.append(wrap);
  search.append(form);

  row.append(burger, logoCell, search);
  return { bar, burger };
}

function buildMainbar(menu) {
  const bar = el('div', 'mainbar');
  const container = el('div', 'container');
  const row = el('div', 'mainbar-row');
  const list = el('div', 'mainmenu', { role: 'menu' });
  bar.append(container);
  container.append(row);
  row.append(list);
  const items = [];
  const top = menu ? menu.querySelector('ul') : null;
  if (!top) return { bar, items };

  [...top.querySelectorAll(':scope > li')].forEach((li) => {
    const head = trigger(li);
    const sub = li.querySelector(':scope > ul');
    const item = el('div', 'menu-item', { role: 'menuitem' });
    const label = head ? head.textContent.trim() : '';
    if (label) item.setAttribute('aria-label', label);
    const title = el('div', 'menu-item-title');
    if (head) title.append(head);
    item.append(title);
    if (sub) {
      item.setAttribute('aria-expanded', 'false');
      item.tabIndex = 0;
      const cols = [...sub.querySelectorAll(':scope > li')].filter((c) => c.querySelector('ul'));
      const panel = el('div', cols.length ? 'submenu submenu-cols' : 'submenu', { role: 'menu' });
      if (cols.length) {
        cols.forEach((c) => {
          const col = el('div', 'submenu-col', { role: 'menu' });
          const name = el('div', 'submenu-title');
          const colHead = c.querySelector(':scope > p');
          if (colHead) name.append(colHead);
          else name.append(...[...c.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE));
          col.append(name, c.querySelector(':scope > ul'));
          panel.append(col);
        });
      } else {
        panel.append(sub);
      }
      item.append(panel);
      items.push(item);
    }
    list.append(item);
  });
  return { bar, items };
}

/* ---- mobile drawer (mounted on first open, from clones of the slotted chrome) ---- */

function drawerLabel(node) {
  const source = node.matches('a, p') ? node : (node.querySelector('a') || node.querySelector('p'));
  return [...clone(source || node).childNodes];
}

function drawerList(lis) {
  const ul = el('ul');
  lis.forEach(({
    label, href, children, link,
  }) => {
    const item = el('li', 'drawer-item');
    if (children) {
      const btn = el('button', '', { type: 'button', 'aria-expanded': 'false', 'data-sub': '' });
      btn.append(...label, svg(CHEVRON(NAVY)));
      item.append(btn);
      const sub = el('li', 'drawer-sub');
      const box = el('div');
      const back = el('button', 'drawer-back', { type: 'button', 'data-back': '' });
      back.append(svg(CHEVRON(NAVY)), ...label.map((n) => n.cloneNode(true)));
      box.append(back, drawerList(children));
      sub.append(box);
      ul.append(item, sub);
      return;
    }
    const a = link ? clone(link) : el('a', '', { href });
    if (!link) a.append(...label);
    if (!link) a.append(svg(CHEVRON(NAVY)));
    item.append(a);
    ul.append(item);
  });
  return ul;
}

function menuModel(mainmenu) {
  return [...mainmenu.querySelectorAll(':scope > .menu-item')].map((item) => {
    const head = item.querySelector('.menu-item-title a');
    const label = head ? drawerLabel(head) : [];
    const href = head ? head.getAttribute('href') : '#';
    const panel = item.querySelector('.submenu');
    if (!panel) return { label, href };
    const cols = [...panel.querySelectorAll('.submenu-col')];
    const leaves = (ul) => [...ul.querySelectorAll(':scope > li')]
      .map((li) => li.querySelector('a'))
      .filter(Boolean)
      .map((a) => ({ link: a }));
    if (cols.length) {
      return {
        label,
        href,
        children: cols.map((col) => ({
          label: drawerLabel(col.querySelector('.submenu-title')),
          children: leaves(col.querySelector('ul')),
        })),
      };
    }
    return { label, href, children: leaves(panel.querySelector('ul')) };
  });
}

function buildDrawer(site, parts) {
  const drawer = el('nav', 'drawer', {
    id: 'mobile-nav-menu',
    'aria-label': 'Mobile navigation',
    tabindex: '-1',
  });
  drawer.append(drawerList(menuModel(site.querySelector('.mainmenu'))));
  const contact = parts.links.find((li) => !li.classList.contains('locale-btn')
    && !li.classList.contains('user-link'));
  if (contact && contact.querySelector('a')) drawer.append(clone(contact.querySelector('a')));
  if (parts.selectLocation) {
    const wrap = el('div', 'drawer-loc');
    wrap.append(parts.selectLocation);
    drawer.append(wrap);
  }
  const user = parts.links.find((li) => li.classList.contains('user-link'));
  if (user) {
    const span = el('span', 'user-link');
    span.append(svg(USER), clone(user.querySelector('a')));
    drawer.append(span);
  }
  const loc = el('div', 'loc-panel');
  const inner = el('div', 'loc-panel-inner');
  const back = el('div', 'loc-panel-back', { role: 'button', tabindex: '0', 'data-loc-close': '' });
  if (parts.localeHeading) {
    const h = clone(parts.localeHeading);
    h.removeAttribute('id');
    h.prepend(svg(CHEVRON(NAVY)));
    back.append(h);
  }
  inner.append(back);
  if (parts.localeList) inner.append(clone(parts.localeList));
  loc.append(inner);
  drawer.append(loc);
  return drawer;
}

function buildLocaleModal(locale) {
  const overlay = el('div', 'locale-overlay', { id: 'locale-modal' });
  const dialog = el('div', 'locale-modal', {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Please select a location',
    tabindex: '-1',
  });
  const close = el('button', 'modal-close', { type: 'button', 'aria-label': 'Close' });
  close.append(svg(CLOSE));
  const body = el('div', 'locale-modal-body');
  const parts = { localeHeading: null, localeList: null, selectLocation: null };
  if (locale) {
    const heading = locale.querySelector('h1, h2, h3, h4, h5, h6');
    const list = locale.querySelector('ul');
    const select = [...locale.querySelectorAll('p')].find((p) => p.querySelector('a[href^="#"]'));
    if (heading) body.append(heading);
    if (list) body.append(list);
    parts.localeHeading = heading;
    parts.localeList = list;
    parts.selectLocation = select || null;
  }
  dialog.append(close, body);
  overlay.append(dialog);
  return {
    overlay, dialog, close, ...parts,
  };
}

function wireMegaMenu(items) {
  const setItem = (item, on) => {
    item.classList.toggle('active', on);
    item.setAttribute('aria-expanded', String(on));
  };
  items.forEach((item) => {
    const title = item.querySelector('.menu-item-title a');
    item.addEventListener('mouseenter', () => setItem(item, true));
    item.addEventListener('mouseleave', () => setItem(item, false));
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) setItem(item, false);
    });
    if (title) {
      title.addEventListener('click', (e) => {
        e.preventDefault(); // live: a title with a submenu opens it, no navigation
        items.forEach((o) => {
          if (o !== item) setItem(o, false);
        });
        setItem(item, true);
      });
    }
    item.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.target !== item) return;
      e.preventDefault();
      setItem(item, !item.classList.contains('active'));
    });
  });
  return setItem;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  tidy(fragment);

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const roles = classify(sections.length ? sections : [fragment]);
  const root = document.documentElement;

  const site = el('div', 'site-header', { id: 'site-header' });
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'site-content';
  const skip = el('a', 'skip-to-content-link', { href: '#site-content' });
  skip.textContent = 'Skip to Content';

  const top = buildTopbar(roles.utility);
  const search = buildSearchbar(roles.brand);
  const menu = buildMainbar(roles.menu);
  site.append(skip, top.topbar, search.bar, menu.bar);

  const modal = buildLocaleModal(roles.locale);
  block.replaceChildren(site, modal.overlay);

  // ---- desktop mega-menus: hover / focus / first click / Enter ----
  const setItem = wireMegaMenu(menu.items);

  // ---- locale modal (desktop) ----
  // closed overlay is display:none (live mounts the modal only when open); fade both ways
  modal.overlay.hidden = true;
  // a closed dialog is never exposed as one
  modal.dialog.hidden = true;
  modal.dialog.removeAttribute('aria-modal');
  const setModal = (on) => {
    clearTimeout(modal.overlay.unmount);
    if (on) {
      modal.overlay.hidden = false;
      modal.dialog.hidden = false;
      modal.dialog.setAttribute('aria-modal', 'true');
      modal.overlay.getBoundingClientRect(); // commit the closed state so the fade runs
      modal.overlay.classList.add('is-open');
      modal.dialog.focus();
      return;
    }
    modal.overlay.classList.remove('is-open');
    modal.overlay.unmount = setTimeout(() => {
      modal.overlay.hidden = true;
      modal.dialog.hidden = true;
      modal.dialog.removeAttribute('aria-modal');
    }, 500);
  };
  modal.close.addEventListener('click', () => setModal(false));
  modal.overlay.addEventListener('click', (e) => {
    if (e.target === modal.overlay) setModal(false);
  });

  // ---- mobile drawer: mounted on first open, unmounted 300 ms after close ----
  let drawer = null;
  const setSub = (btn, on) => {
    const sub = btn.closest('li').nextElementSibling;
    sub.classList.toggle('is-open', on);
    btn.setAttribute('aria-expanded', String(on));
    const parent = sub.parentElement.closest('.drawer-sub');
    if (parent) parent.classList.toggle('parent-open', on);
    if (!on) {
      sub.querySelectorAll('.drawer-sub.is-open').forEach((s) => {
        s.classList.remove('is-open');
        s.previousElementSibling.querySelector('[data-sub]').setAttribute('aria-expanded', 'false');
      });
      sub.classList.remove('parent-open');
    }
    drawer.classList.toggle('sub-open', !!drawer.querySelector('.drawer-sub.is-open'));
  };
  const setLoc = (on) => {
    const loc = drawer.querySelector('.loc-panel');
    loc.classList.toggle('is-open', on);
    if (on) loc.querySelector('[data-loc-close]').focus();
  };
  const mountDrawer = () => {
    if (drawer) return;
    drawer = buildDrawer(site, { links: top.links, ...modal });
    site.append(drawer);
    drawer.getBoundingClientRect(); // commit the closed state so the fade runs
    drawer.addEventListener('click', (e) => {
      const t = e.target.closest('[data-sub], [data-back], [data-loc-close], a[href^="#locale"]');
      if (!t) return;
      if (t.hasAttribute('data-sub')) {
        setSub(t, t.getAttribute('aria-expanded') !== 'true');
      } else if (t.hasAttribute('data-back')) {
        const owner = t.closest('.drawer-sub').previousElementSibling;
        setSub(owner.querySelector('[data-sub]'), false);
      } else {
        e.preventDefault();
        setLoc(!t.hasAttribute('data-loc-close'));
      }
    });
    drawer.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-loc-close]')) {
        e.preventDefault();
        setLoc(false);
      }
    });
  };
  const setDrawer = (on) => {
    if (on) mountDrawer();
    root.classList.toggle('drawer-open', on);
    search.burger.classList.toggle('open', on);
    search.burger.setAttribute('aria-expanded', String(on));
    if (!drawer) return;
    if (on) {
      clearTimeout(drawer.unmount);
      drawer.focus();
      return;
    }
    const d = drawer;
    d.unmount = setTimeout(() => {
      if (root.classList.contains('drawer-open')) return;
      d.remove(); // the moved "Select Location" paragraph stays referenced for the next mount
      if (drawer === d) drawer = null;
    }, 300);
  };
  search.burger.addEventListener('click', () => setDrawer(!root.classList.contains('drawer-open')));
  DESKTOP.addEventListener('change', () => {
    if (DESKTOP.matches && root.classList.contains('drawer-open')) setDrawer(false);
  });

  site.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-locale-open]');
    if (!opener) return;
    e.preventDefault();
    setModal(true);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal.overlay.classList.contains('is-open')) {
      setModal(false);
      return;
    }
    if (drawer && root.classList.contains('drawer-open')) {
      const loc = drawer.querySelector('.loc-panel.is-open');
      const open = [...drawer.querySelectorAll('.drawer-sub.is-open')];
      if (loc) setLoc(false);
      else if (open.length) {
        const last = open[open.length - 1];
        setSub(last.previousElementSibling.querySelector('[data-sub]'), false);
      } else setDrawer(false);
      return;
    }
    menu.items.forEach((i) => setItem(i, false));
  });
}
