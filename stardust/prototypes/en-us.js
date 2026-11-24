/* home archetype widgets: card rail (react-multi-carousel on live) + stain picker. */
(() => {
  // ---- card rail: arrows step one card, dots = positions ----
  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const track = rail.querySelector('.rail__track');
    const items = [...track.children];
    const dots = rail.querySelector('.rail__dots');
    let pos = 0;
    const perView = () => Math.max(1, Math.round(track.parentElement.clientWidth / items[0].getBoundingClientRect().width));
    const count = () => Math.max(1, items.length - perView() + 1);
    const render = () => {
      const n = count();
      if (pos > n - 1) pos = n - 1;
      track.style.transform = pos ? `translate3d(${-pos * items[0].getBoundingClientRect().width}px,0,0)` : '';
      if (dots.children.length !== n) {
        dots.innerHTML = '';
        for (let i = 0; i < n; i += 1) {
          const li = document.createElement('li');
          const b = document.createElement('button');
          b.type = 'button';
          b.addEventListener('click', () => { pos = i; render(); });
          li.append(b);
          dots.append(li);
        }
      }
      [...dots.children].forEach((li, i) => {
        li.classList.toggle('is-active', i === pos);
        li.firstChild.setAttribute('aria-label', `Go to slide ${i + 1} ${i === pos ? 'active' : ''}`);
      });
    };
    rail.querySelector('.rail__arrow--prev').addEventListener('click', () => { pos = pos > 0 ? pos - 1 : count() - 1; render(); });
    rail.querySelector('.rail__arrow--next').addEventListener('click', () => { pos = pos < count() - 1 ? pos + 1 : 0; render(); });
    window.addEventListener('resize', render);
    render();
  });

  // ---- stain picker: wheel viewport, arrows step one item, click selects ----
  const SEL0 = 108;
  const pickers = [...document.querySelectorAll('.picker')];
  let sel = SEL0;
  const live = document.querySelectorAll('.stains [aria-live]');
  const place = (smooth) => {
    pickers.forEach((p) => {
      const sc = p.querySelector('.picker__scroll');
      const center = p.classList.contains('picker--desktop') ? 200 : 50;
      if (sc.clientHeight) sc.scrollTo({ top: sel * 50 - center, behavior: smooth ? 'smooth' : 'instant' });
      p.querySelectorAll('.picker__item').forEach((b, i) => b.classList.toggle('is-selected', i === sel));
    });
    const name = pickers[0].querySelectorAll('.picker__item')[sel].textContent;
    live.forEach((l) => { l.textContent = `Selected: ${name} `; });
  };
  const step = (d) => { const n = pickers[0].querySelectorAll('.picker__item').length; sel = (sel + d + n) % n; place(true); };
  pickers.forEach((p) => p.querySelectorAll('.picker__item').forEach((b, i) => b.addEventListener('click', () => { sel = i; place(true); })));
  const up = document.querySelector('.stains__arrow--up');
  const down = document.querySelector('.stains__arrow--down');
  if (up) up.addEventListener('click', () => step(-1));
  if (down) down.addEventListener('click', () => step(1));
  place(false);
  window.matchMedia('(min-width: 992px)').addEventListener('change', () => place(false));
  const go = document.querySelector('[data-stain-go]');
  if (go) go.addEventListener('click', () => { window.location.href = '/en-us/how-to-wash-clothes/how-to-remove-stains'; });
})();
