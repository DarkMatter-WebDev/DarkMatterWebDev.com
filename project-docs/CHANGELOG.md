# Changelog


## 2026-06-03

- Added Dark Matter favicon/app icon assets, a `site.webmanifest`, and a 1200x630 Open Graph preview image, then wired favicon, Open Graph, and Twitter card metadata across 41 live English and Spanish HTML pages.
- Renamed the hidden JPSurette Easter egg page to `jpsurette.html`, updated homepage links, and removed the old page label from project references.
- Added a larger animated power-up loading panel to `jpsurette.html`, with six colorful moving progress bars, pulsing status cells, and longer scroll timing before the final reveal.
- Added JPS Surette Photography as the third homepage portfolio teaser and Case Studies entry in English and Spanish.
- Added optimized JPS Surette WebP previews (`home.webp`, `combat.webp`, `events.webp`, `architecture.webp`) plus tall mini page previews (`home-tall.webp`, `events-tall.webp`).
- Wired the JPS Surette case-study live-preview button to `https://jpsurette.netlify.app/` and marked the case study as in progress with desktop/mobile progress bars.
- Added tall full-page mini previews to Naples Estate Jewelry (`home-tall.webp`, `shop-tall.webp`) so the case-study details show more complete page layouts.
- Updated Case Studies project labels to use website/domain names, added business-type subtitles under each main case-study title, added Elite Yacht full-page mini previews, and removed black frames around all tall/floating page previews in English and Spanish.
- Constrained the Elite Yacht and JPS desktop case-study detail sections to match the narrower centered Naples case-study layout.
- Changed JPS in-progress labels, status pills, and progress bars from muted purple to bright green for stronger readability.
- Changed sitewide top-menu labels to `Portfolio` / `Portafolio` while keeping the page file as `casestudies.html`.
- Split the deeper Portfolio project sections into dedicated detail pages for NaplesEstateJewelry.co, EliteYachtDetailing.com, and JPSurette.com in English and Spanish, and changed the summary CTAs to "See more details about this project" / "Ver más detalles de este proyecto."
- Added animated green live-site widgets to all English and Spanish Portfolio project detail pages.
- Fixed remaining Spanish Portfolio question-mark accent artifacts in Naples project copy, project-detail CTA copy, and footer separators.
- Added a direct-link-only `jpsurette.html` Easter egg page for JPSurette.com with no site navigation; the page starts as a 1999-style photography site with filler copy and keep-scrolling prompts, then scroll-reveals a modern loading section and a subtle final link to the JPS project detail page.
- Revised early `jpsurette.html` copy to remove obvious joke giveaways while keeping the final "Okay, just kidding" reveal.
- Adjusted `jpsurette.html` visual/copy tone toward a sincere rough first-draft website while preserving the long scroll and reveal sequence.
- Added large draft image placeholders to `jpsurette.html` beneath the placeholder-note section.
- Added a floating animated "wait a second..." pause stage to `jpsurette.html` before the main loading reveal.
- Smoothed the `jpsurette.html` old-to-modern transition with a gray-to-blue-green gradient fade.
- Removed the experimental person/arm handoff visual from the final `jpsurette.html` project reveal.
- Added colorful gradient outline/glow treatments to the photo and visual-highlight cards on all Portfolio project detail pages in English and Spanish.
- Added a tiny rainbow Easter egg link to `jpsurette.html` at the actual bottom-left end of the English and Spanish homepages.
- Rebranded the Naples portfolio/case-study entry from Naples Antiques LLC to Naples Estate Jewelry across English and Spanish homepage teasers and Case Studies pages.
- Captured three new lightweight WebP screenshots from the imported Naples Estate Jewelry project (`home.webp`, `shop.webp`, `product.webp`) and wired them into the portfolio.
- Removed the old unused Naples PNG screenshots from `assets/`.
- Updated `built-by.html` and `es/built-by.html` with the standard desktop Services dropdown, language switcher, Contact CTA, mobile header, and mobile bottom navigation.
- Turned the desktop homepage WhatsApp update visual into a link to `process.html#client-whatsapp-queue` / `es/process.html#client-whatsapp-queue`.
- Added WhatsApp update requests as part of the Maintain step on the Process page in English and Spanish.
- Added a detailed Process page section explaining the dedicated client WhatsApp account and automatic update queue for messages, photos, hours, promotions, and content changes.

## 2026-06-02

