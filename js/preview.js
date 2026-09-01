/* ============================================================
   preview.js — the floating site preview
   ------------------------------------------------------------
   Speed strategy (screenshots are generated server-side, so the
   client works AROUND that latency):

     1. WARM-UP — right after page load (idle callback), every
        project URL is prefetched once via new Image(). Providers
        generate + cache the capture; by the time anyone hovers,
        the browser serves it from memory/cache. Near-instant.

     2. INSTANT CONTENT — hovering paints the tinted mock site
        IMMEDIATELY (0 ms). The real capture loads behind it and
        swaps in when ready; if it takes >4s the mock simply stays
        ("capture pending"), and the swap still happens whenever
        it lands while the popup is open.

     3. PROVIDER CHAIN — thum.io full-page (whole desktop view,
        miniaturised, glides top→bottom) → WordPress mShots →
        stay on mock.

   Calm mode freezes inner scrolling; captures still display.
   ============================================================ */

(function () {
  "use strict";

  const CALM = window.ATLAS_MOTION_OFF === true;
  const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Smaller width = faster generation, still crisp at 400px */
  const PROVIDERS = [
    (url) => "https://image.thum.io/get/width/1000/fullpage/noanimate/" + url,
    (url) => "https://s0.wp.com/mshots/v1/" + encodeURIComponent(url) + "?w=1000",
  ];

  /* Shared capture API — used by the hover popup on desktop AND
     by inline captures on touch devices (mobile.css / render.js). */
  window.AtlasCapture = {
    isTouch: !FINE,
    urlFor: (link) => PROVIDERS[0](link),
  };

  /* --- Warm-up: prefetch every capture while the page idles ----.
     Runs on BOTH input types so expanded pins on phones are hot. */
  function warmUp() {
    const links = new Set();
    (window.PROJECTS || []).forEach((p) => p.link && links.add(p.link));
    (window.CASE_STUDIES || []).forEach((p) => p.link && links.add(p.link));

    const queue = [...links];
    let i = 0;

    function tick() {
      if (i >= queue.length) return;
      const probe = new Image();
      probe.src = PROVIDERS[0](queue[i++]);
      setTimeout(tick, 600); // polite pacing, no request storm
    }
    tick();
  }

  const idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 2000); };
  idle(warmUp, { timeout: 6000 });

  /* Touch devices get inline captures instead of the popup —
     everything below powers the cursor-following window only. */
  if (!FINE) return;

  /* --- Element ------------------------------------------------ */
  let el = null, page = null, urlEl = null, badgeEl = null;

  function ensure() {
    if (!el) {
      el = document.createElement("aside");
      el.className = "preview";
      el.id = "pin-preview";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML =
        '<div class="preview__chrome">' +
        '  <span class="preview__dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '  <span class="preview__url mono">https://…</span>' +
        '  <span class="preview__badge mono">PREVIEW</span>' +
        "</div>" +
        '<div class="preview__viewport"><div class="preview__page"></div></div>';
      document.body.appendChild(el);
    }
    page = el.querySelector(".preview__page");
    urlEl = el.querySelector(".preview__url");
    badgeEl = el.querySelector(".preview__badge");
  }

  /* --- Glide scheduling ----------------------------------------- */
  function scheduleScroll() {
    page.style.animationDuration = "";
    if (CALM) return;
    requestAnimationFrame(() => {
      const h = page.scrollHeight || page.getBoundingClientRect().height;
      if (h > 340) {
        page.style.animationDuration =
          Math.min(18, Math.max(6, h / 110)).toFixed(1) + "s";
        page.classList.add("is-playing");
      }
    });
  }

  /* --- Mock site builder ------------------------------------------ */
  function mockHTML(p) {
    const year = (p.meta.match(/\d{4}/) || ["20XX"])[0];
    return (
      '<div class="pv-hero">' +
      '  <p class="pv-kicker mono">' + p.meta + "</p>" +
      '  <h4 class="pv-title">' + p.title + "</h4>" +
      '  <div class="pv-cta" aria-hidden="true"><i></i><i></i></div>' +
      "</div>" +
      '<div class="pv-block pv-block--stripes" aria-hidden="true"></div>' +
      '<div class="pv-split" aria-hidden="true">' +
      '  <div class="pv-block"></div>' +
      '  <div class="pv-lines"><i></i><i></i><i></i><i style="width:58%"></i></div>' +
      "</div>" +
      '<div class="pv-stats mono" aria-hidden="true">' +
      "  <b>" + (p.coord || "GRID 00 · 00") + "</b><b>EST " + year + "</b><b>WORDPRESS CORE</b>" +
      "</div>" +
      '<div class="pv-split" aria-hidden="true">' +
      '  <div class="pv-lines"><i></i><i style="width:82%"></i><i style="width:64%"></i></div>' +
      '  <div class="pv-block pv-block--tall"></div>' +
      "</div>" +
      '<div class="pv-footer mono" aria-hidden="true">© ' + (p.domain || "example.com") + "</div>"
    );
  }

  function paintMock(p, badge) {
    badgeEl.textContent = badge || "SIMULATED PREVIEW";
    page.classList.remove("is-playing");
    page.style.setProperty("--tint", p.tint || "#E8501A");
    page.innerHTML = mockHTML(p);
  }

  /* --- Real capture with instant-mock-first UX --------------------- */
  let currentToken = 0;
  const CAPTURE_TIMEOUT = 4000;

  function renderShot(p) {
    const my = ++currentToken;
    let settled = false;
    let mockVisible = false;
    let providerIndex = 0;
    let lateTimer = null;

    urlEl.textContent = "https://" + (p.domain || "preview");

    /* 1) Instant content: mock first, zero waiting */
    paintMock(p, "SIMULATED · CAPTURE LOADING");

    function finishWithCapture(img) {
      if (my !== currentToken) return; // user moved on — discard
      settled = true;
      clearTimeout(lateTimer);
      badgeEl.textContent = "LIVE CAPTURE";
      page.classList.remove("is-playing");
      page.innerHTML = "";
      page.appendChild(img);
      requestAnimationFrame(() => img.classList.add("is-loaded"));
      scheduleScroll();
    }

    function failToMock(msg) {
      if (my !== currentToken || settled) return;
      settled = true;
      clearTimeout(lateTimer);
      paintMock(p, msg || "SIMULATED PREVIEW");
      scheduleScroll();
    }

    const img = document.createElement("img");
    img.className = "pv-shot";
    img.alt = "Live capture of " + (p.domain || p.link);

    img.addEventListener("load", () => {
      if (img.naturalWidth > 60 && img.naturalHeight > 60) finishWithCapture(img);
      else nextProvider();
    });
    img.addEventListener("error", () => nextProvider());

    function nextProvider() {
      if (settled && mockVisible === false) { /* hard-failed already */ }
      providerIndex++;
      if (providerIndex >= PROVIDERS.length) {
        failToMock("SIMULATED PREVIEW · CAPTURE UNAVAILABLE");
        return;
      }
      load();
    }

    function load() {
      img.src = PROVIDERS[providerIndex](p.link);
    }

    /* 2) If the capture is slow, keep the mock useful */
    lateTimer = setTimeout(() => {
      if (my !== currentToken || settled) return;
      mockVisible = true;
      paintMock(p, "SIMULATED · CAPTURE LOADING"); // ensures glide too
      scheduleScroll();
      // capture keeps loading; swaps in automatically on finish
    }, 900); // quick pass-off so the user ALWAYS sees motion

    load();
  }

  /* --- Follow loop -------------------------------------------------- */
  let tx = 0, ty = 0, x = 0, y = 0, visible = false;

  function place() {
    if (!visible || !el) return;
    const w = el.offsetWidth || 420;
    const h = el.offsetHeight || 400;
    const pad = 14;

    let left = x + 30;
    let top = y + 26;
    if (left + w > innerWidth - pad) left = x - w - 30;
    if (top + h > innerHeight - pad) top = Math.max(pad, y - h - 26);
    left = Math.max(pad, Math.min(left, innerWidth - w - pad));
    top = Math.max(pad, Math.min(top, innerHeight - h - pad));

    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  (function loop() {
    x += (tx - x) * (CALM ? 1 : 0.14);
    y += (ty - y) * (CALM ? 1 : 0.14);
    place();
    requestAnimationFrame(loop);
  })();

  /* --- Public API ----------------------------------------------------- */
  window.PinPreview = {
    show(project, e) {
      ensure();

      urlEl.textContent = "https://" + (project.domain || "preview");

      if (project.link) renderShot(project);
      else {
        paintMock(project, "SIMULATED PREVIEW");
        scheduleScroll();
      }

      tx = x = e ? e.clientX : innerWidth / 2;
      ty = y = e ? e.clientY : innerHeight / 2;
      visible = true;
      el.classList.add("is-on");
      place();
    },

    move(e) { tx = e.clientX; ty = e.clientY; },

    hide() {
      visible = false;
      if (!el) return;
      el.classList.remove("is-on");
      page.classList.remove("is-playing");
    },
  };
})();
