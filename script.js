// ===============================
// PERSONAL GREETING
// ===============================
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const guestEl = document.getElementById("guestName");

guestEl.innerText = name
  ? `Скъпи ${name}, с удоволствие Ви каним на нашата сватба.`
  : "С удоволствие Ви каним на нашата сватба.";

// ===============================
// COUNTDOWN
// ===============================
const weddingDate = new Date("2026-09-06T18:00:00+03:00").getTime();
const daysEl = document.getElementById("daysValue");
const hoursEl = document.getElementById("hoursValue");
const minutesEl = document.getElementById("minutesValue");
const secondsEl = document.getElementById("secondsValue");
const countdownEl = document.getElementById("countdown");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    daysEl.innerText = "0";
    hoursEl.innerText = "0";
    minutesEl.innerText = "0";
    secondsEl.innerText = "0";
    countdownEl.setAttribute("aria-label", "Празникът започна!");
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  daysEl.innerText = String(days);
  hoursEl.innerText = String(hours).padStart(2, "0");
  minutesEl.innerText = String(minutes).padStart(2, "0");
  secondsEl.innerText = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===============================
// INTRO SCREEN + MUSIC CONTROL
// ===============================
const introScreen = document.getElementById("introScreen");
const enterBtn = document.getElementById("enterBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const video = document.querySelector("#story video");

let musicPlaying = false;
let introOpened = false;

// Smooth fade in
function fadeInMusic() {
  bgMusic.volume = 0;
  bgMusic.play();
  musicPlaying = true;

  let vol = 0;
  const fade = setInterval(() => {
    if (vol < 0.5) {
      vol += 0.02;
      bgMusic.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 100);
}

// Smooth fade out
function fadeOutMusic(callback) {
  let vol = bgMusic.volume;

  const fade = setInterval(() => {
    if (vol > 0.05) {
      vol -= 0.02;
      bgMusic.volume = vol;
    } else {
      clearInterval(fade);
      bgMusic.pause();
      musicPlaying = false;
      if (callback) callback();
    }
  }, 100);
}

// Enter button with envelope opening animation
enterBtn.addEventListener("click", () => {
  if (introOpened) return;
  introOpened = true;

  introScreen.classList.add("opening");
  fadeInMusic();
  musicToggle.style.display = "block";

  setTimeout(() => {
    introScreen.classList.add("fade-out");
  }, 1450);

  setTimeout(() => {
    introScreen.style.display = "none";
  }, 2450);
});

// ===============================
// VIDEO INTERACTION
// ===============================
if (video) {
  video.addEventListener("play", () => {
    if (musicPlaying) {
      bgMusic.volume = 0.1; // lower music
    }
  });

  video.addEventListener("pause", () => {
    if (musicPlaying) {
      bgMusic.volume = 0.5; // restore music
    }
  });

  video.addEventListener("ended", () => {
    if (musicPlaying) {
      bgMusic.volume = 0.5;
    }
  });
}

// ===============================
// MUSIC TOGGLE BUTTON
// ===============================
musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    fadeOutMusic();
  } else {
    fadeInMusic();
  }
});

// ===============================
// FADE-IN ON SCROLL
// ===============================
const faders = document.querySelectorAll(".fade");

const appearOnScroll = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});
