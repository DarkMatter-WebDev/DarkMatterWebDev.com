# Handoff Notes

Last updated: 2026-06-05

Read this after:

1. `AI_START_HERE.md`
2. `AGENTS.md`
3. `PROJECT_OVERVIEW.md`
4. `CURRENT_STATUS.md`
5. `TASKS.md`
6. `DECISIONS.md`

## Immediate State

- Dark Matter Web Services is a static bilingual site. English pages live at the root; Spanish mirrors live under `es/`.
- Sean's Google Ads source has been intentionally moved out of this repository and is managed elsewhere. It is normal that `Sean's Google Ads Services/` is absent.
- Sean's Ads is live on a separate server/domain at `https://seansads.com/`.
- Dark Matter is separate at `https://darkmatterwebdev.com/`.
- Cross-site links between Dark Matter and Sean's Ads should use absolute production URLs.
- Local preview usually runs at `http://127.0.0.1:4173/`.
- Current project work should treat Sean's Ads as an external live site, not as local source to edit.

## Most Recent Work

- Completed a phone-width mobile sweep and targeted fixes. `app-pricing.html` / `es/app-pricing.html` now keep pricing cards two-wide on mobile, the pricing-page `Ask a Question` / `Hacer una pregunta` CTA is contained in the banner, and the mobile header Contact button is tightened. Additional overflow fixes landed for Built By decorative blur layers, Preference Builder hero, SeansAds portfolio detail pages, and SDMS profile panels/header. Static validation passed after the changes.
- App pricing mobile layout now keeps the four tier cards two-wide on phone widths in both English and Spanish. The override lives in the page-specific second style block and intentionally beats the broader max-width 1100px one-column grid rule.
- Made all four pricing tier cards clickable on `app-pricing.html` and `es/app-pricing.html`. They default to `account.html`, but when the page is opened with `?from=auction` or `?from=sdms`, DOM-ready scripting changes them to `account.html?next=...` for the matching app checkout. Also shortened the Apps hero copy in English and Spanish.
- Added soft translucent color backing to the app gallery tiles on `apps.html` and `es/apps.html`, using a subtle cyan/purple/green gradient plus a brighter translucent border while preserving the existing screenshots and hover motion.
- Swapped the Auction House app profile content order in `auction-house-consignment-store-software.html` and `es/auction-house-consignment-store-software.html`: Consignor Spine now appears before AppFlow screenshots, and Workflow Snapshot now appears after the screenshot grid.
- Added app-aware pricing navigation. Auction House and SDMS profile page `Pricing` buttons now link to `app-pricing.html?from=auction` / `?from=sdms` and Spanish mirrors, and the pricing pages use that context to relabel the top-left control as `Back to App` / `Volver a la app` and return to the originating profile. The Apps customization banner also now has a pricing CTA beside the Contact CTA in English and Spanish.
- Added a Consignor Spine marketing section directly after the Auction House AppFlow screenshots in `auction-house-consignment-store-software.html` and `es/auction-house-consignment-store-software.html`. It uses a CSS-only visual to show one consignor profile connecting transferable floor items, auction lots, sales, invoices/settlements, and reporting context.
- Slimmed `app-pricing.html` and `es/app-pricing.html`: the large two-column hero is gone, a compact banner plus top-left Back to Apps link appears first, the pricing tiers start immediately, and the old public pricing benchmark section/links were intentionally removed. The Contact CTA styling was also normalized for the affected Dark Matter navigation surfaces.
- Tightened the Auction House app profile pages so only one compact Workflow Snapshot block appears before the AppFlow screenshot section. SDMS already followed the one-block-before-screenshots pattern.
- Added dedicated app pricing pages at `app-pricing.html` and `es/app-pricing.html`. They contain competitive starting tiers, app-specific Auction/SDMS recommendations, and checkout CTAs into `app-checkout.html?app=auction` and `app-checkout.html?app=sdms`.
- Added `Pricing` / `Precios` buttons to the Auction House and SDMS app profile CTA rows in English and Spanish. SDMS hero buttons now match the requested pattern: `Open Live App Demo`, `Request Live Login`, `Request Custom Version`, and `Pricing`.
- Added `Any Language` / `Cualquier idioma` sections to both full app profile pages: Auction House and SDMS, in English and Spanish. Each section includes a CSS-only globe/language-chip visual and copy that the app can be localized for any needed language or bilingual workflow.
- Added a CSS-only deployment path visual to the Auction House app profile in English and Spanish. The Deployment Path card now includes a cloud-to-LAN diagram and three step chips: Demo, Deploy/Instala, and Operate/Opera.
- Updated the Auction House app profile CTA rows. English now shows `Open Live App Demo`, `Request Live Login`, and `Request Custom Version`; Spanish mirrors this as `Abrir demo activa`, `Solicitar acceso demo`, and `Solicitar version personalizada`. The open-demo button links to `https://auctionconsignmentapp.netlify.app/`; the request buttons link to Contact.
- Converted SDMS app screenshots to lossless WebP only. `assets/apps/sdms/` now contains six `.webp` screenshots, and `apps.html`, `es/apps.html`, `secondhand-dealer-management-system.html`, and `es/secondhand-dealer-management-system.html` all reference those WebP files for gallery previews, screenshot tiles, and modal previews.
- Updated the Auction House & Consignment Store Software profile pages in English and Spanish. The profile now presents the app as floor sales plus live auctions in one operating system, uses six lossless WebP screenshots under `assets/apps/auction/`, uses demo/login/custom CTA rows, and uses SDMS-style screenshot buttons that hover/lift and open larger modal previews with X, Escape, and backdrop close.
- Added `seanGoogleAdsAdminEmails` to `assets/supabase-config.js` with `scochrane495@gmail.com`, separate from the owner `superAdminEmails` list. Sean can access his direct Google Ads portal with a real Supabase login; regular users cannot.
- Added a hidden Sean/owner portal shortcut panel to `account.html` and `es/account.html`, shown only when the active session email is in `superAdminEmails` or `seanGoogleAdsAdminEmails`.
- Restored the Active Google Ads Projects customer table and Add New Project placeholder form inside `seans-google-ads-dashboard.html` and `es/seans-google-ads-dashboard.html`. The section stays hidden unless the active session is Sean or the Dark Matter owner account.
- Added a real-account-only browser-side super-admin concept to the Dark Matter client portal. `assets/supabase-config.js` now uses `superAdminEmails` with only `rcman12589@aol.com`; there is intentionally no `admin` / `admin` username/password bypass.
- Added an owner-only super-user panel to `account.html` and `es/account.html`. It is hidden unless the active Supabase session email matches `superAdminEmails`, and it includes a button to open Sean's direct portal backend view.
- Removed the regular Sean's Google Ads dashboard tile from the general logged-in account workspace so other clients do not see a shortcut into Sean's personalized/direct portal page.
- Gated `seans-google-ads-dashboard.html` and `es/seans-google-ads-dashboard.html` behind the same `superAdminEmails` check. Signed-out visitors still get a login handoff; signed-in non-owner accounts get an owner-only gate. Real privileged data access still needs Supabase RLS/custom claims/server-side enforcement before sensitive records exist.
- Added the standard Dark Matter top nav/header shell to the portal-only Sean's Google Ads dashboard pages in English and Spanish. The pages now include desktop navigation with the Services dropdown, Apps/Process/Portfolio links, session-aware Account/Cuenta label, language toggle, Contact CTA, and the matching mobile brand/language header.
- Removed the large Google Ads activity/status panel from the account dashboard in English and Spanish.
- Added portal-only Sean's Google Ads direct-view pages at `seans-google-ads-dashboard.html` and `es/seans-google-ads-dashboard.html`; they check Supabase session state and prompt signed-out visitors to log in with a safe `next` handoff.
- Added `/seans-google-ads-dashboard.html` and `/es/seans-google-ads-dashboard.html` to the safe `next` redirect allowlist in `assets/client-portal.js`.
- Updated the client portal nav behavior: `.nav-login-link` now relabels from `Login` / `Acceso` to `Account` / `Cuenta` when the Supabase session is active, then returns to the signed-out label after sign-out.
- Added shared portal-only app checkout/cart pages at `app-checkout.html` and `es/app-checkout.html`. They support selected apps through `?app=sdms` or `?app=auction`, require a Supabase session before showing the cart/payment request form, and otherwise link back through the login portal with a preserved `next` target.
- Updated `assets/client-portal.js` with a whitelist-only `next` redirect for `/app-checkout.html` and `/es/app-checkout.html`, so signed-in users can be sent to the selected checkout page after login while avoiding open redirects.
- Changed the lower SDMS purchase CTA to `Get it now` / `Obtenerla ahora`, pointing to `account.html?next=%2Fapp-checkout.html%3Fapp%3Dsdms` and the Spanish equivalent.
- Added a colorful CSS compliance-flow visual to the SDMS problem card in English and Spanish so the previously blank lower panel now shows spreadsheet, orbit, and verify/track/report elements.
- Reworded the four SDMS top feature cards in English and Spanish so they no longer describe seeded demo sample counts. They now explain the program in plain customer-facing terms: organize seller records, record purchases clearly, track inventory value with live metal pricing/calculators, and make compliance reporting less stressful.
- Tightened the SDMS app-flow screenshot crop and modal-preview crop on the English and Spanish profile pages and converted the screenshot cards into interactive buttons with stronger borders. Each tile now lifts/scales on hover and opens a larger cropped modal preview with a backdrop, Escape/backdrop close, and an X close button.
- Upgraded the SDMS listing and full profile pages in English and Spanish. The Apps gallery tile now uses a real SDMS dashboard screenshot and marks the app as a live demo. The full profile pages now link to `https://secondhanddealer.netlify.app/`, include six cropped app-flow screenshots from `assets/apps/sdms/`, and describe the production-grade SaaS + Windows desktop build, FastAPI/React/Neon/Render/Netlify stack, custom JWT/RBAC, immutable audit log, database-layer 15-day hold enforcement, seeded demo data, reports, label/receipt printing, and future hardware integrations.
- Added Open Graph/Twitter preview tags to `apps.html`, `es/apps.html`, both Auction House app profile pages, and both SDMS profile pages, using `https://darkmatterwebsites.com/assets/darkmatter-og-image-modern.png` as the preview image.
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
- Sean's Ads source: intentionally absent from this repository; managed elsewhere.
- Sean's Ads live site: `https://seansads.com/`
- Static validator: `scripts/validate-site.ps1`

## Preserve These Rules

- Keep English and Spanish pages in sync.
- Keep Sean's Ads and Dark Matter cross-domain links absolute because they are deployed separately.
- Keep Sean's Ads external. Do not recreate the old local mini-site folder or apply Dark Matter navigation sweeps to it from this repository.
- Keep public Supabase config limited to non-secret values only: URL, publishable/anon key, table names, and public UI allowlists. Never put service-role keys, private authorization rules, or secrets there.
- Do not store secrets, passwords, service-role keys, Stripe secret keys, or recovery codes in docs or static files.
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

No expected validator warning is currently documented.

## Best Next Actions

- If Sean's Ads needs changes, handle them in its separate external project, not in this Dark Matter repository.
- If touching account portal flow, check `account.html`, `es/account.html`, `assets/client-portal.js`, and `assets/client-portal.css`.
- If adding real account features, complete Supabase setup and test users before treating portal data as production.
- If updating live URLs, verify both deployed domains because Sean's Ads and Dark Matter are separately hosted.
