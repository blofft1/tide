/**
 * rewards-module — the one-off modules of tide.com /en-us/rewards (live CMS rows).
 * Decode tier: template-slotted (hero, image), reconstructive (tiles: one card per row).
 *
 * @variants
 *   hero  — live .white-text-on-blue-bg + .banner-full-width-bg-text-left: full-width image
 *           with a white text card (heading + paragraph). Rows: image rows (art direction: a
 *           second cell "from <n>px" = the rendition from that width up; the row without a
 *           setting is the narrow one), then a cell with the text.
 *   image — live full-bleed picture row (art-directed like hero), no text.
 *   tiles — live .grid-type-basic.grid-col3: grey link cards. One row per card: cell 1 the
 *           image(s) (two images = wide rendition from 992px, then the narrow one), cell 2
 *           title paragraph, text paragraph(s), and a link paragraph whose href makes the
 *           whole card a link and whose label becomes the card's button (EW6).
 */

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

/** wider renditions become <source media> on the narrow picture */
function artDirect(base, arts) {
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
  base.querySelectorAll('source:not([media])').forEach((s) => {
    s.srcset = s.srcset.replace(/width=750\b/, 'width=2000');
  });
  const img = base.querySelector('img');
  if (img && img.src.includes('width=750')) img.src = img.src.replace(/width=750\b/, 'width=2000');
}

function decorateBanner(block) {
  const image = div('rm-image');
  const text = div('rm-text');
  const arts = [];
  [...block.children].forEach((row) => {
    const [first, setting] = row.children;
    const m = setting && setting.textContent.trim().match(/^from\s+(\d+)\s*px$/i);
    if (m && first && media(first) && !first.textContent.trim()) {
      arts.push({ min: Number(m[1]), pic: media(first).closest('picture') || media(first) });
      return;
    }
    [...row.children].forEach((cell) => {
      [...cell.children].forEach((el) => {
        const pic = media(el);
        if (pic && !el.textContent.trim()) {
          if (!image.children.length) image.append(pic.closest('picture') || pic);
        } else {
          text.append(el);
        }
      });
    });
  });
  const base = image.querySelector('picture');
  if (base) artDirect(base, arts);
  const kids = [image];
  if (text.children.length) {
    const box = div('container rm-box');
    const card = div('rm-card');
    card.append(text);
    box.append(card);
    kids.push(box);
  }
  block.replaceChildren(...kids);
}

function decorateTiles(block) {
  const grid = div('rm-grid');
  [...block.children].forEach((row) => {
    const [imgCell, textCell] = row.children;
    if (!textCell) return;
    const link = textCell.querySelector('a[href]');
    const card = document.createElement(link ? 'a' : 'div');
    card.className = 'rm-tile';
    if (link) {
      card.href = link.href;
      if (link.title) card.title = link.title;
    }
    const image = div('rm-tile-image');
    const pics = [...imgCell.querySelectorAll('picture')];
    if (pics.length) {
      const base = pics[pics.length - 1];
      image.append(base);
      if (pics.length > 1) artDirect(base, [{ min: 992, pic: pics[0] }]);
    }
    const content = div('rm-tile-content');
    const paras = [...textCell.children];
    paras.forEach((p, i) => {
      if (p.contains(link)) {
        // EW6: the card is the link; the label moves into the button span
        const button = div('rm-tile-button');
        const span = document.createElement('span');
        span.append(...link.childNodes);
        button.append(span);
        content.append(button);
        p.remove();
      } else {
        const wrap = div(i === 0 ? 'rm-tile-title' : 'rm-tile-text');
        wrap.append(p);
        content.append(wrap);
      }
    });
    card.append(image, content);
    grid.append(card);
  });
  block.replaceChildren(grid);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .rm-image, :scope > .rm-grid')) return; // EW9
  if (block.classList.contains('tiles')) decorateTiles(block);
  else decorateBanner(block);
}
