/* ============================================================
   case-page.js — renderer for case-studies.html
   ------------------------------------------------------------
   Reuses buildCard() from render.js (same markup, same hover
   previews, same expandable details) against CASE_STUDIES[]
   from js/data.js — currently famous-site demo placeholders,
   meant to be swapped for real client work. Cards reveal with
   a stagger after render since motion.js's observer ran first.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  let activeFilter = "all";

  function buildChips() {
    const bar = $(".filters");
    if (!bar || bar.dataset.built) return;
    bar.dataset.built = "1";

    Object.keys(FILTERS).forEach((key) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.dataset.filter = key;
      btn.textContent = FILTERS[key];
      btn.setAttribute("aria-pressed", key === activeFilter ? "true" : "false");
      btn.addEventListener("click", () => {
        if (activeFilter === key) return;
        activeFilter = key;
        bar.querySelectorAll(".chip").forEach((c) =>
          c.setAttribute("aria-pressed", c.dataset.filter === key ? "true" : "false")
        );
        render();
      });
      bar.insertBefore(btn, $("#case-count"));
    });
  }

  function render() {
    const grid = $("#case-grid");
    if (!grid) return;

    const pool = CASE_STUDIES.filter(
      (p) => activeFilter === "all" || p.type === activeFilter
    );

    grid.classList.add("is-swapping");

    setTimeout(() => {
      grid.innerHTML = "";

      pool.forEach((project, i) => {
        const card = window.PORTFOLIO_RENDER.buildCard(project, i);
        card.style.setProperty("--d", (i * 60) + "ms");
        grid.appendChild(card);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => card.classList.add("is-inview"))
        );
      });

      const out = $("#case-count");
      if (out) {
        out.textContent =
          String(pool.length).padStart(2, "0") + " SHOWN";
      }

      requestAnimationFrame(() => grid.classList.remove("is-swapping"));
    }, 190);
  }

  function init() {
    buildChips();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
