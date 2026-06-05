# Current Status

Last updated: 2026-06-05

## Site State

- Static bilingual Dark Matter site with English root pages and Spanish mirrors under `es/`.
- Main navigation uses `Home`, `Services`, `Apps`, `Process`, `Portfolio`, account/login, language toggle, and Contact.
- `apps.html` / `es/apps.html` are the canonical app-library pages; old Downloads URLs redirect.
- Portfolio page is gallery-only and links to standalone detail pages.
- Sean's Google Ads source is intentionally external and absent from this repo.

## Current Features

- Homepage uses optimized black-hole MP4 hero videos.
- Non-home pages use the compressed cosmic-web background system.
- Services pages cover website services, care plans, custom apps, SEO, branding, hosting, consultation, and in-home/office tech help.
- Website Preference Builder uses Netlify Forms in English and Spanish.
- Contact/client request forms use Netlify markup.
- Client portal pages are static front-end pages wired for Supabase auth.
- Portal-only checkout pages exist for app purchase requests.
- Privileged portal access reads Supabase `app_metadata.role` first (`super_admin`, `sean_ads_admin`), with email allowlist fallback in `assets/supabase-config.js`.
- Sean's direct Google Ads portal page shows Sean's customer center to Sean; super admin sees Sean's tools plus the member workspace in owner oversight mode.

## Apps

- Apps gallery uses compact preview tiles, two-wide mobile tiles, soft translucent tile backing, and a custom-build CTA tile.
- Custom apps banner links to Contact and app pricing.
- App pricing pages:
  - `app-pricing.html`
  - `es/app-pricing.html`
  - compact banner, Back to App behavior when opened with `?from=auction` or `?from=sdms`
  - four clickable pricing tiers route through the client portal to checkout context
  - mobile pricing tiers stay two-wide
  - `Ask a Question` / `Hacer una pregunta` button is contained on mobile
- App profiles:
  - Auction House & Consignment Store Software
  - Secondhand Dealer Management System (SDMS)
  - Both have English/Spanish pages, app-flow WebP screenshots, modal screenshot previews, app CTA rows, pricing links, language-availability callouts, powered-by banner, and footer.

## Recent Mobile Sweep

- Phone-width sweep found no missing local image paths in static checks.
- Fixed or confirmed:
  - app pricing two-wide tier cards
  - pricing banner question button containment
  - pricing mobile Contact button containment
  - SDMS mobile profile panel/header overflow
  - Built By decorative blur overflow
  - Preference Builder hero overflow
  - SeansAds portfolio detail mobile overflow

## Known Cautions

- Supabase portal roles are wired in the front end, but real sensitive data access must still be enforced with RLS/server-side functions before storing private records.
- `git` is not currently available in this shell.
- Keep Sean's Ads source out of this repo.
