# Current Status

Last updated: 2026-06-22

## Site State

- Static Dark Matter site currently present as English root pages in this working copy; the previously documented Spanish `es/` mirrors are absent here.
- Main navigation uses `Home`, `Services`, `Apps`, `Websites`, account/login, optional language alternate links only when a page explicitly provides one, and Contact. The Websites nav item links to `casestudies.html`. The Process page is still available through in-page service CTAs, but no longer appears as a top-level nav item.
- `apps.html` / `es/apps.html` are the canonical Surette Data Systems app-library pages; old Downloads URLs redirect.
- Portfolio page is gallery-only and links to standalone detail pages, including the new AuctionBuddha.com marketplace entry.
- Portfolio/case studies hero uses a large floating block-style WebP mark beside the title on desktop and a scaled version on mobile.
- Sean's Google Ads source is intentionally external and absent from this repo.

## Current Features

- Homepage hero background is the Nova particle-galaxy WebGL widget (`nova/nova-widget.html`), embedded as-is into `index.html` via a `#nova-bg` mount in the shared fixed full-viewport hero slot. It replaced the former black-hole Three.js background. The widget is self-contained (loads Three.js 0.136 from `esm.sh`); only its `CONFIG` block is meant to be edited — leave the engine alone.
- Non-home pages use the compressed cosmic-web background system.
- Services pages cover website services, care plans, custom apps, SEO, branding, hosting, consultation, and in-home/office tech help.
- Website Design, Managed Hosting, Website Care Plans, Custom Business Web Apps, In-Home Tech Services, and Office Network Setup pages include customer-facing links to the Process page.
- Website Preference Builder uses Netlify Forms in English and Spanish.
- Contact/client request forms use Netlify markup.
- Client portal pages are static front-end pages wired for Supabase auth.
- Client portal Supabase is a dedicated Dark Matter / Surette Data Systems project, fully separated from the Naples Estate Jewelry Supabase project.
- Portal-only checkout pages exist for app purchase requests.
- Privileged portal access reads Supabase `app_metadata.role` first (`super_admin`, `sean_ads_admin`), with email allowlist fallback in `assets/supabase-config.js`.
- Owner admin dashboard includes a "View all site account holders" tool that calls the super-admin-only `list_portal_account_holders()` Supabase RPC and renders account/profile rows in a table. The Supabase setup SQL also includes an Auth signup trigger to mirror new user name/phone metadata into `client_profiles`.
- Sean's direct Google Ads portal page shows Sean's customer center to Sean; super admin sees Sean's tools plus the member workspace in owner oversight mode.

## Apps

- App/software brand is Surette Data Systems.
- Surette Data Systems uses lossless WebP brand assets:
  - `assets/surette-data-systems-logo.webp`
  - `assets/surette-data-systems-geometric-icon.webp`
  - `assets/surette-data-systems-floating-orange-blocks.webp`
- Homepage widgets, app profile credits, app pricing footer, and app profile footers use the geometric transparent Surette icon instead of the old white-square/floating icon.
- Apps page includes the small geometric Surette icon above the Dark Matter company kicker without changing the animated wordmark.
- Apps page hero also uses a large orange/purple Surette block mark behind the animated wordmark area, with a slow zero-gravity drift animation; desktop has a wider drift zone and mobile lets the mark reach the screen edges behind the text.
- `apps.html` / `es/apps.html` use an inline SVG/CSS interactive Surette Data Systems hero wordmark with a page-load intro: the full word lights up and stays lit while each letter falls/materializes left-to-right, then the glow turns off and hover activates. Hovered letters rumble, break apart, slowly tumble off-page, vanish briefly, and rematerialize; started animations finish even if the pointer leaves.
- Apps gallery uses compact preview tiles, two-wide mobile tiles, soft translucent tile backing, and a custom-build CTA tile.
- `app-catalog.html` (the application gallery) uses the standard static cosmic-web background. The former "fly" WebGL canvas hero background was removed after the `assets/fly/` folder was deleted; the animated SuretteLogo nav badge canvas is unchanged.
- `app-catalog.html` gallery cards now use the same `.portfolio-tile` product-listing design as the Websites/Case Studies page (`casestudies.html`): screenshot media + numbered "LIVE DEMO" badge, cyan/purple tag chips, title, description, and hover "Open profile" CTA, in a 2-up mobile / 3-up desktop grid, with a dashed "Let's build yours today" open tile. The old 3D `.ux-card` "DepthFold" themed cards were removed. Card screenshots come from the existing per-app dashboards under `assets/apps/`.
- Apps hero/meta copy positions Surette Data Systems as custom desktop and web-based CRM, ERP, inventory management, workflow automation, dashboard, reporting, and operations software.
- Custom apps banner links to Contact and app pricing.
- App pricing pages:
  - `app-pricing.html`
  - compact banner, Back to App behavior when opened with `?from=auction` or `?from=sdms`
  - four clickable pricing tiers route through the client portal to checkout context
  - mobile pricing tiers stay two-wide
  - `Ask a Question` / `Hacer una pregunta` button is contained on mobile
- App profiles:
  - Auction House & Consignment Store Software
  - Secondhand Dealer Management System (SDMS)
  - Benji Payroll Management System
  - Antique Mall Vendor Management System and Auction Platform
  - App profiles have app-flow screenshot assets, modal screenshot previews, app CTA rows, pricing/custom/demo links, language/customization callouts, powered-by banner, and Surette Data Systems footer branding.
  - The Antique Mall profile links to the live ThirdStreetAuctions.com web app and uses captured PNG screenshots under `assets/apps/antique-mall/`, including public home, shop, vendor shops, auctions, listing detail, auction detail, and login screens.
  - The Antique Mall profile marketplace-flow hero diagram uses a responsive CSS grid so the Vendors, Listings, Browse, Auctions, and Accounts cards no longer overlap on desktop or mobile.
  - Auction, SDMS, and Benji app detail pages no longer show the defunct English/Spanish nav toggle or link to missing `es/` mirrors.
  - App profile typography uses a shared compact override so hero and section headings fit better across desktop and mobile; phone heroes use compact callout panels without the decorative hero visuals.
- Phone app profile heroes use compact two-column CTA buttons and show a small "more app details below" cue under the main CTA buttons; desktop keeps the cue hidden.

## Portfolio

- Websites gallery (`casestudies.html`) includes AuctionBuddha.com as a live marketplace project.
- AuctionBuddha gallery/detail assets live under `assets/portfolio/auction-buddha/`; the visible catalog/detail surfaces currently use the homepage, store, and auctions screenshots.
- NaplesEstateJewelry.co gallery/detail content has been refreshed from the live site with current screenshots under `assets/portfolio/naples-estate-jewelry/`; visible detail screenshots cover the shop catalog, product value panel, estate evaluation page, and auction guidance page.

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
- The admin account-holder table requires running the updated `supabase/portal-role-setup.sql` in Supabase so the `list_portal_account_holders()` RPC and `handle_new_portal_user()` signup trigger exist; the browser never uses a service-role key.
- `git` is not currently available in this shell.
- Keep Sean's Ads source out of this repo.
- Static validator currently reports broader issues in this copy, especially missing `es/` mirrors, stale Sean Ads Spanish links, `node_modules` HTML being scanned, and mojibake warnings. The Antique Mall and AuctionBuddha profile pages also appear in missing-`es` mirror output because this working copy currently has English root pages only.
- The in-app browser control bridge failed during the 2026-06-21 session before connecting to the logged-in ThirdStreetAuctions.com admin tab, so admin-only screenshots still need to be captured from a working logged-in browser session or supplied as image files.
