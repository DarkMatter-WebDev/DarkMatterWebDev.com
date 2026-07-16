# Current Status

Last updated: 2026-07-15

## Site State

- Static Dark Matter site with English root pages only; Spanish `es/` mirrors are absent from this working copy.
- Main navigation: Home, Services (dropdown), Portfolio, Client Login, Contact Us. `portfolio.html` is the top-level Portfolio hub and links onward to the existing Apps (`apps.html`) and Websites (`casestudies.html`) pages. Process no longer appears as a top-level nav item — it is reachable through service-page CTAs.
- `apps.html` is the canonical Surette Data Systems app-library page; old `/downloads` URLs redirect here.
- Sean's Google Ads source is intentionally external (`https://seansads.com/`).

## Current Features

- Homepage hero background is the Nova particle-galaxy WebGL widget (`nova/nova-widget.html`), mounted as a fixed full-viewport `#nova-bg` div at `z-index:1`. A fixed `#hero-tint` scrim at `z-index:2` anchors the gradient overlay so it doesn't scroll away. The homepage integration promotes `#nova-bg`/canvas to a composited layer and ignores height-only mobile viewport resize events so browser toolbar changes do not reallocate WebGL during scroll. The old black-hole Three.js scene is gone. Only the homepage integration and the `CONFIG` block should be changed; leave the Nova engine copy alone unless explicitly needed.
- Non-home pages use the shared cosmic-web background system (`assets/cosmic-web.css`).
- Services pages: Website Design &amp; Hosting (`services/website-design-hosting.html`, merged from the former separate Website Design, Managed Hosting, and Website Care Plans pages; now a complete public pricing page implementing `website_pricing_plan.txt` — managed plans, one-time builds, care plans, policies, add-ons, FAQ), Custom Business Web Apps (links to `apps.html`), In-Home Tech Services, Office Network Setup. Custom Apps, In-Home, and Office Network pages include "View Our Process" CTAs.
- Service pages share the Surette Data Systems footer block with legal/resource links and `info@SuretteSystems.com`; their separate mobile markup path now includes the standard fixed mobile logo/header, promoted mobile nav row with Services popout, and a compact mobile footer inside the `md:hidden` wrapper.
- **Navigation single source of truth (2026-07-15):** every public marketing/site page now renders its entire nav (desktop header, mobile header + hamburger dropdown, mobile bottom tab bar) from `assets/standard-site-nav.js` via one script tag: `<script src="assets/standard-site-nav.js?v=20260715-nav-unify" data-active="...">`. Valid `data-active` keys: `home`, `services`, `portfolio`, `apps` (maps to portfolio highlight), `account`, `contact`, `none` (no item highlighted — legal/utility pages). Pages under `services/` use `../assets/...` and the loader auto-prefixes all emitted links with `../`. `assets/unified-mobile-menu.js` (the legacy runtime retrofit shim) was deleted; no page carries inline nav markup anymore. **Do not hand-copy nav HTML into a page — add the loader tag instead.** The shared mobile pattern is a fixed top logo/header with icon-only account control before the hamburger, an accessible dropdown, and a fixed bottom nav; the desktop header is used from 768px upward. Exception: portal utility pages (`account-admin`, `account-users`, `account-settings`, `account-created`, `app-checkout`) intentionally keep their own minimal chrome.
- Shared `assets/nav.css` anchors fixed headers to the viewport, normalizes the Portfolio and client-login header gutters, and blocks accidental horizontal overflow on phone widths. The public-nav sweep passed 30 routes at 1440px, 834px, 768px, 767px, and 390px with no detected header, navigation, or overflow failures.
- Public website forms are dual-routed. Contact, Apps consultation, and App Checkout submit to Supabase `client_messages` through `assets/site-message-forms.js` for the Admin Center Message Center, then post the same form to Netlify Forms so Netlify can send owner notification emails. Contact and Checkout support optional photo/screenshot attachments for the private Supabase `portal-message-attachments` storage bucket.
- Homepage desktop/mobile hero now includes a newsletter subscriber email field wired to Supabase `homepage_email_signups` through `assets/newsletter-signup.js`. The email input uses an account-page-inspired transparent field with a thin cyan outline over the Nova background.
- Global page reveal still uses `html` opacity controlled by `surette-logo.js`, with a sitewide no-white-flash baseline: critical inline head CSS on HTML pages, black `html`/`body` and true app-root backgrounds in `assets/nav.css`, dark route/app loader surfaces, and `theme-color` set to `#050505`. Visual page shells such as the account portal remain transparent so animated/cosmic backgrounds can show through. Same-site link clicks briefly show the small black spinner overlay before navigation to avoid a frozen-page feel. Repeated cards/panels/tiles use a shared object-level reveal so their text and background treatment appear together after page-ready.
- Client portal pages are static HTML wired for Supabase auth. Auth email redirects use `assets/supabase-config.js` `siteUrl` (`https://surettesystems.com`) as the canonical base, so password reset emails generated during local preview should no longer point at localhost. Account-dashboard support/change requests submit to Supabase `client_messages` through `submit_portal_message()` for the Admin Center and also post to Netlify Forms for owner email notifications.
- Mobile page headers, including service pages, inject an icon-only account link via `assets/account-nav.js`. Signed-in state may change the accessible label/title to "Account", but the visible mobile header control should remain just the `account_circle` icon. The mobile icon is grey while signed out and cyan/blue while signed in, and sits before the hamburger so the menu stays right-aligned.
- Account-page nav now uses `assets/standard-site-nav.js` with `data-active="account"`, matching the homepage/shared header and mobile nav structure.

