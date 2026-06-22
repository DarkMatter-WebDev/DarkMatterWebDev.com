# Tasks

Last updated: 2026-06-22

## Active

- Keep memory docs compact and current after meaningful work.
- Static validator known noise: missing `es/` mirrors, node_modules scan, Sean Ads Spanish links, mojibake warnings — these are pre-existing and do not block work.

## Near-Term

- **Fix MetalsCalc OG/meta URLs** — `metalscalc-buying-calculator.html` and `portfolio-metalscalc.html` reference `darkmatterwebsites.com` in OG/meta URLs; should be `darkmatterwebdev.com` if that is the canonical production domain.
- **Clean up stale antique mall screenshots** — `assets/apps/antique-mall/antique-mall-*.png` (old captures) may still be on disk alongside the current `thirdstreet-*.png` set; audit and delete unused files.
- **Capture ThirdStreetAuctions admin/vendor dashboard screenshots** — public captures are done; logged-in admin/vendor screens still needed once an authenticated browser session is available.
- **Finish Supabase portal setup** (dedicated Dark Matter / Surette Data Systems project):
  - Run `supabase/client-portal-schema.sql`
  - Run `supabase/portal-role-setup.sql`
  - Confirm `list_portal_account_holders()` RPC returns rows for super-admin
  - Confirm `handle_new_portal_user()` trigger creates `client_profiles` rows on signup
  - Set `app_metadata.role`: `rcman12589@aol.com` → `super_admin`, `scochrane495@gmail.com` → `sean_ads_admin`
  - Configure Auth redirects and email templates (signup redirect → `account-created.html`)
  - Create test users/client rows and verify RLS
  - Confirm Netlify form submissions land correctly
- **Review all high-value pages** on desktop and mobile before launch.
- **Add secure backend/Netlify Function** before real Stripe recurring billing or admin operations.
- **Keep app screenshots current** — Auction, SDMS, and Antique Mall screenshots should stay in sync with hosted demos.
- **Review app pricing copy and rates** after real client feedback.

## Backlog

- Spanish (`es/`) mirrors are absent from this working copy; reconcile or regenerate before bilingual launch.
- Native Spanish review before major public launch.
- Add real client/operations references to `CLIENTS.md` when approved.
- Decide first analytics source for portal traffic summaries.
- Build real account settings and Google Ads activity/status workflows (currently `account-settings.html` and `account-ads-status.html` are stubs).
- Consider future migration from duplicated hand-authored HTML to generated static HTML with shared layouts (Astro candidate for marketing pages).

## Recently Completed

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
- Removed "Do Not Press" widget and `face-interactive.html` from the site.
- Removed defunct English/Spanish nav toggle from Auction, SDMS, and Benji app detail pages.
- Rebranded app/software line to Surette Data Systems site-wide.
- Added lossless WebP Surette Data Systems brand assets.
- Ran mobile sweep; fixed pricing CTA containment, two-wide pricing tiers, SDMS mobile overflow, and several other overflow issues.
