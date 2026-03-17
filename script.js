// ========================
// Helpers
// ========================
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function clampIndex(index, length) {
  return (index % length + length) % length;
}

// ========================
// Year
// ========================
const yearEl = $("#year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ========================
// Theme
// ========================
const THEME_KEY = "km_theme";
const themeBtn = $("#themeBtn");
const themeBtnText = $("#themeBtnText");

function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  if (themeBtn) {
    themeBtn.setAttribute("aria-pressed", String(isDark));
  }

  if (themeBtnText) {
    themeBtnText.textContent = isDark ? "Light" : "Dark";
  }

  localStorage.setItem(THEME_KEY, theme);
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

setTheme(getInitialTheme());

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("theme-dark");
    setTheme(isDark ? "light" : "dark");
  });
}

// ========================
// Semesters data
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
      { name: "Фізичне виховання", teacher: "Ширяєва С.В.", score: 100, ects: "A" }
    ]
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
      { name: "Фізичне виховання", teacher: "Ширяєва С.В.", score: 100, ects: "A" }
    ]
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
      { name: "Правознавство", teacher: "Кузьменко О.В.", score: 100, ects: "A" }
    ]
  }
];

// ========================
// Semesters slider
// ========================
const semPrev = $("#semPrev");
const semNext = $("#semNext");
const semLabel = $("#semLabel");
const semDots = $("#semDots");
const studyBody = $("#studyBody");

let semIndex = 0;

function renderTable(rows) {
  if (!studyBody) return;

  studyBody.innerHTML = rows.map((row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.name}</td>
      <td>${row.teacher}</td>
      <td>${row.score}</td>
      <td>${row.ects}</td>
    </tr>
  `).join("");
}

function renderSemDots() {
  if (!semDots) return;

  semDots.innerHTML = "";

  semesters.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dotbtn${index === semIndex ? " is-active" : ""}`;
    button.setAttribute("aria-label", `Семестр ${index + 1}`);
    button.addEventListener("click", () => showSemester(index));
    semDots.appendChild(button);
  });
}

function updateSemDots() {
  if (!semDots) return;

  $$(".dotbtn", semDots).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === semIndex);
  });
}

function showSemester(index) {
  semIndex = clampIndex(index, semesters.length);

  if (semLabel) {
    semLabel.textContent = semesters[semIndex].label;
  }

  renderTable(semesters[semIndex].rows);
  updateSemDots();
}

if (semPrev) {
  semPrev.addEventListener("click", () => showSemester(semIndex - 1));
}

if (semNext) {
  semNext.addEventListener("click", () => showSemester(semIndex + 1));
}

if (studyBody && semLabel && semDots) {
  renderSemDots();
  showSemester(0);
}

// ========================
// Photo slider
// ========================
const sliderViewport = $("#sliderViewport");
const slides = sliderViewport ? $$(".slide", sliderViewport) : [];
const slidePrev = $("#slidePrev");
const slideNext = $("#slideNext");
const slideDots = $("#slideDots");

let slideIndex = 0;

