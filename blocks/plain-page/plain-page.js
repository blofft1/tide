/**
 * plain-page — a source page served without any site chrome or stylesheet
 * (tide.com /health-probe: a bare HTML document). The authored nodes stay in
 * place; the block only marks the page so its CSS can drop the chrome and
 * restore the browser's default rendering.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  document.body.classList.add('plain-page');
  block.closest('.section')?.classList.add('plain-page-section');
}
