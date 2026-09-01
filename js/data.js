/* ============================================================
   data.js — THE SINGLE SOURCE OF TRUTH
   ------------------------------------------------------------
   Everything dynamic renders from the structures below.

   ┌─────────────────────────────────────────────────────────┐
   │  HOW TO ADD / UPDATE A PROJECT ("pin")                  │
   │                                                         │
   │  1. Edit any object in PROJECTS[] (home) or             │
   │     CASE_STUDIES[] (archive page).                      │
   │  2. `type` must match a FILTERS key.                    │
   │  3. Optional fields:                                    │
   │       link   → live URL. The hover preview grabs a REAL │
   │                full-page screenshot automatically       │
   │                (thum.io fullpage → mShots fallback).    │
   │                No link = simulated mock preview.        │
   │       domain → shown in the preview's address bar        │
   │       tint   → hex color used INSIDE the simulated       │
   │                 preview mock only                        │
   │  4. Done — lists, filters, counts and previews update.  │
   └─────────────────────────────────────────────────────────┘

   ⚠ DEMO STATE: `link` fields currently point at well-known
   public websites so previews show REAL captures. Replace each
   with your own client URL when ready — nothing else changes.
   ============================================================ */

/* Filter chips: key → label. Rendered in this order. */
const FILTERS = {
  all:          "All terrain",
  ecommerce:    "E-commerce",
  marketplace:  "Marketplace",
  booking:      "Booking",
  lms:          "LMS",
  realestate:   "Real estate",
  headless:     "Headless",
  ai:           "AI & automation",
};

const PROJECTS = [
  {
    id: "pin-01",
    title: "Vital Guard Pharma",
    type: "marketplace",
    meta: "B2B PHARMACEUTICAL DISTRIBUTION",
    coord: "GRID 04 · 11",
    domain: "vitalguardpharma.com",
    tint: "#2F9E44",
    summary:
      "B2B ordering platform for a pharmaceutical distributor serving wholesalers, pharmacies, and clinics. Built with B2B King for account approval workflows plus heavy custom development, and a fully custom WooCommerce dashboard rebuilt with added features.",
    scope: ["B2B King account approval workflows", "Custom WooCommerce dashboard rebuild", "Wholesaler, pharmacy & clinic ordering", "Role-based pricing and approval logic"],
    stack: ["WooCommerce", "B2B King", "ACF Pro", "PHP", "MySQL"],
    outcome: "OUTCOME // Streamlined B2B ordering for pharmaceutical distribution.",
    link: "https://vitalguardpharma.com",
  },
  {
    id: "pin-02",
    title: "Bush 2 City Adventure",
    type: "booking",
    meta: "LUXURY SAFARI TOUR BOOKING",
    coord: "GRID 07 · 03",
    domain: "bush2cityadventure.com",
    tint: "#D8222A",
    summary:
      "Travel booking site with dynamic tour filtering by country, park, style, and budget across 180+ packages, custom quote-request forms, and Google/TripAdvisor review integration.",
    scope: ["Dynamic tour filtering (country, park, style, budget)", "180+ package listings with custom layouts", "Quote-request forms with automated workflows", "Google & TripAdvisor review integration"],
    stack: ["WooCommerce", "ACF Pro", "JetEngine", "Elementor Pro", "REST API"],
    outcome: "OUTCOME // Full-featured safari booking platform with real-time filtering.",
    link: "https://bush2cityadventure.com",
  },
  {
    id: "pin-03",
    title: "DXB Industries",
    type: "realestate",
    meta: "REAL ESTATE LEAD GENERATION",
    coord: "GRID 02 · 09",
    domain: "dxb-industries.com",
    tint: "#003580",
    summary:
      "Lead-generation site for a real estate/land-buying business with multi-step lead capture forms, dynamic comparison tables, and Calendly booking integration.",
    scope: ["Multi-step lead capture forms", "Dynamic property comparison tables", "Calendly booking integration", "Lead routing and CRM sync"],
    stack: ["WordPress", "ACF Pro", "JetFormBuilder", "Calendly API", "n8n"],
    outcome: "OUTCOME // Streamlined lead generation pipeline for real estate acquisition.",
    link: "https://dxb-industries.com",
  },
  {
    id: "pin-04",
    title: "Sell Your Strips",
    type: "ecommerce",
    meta: "MEDICAL SUPPLY BUYBACK",
    coord: "GRID 09 · 06",
    domain: "sellyourstripsusa.com",
    tint: "#FF6B35",
    summary:
      "Site for a business purchasing unused diabetic test strips from individuals, with custom quote/submission forms and a streamlined buyer workflow.",
    scope: ["Custom quote and submission forms", "Streamlined buyer workflow", "Product condition assessment logic", "Payment processing integration"],
    stack: ["WordPress", "WooCommerce", "ACF Pro", "JetFormBuilder", "REST API"],
    outcome: "OUTCOME // Simplified the test-strip buyback process with custom submission flows.",
    link: "https://sellyourstripsusa.com",
  },
  {
    id: "pin-05",
    title: "Publisign",
    type: "headless",
    meta: "EV CHARGING SOLUTIONS · MULTILINGUAL",
    coord: "GRID 01 · 12",
    domain: "publisign.be",
    tint: "#10A37F",
    summary:
      "Corporate site for a Belgium-based EV-charging infrastructure manufacturer; multilingual setup (EN/NL/FR), service/product catalog structure, and B2B contact workflows.",
    scope: ["Multilingual setup (EN/NL/FR) with language switcher", "Service/product catalog structure", "B2B contact and inquiry workflows", "Corporate brand implementation"],
    stack: ["WordPress", "WPML", "ACF Pro", "Elementor Pro", "REST API"],
    outcome: "OUTCOME // Full trilingual corporate presence for EV-charging infrastructure manufacturer.",
    link: "https://publisign.be",
  },
];

