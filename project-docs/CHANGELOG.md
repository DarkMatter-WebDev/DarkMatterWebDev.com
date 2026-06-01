# Changelog

## 2026-06-01 (Spanish site)

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
