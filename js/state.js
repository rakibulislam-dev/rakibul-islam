/* ============================================================
   state.js — theme preference (must load before all other JS)

   Theme follows OS preference (prefers-color-scheme) by default.
   The THEME toggle in the header overrides it; the choice is
   remembered in localStorage and applied as html.dark or
   html.light. Removing both classes lets OS preference win again.

   Motion is always ON (the old MOTION toggle was retired); any
   stale "atlas-motion" value in localStorage is ignored and cleared.
   ============================================================ */

(function () {
  "use strict";

  /* --- Motion preference ------------------------------------ */
  window.ATLAS_MOTION_OFF = false;

  // Clear leftovers from the retired MOTION toggle
  try { localStorage.removeItem("atlas-motion"); } catch (_) {}
  document.documentElement.classList.remove("motion-off");

  /* --- Theme preference ------------------------------------- */
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("atlas-theme"); } catch (_) {}

  // savedTheme: "dark" | "light" | null (follow OS)
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (savedTheme === "light") {
    document.documentElement.classList.add("light");
  }
  // null = no class added → OS prefers-color-scheme wins

  // Update meta theme-color for browser chrome
  function syncThemeColor() {
    var isDark = document.documentElement.classList.contains("dark") ||
      (!document.documentElement.classList.contains("light") &&
       window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? "#15110D" : "#F3EEE3";
  }
  syncThemeColor();

  // Listen for OS changes when no manual override is active
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncThemeColor);
  }

  // Expose for the toggle button
  window.ATLAS_THEME_SYNC = syncThemeColor;
})();
