/**
 * browse-tiles — "Find the right Tide product for you": a heading over N tiles; each tile opens
 * a modal listing its links (live: ModalCard, modalType allProductTypes / allProductNeeds).
 * Schema: stardust/eds-schema/en-us.json (section finder). Decode tier: reconstructive
 * (repeat group: one tile per row).
 *
 * Authoring:
 *   1. optional head row: the section heading (<h2>, <strong> for the heavy part)
 *   2..n. one row per tile: title (<h3>) + subtitle <p> | image | optional link list (<ul>)
 *      shown in the tile's modal. A tile without a list and with one link navigates instead.
 */

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
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

let modalCount = 0;

// The dialog (and its close control) is built on first open; at rest the authored list waits,
// hidden, inside the tile's item (live mounts its modal outside main on click).
function openModal(item, listBox, title) {
  let dialog = item.querySelector('.bt-modal');
  if (!dialog) {
    modalCount += 1;
    dialog = document.createElement('dialog');
    dialog.className = 'bt-modal';
    if (title) {
      if (!title.id) title.id = `browse-tiles-title-${modalCount}`;
      dialog.setAttribute('aria-labelledby', title.id);
    }
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'bt-modal-close';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
    listBox.hidden = false;
    dialog.append(close, listBox);
    item.append(dialog);
  }
  dialog.showModal();
}

function buildTile(nodes) {
  const item = document.createElement('div');
  item.className = 'bt-item';
  const tile = document.createElement('div');
  tile.className = 'bt-tile';
  const list = nodes.find((el) => el.matches('ul, ol'));
  const heading = nodes.find(isHeading);
  let pic = null;
  nodes.forEach((el) => {
    if (el === list) return;
    if (media(el) && !el.textContent.trim()) {
      pic = media(el).closest('picture') || media(el);
      return;
    }
    tile.append(wrapNode(el, isHeading(el) ? 'bt-title' : 'bt-text'));
  });
  if (pic) tile.append(wrapNode(pic, 'bt-media'));
  item.append(tile);

  const link = !list && tile.querySelector('a[href]');
  if (!list && !link) return item;
  tile.setAttribute('role', 'button');
  tile.tabIndex = 0;
  tile.setAttribute('aria-pressed', 'false');
  let listBox = null;
  if (list) {
    listBox = wrapNode(list, 'bt-modal-list');
    listBox.hidden = true;
    item.append(listBox);
  }
  const open = () => {
    if (listBox) openModal(item, listBox, heading);
    else window.location.href = link.href;
  };
  tile.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    open();
  });
  tile.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    open();
  });
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = document.createElement('div');
  head.className = 'bt-head';
  const grid = document.createElement('div');
  grid.className = 'bt-grid';

  rows.forEach((row) => {
    const nodes = [...row.children].flatMap(cellNodes);
    if (nodes.some(media) || nodes.some((el) => el.tagName === 'H3')) {
      grid.append(buildTile(nodes));
    } else {
      nodes.forEach((el) => head.append(wrapNode(el, isHeading(el) ? 'bt-heading' : 'bt-intro')));
    }
  });

  const container = document.createElement('div');
  container.className = 'container';
  if (head.children.length) container.append(head);
  container.append(grid);
  block.replaceChildren(container);
}
