# Current Status

Last updated: 2026-06-04

This file is intentionally concise for handoff. Historical detail lives in `CHANGELOG.md` and feature notes under `project-docs/features/`.

## Current Project Shape

- Dark Matter Web Services is a static, bilingual marketing site with English pages at the project root and Spanish mirrors under `es/`.
- Main pages include homepage, Services, Downloads, Process, Portfolio (`casestudies.html`), Contact, Built By, Website Preference Builder, Account/Login Portal, and individual Portfolio detail pages.
- Service pages live under `services/` with Spanish mirrors under `es/services/`.
- Shared styling and behavior live mostly in `assets/`, including `nav.css`, `cosmic-web.css`, `care-plans.css`, `client-portal.css`, `rail.js`, `mobile-services-nav.js`, and Supabase/account portal scripts.
- A standalone bilingual Google Ads mini-site exists in `Sean's Google Ads Services/`, with Spanish pages in `Sean's Google Ads Services/es/`.
- Local preview commonly runs at `http://127.0.0.1:4173/`; if that port is stale, use another port such as `4188`.

## Working Features

- Homepage hero video is homepage-only and uses optimized responsive MP4 files:
  - Desktop: `assets/Hero-Black-Hole-desktop-1080p.mp4`
  - Mobile: `assets/Hero-Black-Hole-mobile-720p.mp4`
- Exceptionally thin/tall portrait mobile screens use a tiny homepage hero video zoom-out while staying `object-fit: cover` to preserve the sharper cropped treatment.
- Non-home pages use the compressed cosmic-web WebP background through `assets/cosmic-web.css`.
- The sitewide floating process rail is a four-step system: Design, Build, Launch, Maintain.
- Main navigation uses `Portfolio` / `Portafolio`; the underlying page is still `casestudies.html`.
- Main navigation includes `Downloads` / `Descargas` directly after `Services` / `Servicios`; shared nav CSS keeps desktop link spacing, top-right CTAs, and mobile tab icons/labels visually consistent across English and Spanish pages.
- Services are grouped into Online Services and In-Home & Office Services.
- The Services page opens with three plain-language paths: website/online help, in-person tech setup, and business app/portal.
- SEO Foundations includes an expanded visual foundation-map section before the Sean's Google Ads cross-promo.
- Website Care Plans have linked plan tiles and expanded detailed pricing sections; Growth and higher tiers now position approved periodic blog/content publishing as part of the maintenance hook.
- Website Preference Builder is a Netlify Forms intake flow in English and Spanish.
- Contact and client request forms use Netlify form markup.
- WhatsApp update-queue messaging is integrated on the homepage and Process page.
- Browser/link-preview metadata is in place with favicon, app icons, manifest, and a modern Dark Matter Open Graph image.
- Downloads pages exist at `downloads.html` and `es/downloads.html` for Dark Matter-created web apps. They use the standard Dark Matter mobile header/tab shell and services popout. The first listing is Auction House & Consignment Store Complete Management Software; it currently routes to request access because no downloadable package has been added yet.

## Portfolio / Case Studies

- Portfolio summary page uses domain-style names:
  - `NaplesEstateJewelry.co`
  - `EliteYachtDetailing.com`
  - `JPSurette.com`
  - `SeansAds.com`
- Dedicated Portfolio detail pages exist in English and Spanish for all four projects.
- Portfolio screenshots have been harvested into `assets/portfolio/`; imported full client source folders have been removed.
- JPS Surette is still marked in progress and links to `https://jpsurette.netlify.app/`.
- SeansAds.com is represented as a launch-ready standalone Google Ads mini-site and currently opens the local `Sean's Google Ads Services/` preview until the final domain/Netlify deployment is connected.
- A hidden direct-link-only Easter egg page exists at `jpsurette.html`; it intentionally has no Spanish mirror.

## Client Portal

- First-pass Supabase-backed account portal exists at `account.html` and `es/account.html`.
- Supabase public URL/key are configured in `assets/supabase-config.js`.
- Auth supports email/password, magic links, and modal account creation with email confirmation.
- Email confirmation success pages exist at `account-created.html` and `es/account-created.html`.
- Starter SQL lives at `supabase/client-portal-schema.sql`.
- Login wormhole and dashboard command orbs have interactive hover motion in `assets/client-portal.css`; the login wormhole core now uses slower, lower-amplitude movement with reduced-motion fallbacks.
- Account request/contact sections use `#client-contact` as the primary anchor and keep `#client-request` as a legacy alias.
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

## Google Ads Mini-Site

- Standalone mini-site path: `Sean's Google Ads Services/`.
- It is intended for separate hosting/domain use but currently runs inside this project preview.
- Includes English/Spanish home, contact, About Sean, Portfolio, focus-detail pages, and pricing-tier pages.
- Google Ads tier pages route primary "Choose this plan" CTAs to the Dark Matter account portal.
- Mini-site top-right contact links route to the Dark Matter account dashboard contact anchor; account/login buttons use "Log in through Dark Matter Portal."
- Sean Cochrane bio and supplied transparent lossless WebP portrait cutout are present on About pages, styled as a floating motion portrait.
- Sean's Google Ads mini-site has a dedicated 1200x630 social preview asset and Open Graph/Twitter preview metadata across English and Spanish pages.
- The mini-site has its own navigation, detail CSS/JS, EN/ES toggle, Dark Matter co-branding, and powered-by footer.
- Mobile Sean's Google Ads pages use tighter typography/buttons and include a mobile-only draggable grid-orb control for touch interaction with the animated background. The homepage and subpage upper controls are compact on mobile, including other services, portal login, language switcher, contact, and Back to Google Ads home buttons.

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
- Add the real downloadable package, installer, or hosted handoff asset for the Auction House & Consignment Store app before changing the Downloads CTA from request-access/coming-soon.
- Decide final hosting/domain destination for `Sean's Google Ads Services/`.
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
