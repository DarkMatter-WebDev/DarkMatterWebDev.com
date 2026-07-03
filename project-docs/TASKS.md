# Tasks

Last updated: 2026-07-03

## Active

- Keep memory docs compact and current after meaningful work.
- Static validator known noise: missing `es/` mirrors, node_modules scan, Sean Ads Spanish links, and mojibake warnings. These are pre-existing and do not block work.
- Audit finding: service-detail pages use a different mobile header markup path than most root marketing/app pages; header dimensions are stable in preview, but consolidating service-page mobile nav into the shared pattern remains a good future polish item.
- Confirm Supabase Auth URL configuration in the hosted project: Site URL should be `https://surettesystems.com`, and redirect allowlist should include `https://surettesystems.com/account.html`, `https://surettesystems.com/account-settings.html`, `https://surettesystems.com/account-admin.html`, `https://surettesystems.com/account-users.html`, plus local preview URLs only for development.
- Run the updated `supabase/portal-role-setup.sql` in the hosted Supabase project so homepage newsletter submissions, account-signup mirroring into `homepage_email_signups`, public form message submission/photo attachment support, account-dashboard message submission/list/delete RPCs, and Admin Center delete RPCs work live. If Supabase reports a changed return type for `list_portal_messages()`, rerun the current file, which includes `drop function if exists public.list_portal_messages();` before the recreated function.

## Near-Term

- **Fix MetalsCalc OG/meta URLs** â€” `metalscalc-buying-calculator.html` and `portfolio-metalscalc.html` reference `darkmatterwebsites.com` in OG/meta URLs; should be `surettesystems.com` if that is the canonical production domain.
- **Clean up stale antique mall screenshots** â€” `assets/apps/antique-mall/antique-mall-*.png` (old captures) may still be on disk alongside the current `thirdstreet-*.png` set; audit and delete unused files.
- **Capture ThirdStreetAuctions admin/vendor dashboard screenshots** â€” public captures are done; logged-in admin/vendor screens still needed once an authenticated browser session is available.
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
  - Set `app_metadata.role`: `rcman12589@aol.com` â†’ `super_admin`, `scochrane495@gmail.com` â†’ `sean_ads_admin`
  - Configure Auth redirects and email templates (signup redirect â†’ `account-created.html`)
  - Create test users/client rows and verify RLS
  - Confirm Contact, Apps consultation, App Checkout, and portal account request submissions all appear in Admin Center Messages
- **Review all high-value pages** on desktop and mobile before launch.
- **Add a secure backend/server-side payment layer** before real Stripe recurring billing or privileged admin operations.
- **Keep app screenshots current** â€” Auction, SDMS, and Antique Mall screenshots should stay in sync with hosted demos.
- **Review app pricing copy and rates** after real client feedback.

## Backlog

- Spanish (`es/`) mirrors are absent from this working copy; reconcile or regenerate before bilingual launch.
- Native Spanish review before major public launch.
- Add real client/operations references to `CLIENTS.md` when approved.
- Decide first analytics source for portal traffic summaries.
- Build real account settings and Google Ads activity/status workflows (currently `account-settings.html` and `account-ads-status.html` are stubs).
- Consider future migration from duplicated hand-authored HTML to generated static HTML with shared layouts (Astro candidate for marketing pages).

## Recently Completed

- Added a sitewide no-white-flash dark loading baseline: critical inline head CSS on HTML pages, shared `assets/nav.css` dark document/shell defaults, normalized `theme-color` to `#050505`, and verified repeated desktop/mobile route loads across home, apps/pricing, contact, legal, accessibility, and SDMS compliance pages.
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
- Added MetalsCalc â€” Buying Calculator as a 5th Surette Data Systems app: `metalscalc-buying-calculator.html` app profile, catalog tile #05 (PWA badge) in `app-catalog.html`, screenshots in `assets/apps/metalscalc/`, and a portfolio/website entry (`portfolio-metalscalc.html`, tile #06 in `casestudies.html`) with screenshots in `assets/portfolio/metalscalc/`.
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
