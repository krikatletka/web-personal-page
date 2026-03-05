// ========================
// Helpers
// ========================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clampIndex = (i, len) => (i % len + len) % len;

// ========================
// Year
// ========================
$("#year").textContent = new Date().getFullYear();

// ========================
// Theme: light (pink/purple) <-> dark (black)
// ========================
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

// ========================
// Semesters data (можно потом править)
// ========================
const semesters = [
  {
    label: "Семестр 1",
    rows: [
      { name: "Алгоритмізація та програмування", teacher: "Сенько А.В.", score: 90, ects: "A" },
      { name: "Аналітична геометрія", teacher: "Морачковська І.О.", score: 100, ects: "A" },
      { name: "Історія та культура України", teacher: "Красіков М.М.", score: 100, ects: "A" },
      { name: "Математичний аналіз", teacher: "Лінник Г.Б.", score: 100, ects: "A" },
      { name: "Архітектура обчислювальних систем", teacher: "Водка О.О.", score: 97, ects: "A" },
      { name: "Ознайомча практика", teacher: "Шеліхова І.Б.", score: 99, ects: "A" },
      { name: "Іноземна мова", teacher: "Новицька Д.Є.", score: 90, ects: "A" },
      { name: "Фізичне виховання", teacher: "Ширяєва С.В.", score: 100, ects: "A" },
    ],
  },
  {
    label: "Семестр 2",
    rows: [
      { name: "Дискретна математика", teacher: "Татарінова О.А.", score: 100, ects: "A" },
      { name: "Лінійна алгебра", teacher: "Морачковська І.О.", score: 100, ects: "A" },
      { name: "ООП та проектування", teacher: "Розова Л.В.", score: 100, ects: "A" },
      { name: "Спеціальні глави вищої математики", teacher: "Лінник Г.Б.", score: 100, ects: "A" },
      { name: "Українська мова (проф.)", teacher: "Писарська Н.В.", score: 95, ects: "A" },
      { name: "Іноземна мова", teacher: "Орда О.Ф.", score: 100, ects: "A" },
      { name: "Операційні системи", teacher: "Метєльов В.О.", score: 100, ects: "A" },
      { name: "Фізичне виховання", teacher: "Ширяєва С.В.", score: 100, ects: "A" },
    ],
  },
  {
    label: "Семестр 3",
    rows: [
      { name: "Логіка, теорія алгоритмів і структури даних", teacher: "Татарінова О.А.", score: 100, ects: "A" },
      { name: "Нарисна геометрія (візуалізація)", teacher: "Федченко Г.В.", score: 96, ects: "A" },
      { name: "Організація баз даних", teacher: "Мартиненко Г.Ю.", score: 100, ects: "A" },
      { name: "Програмування GUI", teacher: "Дашкевич А.О.", score: 100, ects: "A" },
      { name: "Технології програмування", teacher: "Шаповалова М.І.", score: 97, ects: "A" },
      { name: "Іноземна мова", teacher: "Картун Н.О.", score: 95, ects: "A" },
      { name: "Фізичне виховання", teacher: "Ширяєва С.В.", score: 100, ects: "A" },
      { name: "Правознавство", teacher: "Кузьменко О.В.", score: 100, ects: "A" },
    ],
  },
];

// ========================
// Semesters slider (dots + arrows)
// ========================
const semPrev = $("#semPrev");
const semNext = $("#semNext");
const semLabel = $("#semLabel");
const semDots = $("#semDots");
const studyBody = $("#studyBody");
const tableWrap = $("#tableWrap");

let semIndex = 0;

