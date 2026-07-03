# Handoff

Last updated: 2026-07-02

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

- Static Dark Matter / Surette Data Systems marketing + client portal site.
- English root pages only; Spanish `es/` mirrors are absent from this working copy.
- Homepage Nova WebGL background is scroll-smoothed for mobile in `index.html`: the fixed `#nova-bg`/canvas layer uses stable viewport sizing and resize logic ignores height-only mobile toolbar changes.
- Mobile header account control is intentionally icon-only. `assets/account-nav.js` keeps `.dm-mob-acct` visually as the icon while updating `aria-label`/`title` for signed-in state.
- App/software brand is **Surette Data Systems**. Five app profiles: Auction House, SDMS, Benji Payroll, Antique Mall (Third Street Auctions), MetalsCalc.
- Websites/portfolio gallery has six entries: Naples Estate Jewelry, JP Surette, Elite Yacht Detailing, Sean's Ads, AuctionBuddha.com, MetalsCalc.com.
- Portal uses a dedicated Dark Matter / Surette Data Systems Supabase project (not Naples Estate Jewelry).
- Portal auth email redirects use `assets/supabase-config.js` `siteUrl` (`https://surettesystems.com`) as the canonical base, so local reset requests do not create localhost links.
- Homepage newsletter signup forms are wired to Supabase `homepage_email_signups`; live use requires running the updated `supabase/portal-role-setup.sql` in the hosted project.
- Public website forms and account-dashboard support/change requests are no longer Netlify Forms. Public forms call Supabase `submit_site_message()` through `assets/site-message-forms.js`; account requests call `submit_portal_message()`. Admin Center has a Messages tab that lists/deletes them via `list_portal_messages()` / `delete_portal_message()` and can render signed links for optional photo attachments. Live use requires running the updated `supabase/portal-role-setup.sql`.
- Admin Center table deletes are wired in `account-admin.html` / `assets/account-admin.js` with a confirmation modal. Live delete actions require `delete_portal_message()`, `delete_newsletter_subscriber()`, and `delete_portal_account_holder()` from the updated `supabase/portal-role-setup.sql`.
- Local preview: `http://127.0.0.1:4173/` (start with `npx http-server` or `start-preview.bat`).
- Production: `https://surettesystems.com/`.
- Sean's Ads source is intentionally not here â€” do not recreate it.

## Page Inventory (root)

| Page | Purpose |
|---|---|
| `index.html` | Homepage â€” Nova WebGL hero, Surette Data Systems widget |
| `apps.html` | Surette Data Systems app library (interactive wordmark hero) |
| `app-catalog.html` | App gallery â€” 5 `.portfolio-tile` cards + open tile |
| `app-pricing.html` | 4 pricing tiers routing through client portal to checkout |
| `app-checkout.html` | Portal checkout context |
| `casestudies.html` | Websites We've Built gallery (6 tiles) |
| `contact.html` | Contact form (Netlify) |
| `process.html` | Process page (not in main nav; reached via service-page CTAs) |
| `built-by.html` | Built By page |
| `account.html` | Client portal dashboard (Supabase auth; owner sees Admin Center link only) |
| `account-admin.html` | Owner-only ultra-wide left-tab Admin Center with embedded subscriber/account-holder tables |
| `account-users.html` | Owner-only newsletter subscriber table for account signups and homepage email sign-ups |
| `account-settings.html` | Profile/password management (Supabase gated) |
| `account-created.html` | Email confirmation landing after Supabase signup |
| `account-ads-status.html` | Google Ads workspace stub for Sean |
| `seans-google-ads-dashboard.html` | Sean/owner-only portal UI |
| `singularity.html` | Singularity standalone page |
| `blackhole-icon.html` | Blackhole icon demo |
| `surette-logo-demo.html` | Surette logo demo |
| `auction-house-consignment-store-software.html` | Auction app profile |
| `secondhand-dealer-management-system.html` | SDMS app profile |
| `benji-payroll-management-system.html` | Benji Payroll app profile |
| `antique-mall-vendor-management-system-and-auction-platform.html` | Antique Mall / Third Street app profile |
| `metalscalc-buying-calculator.html` | MetalsCalc app profile (PWA, precious-metal buying calc) |
| `portfolio-naplesestatejewelry.html` | Naples Estate Jewelry detail |
| `portfolio-jpsurette.html` | JP Surette detail |
| `portfolio-eliteyachtdetailing.html` | Elite Yacht detail |
| `portfolio-seansads.html` | Sean's Ads detail |
| `portfolio-auctionbuddha.html` | AuctionBuddha.com detail |
| `portfolio-metalscalc.html` | MetalsCalc.com detail |

Services pages in `services/`: `website-design.html`, `managed-hosting.html`, `website-care-plans.html`, `in-home-services.html`, `office-network-setup.html`.

## Most Recent Work

