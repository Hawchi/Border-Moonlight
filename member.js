document.addEventListener("click", (e) => {
  const btn = e.target.closest(".bm-slide-btn");
  if (!btn) return;

  const id = btn.dataset.slider;
  const dir = Number(btn.dataset.dir || 1);
  const strip = document.getElementById(id);
  if (!strip) return;

  const amount = Math.round(strip.clientWidth * 0.75) * dir;
  strip.scrollBy({ left: amount, behavior: "smooth" });
});

(function starsCanvas() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h, dpr;

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  window.addEventListener("resize", resize);
  resize();

  const stars = [];
  const STAR_COUNT = 85;

  function rand(min, max){ return Math.random() * (max - min) + min; }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, 1.8) * dpr,
      a: rand(0.25, 0.9),
      tw: rand(0.003, 0.02),
      vx: rand(-0.05, 0.08) * dpr,
      vy: rand(0.10, 0.35) * dpr
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      s.a += s.tw;
      if (s.a > 0.95 || s.a < 0.15) s.tw *= -1;
      s.x += s.vx;
      s.y += s.vy;
      if (s.y > h + 20) { s.y = -20; s.x = rand(0, w); }
      if (s.x > w + 20) s.x = -20;
      if (s.x < -20) s.x = w + 20;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();

      if (Math.random() < 0.003) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,120,190,${s.a * 0.35})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