- Performed a strict no-quality-loss media sweep: confirmed `assets/cosmic-web-hero.webp` is already compressed at 1600x900/about 198 KB, left MP4/JPEG/WebP assets unchanged, and losslessly optimized six PNG-format portfolio screenshots with pixel-identical verification.
- Strengthened `assets/cosmic-web.css` service colorways with hue rotation, higher saturation, and stronger accent overlays so the cosmic-web hero reads as different green/blue/purple/gold treatments instead of subtle same-looking glows.
- Added page-specific `cosmic-tint-*` body classes to English and Spanish service pages so each online and local service category has a distinct cosmic-web hero color treatment.
- Added `assets/cosmic-web-hero.webp`, a compressed local WebP derived from ESA/Hubble's "The Cosmic Web (Artist's Impression)," for a dark-matter-web visual on non-home pages.
- Added `assets/cosmic-web.css` and linked it across non-home English and Spanish pages, leaving `index.html` and `es/index.html` on the optimized MP4 hero setup.
- Updated `preference-builder.html` and `es/preference-builder.html` to inherit the standard site navigation and footer shell, including the desktop Services dropdown, mobile language header, mobile Services popout support, bottom tab bar, powered-by badge, and contact footer.
- Matched the Website Preference Builder header more tightly to the homepage by using the same Tailwind load order, logo font/icon loading, and top-right Contact Us button styling.
- Centered the desktop main navigation consistently by updating shared `assets/nav.css` and cache-busting all English and Spanish nav stylesheet links with `?v=20260602-menu-center`.
- Replaced the old homepage hero MP4 reference with optimized responsive desktop/mobile MP4 sources in English and Spanish.
- Removed `assets/site-hero.js` loading from non-home pages and removed the preference-builder MP4 hero so video now loads only on the homepage.
- Added the floating four-step process rail to `preference-builder.html` and `es/preference-builder.html`.
- Updated `assets/rail.js` active-state rules so each step highlights consistently on its corresponding pages, including Launch on the Process page.
- Cache-busted all `assets/rail.js` references with `?v=20260602-rail-active`.
- Added the shared black-hole MP4 hero background to the English and Spanish Website Preference Builder / free mockup pages with a unique purple-cyan tint.
- Added a down-arrow hero cue on the free mockup page directing visitors to the form below.
- Added page-specific MP4 hero tint themes in `assets/site-hero.js` and cache-busted it with `?v=20260602-hero-tints`.
- Fixed UTF-8 mojibake artifacts across Spanish pages, English language-switch labels, typographic marks, and shared process-rail Spanish strings.
- Renamed the consultation service across English and Spanish pages, updated mobile services nav labels, cache-busted `assets/mobile-services-nav.js`, and rewrote the service page around strategic consulting.
- Optimized the English and Spanish Website Preference Builder for mobile by making the hero MP4 desktop-only, disabling preload, and replacing mobile video/backdrop blur with a lighter gradient hero.
- Added an immediate loading overlay to the English and Spanish Website Preference Builder and deferred the Tailwind CDN/font loading path to reduce blank-screen behavior on slower mobile devices.
- Added desktop rail clearance to the English and Spanish Website Preference Builder form so the floating process rail does not overlap the first preference cards.
- Smoothed Services dropdown motion in `assets/nav.css`, including slower desktop menu open/close and mobile services popout transitions, and cache-busted nav CSS references.
- Changed top-right "Start Project" CTAs to "Contact Us" / "Contáctanos" where applicable.
- Added `darkmatterwebsites@gmail.com` as a clickable email contact in repeated English/Spanish contact/footer areas and on the Contact page cards.
- Corrected the public contact email to `darkmatterwebsites@gmail.com` across site copy, `mailto:` links, and memory docs.
- Added English and Spanish positioning copy across homepage, Services, Website Design, Managed Hosting, Complete Website Management, and Website Care Plans that frames AI as useful for ideas while Dark Matter keeps live-site updates stable and accountable.
- Added `project-docs/STRUCTURE_RECOMMENDATIONS.md` after a full site-structure audit, recommending static generated HTML with Astro, reusable components, structured bilingual content, validation checks, and asset optimization before any major framework migration.
- Updated project memory docs with the new long-term structure direction and next tasks.
- Added `scripts/validate-site.ps1` and documented it in project memory plus `AGENTS.md`; the validator currently passes with no issues found.
- Turned Website Care Plan package tiles into clickable jump links, added detailed package sections below the pricing grid, mirrored the behavior on mobile and Spanish pages, and strengthened `assets/care-plans.css` with tinted card styling.
- Expanded the Website Care Plan detail sections with month-to-month and yearly pricing, fuller package inclusions, best-fit guidance, mobile pricing text, and distinct tier visuals/icons in English and Spanish.
- Simplified the Website Care Plans page opening so English and Spanish versions start directly at the monthly plan chooser, removing the old Step 04 hero and "Which service fits you?" callout section.
- Reduced the Website Care Plans universal hero height and following top padding so the pricing cards appear much closer under the intro.
- Updated Website Care Plan preview tiles and mobile plan rows so each tier uses the same accent color as its matching detailed section.
- Normalized sitewide contact CTA labels from old consultation/start-project wording to "Contact Us" / "Contáctanos" across English and Spanish pages.
- Reduced Case Studies / Nuestro portafolio hero height, intro spacing, and gallery top gap so project tiles appear closer to the opening copy.

## 2026-06-01 (Spanish site)

