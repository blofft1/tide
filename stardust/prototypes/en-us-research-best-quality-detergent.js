/* tide.com replica — article archetype behaviour: FAQ accordion, jump navigation (click to section,
   active item, frozen to the viewport top once its anchor scrolls past). Mirrors the live
   .expandable-content / .anchor-navigation behaviour. */
(() => {
  // ---- FAQ accordion ----
  document.querySelectorAll('.faq').forEach((item) => {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    const toggle = () => {
      const on = !item.classList.contains('is-open');
      item.classList.toggle('is-open', on);
      q.setAttribute('aria-expanded', String(on));
      a.setAttribute('aria-hidden', String(!on));
    };
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // ---- jump navigation ----
  const bar = document.getElementById('sticky-nav');
  const anchor = document.getElementById('sticky-nav-anchor');
  if (!bar || !anchor) return;
  const spans = [...bar.querySelectorAll('span[data-target]')];
  const targets = spans.map((s) => document.getElementById(s.dataset.target));
  const go = (i) => {
    const t = targets[i];
    if (!t) return;
    const y = t.getBoundingClientRect().top + window.scrollY - bar.offsetHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  spans.forEach((s, i) => {
    s.addEventListener('click', () => go(i));
    s.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(i); });
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
