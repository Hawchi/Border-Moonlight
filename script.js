// Jaar in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sparkle 
const canvas = document.getElementById('sparkles');
const ctx = canvas.getContext('2d');
let w, h, dpr, stars;

function resize(){
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = canvas.width  = Math.floor(canvas.clientWidth * dpr);
  h = canvas.height = Math.floor(canvas.clientHeight * dpr);
  stars = createStars();
}

function createStars(){
  const count = Math.floor((w * h) / 12000);
  const arr = [];
  for(let i=0;i<count;i++){
    arr.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.4+0.2,
      a: Math.random()*0.5+0.15,
      t: Math.random()*Math.PI*2,
      s: Math.random()*0.0008+0.0002
    });
  }
  return arr;
}

function draw(){
  ctx.clearRect(0,0,w,h);
  for(const s of stars){
    s.t += s.s;
    const pulse = (Math.sin(s.t)+1)/2;
    const alpha = s.a*(0.25+pulse*0.75);
    ctx.beginPath();
    const grad = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*4);
    grad.addColorStop(0,`rgba(255,255,255,${alpha})`);
    grad.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.arc(s.x,s.y,s.r*4,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

const ro = new ResizeObserver(()=>resize());
ro.observe(canvas);
resize();
draw();