- Added `preference-builder.html` and `es/preference-builder.html` as a first-pass website preference/intake builder, then connected it from the Services gateway and Custom Business Web Apps pages.
- Refined the Website Preference Builder layout so steps run vertically and visual preference swatches share a consistent mini-website icon style.
- Changed the Website Preference Builder top summary card from an early submit CTA into a status prompt, with a disabled submit/review design at the bottom for the future intake workflow.
- Increased contrast on Website Preference Builder step cards so Structure, Blueprint Options, and Brand Soul read as distinct sections.
- Routed the shared floating process rail Design button to the Website Preference Builder across English and Spanish pages, and added builder links to Process and Website Design pages.
- Connected the Website Preference Builder to Netlify Forms as `website-preferences`, including synced hidden selection fields, required contact fields, honeypot spam protection, and URL-encoded AJAX submission in English and Spanish.
- Reframed the Website Preference Builder as a free website mockup request page, added 48-hour follow-up language, and removed the locked/disabled visual state from the submit button.
- Updated English and Spanish homepage hero pill copy from "Your Website Team" to "Your Complete IT Solution" / "Tu Solución Completa de TI".
- Fixed `assets/rail.js` active-step detection so English and Spanish Process overview pages clear rail highlights instead of marking Launch active, while launch-related service pages still highlight Launch.
- Redesigned and then streamlined the desktop homepage WhatsApp update accent card in English and Spanish with a short, squat WhatsApp logo badge, one quick-message example, and automatic message/media queue language.
- Updated Spanish portfolio navigation/page labels from "Casos de Éxito" / "Portafolio" to "Nuestro portafolio".
- Reduced only the Spanish desktop homepage hero headline size so its longer copy does not push the MP4 hero stage lower than the English homepage.
- Matched English and Spanish homepage mobile hero video/headline sizing rules and reduced the MP4 scale to `scale(1.01)`.
- Moved the mobile five-item navigation from the bottom to a slimmer top tab bar, hid the old top-right mobile dropdown trigger, and added a tap-to-open Services popout grouped into Web & Online and In-Home & Office services.
- Added `assets/mobile-services-nav.js` for shared mobile Services popout behavior and cache-busted it with `?v=20260601-mobile-services2`.
- Cache-busted `assets/nav.css` with `?v=20260601-mobile-topnav` for the mobile top navigation change.
- Reduced mobile homepage MP4 hero zoom from `scale(1.12)` to `scale(1.04)` and reduced the shared page-hero mobile video scale to show more of the scene while preserving full-screen coverage.
- Added project memory size guidance: keep core Markdown files around 250-350 lines, trimming old detail into concise summaries.
- Added `assets/site-hero.js` to test extending the homepage MP4 treatment across non-home pages in English and Spanish, with page intro text overlaid on the video and content continuing below on solid sections.
- Added cache-busting to every `assets/site-hero.js` script link.
- Unified Spanish Contact and Case Studies pages with the shared four-step process rail and removed their stale inline rail scripts.
- Added `?v=20260601-rail-es` cache-busting to every `assets/rail.js` script link across English and Spanish pages.
- Updated `services.html` and `es/services.html` so visitors first see three plain-language service paths: website/online help, local in-person tech setup, and business app/portal.
- Fixed desktop Services dropdown heading icons by strengthening `assets/nav.css`, adding explicit `services-nav-heading-icon` classes, and cache-busting `nav.css` links across English and Spanish pages.
- Added a full Latin American Spanish version of the site as a parallel `es/` mirror (16 pages: 6 top-level + 10 service pages), each an exact translated copy of its English desktop + mobile layouts.
- Added an `EN / ES` language toggle to the desktop nav and mobile header of every page.
- Added first-visit browser-language auto-detection (Spanish browsers are sent to `es/`) with the explicit choice remembered in `localStorage` (`dm_lang`).
- Made `assets/rail.js` bilingual (Spanish process-rail popover text selected via `<html lang="es">`).
- Added `hreflang` (`en` / `es` / `x-default`) alternates to all pages.
- Translated the Netlify contact form labels/placeholders/validation/status messages while keeping form `name`/`value` submission attributes unchanged.
- Added `project-docs/I18N.md` documenting the glossary, switch mechanism, and asset-path rules.

## 2026-06-01

- Added Services dropdown grouping for Online Services and In-Home & Office Services.
- Added `services/in-home-services.html` for local in-home and on-site tech setup.
- Added `services/office-network-setup.html` for small office Wi-Fi, workstation, printer, and network setup.
- Updated homepage and services page to advertise online and on-site services.
- Updated `assets/rail.js` so local service pages map to the Maintain process step and removed visible step-label encoding artifacts.
- Created persistent project memory system under `project-docs/`.
- Added root `AGENTS.md` so future coding agents can discover the startup and shutdown memory protocol.
- Added `CLIENTS.md` for future client website operations tracking.
- Added feature documentation for Custom Business Web Apps and Website Care Plans.
- Added meeting/session notes for 2026-06-01.
- Documented current architecture, decisions, active status, and future tasks.
- Recently updated site positioning from Custom Development to Custom Business Web Apps.
- Recently added Team Help Desk support tier at `$1,500+/mo`.
- Recently standardized the floating process rail to four steps: Design, Build, Launch, Maintain.
