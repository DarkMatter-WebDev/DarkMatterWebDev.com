# Architecture

Last updated: 2026-06-22

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
- `supabase/` — starter SQL for the client portal.
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

## Shared Behavior

- Navigation is shared via `assets/standard-site-nav.js`; hand-authored fallbacks exist on some pages.
- `assets/mobile-services-nav.js` supports mobile services navigation.
- `assets/client-portal.js` handles portal UI/auth behavior, safe `next` redirects, and the super-admin account-holder table (calls `list_portal_account_holders()` Supabase RPC).
- `assets/portal-auth.js` reads Supabase `app_metadata.role` for privileged portal access; email allowlist fallback in `assets/supabase-config.js`.
- `assets/seans-ads-dashboard.js` gates Sean's Google Ads dashboard page using shared portal auth helpers.
- `assets/account-settings.js` handles the account settings page session/profile logic.
- `assets/account-nav.js` handles account navigation.
- `assets/supabase-config.js` stores public Supabase config (dedicated Dark Matter / Surette Data Systems project, not Naples Estate Jewelry) plus non-secret email allowlists.
- `assets/surette-physics-wordmark-canvas.js` + `assets/surette-physics-wordmark.css` drive the interactive mosaic wordmark on the apps hero.

## Auth / Portal

- Supabase browser auth (email/password and magic-link) — dedicated Dark Matter / Surette Data Systems project.
- Portal privileged roles: `super_admin` (owner), `sean_ads_admin` (Sean). Primary source: `app_metadata.role`. Fallback: email allowlist in `assets/supabase-config.js`.
- Supabase SQL:
  - `supabase/client-portal-schema.sql` — schema setup.
  - `supabase/portal-role-setup.sql` — `list_portal_account_holders()` RPC and `handle_new_portal_user()` Auth signup trigger.
  - `supabase/client-profile-write-policies.sql` — RLS write policies.
- No local `admin` / `admin` bypass.
- Real customer/admin data must be protected by Supabase RLS or server-side functions — browser gating alone is not sufficient.

## Forms

- Contact, request, and checkout flows use Netlify form markup.
- Keep form names/field names stable across language mirrors.

## Future Direction

If duplication becomes too heavy, migrate to generated static HTML using shared layouts and structured bilingual content. Astro is the preferred marketing-site candidate; authenticated app/dashboard work may need a separate app stack.
