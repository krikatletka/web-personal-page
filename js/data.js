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
// Favorites data
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

// ========================
// Music tracks
// ========================
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