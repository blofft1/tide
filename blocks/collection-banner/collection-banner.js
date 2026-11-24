/**
 * collection-banner — the photo banners of a collection landing page (live
 * .collection-banner-with-bg rows, .fresh-gentle-banner, the "Works in all" band).
 * Schema: stardust/eds-schema/en-us-shop-top-collections-tide-free-and-gentle.json
 * (sections fresh, sensitive, nea, sleep, works, together). Decode tier: template-slotted
 * (fixed composition per variant: media + one text box [+ logo row + note]).
 *
 * Authoring (one row per item):
 *   - image rows, WIDEST art first: | image | from 992px |, …, the narrowest art last with
 *     no second cell (it serves every smaller width). One image row = one art for all widths.
 *   - text row: the copy as authored (headings, paragraphs, lists, CTA link paragraphs).
 *     A single image inside the text (a logo) stays in the copy. Two or more images in a
 *     row inside the text become the LOGO ROW; paragraphs after it become the NOTE.
 *
 * @variants block class (one layout each):
 *   intro    — copy centred at the top (< 992) / left-middle (>= 992), white, lowercase,
 *              white pill CTA; the image is a min-height background (Fresh & Gentle)
 *   centered — white heading in a centred box over the photo (sensitive skin)
 *   right    — sky copy + logo row + navy note in the right half (NEA / NPF)
 *   split    — orange panel with white heading beside the photo (No perfumes)
 *   closing  — navy copy in the right 58 % over the photo (Better together)
 *   works    — orange band: check-list copy left, image right (Works in all);
 *              + narrow (wide band, 3/6 columns), image-left (image left, copy over it < 992),
 *                pb-5 (48px below), no-border (no rule above the list), display-h2 (light h2)
 *   right    + top-30 / display-h2-small: a light navy h2 instead of the NEA copy
 *   overlay  — navy heading over the photo, left, vertically centred >= 992 (fifth banner)
 *   blue-split — navy band: image left, white copy right (>= 992); copy above image (< 992)
 *   pods     — white band: first row = heading copy; then one row per item | icon | copy |
 *   scents   — carousel (live hero-theme-for-collection): image rows + a text row = one slide;
 *              arrows + dots (react-multi-carousel parity); + display-h2, blue, p-ultra, p-upper
 *
 * @ew-exempt the "from 992px" cells are art-direction settings, not page copy: they stay in
 *   the DOM (hidden) so the author can edit them.
 */

const TEMPLATES = {
  intro: '<div class="container collection-banner-wrap"><div class="collection-banner-text"></div>'
    + '</div><div class="collection-banner-media"></div>',
  centered: '<div class="collection-banner-media"></div><div class="collection-banner-text"></div>',
  right: '<div class="collection-banner-media"></div><div class="collection-banner-content">'
    + '<div class="container"><div class="collection-banner-col"><div class="collection-banner-main">'
    + '<div class="collection-banner-text"></div><div class="collection-banner-logos"></div></div>'
    + '<div class="collection-banner-note"></div></div></div></div>',
  split: '<div class="collection-banner-col"><div class="collection-banner-row">'
    + '<div class="collection-banner-flex"><div class="collection-banner-media"></div>'
    + '<div class="collection-banner-content"><div class="collection-banner-inner">'
    + '<div class="collection-banner-text"></div></div></div></div></div></div>',
  closing: '<div class="collection-banner-media"></div><div class="collection-banner-content">'
    + '<div class="container"><div class="collection-banner-col">'
    + '<div class="collection-banner-text"></div></div></div></div>',
  overlay: '<div class="collection-banner-media"></div><div class="collection-banner-content container">'
    + '<div class="collection-banner-text"></div></div>',
  'blue-split': '<div class="collection-banner-row"><div class="collection-banner-left">'
    + '<div class="collection-banner-text"></div></div><div class="collection-banner-right">'
    + '<div class="collection-banner-media"></div></div></div>',
  works: '<div class="container"><div class="collection-banner-row">'
    + '<div class="collection-banner-left"><div class="collection-banner-text"></div></div>'
    + '<div class="collection-banner-right"><div class="collection-banner-media"></div></div>'
    + '</div></div>',
};

