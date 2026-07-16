# Tasks

Last updated: 2026-07-16

## Active

- Keep memory docs compact and current after meaningful work.
- Static validator known noise: missing `es/` mirrors and node_modules/pokecard template scans. New English-only pages also appear as missing Spanish mirrors until bilingual pages are restored. Mojibake was swept site-wide and repaired 2026-07-15 — the only remaining validator mojibake hit is inside `node_modules` (vendor file, ignore).
- Nav rule for all new pages: never hand-copy nav markup — add `<script src="assets/standard-site-nav.js?v=20260715-nav-unify" data-active="...">` (use `../assets/...` under `services/`). `assets/unified-mobile-menu.js` was deleted 2026-07-15; all public pages now use the generator.
- `_enum_out.txt` (root) is stale generated output from `_enum_artifacts.py` with ~380 unrecoverable U+FFFD characters (it enumerated the since-removed `es/` pages). Not served content and the validator ignores `.txt` for mojibake — regenerate or delete when convenient.
- Confirm Supabase Auth URL configuration in the hosted project: Site URL should be `https://surettesystems.com`, and redirect allowlist should include `https://surettesystems.com/account.html`, `https://surettesystems.com/account-settings.html`, `https://surettesystems.com/account-admin.html`, `https://surettesystems.com/account-users.html`, plus local preview URLs only for development.
- Run the updated `supabase/portal-role-setup.sql` in the hosted Supabase project so homepage newsletter submissions, account-signup mirroring into `homepage_email_signups`, public form message submission/photo attachment support, account-dashboard message submission/list/delete RPCs, and Admin Center delete RPCs work live. If Supabase reports a changed return type for `list_portal_messages()`, rerun the current file, which includes `drop function if exists public.list_portal_messages();` before the recreated function.
- Configure Netlify Forms notifications for the detected forms (`contact`, `apps-consultation`, `app-checkout-request`, and `client-request`) so submissions email `info@surettesystems.com`, then submit production tests and confirm each message also appears in Admin Center Messages.

## Near-Term

- **Consider raising the mobile tab bar's inactive label opacity.** They are `rgba(196,199,199,0.6)` in `assets/standard-site-nav.js`, so they composite onto the bar itself — as the bar darkens the label darkens too, which caps them at **4.69:1 even against a pure black bar** (AA wants 4.5, so they are marginal *everywhere*, not just over light content). The 2026-07-16 bar-tint fix took them from 1.17:1 to ~4.25:1 over a light card, which is as far as tint alone can go. Raising the label to ~0.85 opacity would reach ~6:1, at the cost of some active/inactive hierarchy. Owner's call.


- **The Websites gallery cards are duplicated across two layouts — keep them in sync.** `casestudies.html` renders the same six collectible cards twice: desktop (`.hidden md:block`, 2/3-up) and phone (`.md:hidden`, 1-up). Any card edit (copy, estimate, links, theme) must land in both or they drift. Worth revisiting if this page is ever unified into a single responsive layout, or if the cards move to a shared injected component — but note they are static HTML on purpose (SEO).
- **`.footer-meta` / `.footer-meta-sep` in `assets/nav.css` are dead.** They styled the pre-2026-07-16 hand-authored footers; the shared footer uses `.dm-footer__legal-line` / `.dm-legal-sep` instead. Safe to delete once confirmed no page still emits `.footer-meta` markup.
- **`assets/portfolio-mobile-fixes.css` may now be partly dead.** It still carries `.portfolio-tile__media`-era rules, but neither gallery renders tiles any more (only the open slots use `.portfolio-tile`). Audit which of its rules still apply and to which pages before deleting anything — it is loaded by several portfolio detail pages too.

