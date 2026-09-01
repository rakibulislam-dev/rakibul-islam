/* ============================================================
   cursor.js — custom cursor + magnetic elements
   ------------------------------------------------------------
   A ring lerps behind an instant dot. Elements tagged with
   [data-cursor-label] turn the ring into a labeled pill
   (VIEW / COPY / SEND …). [data-magnetic] elements lean toward
   the pointer while hovered.

   Only runs on fine pointers (mouse) with motion allowed.
   ============================================================ */

(function () {
  "use strict";

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!fine) return; // native cursor stays on touch devices

  // Calm mode (MOTION · OFF): cursor still works but follows
  // instantly and magnetic pull is disabled.
  const CALM = window.ATLAS_MOTION_OFF === true;

  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  const ring = cursor.querySelector(".cursor__ring");
  const dot = cursor.querySelector(".cursor__dot");
  const label = cursor.querySelector(".cursor__label");

  /* --- Pointer state -------------------------------------- */
  let mx = innerWidth / 2;
  let my = innerHeight / 2;   // raw pointer position
  let rx = mx, ry = my;       // lerped ring position

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!cursor.classList.contains("is-on")) cursor.classList.add("is-on");
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });

  document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
  document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));
  document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));

  /* --- Render loop: only the ring needs lerping ------------- */
  (function loop() {
    const k = CALM ? 1 : 0.16; // calm mode: instant follow, no drift
    rx += (mx - rx) * k;
    ry += (my - ry) * k;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();

  /* --- Contextual states via event delegation --------------- */
  const LABEL_SELECTOR = "[data-cursor-label], a[href], button";

  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest(LABEL_SELECTOR);
    if (!target) return;

    const text = target.getAttribute("data-cursor-label");
    if (text) {
      label.textContent = text.toUpperCase();
      cursor.classList.add("is-label");
      ring.style.rotate = "0deg";
    } else {
      // Plain link/button: grow the ring, slight tilt for life
      cursor.classList.add("is-hover");
      ring.style.rotate = "12deg";
      ring.style.width = "46px";
      ring.style.height = "46px";
      ring.style.borderColor = "var(--accent-ink)";
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (!e.target.closest(LABEL_SELECTOR)) return;
    cursor.classList.remove("is-label", "is-hover");
    ring.style.removeProperty("width");
    ring.style.removeProperty("height");
    ring.style.removeProperty("border-color");
    ring.style.rotate = "0deg";
  });

  // Hide label state while actually pressing (feels like a click "stamp")
  document.addEventListener("mousedown", (e) => {
    if (e.target.closest(LABEL_SELECTOR)) cursor.classList.remove("is-label");
  });
  document.addEventListener("mouseup", (e) => {
    const overLabelled = e.target.closest && e.target.closest("[data-cursor-label]");
    if (overLabelled) cursor.classList.add("is-label");
  });

  /* --- Magnetic elements ------------------------------------
     [data-magnetic] leans toward the pointer within its bounds.
     Uses transform translate only — cheap and reversible. */
  const magnets = Array.from(document.querySelectorAll("[data-magnetic]"));
  const STRENGTH = CALM ? 0 : 0.28;
  const RANGE = 8;

  magnets.forEach((el) => {
    let raf = null;
    let tx = 0, ty = 0;

    function pull(e) {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      tx = Math.max(-RANGE * 2, Math.min(RANGE * 2, dx)) * STRENGTH;
      ty = Math.max(-RANGE, Math.min(RANGE, dy)) * STRENGTH;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function apply() {
      raf = null;
      el.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
    }

    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      el.style.translate = "";
    }

    el.addEventListener("mouseenter", () => el.classList.add("is-magnetic"));
    el.addEventListener("mousemove", pull);
    el.addEventListener("mouseleave", reset);
  });

  document.body.classList.add("has-cursor");
})();
