// ========================
// Music Player
// ========================
const MUSIC_STATE_KEY = "km_music_state";
let currentTrackIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function getAudioElements() {
  return {
    audioPlayer: $("#audioPlayer"),
    musicTitle: $("#musicTitle"),
    musicArtist: $("#musicArtist"),
    musicCover: $("#musicCover"),
    musicList: $("#musicList"),
    playPauseBtn: $("#playPauseBtn"),
    prevTrackBtn: $("#prevTrack"),
    nextTrackBtn: $("#nextTrack"),
    musicProgress: $("#musicProgress"),
    currentTimeEl: $("#currentTime"),
    durationTimeEl: $("#durationTime"),
    headerMusicBtn: $("#headerMusicBtn")
  };
}

function updateTrackButtons() {
  const { musicList } = getAudioElements();
  if (!musicList) return;

  $$(".trackBtn", musicList).forEach((button, index) => {
    button.classList.toggle("is-active", index === currentTrackIndex);
  });
}

function loadTrack(index) {
  const {
    audioPlayer,
    musicTitle,
    musicArtist,
    musicCover,
    musicProgress,
    currentTimeEl,
    durationTimeEl
  } = getAudioElements();

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

function saveMusicState() {
  const { audioPlayer } = getAudioElements();
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

function updateProgress() {
  const { audioPlayer, musicProgress, currentTimeEl, durationTimeEl } = getAudioElements();

  if (!audioPlayer || !musicProgress) return;
  if (!audioPlayer.duration) return;

  const value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  musicProgress.value = value;

  setText(currentTimeEl, formatTime(audioPlayer.currentTime));
  setText(durationTimeEl, formatTime(audioPlayer.duration));
}

function setProgress() {
  const { audioPlayer, musicProgress } = getAudioElements();

  if (!audioPlayer || !musicProgress || !audioPlayer.duration) return;

  const nextTime = (musicProgress.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = nextTime;
}

function syncHeaderMusicState() {
  const { audioPlayer, headerMusicBtn, playPauseBtn } = getAudioElements();
  if (!audioPlayer) return;

  if (audioPlayer.paused) {
    setText(playPauseBtn, "▶");
    setText(headerMusicBtn, "Music");
    setPressed(headerMusicBtn, false);
  } else {
    setText(playPauseBtn, "❚❚");
    setText(headerMusicBtn, "Pause");
    setPressed(headerMusicBtn, true);
  }
}

function renderTrackList() {
  const { musicList, audioPlayer } = getAudioElements();
  if (!musicList || !audioPlayer) return;

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
        syncHeaderMusicState();
      } catch (error) {
        console.error("Playback error:", error);
      }
    });
  });
}

async function togglePlayPause() {
  const { audioPlayer } = getAudioElements();
  if (!audioPlayer) return;

  if (!audioPlayer.src) {
    loadTrack(currentTrackIndex);
  }

  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      syncHeaderMusicState();
    } catch (error) {
      console.error("Playback error:", error);
    }
  } else {
    audioPlayer.pause();
    syncHeaderMusicState();
  }
}

async function playNextTrack() {
  const { audioPlayer } = getAudioElements();
  if (!audioPlayer) return;

  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(nextIndex);

  try {
    await audioPlayer.play();
    syncHeaderMusicState();
  } catch (error) {
    console.error("Playback error:", error);
  }
}

async function playPrevTrack() {
  const { audioPlayer } = getAudioElements();
  if (!audioPlayer) return;

  const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prevIndex);

  try {
    await audioPlayer.play();
    syncHeaderMusicState();
  } catch (error) {
    console.error("Playback error:", error);
  }
}

async function toggleHeaderMusic() {
  const { audioPlayer } = getAudioElements();
  if (!audioPlayer) return;

  if (!audioPlayer.src) {
    loadTrack(currentTrackIndex);
  }

  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      syncHeaderMusicState();
    } catch (error) {
      console.error("Playback error:", error);
    }
  } else {
    audioPlayer.pause();
    syncHeaderMusicState();
  }
}

function initMusicPlayerEffects() {
  const { audioPlayer } = getAudioElements();
  const body = document.body;

  if (!audioPlayer) return;

  audioPlayer.addEventListener("play", () => {
    body.classList.add("music-playing");
    syncHeaderMusicState();
  });

  audioPlayer.addEventListener("pause", () => {
    body.classList.remove("music-playing");
    syncHeaderMusicState();
  });

  audioPlayer.addEventListener("ended", () => {
    body.classList.remove("music-playing");
    syncHeaderMusicState();
  });
}

function initMusicPlayer() {
  const {
    audioPlayer,
    musicTitle,
    musicArtist,
    musicCover,
    musicList,
    playPauseBtn,
    prevTrackBtn,
    nextTrackBtn,
    musicProgress,
    currentTimeEl,
    durationTimeEl,
    headerMusicBtn
  } = getAudioElements();

  if (
    !audioPlayer ||
    !musicTitle ||
    !musicArtist ||
    !musicCover ||
    !musicList ||
    !playPauseBtn ||
    !prevTrackBtn ||
    !nextTrackBtn ||
    !musicProgress ||
    !currentTimeEl ||
    !durationTimeEl
  ) {
    return;
  }

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
          syncHeaderMusicState();
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
  headerMusicBtn?.addEventListener("click", toggleHeaderMusic);

  initMusicPlayerEffects();
  syncHeaderMusicState();
}