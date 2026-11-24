/* tide.com replica — click2cart archetype behaviour.
   1. Live widget sizes its scroller to the viewport minus the widget footer (inline max-height, on load
      and resize) — mirrored here.
   2. Footer accordions: canon.js returns early on a page without #site-header (this template has none),
      so the canon footer-accordion mechanism is initialised here (canon candidate: move it out of the
      header guard). */
(() => {
  const scroller = document.getElementById('scrolling-container');
  const foot = document.getElementById('sc-footer-content');
  if (scroller && foot) {
    const size = () => { scroller.style.maxHeight = `${window.innerHeight - foot.offsetHeight}px`; };
    size();
    window.addEventListener('resize', size);
  }

  if (document.getElementById('site-header')) return; // canon.js owns the accordions then
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