function renderTable(rows) {
  studyBody.innerHTML = rows
    .map(
      (r, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${r.name}</td>
        <td>${r.teacher}</td>
        <td>${r.score}</td>
        <td>${r.ects}</td>
      </tr>
    `
    )
    .join("");
}

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

function flashTable() {
  tableWrap.style.boxShadow = "0 0 0 3px rgba(255,79,179,.25)";
  setTimeout(() => (tableWrap.style.boxShadow = ""), 220);
}

function showSemester(i) {
  semIndex = clampIndex(i, semesters.length);
  semLabel.textContent = semesters[semIndex].label;
  renderTable(semesters[semIndex].rows);

  $$(".dotbtn", semDots).forEach((d, k) => d.classList.toggle("is-active", k === semIndex));
  flashTable();
}

semPrev.addEventListener("click", () => showSemester(semIndex - 1));
semNext.addEventListener("click", () => showSemester(semIndex + 1));

renderSemDots();
showSemester(0);

// ========================
// Photo slider
// ========================
const sliderViewport = $("#sliderViewport");
const slides = $$(".slide", sliderViewport);
const slidePrev = $("#slidePrev");
const slideNext = $("#slideNext");
const slideDots = $("#slideDots");

let slideIndex = 0;
let timer = null;

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

function nextSlide() {
  showSlide(slideIndex + 1);
}
function prevSlide() {
  showSlide(slideIndex - 1);
}
function goSlide(i) {
  showSlide(i);
}

slidePrev.addEventListener("click", prevSlide);
slideNext.addEventListener("click", nextSlide);

function startAuto() {
  stopAuto();
  timer = setInterval(nextSlide, 4500);
}
function stopAuto() {
  if (timer) clearInterval(timer);
  timer = null;
}

sliderViewport.addEventListener("mouseenter", stopAuto);
sliderViewport.addEventListener("mouseleave", startAuto);
sliderViewport.addEventListener("focusin", stopAuto);
sliderViewport.addEventListener("focusout", startAuto);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

renderSlideDots();
showSlide(0);
startAuto();

// ========================
// Favorites + Modal (click card -> popup with 3 screenshots + link)
// ========================
const favorites = [
  { id: "got", title: "Game of Thrones", url: "https://www.imdb.com/title/tt0944947/", tag: "TV", images: ["img/shows/got1.jpg","img/shows/got2.jpg","img/shows/got3.jpg"] },
  { id: "st", title: "Stranger Things", url: "https://www.imdb.com/title/tt4574334/", tag: "TV", images: ["img/shows/st1.jpg","img/shows/st2.jpg","img/shows/st3.jpg"] },
  { id: "tvd", title: "The Vampire Diaries", url: "https://www.imdb.com/title/tt1405406/", tag: "TV", images: ["img/shows/tvd1.jpg","img/shows/tvd2.jpg","img/shows/tvd3.jpg"] },
  { id: "hp", title: "Harry Potter", url: "https://www.imdb.com/find/?q=Harry%20Potter", tag: "Movie", images: ["img/shows/hp1.jpg","img/shows/hp2.jpg","img/shows/hp3.jpg"] },
  // 5-й временный — потом заменишь, просто поменяй title/url и имена картинок
  { id: "x", title: "Peaky Blinders", url: "https://www.imdb.com/title/tt2442560/", tag: "TV", images: ["img/shows/x1.jpg","img/shows/x2.jpg","img/shows/x3.jpg"] },
];

const favList = $("#favList");

favList.innerHTML = favorites
  .map(
    (f, idx) => `
    <button class="favitem" type="button" data-open="${f.id}">
      <div>
        <strong>${idx + 1}. ${f.title}</strong>
        <div class="muted tiny">Натисни, щоб відкрити (скріни + лінк)</div>
      </div>
      <div class="favtag">${f.tag}</div>
    </button>
  `
  )
  .join("");

function openModal(item) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal__backdrop" data-close="1"></div>
    <div class="modal__card" role="dialog" aria-modal="true" aria-label="${item.title}">
      <button class="modal__close" type="button" aria-label="Close" data-close="1">✕</button>

      <div class="modal__head">
        <h3 class="modal__title">${item.title}</h3>
        <span class="favtag">${item.tag}</span>
      </div>

      <div class="modal__grid">
        ${item.images.map(src => `
          <div class="modal__img">
            <img src="${src}" alt="${item.title}" loading="lazy">
          </div>
        `).join("")}
      </div>

      <div class="modal__actions">
        <a class="btn" href="${item.url}" target="_blank" rel="noreferrer">Open link</a>
        <button class="btn btn--ghost" type="button" data-close="1">Close</button>
      </div>

      <p class="muted tiny">Якщо картинок ще немає — додай їх у <code>img/shows</code>.</p>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();

  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) close();
  });

  const esc = (e) => {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", esc);
    }
  };
  document.addEventListener("keydown", esc);
}

favList.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-open");
    const item = favorites.find((f) => f.id === id);
    if (item) openModal(item);
  });
});

// ========================
// Image fallback (если файла нет — убираем "битую" иконку)
// ========================
$$("img").forEach((img) => {
  img.addEventListener(
    "error",
    () => {
      img.style.opacity = "0";
    },
    { once: true }
  );
});