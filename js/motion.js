/* ============================================================
   motion.js — scroll choreography & live details
   ------------------------------------------------------------
   - IntersectionObserver reveal system ([data-reveal], [data-split])
   - Count-up numbers ([data-count])
   - Typing effect for the hero coordinate line ([data-typing])
   - Scroll-linked route fill (rAF-throttled, one read per frame)
   - Live Dhaka clock, scroll %, nav spy, subtle portrait parallax
   Motion is controlled by the header MOTION toggle (js/state.js),
   not the OS setting — the full experience plays by default.
   ============================================================ */

(function () {
  "use strict";

  // Motion preference comes from the header toggle (js/state.js),
  // NOT from the OS setting — the full experience is the default.
  const reduced = window.ATLAS_MOTION_OFF === true;

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  /* ----------------------------------------------------------
     SPLIT TEXT — wrap each character for staggered rise-in.
     Runs once; no-JS visitors simply see plain headings.
     ---------------------------------------------------------- */
  function splitChars(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = "1";
    let i = 0;

    el.innerHTML = el.textContent.trim().split(/\s+/).map((word) =>
      `<span class="word">${
        Array.from(word).map((ch) => `<span class="chr" style="--i:${i++}">${ch}</span>`).join("")
      }</span>`
    ).join(" ");

    // Space between words survives as a literal space between spans
    el.setAttribute("aria-label", el.textContent.trim());
  }

  /* ----------------------------------------------------------
     REVEAL OBSERVER
     ---------------------------------------------------------- */
  function initReveals() {
    $$("[data-split]").forEach(splitChars);

    const targets = $$("[data-reveal], [data-split]");

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-inview"));
      window.__atlasRevealIO = null;
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });

    targets.forEach((t) => io.observe(t));

    // Late-rendered nodes (pins swap, archive cards) join via this
    window.__atlasRevealIO = io;
  }

  /* ----------------------------------------------------------
     COUNT-UP NUMBERS
     Markup keeps the final value ("165+") so no-JS still reads
     correctly; JS animates from zero when scrolled into view.
     ---------------------------------------------------------- */
  function initCounters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;

    function renderFinal(el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    }

    if (reduced) { nums.forEach(renderFinal); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);

        const el = entry.target;
        const end = parseInt(el.getAttribute("data-count"), 10) || 0;
        const suffix = el.getAttribute("data-suffix") || "";
        const DURATION = 1300;
        const start = performance.now();

        (function tick(now) {
          const p = clamp01((now - start) / DURATION);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          el.textContent = Math.round(end * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });

    nums.forEach((n) => {
      n.textContent = "0" + (n.getAttribute("data-suffix") || "");
      io.observe(n);
    });
  }

  /* ----------------------------------------------------------
     TYPING EFFECT — hero eyebrow. Waits for boot to lift via
     the "site:ready" event dispatched by boot.js.
     ---------------------------------------------------------- */
  function initTyping() {
    const el = $("[data-typing]");
    if (!el) return;
    const full = el.textContent;
    let started = false;

    function type() {
      if (started) return;
      started = true;

      if (reduced) { el.textContent = full; return; }

      el.textContent = "";
      let i = 0;
      const timer = setInterval(() => {
        el.textContent = full.slice(0, ++i);
        if (i >= full.length) clearInterval(timer);
      }, 22);
    }

    document.addEventListener("site:ready", type);
    setTimeout(type, 2500); // safety: never leave it empty
  }

  /* ----------------------------------------------------------
     SCROLL-LINKED ROUTE — two modes:
     · Desktop (>900px): ELEVATION TERRAIN. A winding SVG trail
       is drawn by scroll progress while a pin travels along it
       (getPointAtLength); waypoint cards flare alive as reached.
     · Mobile: classic rail fill.
     One rAF loop; reads scrollY once per frame.
     ---------------------------------------------------------- */
  function initScrollLink() {
    const route = $("#route-map");
    const fill = $("#route-fill");
    const runner = $("#route-runner");
    const progressCell = $("#frame-progress");
    const header = $(".site-head");
    const portrait = $("#portrait");
    const svgTrack = $("#route-track");
    const svgDraw = $("#route-draw");
    const marker = $("#route-marker");
    const isDesktop = () => innerWidth > 900;

    let terrain = null;
    let ticking = false;

    function setupTerrain() {
      if (!svgTrack || !svgDraw || !marker || reduced || !isDesktop() || !route) {
        teardownTerrain();
        return;
      }
      const stops = $$(".route__stop", route);
      if (!stops.length) return;

      const L = svgTrack.getTotalLength();
      svgDraw.style.strokeDasharray = L;
      svgDraw.style.strokeDashoffset = L;

      const W = route.clientWidth;

      // viewBox is 1000 × 1500 → % of container. Card centers are
      // clamped horizontally so wide cards never spill out.
      terrain = {
        L,
        stops: stops.map((el) => {
          const f = parseFloat(el.dataset.frac) || 0.5;
          const pt = svgTrack.getPointAtLength(f * L);

          const card = el.querySelector(".waypoint__card");
          const halfCard = Math.min((card ? card.offsetWidth : 350) / 2 + 10, W / 2 - 8);
          const rawX = (pt.x / 1000) * W;
          const clampedX = Math.min(Math.max(rawX, halfCard), W - halfCard);

          el.style.left = (clampedX / W * 100) + "%";
          el.style.top = (pt.y / 1500 * 100) + "%";
          return { el, f };
        }),
      };
    }

    function teardownTerrain() {
      if (terrain) {
        terrain.stops.forEach((o) => {
          o.el.style.left = "";
          o.el.style.top = "";
        });
      }
      terrain = null;
    }

    function update() {
      ticking = false;
      const y = scrollY;
      const vh = innerHeight;

      // Header state
      header && header.classList.toggle("is-scrolled", y > 24);

      // Scroll percentage readout in the frame corner
      let pct = 0;
      if (progressCell) {
        const max = document.documentElement.scrollHeight - vh;
        pct = max > 0 ? Math.round((y / max) * 100) : 0;
        progressCell.textContent = String(pct).padStart(3, "0") + "%";
      }

      // THE TRAIL — scroll progress along the header's bottom edge
      const trail = header && header.querySelector(".site-head__trail");
      if (trail) {
        const maxAll = document.documentElement.scrollHeight - vh;
        const frac = maxAll > 0 ? clamp01(y / maxAll) : 0;
        trail.style.setProperty("--sx", frac.toFixed(4));
        trail.classList.toggle("is-live", frac > 0.002 && frac < 0.998);
      }

      if (route && fill) {
        if (terrain) {
          // --- Terrain mode: draw the trail, ride the pin ---
          const r = route.getBoundingClientRect();
          const span = r.height - vh * 0.5;
          const p = clamp01((vh * 0.55 - r.top) / (span > 0 ? span : 1));

          const drawLen = terrain.L * p;
          svgDraw.style.strokeDashoffset = Math.max(0, terrain.L - drawLen);

          const mp = svgTrack.getPointAtLength(drawLen);
          marker.style.left = (mp.x / 10) + "%";
          marker.style.top = (mp.y / 15) + "%";

          route.classList.toggle("is-moving", p > 0.004 && p < 0.996);
          terrain.stops.forEach((o) =>
            o.el.classList.toggle("is-active", p >= o.f - 0.02)
          );
        } else if (!reduced) {
          // --- Rail mode (mobile / fallback) ---
          const r = route.getBoundingClientRect();
          const total = r.height - vh * 0.5;
          const p = clamp01((vh * 0.55 - r.top) / (total > 0 ? total : 1));

          fill.style.height = (p * 100).toFixed(2) + "%";
          if (runner) runner.style.bottom = (p * 100).toFixed(2) + "%";
          route.classList.toggle("is-moving", p > 0.005 && p < 0.995);

          $$(".waypoint", route).forEach((wp) => {
            const wr = wp.getBoundingClientRect();
            wp.classList.toggle("is-active", wr.top + 30 <= vh * 0.55);
          });
        } else {
          fill.style.height = "100%";
        }
      }

      // Gentle portrait parallax on desktop only (rotate lives in
      // the CSS `rotate` property, so transform is free to use)
      if (portrait && !reduced && isDesktop()) {
        const rect = portrait.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const shift = clamp01(1 - rect.top / vh);
          portrait.style.transform = `translateY(${(-shift * 26).toFixed(1)}px)`;
        }
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    addEventListener("scroll", onScroll, { passive: true });

    let resizeTimer = null;
    addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { teardownTerrain(); setupTerrain(); update(); }, 160);
    }, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { setupTerrain(); update(); }).catch(() => {});
    }

    setupTerrain();
    update();
  }

  /* ----------------------------------------------------------
      NAV SPY — highlight the section currently on stage, and
      glide the travelling pin beneath its link (the header as
      a mini map of the page).
      ---------------------------------------------------------- */
  function initNavSpy() {
    const links = $$('.primary-nav a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;

    const nav = $(".primary-nav");
    const map = new Map();
    links.forEach((link) => {
      const sec = $(link.getAttribute("href"));
      if (sec) map.set(sec, link);
    });

    /* Travelling pin: slides under hovered / current link */
    let pin = null;
    let currentLink = null;
    if (nav) {
      pin = document.createElement("span");
      pin.className = "nav-pin";
      nav.appendChild(pin);
    }

    function movePin(link, instant) {
      if (!pin) return;
      if (!link) { pin.classList.remove("is-on"); return; }
      const x = link.offsetLeft + link.offsetWidth / 2;
      if (instant) pin.style.transition = "none";
      pin.style.transform = "translateX(" + x.toFixed(1) + "px) translateX(-50%)";
      if (instant) {
        void pin.offsetWidth; // flush so the next move animates
        pin.style.transition = "";
      }
      pin.classList.add("is-on");
    }

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => movePin(link));
      link.addEventListener("focus", () => movePin(link));
    });
    if (nav) nav.addEventListener("mouseleave", () => movePin(currentLink));

    // Re-seat once web fonts finish loading (metrics change)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => movePin(currentLink, true)).catch(() => {});
    }
    window.__atlasNavPin = movePin;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "true");
          currentLink = link;
          movePin(link);
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    map.forEach((_, sec) => io.observe(sec));
  }

  /* ----------------------------------------------------------
     CLOCKS — two readouts:
     · .js-clock        → FIELD BASE: Dhaka (GMT+6), always
     · .js-clock-local  → VISITOR: their own device timezone
     Tiers of fallback per clock: Intl zone → fixed offset →
     manual arithmetic. Never shows --:--:--, never shows 24h.
     ---------------------------------------------------------- */
  function initClock() {
    const dhakaCells = $$(".js-clock");
    const localCells = $$(".js-clock-local");
    if (!dhakaCells.length && !localCells.length) return;

    const HMS = {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hourCycle: "h23", // midnight is 00, never 24
    };

    function tryFmt(opts) {
      try { return new Intl.DateTimeFormat("en-GB", opts); }
      catch (_) { return null; }
    }

    // Field base: Dhaka. IANA zone first, fixed offset second.
    const fmtDhaka =
      tryFmt(Object.assign({ timeZone: "Asia/Dhaka" }, HMS)) ||
      tryFmt(Object.assign({ timeZone: "+06:00" }, HMS));

    // Visitor: whatever their device is set to (no timeZone = local)
    const fmtLocal = tryFmt(HMS);

    function pad(v) { return String(v).padStart(2, "0"); }

    // Manual UTC+6 fallback (used only if Intl is unavailable/broken)
    function manualDhaka() {
      const n = new Date();
      const d = new Date(n.getTime() + (n.getTimezoneOffset() + 360) * 60000);
      return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function manualLocal() {
      const d = new Date();
      return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function format(fmt, el, manualFn) {
      try { return fmt ? fmt.format(el) : manualFn(); }
      catch (_) { return manualFn(); }
    }

    function tick() {
      const now = new Date();
      if (dhakaCells.length) {
        const s = format(fmtDhaka, now, manualDhaka);
        dhakaCells.forEach((c) => (c.textContent = s));
      }
      if (localCells.length) {
        const s = format(fmtLocal, now, manualLocal);
        localCells.forEach((c) => (c.textContent = s));
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ----------------------------------------------------------
     MARQUEE — clone the ribbon's first group until the track is
     at least 2× viewport width, then hand CSS a pixel-precise
     shift distance. Guarantees a seamless loop on any screen
     (no blank seams on ultrawide, no duplicated rows).
     ---------------------------------------------------------- */
  function initMarquee() {
    const track = $(".marquee__track");
    if (!track || reduced) return;

    const base = track.firstElementChild;
    if (!base) return;

    function build() {
      // Start from a single original group every rebuild
      Array.from(track.children).forEach((child, i) => {
        if (i > 0) child.remove();
      });

      const unit = base.getBoundingClientRect().width;
      if (!unit || !isFinite(unit)) return;

      // Enough copies to cover 2 viewports + one for the wrap
      const copies = Math.max(2, Math.ceil((innerWidth * 2) / unit) + 1);
      for (let i = 1; i < copies; i++) {
        const clone = base.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      }

      // One full group-width of travel = perfect loop point
      track.style.setProperty("--shift", unit.toFixed(1) + "px");
    }

    build();

    // Re-measure when the viewport changes or fonts finish loading
    let resizeTimer = null;
    addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    }, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build).catch(() => {});
    }
  }

  /* ---------------------------------------------------------- */
  function init() {
    initReveals();
    initCounters();
    initTyping();
    initScrollLink();
    initNavSpy();
    initClock();
    initMarquee();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
