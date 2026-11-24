/**
 * stain-intro — the stain how-to page head (live .article-intro.article-intro-2 on
 * /en-us/how-to-wash-clothes/how-to-remove-stains/acne-cream-stains): full-width image, then a
 * centred col-lg-9 column with the page title, the share row and the intro paragraphs.
 * Decode tier: template-slotted; authored nodes are MOVED into the slots by content.
 *
 * Authored shape: the image (picture) in one row; the `<h1>` and the intro `<p>`s in another.
 * The share row is generated (functional chrome, not authored text — live links carry only
 * aria-labels).
 *
 * The page frame (Template | stain) and its page-scoped overrides of the reused article-related
 * and topic-hub-back-to-top blocks ride this block's CSS.
 */

const SHARES = [
  ['share-facebook', 'Share on Facebook', (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`],
  ['share-twitter', 'Share on Twitter', (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
  ['share-pinterest', 'Share on Pinterest', (u, t) => `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`],
  ['share-email', 'Share by Email', (u, t) => `mailto:?subject=${t}&body=${u}`],
  ['share-print', 'Print', () => '#print'],
];

function make(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function buildShare() {
  const share = make('div', 'stain-intro-share');
  const url = encodeURIComponent(window.location.href.split('#')[0]);
  const title = encodeURIComponent(document.title);
  SHARES.forEach(([icon, label, href]) => {
    const a = make('a', `stain-intro-share-item ${icon}`);
    a.href = href(url, title);
    a.setAttribute('aria-label', label);
    if (icon === 'share-print') {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });
    } else if (icon !== 'share-email') {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    // inline svg, as live (decorative glyph from /icons)
    fetch(`${window.hlx?.codeBasePath || ''}/icons/${icon}.svg`)
      .then((r) => (r.ok ? r.text() : ''))
      .then((svg) => {
        if (!svg.startsWith('<svg')) return;
        const holder = document.createElement('span');
        holder.innerHTML = svg;
        const el = holder.querySelector('svg');
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('focusable', 'false');
        a.append(el);
      })
      .catch(() => {});
    share.append(a);
  });
  return share;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .stain-intro-body')) return; // EW9 re-entrant
  const image = make('div', 'stain-intro-image');
  const col = make('div', 'stain-intro-col');
  const title = make('div', 'stain-intro-title');
  const text = make('div', 'stain-intro-text');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((el) => {
      const pic = el.matches('picture, img') ? el : el.querySelector('picture, img');
      if (pic && !el.textContent.trim()) {
        if (!image.children.length) image.append(pic.closest('picture') || pic);
      } else if (/^H[1-6]$/.test(el.tagName) && !title.children.length) {
        title.append(el);
      } else {
        text.append(el);
      }
    });
  });
  col.append(title, buildShare(), text);
  const body = make('div', 'container stain-intro-body');
  body.append(col);
  block.replaceChildren(image, body);
}
