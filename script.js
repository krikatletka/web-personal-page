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

// ========================
// Year
// ========================
setText($("#year"), new Date().getFullYear());

// ========================
// Theme
// ========================
const THEME_KEY = "km_theme";
const themeBtn = $("#themeBtn");
const themeBtnText = $("#themeBtnText");

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  setPressed(themeBtn, isDark);
  setText(themeBtnText, isDark ? "Light" : "Dark");

  localStorage.setItem(THEME_KEY, theme);
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

applyTheme(getInitialTheme());

themeBtn?.addEventListener("click", () => {
  const isDark = document.body.classList.contains("theme-dark");
  applyTheme(isDark ? "light" : "dark");
});

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
// Dots helper
// ========================
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

function updateDots(container, activeIndex) {
  if (!container) return;

  $$(".dotbtn", container).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
  });
}

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

function showSemester(index) {
  semIndex = clampIndex(index, semesters.length);
  const semester = semesters[semIndex];

  setText(semLabel, semester.label);
  renderTable(semester.rows);
  updateDots(semDots, semIndex);
}

function initSemesters() {
  if (!studyBody || !semLabel || !semDots) return;

  renderDots(semDots, semesters, semIndex, "Семестр", showSemester);
  showSemester(0);

  semPrev?.addEventListener("click", () => showSemester(semIndex - 1));
  semNext?.addEventListener("click", () => showSemester(semIndex + 1));
}

initSemesters();

// ========================
// Photo slider
// ========================
const sliderViewport = $("#sliderViewport");
const slides = sliderViewport ? $$(".slide", sliderViewport) : [];
const slidePrev = $("#slidePrev");
const slideNext = $("#slideNext");
const slideDots = $("#slideDots");

let slideIndex = 0;

function showSlide(index) {
  if (!slides.length) return;

  slideIndex = clampIndex(index, slides.length);

  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === slideIndex);
  });

  updateDots(slideDots, slideIndex);
}

function nextSlide() {
  showSlide(slideIndex + 1);
}

function prevSlide() {
  showSlide(slideIndex - 1);
}

function initSlider() {
  if (!slides.length || !slideDots) return;

  renderDots(slideDots, slides, slideIndex, "Слайд", showSlide);
  showSlide(0);

  slidePrev?.addEventListener("click", prevSlide);
  slideNext?.addEventListener("click", nextSlide);
}

initSlider();

// ========================
// Reveal on scroll
// ========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.18 });

function observeRevealElements(root = document) {
  $$(".reveal", root).forEach((element) => {
    revealObserver.observe(element);
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

function closeModal(modal, handleEsc) {
  modal?.remove();
  document.body.classList.remove("modal-open");

  if (handleEsc) {
    document.removeEventListener("keydown", handleEsc);
  }
}

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

function renderFavorites() {
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

renderFavorites();

// ========================
// Image fallback
// ========================
$$("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.opacity = "0";
  }, { once: true });
});

// ========================
// Burger menu
// ========================
const burgerBtn = $("#burgerBtn");
const siteNav = $("#siteNav");

function closeBurgerMenu() {
  if (!siteNav || !burgerBtn) return;

  siteNav.classList.remove("is-open");
  setExpanded(burgerBtn, false);
}

function toggleBurgerMenu() {
  if (!siteNav || !burgerBtn) return;

  siteNav.classList.toggle("is-open");
  setExpanded(burgerBtn, siteNav.classList.contains("is-open"));
}

if (burgerBtn && siteNav) {
  burgerBtn.addEventListener("click", toggleBurgerMenu);

  $$("a", siteNav).forEach((link) => {
    link.addEventListener("click", closeBurgerMenu);
  });
}

// ========================
// 3D Mini Projects Modal
// ========================
const projectModal = $("#projectModal");
const projectModalOverlay = $("#projectModalOverlay");
const projectModalClose = $("#projectModalClose");
const modalModelViewer = $("#modalModelViewer");
const modalTitle = $("#modalTitle");
const modalText = $("#modalText");
const modalProjectLink = $("#modalProjectLink");
const miniProjectCards = $$(".miniProjectCard");

function openProjectModal(card) {
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

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

miniProjectCards.forEach((card) => {
  card.addEventListener("click", () => {
    openProjectModal(card);
  });
});

projectModalClose?.addEventListener("click", closeProjectModal);
projectModalOverlay?.addEventListener("click", closeProjectModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }

  if (!slides.length) return;

  if (event.key === "ArrowLeft") {
    prevSlide();
  }

  if (event.key === "ArrowRight") {
    nextSlide();
  }
});