- Removed Netlify Forms from Contact, Apps consultation, and App Checkout. Added shared Supabase form submission JS, public `submit_site_message()` SQL, optional photo attachment upload support, and Admin Center attachment rendering.
- Replaced the account dashboard request form's Netlify Form submission with a Supabase `submit_portal_message()` RPC. Added `client_messages` schema/RLS plus owner-only list/delete RPCs to `supabase/portal-role-setup.sql`, and added a Message Center tab to `account-admin.html`.
- Added Delete actions to the Admin Center Subscribers and Account holders tables. Each opens a confirmation modal before calling owner-only Supabase RPCs; the signed-in owner account row is protected from self-delete.
- Split Admin Center into its own `account-admin.html` page. `account.html` now contains no inline owner console; it only reveals an owner-only link to the separate admin page. The Admin Center itself is organized as a left-anchored tab workspace.
- Admin Center desktop layout is intentionally wide for ultra-wide use. The Subscribers and Account holders side tabs render/load their tables directly in the tab panel.
- Added `account-users.html` as an owner-only newsletter subscriber table linked from Admin Center. It treats portal account signups as subscribers and includes a pending placeholder/source for future homepage email sign-ups.
- Added homepage newsletter signup forms in desktop/mobile heroes, wired through `assets/newsletter-signup.js` to `homepage_email_signups`.
- Moved owner-only portal tools behind an "Admin Center" card so the super-admin account looks like a regular client dashboard until Admin Center is opened.
- Added canonical Supabase auth redirect base (`siteUrl`) and moved the `account.html` forgot-password handler into `assets/client-portal.js`; password reset links now target `https://surettesystems.com/account-settings.html` instead of local preview origins.
- Confirmed the project is wired to Supabase through browser-side config/project `axlszyssxyvehjatztwe`; frontend queries `client_profiles`, `client_services`, `client_invoices`, `client_documents`, `client_messages`, and `homepage_email_signups`. Starter SQL still contains some legacy table names and should be reconciled before fresh DB bootstrap.
- Smoothed mobile homepage scrolling for the Nova particle background by preventing WebGL renderer resize/reallocation during height-only browser toolbar changes. Verified at a 390x844 mobile viewport that the fixed layer and canvas size stay stable after scroll; no browser console errors.
- Fixed the mobile header account control so signed-in state no longer appends the visible word "Account"; cache-busted `account-nav.js` references to `v=20260702-mobile-account-icon`.
- Added **MetalsCalc** as the 5th Surette Data Systems app: `metalscalc-buying-calculator.html` app profile, tile #05 in `app-catalog.html`, screenshots in `assets/apps/metalscalc/`. Added `portfolio-metalscalc.html` Websites detail page as entry #06 in `casestudies.html`, screenshots in `assets/portfolio/metalscalc/`.
- Added portal support pages: `account-created.html` (post-signup email verification), `account-settings.html` (profile/password management), `account-ads-status.html` (Google Ads workspace stub).
- Rebuilt `app-catalog.html` gallery cards to `.portfolio-tile` design matching `casestudies.html` (2-up mobile, 3-up desktop). Removed "DepthFold" 3D card system.
- Removed "fly" WebGL canvas hero from `app-catalog.html`; restored cosmic-web background.
- Replaced top-level `Process` nav item with `Websites` â†’ `casestudies.html` across all shared/hand-authored nav. Added "View Our Process" CTAs to Website Design, Managed Hosting, Care Plans, Custom Apps, In-Home Tech, and Office Network service pages.
- Added AuctionBuddha.com entry (`portfolio-auctionbuddha.html`) + screenshots to Websites gallery.
- Refreshed NaplesEstateJewelry.co portfolio content and screenshots.
- Refreshed Antique Mall profile around `thirdstreetauctions.com` with 7 new public captures and updated feature copy. Fixed overlapping marketplace-flow diagram.
- Fixed homepage hero tint to use a fixed `#hero-tint` scrim (sibling of `#nova-bg`) so it stays anchored while content scrolls over the Nova background.
- Replaced homepage black-hole Three.js hero with Nova particle-galaxy widget.
- Removed "Do Not Press" widget (`face-interactive.html` deleted, `assets/face/` removed).
- Added super-admin account-holder viewer to `account.html` + Supabase RPC.

## Validation

Run after broad edits:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

Known validator noise (pre-existing, not blocking): missing `es/` mirrors, node_modules HTML scan, stale Sean Ads Spanish links, mojibake warnings, and `blackhole-icon.html` missing `your-blackhole.mp4`.

## Do Not Forget

- Mirror English/Spanish changes when `es/` mirrors are restored.
- Do not store secrets in markdown.
- Browser-side portal gates are not true security.
- MetalsCalc OG URLs reference `darkmatterwebsites.com` â€” verify/correct domain.
- Old `antique-mall-*.png` screenshots may be unused alongside current `thirdstreet-*.png` files.
- Update compact memory docs before ending meaningful sessions.
