# Tasks

Last updated: 2026-06-22

## Active

- Keep memory docs compact and current after meaningful work.
- Reconcile the project docs/validator expectations with this working copy's missing `es/` mirrors.
- Run the static validator after broad HTML/CSS/JS edits.

## Near-Term

- Review all high-value pages on desktop and mobile before launch.
- Finish Supabase setup before treating portal/account/billing as live:
  - use the dedicated Dark Matter / Surette Data Systems Supabase project, not the Naples Estate Jewelry project
  - run `supabase/client-portal-schema.sql`
  - run `supabase/portal-role-setup.sql`
  - confirm `list_portal_account_holders()` exists and returns rows for the super-admin account
  - confirm `handle_new_portal_user()` trigger creates `client_profiles` rows for new Auth signups
  - set Auth user `app_metadata.role` values:
    - owner `rcman12589@aol.com` -> `super_admin`
    - Sean `scochrane495@gmail.com` -> `sean_ads_admin`
  - configure Auth redirects and email templates
  - create test users/client rows
  - verify RLS
  - confirm Netlify forms
- Add secure backend/Netlify Function before real Stripe recurring billing or admin operations.
- Keep Auction and SDMS screenshots current with their hosted demos.
- Keep Antique Mall screenshots current with `https://thirdstreetauctions.com/`.
- Capture and add logged-in ThirdStreetAuctions.com admin/vendor dashboard screenshots once a usable authenticated browser session or exported screenshots are available.
- Review app pricing copy and rates after real client feedback.

## Backlog

- Native Spanish review before major public launch.
- Add real client/operations references to `CLIENTS.md` when approved.
- Decide first analytics source for portal traffic summaries.
- Build real account settings and Google Ads activity/status workflows.
- Consider future migration from duplicated hand-authored HTML to generated static HTML with shared layouts and structured bilingual content.

## Recently Completed

