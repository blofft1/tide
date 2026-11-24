/* tide.com replica — shared chrome behaviour (header mega-menus, mobile drawer, locale selection,
   footer accordions). Mechanisms mirror the live header contract (stardust/chrome/header-contract.json). */
(() => {
  const header = document.getElementById('site-header');
  if (!header) return;
  const root = document.documentElement;

  // ---- desktop mega-menus: hover / focus / first click / Enter open the item's submenu ----
  const items = [...header.querySelectorAll('.mainmenu > .menu-item')].filter((i) => i.querySelector('.submenu'));
  const setItem = (item, on) => {
    item.classList.toggle('active', on);
    item.setAttribute('aria-expanded', String(on));
  };
  items.forEach((item) => {
    const title = item.querySelector('.menu-item-title');
    item.addEventListener('mouseenter', () => setItem(item, true));
    item.addEventListener('mouseleave', () => setItem(item, false));
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) setItem(item, false); });
    title.addEventListener('click', (e) => {
      e.preventDefault(); // live: a click on a title with a submenu opens it, no navigation
      items.forEach((o) => { if (o !== item) setItem(o, false); });
      setItem(item, true);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.target !== item) return;
      e.preventDefault();
      setItem(item, !item.classList.contains('active'));
    });
  });

  // ---- locale modal (desktop) ----
  const modal = document.getElementById('locale-modal');
  const dialog = modal.querySelector('.locale-modal');
  const setModal = (on) => {
    modal.classList.toggle('is-open', on);
    if (on) dialog.focus();
  };
  modal.querySelector('.modal-close').addEventListener('click', () => setModal(false));
  modal.addEventListener('click', (e) => { if (e.target === modal) setModal(false); });

  // ---- mobile drawer: mounted on first open (live mounts #mobile-nav-menu on open) ----
  const burger = header.querySelector('.burger');
  let drawer = null;
  const subs = () => [...drawer.querySelectorAll('.drawer__sub.is-open')];
  const setSub = (trigger, on) => {
    const sub = trigger.closest('li').nextElementSibling;
    sub.classList.toggle('is-open', on);
    trigger.setAttribute('aria-expanded', String(on));
    const parent = sub.parentElement.closest('.drawer__sub');
    if (parent) parent.classList.toggle('parent-open', on);
    if (!on) sub.querySelectorAll('.drawer__sub.is-open').forEach((s) => {
      s.classList.remove('is-open');
      s.previousElementSibling.querySelector('[data-sub]').setAttribute('aria-expanded', 'false');
    });
    if (!on) sub.classList.remove('parent-open');
    drawer.classList.toggle('sub-open', !!drawer.querySelector('.drawer__sub.is-open'));
  };
  const mountDrawer = () => {
    if (drawer) return;
    header.append(document.getElementById('drawer-tpl').content.cloneNode(true));
    drawer = document.getElementById('mobile-nav-menu');
    drawer.getBoundingClientRect(); // commit the closed state so the opacity transition runs
    drawer.addEventListener('click', (e) => {
      const t = e.target.closest('[data-sub],[data-back],[data-loc-open],[data-loc-close]');
      if (!t) return;
      if (t.hasAttribute('data-sub')) setSub(t, t.getAttribute('aria-expanded') !== 'true');
      else if (t.hasAttribute('data-back')) setSub(t.closest('.drawer__sub').previousElementSibling.querySelector('[data-sub]'), false);
      else {
        const loc = drawer.querySelector('.loc-panel');
        loc.classList.toggle('is-open', t.hasAttribute('data-loc-open'));
        if (loc.classList.contains('is-open')) loc.querySelector('button').focus();
      }
    });
  };
  const setDrawer = (on) => {
    if (on) mountDrawer();
    root.classList.toggle('drawer-open', on);
    burger.classList.toggle('open', on);
    burger.setAttribute('aria-expanded', String(on));
    if (!drawer) return;
    if (on) { clearTimeout(drawer.unmount); drawer.focus(); return; }
    // closed: fade out (300 ms), then unmount like live so the header is back to its 61 px bar
    const d = drawer;
    d.unmount = setTimeout(() => { if (!root.classList.contains('drawer-open')) { d.remove(); if (drawer === d) drawer = null; } }, 300);
  };
  burger.addEventListener('click', () => setDrawer(!root.classList.contains('drawer-open')));

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-locale-open]')) setModal(true);
    if (e.target.closest('[data-signin]')) window.location.href = 'https://account.tide.com/'; // sign-in stays on account.tide.com
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-open')) { setModal(false); return; }
    if (drawer && root.classList.contains('drawer-open')) {
      const loc = drawer.querySelector('.loc-panel.is-open');
      const open = subs();
      if (loc) loc.classList.remove('is-open');
      else if (open.length) setSub(open[open.length - 1].previousElementSibling.querySelector('[data-sub]'), false);
      else setDrawer(false);
      return;
    }
    items.forEach((i) => setItem(i, false));
  });

  // ---- footer accordions (below 768 only; open columns above) ----
  document.querySelectorAll('.expandable__header').forEach((h) => {
    const toggle = () => {
      if (window.matchMedia('(min-width: 768px)').matches) return;
      const box = h.parentElement;
      box.classList.toggle('is-open');
      h.setAttribute('aria-expanded', String(box.classList.contains('is-open')));
    };
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
})();
