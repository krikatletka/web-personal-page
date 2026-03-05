// ===== utils =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function clampIndex(i, len) {
  return (i % len + len) % len;
}

// ===== year =====
$("#year").textContent = new Date().getFullYear();

// =====================================================
// THEME (pink/purple light) <-> (dark)
// + save in localStorage
// =====================================================
const THEME_KEY = "km_theme";
const themeBtn = $("#themeBtn");
const themeBtnText = $("#themeBtnText");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);
  themeBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
  themeBtnText.textContent = isDark ? "Light" : "Dark";
  localStorage.setItem(THEME_KEY, theme);
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

setTheme(getInitialTheme());

themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("theme-dark");
  setTheme(isDark ? "light" : "dark");
});

// =====================================================
// FAVORITES (render as cards)
// =====================================================
const favorites = [
  { title: "Game of Thrones", url: "https://www.imdb.com/title/tt0944947/", tag: "TV" },
  { title: "The Vampire Diaries", url: "https://www.imdb.com/title/tt1405406/", tag: "TV" },
  { title: "Stranger Things", url: "https://www.imdb.com/title/tt4574334/", tag: "TV" },
  { title: "Interstellar", url: "https://www.imdb.com/title/tt0816692/", tag: "Movie" },
  { title: "Forrest Gump", url: "https://www.imdb.com/title/tt0109830/", tag: "Movie" },
];

const favList = $("#favList");
favList.innerHTML = favorites.map((f, idx) => `
  <div class="favitem">
    <div>
      <strong>${idx + 1}. <a href="${f.url}" target="_blank" rel="noreferrer">${f.title}</a></strong>
    </div>
    <div class="favtag">${f.tag}</div>
  </div>
`).join("");

// =====================================================
// SEMESTERS (your data) — slider with dots
// Table is built via JS => no лагов/дубликатов
// =====================================================
const semesters = [
  {
    label: "Семестр 1",
    rows: [
      { name: "Алгоритмізація та програмування", teacher: "Сенько А.В. [КМПС]", score: 90, ects: "A" },
      { name: "Аналітична геометрія", teacher: "Морачковська І.О. [ПМ]", score: 100, ects: "A" },
      { name: "Історія та культура України", teacher: "Красіков М.М. [УКІН]", score: 100, ects: "A" },
      { name: "Математичний аналіз", teacher: "Лінник Г.Б. [ПМ]", score: 100, ects: "A" },
      { name: "Архітектура обчислювальних систем", teacher: "Водка О.О. [ММІОІ]", score: 97, ects: "A" },
      { name: "Вступ за спеціальністю. Ознайомча практика", teacher: "Шеліхова І.Б. [ГМКГ]", score: 99, ects: "A" },
      { name: "Іноземна мова", teacher: "Новицька Д.Є. [МКІМ]", score: 90, ects: "A" },
      { name: "Фізичне виховання", teacher: "Ширяєва С.В. [ФВ]", score: 100, ects: "A" },
    ],
  },
  {
    label: "Семестр 2",
    rows: [
      { name: "Дискретна математика", teacher: "Татарінова О.А. [КМПС]", score: 100, ects: "A" },
      { name: "Лінійна алгебра", teacher: "Морачковська І.О. [ПМ]", score: 100, ects: "A" },
      { name: "Об'єктно-орієнтоване програмування та проектування", teacher: "Розова Л.В. [ММІОІ]", score: 100, ects: "A" },
      { name: "Спеціальні глави вищої математики", teacher: "Лінник Г.Б. [ПМ]", score: 100, ects: "A" },
      { name: "Українська мова (професійного спрямування)", teacher: "Писарська Н.В. [УРМПЛ]", score: 95, ects: "A" },
      { name: "Іноземна мова", teacher: "Орда О.Ф. [МКІМ]", score: 100, ects: "A" },
      { name: "Операційні системи", teacher: "Метєльов В.О. [КМПС]", score: 100, ects: "A" },
      { name: "Фізичне виховання", teacher: "Ширяєва С.В. [ФВ]", score: 100, ects: "A" },
    ],
  },
  {
    label: "Семестр 3",
    rows: [
      { name: "Математична логіка, теорія алгоритмів та структури даних", teacher: "Татарінова О.А. [КМПС]", score: 100, ects: "A" },
      { name: "Нарисна геометрія в задачах візуалізації", teacher: "Федченко Г.В. [ГМКГ]", score: 96, ects: "A" },
      { name: "Організація баз даних", teacher: "Мартиненко Г.Ю. [ММІОІ]", score: 100, ects: "A" },
      { name: "Програмування GUI", teacher: "Дашкевич А.О. [ГМКГ]", score: 100, ects: "A" },
      { name: "Технології програмування", teacher: "Шаповалова М.І. [ММІОІ]", score: 97, ects: "A" },
      { name: "Іноземна мова", teacher: "Картун Н.О. [МКІМ]", score: 95, ects: "A" },
      { name: "ОК СВУ", teacher: "Ширяєва С.В. [ФВ]", score: 100, ects: "A" },
      { name: "Правознавство", teacher: "Кузьменко О.В. [П]", score: 100, ects: "A" },
    ],
  },
];

