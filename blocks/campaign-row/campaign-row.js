/**
 * campaign-row — one row of a one-off campaign / "our commitment" page (live CMS
 * .dynamic-content-wrapper > .row: picture and rich-text columns, banners with a text box over a
 * photo, coloured bands). Decode tier: template-slotted per column — the authored rows and cells
 * stay in place and only get classes (nothing is rebuilt or re-ordered).
 *
 * Authored shape: one block row per live row, one cell per live column. A cell holds rich text
 * (headings, paragraphs, lists, CTA link paragraphs) and/or images. Two or more image paragraphs
 * in a row inside a cell are ONE art-directed picture: the first is the wide art (>= 992px), the
 * last the narrow art (< 992px); a middle one (if any) serves 576–991px. A lone image is used at
 * every width.
 *
 * A paragraph holding one link to an .mp4 is a muted looping background video (live
 * .video-background); a run of them is art-directed like images (wide, [mid,] narrow).
 *
 * Variant `embed`: a cell holding only one (non-mp4) link becomes an iframe of that URL.
 *
 * Variant `no-art`: consecutive images are separate images (no art direction).
 * Variant `calculator`: see setupCalculator; `list-cards`: see setupListCards.
 * @ew-exempt calculator settings rows (multiplier, max value, prefix) are settings, kept hidden;
 *   "Previous slide" / "Next slide" arrow labels are control labels (live aria-labels).
 *
 * Cell classes (by content): cr-media (images only), cr-text (text only), cr-mixed.
 * Image paragraphs: cr-art + cr-wide | cr-mid | cr-narrow when art-directed.
 *
 * @variants the live page module each row recreates (CSS in campaign-row.css): evo-hero,
 *   evo-benefits, … — see the CSS file's section comments.
 */

function videoLink(el) {
  if (el.tagName !== 'P') return null;
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1 || !/\.mp4(\?|$)/i.test(links[0].getAttribute('href'))) return null;
  return links[0];
}

function isImagePara(el) {
  if (!el) return false;
  if (el.classList.contains('cr-video') || videoLink(el)) return true;
  if (el.tagName === 'PICTURE' || el.tagName === 'IMG') return true;
  return el.tagName === 'P' && !!el.querySelector('picture, img') && el.textContent.trim() === '';
}

function markArt(cell, noArt) {
  const kids = [...cell.children];
  let i = 0;
  while (i < kids.length) {
    if (isImagePara(kids[i])) {
      let j = i;
      while (j + 1 < kids.length && isImagePara(kids[j + 1])) j += 1;
      const run = kids.slice(i, j + 1);
      if (run.length > 1 && !noArt) {
        run.forEach((el, k) => {
          el.classList.add('cr-art');
          if (k === 0) el.classList.add('cr-wide');
          else if (k === run.length - 1) el.classList.add('cr-narrow');
          else el.classList.add('cr-mid');
        });
      }
      run.forEach((el) => el.classList.add('cr-pic'));
      i = j + 1;
    } else {
      i += 1;
    }
  }
}

/* a paragraph holding one link to an mp4 = a muted, looping background video (live
   .video-background); the authored paragraph stays (visually hidden) beside the player */
function mountVideo(p) {
  if (p.querySelector('video')) return;
  const link = videoLink(p);
  if (!link) return;
  const video = document.createElement('video');
  video.src = link.href;
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute('aria-hidden', 'true');
  link.classList.add('cr-video-source');
  p.classList.add('cr-video');
  p.prepend(video);
}

/* variant `embed`: a cell holding only one link (not an mp4) is an embedded page (live
   iframe, e.g. the jebbit quiz); the link stays (visually hidden), its text is the frame title */
function mountEmbed(cell) {
  if (cell.querySelector('iframe')) return;
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return;
  const link = links[0];
  if (/\.mp4(\?|$)/i.test(link.getAttribute('href'))) return;
  const frame = document.createElement('iframe');
  frame.src = link.href;
  frame.title = link.textContent.trim();
  frame.loading = 'lazy';
  link.classList.add('cr-video-source');
  cell.classList.add('cr-embed');
  cell.prepend(frame);
}

/* variant `calculator` (live .calculator-simple): the trailing two-cell rows are settings
   (multiplier | 0.36, max value | 150, prefix | $), kept hidden; the "times" paragraph gets the
   number input, the "Calculate" paragraph acts as the button and writes the result into the
   paragraph that reads "?" */
function setupCalculator(block) {
  if (block.querySelector('.cr-calc-input')) return;
  const settings = {};
  [...block.children].slice(1).forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2 && !row.querySelector('picture, img')) {
      settings[cells[0].textContent.trim().toLowerCase()] = cells[1].textContent.trim();
      row.classList.add('cr-settings');
    }
  });
  const ps = [...block.querySelectorAll('.cr-row:not(.cr-settings) p')];
  const label = ps.find((p) => /^times$/i.test(p.textContent.trim()));
  const button = ps.find((p) => /^calculate$/i.test(p.textContent.trim()));
  const outcome = ps.find((p) => p.textContent.trim() === '?');
  if (!label || !button || !outcome) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = 'numeric';
  input.className = 'cr-calc-input';
  input.setAttribute('aria-label', label.textContent.trim());
  label.classList.add('cr-calc-label');
  label.prepend(input);
  button.classList.add('cr-calc-button');
  button.setAttribute('role', 'button');
  button.tabIndex = 0;
  outcome.classList.add('cr-calc-outcome');
  outcome.setAttribute('aria-live', 'polite');
  const multiplier = parseFloat(settings.multiplier) || 0;
  const max = parseFloat(settings['max value']) || Infinity;
  const prefix = settings.prefix || '';
  const run = () => {
    const n = Math.min(Math.max(parseFloat(input.value) || 0, 0), max);
    input.value = n ? String(n) : '';
    outcome.textContent = `${prefix}${(n * multiplier).toFixed(2)}`;
  };
  button.addEventListener('click', run);
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      run();
    }
  });
}

/* variant `list-cards` (live react-multi-carousel list cards): one card per row; below 992 the
   cards scroll one at a time, the arrows step them */
function setupListCards(block) {
  if (block.querySelector('.cr-arrow')) return;
  const mk = (dir, label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `cr-arrow cr-arrow-${dir}`;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => {
      const card = block.querySelector('.cr-row');
      const step = card ? card.getBoundingClientRect().width : block.clientWidth;
      block.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
    });
    return b;
  };
  block.append(mk('left', 'Previous slide'), mk('right', 'Next slide'));
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('cr-row');
    [...row.children].forEach((cell) => {
      cell.classList.add('cr-cell');
      [...cell.children].forEach((el) => mountVideo(el));
      if (block.classList.contains('embed')) mountEmbed(cell);
      const textual = [...cell.children].some((el) => !isImagePara(el) && el.textContent.trim() !== '');
      // no-art: images inside a text cell are separate images; image-only cells stay art-directed
      markArt(cell, block.classList.contains('no-art') && textual);
      const hasPic = !!cell.querySelector('picture, img, video');
      const hasText = [...cell.children].some((el) => !isImagePara(el) && el.textContent.trim() !== '')
        || [...cell.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() !== '');
      if (cell.classList.contains('cr-embed')) cell.classList.add('cr-media');
      else if (hasPic && !hasText) cell.classList.add('cr-media');
      else if (hasText && !hasPic) cell.classList.add('cr-text');
      else if (hasPic) cell.classList.add('cr-mixed');
    });
  });
  if (block.classList.contains('calculator')) setupCalculator(block);
  if (block.classList.contains('list-cards')) setupListCards(block);
}
