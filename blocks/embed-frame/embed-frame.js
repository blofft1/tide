/**
 * embed-frame — a third-party app re-embedded in an iframe (tide.com /en-us/contact-us:
 * the P&G consumer-support care hub, dynamic-features row 11, pattern embed).
 * Authored: one cell holding a link to the embed URL (an optional title attribute
 * becomes the iframe title).
 * @ew-exempt the authored link is the embed's source; it is replaced by the iframe
 * it points to, as every EDS embed block does.
 * The frame box renders at once; its third-party source loads after the window load event
 * plus a short delay (EDS delayed phase: third-party code never competes with the page).
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope iframe')) return;
  const link = block.querySelector('a[href]');
  if (!link) return;
  const frame = document.createElement('iframe');
  const { href } = link;
  const start = () => setTimeout(() => { frame.src = href; }, 3000);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
  if (link.title) frame.title = link.title;
  frame.className = 'embed-frame-iframe';
  const host = document.createElement('div');
  host.className = 'embed-frame-inner';
  host.append(frame);
  block.replaceChildren(host);
}