// ========================
// Music Player
// ========================

const audioPlayer = $("#audioPlayer");
const musicTitle = $("#musicTitle");
const musicArtist = $("#musicArtist");
const musicCover = $("#musicCover");
const musicList = $("#musicList");
const playPauseBtn = $("#playPauseBtn");
const prevTrackBtn = $("#prevTrack");
const nextTrackBtn = $("#nextTrack");
const musicProgress = $("#musicProgress");
const currentTimeEl = $("#currentTime");
const durationTimeEl = $("#durationTime");
const MUSIC_STATE_KEY = "km_music_state";

const tracks = [
  {
    title: "Lush Life",
    artist: "Zara Larsson",
    src: "music/song1.mp3",
    cover: "img/music/cover1.jpg"
  },
  {
    title: "All I Need",
    artist: "Within Temptation",
    src: "music/song2.mp3",
    cover: "img/music/cover2.jpg"
  },
  {
    title: "Rolling Back To You",
    artist: "Adele",
    src: "music/song3.mp3",
    cover: "img/music/cover3.jpg"
  }
];

let currentTrackIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function updateTrackButtons() {
  $$(".trackBtn", musicList).forEach((button, index) => {
    button.classList.toggle("is-active", index === currentTrackIndex);
  });
}

function loadTrack(index) {
  const track = tracks[index];
  if (!track || !audioPlayer) return;

  currentTrackIndex = index;
  audioPlayer.src = track.src;

  setText(musicTitle, track.title);
  setText(musicArtist, track.artist);

  if (musicCover) {
    musicCover.src = track.cover;
    musicCover.alt = track.title;
  }

  if (musicProgress) {
    musicProgress.value = 0;
  }

  setText(currentTimeEl, "0:00");
  setText(durationTimeEl, "0:00");

  updateTrackButtons();
}

function renderTrackList() {
  if (!musicList) return;

  musicList.innerHTML = tracks.map((track, index) => `
    <button class="trackBtn${index === currentTrackIndex ? " is-active" : ""}" type="button" data-track-index="${index}">
      <div class="trackBtn__left">
        <img class="trackBtn__thumb" src="${track.cover}" alt="${track.title}">
        <div class="trackBtn__meta">
          <span class="trackBtn__title">${track.title}</span>
          <span class="trackBtn__artist">${track.artist}</span>
        </div>
      </div>
      <span class="trackBtn__time">♪</span>
    </button>
  `).join("");

  $$("[data-track-index]", musicList).forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.trackIndex);
      loadTrack(index);

      try {
        await audioPlayer.play();
        setText(playPauseBtn, "❚❚");
      } catch (error) {
        console.error("Playback error:", error);
      }
    });
  });
}

async function togglePlayPause() {
  if (!audioPlayer) return;

  if (!audioPlayer.src) {
    loadTrack(currentTrackIndex);
  }

  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      setText(playPauseBtn, "❚❚");
    } catch (error) {
      console.error("Playback error:", error);
    }
  } else {
    audioPlayer.pause();
    setText(playPauseBtn, "▶");
  }
}

async function playNextTrack() {
  if (!audioPlayer) return;

  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(nextIndex);

  try {
    await audioPlayer.play();
    setText(playPauseBtn, "❚❚");
  } catch (error) {
    console.error("Playback error:", error);
  }
}