## Portal Pages

- Admin Center Subscribers and Account holders tables use explicit column sizing so name/email fields get more room, with the Subscribers source pill allowed to wrap in a narrower column.
- Admin Center Subscribers and Account holders are independent lists. New portal account signups mirror into `homepage_email_signups`, but deleting a subscriber row removes it from Subscribers even if the portal account remains.
- Client profile data is intentionally minimal: account settings and Admin Center no longer show or save business/company name or website URL profile fields, and the Supabase setup SQL drops those columns if they exist.

- `account.html` — Client dashboard. Supabase email/password auth. Super-admin dashboard now looks like a normal client account except for an owner-only "Admin Center" card linking to `account-admin.html`.
- `account-admin.html` — Owner-only Admin Center. Gated by Supabase super-admin role; organized as an ultra-wide left-anchored tab workspace with Overview, Messages, Subscribers, and Account holders sections. The Messages tab is the unified message center for public website forms and account-dashboard support/change requests. Messages, Subscribers, and Account holders render their tables directly inside the selected tab. The Subscribers table includes a copy/export email modal with line-list, comma-list, and CSV formats. Message, Subscriber, and Account-holder tables have Delete actions behind a confirmation modal; message attachments render as signed owner-only links.
- `account-users.html` — Owner-only newsletter subscribers table. Gated by Supabase super-admin role; shows newsletter subscriber emails only. Portal account signups count as newsletter subscribers too, through `homepage_email_signups` once the updated Supabase setup SQL is run.
- `account-settings.html` — Profile/password management. Gated by Supabase session; shows sign-in prompt when logged out.
- `account-created.html` — Email confirmation landing page. Supabase redirects here after new registration; instructs user to verify email before signing in.
- The internal Sean's Google Ads portal feature (`seans-google-ads-dashboard.html`, `account-ads-status.html`, the `sean_ads_admin` role) was removed 2026-07-15. The public SeansAds.com portfolio case study is unrelated and still lives at `portfolio-seansads.html`.
- Privileged portal access reads Supabase `app_metadata.role` first (`super_admin`, `sean_ads_admin`), with email allowlist fallback in `assets/supabase-config.js`.
- Auth signup trigger (`handle_new_portal_user()`) mirrors new user metadata into `client_profiles`.

## Surette Data Systems Apps

App/software brand is **Surette Data Systems**. Five app profiles exist:

1. **Auction House & Consignment Store Software** — `auction-house-consignment-store-software.html`. Screenshots under `assets/apps/auction/` (WebP).
2. **Secondhand Dealer Management System (SDMS)** — `secondhand-dealer-management-system.html`. Screenshots under `assets/apps/sdms/` (WebP).
3. **Benji Payroll Management System** — `benji-payroll-management-system.html`. Screenshots under `assets/apps/benji/` (WebP + SVG variants).
4. **Antique Mall Vendor Management System and Auction Platform** — `antique-mall-vendor-management-system-and-auction-platform.html`. Live app at `https://thirdstreetauctions.com/`. Screenshots under `assets/apps/antique-mall/` — newer `thirdstreet-*.png` captures are current; older `antique-mall-*.png` captures may be stale/unused.
5. **MetalsCalc — Buying Calculator** — `metalscalc-buying-calculator.html`. Live Au/Ag/Pt spot pricing, customizable buy percentages, coin library, and one-tap PDF invoices for precious-metal dealers. PWA. Screenshots under `assets/apps/metalscalc/` (PNG). Note: OG/meta URLs in this file reference `darkmatterwebsites.com` rather than `surettesystems.com` — may need correction.

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