const semLabel = $("#semLabel");
const semPrev = $("#semPrev");
const semNext = $("#semNext");
const semDots = $("#semDots");
const studyBody = $("#studyBody");

let semIndex = 0;

function renderSemDots() {
  semDots.innerHTML = "";
  semesters.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dotbtn" + (i === semIndex ? " is-active" : "");
    b.setAttribute("aria-label", `Семестр ${i + 1}`);
    b.addEventListener("click", () => showSemester(i));
    semDots.appendChild(b);
  });
}

function renderTable(rows) {
  // super fast render
  studyBody.innerHTML = rows.map((r, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${r.name}</td>
      <td>${r.teacher}</td>
      <td>${r.score}</td>
      <td>${r.ects}</td>
    </tr>
  `).join("");
}

function showSemester(i) {
  semIndex = clampIndex(i, semesters.length);
  semLabel.textContent = semesters[semIndex].label;
  renderTable(semesters[semIndex].rows);

  // update dots active state
  $$(".dotbtn", semDots).forEach((d, k) => d.classList.toggle("is-active", k === semIndex));
}

semPrev.addEventListener("click", () => showSemester(semIndex - 1));
semNext.addEventListener("click", () => showSemester(semIndex + 1));

renderSemDots();
showSemester(0);

// =====================================================
// PHOTO SLIDER (loop, dots, auto, pause on hover)
// =====================================================
const slidePrev = $("#slidePrev");
const slideNext = $("#slideNext");
const slideDots = $("#slideDots");
const sliderViewport = $("#sliderViewport");
const slides = $$(".slide", sliderViewport);

let slideIndex = 0;
let slideTimer = null;

function renderSlideDots() {
  slideDots.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dotbtn" + (i === slideIndex ? " is-active" : "");
    b.setAttribute("aria-label", `Слайд ${i + 1}`);
    b.addEventListener("click", () => goSlide(i));
    slideDots.appendChild(b);
  });
}

function showSlide(i) {
  slideIndex = clampIndex(i, slides.length);
  slides.forEach((s, k) => s.classList.toggle("is-active", k === slideIndex));
  $$(".dotbtn", slideDots).forEach((d, k) => d.classList.toggle("is-active", k === slideIndex));
}

function nextSlide(){ showSlide(slideIndex + 1); }
function prevSlide(){ showSlide(slideIndex - 1); }
function goSlide(i){ showSlide(i); }

slidePrev.addEventListener("click", prevSlide);
slideNext.addEventListener("click", nextSlide);

function startAuto() {
  stopAuto();
  slideTimer = setInterval(nextSlide, 4500);
}
function stopAuto() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = null;
}

sliderViewport.addEventListener("mouseenter", stopAuto);
sliderViewport.addEventListener("mouseleave", startAuto);
sliderViewport.addEventListener("focusin", stopAuto);
sliderViewport.addEventListener("focusout", startAuto);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") { prevSlide(); }
  if (e.key === "ArrowRight") { nextSlide(); }
});

renderSlideDots();
showSlide(0);
startAuto();

// =====================================================
// Graceful image fallback (if img not found => hide broken)
// =====================================================
$$("img").forEach(img => {
  img.addEventListener("error", () => {
    // hide broken icon, keep pretty background
    img.style.opacity = "0";
  }, { once: true });
});