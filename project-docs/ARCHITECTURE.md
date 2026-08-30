# Architecture

Last updated: 2026-08-27

## Routing changes (2026-08-27)

Four pages were removed when the app/store product line was retired, each with a 301 in
`netlify.toml` because the URLs were public:

| Removed | Redirects to |
|---|---|
| `/app-catalog.html` | `/apps.html` (now a case-study index) |
| `/app-pricing.html` | `/contact.html` |
| `/app-checkout.html` | `/contact.html` |
| `/multichannel-commerce-website.html` | `/websites.html` |

Root HTML page count is now **45** (48 including `services/`). The nav's desktop/mobile
switch is **1024px**, set independently of the page-layout breakpoint, which stays at
880px — see `nav.css`'s switch-rule comment for the full list of blocks that must agree.

Asset cache-busting is `?v=` query strings against `Cache-Control: immutable` on
`/assets/*`; **changing a shared asset requires bumping its token across every page that
references it**, or returning visitors keep the old file for a year. Current token:
`20260827-contrast-nav`.

## Current Stack

- Static HTML/CSS/JS — no build step required for normal editing.
- English pages at repo root. Spanish mirrors (`es/`) are the intended pattern but are absent from this working copy.
- Local preview commonly uses a static server at `http://127.0.0.1:4173/` (`npx http-server` or `start-preview.bat`).
- Netlify static deployment and redirects via `netlify.toml`.
- Tailwind CSS loaded via CDN (`https://cdn.tailwindcss.com?plugins=forms,container-queries`).

## Key Directories

- `assets/` — shared CSS, JS, images, SVGs, app screenshots, portfolio media.
- `assets/apps/auction/` — Auction app WebP screenshots.
- `assets/apps/sdms/` — SDMS WebP screenshots.
- `assets/apps/benji/` — Benji Payroll WebP + SVG screenshots.
- `assets/apps/antique-mall/` — Antique Mall screenshots (current: `thirdstreet-*.png`; older `antique-mall-*.png` may be stale).
- `assets/apps/metalscalc/` — MetalsCalc PNG screenshots.
- `assets/portfolio/` — Portfolio/website detail media.
- `services/` — English service pages.
- `nova/` — Nova particle-galaxy WebGL widget (`nova-widget.html` + `HANDOFF.md`). Only the `CONFIG` block should be edited — do not modify the engine.
- `project-docs/` — compact AI/project memory system.
- `supabase/` — setup SQL for the client portal, message center, newsletter subscribers, and public-form message capture.
- `scripts/validate-site.ps1` — static-site link validator.

## Surette Data Systems Brand Assets

- `assets/surette-data-systems-logo.webp` — full wordmark logo.
- `assets/surette-data-systems-icon.webp` — icon variant.
- `assets/surette-data-systems-geometric-icon.webp` — transparent geometric icon used site-wide.
- `assets/surette-data-systems-floating-icon.webp` — floating icon variant.
- `assets/surette-data-systems-floating-orange-blocks.webp` — large orange/purple block mark used in apps hero drift animation.
- `assets/surette-data-systems-og.png` — Open Graph image.
- `assets/case-studies-building-blocks.webp` — floating block visual used in case studies hero.

## Homepage Hero

- `index.html` uses the Nova particle-galaxy WebGL widget (`nova/nova-widget.html`) embedded as a fixed `#nova-bg` div at `z-index:1`. The old black-hole Three.js scene has been removed.
- A fixed `#hero-tint` scrim at `z-index:2` anchors the gradient overlay so it stays visible as content scrolls.
- Non-home pages use the shared cosmic-web background (`assets/cosmic-web.css`).

## Navigation / Portfolio

- The public header uses a single top-level Portfolio item (`portfolio.html`) for work examples. `portfolio.html` is an intermediate hub that links to Apps (`apps.html`) and Websites (`casestudies.html`).
- Apps and Websites pages remain standalone downstream pages; their detail/profile routes are unchanged.
- Mobile nav rows use the same Portfolio destination. At widths below 880px (the site-wide mobile/desktop line since 2026-07-16), public pages use the fixed homepage-style logo/header, icon-only account control, hamburger dropdown, and bottom nav; the desktop header takes over at 880px and above. Tailwind `md:` is retargeted to 880 via each page's inline `tailwind.config` — new pages must carry that override.

## Shared Behavior