const VARIANTS = [...Object.keys(TEMPLATES), 'pods', 'scents'];

const ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="11" viewBox="0 0 17 10" '
  + 'aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,'
  + '1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,'
  + '1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)" '
  + 'fill="#fff"/></svg>';

const hasMedia = (el) => !!(el.matches('picture, img') || el.querySelector('picture, img'));
const isMediaOnly = (el) => hasMedia(el) && !el.textContent.trim();

const mediaAt = (list, i) => !!list[i] && isMediaOnly(list[i]);

function readMin(cell) {
  const m = cell && cell.textContent.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

// Authored link title = the source's aria-label (kept even when equal to the text); the
// foundation's decorateButtons echoes the link text into title, which live never carries.
function labelLinks(root) {
  root.querySelectorAll('a[title]').forEach((a) => {
    const t = a.getAttribute('title').trim();
    if (t) a.setAttribute('aria-label', t);
    a.removeAttribute('title');
  });
}

// Art direction: every authored picture stays in the DOM; the one whose min-width matches is
// shown (display: contents), the others are display: none (lazy images never load).
function artDirect(arts) {
  const sorted = [...arts].sort((a, b) => b.min - a.min);
  const queries = sorted.map((a) => window.matchMedia(`(min-width: ${a.min}px)`));
  const update = () => {
    const i = queries.findIndex((q) => q.matches);
    const picked = sorted[i < 0 ? sorted.length - 1 : i];
    arts.forEach((a) => a.el.classList.toggle('is-active', a === picked));
  };
  queries.forEach((q) => q.addEventListener('change', update));
  update();
}

function cellNodes(cell) {
  const kids = [...cell.children];
  if (kids.length) return kids;
  if (!cell.textContent.trim()) return [];
  // HARNESS-ONLY fallback (EW5): a bare-text cell; DA content always carries a <p>.
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

function div(className, ...kids) {
  const d = document.createElement('div');
  d.className = className;
  d.append(...kids);
  return d;
}

function readArt(cells) {
  const art = div('collection-banner-art', cells[0].querySelector('picture') || cells[0].querySelector('img'));
  if (cells[1]) {
    cells[1].hidden = true;
    cells[1].className = 'collection-banner-setting';
    art.append(cells[1]);
  }
  return { el: art, min: readMin(cells[1]) };
}

// pods: heading row, then | icon | copy | rows (live .more-pods-section)
function decoratePods(block, rows) {
  const head = div('collection-banner-head');
  const items = div('collection-banner-items');
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1 && isMediaOnly(cells[0])) {
      const icon = div('collection-banner-icon', ...cellNodes(cells[0]));
      const copy = div('collection-banner-copy', ...cellNodes(cells[1]));
      items.append(div('collection-banner-item', icon, copy));
    } else {
      cells.forEach((cell) => head.append(...cellNodes(cell)));
    }
  });
  block.append(div('container', head, items));
  rows.forEach((row) => row.remove());
}

