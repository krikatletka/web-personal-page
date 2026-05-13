
//  поточний рік 
function initYear() {
  setText($("#year"), new Date().getFullYear());
}

// ========================
// Theme
// ========================
// Ключ для збереження теми в localStorage
const THEME_KEY = "km_theme";

// Застосовує вибрану тему до сторінки
function applyTheme(theme) {
  const themeBtn = $("#themeBtn");
  const themeBtnText = $("#themeBtnText");
  const isDark = theme === "dark";

  // Перемикаємо CSS-класи теми
  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  // Оновлюємо стан кнопки і текст
  setPressed(themeBtn, isDark);
  setText(themeBtnText, isDark ? "Light" : "Dark");

  // Зберігаємо тему в пам’яті браузера
  localStorage.setItem(THEME_KEY, theme);
}

// Повертає тему при завантаженні сторінки
function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  // Якщо тема вже була збережена, використовуємо її
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  // Інакше беремо тему системи користувача
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Ініціалізує тему і додає обробник на кнопку перемикання
function initTheme() {
  const themeBtn = $("#themeBtn");

  applyTheme(getInitialTheme());

  themeBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.contains("theme-dark");
    applyTheme(isDark ? "light" : "dark");
  });
}

// ========================
// Dots helper
// ========================
// Створює кнопки-точки для перемикання слайдів
function renderDots(container, items, activeIndex, ariaLabelPrefix, onClick) {
  if (!container) return;

  container.innerHTML = "";

  items.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dotbtn${index === activeIndex ? " is-active" : ""}`;
    button.setAttribute("aria-label", `${ariaLabelPrefix} ${index + 1}`);
    button.addEventListener("click", () => onClick(index));
    container.appendChild(button);
  });
}

// Оновлює активну точку
function updateDots(container, activeIndex) {
  if (!container) return;

  $$(".dotbtn", container).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
  });
}

// ========================
// Semesters slider  1
// ========================
// Індекс поточного семестру
let semIndex = 0;

// Заповнює таблицю предметами вибраного семестру
function renderTable(rows) {
  const studyBody = $("#studyBody");
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

// Показує вибраний семестр
function showSemester(index) {
  const semLabel = $("#semLabel");
  const semDots = $("#semDots");

  semIndex = clampIndex(index, semesters.length);
  const semester = semesters[semIndex];

  setText(semLabel, semester.label);
  renderTable(semester.rows);
  updateDots(semDots, semIndex);
}

// Ініціалізує слайдер семестрів
function initSemesters() {
  const semPrev = $("#semPrev");
  const semNext = $("#semNext");
  const semLabel = $("#semLabel");
  const semDots = $("#semDots");
  const studyBody = $("#studyBody");

  if (!studyBody || !semLabel || !semDots) return;

  renderDots(semDots, semesters, semIndex, "Семестр", showSemester);
  showSemester(0);

  semPrev?.addEventListener("click", () => showSemester(semIndex - 1));
  semNext?.addEventListener("click", () => showSemester(semIndex + 1));
}

// ========================
// Photo slider
// ========================
// Індекс поточного фото
let slideIndex = 0;

// Повертає всі слайди
function getSlides() {
  const sliderViewport = $("#sliderViewport");
  return sliderViewport ? $$(".slide", sliderViewport) : [];
}

// Показує один активний слайд
function showSlide(index) {
  const slides = getSlides();
  const slideDots = $("#slideDots");

  if (!slides.length) return;

  slideIndex = clampIndex(index, slides.length);

  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === slideIndex);
  });

  updateDots(slideDots, slideIndex);
}

// Перемикає на наступний слайд
function nextSlide() {
  showSlide(slideIndex + 1);
}

// Перемикає на попередній слайд
function prevSlide() {
  showSlide(slideIndex - 1);
}

// Ініціалізує фото-слайдер
function initSlider() {
  const slides = getSlides();
  const slidePrev = $("#slidePrev");
  const slideNext = $("#slideNext");
  const slideDots = $("#slideDots");

  if (!slides.length || !slideDots) return;

  renderDots(slideDots, slides, slideIndex, "Слайд", showSlide);
  showSlide(0);

  slidePrev?.addEventListener("click", prevSlide);
  slideNext?.addEventListener("click", nextSlide);
}

// ========================
// Reveal on scroll 1_
// ========================
// Observer відстежує появу елементів у зоні видимості
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.18 });

// Підключає анімацію появи для елементів
function observeRevealElements(root = document) {
  $$(".reveal", root).forEach((element) => {
    revealObserver.observe(element);
  });
}

// ========================
// Favorites + Modal   2
// ========================
// Закриває модальне вікно
function closeModal(modal, handleEsc) {
  modal?.remove();
  document.body.classList.remove("modal-open");

  if (handleEsc) {
    document.removeEventListener("keydown", handleEsc);
  }
}

// Створює HTML-розмітку модального вікна
function createModalMarkup(item) {
  return `
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
}

