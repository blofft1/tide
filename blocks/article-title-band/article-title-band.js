/**
 * article-title-band — orange article intro band (live .article-intro / type_4 intro):
 * title, share row, lead paragraph(s), optional lead image (then a 50/50 split).
 *
 * Authored shape: one or more cells holding the page `<h1>`, then the lead `<p>`(s); an
 * optional `<picture>` anywhere becomes the band image (hidden below 992px, as live).
 * Authored nodes are MOVED into the layout, classified by content — never by row index.
 * The share row is generated (functional chrome, not authored text). Variant `no-share`
 * removes it. The section holding this block becomes the orange band; a `breadcrumb` block
 * in the same section sits at its top.
 */

const SHARES = [
  ['share-facebook', 'Share on Facebook', (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`],
  ['share-twitter', 'Share on Twitter', (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
  ['share-pinterest', 'Share on Pinterest', (u, t) => `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`],
  ['share-email', 'Share by Email', (u, t) => `mailto:?subject=${t}&body=${u}`],
  ['share-print', 'Print', () => '#print'],
];

function buildShare(modifier) {
  const share = document.createElement('div');
  share.className = `article-title-band-share ${modifier}`;
  const url = encodeURIComponent(window.location.href.split('#')[0]);
  const title = encodeURIComponent(document.title);
  SHARES.forEach(([icon, label, href]) => {
    const a = document.createElement('a');
    a.className = `article-title-band-share-item ${icon}`;
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
    // inline svg, as live (the glyph ships from /icons; white fill baked in)
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

/**
 * Live rich text labels every internal link "<target slug words> <link text>"
 * (e.g. "remove odors removes the odor at its source"). Applied to the article's prose,
 * table and FAQ links; attribute only, the authored text is untouched.
 */
function labelProseLinks(main) {
  if (!main) return;
  main.querySelectorAll(':is(.default-content-wrapper, .table, .faq-accordion) a[href]')
    .forEach((a) => {
      if (a.hasAttribute('aria-label') || a.classList.contains('button')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const leaf = url.pathname.split('/').filter(Boolean).pop();
      if (!leaf) return;
      a.setAttribute('aria-label', `${leaf.replace(/-/g, ' ')} ${a.textContent.trim()}`);
    });
}

export default function decorate(block) {
  labelProseLinks(block.closest('main'));
  const elements = [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.childNodes])
    .filter((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim());

  const content = document.createElement('div');
  content.className = 'article-title-band-content';
  const headline = document.createElement('div');
  headline.className = 'article-title-band-headline';
  const lead = document.createElement('div');
  lead.className = 'article-title-band-lead';
  const media = document.createElement('div');
  media.className = 'article-title-band-image';

  let headingSeen = false;
  elements.forEach((el) => {
    const isEl = el.nodeType === Node.ELEMENT_NODE;
    if (isEl && !headingSeen && el.matches('h1, h2, h3, h4, h5, h6')) {
      headline.append(el);
      headingSeen = true;
    } else if (isEl && (el.matches('picture, img') || (el.querySelector('picture, img')
      && !el.textContent.trim()))) {
      media.append(el);
    } else if (!headingSeen && isEl && !el.querySelector('a')) {
      // eyebrow-like text before the title stays above it
      headline.append(el);
    } else {
      lead.append(el);
    }
  });

  const noShare = block.classList.contains('no-share');
  content.append(headline);
  if (!noShare) content.append(buildShare('mobile'));
  if (lead.childNodes.length) content.append(lead);
  if (!noShare) content.append(buildShare('desktop'));

  const grid = document.createElement('div');
  grid.className = 'article-title-band-grid';
  grid.append(content);
  if (media.childNodes.length) {
    grid.append(media);
    block.classList.add('with-image');
  }
  const container = document.createElement('div');
  container.className = 'container';
  container.append(grid);
  block.replaceChildren(container);
}