async function playPrevTrack() {
  if (!audioPlayer) return;

  const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prevIndex);

  try {
    await audioPlayer.play();
    setText(playPauseBtn, "❚❚");
  } catch (error) {
    console.error("Playback error:", error);
  }
}

function updateProgress() {
  if (!audioPlayer || !musicProgress) return;
  if (!audioPlayer.duration) return;

  const value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  musicProgress.value = value;

  setText(currentTimeEl, formatTime(audioPlayer.currentTime));
  setText(durationTimeEl, formatTime(audioPlayer.duration));
}

function setProgress() {
  if (!audioPlayer || !musicProgress || !audioPlayer.duration) return;

  const nextTime = (musicProgress.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = nextTime;
}

if (
  audioPlayer &&
  musicTitle &&
  musicArtist &&
  musicCover &&
  musicList &&
  playPauseBtn &&
  prevTrackBtn &&
  nextTrackBtn &&
  musicProgress &&
  currentTimeEl &&
  durationTimeEl

) {
    renderTrackList();

  const savedState = getSavedMusicState();

  if (savedState && Number.isInteger(savedState.trackIndex) && tracks[savedState.trackIndex]) {
    currentTrackIndex = savedState.trackIndex;
    loadTrack(currentTrackIndex);

    audioPlayer.addEventListener("loadedmetadata", async function restoreAfterLoad() {
      audioPlayer.currentTime = savedState.currentTime || 0;

      if (savedState.isPlaying) {
        try {
          await audioPlayer.play();
          setText(playPauseBtn, "❚❚");
        } catch (error) {
          console.error("Resume playback error:", error);
        }
      }

      audioPlayer.removeEventListener("loadedmetadata", restoreAfterLoad);
    });
  } else {
    loadTrack(currentTrackIndex);
  }
   audioPlayer.addEventListener("timeupdate", saveMusicState);
  audioPlayer.addEventListener("play", saveMusicState);
  audioPlayer.addEventListener("pause", saveMusicState);
  audioPlayer.addEventListener("ended", saveMusicState);

  window.addEventListener("beforeunload", saveMusicState);

  playPauseBtn.addEventListener("click", togglePlayPause);
  nextTrackBtn.addEventListener("click", playNextTrack);
  prevTrackBtn.addEventListener("click", playPrevTrack);

  audioPlayer.addEventListener("ended", playNextTrack);
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("loadedmetadata", updateProgress);

  musicProgress.addEventListener("input", setProgress);
}
const headerMusicBtn = $("#headerMusicBtn");
async function toggleHeaderMusic() {
  if (!audioPlayer) return;

  if (!audioPlayer.src) {
    loadTrack(currentTrackIndex);
  }

  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      setText(playPauseBtn, "❚❚");
      setText(headerMusicBtn, "Pause");
      setPressed(headerMusicBtn, true);
    } catch (error) {
      console.error("Playback error:", error);
    }
  } else {
    audioPlayer.pause();
    setText(playPauseBtn, "▶");
    setText(headerMusicBtn, "Music");
    setPressed(headerMusicBtn, false);
  }
}
if (headerMusicBtn) {
  headerMusicBtn.addEventListener("click", toggleHeaderMusic);
}

audioPlayer?.addEventListener("play", () => {
  setText(headerMusicBtn, "Pause");
  setPressed(headerMusicBtn, true);
});

audioPlayer?.addEventListener("pause", () => {
  setText(headerMusicBtn, "Music");
  setPressed(headerMusicBtn, false);
});

function saveMusicState() {
  if (!audioPlayer) return;

  const state = {
    trackIndex: currentTrackIndex,
    currentTime: audioPlayer.currentTime || 0,
    isPlaying: !audioPlayer.paused
  };

  localStorage.setItem(MUSIC_STATE_KEY, JSON.stringify(state));
}

function getSavedMusicState() {
  try {
    const raw = localStorage.getItem(MUSIC_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Music state parse error:", error);
    return null;
  }
}