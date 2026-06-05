# Current Status

Last updated: 2026-06-05

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
- A mobile-formatting sweep was run across the routed site at phone width. App pricing now keeps two-wide tier cards on mobile, the pricing banner `Ask a Question` / `Hacer una pregunta` CTA stays contained, and targeted overflow fixes were applied to Built By decorative blurs, Preference Builder hero behavior, the SeansAds portfolio detail pages, and SDMS mobile profile panels/header.
- Apps pages exist at `apps.html` and `es/apps.html` for Dark Matter-created web apps. They use the standard Dark Matter mobile header/tab shell and services popout, now act as a compact gallery-only app preview page with two-up mobile tiles, soft translucent color-backed app cards, visual tile previews, direct full-profile links, a custom-build contact tile, and concise hero/banner copy noting Dark Matter can build apps from scratch or adapt around an existing system. The custom business apps banner includes both a Contact CTA and an app pricing CTA. Current listings are Auction House & Consignment Store Complete Management Software and Secondhand Dealer Management System (SDMS). Dedicated app pricing pages now exist at `app-pricing.html` and `es/app-pricing.html`, with a compact page banner, top-left Back to Apps link, immediate Evaluation/Popular/Operations/Custom tiers, app-specific pricing notes, and checkout CTAs into `app-checkout.html?app=auction` / `app-checkout.html?app=sdms`; the old public benchmark-link section was intentionally removed. Pricing buttons on app profile pages pass `?from=auction` or `?from=sdms`, causing the pricing page back link to relabel as `Back to App` / `Volver a la app` and return directly to the originating app profile; the four pricing tier cards are also clickable and route through `account.html?next=...` to the selected app checkout when app context is present. The auction app profile now uses six compressed lossless WebP screenshots stored under `assets/apps/auction/`, presents floor sales plus live auctions as one shared operating system, uses SDMS-style hover-moving screenshot tiles with click-to-enlarge modal previews in English and Spanish, includes a CSS-only cloud-to-LAN deployment visual in the Deployment Path card, includes an `Any Language` callout with a language-chip visual, places the Consignor Spine marketing block before the AppFlow screenshots, and places the compact Workflow Snapshot block after the AppFlow screenshots. Auction CTA rows include `Open Live App Demo`, `Request Live Login`, `Request Custom Version`, and `Pricing`. SDMS links to the live hosted demo at `https://secondhanddealer.netlify.app/`, uses six compressed lossless WebP screenshots stored under `assets/apps/sdms/`, has one benefit-summary block before AppFlow screenshots, has tighter cropped interactive screenshot tiles with hover motion and click-to-enlarge modal previews, includes an `Any Language` callout with a language-chip visual, and positions the product as a production-grade SaaS + Windows desktop compliance app using FastAPI, React/TypeScript/Vite/Tailwind, PostgreSQL on Neon, Render + Netlify, custom JWT auth, immutable audit logs, and database-layer 15-day hold enforcement. The auction app has full profile pages at `auction-house-consignment-store-software.html` and `es/auction-house-consignment-store-software.html`; SDMS has full profile pages at `secondhand-dealer-management-system.html` and `es/secondhand-dealer-management-system.html`; these app pages include the powered-by banner and footer shell. SDMS purchase CTA now says `Get it now` / `Obtenerla ahora` and routes through the client portal with a safe `next` redirect to the shared portal-only app checkout page.

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
- Portal-only app checkout pages now exist at `app-checkout.html` and `es/app-checkout.html`. They read the selected app from `?app=sdms` or `?app=auction`, require a Supabase session before showing the cart/payment request form, and otherwise link visitors back through `account.html?next=...` / `es/account.html?next=...`.
- A portal-only Sean's Google Ads direct member/backend view exists at `seans-google-ads-dashboard.html` and `es/seans-google-ads-dashboard.html`. It checks the Supabase browser session and only opens for the owner super-admin email in `assets/supabase-config.js` (`superAdminEmails`, currently `rcman12589@aol.com`) or Sean's Google Ads admin email (`seanGoogleAdsAdminEmails`, currently `scochrane495@gmail.com`). The normal account dashboard shows a Sean portal shortcut only to those allowed accounts and hides it from regular users. Sean's direct portal includes an empty Active Google Ads Projects customer table plus an Add New Project placeholder form for future Supabase-backed records. There is no `admin` / `admin` local preview login shortcut; real sign-in must happen through Supabase. This is still browser-side UI gating only, so real cross-account/customer data access must be enforced later with Supabase RLS/custom claims/server-side functions.

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

- No expected validator warning is currently documented.

## Active Blockers

- No active blocker documented.
- Git has previously been unavailable in this shell environment, so commits/status may need to be checked elsewhere.

## Next Recommended Actions

- Open `project-docs/HANDOFF.md` for the immediate next-agent checklist.
- Validate after any broad HTML/CSS/JS edit:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```