Portfolio hub (`portfolio.html`) introduces the two work categories: Surette Data Systems apps/software and Websites/case studies. Header and mobile nav Portfolio items point here; Apps and Websites pages remain live as downstream pages. The page is a single responsive layout with equal side gutters, clearer category-card borders, and a compact footer aligned to the same content width.

Websites gallery (`casestudies.html`) — current entries (in order):
1. Naples Estate Jewelry — `portfolio-naplesestatejewelry.html`. Screenshots under `assets/portfolio/naples-estate-jewelry/` (PNG + WebP).
2. JP Surette — `portfolio-jpsurette.html`. Screenshots under `assets/portfolio/jpsurette/`.
3. Elite Yacht Detailing — `portfolio-eliteyachtdetailing.html`. Screenshots under `assets/portfolio/elite/`.
4. Sean's Ads — `portfolio-seansads.html`. Live at `https://seansads.com/`. Screenshots under `assets/portfolio/seansads/`. Copy reflects live production status.
5. AuctionBuddha.com — `portfolio-auctionbuddha.html`. Screenshots under `assets/portfolio/auction-buddha/` (PNG).
6. MetalsCalc.com — `portfolio-metalscalc.html`. Product landing and PWA install page. Screenshots under `assets/portfolio/metalscalc/` (PNG).
- Open "Your Project Here" tile.

Tablet layout (768px–1279px): shared fixes in `assets/nav.css` reduce left-rail padding, stack contact/portfolio two-column layouts, and treat `#sds-logo` as a flex nav brand. `casestudies.html` hero stacks below 1024px; `portfolio-live-widget.css` constrains the live-site CTA on tablet. Playwright audit (`scripts/tablet-audit.js`) reports zero overflow/clipping issues across 16 key pages at 834×1194, 1024×768, and 768×1024.

## Known Cautions

- Supabase portal auth gates are browser-only; real data security requires RLS + server-side functions.
- `supabase/portal-role-setup.sql` must be run in the dedicated Dark Matter / Surette Data Systems Supabase project (not Naples Estate Jewelry) before the admin account-holder table and signup trigger work.
- The updated `supabase/portal-role-setup.sql` must be run in full before live homepage newsletter submissions, account-signup mirroring into `homepage_email_signups`, public form submissions into `client_messages`, optional message photo attachments, account request submissions into `client_messages`, the Admin Center Message Center, and Admin Center delete actions work. The script now drops/recreates `list_portal_messages()` before changing its return table shape.
- Frontend Supabase config points at project `axlszyssxyvehjatztwe` and queries `client_profiles`, `client_services`, `client_invoices`, `client_documents`, `client_messages`, and `homepage_email_signups`; the starter schema still includes some legacy `client_billing` / website status tables and should be reconciled before a fresh database bootstrap.
- Static validator reports pre-existing noise: missing `es/` mirrors and the `node_modules` HTML scan. New English-only portal admin pages also appear as missing Spanish mirrors until bilingual mirrors are restored. Site-content mojibake was swept and repaired 2026-07-15 (docs, Benji SVGs, double-encoded BOMs on `portfolio-seansads.html`/`account-created.html`, plus `casestudies.html`/`app-checkout.html` via a parallel session); the only remaining validator mojibake hit is a `node_modules` vendor file. `_enum_out.txt` at the root is stale generated output with unrecoverable replacement characters — regenerate or delete when convenient.
- Owner email notifications now rely on Netlify Forms notifications. Configure the form notification recipients in the Netlify site settings; no Resend API key or custom notification function is used.
- Old `antique-mall-*.png` screenshots may still be on disk alongside the current `thirdstreet-*.png` set; audit and remove if unused.
- MetalsCalc app/portfolio OG meta URLs reference `darkmatterwebsites.com` — should be corrected to `surettesystems.com` if that is the canonical domain.
- Admin-only ThirdStreetAuctions.com screenshots not yet captured (browser bridge was unavailable); add when an authenticated session is available.
