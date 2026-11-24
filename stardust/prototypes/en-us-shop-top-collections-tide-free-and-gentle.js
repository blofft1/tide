/* tide.com replica — collection-landing behaviour: jump navigation (click to section, active item, frozen to the
   viewport top once its anchor scrolls past). Mirrors the live .anchor-navigation behaviour (same module as the
   article archetype). */
(() => {
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