- `assets/collectible-card.css` styles the gallery card shared by `casestudies.html` (Websites) and `app-catalog.html` (Apps) — a themed copy of the `pokecard-dropin` template card. Pages using it must also load `pokecard-dropin/pokecard/pokecard.css` and `.../pokecard.js` (the JS wires every `.poke-scene` it finds, so cards need no per-page script). Prefix is `tcg-`. Themes are `.tcg-card--*` (Websites) and `.tcg-card--app-*` (Apps, a deliberately separate palette). The widget hardcodes its green in three spots its own vars don't cover (face gradient stops, `.poke-top`/`.poke-foot` tints) — this file re-points those, so **do not edit `pokecard-dropin/`**; its hero card must stay green. `.poke-scene.tcg-card` is a size container (`container-type: inline-size`); a `@container tcg-card (max-width: 336px)` tier tightens BOTH faces on narrow cards, keyed to the card's own rendered width because layouts (the casestudies zigzag) can shrink the card independently of the viewport. Back faces must never scroll, in either axis — see DECISIONS.
- `assets/portfolio-mobile-fixes.css` is the mobile redesign home for `casestudies.html`'s phone gallery (plus shared title-shrink hooks for the portfolio detail pages): the numbered zigzag rows (`.tcg-mobile-row`/`.tcg-mobile-num`), the front declutter (`display: none` on stage line + status tag, full-width foot buttons), the 70% stat pill, title/badge shrinks, and the mobile reformat of the Tech Business Site Template hero widget (`.lab-poke-section` scope — that card is not a `.tcg-card`, so the container tier does not protect it).
- `assets/standard-site-nav.js` renders the shared public desktop and mobile navigation for standard-nav pages (the single source of truth since 2026-07-15; `assets/unified-mobile-menu.js` was deleted).
- `assets/nav.css` contains the cross-template header, menu, breakpoint, and overflow rules. Keep public fixed headers viewport-anchored and verify both sides of the 880px breakpoint after nav changes.
- `assets/mobile-services-nav.js` supports mobile services navigation.
- `assets/client-portal.js` handles portal UI/auth behavior, safe `next` redirects for the regular account dashboard, and account-dashboard support/change request submissions through `submit_portal_message()`.
- `assets/account-admin.js` handles the owner-only ultra-wide left-tab Admin Center, tab state/hash behavior, message center with signed attachment links, embedded subscriber table, subscriber email export/copy modal, account-holder viewer, and confirmation-modal delete flow (calls `list_portal_messages()`, `delete_portal_message()`, `list_portal_account_holders()`, `delete_newsletter_subscriber()`, and `delete_portal_account_holder()` Supabase RPCs).
- `assets/account-users.js` handles the owner-only newsletter subscriber table from `homepage_email_signups` rows only, matching the Admin Center Subscribers tab.
- `assets/newsletter-signup.js` handles public homepage newsletter email submissions into `homepage_email_signups` using the browser Supabase client.
- `assets/portal-auth.js` reads Supabase `app_metadata.role` for privileged portal access; email allowlist fallback in `assets/supabase-config.js`.
- `assets/account-settings.js` handles the account settings page session/profile logic. Profile data is intentionally minimal: name, phone, email, and portal role only; no profile-level business/company or website URL fields.
- `assets/account-nav.js` handles account navigation.
- `assets/supabase-config.js` stores public Supabase config (dedicated Dark Matter / Surette Data Systems project, not Naples Estate Jewelry) plus non-secret email allowlists.
- `assets/surette-physics-wordmark-canvas.js` + `assets/surette-physics-wordmark.css` drive the interactive mosaic wordmark on the apps hero.

## Auth / Portal

- Auth email redirect URLs are built from `assets/supabase-config.js` `siteUrl` (`https://surettesystems.com`) instead of the current browser origin, so local preview cannot generate localhost password reset links.

- Supabase browser auth (email/password and magic-link) — dedicated Dark Matter / Surette Data Systems project.
- Portal privileged roles: `super_admin` (owner). Primary source: `app_metadata.role`. Fallback: email allowlist in `assets/supabase-config.js`.
- Owner-only admin UX is split from the regular dashboard: `account.html` exposes only an Admin Center link for super-admins, while `account-admin.html` and `account-users.html` hold the private admin surfaces.
- Client profile schema intentionally excludes business/company name and website URL fields. The setup SQL drops old `company_name`/`company`/`website`/`site_url` profile/subscriber columns if they exist.
- Newsletter subscriber source: `homepage_email_signups`. The updated portal role setup SQL creates this table and mirrors new Auth account signups into it. It does not backfill all existing Auth users on every rerun, so owner-deleted subscriber rows do not reappear from account-holder fallback data.
- Supabase SQL:
  - `supabase/client-portal-schema.sql` — schema setup.
  - `supabase/portal-role-setup.sql` — `client_messages`, `portal-message-attachments` storage setup, `submit_site_message()`, `submit_portal_message()`, `list_portal_messages()`, `delete_portal_message()`, `list_portal_account_holders()`, `delete_newsletter_subscriber()`, `delete_portal_account_holder()` RPCs, and `handle_new_portal_user()` Auth signup trigger. It intentionally drops `list_portal_messages()` before recreating it because the returned columns have changed over time.
  - `supabase/client-profile-write-policies.sql` — RLS write policies.
- No local `admin` / `admin` bypass.
- Real customer/admin data must be protected by Supabase RLS or server-side functions — browser gating alone is not sufficient.

## Forms

- Public website forms use `assets/site-message-forms.js` to call Supabase `submit_site_message()` into `client_messages`; Contact and App Checkout also support optional image/photo attachments through the private `portal-message-attachments` storage bucket.
- Public website forms also post to Netlify Forms after the Supabase save so Netlify can send owner notification emails.
- Account-dashboard support/change requests use Supabase `client_messages` and the owner-only Admin Center Message Center, then post to the `client-request` Netlify Form for owner notification email.
- Homepage newsletter signup uses Supabase `homepage_email_signups` rather than Netlify Forms.
- Keep form field names and `data-message-source` values stable across language mirrors.

## Future Direction

If duplication becomes too heavy, migrate to generated static HTML using shared layouts and structured bilingual content. Astro is the preferred marketing-site candidate; authenticated app/dashboard work may need a separate app stack.
