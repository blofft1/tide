/**
 * collection-anchor — an in-page jump target (live span.anchor-target#overview /
 * #browse-collection) placed right before the section the jump-links bar scrolls to.
 * Decode tier: template-slotted (no visible output).
 *
 * Authoring: one cell with the target's label, e.g. "Browse Collection" — the same words as
 * the jump-links item. The block gets the id "browse-collection" (so /page#browse-collection
 * lands here) and the jump-links item with that label scrolls to it.
 *
 * @ew-exempt the label is a setting (the anchor name), not page copy: it stays in the DOM
 *   (hidden) so the author can edit it.
 */

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// jump-links resolves its items against headings only; until it also resolves element ids
// (foundation request filed), the matching item scrolls here (same offset as jump-links).
function bridge(block) {
  document.querySelectorAll('.jump-links li').forEach((li) => {
    if (li.dataset.anchor || slug(li.textContent) !== block.id) return;
    li.dataset.anchor = block.id;
    li.addEventListener('click', () => {
      const bar = li.closest('.jump-links');
      const y = block.getBoundingClientRect().top + window.scrollY - bar.offsetHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

export default function decorate(block) {
  const id = slug(block.textContent);
  if (id && !document.getElementById(id)) block.id = id;
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.hidden = true;
  });
  if (block.id) bridge(block);
}
