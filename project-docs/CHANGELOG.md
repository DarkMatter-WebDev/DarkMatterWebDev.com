# Changelog

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
- Added `assets/site-hero.js` to extend the homepage `hero-black-hole.mp4` treatment across non-home pages in English and Spanish, with page intro text overlaid on the video and content continuing below on solid sections.
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