- Rebuilt the `app-catalog.html` gallery cards to mirror the Case Studies `.portfolio-tile` product-listing design (screenshot + badge + tag chips + title + description + hover CTA, dashed open tile), replacing the old 3D `.ux-card` themed cards. Verified desktop/mobile in preview.
- Removed the deleted "fly" canvas hero background from `app-catalog.html` (unwired the div, `fly.js` script, fly CSS, and the three.js importmap/es-module-shims), restored the standard cosmic-web background, and tightened the gallery top padding. Kept all other canvas objects per user confirmation.
- Refreshed the NaplesEstateJewelry.co Websites listing and detail page with current live-site copy and screenshots covering shop, product value, estate evaluation, and auction guidance flows.
- Added AuctionBuddha.com to the Websites gallery with desktop/mobile catalog tiles, a new detail page, and public screenshots captured from `https://auctionbuddha.com/`.
- Refreshed the Antique Mall / Third Street Auction Marketplace profile with ThirdStreetAuctions.com public screenshots, live URLs, updated feature copy, a non-overlapping marketplace-flow diagram, and a tighter app catalog card.
- Replaced the homepage black-hole hero background with the Nova particle-galaxy widget (`nova/nova-widget.html`), embedded as-is in `index.html`.
- Added a super-admin "View all site account holders" dashboard button and table backed by a Supabase RPC for auth/profile account data; added a Supabase Auth signup trigger to seed `client_profiles`.
- Added Antique Mall Vendor Management System and Auction Platform to the app catalog with a standalone Surette Data Systems profile page, live-demo CTAs, six captured app screenshots, modal previews, feature sections, and custom-build copy.
- Removed the defunct English/Spanish nav toggle from the Auction, SDMS, and Benji app detail pages by clearing stale `data-lang-alt` attributes and making the shared standard nav omit language UI when no alternate is configured.
- Increased the mobile Surette hero block-letter spacing a tiny bit more while keeping desktop unchanged.
- Added a tiny amount of spacing between the Surette hero block-letter groups.
- Fixed mobile apps hero overlap by giving the hero subtext and Software Catalog kicker clear vertical separation.
- Changed the apps hero lead copy to white and aligned `DATA` / `SYSTEMS` on the same baseline across desktop and mobile.
- Tuned the mobile apps hero Surette block field to be taller, slightly smaller, and less far right while keeping the object visible and off the right edge.
- Pushed the desktop apps hero Surette block drift much farther right while keeping mobile unchanged.
- Extended the desktop apps hero Surette block drift farther right and trimmed its lower travel edge slightly.
- Shifted the mobile apps hero Surette block drift up/right with a separate mobile path so it stays mostly on the right and can hang off the screen edge.
- Trimmed the desktop apps hero Surette block lower travel range so it only passes behind the gallery cards slightly.
- Lowered the desktop apps hero Surette block drift field slightly after the prior lift so it does not travel as high and can drift lower.
- Lifted the desktop apps hero drifting Surette block mark higher while preserving its left/right anchoring and tight catalog spacing.
- Changed `DATA SYSTEMS` to white across desktop/mobile and tightened the apps hero-to-software-catalog spacing while keeping the drifting mark behind the catalog layer.
- Changed the mobile apps hero `DATA SYSTEMS` subtitle and side rules to white for better contrast over the drifting mark.
- Expanded the apps hero Surette block mark drift zone on desktop and changed mobile to a behind-text edge-reaching drift layer without sideways page scroll.
- Changed the apps hero orange/purple Surette block mark from a simple float to a slow zero-gravity drift inside its visual area.
- Added a large floating orange/purple Surette block mark to the English/Spanish apps hero and compressed the source image as lossless WebP.
- Added a large floating block-style hero image and building-blocks subtitle copy to the English/Spanish case studies pages.
- Refined the app-library hero wordmark into responsive SVG/CSS mosaic block letters with independent hover flow and no secondary undertext layer.
- Smoothed the Surette Data Systems hero hover interaction so blocks ramp into motion instead of jumping immediately.
- Changed the Surette Data Systems hero hover interaction so each hovered letter's blocks fall off-page, disappear briefly, and rematerialize.
- Changed the Surette Data Systems materialize hover cycle to run once instead of looping while hovered.
- Slowed the Surette Data Systems hero fall sequence and added independent shake/bounce/tumble motion before the off-page drop.
- Rebalanced the Surette Data Systems hover effect so the rumble continues longer and the off-page fall stays slow instead of accelerating sharply.
- Added a small Surette Data Systems app-page script so hover-started wordmark animations finish even when the pointer leaves quickly.
- Added a Surette Data Systems wordmark page-load intro that lights the full word, runs each letter animation left-to-right, then enables hover behavior.
- Kept the Surette Data Systems intro glow active through the full left-to-right letter cascade, clearing it only after the intro completes.
- Refined the Surette hero mosaic `S` by removing the top-left tile for clearer letter recognition.
- Removed the small pulsing purple dot from the mobile Contact header.
- Updated Auction and SDMS app detail pages to link "Visit Subscription Portal" CTAs to `portal.darkmatterapps.com`.
- Updated the homepage Surette Data Systems widget copy and accessibility label.
- Added shared compact typography and mobile hero callout overrides for Surette Data Systems app profile pages.
- Added mobile-only "more app details below" cues under app profile hero buttons.
- Changed mobile app profile hero buttons to a compact two-column layout with smaller padding, type, and icons.
- Replaced white-square Surette icon usage with the transparent floating Surette icon on home widgets, app credits, app pricing footer, and app profile footers.
- Aligned the Surette Data Systems app-page `DATA SYSTEMS` wordmark subtitle with its side rules.
- Replaced the previous floating Surette icon with the new geometric transparent Surette icon site-wide and added it above the apps-page company kicker.
- Rebranded the app/software line to Surette Data Systems across English/Spanish app pages, app pricing, home-page app widgets, profile credits, footers, CSS assets, and project docs.
- Added lossless WebP Surette Data Systems logo/icon assets and removed the stale former-brand SVG asset.
- Compacted project markdown memory, trimmed old feature docs, removed a stale imported Elite Yacht design brief, removed the old meeting note, and removed unreferenced root `sean-check-*.png` leftovers.
- Ran mobile sweep and fixed pricing banner CTA containment, two-wide app pricing tiers, SDMS mobile profile overflow, Built By decorative blur overflow, Preference Builder hero overflow, and SeansAds portfolio mobile overflow.
- Made pricing tier cards clickable through the client portal to app checkout context.
- Added/updated Auction and SDMS app profile pages with WebP screenshots, modal previews, pricing CTAs, language callouts, and powered-by/footer shells.
