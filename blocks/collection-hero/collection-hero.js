/**
 * collection-hero — the first banner of a collection landing page (live
 * .collection-banner-with-bg / collection-*-first-banner): a full-bleed, art-directed photo
 * with the collection title, a sub-heading and a "Shop the collection" CTA over it.
 * Schema: stardust/eds-schema/en-us-shop-top-collections-tide-free-and-gentle.json
 * (section cl-hero). Decode tier: template-slotted (fixed composition: media + one text box).
 *
 * Authoring (one row per item):
 *   - image rows, WIDEST art first: | image | from 1400px |, | image | from 992px |, …,
 *     and the narrowest art last with no second cell (it serves every smaller width).
 *     One image row = one art for every width.
 *   - text row: <h1> (the collection name, <strong> for the heavy part), optional <h2>
 *     sub-heading, CTA <p> with a link (e.g. "#browse-collection").
 *
 * @variants (block classes = the live CMS style options of .collection-fg-first-banner; any mix):
 *   orange-ground (orange band behind a transparent image), white-h1, white-h2, navy-h1,
 *   theme-orange (orange h1, heavy h2), blue-cta (navy pill CTA), half (copy in the left half
 *   >= 992), v-center | middle | lg-center (copy centred vertically >= 992), margin-lg (copy box
 *   inset 40 / 120px), top-150 (copy from 150px / 65px), h2-bigger (40 → 68px h2), display-h2
 *   (light 40 → 68px white h2), display-h2-small (light 36 → 48px navy h2), orange (orange
 *   display h2), p-bigger (heavy 32px white paragraphs), p-top (30px above paragraphs),
 *   shirt (copy reserves 420px below it). The same block serves the image-only banner.
 *
 * @ew-exempt the "from 1400px" cells are art-direction settings, not page copy: they stay in
 *   the DOM (hidden) so the author can edit them.
 */

const MEDIA_TEMPLATE = '<div class="collection-hero-media"></div>'
  + '<div class="collection-hero-content"><div class="container">'
  + '<div class="collection-hero-text"></div></div></div>';

const hasMedia = (el) => !!el.querySelector('picture, img');

function readMin(cell) {
  const m = cell && cell.textContent.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

// Art direction: every authored picture stays in the DOM; the one whose min-width matches is
// shown (display: contents), the others are display: none (lazy images never load).
function artDirect(arts, eager) {
  const sorted = [...arts].sort((a, b) => b.min - a.min);
  const queries = sorted.map((a) => window.matchMedia(`(min-width: ${a.min}px)`));
  const update = () => {
    const i = queries.findIndex((q) => q.matches);
    const picked = sorted[i < 0 ? sorted.length - 1 : i];
    arts.forEach((a) => {
      a.el.classList.toggle('is-active', a === picked);
      if (eager && a === picked) {
        const img = a.el.querySelector('img');
        if (img) {
          img.loading = 'eager';
          img.setAttribute('fetchpriority', 'high');
        }
      }
    });
  };
  queries.forEach((q) => q.addEventListener('change', update));
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .collection-hero-media')) return;
  const rows = [...block.querySelectorAll(':scope > div')];
  const arts = [];
  const text = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const first = cells[0];
    if (!first) return;
    const isArt = hasMedia(first) && !first.querySelector('h1, h2, h3, h4, h5, h6, a')
      && !first.textContent.trim();
    if (isArt) {
      const art = document.createElement('div');
      art.className = 'collection-hero-art';
      const pic = first.querySelector('picture') || first.querySelector('img');
      art.append(pic);
      if (cells[1]) {
        cells[1].hidden = true;
        cells[1].className = 'collection-hero-setting';
        art.append(cells[1]);
      }
      arts.push({ el: art, min: readMin(cells[1]) });
    } else {
      cells.forEach((cell) => text.push(...cell.children));
    }
  });

  block.insertAdjacentHTML('afterbegin', MEDIA_TEMPLATE);
  const media = block.querySelector('.collection-hero-media');
  const textSlot = block.querySelector('.collection-hero-text');
  arts.forEach((a) => media.append(a.el));
  text.forEach((el) => textSlot.append(el));
  rows.forEach((row) => row.remove());
  // only the page's first banner is the LCP candidate
  if (arts.length) artDirect(arts, block === document.querySelector('main .collection-hero'));
}