/* ------------------------------------------------------------
   SKILL GROUPS — the "Loadout" modules.
   To add a module: append { name, code, blurb, items[] }.
   ------------------------------------------------------------ */
const SKILL_GROUPS = [
  {
    name: "Page Builders & CMS",
    code: "MOD-01",
    blurb: "Building sites clients can actually run without calling me for every comma.",
    items: ["WordPress", "WooCommerce", "Elementor", "Divi", "Gutenberg", "ACF Pro", "Crocoblock Suite", "B2B King", "Multilingual (WPML / Polylang)"],
  },
  {
    name: "Code & Data",
    code: "MOD-02",
    blurb: "Where page builders end and real problems begin - hooks, queries, integrations.",
    items: ["PHP", "JavaScript", "HTML5", "CSS3", "MySQL", "REST API", "Webhooks", "Custom Plugins", "Hooks & Filters"],
  },
  {
    name: "Infrastructure & Ops",
    code: "MOD-03",
    blurb: "The part most portfolios hide: I run the servers the sites actually live on.",
    items: ["SSH", "cPanel/WHM", "NGINX", "Cloudflare", "WP-CLI", "AWS", "DigitalOcean", "Cloudways", "Git"],
  },
  {
    name: "Performance & Security",
    code: "MOD-04",
    blurb: "Speed is a feature; uptime is a promise. Both are measured, not vibes.",
    items: ["Core Web Vitals", "Wordfence", "Security Hardening", "Caching", "Image Pipelines", "Uptime Monitoring"],
  },
  {
    name: "Automation & AI",
    code: "MOD-05",
    blurb: "If a task happens twice, it gets wired into a pipeline. Including the boring ones.",
    items: ["n8n", "Zapier", "Make", "OpenAI Integration", "Stripe", "PayPal", "CRM Integrations"],
  },
];

/* ------------------------------------------------------------
   ROUTE — experience waypoints plotted along the elevation trail.
   `frac` = position along the SVG path (0 start → 1 summit end).
   ------------------------------------------------------------ */
const ROUTE_FRACTIONS = [0.04, 0.35, 0.65, 0.92];

