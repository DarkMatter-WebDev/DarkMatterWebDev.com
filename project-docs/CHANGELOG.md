# Changelog

This file is intentionally compact. Keep only high-signal recent changes and major milestones.

## 2026-06-22 (nav flash + page fade-in fix)

- Fixed the nav jump and flash on all pages. Root causes: `#sds-logo` / `#sds-logo-mobile` are empty placeholder divs until `surette-logo.js` inserts the 60×60 canvas at DOMContentLoaded, causing the nav to reflow; Tailwind CDN processes injected nav HTML (on `standard-site-nav.js` pages) asynchronously via MutationObserver, briefly showing unstyled classes.
- `assets/nav.css` — added `html { opacity: 0; transition: opacity 0.38s ease }` immediately after `@import`, so the page is hidden before the browser's first paint (render-blocking CSS guarantees this). Added a CSS animation fallback (`dm-page-show`, 200ms delay) scoped to `html:not(.sds-logo-loaded)` so portal/utility pages that don't load `surette-logo.js` still reveal within 200ms. Reduced-motion override included.
- `surette-logo.js` — (1) stamps `sds-logo-loaded` on `<html>` synchronously at IIFE parse time, suppressing the CSS animation for all pages that load the logo script; (2) after the DOMContentLoaded logo init, schedules the reveal via `setTimeout(0)` + 2×`requestAnimationFrame`, ensuring the canvas is painted before opacity is set to 1; (3) 850ms safety timeout ensures the page is never permanently invisible if something stalls.
- `assets/client-portal.js` — changed 4 serial `maybeQuery` awaits to `Promise.all` for parallel Supabase dashboard reads.
- `netlify.toml` — rewrote with security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), `Link` preconnect hints for Tailwind/fonts/jsdelivr CDN, `Cache-Control: no-store` for HTML, long-lived immutable cache for `/assets/*`, all original redirects preserved.

## 2026-06-22 (doc audit)

- Full project-docs audit against actual disk state. Updated `CURRENT_STATUS.md`, `TASKS.md`, `HANDOFF.md`, `ARCHITECTURE.md` to reflect: MetalsCalc app + portfolio entry, three new portal pages (`account-created.html`, `account-settings.html`, `account-ads-status.html`), removal of black-hole hero video references from ARCHITECTURE, correct Surette brand asset filenames, and stale antique-mall screenshot note. Updated `MEMORY.md` project memory accordingly.

## 2026-06-22

- Redesigned the `app-catalog.html` application gallery cards to match the Websites/Case Studies (`casestudies.html`) product-listing tiles. Removed the old "DepthFold" 3D `.ux-card` theme system (gradient/glass/orbit-circle CSS and markup) and replaced it with `.portfolio-tile` cards: a 16:10 screenshot media area with a numbered "0X · LIVE DEMO" badge and gradient scrim, cyan/purple tag chips, an `font-headline-md` title, a description, and a hover-reveal "Open profile →" CTA. Grid changed to `grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-gutter` (2-up mobile, 3-up desktop). The "Let's build yours today" card is the dashed `.portfolio-tile--open` tile. Card screenshots: `assets/apps/auction/auction-dashboard.webp`, `assets/apps/sdms/sdms-dashboard.webp`, `assets/apps/benji/benji-dashboard.webp`, `assets/apps/antique-mall/thirdstreet-home.png`. Added a mobile-only `.portfolio-card-title` size override (the Case Studies title-fit JS/container-query CSS was intentionally not pulled in, since its global `0.72rem` base depends on that script). Verified desktop + mobile in preview: 5 tiles, all images load, no console errors, no horizontal overflow.
- Removed the "fly" canvas hero background from `app-catalog.html`. The `assets/fly/` folder was deleted, so unwired it: removed the `.fly-background` div, the `assets/fly/fly.js` module script, the fly-specific inline CSS, and the now-unused `es-module-shims` + three.js/lil-gui `importmap` (only fly used them). Removed the `body.sds-apps-page` transparent / `::before { display:none }` overrides so the standard cosmic-web background returns, and tightened `main.catalog-main` top padding from `pt-[46vh]` (room for the old canvas hero) to `pt-6 md:pt-10` so the gallery sits just below "Back to Apps". Verified in preview: no fly/three/importmap requests, cosmic-web `body::before` active, 5 gallery tiles intact, no console errors. The animated SuretteLogo nav badge canvas was intentionally kept (user confirmed no other canvas objects should be removed).

## 2026-06-21

