(function () {
  try {
    const jaar = document.getElementById('jaar');
    if (jaar) {
      jaar.textContent = new Date().getFullYear();
    }
  } catch (e) {
    console.warn('[lore.js] Jaar updaten mislukt:', e);
  }

  try {
    const secties = Array.from(document.querySelectorAll('.hoofdstuk'));
    const links = Array.from(document.querySelectorAll('.fases a'));

    if (secties.length && links.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = '#' + entry.target.id;
            links.forEach((a) => {
              a.classList.toggle('actief', a.getAttribute('href') === id);
            });
          });
        },
        {
          root: null,
          rootMargin: '-35% 0px -55% 0px',
          threshold: 0.01,
        }
      );

      secties.forEach((s) => observer.observe(s));
    }
  } catch (e) {
    console.warn('[lore.js] IntersectionObserver / fases error:', e);
  }

  // -------------------------
  // 4) Sterren
  // -------------------------

  const canvas = document.getElementById('sparkles');

  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    let w = 0, h = 0, dpr = 1, stars = [];
  
    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      w = Math.floor(rect.width * dpr);
      h = Math.floor(rect.height * dpr);
      canvas.width = w;
      canvas.height = h;
      stars = createStars();
    }
  
    function createStars() {
      const count = Math.min(150, Math.floor((w * h) / 40000)); // VEEL minder sterren!!
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1 + 0.2,
          t: Math.random() * Math.PI * 2,
          s: Math.random() * 0.0003 + 0.0001,
          a: Math.random() * 0.3 + 0.1
        });
      }
      return arr;
    }
  
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.t += s.s;
        const pulse = (Math.sin(s.t) + 1) / 2;
        const alpha = s.a * (0.25 + pulse * 0.75);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
  
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();
  }
})();  
