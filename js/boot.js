/* ============================================================
   boot.js — session start, transitions, easter eggs
   ------------------------------------------------------------
   - Boot overlay: quick "survey initialization", then lifts
   - Wipe shutter transition for in-page anchor navigation
   - Copy-to-clipboard buttons + honest static mailto composer
   - Mobile menu wiring, to-top, footer year
   - Easter eggs: console message for devs + hidden footer pin
   ============================================================ */

(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  // Motion is always on; kept as a hook for prefers-reduced-motion support
  const reduced = window.ATLAS_MOTION_OFF === true;

  /* ----------------------------------------------------------
     TOAST — one polite status element reused everywhere
     ---------------------------------------------------------- */
  const toastEl = $("#toast");
  let toastTimer = null;

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  }
  window.toast = toast; // exposed: the console easter egg reuses it

  /* ----------------------------------------------------------
     BOOT SEQUENCE — log lines cascade while the meter fills.
     Total ~1.1s; skipped entirely for reduced motion.
     ---------------------------------------------------------- */
  function runBoot() {
    const boot = $("#boot");
    if (!boot) { start(); return; }

    if (reduced || sessionStorage.getItem("atlas-seen")) {
      boot.remove();
      sessionStorage.setItem("atlas-seen", "1");
      start();
      return;
    }
    sessionStorage.setItem("atlas-seen", "1");

    const lines = $$(".boot__log li", boot);
    const pct = $("#boot-pct");
    const bar = $("#boot-bar");
    const DURATION = 950;
    const t0 = performance.now();

    lines.forEach((line, i) =>
      setTimeout(() => line.classList.add("on"), 90 + i * 170)
    );

    (function tick(now) {
      const p = Math.min(1, (now - t0) / DURATION);
      const eased = 1 - Math.pow(1 - p, 2);
      const val = Math.round(eased * 100);
      if (pct) pct.textContent = String(val).padStart(3, "0");
      if (bar) bar.style.width = val + "%";
      if (p < 1) requestAnimationFrame(tick);
      else finish();
    })(t0);

    function finish() {
      setTimeout(() => {
        boot.classList.add("is-done");          // clip-path lift (motion.css)
        boot.addEventListener("transitionend", () => boot.remove(), { once: true });
        setTimeout(start, 60);                  // release hero choreography
      }, 180);
    }
  }

  /* Fires hero intro + typing effect */
  function start() {
    document.body.removeAttribute("data-loading");
    document.dispatchEvent(new CustomEvent("site:ready"));
  }

  /* ----------------------------------------------------------
     WIPE TRANSITION — ink shutters cover, jump under cover,
     shutters lift. Used for all in-page anchor navigation.
     ---------------------------------------------------------- */
  const wipe = $("#wipe");
  let wiping = false;

  function wipeTo(target) {
    if (!wipe || reduced) {
      target && target.scrollIntoView({ behavior: "auto" });
      return;
    }
    if (wiping) return;
    wiping = true;

    closeMenu();
    wipe.classList.add("is-active", "is-in");

    // Cover fully → jump instantly beneath the shutters
    setTimeout(() => {
      target && target.scrollIntoView({ behavior: "auto" });
      requestAnimationFrame(() => {
        wipe.classList.remove("is-in");
        wipe.classList.add("is-out");
        setTimeout(() => {
          wipe.classList.remove("is-active", "is-out");
          wiping = false;
        }, 520);
      });
    }, 500);
  }

  /* Intercept in-page anchors (nav, CTAs, scroll cue) */
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    wipeTo(target);
  });

  /* ----------------------------------------------------------
     MOBILE MENU
     ---------------------------------------------------------- */
  const navToggle = $(".nav-toggle");

  function closeMenu() {
    document.body.classList.remove("menu-open");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle && navToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* Close menu when a nav link is chosen (before wipe runs) */
  $$('.primary-nav a').forEach((a) => a.addEventListener("click", closeMenu));

  /* ----------------------------------------------------------
     COPY BUTTONS
     ---------------------------------------------------------- */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        // file:// or permission denied — select-and-copy fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_e) {}
        ta.remove();
      }
      toast(btn.getAttribute("data-copy-toast") || "Copied to clipboard.");
    });
  });

  /* ----------------------------------------------------------
     HONEST MAILTO COMPOSER — builds a mailto: from user input.
     Nothing leaves the page; your own mail app does the sending.
     ---------------------------------------------------------- */
  const compose = $("#compose-form");
  compose && compose.addEventListener("submit", (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(compose.subject.value.trim());
    const body = encodeURIComponent(
      compose.message.value.trim() + "\n\n— sent via your Field Atlas portfolio page"
    );
    location.href = `mailto:rirakeebplus@gmail.com?subject=${subject}&body=${body}`;
    toast("Opening your mail app — nothing was sent from this page.");
  });

  /* ----------------------------------------------------------
     TO TOP
     ---------------------------------------------------------- */
  const toTop = $("#to-top");
  toTop && toTop.addEventListener("click", () => {
    const origin = $("#origin");
    origin ? wipeTo(origin) : scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  /* ----------------------------------------------------------
     FOOTER YEAR
     ---------------------------------------------------------- */
  const year = $("#year");
  year && (year.textContent = new Date().getFullYear());

  /* ----------------------------------------------------------
     THEME TOGGLE — dark mode vs light mode.
     Persists choice; no reload needed (CSS variables swap live).
     ---------------------------------------------------------- */
  function initThemeToggle() {
    const btn = $("#theme-toggle");
    if (!btn) return;

    function isDark() {
      return document.documentElement.classList.contains("dark") ||
        (!document.documentElement.classList.contains("light") &&
         window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    function sync() {
      btn.setAttribute("aria-pressed", isDark() ? "true" : "false");
      btn.title = isDark() ? "Switch to light mode" : "Switch to dark mode";
    }
    sync();

    btn.addEventListener("click", () => {
      const wasDark = isDark();
      if (wasDark) {
        // Currently dark → switch to light
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        try { localStorage.setItem("atlas-theme", "light"); } catch (_) {}
      } else {
        // Currently light → switch to dark
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        try { localStorage.setItem("atlas-theme", "dark"); } catch (_) {}
      }
      sync();
      if (window.ATLAS_THEME_SYNC) window.ATLAS_THEME_SYNC();
    });
  }
  initThemeToggle();

  /* ----------------------------------------------------------
     EASTER EGG 1 — devtools console waypoint (for recruiters
     who open DevTools before reading a single word)
     ---------------------------------------------------------- */
  window.rakibul = {
    hello() {
      toast("Ahoy, fellow debugger. You found the good path.");
      return "Hand-built with vanilla JS. Zero frameworks, zero trackers. Say hi → rirakeebplus@gmail.com";
    },
  };

  console.log(
    "%c FIELD ATLAS %c OF RAKIBUL ISLAM ",
    "background:#E8501A;color:#14110C;font-weight:bold;padding:4px 8px;",
    "background:#14110C;color:#EFE9DB;padding:4px 8px;"
  );
  console.log(
    "You opened DevTools on a portfolio — excellent instincts.\n" +
    "This whole site is vanilla HTML/CSS/JS. No frameworks, no trackers.\n" +
    "Type rakibul.hello() for your reward."
  );

  /* ----------------------------------------------------------
     EASTER EGG 2 — the shy pin hiding in the colophon
     ---------------------------------------------------------- */
  const secretPin = $("#secret-pin");
  let secrets = 0;

  secretPin && secretPin.addEventListener("click", () => {
    secrets++;
    secretPin.classList.add("is-found");
    secretPin.title = "Waypoint discovered";

    const lines = [
      "Waypoint unlocked: you found Mappin's favourite pin.",
      "Two finds. The map likes you.",
      "Cartographer rank achieved. Email me — explorers get priority.",
    ];
    toast(lines[Math.min(secrets - 1, lines.length - 1)]);

    if (secrets >= 3) {
      console.log("%c🏆 All waypoints found. This visitor reads footers.", "font-size:14px;color:#E8501A;");
    }
  });

  /* ---------------------------------------------------------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runBoot);
  } else {
    runBoot();
  }
})();
