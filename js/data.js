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

   Every project below is a live client build — the hover preview
   grabs a REAL full-page capture of the live URL automatically
   (thum.io fullpage → mShots fallback). No link = simulated mock.
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
    id: "pin-02",
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
const ROUTE_FRACTIONS = [0.08, 0.52, 0.94];

const ROUTE = [
  {
    kicker: "WAYPOINT 01",
    dates: "APR 2022 - JUL 2024",
    role: "WordPress Developer — Freelance",
    org: "SELF-EMPLOYED · DHAKA, BANGLADESH · REMOTE",
    points: [
      "Delivered 65+ WordPress and WooCommerce websites end to end — discovery, build, QA, handoff.",
      "Built dynamic, client-editable sites with Elementor, WooCommerce and ACF Pro.",
      "Applied on-page SEO, security hardening and performance tuning as standard on every build.",
      "Ran it fully remote — international clients across time zones, no account manager to lean on.",
    ],
  },
  {
    kicker: "WAYPOINT 02",
    dates: "AUG 2024 - PRESENT",
    role: "Senior WordPress Developer",
    org: "SOFTVENCE AGENCY · DHAKA OFFICE · FIVERR-BASED CLIENTS",
    points: [
      "Went full-time at Softvence after two years solo — working from the agency's office on Fiverr-based international projects.",
      "Shipped 100+ websites across e-commerce, corporate, real estate, travel and service industries.",
      "Architected dynamic ACF Pro / Crocoblock systems clients can run themselves post-launch.",
      "Delivered 30+ integrations: REST APIs, webhooks, AI features and payment gateways.",
    ],
  },
  {
    kicker: "SUMMIT",
    dates: "PRESENT",
    role: "Team Lead — WordPress Development Squad",
    org: "SOFTVENCE AGENCY · 8 DEVELOPERS",
    points: [
      "Lead an 8-person team: daily sprint planning, mentoring, clearing technical blockers.",
      "Own client communication across time zones — daily video calls, live meetings, written updates.",
      "Maintain a 90%+ on-time delivery rate, flagging timeline changes early on complex work.",
      "Still writes PHP on Fridays. Some habits are load-bearing.",
    ],
  },
];

/* ============================================================
   CASE STUDIES — the archive page (case-studies.html)
   ------------------------------------------------------------
   ============================================================ */
