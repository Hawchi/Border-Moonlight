document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       1) Film strips “oneindig”
       (clonen i.p.v. innerHTML repeat -> stabieler met video tags)
    ========================== */
    const strips = document.querySelectorAll(".film-strip");
    strips.forEach((strip) => {
      const original = Array.from(strip.children);
      // genoeg clones om breed scherm te vullen
      for (let i = 0; i < 12; i++) {
        original.forEach((node) => strip.appendChild(node.cloneNode(true)));
      }
    });
  
    /* =========================
       2) Scroll indicator fade
    ========================== */
    const scrollIndicator = document.querySelector(".scroll-pijl");
    if (scrollIndicator) {
      const update = () => {
        scrollIndicator.style.opacity = window.scrollY > 50 ? "0" : "0.9";
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
    }
  
    /* =========================
       3) Modal refs + controls
    ========================== */
    const modal = document.getElementById("videoModal");
    const modalTitle = document.getElementById("videoModalTitle");
    const frameWrap = document.getElementById("videoFrameWrap");
    const modalCloseBtn = document.getElementById("modalClose");
    const modalFullscreenBtn = document.getElementById("modalFullscreen");
  
    function openModal(item) {
      const videoId = extractYouTubeId(item?.url || item?.youtubeId || "");
      if (!videoId) return;
  
      if (modalTitle) modalTitle.textContent = item?.name || item?.title || "Video";
  
      // 16:9 embed
      frameWrap.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
          title="${escapeHtml(item?.name || item?.title || "YouTube video")}"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>
      `;
  
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  
    function closeModal() {
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (frameWrap) frameWrap.innerHTML = ""; // stopt video meteen
    }
  
    modalCloseBtn?.addEventListener("click", closeModal);
  
    modal?.addEventListener("click", (e) => {
      if (e.target?.dataset?.close === "true") closeModal();
    });
  
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
    });
  
    modalFullscreenBtn?.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) {
          await frameWrap.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen blocked:", err);
      }
    });
  
    /* =========================
       4) Data: gebruik HUN categoriesConfig
       -> jij rendert het in jouw eigen Moonlight layout
    ========================== */
    // categoriesConfig komt uit config.js (ENHA-FLIX) :contentReference[oaicite:1]{index=1}
    if (typeof categoriesConfig === "undefined") {
      console.warn("categoriesConfig ontbreekt. Zet <script src='config.js'></script> vóór videos.js");
      return;
    }
  
    // JOUW volgorde (pas dit aan hoe jij het wil):
    const CATEGORY_ORDER = [
      "Music Videos",
      "Dance Practices",
      "MVs Reaction",
      "Variety Shows",
      "EN - LoG",
      "Recording Behind",
      "Comeback Showcase",
      "COMEBACK LIVES",
      "Tours",
      "Concept Cinema",
      "Album Previews",
      "Studio Choom",
      "Weverse Con"
    ];
  
    // Alle overige categorieën (die niet in jouw lijst staan) komen daarna
    const sortedCategoryTitles = sortByPreferredOrder(Object.keys(categoriesConfig), CATEGORY_ORDER);
  
    /* =========================
       5) Render: Moonlight “Archive” layout
       - maakt per category een section
       - per subcategory een horizontale row
       - show more/less (zelfde idee als ENHA-FLIX, maar andere look) :contentReference[oaicite:2]{index=2}
    ========================== */
    const wrapper = document.querySelector(".bm-library-grid-wrapper");
    if (!wrapper) return;
  
    // Optioneel: als jij nog je oude vaste sections hebt staan, vervangen we content:
    wrapper.innerHTML = "";
  
    const container = document.createElement("div");
    container.className = "archive-container";
    wrapper.appendChild(container);
  
    sortedCategoryTitles.forEach((categoryTitle, cIndex) => {
      const subcats = categoriesConfig[categoryTitle];
      if (!subcats || typeof subcats !== "object") return;
  
      const section = document.createElement("section");
      section.className = "archive-section";
      section.id = `archive-${cIndex}`;
  
      section.innerHTML = `
        <div class="archive-section__header">
          <h2 class="archive-title">${escapeHtml(categoryTitle)}</h2>
          <p class="archive-subtitle">Curated in the Moonlight Archive</p>
        </div>
      `;
  
      Object.entries(subcats).forEach(([subTitle, items], sIndex) => {
        if (!Array.isArray(items) || items.length === 0) return;
  
        const rowId = `row-${cIndex}-${sIndex}`;
        const visibleCount = 8;
  
        const rowWrap = document.createElement("div");
        rowWrap.className = "archive-rowWrap";
        rowWrap.innerHTML = `
          <div class="archive-rowHeader">
            <h3 class="archive-rowTitle">${escapeHtml(subTitle)}</h3>
            ${items.length > visibleCount ? `
              <button class="archive-moreBtn" type="button" data-target="${rowId}">
                Show more <span class="count">+${items.length - visibleCount}</span>
              </button>
            ` : ``}
          </div>
          <div class="video-row" id="${rowId}"></div>
        `;
  
        section.appendChild(rowWrap);
  
        const row = rowWrap.querySelector(`#${rowId}`);
        items.forEach((item, idx) => {
          const card = makeCard(item, idx >= visibleCount);
          row.appendChild(card);
        });
      });
  
      container.appendChild(section);
    });
  
    // Show more/less toggle (netjes zonder inline onclick)
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".archive-moreBtn");
      if (!btn) return;
  
      const targetId = btn.dataset.target;
      const row = document.getElementById(targetId);
      if (!row) return;
  
      const hidden = row.querySelectorAll(".is-hidden");
      const expanded = btn.classList.toggle("is-expanded");
  
      if (expanded) {
        hidden.forEach((el) => el.classList.remove("is-hidden"));
        btn.innerHTML = `Show less <span class="count">▲</span>`;
      } else {
        // hide back alles na de eerste 8
        const cards = row.querySelectorAll(".video-card");
        cards.forEach((card, i) => {
          if (i >= 8) card.classList.add("is-hidden");
        });
        btn.innerHTML = `Show more <span class="count">+${cards.length - 8}</span>`;
      }
    });
  
    /* =========================
       Helpers
    ========================== */
    function makeCard(item, startHidden = false) {
      const name = item?.name || item?.title || "Untitled";
      const thumb = item?.thumbnail || youtubeThumbFromUrl(item?.url || "") || "images/thumbnails/fallback.jpg";
      const desc = item?.description || "";
  
      const card = document.createElement("article");
      card.className = `video-card ${startHidden ? "is-hidden" : ""}`;
      card.tabIndex = 0;
  
      card.innerHTML = `
        <div class="video-thumb">
          <img src="${escapeAttr(thumb)}" alt="${escapeAttr(name)}">
          <div class="video-thumb__overlay">
            <span class="video-thumb__play">▶</span>
          </div>
        </div>
        <div class="video-info">
          ${desc ? `<span class="member-card__tag">${escapeHtml(desc)}</span>` : ``}
          <h4 class="member-card__name">${escapeHtml(name)}</h4>
        </div>
      `;
  
      const open = () => openModal(item);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
  
      return card;
    }
  
    function extractYouTubeId(input) {
      if (!input) return null;
  
      // Als iemand per ongeluk alleen de id geeft
      if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  
      try {
        const url = new URL(input);
  
        // youtu.be/VIDEOID
        if (url.hostname.includes("youtu.be")) {
          const id = url.pathname.split("/").filter(Boolean)[0];
          return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }
  
        // youtube.com/watch?v=VIDEOID
        if (url.searchParams.get("v")) {
          const id = url.searchParams.get("v");
          return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }
  
        // youtube.com/embed/VIDEOID
        const parts = url.pathname.split("/").filter(Boolean);
        const embedIndex = parts.indexOf("embed");
        if (embedIndex !== -1 && parts[embedIndex + 1]) {
          const id = parts[embedIndex + 1];
          return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }
  
        // youtube.com/shorts/VIDEOID
        const shortsIndex = parts.indexOf("shorts");
        if (shortsIndex !== -1 && parts[shortsIndex + 1]) {
          const id = parts[shortsIndex + 1];
          return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }
  
        return null;
      } catch {
        return null;
      }
    }
  
    function youtubeThumbFromUrl(url) {
      const id = extractYouTubeId(url);
      return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
    }
  
    function sortByPreferredOrder(list, preferred) {
      const prefIndex = new Map(preferred.map((t, i) => [t, i]));
      return [...list].sort((a, b) => {
        const ai = prefIndex.has(a) ? prefIndex.get(a) : 9999;
        const bi = prefIndex.has(b) ? prefIndex.get(b) : 9999;
        if (ai !== bi) return ai - bi;
        return a.localeCompare(b);
      });
    }
  
    function escapeHtml(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  
    function escapeAttr(str) {
      return escapeHtml(str).replaceAll("`", "&#096;");
    }
  });
  