- **Fix MetalsCalc OG/meta URLs** — `metalscalc-buying-calculator.html` and `portfolio-metalscalc.html` reference `darkmatterwebsites.com` in OG/meta URLs; should be `surettesystems.com` if that is the canonical production domain.
- **Clean up stale antique mall screenshots** — `assets/apps/antique-mall/antique-mall-*.png` (old captures) may still be on disk alongside the current `thirdstreet-*.png` set; audit and delete unused files.
- **Capture ThirdStreetAuctions admin/vendor dashboard screenshots** — public captures are done; logged-in admin/vendor screens still needed once an authenticated browser session is available.
- **Finish Supabase portal setup** (dedicated Dark Matter / Surette Data Systems project):
- **Reconcile Supabase starter SQL** with the frontend's live table config (`client_invoices`, `client_documents`, `client_messages`) before using it to bootstrap a fresh database.
  - Run `supabase/client-portal-schema.sql`
  - Run `supabase/portal-role-setup.sql`
  - Confirm `list_portal_account_holders()` RPC returns rows for super-admin
  - Confirm `submit_portal_message()`, `list_portal_messages()`, and `delete_portal_message()` work for the intended client/admin roles
  - Confirm `submit_site_message()` works for anon/public website forms and that owner accounts can open signed links for uploaded message attachments
  - Run the updated `homepage_email_signups` setup so homepage submissions insert and account signups mirror into the newsletter subscriber source
  - Confirm `delete_newsletter_subscriber()` and `delete_portal_account_holder()` RPCs work for the super-admin and reject non-owner users
  - Confirm `handle_new_portal_user()` trigger creates `client_profiles` rows on signup
  - Set `app_metadata.role`: `rcman12589@aol.com` → `super_admin`, `scochrane495@gmail.com` → `sean_ads_admin`
  - Configure Auth redirects and email templates (signup redirect → `account-created.html`)
  - Create test users/client rows and verify RLS
  - Confirm Contact, Apps consultation, App Checkout, and portal account request submissions all appear in Admin Center Messages
- **Review all high-value pages** on desktop and mobile before launch.
- **Add a secure backend/server-side payment layer** before real Stripe recurring billing or privileged admin operations.
- **Keep app screenshots current** — Auction, SDMS, and Antique Mall screenshots should stay in sync with hosted demos.
- **Review app pricing copy and rates** after real client feedback.
- **Keep portfolio build estimates in sync with pricing.** The gallery price pills (`casestudies.html`, 12 pills across desktop + mobile grids) and the six detail-page `#build-pricing` sections are derived from the one-time build scale in `website_pricing_plan.txt`. If plan starting prices change, update both surfaces.

## Backlog

- Spanish (`es/`) mirrors are absent from this working copy; reconcile or regenerate before bilingual launch.
- Native Spanish review before major public launch.
- Add real client/operations references to `CLIENTS.md` when approved.
- Decide first analytics source for portal traffic summaries.
- Build real account settings and Google Ads activity/status workflows (currently `account-settings.html` and `account-ads-status.html` are stubs).
- Consider future migration from duplicated hand-authored HTML to generated static HTML with shared layouts (Astro candidate for marketing pages).

## Recently Completed

- **Build-cost estimates on the Websites gallery + all six portfolio detail pages (2026-07-16):** gold "EST. $X+" pills on every gallery tile and a `#build-pricing` estimate section on every detail page, priced against `website_pricing_plan.txt` one-time build packages with the required estimate-only disclosure. Naples $12K–$16K, Elite $8.5K–$10K, JPSurette $4.5K–$6.5K, SeansAds $7.5K–$10K, AuctionBuddha $35K–$55K+ (repriced later the same day once the full ecosystem scope was known), MetalsCalc $2K–$2.5K. Verified in-browser (pill styles, no collisions at 375px, sections on all six pages, no overflow, no console errors); validator baseline unchanged.

