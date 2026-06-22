# Handoff

Last updated: 2026-06-22

## Startup Prompt

If the user says `analyze this project's files`, start by reading:

1. `AGENTS.md`
2. `AI_START_HERE.md`
3. `project-docs/PROJECT_OVERVIEW.md`
4. `project-docs/CURRENT_STATUS.md`
5. `project-docs/TASKS.md`
6. `project-docs/DECISIONS.md`
7. `project-docs/HANDOFF.md`

Then summarize the project in a few bullets and continue with the latest request.

## Immediate Context

- Static Dark Matter Surette Systems Portal site.
- This working copy currently has English root pages only; the previously documented Spanish `es/` mirrors are absent.
- App/software brand is Surette Data Systems.
- The portal uses a dedicated Dark Matter / Surette Data Systems Supabase project and is fully separated from Naples Estate Jewelry.
- Local preview usually: `http://127.0.0.1:4173/`.
- Sean's Ads source is intentionally not here; do not recreate it.
- `git` may be unavailable in this environment.

## Most Recent Work

- Replaced the `app-catalog.html` application gallery cards with the Case Studies product-listing tile design:
  - Removed the entire old "DepthFold" 3D card system — the `.ux-parent`/`.ux-card`/`.ux-glass`/`.ux-circle` themed CSS (`--ux-grad` colorways, glass layer, floating orb circles, 8-column tile media queries) and the matching markup with per-app gradient themes and SVG orbs.
  - Added `.portfolio-tile` CSS copied/adapted from `casestudies.html` (media area, gradient scrim, numbered `__badge`, hover-reveal `__cta`, dashed `--open` variant) and rebuilt the markup as a `grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-gutter` of anchor tiles.
  - Each app tile uses an existing dashboard/home screenshot: `assets/apps/auction/auction-dashboard.webp`, `assets/apps/sdms/sdms-dashboard.webp`, `assets/apps/benji/benji-dashboard.webp`, `assets/apps/antique-mall/thirdstreet-home.png`. The 5th tile is the dashed "Let's build yours today" → `contact.html` open tile.
  - Did NOT pull in `assets/portfolio-mobile-fixes.css` or the Case Studies title-fit JS: that CSS sets `.portfolio-card-title` to a tiny `0.72rem` base that only looks right when the fit script scales it up, so importing it without the script would shrink desktop titles. Instead added a self-contained mobile-only `.portfolio-card-title { font-size: 1.05rem }` override inside the page's own `@media (max-width: 767px)` block.
  - Verified in the port-3000 preview at desktop (3-up) and mobile 375px (2-up): 5 `.portfolio-tile`s, 0 old `.ux-card`s, all four screenshots load, no console errors, no horizontal overflow. Validator shows only the pre-existing `missing-es-pair`.

- Unwired and removed the "fly" WebGL canvas hero background from `app-catalog.html` after its `assets/fly/` source folder was deleted:
  - Removed `<div class="fly-background" data-fly-background>`, the `assets/fly/fly.js` module script, the fly-specific inline CSS, and the page's `es-module-shims` + three.js/lil-gui `importmap` (only fly consumed them).
  - Removed the `body.sds-apps-page { background-color: transparent }` and `body.sds-apps-page::before { display:none }` overrides so the shared cosmic-web `body::before` background renders again (the `sds-apps-page` class stays — it supplies the cosmic tint variables).
  - Changed `main.catalog-main` top padding from `pt-[46vh]` (space the old canvas hero needed) to `pt-6 md:pt-10` so the gallery sits just below the "Back to Apps" link.
  - User confirmed only the fly canvas should go — the animated SuretteLogo nav badge canvas and all other canvas objects were intentionally kept.
  - Verified in the port-3000 preview: no fly/three/importmap network requests, cosmic-web background active, 5 gallery tiles render, no new console errors. Validator shows only the pre-existing `missing-es-pair` for the English-only page.

- Replaced the global top-level `Process` nav slot with a green outlined `Websites` link to `casestudies.html`:
  - Updated shared nav generation in `assets/standard-site-nav.js`.
  - Updated hand-authored desktop/mobile nav variants in root pages, app catalog/apps pages, portfolio/detail pages, process page, account/Sean dashboard pages, and service pages.
  - Added `View Our Process` CTAs to the buyer-facing service surfaces: Website Design, Managed Hosting, Website Care Plans, Custom Business Web Apps (`apps.html`), In-Home Tech Services, and Office Network Setup.
  - Verified desktop and mobile nav no longer expose `Process` as a nav item on sampled pages, Websites appears instead, service pages include Process CTAs, and no horizontal overflow appeared in the checked 1280px and 390px viewports.
