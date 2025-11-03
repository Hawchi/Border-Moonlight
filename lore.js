// Minimal, safe JS: voortgang + actieve link + sterren

(function(){
  // Jaar
  const jaar = document.getElementById('jaar');
  if (jaar) jaar.textContent = new Date().getFullYear();

  // Voortgangsbalk
  const balk = document.querySelector('.voortgang .balk');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    if (balk) balk.style.width = Math.max(0, Math.min(1, scrolled)) * 100 + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  // Actieve zijmenu-link met IntersectionObserver
  const secties = Array.from(document.querySelectorAll('.hoofdstuk'));
  const links = Array.from(document.querySelectorAll('.fases a'));
  const map = new Map(secties.map(s => ['#'+s.id, s.id]));

  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        const id = '#'+entry.target.id;
        links.forEach(a => a.classList.toggle('actief', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 }) : null;

  if (io) secties.forEach(s => io.observe(s));

  // Sterren (licht en performant)
  const canvas = document.getElementById('sterren');
  if (canvas){
    let ctx = canvas.getContext('2d', { alpha:true, desynchronized:true });
    let w=0,h=0,dpr=1,stars=[];
    function resize(){
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      w = Math.floor(rect.width * dpr); h = Math.floor(rect.height * dpr);
      canvas.width = w; canvas.height = h;
      stars = createStars();
    }
    function createStars(){
      const count = Math.min(600, Math.floor((w*h)/18000));
      const arr = [];
      for (let i=0;i<count;i++){
        arr.push({ x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.2+0.2, t:Math.random()*Math.PI*2, s:Math.random()*0.0009+0.0002, a:Math.random()*0.45+0.2 });
      }
      return arr;
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for (const s of stars){
        s.t += s.s;
        const p = (Math.sin(s.t)+1)/2;
        const alpha = s.a*(0.25+p*0.75);
        const rad = s.r*4;
        const grad = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,rad);
        grad.addColorStop(0,`rgba(255,255,255,${alpha})`);
        grad.addColorStop(1,`rgba(255,255,255,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(s.x,s.y,rad,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    resize(); draw();
  }
})();