- **Nav single-source migration (2026-07-15):** migrated all 16 remaining public pages with inline/hand-copied nav markup to the `assets/standard-site-nav.js` generator, fixed the generator to emit `../`-prefixed links on `services/*` pages (all its injected links there 404'd before), deleted `assets/unified-mobile-menu.js` + its 28 script tags + dead nav.css shell rules, removed `app-pricing.html`'s broken `es/` lang toggle, and unified every loader reference to `v=20260715-nav-unify`. Fixes wrong active-page highlights (Portfolio shown active on apps/app-catalog/casestudies/built-by/accessibility/process), hardcoded-cyan Client Login on legacy pages, homepage's divergent hamburger structure, missing mobile nav markup on portfolio detail pages, and terms.html's missing nav logo. Verified in-browser at mobile + desktop across all migrated page types; no console errors; validator baseline unchanged.
- Completed `services/website-design-hosting.html` as a full public pricing page implementing `website_pricing_plan.txt` (project root, source of truth for plan names/prices/policies): managed plans ($0 upfront Starter/Mini/Lead Capture + Local Business + Growth), one-time builds (8 packages), hosting/care plans, update-allowance/support/revision policies, ownership/renewal/handoff, add-on price list, and a 36-question FAQ. Verified anchors, overflow (375px clean), and content coverage in-browser; validator noise unchanged.
- Fixed `assets/mobile-services-nav.js` mobile Services popout still linking to the three retired service pages; now a single "Website Design / Hosting" entry (EN + ES), cache-busted on all 28 referencing pages (`v=20260715-services-merge`).
- Unified public navigation behavior across legacy, standard-nav, service, Portfolio, and client-login pages. Added `assets/unified-mobile-menu.js` as a compatibility layer, corrected shared fixed-header gutters/overflow rules, and verified 30 public routes at 1440px, 834px, 768px, 767px, and 390px with zero header/navigation failures.
- Added `portfolio.html` as the top-level Portfolio hub and folded the header/mobile nav Apps + Websites entries into one Portfolio item. The hub links to the existing Apps (`apps.html`) and Websites (`casestudies.html`) pages with short category explanations and existing visual assets. Verified desktop/mobile preview and reran the static validator; remaining failures are documented noise plus the expected missing Spanish mirror for the new page.

- Updated Sean's Ads portfolio (`portfolio-seansads.html`, `casestudies.html`) to reflect live production at SeansAds.com; aligned `portfolio-seansads.html` with the standard sitewide top nav.
- Fixed tablet overflow/clipping sitewide: shared `assets/nav.css` tablet band, casestudies hero stack, contact page `lg:flex-row`, portfolio live-widget sizing, and nav `#sds-logo` flex treatment. Playwright tablet audit clean on 16 pages × 3 viewports.

- Restored Netlify Forms capture for Contact, Apps consultation, App Checkout, and account-dashboard request forms while keeping Supabase/Admin Center message saves.
- Fixed service-page header/menu alignment by anchoring fixed top headers to the viewport in shared `assets/nav.css`; verified all service pages on mobile and the Website Design service page on desktop.
- Removed profile-level business/company and website URL fields from account settings, Admin Center subscriber/account-holder tables, and Supabase setup/schema cleanup.
- Separated Admin Center Subscribers from Account holders: Subscribers now reads only `homepage_email_signups`, account holders stay in their own auth/profile table, new account signups still mirror into subscriber rows, and subscriber deletion no longer reappears from account-holder fallback data.
- Widened Admin Center Subscribers and Account holders table name/email columns, especially subscriber email, and narrowed/wrapped the Subscribers source column.

- Made the mobile header account icon color state consistent sitewide: grey when signed out, cyan/blue when signed in, while keeping the control icon-only on mobile.
- Added the standard fixed mobile logo/header and promoted mobile nav row to all service umbrella pages so their mobile menu matches the rest of the site and the Services tab opens the shared services popout.
- Added compact mobile footers to all service umbrella pages (`services/website-design.html`, `managed-hosting.html`, `website-care-plans.html`, `in-home-services.html`, and `office-network-setup.html`) while keeping the existing desktop footer behavior unchanged.
- Added a sitewide no-white-flash dark loading baseline: critical inline head CSS on HTML pages, shared `assets/nav.css` dark document/root defaults, normalized `theme-color` to `#050505`, and verified repeated desktop/mobile route loads across home, apps/pricing, contact, legal, accessibility, and SDMS compliance pages. Follow-up fixed the account page by keeping visual shells transparent so the animated portal background remains visible.
- Added the shared desktop site footer to the remaining service-page outliers, `services/in-home-services.html` and `services/office-network-setup.html`.
- Removed stale standalone demo pages that were not linked from the live site: `surette-logo-demo.html`, `blackhole-icon.html`, and `singularity.html`.
- Added a sitewide object-level reveal for repeated cards, panels, pricing tiles, glass blocks, and portfolio tiles so whole objects fade in together after page-ready instead of text appearing before the background/border treatment.
- Added a same-site outbound navigation loader: link clicks now show the small black spinner overlay briefly before navigation so page changes feel intentional instead of frozen.
- Stabilized page reveal after the white-screen regression: restored the `html`-based fade path, kept the root/background black, added a CSS safety fallback for logo pages if JS reveal is interrupted, and updated `surette-logo.js` cache keys across pages.
- Updated public/site contact email links and visible contact text to `info@SuretteSystems.com` across contact, portfolio, case study, process, and service pages. Form placeholder examples and Supabase/admin role setup emails were intentionally left unchanged.
- Audited representative desktop/mobile page transitions and header consistency. Confirmed core marketing/app pages settle to `html` opacity 1 with stable desktop nav height and no leftover homepage loader markup after reveal.
- Normalized `account.html` desktop nav and `assets/client-portal.js` signed-out state so the account page shows the same "Client Login" label/account icon as the rest of the site, with cache-busted script reference.
- Matched the homepage newsletter email field more closely to the account-page inputs: transparent wrapper, thin cyan outline, darker subtle interior, clearer sample-email placeholder, and unchanged Supabase signup wiring.
- Removed remaining Netlify Forms wiring from Contact, Apps consultation, and App Checkout. Public forms now submit into the Admin Center Message Center through Supabase `submit_site_message()`, with optional photo/screenshot attachment support on Contact and Checkout.
- Replaced the account dashboard "Request a change or ask a question" Netlify Form flow with Supabase `client_messages` submission and added an owner-only Message Center tab in Admin Center to list/delete those portal messages.
- Added a Subscribers table copy/export modal in Admin Center with line-list, comma-list, and CSV formatting plus quick-copy/manual-selection fallback.
- Added Admin Center Delete actions to the Subscribers and Account holders tables, each routed through a confirmation modal and owner-only Supabase RPCs. The signed-in owner account is protected from self-delete in the UI and RPC.
- Smoothed the homepage Nova WebGL background on mobile by making the fixed canvas layer use stable viewport sizing/compositing and ignoring height-only mobile browser-toolbar resize events during scroll.
- Kept the mobile header account control icon-only in signed-in state and cache-busted `assets/account-nav.js` references.
- Added MetalsCalc — Buying Calculator as a 5th Surette Data Systems app: `metalscalc-buying-calculator.html` app profile, catalog tile #05 (PWA badge) in `app-catalog.html`, screenshots in `assets/apps/metalscalc/`, and a portfolio/website entry (`portfolio-metalscalc.html`, tile #06 in `casestudies.html`) with screenshots in `assets/portfolio/metalscalc/`.
- Added `account-settings.html` (profile/password management), `account-created.html` (email verification landing page after signup), and `account-ads-status.html` (Google Ads workspace stub for Sean).
- Rebuilt `app-catalog.html` gallery cards to match the Websites/Case Studies `.portfolio-tile` design (2-up mobile, 3-up desktop). Removed old "DepthFold" 3D card system.
- Removed "fly" canvas hero background from `app-catalog.html` after `assets/fly/` was deleted; restored cosmic-web background.
- Replaced top-level `Process` nav item with `Websites` link to `casestudies.html` across all navigation. Added "View Our Process" CTAs to six service pages.
- Added AuctionBuddha.com to Websites gallery with detail page and public screenshots.
- Refreshed NaplesEstateJewelry.co portfolio with current live-site screenshots.
- Refreshed Antique Mall profile around ThirdStreetAuctions.com with seven new public captures and updated feature copy.
- Fixed homepage hero tint so it stays fixed over the Nova background while content scrolls.
- Replaced homepage black-hole hero with Nova particle-galaxy widget.
- Added super-admin account-holder viewer to `account.html` backed by Supabase RPC.
- Added owner-only `account-users.html` subscriber table and linked it from Admin Center; homepage email sign-ups are represented as a pending backend source until the capture form is wired.
- Reorganized `account-admin.html` into a left-anchored tab workspace for Overview, Subscribers, Account holders, and Sean Ads.
- Expanded `account-admin.html` for ultra-wide desktop use and embedded the Subscribers / Account holders tables directly inside their side-tab panels.
- Added homepage desktop/mobile newsletter signup forms wired to Supabase `homepage_email_signups` through `assets/newsletter-signup.js`.
- Removed "Do Not Press" widget and `face-interactive.html` from the site.
- Removed defunct English/Spanish nav toggle from Auction, SDMS, and Benji app detail pages.
- Rebranded app/software line to Surette Data Systems site-wide.
- Added lossless WebP Surette Data Systems brand assets.
- Ran mobile sweep; fixed pricing CTA containment, two-wide pricing tiers, SDMS mobile overflow, and several other overflow issues.