// Відкриває модальне вікно з інформацією про картку
function openModal(item) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = createModalMarkup(item);

  const handleEsc = (event) => {
    if (event.key === "Escape") {
      closeModal(modal, handleEsc);
    }
  };

  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.close) {
      closeModal(modal, handleEsc);
    }
  });

  document.body.appendChild(modal);
  document.body.classList.add("modal-open");
  document.addEventListener("keydown", handleEsc);
}

// Намагається автоматично запустити відео на картках
function tryPlayMovieVideos(root = document) {
  $$(".movieCard__video", root).forEach((video) => {
    const playPromise = video.play();

    if (playPromise?.catch) {
      playPromise.catch((error) => {
        console.log("Video play error:", video.currentSrc || video.querySelector("source")?.src, error);
      });
    }
  });
}

// Створює HTML однієї картки улюбленого фільму або серіалу
function createFavoriteCard(item, index) {
  const sizeClass = index % 3 === 0 ? "movieCard--large" : "movieCard--small";

  return `
    <button
      class="movieCard ${sizeClass} reveal"
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
  `;
}

// Відображає всі картки і додає обробники подій
function renderFavorites() {
  const favList = $("#favList");
  if (!favList) return;

  favList.innerHTML = favorites.map(createFavoriteCard).join("");

  $$("[data-open]", favList).forEach((button) => {
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

// ========================
// Image fallback
// ========================
// Якщо зображення не завантажилось, приховуємо його
function initImageFallback() {
  $$("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.opacity = "0";
    }, { once: true });
  });
}

// ========================
// Burger menu
// ========================
// Закриває бургер-меню
function closeBurgerMenu() {
  const burgerBtn = $("#burgerBtn");
  const siteNav = $("#siteNav");

  if (!siteNav || !burgerBtn) return;

  siteNav.classList.remove("is-open");
  setExpanded(burgerBtn, false);
}

// Відкриває або закриває бургер-меню
function toggleBurgerMenu() {
  const burgerBtn = $("#burgerBtn");
  const siteNav = $("#siteNav");

  if (!siteNav || !burgerBtn) return;

  siteNav.classList.toggle("is-open");
  setExpanded(burgerBtn, siteNav.classList.contains("is-open"));
}

// Ініціалізує бургер-меню та його закриття при натисканні на посилання
function initBurgerMenu() {
  const burgerBtn = $("#burgerBtn");
  const siteNav = $("#siteNav");

  if (burgerBtn && siteNav) {
    burgerBtn.addEventListener("click", toggleBurgerMenu);

    $$("a", siteNav).forEach((link) => {
      link.addEventListener("click", closeBurgerMenu);
    });
  }
}

// ========================
// 3D Mini Projects Modal
// ========================
// Відкриває модальне вікно міні-проєкту
function openProjectModal(card) {
  const projectModal = $("#projectModal");
  const modalModelViewer = $("#modalModelViewer");
  const modalTitle = $("#modalTitle");
  const modalText = $("#modalText");
  const modalProjectLink = $("#modalProjectLink");

  if (!projectModal) return;

  const model = card.dataset.model || "";
  const title = card.dataset.title || "Mini Project";
  const text = card.dataset.text || "Опис проєкту";
  const link = card.dataset.link || "#";

  if (modalModelViewer) {
    modalModelViewer.setAttribute("src", model);
  }

  setText(modalTitle, title);
  setText(modalText, text);

  if (modalProjectLink) {
    modalProjectLink.setAttribute("href", link);
  }

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

// Закриває модальне вікно міні-проєкту
function closeProjectModal() {
  const projectModal = $("#projectModal");
  if (!projectModal) return;

  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

// Підключає відкриття і закриття вікна проєкту
function initProjectModal() {
  const projectModalOverlay = $("#projectModalOverlay");
  const projectModalClose = $("#projectModalClose");
  const miniProjectCards = $$(".miniProjectCard");

  miniProjectCards.forEach((card) => {
    card.addEventListener("click", () => {
      openProjectModal(card);
    });
  });

  projectModalClose?.addEventListener("click", closeProjectModal);
  projectModalOverlay?.addEventListener("click", closeProjectModal);
}

// ========================
// Global keyboard events
// ========================
// Обробляє натискання клавіш Escape, ArrowLeft і ArrowRight
function initGlobalKeyboardEvents() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProjectModal();
    }

    const slides = getSlides();
    if (!slides.length) return;

    if (event.key === "ArrowLeft") {
      prevSlide();
    }

    if (event.key === "ArrowRight") {
      nextSlide();
    }
  });
}