function renderSlideDots() {
  if (!slideDots || !slides.length) return;

  slideDots.innerHTML = "";

  slides.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dotbtn${index === slideIndex ? " is-active" : ""}`;
    button.setAttribute("aria-label", `Слайд ${index + 1}`);
    button.addEventListener("click", () => showSlide(index));
    slideDots.appendChild(button);
  });
}

function updateSlideDots() {
  if (!slideDots) return;

  $$(".dotbtn", slideDots).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === slideIndex);
  });
}

function showSlide(index) {
  if (!slides.length) return;

  slideIndex = clampIndex(index, slides.length);

  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === slideIndex);
  });

  updateSlideDots();
}

function nextSlide() {
  showSlide(slideIndex + 1);
}

function prevSlide() {
  showSlide(slideIndex - 1);
}

if (slidePrev) {
  slidePrev.addEventListener("click", prevSlide);
}

if (slideNext) {
  slideNext.addEventListener("click", nextSlide);
}

document.addEventListener("keydown", (event) => {
  if (!slides.length) return;

  if (event.key === "ArrowLeft") {
    prevSlide();
  }

  if (event.key === "ArrowRight") {
    nextSlide();
  }
});

if (slides.length && slideDots) {
  renderSlideDots();
  showSlide(0);
}

// ========================
// Reveal on scroll
// ========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, {
  threshold: 0.18
});

function observeRevealElements(root = document) {
  $$(".reveal", root).forEach((item) => {
    revealObserver.observe(item);
  });
}

observeRevealElements();

// ========================
// Favorites + Modal
// ========================
const favorites = [
  {
    id: "got",
    title: "Game of Thrones",
    url: "https://www.imdb.com/title/tt0944947/",
    tag: "TV Series",
    cover: "img/shows/got-cover.jpg",
    previewVideo: "video/shows/got-preview.MP4",
    short: "Атмосферний серіал із сильними персонажами, масштабною історією та красивою візуальною подачею.",
    description: "Мені подобається масштаб цього серіалу, його атмосфера, складні персонажі та відчуття великої історії, де постійно щось відбувається.",
    why: "Особливо люблю атмосферу, напругу, красиві сцени і те, як сюжет постійно тримає увагу.",
    images: ["img/shows/got1.jpg", "img/shows/got2.jpg", "img/shows/got3.jpg"]
  },
  {
    id: "st",
    title: "Stranger Things",
    url: "https://www.imdb.com/title/tt4574334/",
    tag: "TV Series",
    cover: "img/shows/st-cover.jpg",
    previewVideo: "video/shows/st-preview.MP4",
    short: "Люблю цей серіал за настрій, дружбу між героями, музику і трохи містичну атмосферу.",
    description: "Цей серіал мені подобається через поєднання фантастики, атмосфери 80-х, емоційних моментів і харизматичних персонажів.",
    why: "Для мене він дуже атмосферний, стильний і водночас затишний, незважаючи на напругу сюжету.",
    images: ["img/shows/st1.jpg", "img/shows/st2.jpg", "img/shows/st3.jpg"]
  },
  {
    id: "tvd",
    title: "The Vampire Diaries",
    url: "https://www.imdb.com/title/tt1405406/",
    tag: "TV Series",
    cover: "img/shows/tvd-cover.jpg",
    previewVideo: "video/shows/tvd-preview.mp4",
    short: "Подобається романтична атмосфера, драматичність і сама естетика серіалу.",
    description: "Мені подобається цей серіал через його емоційність, красиву подачу, персонажів і поєднання романтики, драми та містики.",
    why: "Особливо люблю атмосферу, стиль кадрів і те, як серіал легко викликає емоції.",
    images: ["img/shows/tvd1.jpg", "img/shows/tvd2.jpg", "img/shows/tvd3.jpg"]
  },
  {
    id: "hp",
    title: "Harry Potter",
    url: "https://www.imdb.com/find/?q=Harry%20Potter",
    tag: "Movie Series",
    cover: "img/shows/hp-cover.jpg",
    previewVideo: "video/shows/hp-preview.MP4",
    short: "Це історія, яку люблю за магічний світ, атмосферу навчання і відчуття затишку.",
    description: "Мені подобається світ Гаррі Поттера, тому що він дуже атмосферний, впізнаваний і в ньому хочеться залишитися довше.",
    why: "Найбільше люблю магічну естетику, шкільну атмосферу і сам настрій цієї історії.",
    images: ["img/shows/hp1.jpg", "img/shows/hp2.jpg", "img/shows/hp3.jpg"]
  },
  {
    id: "pb",
    title: "Peaky Blinders",
    url: "https://www.imdb.com/title/tt2442560/",
    tag: "TV Series",
    cover: "img/shows/pb-cover.jpg",
    previewVideo: "video/shows/pb-preview.MP4",
    short: "Сильний стиль, дуже харизматичні персонажі та особлива атмосфера.",
    description: "Мені подобається цей серіал за його візуальний стиль, характер персонажів, музику і сильну подачу.",
    why: "Особливо люблю його за естетику, впевненість героїв і дуже виразний настрій кожної сцени.",
    images: ["img/shows/pb1.jpg", "img/shows/pb2.jpg", "img/shows/pb3.jpg"]
  }
];

const favList = $("#favList");

function closeModal(modal) {
  if (!modal) return;
  modal.remove();
  document.body.classList.remove("modal-open");
}

function openModal(item) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal__backdrop" data-close="1"></div>
    <div class="modal__card" role="dialog" aria-modal="true" aria-label="${item.title}">
      <button class="modal__close" type="button" aria-label="Close" data-close="1">✕</button>

      <div class="modal__head">
        <div>
          <div class="movieCard__tag">${item.tag}</div>
          <h3 class="modal__title">${item.title}</h3>
          <p class="modal__desc">${item.description}</p>
        </div>
      </div>

      <div class="modal__why">
        <strong>Чому мені подобається:</strong>
        <p>${item.why}</p>
      </div>

      <div class="modal__grid">
        ${item.images.map((src) => `
          <div class="modal__img">
            <img src="${src}" alt="${item.title}" loading="lazy">
          </div>
        `).join("")}
      </div>

      <div class="modal__actions">
        <a class="btn" href="${item.url}" target="_blank" rel="noreferrer">Open link</a>
        <button class="btn btn--ghost" type="button" data-close="1">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add("modal-open");

  function handleEsc(event) {
    if (event.key === "Escape") {
      closeModal(modal);
      document.removeEventListener("keydown", handleEsc);
    }
  }

  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.close) {
      closeModal(modal);
      document.removeEventListener("keydown", handleEsc);
    }
  });

  document.addEventListener("keydown", handleEsc);
}

function tryPlayMovieVideos(root = document) {
  const videos = $$(".movieCard__video", root);

  videos.forEach((video) => {
    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => {
        console.log("Video play error:", video.currentSrc || video.querySelector("source")?.src, error);
      });
    }
  });
}

function renderFavorites() {
  if (!favList) return;

  favList.innerHTML = favorites.map((item, index) => `
    <button
      class="movieCard ${index % 3 === 0 ? "movieCard--large" : "movieCard--small"} reveal"
      type="button"
      data-open="${item.id}"
    >
      <div class="movieCard__media">
        <video
          class="movieCard__video"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="${item.cover}"
        >
          <source src="${item.previewVideo}" type="video/mp4">
        </video>
        <div class="movieCard__overlay"></div>
      </div>

      <div class="movieCard__content">
        <span class="movieCard__tag">${item.tag}</span>
        <h3>${item.title}</h3>
        <p>${item.short}</p>
      </div>
    </button>
  `).join("");

  favList.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-open");
      const item = favorites.find((fav) => fav.id === id);

      if (item) {
        openModal(item);
      }
    });
  });

  observeRevealElements(favList);
  tryPlayMovieVideos(favList);
}

renderFavorites();

// ========================
// Image fallback
// ========================
$$("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.opacity = "0";
  }, { once: true });
});
const burgerBtn = document.getElementById("burgerBtn");
const siteNav = document.getElementById("siteNav");

if (burgerBtn && siteNav) {
  burgerBtn.addEventListener("click", () => {
    siteNav.classList.toggle("is-open");

    const isOpen = siteNav.classList.contains("is-open");
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}