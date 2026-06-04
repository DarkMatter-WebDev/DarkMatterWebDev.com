# Current Status

Last updated: 2026-06-04

This file is intentionally concise for handoff. Historical detail lives in `CHANGELOG.md` and feature notes under `project-docs/features/`.

## Current Project Shape

- Dark Matter Web Services is a static, bilingual marketing site with English pages at the project root and Spanish mirrors under `es/`.
- Main pages include homepage, Services, Apps (`apps.html`), Process, Portfolio (`casestudies.html`), Contact, Built By, Website Preference Builder, Account/Login Portal, and individual Portfolio/detail pages.
- Service pages live under `services/` with Spanish mirrors under `es/services/`.
- Shared styling and behavior live mostly in `assets/`, including `nav.css`, `cosmic-web.css`, `care-plans.css`, `client-portal.css`, `rail.js`, `mobile-services-nav.js`, and Supabase/account portal scripts.
- Sean's Google Ads source has been intentionally moved out of this repository and is now managed elsewhere. It is normal that the old `Sean's Google Ads Services/` folder is absent; do not recreate or edit that mini-site from this project.
- Local preview commonly runs at `http://127.0.0.1:4173/`; if that port is stale, use another port such as `4188`.

## Working Features

- Homepage hero video is homepage-only and uses optimized responsive MP4 files:
  - Desktop: `assets/Hero-Black-Hole-desktop-1080p.mp4`
  - Mobile: `assets/Hero-Black-Hole-mobile-720p.mp4`
- Exceptionally thin/tall portrait mobile screens use a tiny homepage hero video zoom-out while staying `object-fit: cover` to preserve the sharper cropped treatment.
- Non-home pages use the compressed cosmic-web WebP background through `assets/cosmic-web.css`.
- The sitewide floating process rail is a four-step system: Design, Build, Launch, Maintain.
- Main navigation uses `Portfolio` / `Portafolio`; the underlying page is still `casestudies.html`.
- Main navigation includes `Apps` directly after `Services` / `Servicios`; the canonical app-library URLs are `apps.html` and `es/apps.html`, with Netlify redirects from the old `downloads.html` paths.
- Services are grouped into Online Services and In-Home & Office Services.
- The Services page opens with three plain-language paths: website/online help, in-person tech setup, and business app/portal.
- SEO Foundations includes an expanded visual foundation-map section before the Sean's Google Ads cross-promo.
- Website Care Plans have linked plan tiles and expanded detailed pricing sections; Growth and higher tiers now position approved periodic blog/content publishing as part of the maintenance hook.
- Website Preference Builder is a Netlify Forms intake flow in English and Spanish.
- Contact and client request forms use Netlify form markup.
- WhatsApp update-queue messaging is integrated on the homepage and Process page.
- Browser/link-preview metadata is in place with favicon, app icons, manifest, and a modern Dark Matter Open Graph image.
- English and Spanish punctuation/form-tag artifacts from earlier cleanup sweeps have been rechecked; legitimate closing question marks were restored on affected pages, and malformed `textárea` tags were corrected back to `textarea`.
- Apps pages exist at `apps.html` and `es/apps.html` for Dark Matter-created web apps. They use the standard Dark Matter mobile header/tab shell and services popout, now act as a compact gallery-only app preview page with two-up mobile tiles, visual tile previews, direct full-profile links, a custom-build contact tile, and hero/banner copy noting Dark Matter can build custom apps from scratch or around an existing business system, fully customized for each business and language. Current listings are Auction House & Consignment Store Complete Management Software and Secondhand Dealer Management System (SDMS). The auction app links to the live hosted app at `https://auctionconsignmentapp.netlify.app/`, includes cropped app-flow screenshots on its profile page, and explains that full brand, feature, layout, report, field, module, language/localization, and tag-printing customization is available. The auction app has full profile pages at `auction-house-consignment-store-software.html` and `es/auction-house-consignment-store-software.html`; SDMS has full profile pages at `secondhand-dealer-management-system.html` and `es/secondhand-dealer-management-system.html`; these app pages include the powered-by banner and footer shell.

## Portfolio / Case Studies

