/**
 * home-promo-carousel — "See what we've been working on lately" card rail: arrows step one
 * card, dots mark positions (live: react-multi-carousel, no autoplay — replica progress.json
 * captureState restoreAtDelivery: null, held on position 1).
 * Schema: stardust/eds-schema/en-us.json (sections rail-head + rail-section). Decode tier:
 * reconstructive (repeat group: one card per row).
 *
 * Authoring:
 *   1. optional head row: the section heading (<h2>, <strong> for the heavy part)
 *   2..n. one row per card: image | text paragraph(s) + a "Learn More" link paragraph.
 *      The link's href becomes the whole card's link (EW6: the inner anchor is unwrapped).
 */

const ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" '
  + 'aria-hidden="true"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,'
  + '1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,'
  + '1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10) rotate(-90)" '
  + 'fill="#fff"/></svg>';

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

function cellNodes(cell) {
  const kids = [...cell.children];
  if (kids.length) return kids;
  if (!cell.textContent.trim()) return [];
  // HARNESS-ONLY fallback (EW5): a bare-text cell; DA content always carries a <p>.
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

function buildCard(nodes) {
  const pic = nodes.map(media).find(Boolean);
  const linkP = nodes.find((el) => {
    const a = el.tagName === 'P' && el.querySelector('a');
    return a && el.textContent.trim() === a.textContent.trim();
  });
  const link = linkP ? linkP.querySelector('a') : null;

  const li = document.createElement('li');
  li.className = 'hpc-item';
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'hpc-card';
  if (link) card.href = link.getAttribute('href');

  const mediaBox = document.createElement('div');
  mediaBox.className = 'hpc-card-media';
  if (pic) mediaBox.append(pic.closest('picture') || pic);

  const content = document.createElement('div');
  content.className = 'hpc-card-content';
  const textBox = document.createElement('div');
  textBox.className = 'hpc-card-text';
  nodes.forEach((el) => {
    if (el === linkP || media(el)) return;
    textBox.append(el);
  });
  content.append(textBox);
  if (linkP) {
    linkP.className = '';
    content.append(wrapNode(linkP, 'hpc-card-cta'));
    link.replaceWith(...link.childNodes);
  }
  card.append(mediaBox, content);
  li.append(card);
  return li;
}

function setupRail(rail) {
  const track = rail.querySelector('.hpc-track');
  const items = [...track.children];
  const dots = rail.querySelector('.hpc-dots');
  let pos = 0;
  let render = () => {};
  const go = (i) => {
    pos = i;
    render();
  };
  const itemWidth = () => items[0].getBoundingClientRect().width || 1;
  const perView = () => Math.max(1, Math.round(track.parentElement.clientWidth / itemWidth()));
  const count = () => Math.max(1, items.length - perView() + 1);
  render = () => {
    const n = count();
    if (pos > n - 1) pos = n - 1;
    track.style.transform = pos ? `translate3d(${-pos * itemWidth()}px, 0, 0)` : '';
    if (dots.children.length !== n) {
      dots.replaceChildren();
      for (let i = 0; i < n; i += 1) {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.addEventListener('click', () => go(i));
        li.append(b);
        dots.append(li);
      }
    }
    [...dots.children].forEach((li, i) => {
      li.classList.toggle('is-active', i === pos);
      li.firstChild.setAttribute('aria-label', `Go to slide ${i + 1} ${i === pos ? 'active' : ''}`);
    });
  };
  rail.querySelector('.hpc-arrow-prev').addEventListener('click', () => {
    pos = pos > 0 ? pos - 1 : count() - 1;
    render();
  });
  rail.querySelector('.hpc-arrow-next').addEventListener('click', () => {
    pos = pos < count() - 1 ? pos + 1 : 0;
    render();
  });
  window.addEventListener('resize', render);
  // the per-view count depends on the block CSS: re-render once the rail has its real size
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => render()).observe(rail);
  render();
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = document.createElement('div');
  head.className = 'hpc-head container';
  const track = document.createElement('ul');
  track.className = 'hpc-track';

  rows.forEach((row) => {
    const nodes = [...row.children].flatMap(cellNodes);
    if (nodes.some(media)) {
      track.append(buildCard(nodes));
    } else {
      nodes.forEach((el) => head.append(wrapNode(el, isHeading(el) ? 'hpc-heading' : 'hpc-intro')));
    }
  });

  const body = document.createElement('div');
  body.className = 'hpc-body container';
  const rail = document.createElement('div');
  rail.className = 'hpc-rail';
  const viewport = document.createElement('div');
  viewport.className = 'hpc-viewport';
  const dots = document.createElement('ul');
  dots.className = 'hpc-dots';
  viewport.append(track, dots);
  const arrows = document.createElement('div');
  arrows.className = 'hpc-arrows';
  ['prev', 'next'].forEach((dir) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `hpc-arrow hpc-arrow-${dir}`;
    b.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
    b.innerHTML = ARROW;
    arrows.append(b);
  });
  rail.append(viewport, arrows);
  body.append(rail);

  block.replaceChildren(...(head.children.length ? [head] : []), body);
  if (track.children.length) setupRail(rail);
}
