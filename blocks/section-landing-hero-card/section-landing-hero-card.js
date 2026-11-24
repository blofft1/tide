/**
 * section-landing-hero-card — section-landing banner card (live .banner-card,
 * image-appearance-Cover): full-bleed image, white page title over its lower edge, white
 * deck card overlapping the image bottom. Schema: stardust/eds-schema/en-us-our-commitment.json
 * (section commitment-hero). Decode tier: template-slotted — authored nodes are MOVED into
 * empty slots by role (picture → image, heading → title, everything else → deck), never by
 * row index.
 *
 * Authoring (any number of rows/cells, order free):
 *   - the banner image (picture / img)
 *   - the page heading (<h1>; <strong> inside it renders as on live)
 *   - the deck paragraph(s) — optional; without a deck the card is not drawn
 *   - art direction (optional): an image row whose second cell reads "from <n>px" is the
 *     rendition from that viewport width up; the image row without a setting is the narrow
 *     one (live <picture> sources with media min-width)
 *
 * @variants block class: no-box — live .banner-no-white-box (no deck card; the title sits
 *   110px above the image bottom from 992px)
 *
 * Page-scoped section-landing spacing for reused blocks (learn-more-card-grid rows) lives in
 * this block's CSS under body.section-landing (metadata Template | section-landing).
 */

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

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
  if (block.querySelector(':scope > .slhc-box')) return; // EW9 re-entrant

  const image = slot('slhc-image');
  const box = slot('container slhc-box');
  const head = slot('slhc-head');
  const title = slot('slhc-title');
  const deck = slot('slhc-deck');

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
    } else if (isHeading(el) && !title.children.length) {
      title.append(el);
    } else {
      deck.append(el);
    }
  });

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
    if (w) block.style.setProperty('--slhc-img-width', `${w}px`);
    image.querySelectorAll('source:not([media])').forEach((source) => {
      source.srcset = source.srcset.replace(/width=750\b/, 'width=2000');
    });
    if (img.src.includes('width=750')) img.src = img.src.replace(/width=750\b/, 'width=2000');
  }
}
