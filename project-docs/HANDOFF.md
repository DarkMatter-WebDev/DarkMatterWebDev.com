# Handoff Notes

Last updated: 2026-06-04

Read this after:

1. `AI_START_HERE.md`
2. `AGENTS.md`
3. `PROJECT_OVERVIEW.md`
4. `CURRENT_STATUS.md`
5. `TASKS.md`
6. `DECISIONS.md`

## Immediate State

- Dark Matter Web Services is a static bilingual site. English pages live at the root; Spanish mirrors live under `es/`.
- Sean's Google Ads is a standalone bilingual mini-site in `Sean's Google Ads Services/` with Spanish pages under `Sean's Google Ads Services/es/`.
- Sean's Ads is live on a separate server/domain at `https://seansads.com/`.
- Dark Matter is separate at `https://darkmatterwebdev.com/`.
- Cross-site links between Dark Matter and Sean's Ads should use absolute production URLs.
- Local preview usually runs at `http://127.0.0.1:4173/`.
- Current in-app browser context recently focused on Sean's Ads pages, especially `about-sean.html`, `contact.html`, and the mini-site homepage.

## Most Recent Work

- Added a green CTA button to the Apps page customization/language banner: `Customize Yours Now` on `apps.html` and `Personaliza la tuya ahora` on `es/apps.html`, both linking to the local Contact page.
- Renamed the app-library files to `apps.html` and `es/apps.html`, updated all internal HTML links/metadata from `downloads.html`, preserved the `#app-auction-consignment` and `#app-secondhand-dealer` anchors on the gallery cards, and added Netlify 301 redirects from `/downloads.html` and `/es/downloads.html`.
- Simplified `apps.html` and `es/apps.html` so they are gallery-only app preview pages. Removed the large lower detail sections and old in-page smooth-scroll behavior, changed app tiles to direct full-profile links, and added a banner under the gallery saying the apps are fully customizable for the business and language.
- Added bottom-of-page powered-by Dark Matter banners and footer shells to `apps.html`, `es/apps.html`, `auction-house-consignment-store-software.html`, `es/auction-house-consignment-store-software.html`, `secondhand-dealer-management-system.html`, and `es/secondhand-dealer-management-system.html`.
- Added tag printing support to the Auction House & Consignment Store Software Apps listing and full profile pages in English and Spanish, including item tags, label templates, barcodes, QR codes, prices, fields, branding, and print-ready formats that can be customized on the fly.
- Added explicit language/localization customization messaging to the Auction House & Consignment Store Software full profile pages in English and Spanish, so custom versions now mention different languages, translated labels, regional terminology, and bilingual workflows.
- Added dedicated Auction House & Consignment Store Software profile pages (`auction-house-consignment-store-software.html`, `es/auction-house-consignment-store-software.html`) with full-size app-flow screenshots, guided demo-login messaging, and customization/layout/module options. The Apps page screenshot cards now link to anchors on this profile page, and the auction CTAs now read `Open full app profile` and `Request live app demo`.
- Updated the Apps page auction listing to link to `https://auctionconsignmentapp.netlify.app/`, added cropped screenshots from the live app flow, refreshed auction app feature copy, and added messaging that full brand, layout, feature, field, report, workflow, and module customization is available.
- Updated the account portal Sean's Ads source banner so it links back to `seansads.com` / `seansads.com/es/index.html`, and added mobile-only CSS to shrink the unauthenticated intro/wormhole block, hide the portal-status note, and show shorter mobile intro copy.
- Swept English/Spanish site copy for legitimate question marks removed during earlier Spanish artifact cleanup. Restored clear missing `?` punctuation on Built By, Contact, Process, Website Design, Complete Website Management, and Brand/Rebranding copy, and fixed malformed `textárea` tags in Spanish account and Sean's Ads contact forms.
- Ran a follow-up English punctuation sweep and restored missing `?` punctuation on the Dark Matter Built By headline (`Like this site?`) and Contact lead (`Prefer to talk?`).
- Updated the SDMS full profile pages so the top menu/button layout includes the full Dark Matter homepage-style set: Home/Inicio, Services/Servicios with dropdown, Apps, Process/Proceso, Portfolio/Portafolio, Client Login/Acceso, EN/ES, and Contact Us/Contactanos.
- Added Secondhand Dealer Management System (SDMS) as the second Dark Matter Apps listing in English and Spanish. The Apps gallery tile jumps to a lower detail section, and that section links to full profile pages at `secondhand-dealer-management-system.html` and `es/secondhand-dealer-management-system.html`.
- Reworked the Dark Matter Apps pages into a compact gallery-first layout with app tiles that jump to detailed sections below, mirrored in English and Spanish.
- Earlier, the Dark Matter app-library page-facing title/metadata/hero labels changed from Downloads/Descargas to Apps while the physical URLs still used `downloads.html`; those files are now renamed to `apps.html` / `es/apps.html`.
- Changed the Dark Matter main navigation label from `Downloads` / `Descargas` to `Apps` across English and Spanish desktop/mobile menus.
- Unified Sean's Ads header action bars across all English and Spanish mini-site pages. Every page now matches the homepage pattern with other services, Dark Matter Portal login, EN/ES toggle, and Contact Us / Contáctanos.
- Routed Sean's Ads top-right `Contact Us` / `Contáctanos` header buttons to the local Contact Sean page across English and Spanish mini-site pages. Account/login and pricing CTAs still hand off to the Dark Matter portal with `?source=seansads`.
- Doubled the Sean's Ads header service-name text size across homepage, contact, and shared detail pages in English and Spanish. The Google `G` mark size was left unchanged.
- Added a small Sean portrait icon to the Sean's Ads homepage `About Sean Cochrane` card in English and Spanish.
- Replaced the Sean's Ads header brand badge from a Google-like `G` to a multicolor Google `G` SVG across all English and Spanish mini-site pages, preserving the existing wrapper size.
- Tightened Sean's Ads contact-page mobile layout: smaller hero headline, lead, Call/Text card, and Email card in English and Spanish.
- Added a green account-portal notice that appears only when users arrive with `?source=seansads` or from a `seansads.com` referrer. It describes the Dark Matter portal as the user's customized Google Ads management console.
- Swept Spanish Sean's Ads UI for untranslated labels such as `Contact Us` and `Log in through Dark Matter Portal`; visible Spanish UI should now be translated.
- Swept Spanish pages for obvious question-mark/mojibake artifacts; continue checking after future Spanish edits.

