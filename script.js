// ===============================
// PERSONAL GREETING
// ===============================
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const guestEl = document.getElementById("guestName");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

if (name) {
  guestEl.textContent = "";
  guestEl.append(`Скъпи ${name}`);
  guestEl.appendChild(document.createElement("br"));
  guestEl.append("с удоволствие Ви каним на нашата сватба.");
} else {
  guestEl.innerText = "С удоволствие Ви каним на нашата сватба.";
}

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
const storySection = document.getElementById("story");
const heroSection = document.querySelector("header.hero");
const guestMenuSelects = document.querySelectorAll('select[name^="guest_menu_"]');

let musicPlaying = false;
let introOpened = false;

guestMenuSelects.forEach(select => {
  select.selectedIndex = 0;
});

function smoothScrollTo(targetY, duration = 1800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Smooth fade in
function fadeInMusic() {
  bgMusic.volume = 0;
  const playPromise = bgMusic.play();
  if (playPromise) {
    playPromise.catch(() => {});
  }
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

  const beginMainFlow = () => {
    if (introScreen) {
      introScreen.remove();
    }
    if (storySection) {
      const storyTop = storySection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: storyTop, behavior: "auto" });
    }
    if (video) {
      video.currentTime = 0;
      fadeInMusic();
      musicToggle.style.display = "block";
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {});
      }
    } else {
      fadeInMusic();
      musicToggle.style.display = "block";
    }
  };

  if (video) {
    video.muted = true;
    video.volume = 0;
  }

  if (introScreen) {
    introScreen.classList.add("opening");
    setTimeout(() => {
      introScreen.classList.add("fade-out");
    }, 2300);
    setTimeout(beginMainFlow, 4000);
  } else {
    beginMainFlow();
  }
});

// ===============================
// VIDEO INTERACTION
// ===============================
if (video) {
  video.addEventListener("ended", () => {
    if (heroSection) {
      const heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
      setTimeout(() => {
        smoothScrollTo(heroTop, 2200);
      }, 1000);
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
