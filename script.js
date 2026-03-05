// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Theme (light/dark) + save =====
const themeBtn = document.getElementById("themeBtn");
const THEME_KEY = "km-theme";

function setTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  document.body.classList.toggle("theme-light", theme === "light");
  themeBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  localStorage.setItem(THEME_KEY, theme);
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  // fallback: system preference
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

setTheme(getInitialTheme());

themeBtn.addEventListener("click", () => {
  const current = document.body.classList.contains("theme-dark") ? "dark" : "light";
  setTheme(current === "dark" ? "light" : "dark");
});

// ===== Slider =====
const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("dots");
const viewport = document.getElementById("sliderViewport");

let index = 0;
let timer = null;

function renderDots() {
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dotbtn" + (i === index ? " is-active" : "");
    b.setAttribute("aria-label", `Перейти до слайда ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });
}

function show(i) {
  slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
  index = i;
  // update dots
  const dotBtns = Array.from(dotsWrap.querySelectorAll(".dotbtn"));
  dotBtns.forEach((d, k) => d.classList.toggle("is-active", k === index));
}

function next() {
  const i = (index + 1) % slides.length;
  show(i);
}
function prev() {
  const i = (index - 1 + slides.length) % slides.length;
  show(i);
}
function goTo(i) {
  show(i);
}

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

function startAuto() {
  stopAuto();
  timer = setInterval(next, 5000);
}
function stopAuto() {
  if (timer) clearInterval(timer);
  timer = null;
}

// pause on hover/focus
viewport.addEventListener("mouseenter", stopAuto);
viewport.addEventListener("mouseleave", startAuto);
viewport.addEventListener("focusin", stopAuto);
viewport.addEventListener("focusout", startAuto);

// init
renderDots();
show(0);
startAuto();

// keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});