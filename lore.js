(function () {
  const jaar = document.getElementById("jaar");
  if (jaar) jaar.textContent = new Date().getFullYear();

  // actieve link (sidebar + modal)
  const secties = Array.from(document.querySelectorAll(".hoofdstuk"));
  const allLinks = Array.from(document.querySelectorAll(".fases a"));

  if (secties.length && allLinks.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        allLinks.forEach(a => a.classList.toggle("actief", a.getAttribute("href") === id));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

    secties.forEach(s => obs.observe(s));
  }

  const btn = document.querySelector(".fase-toggle");
  const overlay = document.querySelector(".fase-overlay");
  const panel = document.querySelector("#fase-panel");

  if (!btn || !overlay || !panel) return;

  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  const openMenu = () => {
    if (!isMobile()) return;
    document.body.classList.add("is-fase-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    document.body.classList.remove("is-fase-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.contains("is-fase-open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // ✅ klik op fase in MODAL: sluit + scroll
  panel.addEventListener("click", (e) => {
    const link = e.target.closest("a[href^='#fase-']");
    if (!link) return;
    if (!isMobile()) return;

    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    closeMenu();

    requestAnimationFrame(() => {
      const offset = 90;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  // als je naar desktop resized, sluit menu
  window.addEventListener("resize", () => {
    if (!isMobile()) closeMenu();
  });
})();