- Made the Websites page "Back to Website Design" link referrer-aware: it is hidden on direct visits and only appears when the visitor came from `services/website-design.html`.
- Recaptured the NaplesEstateJewelry.co homepage screenshot after the live homepage update and refreshed the portfolio tile asset.
- Refreshed the NaplesEstateJewelry.co Websites listing and detail page from the live site, replacing stale WebP screenshot references with current PNG captures for the homepage tile, shop catalog, product value panel, estate evaluation page, and auction guidance page.
- Matched the Websites page desktop nav active state to the homepage: the `Websites` link is now cyan, underlined, and marked with `aria-current="page"` on `casestudies.html`.
- Changed the AuctionBuddha closer-look screenshot cards to show full contained screenshots with smaller text below, instead of cropped fixed-height previews with oversized lower text panels.
- Removed the AuctionBuddha detail page's full-page mini previews block after one preview rendered poorly, leaving the closer-look screenshots and feature cards.
- Added AuctionBuddha.com to the Websites gallery with desktop/mobile tiles, created `portfolio-auctionbuddha.html`, and captured public screenshots into `assets/portfolio/auction-buddha/` for the homepage, store, auctions, vendor/seller access, login, and mobile home.
- Renamed the case studies page hero and metadata to "Websites We've Built" to match the new `Websites` navigation label.
- Changed the `Websites` header nav item back to the standard plain nav-link treatment so it matches the rest of the header menu on all pages.
- Replaced the top-level `Process` header/bottom-nav item with a green outlined `Websites` link to `casestudies.html` across shared and hand-authored navigation, while adding `View Our Process` CTAs to Website Design, Managed Hosting, Website Care Plans, Custom Business Web Apps, In-Home Tech Services, and Office Network Setup.
- Removed the lower "Demo Access" and "Get Started" CTA blocks from the Antique Mall / Third Street profile page so the profile ends after the custom-version content and shared footer.
- Refreshed `antique-mall-vendor-management-system-and-auction-platform.html` around the live ThirdStreetAuctions.com app: updated CTAs to the production URL, replaced screenshot cards with seven new public captures (home, shop, shops, auctions, listing detail, auction detail, login), and updated captions/features for vendor shops, filters, carts, accounts, and auction lots.
- Fixed the Antique Mall profile marketplace-flow visual so its Vendors, Listings, Browse, Auctions, and Accounts cards use a responsive CSS grid instead of overlapping absolute positioning.
- Updated the Antique Mall card in `app-catalog.html` to present the current Third Street Auction Marketplace positioning.

## 2026-06-18

- Removed the homepage "Do Not Press" widget and its linked page. Deleted the desktop and mobile `.sds-home-widget--right` buttons from `index.html` (they linked to `face-interactive.html`), removed the now-unused `.sds-home-widget--right` CSS variant from `assets/surette-data-systems-home-widget.css`, and deleted the root `face-interactive.html` page. The `assets/face/` source was already removed. Verified no remaining references repo-wide; the bottom-left "View our business software" widget is unaffected.
- Anchored the homepage hero darkening tint. Because the Nova background is `position:fixed` but each hero's gradient overlay was `position:absolute` (inside the hero section), the tint scrolled away with the hero and left the rest of the page over full-brightness particles. Removed both per-hero `absolute` overlays and added one fixed, viewport-anchored scrim (`#hero-tint`) as a sibling of `#nova-bg` at `z-index:2` — above the Nova background (`z-1`) and below all page content (`main` is `z-10`). The tint now stays put across the whole page while text scrolls freely over it, keeping content readable over the particle field. Verified on desktop and mobile.
- Replaced the homepage (`index.html`) black-hole Three.js hero background with the self-contained Nova particle-galaxy widget from `nova/nova-widget.html`. Dropped in the widget's `<script type="module">` (CONFIG + engine) verbatim and mounted it via a new `#nova-bg` div in the same fixed full-viewport hero slot (`z-index:1`) the black hole used. Removed the old `#singularity-hero-bg` div and its driving module script. The widget loads Three.js 0.136 from `esm.sh`, so it does not use the page importmap. Verified in preview on desktop and mobile: Nova canvas mounts and renders, no console errors, content/nav layer cleanly on top.

## 2026-06-14