const CASE_STUDIES = [
  {
    id: "cs-01",
    title: "Bush 2 City Adventure - Luxury Safari Tours",
    type: "booking",
    meta: "SAFARI TOUR BOOKING",
    coord: "CS 01 - 09",
    domain: "bush2cityadventure.com",
    tint: "#D8222A",
    summary: "Travel booking site with dynamic tour filtering by country, park, style, and budget across 180+ packages, custom quote-request forms, and Google/TripAdvisor review integration.",
    scope: ["Dynamic tour filtering", "180+ package listings", "Google & TripAdvisor reviews"],
    stack: ["WooCommerce", "ACF Pro", "JetEngine", "Elementor Pro"],
    outcome: "OUTCOME // Full-featured safari booking platform with real-time filtering.",
    link: "https://bush2cityadventure.com",
  },
  {
    id: "cs-02",
    title: "Vital Guard Pharma - B2B Pharmaceutical Distribution",
    type: "marketplace",
    meta: "B2B PHARMACEUTICAL DISTRIBUTION",
    coord: "CS 02 - 09",
    domain: "vitalguardpharma.com",
    tint: "#2F9E44",
    summary: "B2B ordering platform for a pharmaceutical distributor serving wholesalers, pharmacies, and clinics. Built with B2B King for account approval workflows plus heavy custom development, and a fully custom WooCommerce dashboard rebuilt with added features.",
    scope: ["B2B King account approval workflows", "Custom WooCommerce dashboard rebuild", "Wholesaler, pharmacy & clinic ordering"],
    stack: ["WooCommerce", "B2B King", "ACF Pro", "PHP", "MySQL"],
    outcome: "OUTCOME // Streamlined B2B ordering for pharmaceutical distribution.",
    link: "https://vitalguardpharma.com",
  },
  {
    id: "cs-03",
    title: "DXB Industries - Real Estate Lead Generation",
    type: "realestate",
    meta: "REAL ESTATE LEAD GEN",
    coord: "CS 03 - 09",
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
    coord: "CS 04 - 09",
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
    coord: "CS 05 - 09",
    domain: "publisign.be",
    tint: "#10A37F",
    summary: "Corporate site for a Belgium-based EV-charging infrastructure manufacturer; multilingual setup (EN/NL/FR), service/product catalog structure, and B2B contact workflows.",
    scope: ["Multilingual (EN/NL/FR)", "Product catalog", "B2B workflows"],
    stack: ["WordPress", "WPML", "ACF Pro", "Elementor Pro"],
    outcome: "OUTCOME // Full trilingual corporate presence for EV-charging manufacturer.",
    link: "https://publisign.be",
  },
  {
    id: "cs-06",
    title: "Guidry Law - Estate Planning & Business Law",
    type: "headless",
    meta: "ESTATE PLANNING & BUSINESS LAW FIRM",
    coord: "CS 06 - 09",
    domain: "guidrylaw.net",
    tint: "#1F3A5F",
    summary: "Brand website for The Law Office of Chassidy J. Guidry, a boutique estate planning and business law firm serving clients across Texas and Georgia. Clear practice-area architecture (estate planning, business succession, small business formation, contracts and agreements), client testimonials, and an FAQ built around real client questions — wired to a virtual consultation booking flow.",
    scope: ["Practice-area pages with consultation request flows", "Client testimonials and FAQ sections", "Virtual consultation booking form"],
    stack: ["WordPress", "Elementor Pro", "ACF Pro", "JetEngine", "WPForms"],
    outcome: "OUTCOME // Trust-building law firm presence that turns visitors into scheduled consultations.",
    link: "https://guidrylaw.net",
  },
  {
    id: "cs-07",
    title: "Peak Laundry - Modern Laundromat",
    type: "booking",
    meta: "LAUNDROMAT SERVICES & HOURS",
    coord: "CS 07 - 09",
    domain: "peak-laundry.com",
    tint: "#0284C7",
    summary: "Site for a newly renovated, modern laundromat with high-extraction washers and powerful dryers. Services, pricing, FAQ, hours and location pages plus wash & fold drop-off workflow, same-day availability info, and SMS text-deal signup to drive repeat customers.",
    scope: ["Services, pricing and FAQ structure", "Hours & location with directions", "Drop-off workflow and SMS text-deal signup"],
    stack: ["WordPress", "Elementor Pro", "ACF Pro", "JetEngine", "Twilio API"],
    outcome: "OUTCOME // Modern local-service presence that drives walk-ins, drop-offs and repeat SMS offers.",
    link: "https://peak-laundry.com",
  },
  {
    id: "cs-08",
    title: "Bookie Watchdog - Bookmaker Complaints Platform",
    type: "marketplace",
    meta: "COMMUNITY COMPLAINTS PLATFORM",
    coord: "CS 08 - 09",
    domain: "bookiewatchdog.com.au",
    tint: "#F59E0B",
    summary: "Community-driven platform maintaining a public record of complaints against Australian bookmakers. Members sign up to file and track verified complaints, read resolutions and bookmaker responses, and follow the blog for industry news — all on a clean, trust-focused interface.",
    scope: ["Member sign-up and complaint submission", "Verified complaint record with resolutions", "Bookmaker responses and news/blog sections"],
    stack: ["WordPress", "ACF Pro", "JetEngine", "JetFormBuilder", "Membership"],
    outcome: "OUTCOME // A credible public record that turns individual complaints into community accountability.",
    link: "https://bookiewatchdog.com.au",
  },
  {
    id: "cs-09",
    title: "Sondela Consulting - PSA & RMM Consulting",
    type: "ai",
    meta: "MSP CONSULTANCY FOR HALOPSA & AUTOTASK",
    coord: "CS 09 - 09",
    domain: "sondelaconsulting.com",
    tint: "#4F46E5",
    summary: "Award-winning consultancy site helping managed service providers get the most out of HaloPSA and Autotask. Service pages covering implementation, Autotask-to-HaloPSA migration and PSA optimisation, a watch-and-listen resources hub, and consultation booking flows.",
    scope: ["Implementation, migration and optimisation service pages", "Consultation booking and contact workflows", "Watch-and-listen podcast and resource hub"],
    stack: ["WordPress", "Elementor Pro", "ACF Pro", "JetEngine", "Calendly"],
    outcome: "OUTCOME // Authority-driven consultancy site that turns MSP prospects into booked consultations.",
    link: "https://sondelaconsulting.com",
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
    slug: "clickfix-malware-wordpress-basic-safety",
    title: "ClickFix Malware Is Hunting WordPress Admins: The Basic Safety Drill",
    tag: "SECURITY",
    date: "2026-09-18",
    displayDate: "SEP 2026",
    readMinutes: 7,
    excerpt:
      "ClickFix tricks people into running malware themselves — and WordPress admins are a favorite target. How the attack chain actually works, the basic safety drill that beats it, and what to do in the first hour after a slip.",
    body: [
      { p: "ClickFix is not a plugin vulnerability and not a theme flaw. It is a social-engineering trick that turns a website visitor into the attacker's own hands — and since it first appeared it has become one of the fastest-growing infection chains on the web. WordPress admins are a favorite target for a simple reason: we live in dashboards, we paste things, and we click update for a living." },
      { h2: "The anatomy of a ClickFix attack" },
      { p: "The victim lands on a page that looks completely legitimate — a CAPTCHA verification, a message that the browser needs to be updated, an error claiming a video cannot play until you prove you are human. Solving it walks you through a few harmless-looking keyboard steps: open the Windows Run dialog, press Ctrl+V, press Enter. What you actually pasted is a command that downloads and executes malware. No exploit, no zero-day — you installed it yourself." },
      { list: [
        "A fake CAPTCHA, verification page or error screen earns your trust",
        "It instructs you to open the Run dialog (Win + R) or a terminal",
        "The attack page silently copies a command to your clipboard",
        "You paste and press Enter — a loader like Lumma executes within seconds",
        "Stolen cookies and saved logins are sold off; your wp-admin is next in line",
      ] },
      { h2: "Why WordPress people are prime targets" },
      { p: "Three doors lead WordPress teams into ClickFix. First, malvertising: attackers buy ads for searches like wp-admin login and land you on a pixel-perfect fake. Second, injection: compromised sites serve the fake-CAPTCHA script to every visitor, so even careful browsing gets hit. Third, phishing: a convincing email about a plugin update that really needs you to run a quick verification." },
      { quote: "No legitimate website will ever ask you to open the Run dialog. No update wizard has ever lived in PowerShell." },
      { h2: "The basic safety drill" },
      { list: [
        "Never paste a command you did not write — clipboard discipline beats antivirus",
        "Kill the Run dialog organization-wide with group policy, or run an extension that blocks paste-into-Run attacks",
        "Two-factor authentication on every wp-admin account — no exceptions for senior staff",
        "Install plugins and themes from wordpress.org or vetted vendors only; updates happen in the dashboard, never from email links",
        "Least privilege: editors get editor, not administrator — one admin account per human",
        "A WAF in front of the site (Cloudflare rules or Wordfence) plus scheduled malware scans",
        "Off-site backups with a restore drill — an untested backup is a hope, not a backup",
        "Hunt for persistence monthly: unknown admin users, strange scheduled tasks, unfamiliar files in uploads",
      ] },
      { h2: "If you already pressed Enter" },
      { p: "Speed matters more than perfection. From a clean device, rotate the hosting panel, SFTP, database and wp-admin credentials, revoke API keys and application passwords, then restore from a backup taken before the infection. After that, sweep for persistence: rogue administrator accounts, modified core files, dropped plugin shells. Only then go back to work." },
      { p: "On my team this drill is onboarding material, not a warning poster. Every developer learns the ClickFix pattern in week one, because the tool that actually beats it is not a security plugin — it is a reflex." },
    ],
  },
  {
    slug: "jetengine-vs-acf-client-editable-wordpress",
    title: "JetEngine vs ACF Pro: Why We Build Client-Editable Sites with Crocoblock",
    tag: "PLUGINS",
    date: "2026-09-02",
    displayDate: "SEP 2026",
    readMinutes: 6,
    excerpt:
      "ACF Pro or Crocoblock's JetEngine? We build with both. The honest decision rule our WordPress team uses — and why JetEngine gets the default slot for dynamic, client-editable sites.",
    body: [
      { p: "Every dynamic WordPress project starts with the same decision: which field system leads the stack. We build with both ACF Pro and the Crocoblock suite, and the honest answer is that neither one always wins — the right pick depends on who operates the site after launch. Here is the decision rule we actually use on client work, not the theoretical one." },
      { h2: "What ACF Pro is still unbeatable at" },
      { p: "ACF Pro is a developer's instrument: a clean, lean data layer that stays out of the way. When a developer owns the templates and the build is bespoke, nothing matches its precision." },
      { list: [
        "Bespoke themes where a developer renders every template in PHP",
        "Headless and API-driven builds — fields as a pure data layer",
        "Sites under a maintenance contract, where layout changes are dev work by design",
        "Performance-sensitive builds that want zero extra front-end machinery",
      ] },
      { h2: "Where JetEngine earns its keep" },
      { p: "JetEngine answers a different question: who maintains the site when we are not in the room. Its listings, repeaters and Query Builder render dynamic content on the front end without a single custom template — which means the client can duplicate a listing card, add a service, or reorder a portfolio without opening a single dev ticket." },
      { list: [
        "Front-end listings and repeaters render without custom PHP templates",
        "Query Builder assembles complex loops — filters, relations, WooCommerce data — visually",
        "Dynamic visibility and conditional logic without touching code",
        "The suite covers the whole dynamic stack: JetFormBuilder, JetWooBuilder, JetSmartFilters",
        "Post-launch, clients edit and duplicate layouts themselves — nothing breaks",
      ] },
      { h2: "The decision rule we actually use" },
      { p: "If the client will keep editing structure after launch and there is no developer on retainer, JetEngine leads the stack — the cost of that flexibility is baked into the tool instead of billed to the client later. If the build is bespoke, contract-locked, and a developer owns every template, ACF Pro leads. And on the largest builds we use both: ACF Pro as the clean data layer, JetEngine as the rendering engine on top." },
      { quote: "The best field system is not the one with the cleanest schema — it is the one the client can still operate two months after you have left the building." },
      { p: "Neither tool is a religion. ACF Pro and JetEngine both ship production-grade dynamic sites; the professional move is choosing for the operator who inherits it, not for the developer who builds it." },
    ],
  },
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
