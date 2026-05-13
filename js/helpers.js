// ========================
// Helpers
// ========================
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const clampIndex = (index, length) => (index % length + length) % length;

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setPressed(element, value) {
  if (element) {
    element.setAttribute("aria-pressed", String(value));
  }
}

function setExpanded(element, value) {
  if (element) {
    element.setAttribute("aria-expanded", String(value));
  }
}