/* ============================================================
   render.js — renders all dynamic sections from js/data.js
   ------------------------------------------------------------
   Uses <template> elements in index.html as the markup source.
   Content changes happen in data.js ONLY — this file never
   needs touching to add a project, skill or waypoint.

   Pins render as CARDS; hovering a card asks js/preview.js to
   show its floating simulated-browser preview.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  /* Clone a <template>, return its root element */
  function stamp(tplId) {
    return $("#tpl-" + tplId).content.firstElementChild.cloneNode(true);
  }

  function safeList(items) {
    return Array.isArray(items) ? items : [];
  }

  /* ----------------------------------------------------------
     ROUTE — waypoints into #route-list.
     Each stop carries data-frac: its position along the SVG
     trail, used by motion.js on desktop. Mobile ignores it.
     ---------------------------------------------------------- */
  function renderRoute() {
    const list = $("#route-list");
    if (!list) return;
    list.innerHTML = "";

    ROUTE.forEach((wp, i) => {
      const li = stamp("waypoint");
      li.dataset.frac = (ROUTE_FRACTIONS && ROUTE_FRACTIONS[i]) || 0.5;

      $(".waypoint__kicker", li).textContent = wp.kicker;
      $(".waypoint__dates", li).textContent = wp.dates;
      $(".waypoint__role", li).textContent = wp.role;
      $(".waypoint__org", li).textContent = wp.org;

      const ul = $(".waypoint__points", li);
      safeList(wp.points).forEach((pt) => {
        const item = document.createElement("li");
        item.textContent = pt;
        ul.appendChild(item);
      });

      list.appendChild(li);
    });

    /* Trail distances between waypoints (mobile chips) */
    const TRAIL_KM = 9.6;
    Array.from(list.children).forEach((el, i) => {
      if (i >= ROUTE.length - 1) return;
      const from = (ROUTE_FRACTIONS && ROUTE_FRACTIONS[i]) || i / ROUTE.length;
      const to = (ROUTE_FRACTIONS && ROUTE_FRACTIONS[i + 1]) || (i + 1) / ROUTE.length;
      el.dataset.next = ((to - from) * TRAIL_KM).toFixed(1) + " KM";
    });
  }

  /* ----------------------------------------------------------
     LOADOUT — skill modules into #skill-grid
     ---------------------------------------------------------- */
  function renderSkills() {
    const grid = $("#skill-grid");
    if (!grid) return;

    SKILL_GROUPS.forEach((group) => {
      const mod = stamp("skill");
      $(".module__name", mod).textContent = group.name;
      $(".module__code", mod).textContent = group.code || "";
      $(".module__blurb", mod).textContent = group.blurb || "";

      const chips = $(".chipset", mod);
      safeList(group.items).forEach((label) => {
        const li = document.createElement("li");
        li.textContent = label;
        chips.appendChild(li);
      });

      grid.appendChild(mod);
    });
  }

  /* ----------------------------------------------------------
     PINS — home page renders ROWS (accordion list); the archive
     page renders CARDS (buildCard below). Both bind the hover
     preview from js/preview.js.
     ---------------------------------------------------------- */
  let activeFilter = "all";

  function buildFilterBar(countOutputId) {
    const bar = $(".filters");
    if (!bar) return;

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
        renderPins(countOutputId);
      });
      bar.insertBefore(btn, bar.querySelector(".filters__count"));
    });
  }

  /* Touch devices: drop the live capture into the expanded body
     on first open (desktop uses the hover popup instead). */
  function injectCapture(container, project) {
    if (!container || !container.hidden) return;
    if (!window.AtlasCapture || !AtlasCapture.isTouch || !project.link) return;
    container.hidden = false;
    container.innerHTML =
      '<img loading="lazy" decoding="async" alt="Live capture of ' +
      (project.domain || project.link) + '" src="' + AtlasCapture.urlFor(project.link) + '">' +
      '<span class="pin__capture-note mono"><span>LIVE CAPTURE</span><span>' +
      (project.domain || "").toUpperCase() + "</span></span>";
  }

  function bindPreview(li, project) {
    li.addEventListener("mouseenter", (e) => window.PinPreview && PinPreview.show(project, e));
    li.addEventListener("mousemove", (e) => window.PinPreview && PinPreview.move(e));
    li.addEventListener("mouseleave", () => window.PinPreview && PinPreview.hide());
  }

  /* Row variant — index.html #tpl-pin */
  function buildRow(project, i) {
    const li = stamp("pin");
    li.id = project.id;
    li.dataset.index = String(i + 1).padStart(2, "0");

    $(".pin__index", li).textContent = String(i + 1).padStart(2, "0");
    $(".pin__title", li).textContent = project.title;
    $(".pin__meta", li).textContent = project.meta;
    $(".pin__coord", li).textContent = project.coord || "";
    $(".pin__summary", li).textContent = project.summary || "";

    const head = $(".pin__head", li);
    const body = $(".pin__body", li);
    body.id = project.id + "-body";
    head.setAttribute("aria-controls", body.id);
    head.addEventListener("click", () => {
      const open = li.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) injectCapture($(".pin__capture", li), project);
    });

    const scope = $(".pin__scope", li);
    safeList(project.scope).forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      scope.appendChild(item);
    });

    const stack = $(".chipset--tight", li);
    safeList(project.stack).forEach((label) => {
      const chip = document.createElement("li");
      chip.textContent = label;
      stack.appendChild(chip);
    });

    const outcome = $(".pin__outcome", li);
    if (project.outcome) outcome.textContent = project.outcome;
    else outcome.remove();

    bindPreview(li, project);
    return li;
  }

  /* Card variant — case-studies.html #tpl-pin */
  function buildCard(project, i) {
    const li = stamp("pin");
    li.id = project.id;
    li.dataset.pid = project.id;

    $(".pcard__index", li).textContent = String(i + 1).padStart(2, "0");
    $(".pcard__coord", li).textContent = project.coord || "";
    $(".pcard__title", li).textContent = project.title;
    $(".pcard__meta", li).textContent = project.meta;
    $(".pcard__summary", li).textContent = project.summary || "";

    const stack = $(".pcard__stack", li);
    safeList(project.stack).forEach((label) => {
      const chip = document.createElement("li");
      chip.textContent = label;
      stack.appendChild(chip);
    });

    // Action slot: live link when we have one, honest NDA note otherwise
    const slot = $(".pcard__open-slot", li);
    if (project.link) {
      const a = document.createElement("a");
      a.className = "btn btn--ghost btn--sm pcard__live";
      a.href = project.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("data-cursor", "");
      a.setAttribute("data-cursor-label", "VISIT");
      a.innerHTML = 'Open site <svg aria-hidden="true"><use href="#i-arrow-ur"/></svg>';
      slot.appendChild(a);
    } else {
      const nda = document.createElement("span");
      nda.className = "pcard__nda mono";
      nda.title = "Client name protected — full story in the case study archive";
      nda.textContent = "NDA PROTECTED";
      slot.appendChild(nda);
    }

    // Expandable scope + outcome
    const more = $(".pcard__more", li);
    const body = $(".pcard__body", li);
    body.id = project.id + "-body";
    more.setAttribute("aria-controls", body.id);
    more.addEventListener("click", () => {
      const open = li.classList.toggle("is-open");
      more.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) injectCapture($(".pcard__capture", li), project);
    });

    const scope = $(".pcard__scope", li);
    safeList(project.scope).forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      scope.appendChild(item);
    });

    const outcome = $(".pin__outcome", li);
    if (project.outcome) outcome.textContent = project.outcome;
    else outcome.remove();

    bindPreview(li, project);

    return li;
  }

  /* ----------------------------------------------------------
     DISPATCHES (blog) — shared card builder.
     Used by the home teaser (#post-grid) and the archive
     page (dispatches.html #post-all). Single posts live on
     dispatch.html and are rendered by js/blog-page.js.
     ---------------------------------------------------------- */
  function sortedPosts() {
    return (BLOG_POSTS || [])
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function buildPostCard(post) {
    const li = stamp("post");
    $(".post__tag", li).textContent = post.tag;
    $(".post__date", li).textContent = post.displayDate;
    $(".post__read", li).textContent = post.readMinutes + " MIN READ";
    $(".post__title", li).textContent = post.title;
    $(".post__excerpt", li).textContent = post.excerpt;
    $(".post__link", li).href = "dispatch.html?d=" + encodeURIComponent(post.slug);
    return li;
  }

  function renderDispatchTeaser() {
    const grid = $("#post-grid");
    if (!grid) return;

    grid.innerHTML = "";
    sortedPosts().slice(0, 3).forEach((post, i) => {
      const card = buildPostCard(post);
      card.style.setProperty("--d", (i * 80) + "ms");
      grid.appendChild(card);
      if (window.__atlasRevealIO) window.__atlasRevealIO.observe(card);
      else card.classList.add("is-inview");
    });
  }

  /* Public bits for other pages (case-studies.html reuses buildCard,
     blog pages reuse buildPostCard + sortedPosts) */
  window.PORTFOLIO_RENDER = { buildRow, buildCard, buildPostCard, sortedPosts };

  function renderPins(countOutputId) {
    const list = $("#pin-list");
    if (!list) return;

    const pool = PROJECTS.filter(
      (p) => activeFilter === "all" || p.type === activeFilter
    );

    list.classList.add("is-swapping");

    setTimeout(() => {
      list.innerHTML = "";

      pool.forEach((p, i) => {
        const row = buildRow(p, i);
        row.style.setProperty("--d", (i * 70) + "ms"); // staggered entrance
        list.appendChild(row);

        // Rows render after motion.js's initial scan — join the
        // observer now, or show instantly when motion is off.
        if (window.__atlasRevealIO) window.__atlasRevealIO.observe(row);
        else row.classList.add("is-inview");
      });

      const out = $(countOutputId || "#pin-count");
      if (out) out.textContent = String(pool.length).padStart(2, "0") + (pool.length === 1 ? " PIN" : " PINS") + " PLOTTED";

      requestAnimationFrame(() => list.classList.remove("is-swapping"));
    }, 190);
  }

  /* ---------------------------------------------------------- */
  function init() {
    renderRoute();
    renderSkills();
    renderDispatchTeaser();

    // Filter bar + pin list belong to the HOME page only — the
    // archive page builds its own from CASE_STUDIES (case-page.js).
    if ($("#pin-list")) {
      buildFilterBar("#pin-count");
      renderPins("#pin-count");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