- Documented the portal Supabase separation from Naples Estate Jewelry across project memory, Supabase config comments, and setup SQL; removed the stale `jewelrySiteUrl` config entry.
- Added a super-admin account-holder viewer to the client dashboard: `account.html` now has a "View all site account holders" button, `assets/client-portal.js` loads and renders account rows, `assets/client-portal.css` styles the responsive admin table, and `supabase/portal-role-setup.sql` defines the super-admin-only `list_portal_account_holders()` RPC plus an Auth signup trigger that seeds `client_profiles`.
- Added Antique Mall Vendor Management System and Auction Platform to `app-catalog.html` with a matching 3D catalog card and new standalone profile page.
- Captured six screenshots from `https://antique-shop-naples.netlify.app/` into `assets/apps/antique-mall/` covering homepage, vendors, auctions, listing detail, auction detail, and gated seller login.
- Verified the new catalog/profile pages and screenshot assets return `200` locally; the screenshot modal opens and loads images. Ran `scripts/validate-site.ps1`; it still fails on broader repo issues plus the expected missing Spanish mirror for the new English-only profile.
- Removed the defunct English/Spanish navigation toggle from the individual app detail pages: Auction House & Consignment Store Software, Secondhand Dealer Management System, and Benji Payroll Management System. The shared standard nav now renders language UI only when a page provides a real alternate URL.
- Started a local static preview at `http://127.0.0.1:4173/` and verified the Auction app detail page has no `.lang-switch` elements or stale `es/` links in the live nav.
- Ran `scripts/validate-site.ps1`; it still reports broader pre-existing issues in this working copy, including missing `es/` mirrors, old Sean Ads Spanish links, `node_modules` HTML scans, and mojibake warnings.

## 2026-06-08

- Stabilized the Surette Data Systems physics wordmark hover-reattach: the shake handoff (`handoffCharToGsapShakeAnchor`) now clears only filter/opacity/color leftovers and sets the shake transform + transform-origin deterministically, instead of clearing the transform in the same `gsap.set` and rebuilding it via a re-measure/compensate. This removes a one-frame jump/origin-snap that could surface when a main letter was activated again after a full fall + rematerialize cycle. Bumped the `apps.html` / `es/apps.html` wordmark script cache key to `20260608-reattach-stable`.
- Increased the mobile Surette hero block-letter spacing slightly.
- Added subtle spacing between the Surette hero block-letter groups.
- Fixed mobile apps hero overlap between the "Workflow software..." subtext and Software Catalog.
- Changed the apps hero lead copy to white and removed the `DATA` / `SYSTEMS` vertical offsets so the subtitle aligns cleanly.
- Tuned the mobile apps hero Surette block field: more vertical room, smaller mark, and a gentler right-side bias.
- Pushed the desktop apps hero Surette block drift much farther right without horizontal overflow.
- Extended the desktop apps hero Surette block drift farther right and slightly reduced its lower travel.
- Added a right-biased mobile drift path for the apps hero Surette block and slightly limited the desktop lower travel range.
- Adjusted the desktop apps hero Surette block drift field slightly downward after review.
- Lifted the desktop apps hero Surette block mark drift field higher without adding rightward anchoring.
- Changed the apps hero `DATA SYSTEMS` subtitle/rules to white on desktop and tightened the gap before Software Catalog on desktop/mobile.
- Changed the mobile apps hero `DATA SYSTEMS` subtitle and side rules to white.
- Expanded the apps hero Surette block mark drift on desktop and mobile, layering text above the drifting visual and clipping mobile overflow to prevent horizontal scroll.
- Changed the apps hero orange/purple Surette block mark to a slow zero-gravity drift animation with desktop/mobile containment checks.
- Added `assets/surette-data-systems-floating-orange-blocks.webp` and placed it as a large floating visual beside the Surette Data Systems apps hero wordmark.
- Added `assets/case-studies-building-blocks.webp` and placed it as a large floating hero visual on English/Spanish case studies pages with updated building-blocks positioning copy.
- Added compact typography and mobile hero callout overrides for Surette Data Systems app profile pages so hero and section headings take less vertical space without changing fonts or colorways.
- Added mobile-only "more app details below" cues under app profile hero buttons so phone visitors can tell more content follows.
- Changed mobile app profile hero CTAs to a compact two-column button grid and verified no clipping at 390px or 360px widths.
- Added `assets/surette-data-systems-geometric-icon.webp` and replaced white-square Surette icon usage in home widgets, app credits, app pricing footer, and app profile footers.
- Adjusted the apps-page Surette `DATA SYSTEMS` subtitle so `DATA`, `SYSTEMS`, and the side rules align more deliberately.
- Replaced the previous floating Surette icon with `assets/surette-data-systems-geometric-icon.webp` site-wide and added the small mark above the apps-page company kicker.
- Updated the homepage Surette Data Systems widget copy to "View our business software."
- Changed Auction and SDMS app detail CTAs from "Request Live Login" to subscription portal links.
- Removed the small pulsing purple dot from the mobile Contact header in English and Spanish.
- Removed the top-left tile from the Surette hero `S` so the mosaic letter reads less like a `5`.
- Kept the Surette Data Systems hero intro glow on during the full letter-by-letter fall sequence, turning it off only after the first run completes.
- Added a Surette Data Systems hero intro sequence: full-word glow, then left-to-right letter fall/materialize before hover activation.
- Updated Surette Data Systems Apps hero and meta copy with business-owner search terms including CRM, ERP, inventory management, workflow automation, dashboards, reporting, and operations software.
- Added a Surette Data Systems app-page animation lock so each started hero wordmark hover animation finishes even if the user moves the pointer away.
- Rebalanced the Surette Data Systems hero hover timing so the rumble continues into a slower, more gradual off-page fall.
- Slowed the Surette Data Systems hero hover fall and added independent shake, bounce, and tumble stages before the blocks leave the page.
- Changed the Surette Data Systems hero materialize hover effect to run once per hover instead of looping continuously.
- Extended the Surette Data Systems hero wordmark hover so blocks fall off-page, vanish briefly, and materialize back into each hovered letter.
- Changed the Surette Data Systems hero wordmark hover from a jumble loop to a staggered block-fall interaction per letter.
- Smoothed the Surette Data Systems hero wordmark hover so block letters start slowly and build into faster jumbled motion.
- Removed the faint pseudo-text layer behind the Surette Data Systems hero mosaic wordmark so only the primary block letters render.
- Replaced the app-library raster hero wordmark with a responsive inline SVG/CSS Surette Data Systems widget whose icon and mosaic block letters animate independently on hover.
- Rebranded the app/software line to Surette Data Systems across English/Spanish app pages, app pricing, home widgets, app profile credits, and app footers.
- Added lossless WebP brand assets: `assets/surette-data-systems-logo.webp` and `assets/surette-data-systems-icon.webp`; removed the stale former-brand SVG.
- Renamed app-brand CSS assets to `surette-data-systems-*` filenames.

