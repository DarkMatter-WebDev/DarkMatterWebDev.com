# Current Status

Last updated: 2026-07-02

## Site State

- Static Dark Matter site with English root pages only; Spanish `es/` mirrors are absent from this working copy.
- Main navigation: Home, Services (dropdown), Apps, Websites, Client Login, Contact Us. The Websites item links to `casestudies.html`. Process no longer appears as a top-level nav item — it is reachable through service-page CTAs.
- `apps.html` is the canonical Surette Data Systems app-library page; old `/downloads` URLs redirect here.
- Sean's Google Ads source is intentionally external (`https://seansads.com/`).

## Current Features

- Homepage hero background is the Nova particle-galaxy WebGL widget (`nova/nova-widget.html`), mounted as a fixed full-viewport `#nova-bg` div at `z-index:1`. A fixed `#hero-tint` scrim at `z-index:2` anchors the gradient overlay so it doesn't scroll away. The homepage integration promotes `#nova-bg`/canvas to a composited layer and ignores height-only mobile viewport resize events so browser toolbar changes do not reallocate WebGL during scroll. The old black-hole Three.js scene is gone. Only the homepage integration and the `CONFIG` block should be changed; leave the Nova engine copy alone unless explicitly needed.
- Non-home pages use the shared cosmic-web background system (`assets/cosmic-web.css`).
- Services pages: Website Design, Managed Hosting, Website Care Plans, Custom Business Web Apps (links to `apps.html`), In-Home Tech Services, Office Network Setup. Website Design, Managed Hosting, Care Plans, Custom Apps, In-Home, and Office Network pages all include "View Our Process" CTAs.
- Website Preference Builder and Contact use Netlify Forms.
- Client portal pages are static HTML wired for Supabase auth.
- Mobile page headers inject an icon-only account link via `assets/account-nav.js`. Signed-in state may change the accessible label/title to "Account", but the visible mobile header control should remain just the `account_circle` icon.

## Portal Pages

- `account.html` — Client dashboard. Supabase email/password auth. Super-admin sees account-holder viewer ("View all site account holders") backed by `list_portal_account_holders()` Supabase RPC. Sean sees Google Ads links plus the member workspace in oversight mode.
- `account-settings.html` — Profile/password management. Gated by Supabase session; shows sign-in prompt when logged out.
- `account-created.html` — Email confirmation landing page. Supabase redirects here after new registration; instructs user to verify email before signing in.
- `account-ads-status.html` — Google Ads workspace stub for Sean. Static page with links to seansads.com and the main dashboard.
- `seans-google-ads-dashboard.html` — Sean/owner-only portal UI.
- Privileged portal access reads Supabase `app_metadata.role` first (`super_admin`, `sean_ads_admin`), with email allowlist fallback in `assets/supabase-config.js`.
- Auth signup trigger (`handle_new_portal_user()`) mirrors new user metadata into `client_profiles`.

## Surette Data Systems Apps

App/software brand is **Surette Data Systems**. Five app profiles exist:

1. **Auction House & Consignment Store Software** — `auction-house-consignment-store-software.html`. Screenshots under `assets/apps/auction/` (WebP).
2. **Secondhand Dealer Management System (SDMS)** — `secondhand-dealer-management-system.html`. Screenshots under `assets/apps/sdms/` (WebP).
3. **Benji Payroll Management System** — `benji-payroll-management-system.html`. Screenshots under `assets/apps/benji/` (WebP + SVG variants).
4. **Antique Mall Vendor Management System and Auction Platform** — `antique-mall-vendor-management-system-and-auction-platform.html`. Live app at `https://thirdstreetauctions.com/`. Screenshots under `assets/apps/antique-mall/` — newer `thirdstreet-*.png` captures are current; older `antique-mall-*.png` captures may be stale/unused.
5. **MetalsCalc — Buying Calculator** — `metalscalc-buying-calculator.html`. Live Au/Ag/Pt spot pricing, customizable buy percentages, coin library, and one-tap PDF invoices for precious-metal dealers. PWA. Screenshots under `assets/apps/metalscalc/` (PNG). Note: OG/meta URLs in this file reference `darkmatterwebsites.com` rather than `darkmatterwebdev.com` — may need correction.

App catalog (`app-catalog.html`) uses `.portfolio-tile` cards (same design as Websites/case studies page): 5 app tiles + a dashed "Let's build yours today" open tile. 2-up mobile, 3-up desktop.

App profile pages share compact typography overrides (`assets/surette-data-systems-app-profile.css` / `assets/surette-data-systems-app-profile-compact.css`) and mobile CTA callout panels. No English/Spanish nav toggle on individual app profiles (removed when Spanish mirrors were absent).

Surette Data Systems brand assets:
- `assets/surette-data-systems-logo.webp`
- `assets/surette-data-systems-icon.webp`
- `assets/surette-data-systems-geometric-icon.webp` (transparent geometric, used site-wide as the icon)
- `assets/surette-data-systems-floating-icon.webp`
- `assets/surette-data-systems-floating-orange-blocks.webp` (apps hero drift mark)

`apps.html` hero uses an inline SVG/CSS interactive Surette Data Systems wordmark with a page-load intro (full word lights up, then each letter falls/materializes left-to-right, then hover activates). Hovered letters rumble, break apart, tumble off-page, vanish, and rematerialize. Hover-started animations complete even if the pointer leaves.

## Portfolio / Websites

Websites gallery (`casestudies.html`) — current entries (in order):
1. Naples Estate Jewelry — `portfolio-naplesestatejewelry.html`. Screenshots under `assets/portfolio/naples-estate-jewelry/` (PNG + WebP).
2. JP Surette — `portfolio-jpsurette.html`. Screenshots under `assets/portfolio/jpsurette/`.
3. Elite Yacht Detailing — `portfolio-eliteyachtdetailing.html`. Screenshots under `assets/portfolio/elite/`.
4. Sean's Ads — `portfolio-seansads.html`. Screenshots under `assets/portfolio/seansads/`.
5. AuctionBuddha.com — `portfolio-auctionbuddha.html`. Screenshots under `assets/portfolio/auction-buddha/` (PNG).
6. MetalsCalc.com — `portfolio-metalscalc.html`. Product landing and PWA install page. Screenshots under `assets/portfolio/metalscalc/` (PNG).
- Open "Your Project Here" tile.

## Known Cautions

- Supabase portal auth gates are browser-only; real data security requires RLS + server-side functions.
- `supabase/portal-role-setup.sql` must be run in the dedicated Dark Matter / Surette Data Systems Supabase project (not Naples Estate Jewelry) before the admin account-holder table and signup trigger work.
- Static validator reports pre-existing noise: missing `es/` mirrors, `node_modules` HTML scan, stale Sean Ads Spanish links, mojibake warnings, plus the old `blackhole-icon.html` missing-video warning.
- Old `antique-mall-*.png` screenshots may still be on disk alongside the current `thirdstreet-*.png` set; audit and remove if unused.
- MetalsCalc app/portfolio OG meta URLs reference `darkmatterwebsites.com` — should be corrected to `darkmatterwebdev.com` if that is the canonical domain.
- Admin-only ThirdStreetAuctions.com screenshots not yet captured (browser bridge was unavailable); add when an authenticated session is available.