## Important Paths

- Main homepage: `index.html`, `es/index.html`
- Services: `services.html`, `services/*.html`, `es/services.html`, `es/services/*.html`
- Apps: `apps.html`, `es/apps.html`, `secondhand-dealer-management-system.html`, `es/secondhand-dealer-management-system.html`
- Portfolio summary: `casestudies.html`, `es/casestudies.html`
- Portfolio detail pages: `portfolio-*.html`, `es/portfolio-*.html`
- Client portal: `account.html`, `es/account.html`
- Portal scripts/styles: `assets/client-portal.js`, `assets/client-portal.css`, `assets/supabase-config.js`
- Supabase starter SQL: `supabase/client-portal-schema.sql`
- Sean's Ads mini-site: `Sean's Google Ads Services/`
- Sean portrait asset: `Sean's Google Ads Services/assets/sean-cochrane-portrait-backgroundless-lossless.webp`
- Sean social preview: `Sean's Google Ads Services/assets/seans-google-ads-social-preview.png`
- Static validator: `scripts/validate-site.ps1`

## Preserve These Rules

- Keep English and Spanish pages in sync.
- Keep Sean's Ads and Dark Matter cross-domain links absolute because they are deployed separately.
- Keep public Supabase config limited to URL and publishable/anon key only.
- Do not store secrets, passwords, service-role keys, Stripe secret keys, or recovery codes in docs or static files.
- Keep `jpsurette.html` unlinked except for the tiny homepage Easter egg unless the user asks otherwise.
- Keep imported client source folders out of the project root; harvested assets should live under `assets/portfolio/`.
- Prefer updating shared CSS/JS where possible, but note Sean's Ads homepage/contact pages use inline CSS while detail pages use `detail.css`.

## Before Editing

- Check whether the requested page has a Spanish counterpart.
- Check shared CSS/JS cache-busting query strings if a change appears not to show in preview.
- Use `rg` for file/text searches.
- Avoid changing unrelated page content; the user often asks for very narrow visual changes.

## Validation

After broad HTML/CSS/JS edits, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

## Current Known Warning

```text
missing-es-pair jpsurette.html Missing Spanish mirror: es/jpsurette.html
```

This is expected unless the user decides the hidden Easter egg needs a Spanish mirror or validator exception.

## Best Next Actions

- If continuing Sean's Ads polish, inspect both `Sean's Google Ads Services/index.html` and `Sean's Google Ads Services/es/index.html`.
- If touching account portal flow, check `account.html`, `es/account.html`, `assets/client-portal.js`, and `assets/client-portal.css`.
- If adding real account features, complete Supabase setup and test users before treating portal data as production.
- If updating live URLs, verify both deployed domains because Sean's Ads and Dark Matter are separately hosted.
