/* ============================================================
   siteConfig.js — EDIT THIS FILE TO REBRAND THE TEMPLATE
   --------------------------------------------------------------
   Every piece of copy, every card, every price on the page is
   pulled from this one object. Swap the business, keep the design.
   No build step: this is a plain global loaded before landing.js.
   ============================================================ */
window.SITE_CONFIG = {

  business: {
    name: "Business Name",
    shortName: "Biz",              // used where space is tight (nav mark letter, favicon)
    tagline: "Premium Service Provider",
    serviceArea: "Serving Springfield & the surrounding region",
    phone: "(555) 010-2020",
    email: "hello@yourbusiness.com",
    address: "123 Main Street, Springfield, ST 00000",
    logoPath: "",                   // optional: path to a logo image; leave "" to use the generated mark
    accent: {
      indigo: "#6d5dfc",
      cyan: "#3ad6ff",
      magenta: "#ff48d0"
    }
  },

  seo: {
    title: "Business Name — Premium Service Provider",
    description: "Describe the main value proposition here in one clear sentence that tells a visitor exactly what you do and for whom.",
    ogImage: "/og.png"
  },

  nav: {
    links: [
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Login", href: "login.html" }
    ],
    ctaLabel: "Request a Quote",
    ctaHref: "quote.html"
  },

  hero: {
    eyebrow: "Trusted. Local. On time.",
    headline: "Get the job done ",
    headlineAccent: "right the first time",
    headlineEnd: ".",
    subheadline: "We turn a single call into a fully-scoped plan: pricing, timeline, materials, and a clear done-when checklist. Book once and it's handled in one visit, not five.",
    primaryCta: "Request a Quote",
    primaryCtaHref: "quote.html",
    secondaryCta: "Call Now",
    secondaryCtaHref: "tel:+15550102020",
    tags: ["Licensed", "Insured", "Same-day service"],
    hud: {
      topLeft: { label: "Years", value: 15 },
      midLeft: { label: "Crews", value: 6, pad: 2 },
      bottomLeft: { label: "Reviews", value: 480 },
      topRight: { label: "Area", value: "Local" },
      midRight: { label: "Response", value: "24/7" },
      bottomRight: { label: "Rating", value: "4.9" }
    },
    demoCard: {
      title: "yourbusiness — one call in, a full plan out",
      typedPrompt: "a leaking water heater, needs same-day fix",
      status: "building your service plan",
      docLabel: "9 words → full estimate · 4 sections · 1 visit",
      copyLabel: "Copy estimate",
      downloadLabel: "Download PDF",
      readMoreLabel: "read it in full ↓"
    }
  },

  marquee: [
    "Free estimates", "Licensed & insured", "Same-day service", "Flexible scheduling",
    "Upfront pricing", "5-star rated", "Locally owned", "Satisfaction guaranteed"
  ],

  demo: {
    eyebrow: "See it in action",
    headline: "Watch one call ",
    headlineAccent: "become a plan",
    description: "This is the real thing — a prepared service estimate, streamed exactly the way our team builds it for you.",
    idea: "a leaking water heater, needs same-day fix",
    replayLabel: "Replay",
    scenarios: [
      {
        idea: "a leaking water heater, needs same-day fix",
        file: "water-heater",
        output:
"Job: Water heater leak — diagnose & repair\n\n" +
"## Scope\nInspect tank, valves and connections. Repair or replace failed part. Pressure-test the line.\n\n" +
"## Materials\nT&P valve, braided supply line, sealant, drip pan (if missing).\n\n" +
"## Timeline\nSame-day if booked before 1pm. 60–90 minute visit.\n\n" +
"## Done when\nNo visible leak after 30 min run test · water temp restored · area dried and inspected.\n\n" +
"## Price\nFlat rate quoted before work begins. No surprise call-out fee."
      },
      {
        idea: "a kitchen remodel, need a full quote",
        file: "kitchen-remodel",
        output:
"Job: Kitchen remodel — full scope\n\n" +
"## Scope\nDemo existing cabinetry, reroute plumbing for island sink, install cabinets, countertops, backsplash, lighting.\n\n" +
"## Materials\nShaker cabinets, quartz counters, LED under-cabinet lighting, subway tile.\n\n" +
"## Timeline\n3–4 weeks from permit approval, phased so the kitchen stays partially usable.\n\n" +
"## Done when\nFinal walkthrough signed off · all fixtures tested · punch list cleared.\n\n" +
"## Price\nFixed-bid quote, itemized by trade, payment tied to milestones."
      },
      {
        idea: "a quarterly HVAC tune-up for a small office",
        file: "hvac-tuneup",
        output:
"Job: HVAC tune-up — small office\n\n" +
"## Scope\nInspect coils, filters, refrigerant charge, thermostat calibration and airflow balance.\n\n" +
"## Materials\nStandard filters, refrigerant top-off if needed, coil cleaner.\n\n" +
"## Timeline\nSingle 90-minute visit, scheduled around business hours.\n\n" +
"## Done when\nSystem holds target temp within 2°F · filters replaced · report emailed.\n\n" +
"## Price\nCovered under quarterly maintenance plan, or one-time flat rate."
      }
    ]
  },

  pipeline: {
    eyebrow: "How it works",
    headline: "From one call to ",
    headlineAccent: "done",
    steps: [
      {
        n: "STEP 01",
        title: "Describe",
        text: "Tell us what's going on — one call, one form, no jargon required.",
        meta: "input · 2 minutes · any job",
        demoLabel: "describe",
        demoPrompt: "a leaking water heater, needs same-day fix",
        demoExamples: ["a clogged main line", "a flickering breaker panel", "a full bathroom remodel"]
      },
      {
        n: "STEP 02",
        title: "Plan",
        text: "We scope it into a full estimate: materials, timeline, pricing, done criteria.",
        meta: "same-day estimate · fully scoped",
        demoLabel: "estimate.pdf",
        demoRows: [
          { k: "scope", v: "diagnose · repair · test" },
          { k: "materials", v: "valve · supply line · sealant" },
          { k: "timeline", v: "same day · 60–90 min" },
          { k: "done", v: "no leak · temp restored" }
        ]
      },
      {
        n: "STEP 03",
        title: "Ship it",
        text: "A licensed crew shows up on time and finishes the job in one visit.",
        meta: "on-time arrival · 1 visit · warrantied",
        demoLabel: "crew dispatched",
        demoAgents: ["Licensed techs", "Fully insured", "Background-checked"],
        demoChecks: ["Arrives in the scheduled window", "Cleans up before leaving", "Warranty on parts & labor"]
      }
    ]
  },

  dissect: {
    eyebrow: "The estimate, dissected",
    headline: "Every estimate covers the four things people ",
    headlineAccent: "get burned by",
    description: "A real completed job. See the parts we nail down up front so nothing turns into a surprise invoice.",
    fileLabel: "estimate / water-heater.pdf",
    rows: [
      { text: "Scope: diagnose · repair failed valve · pressure-test line", tag: "scope" },
      { text: "Materials: T&P valve · braided line · sealant · drip pan", tag: "materials" },
      { text: "Timeline: same-day · 60–90 minute visit", tag: "timeline" },
      { text: "Price: flat rate, quoted before work begins", tag: "pricing" }
    ]
  },

  services: {
    eyebrow: "Built for every job",
    headline: "One crew. ",
    headlineAccent: "Any kind",
    headlineEnd: " of job.",
    description: "Repairs, installs, remodels, and routine maintenance — we scope each job to the right materials, timeline, and done criteria.",
    cards: [
      {
        title: "Service One",
        description: "Describe the first core service here — what it solves and who it's for.",
        chips: ["Repairs", "Diagnostics", "Same-day"],
        icon: "wrench"
      },
      {
        title: "Service Two",
        description: "Describe the second core service here — the outcome a customer can expect.",
        chips: ["Installs", "Upgrades", "Warrantied"],
        icon: "install"
      },
      {
        title: "Service Three",
        description: "Describe the third core service here — how it's scheduled and delivered.",
        chips: ["Maintenance", "Inspections", "Contracts"],
        icon: "check"
      }
    ],
    tagCloud: [
      "free estimates", "licensed crew", "insured", "same-day service", "flat-rate pricing",
      "warranty included", "24/7 emergency", "background-checked", "on-time arrival", "clean job site", "satisfaction guaranteed"
    ],
    tagCloudHeadline: "Everything included, in one estimate.",
    tagCloudSub: "move the cursor — nudge the list"
  },

  showcase: {
    eyebrow: "Recent work",
    headline: "Real jobs. ",
    headlineAccent: "Real results",
    headlineEnd: ".",
    description: "Three jobs that started as a single call and finished in one visit. Scroll →",
    items: [
      {
        tag: "REPAIR",
        title: "Same-day water heater fix",
        summary: "Diagnosed, repaired and pressure-tested before dinner.",
        stack: "parts: T&P valve · supply line",
        detail: "visit: 75 minutes",
        result: "no leak · full warranty"
      },
      {
        tag: "REMODEL",
        title: "Full kitchen remodel",
        summary: "Cabinets, counters, lighting — done in four phased weeks.",
        stack: "trades: plumbing · electrical · carpentry",
        detail: "milestones: demo · rough-in · finish",
        result: "final walkthrough signed off"
      },
      {
        tag: "MAINTENANCE",
        title: "Quarterly HVAC program",
        summary: "A small office kept on a predictable, worry-free schedule.",
        stack: "plan: quarterly tune-ups",
        detail: "coverage: parts & labor",
        result: "zero unplanned downtime"
      }
    ]
  },

  valueProp: {
    eyebrow: "Why it pays off",
    headline: "You're already paying for ",
    headlineAccent: "upkeep",
    headlineEnd: ".",
    body: "Most homeowners already budget for repairs and maintenance — the real cost is jobs that drag out, surprise call-out fees, and crews that don't show. We turn every request into a clear, upfront plan your budget already covers, done in one visit. <b>Same budget. Far less hassle.</b>"
  },

  testimonials: {
    eyebrow: "What customers say",
    headline: "Trusted by ",
    headlineAccent: "your neighbors",
    items: [
      {
        quote: "They quoted the job on the phone, showed up on time, and the price didn't change. Hasn't leaked since.",
        name: "Jordan M.",
        detail: "Homeowner, Springfield"
      },
      {
        quote: "Our kitchen remodel finished on schedule with zero surprise charges. Clean, professional, and fast.",
        name: "Alicia R.",
        detail: "Homeowner, Springfield"
      },
      {
        quote: "We put our office HVAC on their quarterly plan and haven't had a single unplanned outage since.",
        name: "Devon P.",
        detail: "Office Manager, Riverside Co."
      }
    ]
  },

  faq: {
    eyebrow: "Questions",
    headline: "Answers, ",
    headlineAccent: "upfront",
    items: [
      { q: "Do you offer free estimates?", a: "Yes — every job starts with a free, no-obligation estimate before any work begins." },
      { q: "Are you licensed and insured?", a: "Yes, fully licensed and insured. Proof of coverage is available on request." },
      { q: "How fast can you get here?", a: "Most requests are scheduled same-day or next-day, with 24/7 emergency service available." },
      { q: "Do you guarantee your work?", a: "Every job is backed by a warranty on both parts and labor — details are included in your estimate." }
    ]
  },

  pricing: {
    eyebrow: "Pricing",
    headline: "Start with an estimate. ",
    headlineAccent: "Scale when it's right",
    headlineEnd: ".",
    description: "Transparent, flat-rate pricing — no call-out fee, no surprises on the invoice.",
    tiers: [
      {
        tier: "Basic",
        price: "$0",
        priceSuffix: "",
        subtitle: "Free estimate, full assessment. No obligation.",
        features: ["Free on-site or phone estimate", "Full scoping: materials, timeline, price", "Every job type — repair to remodel", "Estimate emailed as a PDF"],
        ctaLabel: "Request a Quote",
        ctaHref: "quote.html",
        featured: false
      },
      {
        tier: "Standard",
        price: "$149",
        priceSuffix: "/visit",
        subtitle: "Our most-booked service call — flat rate, no surprises.",
        badge: "Most popular",
        features: ["Same-day or next-day scheduling", "Every job type — repair to remodel", "Full estimate before work begins", "Everything in Basic"],
        ctaLabel: "Book Now",
        ctaHref: "quote.html",
        featured: true
      },
      {
        tier: "Maintenance Plan",
        price: "$39",
        priceSuffix: "/mo",
        subtitle: "Quarterly tune-ups that keep small problems from becoming big ones.",
        features: ["Quarterly scheduled visits", "Priority emergency booking", "10% off any additional repairs", "No long-term contract"],
        ctaLabel: "Start Plan",
        ctaHref: "quote.html",
        featured: false
      }
    ]
  },

  cta: {
    headline: "Describe the job.",
    body: "One clear estimate out. Then our crew ships it — in one visit.",
    primaryCta: "Request a Quote",
    primaryCtaHref: "quote.html",
    secondaryCta: "Call Now",
    secondaryCtaHref: "tel:+15550102020"
  },

  footer: {
    links: [
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Login", href: "login.html" },
      { label: "Docs", href: "#" },
      { label: "Privacy", href: "#" }
    ],
    copyright: "© 2026 Business Name. Licensed, insured, and on time.",
    social: [
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Google Reviews", href: "#" }
    ]
  }
};
