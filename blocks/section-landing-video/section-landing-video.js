/**
 * section-landing-video — centred YouTube preview (live .youtube-video +
 * .youtube-video-preview-overlay): a 16:9 poster with a play mark; activating it mounts the
 * embed player (same src as live, data-action-detail), never before (dynamic-features row 3).
 * Schema: stardust/eds-schema/en-us-our-commitment.json (section commitment-video). Decode
 * tier: template-slotted.
 *
 * Authoring (davids-model D1: the player URL is default content, never a block cell):
 *   - in the SAME section, a default-content paragraph holding ONE link whose href is the
 *     embed src (https://www.youtube.com/embed/<id>?autoplay=1) and whose text is the
 *     player's accessible name ("Play video");
 *   - the block: one row per video holding the poster image.
 * decorate() reabsorbs those link paragraphs from its section (EW8: MOVED, in order — the
 * n-th link pairs with the n-th row) and turns each into the overlay; the link text is
 * visually hidden (live carries it only as aria-label). The emptied default-content
 * wrapper is removed.
 */

const EMBED = /(youtube\.com|youtu\.be|vimeo\.com|\/embed\/)/i;

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function mountPlayer(frame, src) {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = 'YouTube video player';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; '
    + 'picture-in-picture';
  iframe.allowFullscreen = true;
  frame.replaceChildren(iframe);
}

function sectionEmbeds(block) {
  const section = block.closest('.section');
  if (!section) return [];
  return [...section.querySelectorAll('.default-content-wrapper p')].filter((p) => {
    const links = p.querySelectorAll('a[href]');
    return links.length === 1 && EMBED.test(links[0].href)
      && p.textContent.trim() === links[0].textContent.trim();
  });
}

function buildVideo(nodes) {
  const col = slot('slv-col');
  const frame = slot('slv-frame');
  const poster = slot('slv-poster');
  const play = slot('slv-play');
  let link = null;
  nodes.forEach((el) => {
    const m = media(el);
    const a = el.matches('a') ? el : el.querySelector('a');
    if (m && !el.textContent.trim()) {
      if (!poster.children.length) poster.append(m.closest('picture') || m);
    } else if (a && !link) {
      link = a;
      play.append(el);
    } else {
      play.append(el);
    }
  });
  if (poster.children.length) frame.append(poster);
  frame.append(play);
  col.append(frame);
  if (link) {
    link.classList.remove('button');
    link.removeAttribute('title');
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', link.textContent.trim() || 'Play video');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      mountPlayer(frame, link.href);
    });
    link.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        mountPlayer(frame, link.href);
      }
    });
  }
  return col;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container > .slv-grid')) return; // EW9 re-entrant
  const grid = slot('slv-grid');
  const embeds = sectionEmbeds(block);
  const wrappers = new Set(embeds.map((p) => p.parentElement));
  [...block.children].forEach((row) => {
    const nodes = [...row.children].flatMap((cell) => [...cell.children]);
    if (embeds.length) nodes.push(embeds.shift());
    if (nodes.length) grid.append(buildVideo(nodes));
  });
  wrappers.forEach((w) => {
    if (!w.children.length && !w.textContent.trim()) w.remove();
  });
  const container = slot('container');
  container.append(grid);
  block.replaceChildren(container);
}
