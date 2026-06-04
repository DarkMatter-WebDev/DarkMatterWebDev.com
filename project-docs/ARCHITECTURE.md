# Architecture

Last updated: 2026-06-04

## System Design

This project is currently a static marketing website. Pages are hand-authored HTML files with Tailwind CSS loaded from the CDN, shared CSS assets, static media, and small JavaScript enhancements.

There is no app server, build pipeline, package manager, or framework documented in this workspace at this time. A first-pass Supabase-powered client portal scaffold now exists as static pages plus browser-side Supabase Auth wiring; it is not live until the Supabase project URL, anon key, tables, and Row Level Security policies are configured.

Long-term recommendation: keep the marketing site as static output, but migrate away from hand-authored duplicated HTML toward generated static HTML using reusable layouts/components and structured content. The current recommendation is documented in `project-docs/STRUCTURE_RECOMMENDATIONS.md`: Astro is the preferred marketing-site path, with React/Next-style app architecture reserved for future authenticated portals, dashboards, or business apps.

## Folder Structure

```text
/
  index.html
  services.html
  apps.html
  secondhand-dealer-management-system.html
  process.html
  casestudies.html
  contact.html
  built-by.html
  account.html
  account-settings.html
  account-ads-status.html
  netlify.toml
  assets/
    *.css
    *.js
    *.html snippets
    images and video
    portfolio/
  services/
    complete-website-management.html
    discovery-consultation.html
    website-design.html
    brand-rebranding.html
    managed-hosting.html
    website-care-plans.html
    seo-foundations.html
    custom-development.html
    in-home-services.html
    office-network-setup.html
  es/
    (Spanish mirror of every top-level page)
    index.html, services.html, apps.html, secondhand-dealer-management-system.html, process.html, casestudies.html,
    contact.html, built-by.html, account.html, account-settings.html,
    account-ads-status.html
    services/
      (Spanish mirror of every service page, same filenames)
  project-docs/
    project memory and documentation
  scripts/
    validate-site.ps1
  supabase/
    client-portal-schema.sql
  # Sean's Google Ads source intentionally removed; managed externally.
```

## Page Model

- Top-level pages provide the main site navigation and conversion flow.
- `apps.html` / `es/apps.html` are static Dark Matter app-library gallery pages for hosted, downloadable, or request-access web apps. App gallery cards link directly to separate full profile pages, and the old `/downloads.html` and `/es/downloads.html` URLs are redirected in `netlify.toml`. App CTAs should point only to real hosted apps, real packages, or contact/request flows. The Auction House app links to `https://auctionconsignmentapp.netlify.app/`, uses screenshots under `assets/apps/`, and has paired full profile pages at `auction-house-consignment-store-software.html` / `es/auction-house-consignment-store-software.html`. SDMS has paired full profile pages at `secondhand-dealer-management-system.html` / `es/secondhand-dealer-management-system.html`.
- Service pages under `services/` share the same general visual system and navigation pattern.
- The Services dropdown is grouped into Online Services and In-Home & Office Services.
- On mobile top-level pages, `assets/nav.css` moves the five-item tab bar to the top and `assets/mobile-services-nav.js` turns the Services tab into a grouped service picker.
- `assets/rail.js` controls the shared floating process rail interaction and is loaded with a version query string to avoid stale deployed behavior after rail changes.
- The black-hole MP4 hero is homepage-only. The English and Spanish homepages mount responsive optimized sources inline: a 1080p desktop encode and a 720p mobile encode. Non-home pages do not load the MP4 hero.
- Non-home English and Spanish pages load `assets/cosmic-web.css`, which applies a fixed, faded cosmic-web background layer using the compressed local WebP asset `assets/cosmic-web-hero.webp`. Service pages can set `cosmic-tint-*` body classes to vary the hero tint through CSS variables, hue rotation, and stronger accent overlays without creating additional image files.
- `assets/site-hero.js` remains in assets as a previous shared-hero helper, but current HTML pages do not load it.
- `assets/care-plans.css`, `assets/nav.css`, `assets/logo.css`, and badge CSS files hold reusable styling.
- Some page behavior is implemented inline in the relevant HTML files.
- `account.html` and `es/account.html` are the first client login/account pages. They load `assets/supabase-config.js`, `assets/client-portal.js`, and `assets/client-portal.css`.
- `account-settings.html` / `es/account-settings.html` and `account-ads-status.html` / `es/account-ads-status.html` are lightweight client-portal workspace placeholder pages for future settings/preferences and Google Ads campaign activity/status workflows.
- Sean's Google Ads is hosted separately at `https://seansads.com/` and its source has been intentionally moved out of this repository. The old `Sean's Google Ads Services/` folder is expected to be absent. Dark Matter should continue using absolute `https://seansads.com/...` URLs where it links to Sean's Ads, but Sean's Ads code/content changes belong in its separate external project.

