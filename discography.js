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

/* Star class */
class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * -h;
    this.size = Math.random() * 1.5 + 0.5;
    this.speed = Math.random() * 0.6 + 0.3;
    this.alpha = Math.random() * 0.6 + 0.3;

    const colors = [
        "240, 240, 245", // moon white
        "190, 180, 220", // dusty lavender
        "160, 170, 190", // silver blue
        "210, 200, 185"  // warm pearl
      ];
      
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speed;
    if (this.y > h) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}


const stars = [];
const STAR_COUNT = 90; 

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push(new Star());
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(star => {
    star.update();
    star.draw();
  });
  requestAnimationFrame(animate);
}

animate();



const video = document.getElementById('intro-video');
  
  document.addEventListener('click', () => {
    video.muted = false;
    video.play();
  }, { once: true });

  document.addEventListener('scroll', () => {
    video.muted = false;
    video.play();
  }, { once: true });


  function toggleEnhypenMute() {
    const video = document.querySelector('.enhypen-video-element');
    const icon = document.getElementById('mute-icon');
    const text = document.querySelector('.mute-text');

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
