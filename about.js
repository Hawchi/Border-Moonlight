filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

searchInput?.addEventListener("input", applyFilters);

applyFilters();

/* ===== Falling Stars  ===== */
const canvas = document.getElementById("stars-canvas");
const ctx = canvas?.getContext("2d");

function resize(){
  if(!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const stars = [];
const STAR_COUNT = 70;

function rand(min, max){ return Math.random() * (max - min) + min; }

function spawnStar(){
  return {
    x: rand(0, canvas.width),
    y: rand(-canvas.height, 0),
    r: rand(0.6, 1.6),
    vy: rand(0.35, 1.2),
    vx: rand(-0.15, 0.15),
    a: rand(0.18, 0.75),
    tw: rand(0.004, 0.018)
  };
}

if(canvas){
  for(let i=0; i<STAR_COUNT; i++) stars.push(spawnStar());
}

function draw(){
  if(!canvas || !ctx) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(const s of stars){
    s.y += s.vy;
    s.x += s.vx;
    s.a += Math.sin(Date.now() * s.tw) * 0.002;

    // respawn
    if(s.y > canvas.height + 20){
      Object.assign(s, spawnStar());
      s.y = -10;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.08, Math.min(0.7, s.a))})`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();
