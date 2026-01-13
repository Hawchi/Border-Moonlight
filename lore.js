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
})();  
