document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const releaseCards = document.querySelectorAll(".release-card");

  function applyFilter(filter) {
    releaseCards.forEach((card) => {
      const tracks = card.querySelectorAll(".tracklist__item");
      let anyVisible = false;

      tracks.forEach((track) => {
        const tags = (track.dataset.tags || "").split(" ").filter(Boolean);

        if (filter === "all") {
          track.classList.remove("is-hidden");
          anyVisible = true;
          return;
        }

        const show = tags.includes(filter);
        track.classList.toggle("is-hidden", !show);
        if (show) anyVisible = true;
      });

      card.classList.toggle("is-hidden", !anyVisible);
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(btn.dataset.filter);
    });
  });

  applyFilter("all");
});

/* ===== Stars Canvas ===== */
const canvas = document.createElement("canvas");
canvas.id = "stars-canvas";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * -h;
    this.size = Math.random() * 1.5 + 0.5;
    this.speed = Math.random() * 0.6 + 0.3;
    this.alpha = Math.random() * 0.6 + 0.3;

    const colors = ["240, 240, 245","190, 180, 220","160, 170, 190","210, 200, 185"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() { this.y += this.speed; if (this.y > h) this.reset(); }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const stars = [];
const STAR_COUNT = 90;
for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

function animate() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(star => { star.update(); star.draw(); });
  requestAnimationFrame(animate);
}
animate();

/* ===== Intro video random ===== */
window.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('intro-video');
  const source = document.getElementById('video-source');

  if (!video || !source) return;

  const videoPool = [
    'images/enhypen-intro.mp4',
    'images/enhypen-intro-1.mp4',
    'images/enhypen-intro-2.mp4',
    'images/enhypen-intro-3.mp4'
  ];

  function playRandomVideo() {
    const lastVideo = localStorage.getItem('lastPlayedVideo');
    const availableVideos = videoPool.filter(v => v !== lastVideo);
    const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];

    localStorage.setItem('lastPlayedVideo', randomVideo);
    source.src = randomVideo;
    video.load();

    video.play().then(() => {
      video.muted = false;
    }).catch(() => {
      video.muted = true;
      video.play();
    });
  }

  playRandomVideo();
  video.addEventListener('ended', playRandomVideo);
});

/* ===== Unmute on first click/scroll ===== */
const introVideo = document.getElementById('intro-video');
if (introVideo) {
  document.addEventListener('click', () => {
    introVideo.muted = false;
    introVideo.play();
  }, { once: true });

  document.addEventListener('scroll', () => {
    introVideo.muted = false;
    introVideo.play();
  }, { once: true });
}

function toggleEnhypenMute() {
  const video = document.querySelector('.enhypen-video-element');
  const icon = document.getElementById('mute-icon');
  const text = document.querySelector('.mute-text');

  if (!video) return;

  if (video.muted) {
    video.muted = false;
    icon.innerText = '🔊';
    text.innerText = 'SOUND ON';
  } else {
    video.muted = true;
    icon.innerText = '🔇';
    text.innerText = 'SOUND OFF';
  }
}

/* ===== Countdown ===== */
const releaseDate = new Date("January 16, 2026 06:00:00").getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const diff = releaseDate - now;

  if (diff < 0) {
    clearInterval(timer);
    return;
  }

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minsEl = document.getElementById("minutes");
  const secsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  daysEl.innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
  hoursEl.innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
  minsEl.innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
  secsEl.innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}, 1000);

/* =========================
   ✅ SPOTIFY POPUP MODAL (RELEASE CARD CLICK)
   ========================= */
   (() => {
    const modal = document.getElementById("spotifyModal");
    const frame = document.getElementById("spotifyFrame");
  
    if (!modal || !frame) {
      console.warn("spotifyModal of spotifyFrame niet gevonden in HTML.");
      return;
    }
  
    function toEmbed(url) {
      try {
        const u = new URL(url);
        if (!u.hostname.includes("open.spotify.com")) return null;
  
        const parts = u.pathname.split("/").filter(Boolean); // ["album","ID"]
        const type = parts[0];
        const id = parts[1];
        if (!type || !id) return null;
  
        return `https://open.spotify.com/embed/${type}/${id}?theme=0`;
      } catch {
        return null;
      }
    }
  
    function openModal(spotifyUrl) {
      const embedUrl = toEmbed(spotifyUrl);
      if (!embedUrl) return;
  
      frame.src = embedUrl;
      modal.classList.add("is-open");            
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  
    function closeModal() {
      modal.classList.remove("is-open");         
      modal.setAttribute("aria-hidden", "true");
      frame.src = ""; // stop audio
      document.body.style.overflow = "";
    }
  
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".release-card[data-spotify]");
      if (card) {
        openModal(card.dataset.spotify);
        return;
      }
  
      if (e.target.closest("[data-close]")) {
        closeModal();
      }
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  })();
  