- Refreshed the Antique Mall Vendor Management System and Auction Platform profile around the live ThirdStreetAuctions.com app:
  - `antique-mall-vendor-management-system-and-auction-platform.html` now links CTAs to `https://thirdstreetauctions.com/` and `/auctions`.
  - Captured seven public screenshots into `assets/apps/antique-mall/`: `thirdstreet-home.png`, `thirdstreet-store.png`, `thirdstreet-shops.png`, `thirdstreet-auctions.png`, `thirdstreet-listing-detail.png`, `thirdstreet-auction-detail.png`, and `thirdstreet-login.png`.
  - Replaced the old screenshot cards/captions with Third Street screenshots covering public marketplace, shop filters, vendor shops, auctions, listing detail, auction detail, and gated login.
  - Updated the flow/feature copy for vendor shops, filtered catalog browsing, cart/account actions, gated workflows, and timed auction lots.
  - Fixed the hero marketplace-flow cards by converting the absolute-positioned layout into a responsive grid. Verified no overlap at 1280px desktop and 390px mobile, no horizontal overflow, seven screenshot cards render, and the screenshot modal opens a new Third Street asset.
  - `app-catalog.html` tile now reads "Third Street Auction Marketplace" with updated catalog/account/auction copy.
  - Admin-only ThirdStreetAuctions.com screenshots were not captured because the in-app browser control bridge failed before connecting to the logged-in tab; public captures came from Playwright. Add logged-in admin/vendor dashboard screenshots later when a usable authenticated browser session or exported image files are available.

- Added AuctionBuddha.com to the Websites gallery:
  - `casestudies.html` now has AuctionBuddha desktop and mobile tiles before the "Your Project Here" CTA.
  - New detail page: `portfolio-auctionbuddha.html`.
  - Captured public screenshots into `assets/portfolio/auction-buddha/`: `home.png`, `home-tall.png`, `store.png`, `auctions.png`, `sell.png`, `login.png`, and `mobile-home.png`.
  - Verified locally at desktop and mobile widths: no missing local assets and no horizontal overflow on the Websites gallery or AuctionBuddha detail page.

- Refreshed NaplesEstateJewelry.co portfolio content:
  - `casestudies.html` now uses the current live homepage screenshot and updated listing copy.
  - `portfolio-naplesestatejewelry.html` now emphasizes live spot pricing, era/year filtering, product scrap-value panels, saved items, cart/account surfaces, estate evaluations, auction guidance, and Spanish entry.
  - Fresh captures live under `assets/portfolio/naples-estate-jewelry/`, including `home.png`, `shop.png`, `product.png`, `sell.png`, `auctions.png`, `contact.png`, `account.png`, and `mobile-home.png`.
  - Verified locally at desktop and mobile widths: no missing local assets and no horizontal overflow.

- Anchored the homepage hero tint over the Nova background. The Nova bg is fixed, so the old per-hero `absolute` gradient overlays scrolled away and left scrolled content over bright particles. Replaced them with a single fixed `#hero-tint` scrim (sibling of `#nova-bg`, `z-index:2`, between Nova `z-1` and content `z-10`, `pointer-events:none`) using a top/bottom-dark vertical gradient. It stays anchored to the viewport while content scrolls freely above it. Note: a fixed tint must live at the body level (sibling of `#nova-bg`), not inside `main` (`z-10`) — at `z-2` inside `main` it would paint above the static content sections and dim the text itself.
- Swapped the homepage hero background: `index.html` now uses the Nova particle-galaxy widget (`nova/nova-widget.html`) instead of the black-hole Three.js scene. The widget's module script (CONFIG + engine) was dropped in verbatim and mounted via a new `#nova-bg` fixed full-viewport div in the same hero slot (`z-index:1`) the black hole occupied; the old `#singularity-hero-bg` div and its driving script were removed. Nova self-loads Three.js 0.136 from `esm.sh` (does not use the page importmap, which is now unused by index but left in place). Per `nova/HANDOFF.md`, only the widget's `CONFIG` block may be edited. Verified in preview on desktop + mobile: canvas mounts and animates, no console errors, nav/content sit cleanly above it.

- Updated project memory, Supabase config comments, and Supabase setup SQL to document that the Dark Matter / Surette Data Systems portal now lives in its own dedicated Supabase project, completely separated from the Naples Estate Jewelry Supabase project. Removed the stale `jewelrySiteUrl` config entry.
- Added an owner-only account-holder viewer to the client dashboard:
  - `account.html` super-admin panel has a "View all site account holders" button and hidden table panel.
  - `assets/client-portal.js` calls `supabase.rpc("list_portal_account_holders")`, renders auth/profile account details, and falls back to `client_profiles` with a setup warning if the RPC is not installed.
  - `assets/client-portal.css` adds responsive admin table styling.
  - `supabase/portal-role-setup.sql` now defines the `list_portal_account_holders()` security-definer RPC, adds a `handle_new_portal_user()` Auth trigger to seed `client_profiles`, and fixes `portal_role()` to prefer `app_metadata.portal_role` before legacy `role`.
  - `supabase/client-portal-schema.sql` now includes `client_profiles.portal_role` for fresh setups.
  - Browser preview of `account.html` loaded with no console errors; admin table shell is present and hidden until super-admin access is active.
  - Static validator still fails on broader known repo issues, not a new missing local asset for this dashboard change.