- Portfolio summary page is a gallery-only page with two-up mobile tiles; tiles link directly to standalone project detail pages instead of lower in-page case-study deep dives. It uses domain-style names:
  - `NaplesEstateJewelry.co`
  - `EliteYachtDetailing.com`
  - `JPSurette.com`
  - `SeansAds.com`
- Dedicated Portfolio detail pages exist in English and Spanish for all four projects.
- Portfolio screenshots have been harvested into `assets/portfolio/`; imported full client source folders have been removed.
- JPS Surette is still marked in progress and links to `https://jpsurette.netlify.app/`.
- SeansAds.com is live at `https://seansads.com/` as a standalone Google Ads mini-site hosted separately from Dark Matter. Dark Matter portfolio/account/service links now point to the live Sean's Ads domain.
- A hidden direct-link-only Easter egg page exists at `jpsurette.html`; it intentionally has no Spanish mirror.

## Client Portal

- First-pass Supabase-backed account portal exists at `account.html` and `es/account.html`.
- Supabase public URL/key are configured in `assets/supabase-config.js`.
- Auth supports email/password, magic links, and modal account creation with email confirmation.
- Email confirmation success pages exist at `account-created.html` and `es/account-created.html`.
- Starter SQL lives at `supabase/client-portal-schema.sql`.
- Login wormhole and dashboard command orbs have interactive hover motion in `assets/client-portal.css`; the login wormhole core now uses slower, lower-amplitude movement with reduced-motion fallbacks.
- Account request/contact sections use `#client-contact` as the primary anchor and keep `#client-request` as a legacy alias.
- The public account portal shows a small green Sean's Ads Google Ads console notifier only when users arrive with `?source=seansads` or a `seansads.com` referrer. The notifier includes a link back to Sean's Google Ads, and the unauthenticated intro/wormhole block is compacted on mobile.
- Logged-in dashboard currently includes:
  - website health/status cards
  - traffic/stat cards
  - service and billing summary areas
  - client request/change form
  - quick action cards
  - site preferences/settings placeholder page
  - Google Ads activity/status placeholder page
- Lightweight placeholder pages:
  - `account-settings.html` / `es/account-settings.html`
  - `account-ads-status.html` / `es/account-ads-status.html`

## Sean's Google Ads

- Sean's Ads is live at `https://seansads.com/` and is managed outside this repository.
- The old `Sean's Google Ads Services/` source folder was intentionally removed from this project. Future agents should treat its absence as expected and should not recreate or edit it here.
- Dark Matter pages may still link to Sean's Ads with absolute production URLs, and the account portal may still show source-specific Sean's Ads messaging for `?source=seansads` or `seansads.com` referrers.

## Current Priorities

- Keep English and Spanish pages in sync for every content/navigation change.
- Finish Supabase portal setup before treating account/billing as live:
  - run `supabase/client-portal-schema.sql`
  - configure Auth redirect URLs and email templates
  - create test users/client rows
  - verify Row Level Security
  - confirm Netlify detects `client-request`
  - choose the first source for traffic summaries
- Add a secure Netlify Function or equivalent backend before enabling Stripe recurring billing portal management.
- Keep auction app screenshots current if the hosted `https://auctionconsignmentapp.netlify.app/` UI changes.
- Keep cross-domain links accurate between Dark Matter and the separate live Sean's Ads site.
- Keep Spanish pages free of mojibake/question-mark artifacts after broad copy edits.
- Keep static-site validation as the safety net before and after broad HTML/CSS/JS edits.
- Consider a future Astro migration for reusable layouts/components and structured bilingual content.

## Known Validator Warning

- `scripts/validate-site.ps1` currently reports one expected warning:
  - `missing-es-pair jpsurette.html Missing Spanish mirror: es/jpsurette.html`
- This is intentional because `jpsurette.html` is a hidden English-only Easter egg page.

## Active Blockers

- No active blocker documented.
- Git has previously been unavailable in this shell environment, so commits/status may need to be checked elsewhere.

## Next Recommended Actions

- Open `project-docs/HANDOFF.md` for the immediate next-agent checklist.
- Validate after any broad HTML/CSS/JS edit:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```