// scents: image rows + a text row = one slide; arrows step one slide, dots jump (live
// react-multi-carousel, infinite, no autoplay)
function decorateScents(block, rows) {
  const slides = [];
  let arts = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells[0] && isMediaOnly(cells[0]) && !cells[0].querySelector('a')) {
      arts.push(readArt(cells));
      return;
    }
    const text = div('collection-banner-text');
    cells.forEach((cell) => text.append(...cellNodes(cell)));
    const media = div('collection-banner-media', ...arts.map((a) => a.el));
    const slide = div(
      'collection-banner-slide',
      media,
      div('collection-banner-content container', div('collection-banner-wrap', text)),
    );
    slides.push({ el: slide, arts });
    arts = [];
  });
  rows.forEach((row) => row.remove());
  const track = div('collection-banner-track', ...slides.map((sl) => sl.el));
  const viewport = div('collection-banner-viewport', track);
  block.append(viewport);
  slides.forEach((sl) => { if (sl.arts.length) artDirect(sl.arts); });
  if (slides.length < 2) return;

  // live parity: react-multi-carousel's infinite track keeps two aria-hidden clones on each side
  const CLONES = 2;
  const cloneOf = (sl) => {
    const c = sl.el.cloneNode(true);
    c.classList.add('is-clone');
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
    return c;
  };
  const pick = (n) => slides[((n % slides.length) + slides.length) % slides.length];
  for (let n = 1; n <= CLONES; n += 1) track.prepend(cloneOf(pick(-n)));
  for (let n = 0; n < CLONES; n += 1) track.append(cloneOf(pick(n)));

  const dots = document.createElement('ul');
  dots.className = 'collection-banner-dots';
  let index = 0;
  const show = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-100 * (index + CLONES)}%)`;
    slides.forEach((sl, n) => {
      sl.el.classList.toggle('is-current', n === index);
      sl.el.setAttribute('aria-hidden', n === index ? 'false' : 'true');
    });
    [...dots.children].forEach((li, n) => {
      li.classList.toggle('is-active', n === index);
      li.firstElementChild.setAttribute('aria-label', `Go to slide ${n + 1} ${n === index ? 'active' : ''}`);
    });
  };
  slides.forEach((sl, n) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.addEventListener('click', () => show(n));
    li.append(b);
    dots.append(li);
  });
  const arrow = (dir, label, step) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `collection-banner-arrow ${dir}`;
    b.setAttribute('aria-label', label);
    b.innerHTML = ARROW;
    b.addEventListener('click', () => show(index + step));
    return b;
  };
  block.append(arrow('prev', 'Previous slide', -1), arrow('next', 'Next slide', 1), dots);
  show(0);
}

export default function decorate(block) {
  if (block.querySelector(':scope > [class^="collection-banner-"], :scope > .container, :scope > .collection-banner-viewport')) {
    labelLinks(block);
    return;
  }
  const variant = VARIANTS.find((v) => block.classList.contains(v)) || 'centered';
  block.classList.add(variant);
  const rows = [...block.querySelectorAll(':scope > div')];
  if (variant === 'pods') {
    decoratePods(block, rows);
    labelLinks(block);
    return;
  }
  if (variant === 'scents') {
    decorateScents(block, rows);
    labelLinks(block);
    return;
  }
  const arts = [];
  const nodes = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const first = cells[0];
    if (!first) return;
    if (isMediaOnly(first) && (cells.length > 1 || !first.querySelector('a'))) {
      const art = document.createElement('div');
      art.className = 'collection-banner-art';
      art.append(first.querySelector('picture') || first.querySelector('img'));
      if (cells[1]) {
        cells[1].hidden = true;
        cells[1].className = 'collection-banner-setting';
        art.append(cells[1]);
      }
      arts.push({ el: art, min: readMin(cells[1]) });
    } else {
      cells.forEach((cell) => nodes.push(...cellNodes(cell)));
    }
  });

  // the copy: a run of 2+ image-only elements is the logo row, what follows it the note
  const text = [];
  const logos = [];
  const note = [];
  nodes.forEach((el, i) => {
    const run = isMediaOnly(el) && (mediaAt(nodes, i - 1) || mediaAt(nodes, i + 1));
    if (run) logos.push(el);
    else if (logos.length) note.push(el);
    else text.push(el);
  });

  block.insertAdjacentHTML('afterbegin', TEMPLATES[variant]);
  const slot = (name) => block.querySelector(`.collection-banner-${name}`);
  const media = slot('media');
  arts.forEach((a) => media.append(a.el));
  const textSlot = slot('text');
  text.forEach((el) => textSlot.append(el));
  const logoSlot = slot('logos') || textSlot;
  logos.forEach((el) => {
    const w = document.createElement('div');
    w.className = 'collection-banner-logo';
    w.append(el);
    logoSlot.append(w);
  });
  const noteSlot = slot('note') || textSlot;
  note.forEach((el) => noteSlot.append(el));
  rows.forEach((row) => row.remove());
  labelLinks(block);
  if (arts.length) artDirect(arts);
}
