/**
 * faq-accordion — collapsible question/answer list (live .expandable-content FAQ).
 *
 * Authored shape: one row per item — cell 1 the question (text or heading), cell 2 the
 * answer (paragraphs, lists, links). Rows are classified by shape, not index: a one-cell row
 * whose content is a heading opens a new item and the following one-cell rows are its answer.
 * The authored cells MOVE into the item; the whole question row (div[role=button], as live)
 * toggles; the chevron is a presentational svg.
 */

const CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10"'
  + ' aria-hidden="true" focusable="false"><path d="M8.571,17a1.431,1.431,0,0,1-1.01-.415L.419,'
  + '9.5a1.407,1.407,0,0,1,0-2L7.561.415a1.435,1.435,0,0,1,2.02,0,1.407,1.407,0,0,1,0,2L3.449,'
  + '8.5l6.132,6.082a1.407,1.407,0,0,1,0,2A1.431,1.431,0,0,1,8.571,17" transform="translate(0 10)'
  + ' rotate(-90)"/></svg>';

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function groupRows(block) {
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      items.push({ q: cells[0], a: cells.slice(1) });
    } else if (cells.length === 1) {
      const cell = cells[0];
      const lead = cell.firstElementChild;
      const opens = !items.length || (lead && lead.matches('h2, h3, h4, h5, h6')
        && cell.children.length === 1);
      if (opens) items.push({ q: cell, a: [] });
      else items[items.length - 1].a.push(cell);
    }
  });
  return items;
}

export default function decorate(block) {
  const items = groupRows(block);
  const container = document.createElement('div');
  container.className = 'container';
  const list = document.createElement('div');
  list.className = 'faq-accordion-list';
  container.append(list);

  const used = new Set();
  items.forEach(({ q, a }, i) => {
    const item = document.createElement('div');
    item.className = 'faq-accordion-item';
    let id = slug(q.textContent) || `faq-${i + 1}`;
    while (used.has(id) || document.getElementById(id)) id = `${id}-${i + 1}`;
    used.add(id);
    item.id = id;

    // live: div.faq__q[role=button] holding the question text + chevron. The row is a div
    // (EW7: authored text never sits inside a <button>/<summary>).
    const head = document.createElement('div');
    head.className = 'faq-accordion-question';
    head.setAttribute('role', 'button');
    head.tabIndex = 0;
    head.setAttribute('aria-expanded', 'false');
    head.setAttribute('aria-controls', `${id}-content`);
    head.setAttribute('aria-label', q.textContent.trim());
    q.className = 'faq-accordion-title';
    const icon = document.createElement('span');
    icon.innerHTML = CHEVRON;
    head.append(q, icon.firstElementChild);

    const answer = document.createElement('div');
    answer.className = 'faq-accordion-answer';
    answer.id = `${id}-content`;
    answer.setAttribute('aria-hidden', 'true');
    a.forEach((cell) => {
      cell.className = 'faq-accordion-answer-body';
      answer.append(cell);
    });

    const setOpen = (on) => {
      item.classList.toggle('is-open', on);
      head.setAttribute('aria-expanded', String(on));
      answer.setAttribute('aria-hidden', String(!on));
    };
    const toggle = () => setOpen(!item.classList.contains('is-open'));
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    item.append(head, answer);
    list.append(item);
  });
  block.replaceChildren(container);
}
