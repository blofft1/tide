/**
 * article-guide — the full-width scrolling step guide of an article (live
 * .guide-wrapper-list-full: a navy progress rail with one dot per step, each step an
 * uppercase orange label + rich text). Decode tier: reconstructive (one row per step).
 * The narrow guide (.guide-wrapper-list-narrow) is the existing step-timeline block.
 *
 * Authored shape: one row per step — cell 1 = step label (live .guide-step-number),
 * cell 2 = step text (rich text).
 */

function make(tag, className) {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

export default function decorate(block) {
  const steps = make('div', 'article-guide-steps');
  [...block.children].forEach((row) => {
    const [labelCell, textCell] = [...row.children];
    if (!labelCell) return;
    const step = make('div', 'article-guide-step');
    const mark = make('span', 'article-guide-mark');
    mark.setAttribute('aria-hidden', 'true');
    const label = make('div', 'article-guide-label');
    label.append(...labelCell.childNodes);
    step.append(mark, label);
    if (textCell) {
      const text = make('div', 'article-guide-text');
      text.append(...textCell.childNodes);
      step.append(text);
    }
    steps.append(step);
  });
  const container = make('div', 'container');
  container.append(steps);
  block.replaceChildren(container);
}
