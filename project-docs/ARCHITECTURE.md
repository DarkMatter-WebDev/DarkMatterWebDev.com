# Architecture

Last updated: 2026-07-03

## Current Stack

- Static HTML/CSS/JS â€” no build step required for normal editing.
- English pages at repo root. Spanish mirrors (`es/`) are the intended pattern but are absent from this working copy.
- Local preview commonly uses a static server at `http://127.0.0.1:4173/` (`npx http-server` or `start-preview.bat`).
- Netlify static deployment and redirects via `netlify.toml`.
- Tailwind CSS loaded via CDN (`https://cdn.tailwindcss.com?plugins=forms,container-queries`).

## Key Directories

- `assets/` â€” shared CSS, JS, images, SVGs, app screenshots, portfolio media.
- `assets/apps/auction/` â€” Auction app WebP screenshots.
- `assets/apps/sdms/` â€” SDMS WebP screenshots.
- `assets/apps/benji/` â€” Benji Payroll WebP + SVG screenshots.
- `assets/apps/antique-mall/` â€” Antique Mall screenshots (current: `thirdstreet-*.png`; older `antique-mall-*.png` may be stale).
- `assets/apps/metalscalc/` â€” MetalsCalc PNG screenshots.
- `assets/portfolio/` â€” Portfolio/website detail media.
- `services/` â€” English service pages.
- `nova/` â€” Nova particle-galaxy WebGL widget (`nova-widget.html` + `HANDOFF.md`). Only the `CONFIG` block should be edited â€” do not modify the engine.
- `project-docs/` â€” compact AI/project memory system.
- `supabase/` â€” setup SQL for the client portal, message center, newsletter subscribers, and public-form message capture.
- `scripts/validate-site.ps1` â€” static-site link validator.

## Surette Data Systems Brand Assets

- `assets/surette-data-systems-logo.webp` â€” full wordmark logo.
- `assets/surette-data-systems-icon.webp` â€” icon variant.
- `assets/surette-data-systems-geometric-icon.webp` â€” transparent geometric icon used site-wide.
- `assets/surette-data-systems-floating-icon.webp` â€” floating icon variant.
- `assets/surette-data-systems-floating-orange-blocks.webp` â€” large orange/purple block mark used in apps hero drift animation.
- `assets/surette-data-systems-og.png` â€” Open Graph image.
- `assets/case-studies-building-blocks.webp` â€” floating block visual used in case studies hero.

## Homepage Hero

- `index.html` uses the Nova particle-galaxy WebGL widget (`nova/nova-widget.html`) embedded as a fixed `#nova-bg` div at `z-index:1`. The old black-hole Three.js scene has been removed.
- A fixed `#hero-tint` scrim at `z-index:2` anchors the gradient overlay so it stays visible as content scrolls.
- Non-home pages use the shared cosmic-web background (`assets/cosmic-web.css`).

## Shared Behavior

- Navigation is shared via `assets/standard-site-nav.js`; hand-authored fallbacks exist on some pages.
- `assets/mobile-services-nav.js` supports mobile services navigation.
- `assets/client-portal.js` handles portal UI/auth behavior, safe `next` redirects for the regular account dashboard, and account-dashboard support/change request submissions through `submit_portal_message()`.
- `assets/account-admin.js` handles the owner-only ultra-wide left-tab Admin Center, tab state/hash behavior, message center with signed attachment links, embedded subscriber table, subscriber email export/copy modal, account-holder viewer, and confirmation-modal delete flow (calls `list_portal_messages()`, `delete_portal_message()`, `list_portal_account_holders()`, `delete_newsletter_subscriber()`, and `delete_portal_account_holder()` Supabase RPCs).
- `assets/account-users.js` handles the owner-only newsletter subscriber table from `homepage_email_signups` rows only, matching the Admin Center Subscribers tab.
- `assets/newsletter-signup.js` handles public homepage newsletter email submissions into `homepage_email_signups` using the browser Supabase client.
- `assets/portal-auth.js` reads Supabase `app_metadata.role` for privileged portal access; email allowlist fallback in `assets/supabase-config.js`.
- `assets/seans-ads-dashboard.js` gates Sean's Google Ads dashboard page using shared portal auth helpers.
- `assets/account-settings.js` handles the account settings page session/profile logic.
- `assets/account-nav.js` handles account navigation.
- `assets/supabase-config.js` stores public Supabase config (dedicated Dark Matter / Surette Data Systems project, not Naples Estate Jewelry) plus non-secret email allowlists.
- `assets/surette-physics-wordmark-canvas.js` + `assets/surette-physics-wordmark.css` drive the interactive mosaic wordmark on the apps hero.

## Auth / Portal

- Auth email redirect URLs are built from `assets/supabase-config.js` `siteUrl` (`https://surettesystems.com`) instead of the current browser origin, so local preview cannot generate localhost password reset links.

- Supabase browser auth (email/password and magic-link) â€” dedicated Dark Matter / Surette Data Systems project.
- Portal privileged roles: `super_admin` (owner), `sean_ads_admin` (Sean). Primary source: `app_metadata.role`. Fallback: email allowlist in `assets/supabase-config.js`.
- Owner-only admin UX is split from the regular dashboard: `account.html` exposes only an Admin Center link for super-admins, while `account-admin.html` and `account-users.html` hold the private admin surfaces.
- Newsletter subscriber source: `homepage_email_signups`. The updated portal role setup SQL creates this table and mirrors new Auth account signups into it. It does not backfill all existing Auth users on every rerun, so owner-deleted subscriber rows do not reappear from account-holder fallback data.
- Supabase SQL:
  - `supabase/client-portal-schema.sql` â€” schema setup.
  - `supabase/portal-role-setup.sql` â€” `client_messages`, `portal-message-attachments` storage setup, `submit_site_message()`, `submit_portal_message()`, `list_portal_messages()`, `delete_portal_message()`, `list_portal_account_holders()`, `delete_newsletter_subscriber()`, `delete_portal_account_holder()` RPCs, and `handle_new_portal_user()` Auth signup trigger. It intentionally drops `list_portal_messages()` before recreating it because the returned columns have changed over time.
  - `supabase/client-profile-write-policies.sql` â€” RLS write policies.
- No local `admin` / `admin` bypass.
- Real customer/admin data must be protected by Supabase RLS or server-side functions â€” browser gating alone is not sufficient.

## Forms

- Public website forms use `assets/site-message-forms.js` to call Supabase `submit_site_message()` into `client_messages`; Contact and App Checkout also support optional image/photo attachments through the private `portal-message-attachments` storage bucket.
- Account-dashboard support/change requests use Supabase `client_messages` and the owner-only Admin Center Message Center.
- Homepage newsletter signup uses Supabase `homepage_email_signups` rather than Netlify Forms.
- Keep form field names and `data-message-source` values stable across language mirrors.

## Future Direction

If duplication becomes too heavy, migrate to generated static HTML using shared layouts and structured bilingual content. Astro is the preferred marketing-site candidate; authenticated app/dashboard work may need a separate app stack.
