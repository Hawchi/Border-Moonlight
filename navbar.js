// navbar.js
class SiteNavbar extends HTMLElement {
  async connectedCallback() {
    const src = this.getAttribute("src") || "navbar.html";
    try {
      const html = await fetch(src, { cache: "no-cache" }).then(r => r.text());
      this.innerHTML = html;

      this.ensureToggleButton();   // ✅ voeg hamburger toe als hij mist
      this.setupMobileMenu();      // ✅ toggle gedrag

      this.markActiveLink();
      window.addEventListener("hashchange", () => this.markActiveLink());
    } catch (e) {
      console.error("Navbar kon niet geladen worden:", e);
      this.innerHTML = `<div style="color:#f88;padding:10px;">
        Kon navbar niet laden uit <code>${src}</code>.
      </div>`;
    }
  }

  // ✅ als je navbar.html nog geen button heeft, voegen we hem automatisch toe
  ensureToggleButton() {
    const inner = this.querySelector(".nav__inner");
    const nav = this.querySelector("nav");
    if (!inner || !nav) return;

    // nav id voor aria-controls
    if (!nav.id) nav.id = "primary-nav";

    let btn = this.querySelector(".nav__toggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "nav__toggle";
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", nav.id);
      btn.innerHTML = `☰ <span class="sr-only">Menu</span>`;

      // plaats button tussen logo en nav
      // (nav__inner is flex met space-between, dus dit blijft netjes)
      inner.insertBefore(btn, nav);
    }
  }

  setupMobileMenu() {
    const header = this.querySelector("header.nav") || this.querySelector(".nav");
    const toggle = this.querySelector(".nav__toggle");
    const nav = this.querySelector("nav");

    if (!header || !toggle || !nav) return;

    // geef nav een class zodat jouw CSS hem kan targetten
    nav.classList.add("nav__menu");

    const closeMenu = () => {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      header.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    // sluit menu als je op een link klikt
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => closeMenu());
    });

    // sluit menu met Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // sluit menu als je buiten het menu klikt (op mobiel super chill)
    document.addEventListener("click", (e) => {
      const clickedInside = header.contains(e.target);
      if (!clickedInside) closeMenu();
    });
  }

  markActiveLink() {
    const currentPage = location.pathname.split("/").pop().toLowerCase() || "index.html";
    const currentHash = location.hash.toLowerCase();

    this.querySelectorAll("nav a").forEach(a => a.classList.remove("is-active"));

    const pageLink = this.querySelector(`nav a[href^="${currentPage}"]`);
    if (pageLink) pageLink.classList.add("is-active");

    if (currentPage === "index.html" && currentHash) {
      const hashLink = this.querySelector(`nav a[href="index.html${currentHash}"]`);
      if (hashLink) {
        this.querySelectorAll("nav a").forEach(a => a.classList.remove("is-active"));
        hashLink.classList.add("is-active");
      }
    }
  }
}

customElements.define("site-navbar", SiteNavbar);
