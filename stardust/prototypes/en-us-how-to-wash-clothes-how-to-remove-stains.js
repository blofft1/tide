/* tide.com replica — topic-hub archetype behaviour: stain picker (arrows / item click / keyboard, Learn More),
   stain search, mobile category accordion, jump navigation (click to section, active item, frozen to the
   viewport top once its anchor scrolls past), back to top. Mirrors the live .spinner / .article-listing /
   .anchor-navigation / .scroll-to-top-wrapper behaviour. */
(() => {
  // ---- stain index: links by lower-cased label (used by the picker and the search) ----
  const links = [...document.querySelectorAll('.alp-cat__links a')];
  const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
  const hrefFor = (label) => {
    const n = norm(label);
    const hit = links.find((a) => norm(a.textContent) === n) || links.find((a) => norm(a.textContent).startsWith(n) || n.startsWith(norm(a.textContent)));
    return hit ? hit.getAttribute('href') : null;
  };

  // ---- stain picker (two copies: mobile + desktop, kept in sync): a wheel viewport scrolled so the
  //      selected item sits behind the indicator (live: translate3d content of an infinite picker) ----
  const pickers = [...document.querySelectorAll('[data-picker]')];
  const count = pickers[0] ? pickers[0].querySelectorAll('.alp-picker__item').length : 0;
  const cycle = count / 3;
  let sel = pickers[0] ? Number(pickers[0].dataset.selected) : 0;
  const status = document.querySelectorAll('[data-picker-status]');
  const place = (smooth) => {
    pickers.forEach((p) => {
      const sc = p.querySelector('.alp-picker__scroll');
      const center = (sc.clientHeight - 50) / 2;
      if (sc.clientHeight) sc.scrollTo({ top: sel * 50 - center, behavior: smooth ? 'smooth' : 'instant' });
      p.querySelectorAll('.alp-picker__item').forEach((b, i) => {
        const on = i === sel;
        b.classList.toggle('is-selected', on);
        b.tabIndex = on ? 0 : -1;
      });
    });
    const name = pickers[0].querySelectorAll('.alp-picker__item')[sel].getAttribute('aria-label');
    status.forEach((l) => { l.textContent = `Selected: ${name}`; });
  };
  const select = (i) => {
    sel = i;
    if (sel < cycle) sel += cycle; // stay in the middle cycle, as the live infinite picker does
    if (sel >= 2 * cycle) sel -= cycle;
    place(true);
  };
  pickers.forEach((p) => {
    p.querySelectorAll('.alp-picker__item').forEach((b, i) => b.addEventListener('click', () => select(i)));
    p.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); select(sel - 1); }
      if (e.key === 'ArrowDown') { e.preventDefault(); select(sel + 1); }
    });
  });
  if (pickers[0]) {
    place(false);
    window.matchMedia('(min-width: 992px)').addEventListener('change', () => place(false));
  }
  const up = document.querySelector('.alp-spinner__arrow--up');
  const down = document.querySelector('.alp-spinner__arrow--down');
  if (up) up.addEventListener('click', () => select(sel - 1));
  if (down) down.addEventListener('click', () => select(sel + 1));
  const go = document.querySelector('.alp-spinner__go');
  if (go && pickers[0]) {
    go.addEventListener('click', () => {
      const label = pickers[0].querySelectorAll('.alp-picker__item')[sel].textContent;
      const href = hrefFor(label);
      if (href) window.location.href = href;
    });
  }

  // ---- stain search ----
  const input = document.getElementById('article-listing-search-input');
  const results = document.querySelector('.alp-search__results');
  if (input && results) {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      results.textContent = '';
      if (!q) { results.hidden = true; return; }
      links.filter((a) => a.textContent.toLowerCase().includes(q)).forEach((a) => {
        const r = document.createElement('a');
        r.href = a.getAttribute('href');
        r.textContent = a.textContent;
        results.append(r);
      });
      results.hidden = !results.children.length;
    });
  }

  // ---- category accordion (mobile only; desktop shows every list) ----
  const desktop = window.matchMedia('(min-width: 992px)');
  document.querySelectorAll('.alp-cat').forEach((cat) => {
    const head = cat.querySelector('.alp-cat__header');
    const toggle = () => {
      if (desktop.matches) return;
      const on = !cat.classList.contains('is-open');
      cat.classList.toggle('is-open', on);
      head.setAttribute('aria-expanded', String(on));
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // ---- back to top ----
  const top = document.querySelector('.alp-totop__btn');
  if (top) top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- jump navigation ----
  const bar = document.getElementById('sticky-nav');
  const anchor = document.getElementById('sticky-nav-anchor');
  if (!bar || !anchor) return;
  const spans = [...bar.querySelectorAll('span[data-target]')];
  const targets = spans.map((s) => document.getElementById(s.dataset.target));
  const jump = (i) => {
    const t = targets[i];
    if (!t) return;
    const y = t.getBoundingClientRect().top + window.scrollY - bar.offsetHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  spans.forEach((s, i) => {
    s.addEventListener('click', () => jump(i));
    s.addEventListener('keydown', (e) => { if (e.key === 'Enter') jump(i); });
  });
  const onScroll = () => {
    const frozen = anchor.getBoundingClientRect().top < 0;
    if (frozen !== bar.classList.contains('is-frozen')) {
      anchor.style.height = frozen ? `${bar.offsetHeight}px` : '';
      bar.classList.toggle('is-frozen', frozen);
    }
    let active = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top - bar.offsetHeight <= 1) active = i; });
    spans.forEach((s, i) => s.classList.toggle('active', i === active));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