## Internationalization (English / Spanish)

- The site is bilingual. English pages live at the repo root; Spanish (neutral Latin American) pages are exact, fully-translated mirrors under `es/` and `es/services/` using identical filenames.
- Each page carries an `EN / ES` toggle in the desktop nav and mobile header, plus a small head script that auto-detects Spanish browsers on first visit and remembers the explicit choice in `localStorage` (`dm_lang`). Pages declare `hreflang` alternates (`en` / `es` / `x-default`).
- Spanish files differ from their English source only by: `lang="es"`, asset paths gaining one `../` level, the head detect/toggle URLs, and translated visible text (including user-facing strings in inline scripts). Internal relative links are unchanged so navigation stays within `es/`.
- `assets/rail.js` is shared and bilingual (it selects Spanish popover strings when `document.documentElement.lang` starts with `es`).
- Full glossary, exact snippets, and rules are in `project-docs/I18N.md`. Netlify form `name`/`value` attributes are kept identical across languages so submissions share one schema.
- Maintenance rule: any content change on one language's page must be mirrored on its counterpart.

## Database Schema

No local database is present. Supabase is the planned hosted database/auth provider for the client portal.

Planned starter tables:

- `client_profiles`: one row per authenticated client user, keyed by `user_id` referencing `auth.users.id`.
- `client_services`: active services/plans attached to a client account, keyed by `user_id`.
- `client_billing`: recurring billing summaries attached to a client account, keyed by `user_id`.
- `client_website_status`: website health/status summaries attached to a client account, keyed by `user_id`.
- `client_website_stats`: traffic/stat summaries attached to a client account, keyed by `user_id`.

All client tables must have Row Level Security enabled so users can only read rows where `user_id = auth.uid()`. Any admin writes, analytics imports, Stripe synchronization, or billing portal creation must happen through a secure server-side function, not browser JavaScript.

Starter SQL lives in `supabase/client-portal-schema.sql`.

## API Integrations

- Netlify Forms are used for contact form submissions on `contact.html` and Website Preference Builder submissions on `preference-builder.html` / `es/preference-builder.html`.
- Netlify Forms are also used for logged-in client requests on `account.html` / `es/account.html` with form name `client-request`.
- Supabase Auth client scaffolding is loaded from the Supabase JS CDN on `account.html` and `es/account.html`.
- Website traffic summaries are displayed from Supabase. Potential source systems include Netlify Web Analytics, Google Analytics, Google Search Console, Plausible, or manual monthly updates.
- Recurring billing management is planned but not connected yet; Stripe Customer Portal links should be created by a secure Netlify Function or similar server endpoint.

## Authentication Flow

Client portal authentication is scaffolded with Supabase Auth:

- Public config lives in `assets/supabase-config.js` and must contain only the Supabase URL and anon key.
- `assets/client-portal.js` creates the Supabase client when real config is present.
- Users can sign in with email/password or request a magic email link.
- After sign-in, the dashboard queries client service and billing rows filtered by the authenticated user's `user_id`.
- While config placeholders are present, the page displays a setup notice and disables login actions.

The marketing copy also advertises custom business web apps that can include owner, staff, and customer logins. If a larger app is implemented later, document roles, permissions, session behavior, and account lifecycle here.

## Hosting Setup

- `netlify.toml` indicates Netlify deployment support.
- Static assets are served directly.
- Forms rely on Netlify form handling.
- Sean's Ads is a separate static deployment at `https://seansads.com/`; do not use parent-folder links from that mini-site to reach Dark Matter pages.

## Deployment Architecture

Current architecture is a static Netlify-hosted site:

```text
Visitor browser
  -> Netlify static hosting
    -> HTML/CSS/JS/assets
    -> Netlify Forms for contact and website-preference submissions
    -> Supabase Auth/DB for client portal after config and RLS setup
    -> Secure server function required for Stripe billing portal
```

## Local Development

Typical local preview:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

Static integrity check:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

The validator checks for old public email strings, visible mojibake markers in deployable site files, broken internal `href`/`src`/`action` targets, missing same-page anchors, missing English/Spanish page pairs, and visible email mentions that are not wrapped in a `mailto:` link.

## Future Structure Direction

- Keep using `scripts/validate-site.ps1` before migration so the current site stays protected while changes continue.
- Prefer Astro static generation for the marketing website: shared header, footer, Services menu, process rail, language switcher, page hero, service cards, care-plan cards, and bilingual content sources.
- Keep URL compatibility with the existing static pages during migration.
- Keep future authenticated apps separate from the marketing site unless there is a deliberate architecture decision to combine them.
- Document any future framework decision in `DECISIONS.md` before implementation.
