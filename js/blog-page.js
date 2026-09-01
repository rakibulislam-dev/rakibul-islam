/* ============================================================
   blog-page.js — Dispatches pages
   ------------------------------------------------------------
   · dispatches.html  → fills #post-all with every BLOG_POSTS
     entry (newest first) using the shared card builder.
   · dispatch.html    → renders one dispatch into #article-root,
     chosen by ?d=SLUG. Sets title/meta, builds prev/next links.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const R = window.PORTFOLIO_RENDER || {};

  /* ----------------------------------------------------------
     ARCHIVE — every dispatch, newest first
     ---------------------------------------------------------- */
  function renderArchive() {
    const grid = $("#post-all");
    if (!grid || !R.buildPostCard || !R.sortedPosts) return;

    grid.innerHTML = "";
    R.sortedPosts().forEach((post, i) => {
      const card = R.buildPostCard(post);
      card.style.setProperty("--d", (i * 70) + "ms");
      grid.appendChild(card);

      if (window.__atlasRevealIO) window.__atlasRevealIO.observe(card);
      else card.classList.add("is-inview");
    });
  }

  /* ----------------------------------------------------------
     SINGLE DISPATCH — body block renderer
     body[] blocks: { h2 } | { p } | { list: [] } | { quote }
     ---------------------------------------------------------- */
  function renderBlock(parent, block) {
    if (!block) return;

    if (block.h2) {
      const h = document.createElement("h2");
      h.textContent = block.h2;
      parent.appendChild(h);
      return;
    }
    if (block.p) {
      const p = document.createElement("p");
      p.textContent = block.p;
      parent.appendChild(p);
      return;
    }
    if (Array.isArray(block.list)) {
      const ul = document.createElement("ul");
      block.list.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      parent.appendChild(ul);
      return;
    }
    if (block.quote) {
      const q = document.createElement("blockquote");
      q.className = "article__quote";
      q.textContent = block.quote;
      parent.appendChild(q);
    }
  }

  function renderSingle() {
    const root = $("#article-root");
    if (!root) return;

    const slug = new URLSearchParams(location.search).get("d") || "";
    const posts = R.sortedPosts ? R.sortedPosts() : [];
    const idx = posts.findIndex((p) => p.slug === slug);
    const post = posts[idx];

    // Unknown or missing slug → honest fallback, not a dead page
    if (!post) {
      document.title = "Dispatch not found — Rakibul Islam";
      root.innerHTML =
        '<header class="legend">' +
        '<p class="legend__no mono">SIGNAL LOST</p>' +
        '<h1 class="legend__title">Dispatch not found</h1>' +
        '<p class="legend__meta mono">THE COORDINATES DIDN\'T MATCH ANY LOG ENTRY</p>' +
        "</header>" +
        '<p class="loadout__intro"><a class="facts__link" href="dispatches.html">Browse the full dispatch log</a> ' +
        "or head back to the Field Atlas.</p>";
      return;
    }

    document.title = post.title + " — Dispatches of Rakibul Islam";

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = post.excerpt;

    /* Header — rendered plain (no data-reveal/data-split): this file
       runs AFTER motion.js's observer has scanned, so late reveal
       attributes would stay stuck at opacity:0 forever. */
    const head = document.createElement("header");
    head.className = "article__head";

    const kicker = document.createElement("p");
    kicker.className = "mono article__kicker";
    kicker.textContent = "DISPATCH N°" + String(idx + 1).padStart(2, "0") + " — " + post.tag;
    head.appendChild(kicker);

    const h1 = document.createElement("h1");
    h1.className = "article__title";
    h1.id = "article-title";
    h1.textContent = post.title;
    head.appendChild(h1);

    const stamps = document.createElement("p");
    stamps.className = "mono article__stamps";
    const d = document.createElement("span");
    d.className = "waypoint__dates";
    d.textContent = post.displayDate;
    const read = document.createElement("span");
    read.textContent = post.readMinutes + " MIN READ";
    stamps.append(d, " · ", read);
    head.appendChild(stamps);
    root.appendChild(head);

    /* Body */
    const body = document.createElement("div");
    body.className = "article__body";
    (post.body || []).forEach((block) => renderBlock(body, block));
    root.appendChild(body);

    /* Prev / next waypoint links */
    const nav = document.createElement("nav");
    nav.className = "article__next mono";
    nav.setAttribute("aria-label", "More dispatches");

    const older = posts[idx + 1];
    const newer = posts[idx - 1];

    if (older) {
      const a = document.createElement("a");
      a.href = "dispatch.html?d=" + encodeURIComponent(older.slug);
      a.setAttribute("data-cursor", "");
      a.setAttribute("data-cursor-label", "READ");
      a.innerHTML = "<span>OLDER TRANSMISSION</span><b></b>";
      a.querySelector("b").textContent = older.title;
      nav.appendChild(a);
    }
    if (newer) {
      const a = document.createElement("a");
      a.href = "dispatch.html?d=" + encodeURIComponent(newer.slug);
      a.className = "is-next";
      a.setAttribute("data-cursor", "");
      a.setAttribute("data-cursor-label", "READ");
      a.innerHTML = "<span>NEWER TRANSMISSION</span><b></b>";
      a.querySelector("b").textContent = newer.title;
      nav.appendChild(a);
    }
    if (nav.children.length) root.appendChild(nav);
  }

  /* ---------------------------------------------------------- */
  function init() {
    renderArchive();
    renderSingle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
