/**
 * news-banner — tide.com /en-us/latest-news banner cards (live .banner-card:
 * image-appearance-Cover,
 * banner-style-card, image-appearance-Right). Decode tier: template-slotted — authored nodes
 * are MOVED into empty slots by role: picture → image, paragraphs before the heading in the
 * heading's cell → eyebrow, heading → title, everything else → deck (white card overlapping
 * the image bottom). Adapted from section-landing-hero-card (same live component) with the
 * eyebrow slot the latest-news banners carry.
 *
 * Authoring (rows/cells, order free): the banner image (+ art direction: an image row whose
 * second cell reads "from <n>px" is the rendition from that width up; the image row without a
 * setting is the narrow one); a cell with the eyebrow paragraph(s) and the heading; a cell
 * with the deck paragraph(s) and the CTA (italic link = orange button).
 *
 * @variants card — live banner-style-card (title block centred on the image, navy ink);
 *   right — live image-appearance-Right (product image in the right half of a coloured band);
 *   orange — the orange band ground (live .featured-products-banner)
 *
 * Page-scoped spacing for the reused learn-more-card-grid rows of the latest-news page lives
 * in this block's CSS under body.latest-news (metadata Template | latest-news).
 */

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

// a paragraph that precedes a heading in the same cell (live .banner-text-content > p)
function isEyebrow(el) {
  if (el.tagName !== 'P') return false;
  let next = el.nextElementSibling;
  while (next && next.tagName === 'P') next = next.nextElementSibling;
  return !!next && isHeading(next);
}

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
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

export default function decorate(block) {
  if (block.querySelector(':scope > .nb-box')) return; // EW9 re-entrant

  const image = slot('nb-image');
  const box = slot('container nb-box');
  const head = slot('nb-head');
  const title = slot('nb-title');
  const deck = slot('nb-deck');
  const eyebrow = slot('nb-eyebrow');

  // art-directed renditions: image row + "from <n>px" setting cell
  const arts = [];
  const rows = [...block.children].filter((row) => {
    const [first, setting] = row.children;
    const m = setting && setting.textContent.trim().match(/^from\s+(\d+)\s*px$/i);
    if (!m || !first || !media(first) || first.textContent.trim()) return true;
    arts.push({ min: Number(m[1]), pic: media(first).closest('picture') || media(first) });
    return false;
  });
  const nodes = rows.flatMap((row) => [...row.children].flatMap(cellNodes));
  nodes.forEach((el) => {
    const m = media(el);
    if (m && !el.textContent.trim()) {
      if (!image.children.length) image.append(m.closest('picture') || m);
    } else if (isHeading(el) && !title.querySelector('h1, h2, h3, h4, h5, h6')) {
      title.append(el);
    } else if (isEyebrow(el)) {
      eyebrow.append(el);
    } else {
      deck.append(el);
    }
  });

  // live CTA aria-labels (authored as title, CMS "<target> <label>" convention)
  deck.querySelectorAll('a[title]').forEach((a) => a.setAttribute('aria-label', a.title));
  if (eyebrow.children.length) title.prepend(eyebrow);
  head.append(title);
  box.append(head);
  if (deck.children.length) box.append(deck);
  const kids = [];
  if (image.children.length) kids.push(image);
  kids.push(box);
  block.replaceChildren(...kids);

  // narrow picture = base; wider renditions become <source media="(min-width: n)"> on it
  const base = image.querySelector('picture');
  if (base && arts.length) {
    arts.sort((a, b) => a.min - b.min).forEach(({ min, pic }) => {
      const wide = pic.querySelector('source[type="image/webp"]') || pic.querySelector('source');
      const fallback = pic.querySelector('img');
      const srcset = wide ? wide.srcset : fallback && fallback.src;
      if (!srcset) return;
      const source = document.createElement('source');
      source.media = `(min-width: ${min}px)`;
      if (wide && wide.type) source.type = wide.type;
      source.srcset = srcset.replace(/width=750\b/, 'width=2000');
      base.prepend(source);
    });
  }

  const img = image.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
    // live renders the banner at its intrinsic size below 992px (cropped by the frame):
    // pin the authored width and serve the large rendition there too
    const w = img.getAttribute('width');
    if (w) block.style.setProperty('--nb-img-width', `${w}px`);
    image.querySelectorAll('source:not([media])').forEach((source) => {
      source.srcset = source.srcset.replace(/width=750\b/, 'width=2000');
    });
    if (img.src.includes('width=750')) img.src = img.src.replace(/width=750\b/, 'width=2000');
  }
}