## 2026-06-05

- Wired portal privileged access to Supabase `app_metadata.role` via `assets/portal-auth.js`, with email allowlist fallback and shared Sean dashboard gating in `assets/seans-ads-dashboard.js`.
- Added `supabase/portal-role-setup.sql` for future RLS role helpers.
- Compacted project markdown memory for faster AI handoff and added an explicit startup trigger for `analyze this project's files`.
- Trimmed old feature docs into short pointers and removed stale markdown-only leftovers, including the imported Elite Yacht `DESIGN.md` and the old meeting note.
- Removed unreferenced root screenshot leftovers: `sean-check-final.png`, `sean-check-matte_loose.png`, `sean-check-matte_soft.png`, and `sean-check-plain.png`.
- Ran a phone-width mobile layout sweep, fixed app pricing question-button containment, kept pricing tiers two-wide on mobile, and patched targeted overflow on Built By, Preference Builder, SeansAds portfolio, and SDMS profile pages.
- Made app pricing tier cards clickable through the client portal to the selected app checkout context.
- Shortened Apps hero copy and added soft translucent color backing to app gallery tiles.
- Added app-aware pricing return links and pricing CTAs from Auction and SDMS app profiles.
- Slimmed the app pricing page to a compact banner plus immediate tiers and removed public benchmark links.
- Updated Auction and SDMS app profile pages with WebP screenshots, modal preview tiles, pricing/custom/demo CTA rows, language callouts, powered-by banner, and footer.
- Added/updated portal-only checkout pages and safe `next` redirects for app checkout.
- Added browser-side owner/Sean allowlists for portal UI access; removed the temporary `admin` / `admin` bypass.

## 2026-06-04

- Renamed the app library from Downloads to Apps, including `apps.html`, Spanish mirror, nav labels, and redirects from old Downloads URLs.
- Reworked Apps and Portfolio pages into gallery-first layouts with standalone detail pages.
- Added SDMS as a second Dark Matter app listing and full app profile.
- Added Auction House & Consignment Store Software profile pages and live demo/request CTA flow.
- Added powered-by/footer shells to app pages.
- Restored legitimate English/Spanish question marks and fixed malformed Spanish `textarea` tags.
- Documented that Sean's Google Ads source moved out of this repo and is managed separately.

## Earlier Milestones

- Built the static bilingual Dark Matter Surette Systems Portal site.
- Added Services, Process, Contact, Built By, Portfolio, Apps, Website Preference Builder, and Client Portal surfaces.
- Added Supabase starter config/schema for the portal.
- Added homepage hero media and shared cosmic-web visual system.
