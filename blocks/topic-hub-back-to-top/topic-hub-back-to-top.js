/**
 * topic-hub-back-to-top — the round "Back to Top" control closing a topic hub (live
 * .scroll-to-top-wrapper): an up-chevron control that scrolls the window to the top; its
 * label shows from 992px.
 * Decode tier: template-slotted. Authored shape: one cell with the label
 * (`<p>Back to Top</p>`); the authored paragraph MOVES into the control (role button).
 */

const CHEVRON = 'M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,9.5a1.407,1.407,0,0,1,0-2L7.561.415'
  + 'a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,8.5l6.132,6.082a1.407,1.407,0,0,1,0,2'
  + 'A1.431,1.431,0,0,1,8.571,17';

function glyph() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 17 10');
  svg.setAttribute('width', '17');
  svg.setAttribute('height', '10');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', CHEVRON);
  path.setAttribute('transform', 'translate(0 10) rotate(-90)');
  svg.append(path);
  return svg;
}

export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  let label = cell.querySelector('p');
  if (!label && cell.textContent.trim()) {
    // bare-text cell (the pipeline unwraps single-paragraph cells)
    label = document.createElement('p');
    label.append(...cell.childNodes);
  }
  const control = document.createElement('div');
  control.className = 'topic-hub-back-to-top-btn';
  control.setAttribute('role', 'button');
  control.tabIndex = 0;
  if (label) {
    label.classList.add('topic-hub-back-to-top-label');
    control.setAttribute('aria-label', label.textContent.trim());
  }
  control.append(glyph(), ...(label ? [label] : []));
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  control.addEventListener('click', top);
  control.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      top();
    }
  });
  block.replaceChildren(control);
}
