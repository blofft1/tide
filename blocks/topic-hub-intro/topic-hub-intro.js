/**
 * topic-hub-intro — the topic-hub page head (live .alp-intro): full-width header image,
 * breadcrumb trail + share row, then the page title, a bold short line and the intro text.
 * Decode tier: template-slotted (fixed composition); authored nodes are MOVED into the slots,
 * classified by content, never by row index.
 *
 * Authored shape (one element per row, or all in one cell):
 *   - the header image (picture)
 *   - the breadcrumb list: `<li><a href="/en-us">Home</a></li>` per ancestor, plain-text last
 *     item for the current page
 *   - `<h1>` title, then the short line `<p>`, then the intro `<p>`(s)
 * The share row is generated (functional chrome, not authored text).
 *
 * The template frame (body.topic-hub) and the stain-guide-widget `orange` skin ride this
 * block's CSS: every topic-hub page carries this block first.
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
  const share = make('div', 'topic-hub-intro-share');
  const url = encodeURIComponent(window.location.href.split('#')[0]);
  const title = encodeURIComponent(document.title);
  SHARES.forEach(([icon, label, href]) => {
    const a = make('a', `topic-hub-intro-share-item ${icon}`);
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

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) {
      out.push(...kids);
    } else if (cell.textContent.trim()) {
      // bare-text cell (the pipeline unwraps single-paragraph cells)
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

export default function decorate(block) {
  const image = make('div', 'topic-hub-intro-image');
  const crumbs = make('nav', 'topic-hub-intro-crumbs');
  crumbs.setAttribute('aria-label', 'Breadcrumbs');
  const text = make('div', 'topic-hub-intro-text');

  let titleSeen = false;
  let shortSeen = false;
  collectNodes(block).forEach((node) => {
    const pic = node.matches('picture, img') ? node : node.querySelector('picture, img');
    if (pic && !node.textContent.trim()) {
      image.append(pic.closest('picture') || pic);
    } else if (!crumbs.children.length && !titleSeen && node.matches('ul, ol')) {
      crumbs.append(node);
    } else if (!titleSeen && /^H[1-6]$/.test(node.tagName)) {
      node.classList.add('topic-hub-intro-title');
      text.append(node);
      titleSeen = true;
    } else {
      if (titleSeen && !shortSeen && node.tagName === 'P') {
        node.classList.add('topic-hub-intro-short');
        shortSeen = true;
      }
      text.append(node);
    }
  });

  crumbs.querySelectorAll('a[href]').forEach((a) => {
    if (!a.hasAttribute('aria-label')) a.setAttribute('aria-label', a.textContent.trim());
  });
  const last = crumbs.querySelector('li:last-child');
  if (last && !last.querySelector('a')) last.setAttribute('aria-current', 'page');

  const bar = make('div', 'topic-hub-intro-bar');
  bar.append(crumbs, buildShare());
  const container = make('div', 'container');
  container.append(bar, text);
  const bottom = make('div', 'topic-hub-intro-bottom');
  bottom.append(container);
  block.replaceChildren(...(image.children.length ? [image] : []), bottom);
}
