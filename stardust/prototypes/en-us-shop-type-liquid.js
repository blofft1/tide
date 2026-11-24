/* tide.com replica — product-listing page behaviour.
   Filter-by-Need bar: live renders it expanded at >=992px and collapsed below; the arrow toggles it. */
(() => {
  const bar = document.querySelector('.plp-filter-bar');
  if (!bar) return;
  const toggle = bar.querySelector('.plp-filter-bar__toggle');
  const set = (on) => {
    bar.classList.toggle('is-expanded', on);
    toggle.setAttribute('aria-expanded', String(on));
  };
  set(window.matchMedia('(min-width: 992px)').matches);
  toggle.addEventListener('click', () => set(!bar.classList.contains('is-expanded')));
  toggle.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    set(!bar.classList.contains('is-expanded'));
  });
})();

/* Related articles: live mounts this list only below 992px (absent from the desktop DOM). */
(() => {
  const tpl = document.getElementById('plp-related-tpl');
  if (!tpl) return;
  const mq = window.matchMedia('(max-width: 991px)');
  let node = null;
  const sync = () => {
    if (mq.matches && !node) {
      node = tpl.content.firstElementChild.cloneNode(true);
      tpl.after(node);
    } else if (!mq.matches && node) {
      node.remove();
      node = null;
    }
  };
  sync();
  mq.addEventListener('change', sync);
})();
