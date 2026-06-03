# Structure Recommendations

Last updated: 2026-06-02

## Recommendation

Keep the public marketing website as a static site, but move away from hand-authored static HTML toward a static site generator with reusable components and structured content.

Recommended path: migrate to Astro, generate static HTML for Netlify, and keep React only for genuinely interactive widgets if needed later.

This preserves the current strengths of the project:

- Fast static pages.
- Simple Netlify hosting.
- Netlify Forms.
- Strong SEO and shareable page URLs.
- Low hosting complexity.

It also fixes the main long-term weakness: every small edit currently has to be repeated across many large HTML files.

## Current Scan Findings

- The project currently has 37 HTML files.
- English and Spanish pages are mirrored manually under `/` and `/es/`.
- Largest HTML files:
  - `index.html` and `es/index.html`: about 1,260 lines each.
  - `casestudies.html` and `es/casestudies.html`: about 1,000 lines each.
  - `services.html` and `es/services.html`: about 780 lines each.
- Tailwind configuration is repeated inline across many pages.
- Header/nav, Services dropdown, footer, language switcher, process rail markup, and mobile sections are duplicated across pages.
- Shared behavior exists in `assets/rail.js` and `assets/mobile-services-nav.js`, which is good, but the markup they rely on is still repeated. `assets/site-hero.js` remains as an unused previous helper.
- The site has no package manager, no build step, no component layer, no automated validation, and no asset optimization pipeline.
- The original large hero MP4 has been replaced by optimized desktop/mobile homepage encodes. A poster image and stricter documented loading rules are still recommended.
- Netlify is a good fit for this project because it already supports static hosting, forms, previews, redirects, functions, image handling, and deploy workflows.

## Is Static HTML Wrong?

No. Static HTML is not wrong for the current business website.

The problem is not "static." The problem is "manual."

A leading advisor would usually separate those two ideas:

- Static output is excellent for a marketing website.
- Manually maintaining dozens of duplicated static files becomes risky as the site grows.

The right target is static generated HTML, not necessarily a full React app.

## Why Astro Fits Best

Astro is a good match because it is designed around mostly static pages with optional islands of interactivity. Astro content collections also provide a clean way to manage structured content such as services, care plans, case studies, navigation, and bilingual copy.

Target structure:

```text
/
  src/
    layouts/
      BaseLayout.astro
      ServiceLayout.astro
      HomeLayout.astro
    components/
      Header.astro
      ServicesMenu.astro
      Footer.astro
      ProcessRail.astro
      UniversalHero.astro
      ServiceCard.astro
      CarePlanCard.astro
      LanguageSwitch.astro
    content/
      services/
        complete-website-management.en.md
        complete-website-management.es.md
      case-studies/
      care-plans.json
      navigation.json
    pages/
      index.astro
      services.astro
      process.astro
      contact.astro
      es/
        index.astro
        services.astro
  public/
    assets/
      images/
      video/
  project-docs/
```

Output would still be ordinary static HTML deployed to Netlify.

## Why Not Jump Straight To React?

React is not the wrong tool, but a full React single-page app is not the best default for this website.

This site is mostly content, navigation, forms, and a few visual interactions. A full client-rendered app would add complexity and JavaScript weight without solving the core problem as cleanly as components plus static generation.

Use React later for:

- The preference builder if it grows into a serious interactive product.
- Client dashboards or business web apps.
- Staff/customer portals with authentication.
- Complex state, filtering, previews, or app-like workflows.

Keep those as separate app surfaces if they become real products.

## Why Not Next.js As The Main Site?

Next.js can statically export pages and can grow into a full-stack app. It is a good framework for web apps and authenticated portals.

For this specific marketing site, Next.js is more than needed right now. It introduces more framework surface area than Astro while the main business need is reusable static layouts, bilingual content, and easy content edits.

Recommended split:

- Marketing website: Astro static site.
- Future authenticated client/business apps: Next.js, React Router, or another app framework as a separate project or clearly separated `/app` surface.

## Immediate Risks If We Stay As-Is

- A nav/footer/contact update must be repeated across many pages.
- English and Spanish can drift out of sync.
- Inline Tailwind config can drift between pages.
- Cache-busting query strings have to be managed manually.
- Large media can slow mobile pages.
- Static snippets in `assets/*.html` are not actually a build system, so they can become stale.
- No automated check catches missing links, old email addresses, mojibake, or broken Spanish accents.

## Recommended Migration Phases

### Phase 1: Stabilize Current Static Site

- Add a small validation script for:
  - old email strings,
  - mojibake markers,
  - missing `mailto:` links,
  - broken internal links,
  - missing English/Spanish page pairs.
- Move repeated Tailwind config into one generated CSS build.
- Add a formal asset checklist for image/video sizes.
- Keep shipping with current HTML while preparing the migration.

### Phase 2: Introduce Astro

- Create an Astro build alongside the current site.
- Start with shared layout, header, footer, Services menu, language switcher, and process rail components.
- Generate one or two low-risk pages first, such as `built-by` and a simple service page.
- Keep output path compatibility so URLs do not change.

### Phase 3: Move Structured Content

- Move service data into structured Markdown, JSON, or YAML.
- Generate English and Spanish service pages from paired content files.
- Move care-plan tiers, service menu items, process steps, and case studies into data files.
- Replace duplicated homepage mobile/desktop service cards with one data source.

### Phase 4: Optimize Assets

- Keep the optimized desktop/mobile homepage MP4 variants and document their target sizes/settings.
- Add a poster image.
- Convert large portfolio images to responsive WebP/AVIF where appropriate.
- Use Astro or Netlify image tooling for generated sizes.

### Phase 5: Separate Future Apps From The Marketing Site

- Keep the marketing site static.
- Build authenticated business apps separately when needed.
- Document auth, database, roles, and deployment in `ARCHITECTURE.md` before building an app.

## What To Do Next

Recommended next build task:

Keep using `scripts/validate-site.ps1` before a full framework migration.

That gives immediate protection while keeping the current site running. After that, scaffold Astro and migrate the smallest pages first.

## Sources Checked

- Astro content collections: `https://docs.astro.build/en/guides/content-collections/`
- Astro islands architecture: `https://docs.astro.build/en/concepts/islands/`
- React framework guidance: `https://react.dev/learn/creating-a-react-app`
- Next.js static exports: `https://nextjs.org/docs/app/guides/static-exports`
- Netlify Forms setup: `https://docs.netlify.com/manage/forms/setup/`
- Netlify Astro setup: `https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/`