- Added Antique Mall Vendor Management System and Auction Platform as a new Surette Data Systems app:
  - new profile page `antique-mall-vendor-management-system-and-auction-platform.html`
  - new catalog card in `app-catalog.html`
  - screenshot assets in `assets/apps/antique-mall/`
  - live app reviewed at `https://antique-shop-naples.netlify.app/`
  - captured homepage, vendor directory, auctions, listing detail, auction lot detail, and gated seller login screenshots
- Verified locally at `http://127.0.0.1:4173/`: catalog card exists, profile loads, six screenshot cards render, screenshot modal opens and loads the image, and the touched pages/assets return HTTP 200.
- Ran `scripts/validate-site.ps1`; it fails on broader known repo issues (`node_modules` HTML scan noise, missing `es/` mirrors, stale Sean Ads Spanish links, mojibake warnings) plus the expected missing Spanish mirror for the new English-only Antique Mall profile.
- Removed the defunct English/Spanish nav toggle from `auction-house-consignment-store-software.html`, `secondhand-dealer-management-system.html`, and `benji-payroll-management-system.html` by deleting stale `data-lang-alt` values. `assets/standard-site-nav.js` now renders `.lang-switch` only when a page provides a real alternate URL. Live preview verified the Auction detail page has zero `.lang-switch` elements and no stale `es/` links in the nav.
- Local preview was started with `npx http-server` at `http://127.0.0.1:4173/` because the `python` command on this machine is the Windows app shim.
- Static validator was run and failed on broader pre-existing repository issues: missing `es/` mirrors, old Sean Ads Spanish links, `node_modules` HTML scan noise, and mojibake warnings.
- Fixed the physics wordmark hover-reattach jump: `handoffCharToGsapShakeAnchor` in `assets/surette-physics-wordmark.js` no longer clears the transform inside the same `gsap.set` that establishes it (which could revert the main-letter shake pivot from `50% 50%` back to the `62%` rest origin and snap Y on a re-activation). It now clears only filter/opacity/color, then sets the shake transform/origin deterministically — no re-measure/compensate. Verified via rAF instrumentation: post-rematerialize rest state is byte-identical to a fresh letter, shake origin is `50% 50%` on both first and second engage, and re-engage max frame jump is <0.1px. Cache key bumped to `20260608-reattach-stable` in `apps.html` / `es/apps.html`.
- Replaced the app-library raster hero wordmark with an inline SVG/CSS Surette Data Systems widget; the vector icon and mosaic block letters animate independently on hover.
- Rebranded the app/software line to Surette Data Systems across app-library pages, app pricing, app profiles, home widgets, app footers, CSS filenames, and project memory docs.
- Added lossless WebP Surette Data Systems assets:
  - `assets/surette-data-systems-logo.webp`
  - `assets/surette-data-systems-geometric-icon.webp`
- Removed the stale former-brand SVG asset.
- Wired portal privileged access to Supabase `app_metadata.role` through `assets/portal-auth.js`.
- Sean dashboard now uses shared gating: Sean sees his customer center; super admin sees Sean's tools plus member workspace in owner oversight mode.
- Added `supabase/portal-role-setup.sql` for future RLS role helpers.
- Compacted project markdown memory so future AI sessions have a lighter startup path.
- Trimmed old feature docs into short pointers and removed stale markdown-only leftovers, including `assets/portfolio/elite/DESIGN.md` and the old meeting note.
- Removed unreferenced root PNG leftovers:
  - `sean-check-final.png`
  - `sean-check-matte_loose.png`
  - `sean-check-matte_soft.png`
  - `sean-check-plain.png`
- Mobile pricing page was verified:
  - `Ask a Question` stays inside the banner.
  - Pricing cards are two-wide on mobile.
  - Page has zero horizontal overflow in the checked mobile viewport.
- Static validator passed after recent edits.

## Important Page Notes

- `apps.html`: Surette Data Systems app gallery and custom app CTAs.
- `app-pricing.html`: pricing tiers and portal/checkout links.
- `auction-house-consignment-store-software.html`: Auction app profile.
- `secondhand-dealer-management-system.html`: SDMS app profile.
- `benji-payroll-management-system.html`: Benji app profile.
- `antique-mall-vendor-management-system-and-auction-platform.html`: Antique Mall app profile.
- `account.html`: Supabase-facing portal.
- `seans-google-ads-dashboard.html`: Sean/owner-only portal UI.

## Validation

Run after broad edits:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

## Do Not Forget

- Mirror English/Spanish changes.
- Do not store secrets in markdown.
- Browser-side portal gates are not true security.
- Update compact memory docs before ending meaningful sessions.
