<<<<<<< HEAD

class SiteNavbar extends HTMLElement {
  async connectedCallback() {
    const src = this.getAttribute("src") || "navbar.html";
    try {
      const html = await fetch(src, { cache: "no-cache" }).then(r => r.text());
      this.innerHTML = html;

      this.markActiveLink();
      window.addEventListener("hashchange", () => this.markActiveLink());
    } catch (e) {
      console.error("Navbar kon niet geladen worden:", e);
      this.innerHTML = `<div style="color:#f88;padding:10px;">
        Kon navbar niet laden uit <code>${src}</code>.
      </div>`;
    }
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
=======
// navbar.js
class SiteNavbar extends HTMLElement {
  async connectedCallback() {
    const src = this.getAttribute("src") || "navbar.html";
    try {
      const html = await fetch(src, { cache: "no-cache" }).then(r => r.text());
      this.innerHTML = html;

      this.markActiveLink();
      window.addEventListener("hashchange", () => this.markActiveLink());
    } catch (e) {
      console.error("Navbar kon niet geladen worden:", e);
      this.innerHTML = `<div style="color:#f88;padding:10px;">
        Kon navbar niet laden uit <code>${src}</code>.
      </div>`;
    }
  }

  markActiveLink() {
    const currentPage = location.pathname.split("/").pop().toLowerCase() || "index.html";
    const currentHash = location.hash.toLowerCase();

    this.querySelectorAll("nav a").forEach(a => a.classList.remove("is-active"));

    // Markeer actieve pagina
    const pageLink = this.querySelector(`nav a[href^="${currentPage}"]`);
    if (pageLink) pageLink.classList.add("is-active");

    // Als we op index zitten, gebruik hash
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
>>>>>>> 268cd9b (Fixed loading problem bcs of JS)
