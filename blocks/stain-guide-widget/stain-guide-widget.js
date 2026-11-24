/**
 * stain-guide-widget — "Stain removal guide": "I have a [stain wheel] stain" + Learn More.
 * Live: m-style-picker spinner (mobile 150px wheel, desktop 450px wheel with arrows).
 * Schema: stardust/eds-schema/en-us.json (section stains). Decode tier: template-slotted
 * (fixed composition), the stain list is the authored repeat group.
 *
 * Authoring (one element per row or all in one cell, in this order):
 *   - optional image (decorative T-shirt art, shown >= 1200px)
 *   - heading (<h2>)
 *   - prefix <p> ("I have a")
 *   - the stain list (<ul>): plain items, or items that are links to the stain's page
 *   - suffix <p> ("stain")
 *   - CTA <p> (italic link = orange button; link title = accessible name): its href is the
 *     fallback target; when the selected stain is a link, the CTA follows that link instead.
 *     Like live, the decorated CTA is a role="link" control (the anchor is unwrapped, EW6)
 *     that navigates on click / Enter.
 *   - optional help link <p> ("Can't find the right stain?")
 * The wheel starts on the middle item of the list (live: mayonnaise, 37th of 72).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

// Authored link title = the source's accessible name (aria-label); the foundation's
// decorateButtons echoes the label into title, which live never carries.
function labelLinks(root) {
  root.querySelectorAll('a[title]').forEach((a) => {
    const t = a.getAttribute('title').trim();
    if (t && t !== a.textContent.trim()) a.setAttribute('aria-label', t);
    a.removeAttribute('title');
  });
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) {
      out.push(...kids);
    } else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): a bare-text cell; DA content always carries a <p>.
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function make(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

// One wheel: masks, indicator, a scroll viewport holding three copies of the list (the wheel's
// loop illusion), an sr-only status line. `lists` = the three <ul>s, middle one first.
function buildWheel(lists, className) {
  const wrap = make('div', className);
  const picker = make('div', 'sg-picker');
  picker.append(make('div', 'sg-mask sg-mask-top'), make('div', 'sg-mask sg-mask-bottom'));
  picker.append(make('div', 'sg-indicator'));
  const scroll = make('div', 'sg-scroll');
  const box = make('div', 'sg-lists');
  box.append(lists[1], lists[0], lists[2]);
  scroll.append(box);
  picker.append(scroll);
  const live = make('div', 'visually-hidden');
  live.setAttribute('aria-live', 'polite');
  wrap.append(picker, live);
  const items = [...box.querySelectorAll(':scope > ul > li, :scope > ol > li')];
  return {
    wrap, scroll, live, items,
  };
}

// Live renders two wheels (a 150px one below 992px, a 450px one with arrows above); the
// authored list is the middle copy of the desktop wheel, every other copy is a clone (EW4).
function buildPickers(list, cta) {
  const n = list.children.length;
  const clone = () => stripInstrumentation(list.cloneNode(true));
  const desktopWheel = buildWheel([list, clone(), clone()], 'sg-picker-wrap');
  const mobileWheel = buildWheel([clone(), clone(), clone()], 'sg-mobile');
  const wheels = [mobileWheel, desktopWheel];
  const up = make('button', 'sg-arrow sg-arrow-up');
  up.type = 'button';
  up.setAttribute('aria-label', 'Previous item');
  const down = make('button', 'sg-arrow sg-arrow-down');
  down.type = 'button';
  down.setAttribute('aria-label', 'Next item');
  desktopWheel.wrap.append(up, down);
  if (!n) return [mobileWheel.wrap, desktopWheel.wrap];

  wheels.forEach((w) => {
    w.scroll.querySelectorAll('ul, ol').forEach((ul) => ul.setAttribute('role', 'listbox'));
    w.items.forEach((li) => {
      li.setAttribute('role', 'option');
      li.setAttribute('aria-label', li.textContent.trim());
    });
  });

  const fallback = cta ? cta.getAttribute('href') : null;
  let target = fallback;
  if (cta) {
    // live: a role="link" button that navigates to the selected stain's guide. The authored
    // paragraph becomes the control; its anchor is unwrapped after reading href (EW6).
    const control = cta.closest('p') || cta;
    const name = (cta.getAttribute('title') || '').trim();
    if (name && name !== cta.textContent.trim()) control.setAttribute('aria-label', name);
    cta.removeAttribute('title');
    if (control !== cta) cta.replaceWith(...cta.childNodes);
    control.classList.add('sg-cta-control');
    control.setAttribute('role', 'link');
    control.tabIndex = 0;
    control.addEventListener('click', () => {
      if (target) window.location.href = target;
    });
    control.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && target) window.location.href = target;
    });
  }
  const total = n * 3;
  let sel = n + Math.floor(n / 2);
  const desktop = window.matchMedia('(width >= 992px)');
  const mark = () => {
    wheels.forEach((w) => {
      w.items.forEach((li, i) => {
        li.classList.toggle('is-selected', i === sel);
        li.setAttribute('aria-selected', String(i === sel));
      });
      w.live.textContent = `Selected: ${w.items[sel].textContent} `;
    });
    const a = desktopWheel.items[sel].querySelector('a[href]');
    target = a ? a.getAttribute('href') : fallback;
  };
  const place = (smooth) => {
    wheels.forEach((w) => {
      if (!w.scroll.clientHeight) return;
      const center = w === desktopWheel ? 200 : 50;
      w.scroll.scrollTo({ top: sel * 50 - center, behavior: smooth ? 'smooth' : 'instant' });
    });
    mark();
  };
  const step = (d) => {
    sel = (sel + d + total) % total;
    place(true);
  };
  wheels.forEach((w) => {
    w.items.forEach((li, i) => {
      li.addEventListener('click', (e) => {
        e.preventDefault();
        sel = i;
        place(true);
      });
    });
  });
  mark();
  up.addEventListener('click', () => step(-1));
  down.addEventListener('click', () => step(1));
  desktop.addEventListener('change', () => place(false));
  // first placement once a wheel has a height (block CSS loads with the block)
  requestAnimationFrame(() => place(false));
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => place(false));
    wheels.forEach((w) => ro.observe(w.scroll));
  }
  return [mobileWheel.wrap, desktopWheel.wrap];
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;

  let pic = null;
  let heading = null;
  let list = null;
  let ctaP = null;
  const before = [];
  const after = [];
  const links = [];
  nodes.forEach((node) => {
    const m = media(node);
    if (m && !node.textContent.trim()) {
      pic = m.closest('picture') || m;
    } else if (!heading && isHeading(node)) {
      heading = node;
    } else if (!list && node.matches('ul, ol')) {
      list = node;
    } else if (node.tagName === 'P' && node.querySelector('a')
      && node.textContent.trim() === node.querySelector('a').textContent.trim()) {
      if (!ctaP && node.querySelector('a.button, strong a, em a')) ctaP = node;
      else links.push(node);
    } else if (list) {
      after.push(node);
    } else {
      before.push(node);
    }
  });
  if (!ctaP && links.length > 1) ctaP = links.shift();

  const container = make('div', 'container');
  if (heading) container.append(wrapNode(heading, 'sg-heading'));
  const row = make('div', 'sg-row');
  const left = make('div', 'sg-left');
  left.append(...before);
  row.append(left);
  if (list) row.append(...buildPickers(list, ctaP ? ctaP.querySelector('a') : null));
  const right = make('div', 'sg-right');
  right.append(...after);
  const actions = make('div', 'sg-actions');
  if (ctaP) actions.append(wrapNode(ctaP, 'sg-cta'));
  links.forEach((p) => actions.append(wrapNode(p, 'sg-help')));
  if (actions.children.length) right.append(actions);
  row.append(right);
  container.append(row);

  block.replaceChildren(...(pic ? [wrapNode(pic, 'sg-image')] : []), container);
  labelLinks(block);
}
