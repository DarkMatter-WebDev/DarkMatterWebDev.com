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

- Static Dark Matter / Surette Data Systems marketing + client portal site.
- English root pages only; Spanish `es/` mirrors are absent from this working copy.
- App/software brand is **Surette Data Systems**. Five app profiles: Auction House, SDMS, Benji Payroll, Antique Mall (Third Street Auctions), MetalsCalc.
- Websites/portfolio gallery has six entries: Naples Estate Jewelry, JP Surette, Elite Yacht Detailing, Sean's Ads, AuctionBuddha.com, MetalsCalc.com.
- Portal uses a dedicated Dark Matter / Surette Data Systems Supabase project (not Naples Estate Jewelry).
- Local preview: `http://127.0.0.1:4173/` (start with `npx http-server` or `start-preview.bat`).
- Production: `https://darkmatterwebdev.com/`.
- Sean's Ads source is intentionally not here — do not recreate it.

## Page Inventory (root)

| Page | Purpose |
|---|---|
| `index.html` | Homepage — Nova WebGL hero, Surette Data Systems widget |
| `apps.html` | Surette Data Systems app library (interactive wordmark hero) |
| `app-catalog.html` | App gallery — 5 `.portfolio-tile` cards + open tile |
| `app-pricing.html` | 4 pricing tiers routing through client portal to checkout |
| `app-checkout.html` | Portal checkout context |
| `casestudies.html` | Websites We've Built gallery (6 tiles) |
| `contact.html` | Contact form (Netlify) |
| `process.html` | Process page (not in main nav; reached via service-page CTAs) |
| `built-by.html` | Built By page |
| `account.html` | Client portal dashboard (Supabase auth, super-admin RPC viewer) |
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

- Added **MetalsCalc** as the 5th Surette Data Systems app: `metalscalc-buying-calculator.html` app profile, tile #05 in `app-catalog.html`, screenshots in `assets/apps/metalscalc/`. Added `portfolio-metalscalc.html` Websites detail page as entry #06 in `casestudies.html`, screenshots in `assets/portfolio/metalscalc/`.
- Added portal support pages: `account-created.html` (post-signup email verification), `account-settings.html` (profile/password management), `account-ads-status.html` (Google Ads workspace stub).
- Rebuilt `app-catalog.html` gallery cards to `.portfolio-tile` design matching `casestudies.html` (2-up mobile, 3-up desktop). Removed "DepthFold" 3D card system.
- Removed "fly" WebGL canvas hero from `app-catalog.html`; restored cosmic-web background.
- Replaced top-level `Process` nav item with `Websites` → `casestudies.html` across all shared/hand-authored nav. Added "View Our Process" CTAs to Website Design, Managed Hosting, Care Plans, Custom Apps, In-Home Tech, and Office Network service pages.
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

Known validator noise (pre-existing, not blocking): missing `es/` mirrors, node_modules HTML scan, stale Sean Ads Spanish links, mojibake warnings.

## Do Not Forget

- Mirror English/Spanish changes when `es/` mirrors are restored.
- Do not store secrets in markdown.
- Browser-side portal gates are not true security.
- MetalsCalc OG URLs reference `darkmatterwebsites.com` — verify/correct domain.
- Old `antique-mall-*.png` screenshots may be unused alongside current `thirdstreet-*.png` files.
- Update compact memory docs before ending meaningful sessions.
