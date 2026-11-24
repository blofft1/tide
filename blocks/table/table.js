/**
 * table — data table authored as a block (DA turns a bare <table> into a block anyway).
 *
 * Authored shape: one row per table row, one cell per column. Every row renders as a body
 * row (the live article tables carry no <thead>; the first row is styled by its own marks).
 * Variant `header` promotes the first row to <thead>. Cell content MOVES into the <td>/<th>.
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  const rows = [...block.children];
  if (block.classList.contains('header') && rows.length) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    [...rows.shift().children].forEach((cell) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.append(...cell.childNodes);
      tr.append(th);
    });
    thead.append(tr);
    table.append(thead);
  }
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement('td');
      td.append(...cell.childNodes);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  const scroller = document.createElement('div');
  scroller.className = 'table-scroller';
  scroller.append(table);
  const container = document.createElement('div');
  container.className = 'container';
  container.append(scroller);
  block.replaceChildren(container);
}