const ROUTE = [
  {
    kicker: "WAYPOINT 00",
    dates: "2018 - 2022",
    role: "Diploma in Computer Technology",
    org: "PATUAKHALI POLYTECHNIC INSTITUTE",
    points: [
      "First line of code, first broken localhost, first all-nighter fixing both.",
      "Fell for the web specifically: visible results, immediate feedback.",
      "Foundation in computer technology and engineering.",
    ],
  },
  {
    kicker: "WAYPOINT 01",
    dates: "2022 - EARLY YEARS",
    role: "WordPress Developer - Freelance & Agency Work",
    org: "LEARNING THE TERRAIN",
    points: [
      "Cut my teeth on business sites, small stores, and rescue jobs other devs abandoned.",
      "Learned that deadlines, backups and communication ship products - not just code.",
      "Began B.Sc. in Computer Science & Engineering at Bangladesh University (in progress).",
    ],
  },
  {
    kicker: "WAYPOINT 02",
    dates: "SEPT 2022 - PRESENT",
    role: "Senior WordPress Developer",
    org: "SOFTVENCE AGENCY (FIVERR) - REMOTE",
    points: [
      "Manage full client lifecycle for international clients via Fiverr, from discovery calls through scoping, development, and delivery.",
      "Deliver WordPress websites across e-commerce, corporate, service, real estate, travel, and healthcare projects.",
      "Build advanced dynamic content with ACF Pro and the Crocoblock plugin suite.",
      "Integrate REST APIs, webhooks, AI features, and payment gateways into client sites.",
      "Published Mappin Location Locator on the official WordPress.org repository.",
    ],
  },
  {
    kicker: "SUMMIT",
    dates: "PRESENT",
    role: "Team Lead - WordPress Development Squad",
    org: "SOFTVENCE AGENCY - 8 DEVELOPERS",
    points: [
      "Lead an 8-person WordPress development team, running daily sprint planning, mentoring, and resolving technical blockers.",
      "Communicate directly with clients via video calls, live meetings, and text throughout every project.",
      "Still writes PHP on Fridays. Some habits are load-bearing.",
    ],
  },
];

/* ============================================================
   CASE STUDIES — the archive page (case-studies.html)
   ------------------------------------------------------------
   ⚠ DEMO ENTRIES: famous public websites powering real live
   captures. Replace objects with your client work (same fields)
   whenever ready — previews follow automatically.
   ============================================================ */
const CASE_STUDIES = [
  {
    id: "cs-01",
    title: "Vital Guard Pharma - B2B Pharmaceutical Distribution",
    type: "marketplace",
    meta: "B2B PHARMACEUTICAL DISTRIBUTION",
    coord: "CS 01 - 08",
    domain: "vitalguardpharma.com",
    tint: "#2F9E44",
    summary: "B2B ordering platform for a pharmaceutical distributor serving wholesalers, pharmacies, and clinics. Built with B2B King for account approval workflows plus heavy custom development, and a fully custom WooCommerce dashboard rebuilt with added features.",
    scope: ["B2B King account approval workflows", "Custom WooCommerce dashboard rebuild", "Wholesaler, pharmacy & clinic ordering"],
    stack: ["WooCommerce", "B2B King", "ACF Pro", "PHP", "MySQL"],
    outcome: "OUTCOME // Streamlined B2B ordering for pharmaceutical distribution.",
    link: "https://vitalguardpharma.com",
  },
  {
    id: "cs-02",
    title: "Bush 2 City Adventure - Luxury Safari Tours",
    type: "booking",
    meta: "SAFARI TOUR BOOKING",
    coord: "CS 02 - 08",
    domain: "bush2cityadventure.com",
    tint: "#D8222A",
    summary: "Travel booking site with dynamic tour filtering by country, park, style, and budget across 180+ packages, custom quote-request forms, and Google/TripAdvisor review integration.",
    scope: ["Dynamic tour filtering", "180+ package listings", "Google & TripAdvisor reviews"],
    stack: ["WooCommerce", "ACF Pro", "JetEngine", "Elementor Pro"],
    outcome: "OUTCOME // Full-featured safari booking platform with real-time filtering.",
    link: "https://bush2cityadventure.com",
  },
  {
    id: "cs-03",
    title: "DXB Industries - Real Estate Lead Generation",
    type: "realestate",
    meta: "REAL ESTATE LEAD GEN",
    coord: "CS 03 - 08",
    domain: "dxb-industries.com",
    tint: "#003580",
    summary: "Lead-generation site for a real estate/land-buying business with multi-step lead capture forms, dynamic comparison tables, and Calendly booking integration.",
    scope: ["Multi-step lead capture", "Dynamic comparison tables", "Calendly integration"],
    stack: ["WordPress", "ACF Pro", "JetFormBuilder", "n8n"],
    outcome: "OUTCOME // Streamlined lead generation for real estate acquisition.",
    link: "https://dxb-industries.com",
  },
  {
    id: "cs-04",
    title: "Sell Your Strips - Medical Supply Buyback",
    type: "ecommerce",
    meta: "MEDICAL SUPPLY BUYBACK",
    coord: "CS 04 - 08",
    domain: "sellyourstripsusa.com",
    tint: "#FF6B35",
    summary: "Site for a business purchasing unused diabetic test strips from individuals, with custom quote/submission forms and a streamlined buyer workflow.",
    scope: ["Custom quote forms", "Buyer workflow", "Payment processing"],
    stack: ["WordPress", "WooCommerce", "ACF Pro", "JetFormBuilder"],
    outcome: "OUTCOME // Simplified the test-strip buyback process.",
    link: "https://sellyourstripsusa.com",
  },
  {
    id: "cs-05",
    title: "Publisign - EV Charging Solutions",
    type: "headless",
    meta: "MULTILINGUAL CORPORATE",
    coord: "CS 05 - 08",
    domain: "publisign.be",
    tint: "#10A37F",
    summary: "Corporate site for a Belgium-based EV-charging infrastructure manufacturer; multilingual setup (EN/NL/FR), service/product catalog structure, and B2B contact workflows.",
    scope: ["Multilingual (EN/NL/FR)", "Product catalog", "B2B workflows"],
    stack: ["WordPress", "WPML", "ACF Pro", "Elementor Pro"],
    outcome: "OUTCOME // Full trilingual corporate presence for EV-charging manufacturer.",
    link: "https://publisign.be",
  },
];

