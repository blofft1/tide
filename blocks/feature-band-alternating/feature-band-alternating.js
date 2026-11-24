/**
 * feature-band-alternating — a text band composed with a photo (home hero banners, the POWER
 * PODS band, "How to do laundry", the product-listing "Why Tide" feature banners).
 * Schema: stardust/eds-schema/en-us.json (sections banner, pods, howto). Decode tier:
 * template-slotted (fixed composition: media + one text box).
 *
 * Authoring (one cell per row, any order; DA-flattened single cell also works):
 *   - image row(s): 1 or 2 images. With 2, the FIRST is the wide (>= 992px) art and the
 *     SECOND the narrow (< 992px) art; with 1 it serves every width.
 *   - text row: optional eyebrow <p> BEFORE the first heading, heading(s) (the page's lead
 *     band authors <h1>, every other band <h2>/<h4>), body <p>s, CTA <p>s
 *     (bold link = navy button, italic link = orange button).
 *
 * @variants block class: boxed | blue | navy | split | overlay | orange | white | stacked | right
 *   boxed   — white rounded box over a full-bleed photo (home hero; + blue = evo look)
 *   navy    — navy band, text right, photo pinned bottom-left (POWER PODS)
 *   split   — white band, text left, photo pinned bottom-right (How to do laundry)
 *   overlay — text over a contained photo (PLP feature banner; + orange | white text skin,
 *             + stacked for the 2nd..n-th consecutive band,
 *             + right = text box on the right >= 992px)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

// Authored link title = the source's accessible name (aria-label); the foundation's
// decorateButtons echoes the label into title, which live never carries.
function labelLinks(root) {
  root.querySelectorAll('a[title]').forEach((a) => {
    const t = a.getAttribute('title').trim();
    if (t && t !== a.textContent.trim()) a.setAttribute('aria-label', t);
    a.removeAttribute('title');
  });
}

const isMedia = (el) => el.matches('picture, img') || !!el.querySelector('picture, img');
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): bare text next to an image; DA always wraps it in <p>.
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
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

export default function decorate(block) {
  const nodes = collectNodes(block);
  if (!nodes.length) return;

  const media = [];
  const text = [];
  nodes.forEach((el) => {
    if (isMedia(el) && !el.textContent.trim()) {
      media.push(el.matches('picture, img') ? el : el.querySelector('picture') || el);
    } else {
      text.push(el);
    }
  });

  const firstHeading = text.findIndex(isHeading);
  const box = document.createElement('div');
  box.className = 'fba-box';
  const actions = document.createElement('div');
  actions.className = 'fba-actions';

  text.forEach((el, i) => {
    const link = el.tagName === 'P' ? el.querySelector('a') : null;
    const isCta = link && el.textContent.trim() === link.textContent.trim();
    if (isCta) {
      actions.append(el);
    } else if (firstHeading > i && el.tagName === 'P') {
      box.append(wrapNode(el, 'fba-eyebrow'));
    } else if (isHeading(el)) {
      box.append(wrapNode(el, 'fba-heading'));
    } else {
      box.append(wrapNode(el, 'fba-body'));
    }
  });
  if (actions.children.length) box.append(actions);

  const wrap = document.createElement('div');
  wrap.className = 'fba-wrap container';
  wrap.append(box);

  const mediaBox = document.createElement('div');
  mediaBox.className = 'fba-media';
  if (media.length > 1) mediaBox.classList.add('fba-media-art');
  media.forEach((m, i) => {
    let size = 'any';
    if (media.length > 1) size = i === 0 ? 'wide' : 'narrow';
    mediaBox.append(wrapNode(m, `fba-media-${size}`));
  });

  block.replaceChildren(wrap, mediaBox);
  labelLinks(block);
}