/* ============================================================
   DISPATCHES — the blog (home teaser + dispatches.html +
   single posts on dispatch.html?d=SLUG).
   ------------------------------------------------------------
   ┌─────────────────────────────────────────────────────────┐
   │  HOW TO PUBLISH A DISPATCH                              │
   │                                                         │
   │  1. Append one object to BLOG_POSTS[]. Newest first.    │
   │  2. body[] is a list of blocks:                         │
   │       { h2: "Heading" }                                 │
   │       { p:  "Paragraph text." }                         │
   │       { list: ["one", "two"] }                          │
   │       { quote: "A line worth stamping." }               │
   │  3. Done — home teaser, archive and single page all     │
   │     update automatically.                               │
   └─────────────────────────────────────────────────────────┘
   ============================================================ */
const BLOG_POSTS = [
  {
    slug: "the-one-second-woocommerce-budget",
    title: "The One-Second WooCommerce Budget",
    tag: "PERFORMANCE",
    date: "2026-07-12",
    displayDate: "JUL 2026",
    readMinutes: 6,
    excerpt:
      "Every store I inherit breaks the same promise: it spends its second on things nobody sees. Here's the budget I enforce on every WooCommerce build — and what gets cut first.",
    body: [
      { p: "A store has exactly one job before a customer ever sees a product: get out of the way. When I audit a slow WooCommerce build, I don't start with plugins or caching tiers. I start with the same question — where is the first second going?" },
      { h2: "The budget, line by line" },
      { p: "On 4G, a store gets roughly one second of goodwill before the customer's thumb starts judging. My working split: server think-time under 400ms, critical CSS and hero imagery inside the next 400ms, and everything else — widgets, trackers, wishlist scripts, popups — waits its turn behind interaction." },
      { list: [
        "Server response ≤ 400ms — full-page cache plus object cache, no exceptions",
        "LCP element ≤ 800ms cumulative — usually one hero image, preloaded",
        "Zero render-blocking third parties in the head",
        "Cart fragments off every page that isn't cart or checkout",
      ] },
      { h2: "What gets cut first" },
      { p: "Inherited stores almost always spend their budget on the same suspects: a page builder loading its full library on every route, six tracking pixels firing at once, and cart fragments turning every page into an uncached AJAX request. Cutting those three routinely takes a store from five seconds to under two — before we've bought a single premium optimization plugin." },
      { quote: "Speed is not a plugin you install. It's a budget you enforce." },
      { p: "The teams I lead ship against these numbers in staging, measured with the browser throttled to real 4G — because the lab that matters is the one in your customer's hand." },
    ],
  },
  {
    slug: "how-i-review-a-wordpress-build",
    title: "How I Review a WordPress Build Before It Ships",
    tag: "PROCESS",
    date: "2026-05-28",
    displayDate: "MAY 2026",
    readMinutes: 5,
    excerpt:
      "Leading an eight-developer squad means most code I ship is reviewed, not written. This is the checklist that keeps sites standing — and the three failures I see every single week.",
    body: [
      { p: "When a build lands in my review queue, I'm not looking for perfect code. I'm looking for the places it will fail at 2am on a launch night. After a few hundred reviews, the same patterns surface again and again." },
      { h2: "The three weekly failures" },
      { list: [
        "Hardcoded URLs — staging domains baked into content or options, waiting to break migration day",
        "Queries without limits — a custom loop that returns 'all posts' until the catalog grows past 500 products",
        "Silent failure — try/catch blocks that swallow errors so thoroughly even the logs give up",
      ] },
      { h2: "What actually earns a pass" },
      { p: "The builds that sail through share a trait: the next developer could inherit them cold. Constants declared in one place. Data flows documented in the PR description. WP-CLI commands for anything the client will do more than twice." },
      { quote: "A handover should read like a map, not a mystery." },
      { p: "None of this is talent. It's a checklist applied without mercy — which is fortunate, because talent doesn't scale to eight developers. Checklists do." },
    ],
  },
  {
    slug: "shipping-mappin-lessons-from-wp-org",
    title: "Shipping Mappin: Lessons from the WordPress.org Repo",
    tag: "PLUGINS",
    date: "2026-03-09",
    displayDate: "MAR 2026",
    readMinutes: 7,
    excerpt:
      "Publishing Mappin Location Locator taught me more about WordPress than any client project — mostly because the entire world becomes your code reviewer, and none of them are polite.",
    body: [
      { p: "Client work has guardrails: a scope, a deadline, one stakeholder who signs off. The WordPress.org repository has none of those. You publish, strangers install, and every assumption you quietly made becomes someone's broken Monday morning." },
      { h2: "Assumption number one falls first" },
      { p: "My first round of support requests weren't about maps at all — they were about hosting environments I'd never seen: PHP versions older than my career, memory limits measured in megabytes, caching plugins that treated my enqueued scripts as enemies. Building for the repo means building for WordPress as it actually exists, not as the docs describe it." },
      { h2: "What the plugin gave back" },
      { list: [
        "Defensive coding habits that now show up in every client build I architect",
        "A public readme and changelog discipline the whole team adopted",
        "The strangest education in i18n available — location data is cultural data",
      ] },
      { quote: "One public plugin teaches more than ten private ones." },
      { p: "If you lead a WordPress team and nobody on it has shipped something public, fix that. The repo is the only reviewer that never lets you lean on charm." },
    ],
  },
  {
    slug: "staging-is-not-optional",
    title: "Staging Is Not Optional (and Other Expensive Beliefs)",
    tag: "OPS",
    date: "2026-01-18",
    displayDate: "JAN 2026",
    readMinutes: 4,
    excerpt:
      "'It's a small change, we'll do it live.' Four words that have funded half the rescue missions of my career. A short field report on why boring infrastructure wins.",
    body: [
      { p: "Nobody plans a disaster. They plan a small change on a Friday. The rescue calls I take almost never start with 'we made a reckless decision' — they start with a reasonable one made directly on production, because staging felt like ceremony for a site this size." },
      { h2: "The boring stack that never pages me" },
      { list: [
        "Staging before production — cloned, password-protected, actually used",
        "Git before 'final_v2' — one branch per change, merged by someone who didn't write it",
        "Automated backups with a restore drill — an untested backup is a hope, not a backup",
        "Uptime monitoring wired to Slack — if it isn't monitored, it's already down",
      ] },
      { p: "None of this is expensive. An hour of setup per site, maybe two. What is expensive is the phone call that begins with 'the checkout page is just blank' on the biggest sales day of the year." },
      { quote: "Boring dependencies, exciting features. Never the reverse." },
      { p: "My field principles aren't aesthetic preferences. Each one is a scar with a name." },
    ],
  },
];
