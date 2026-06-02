# Current Status

Last updated: 2026-06-01

## Currently Working

- Static website pages are present for homepage, services, process, case studies, contact, and referral landing page.
- Individual service pages exist under `services/`.
- Netlify form markup is present on `contact.html`.
- Shared floating process rail is driven by `assets/rail.js`.
- The floating rail has been standardized to four steps: Design, Build, Launch, Maintain.
- The shared process rail is now used on Contact and Case Studies too; all rail script links are cache-busted with `?v=20260601-rail-es`.
- Shared page hero treatment is driven by `assets/site-hero.js`, which extends the homepage black-hole MP4 hero style across non-home pages.
- Custom Business Web Apps messaging is now part of the service offering.
- Website Care Plans include a premium Team Help Desk tier.
- Service navigation is grouped into Online Services and In-Home & Office Services.
- Mobile top-level pages use a slim top tab bar; the Services tab opens a grouped Web & Online / In-Home & Office service popout.
- In-Home Tech Services and Office Network Setup pages are live in `services/`.
- The main Services page now opens with a simple three-choice gateway: website/online help, in-person tech setup, and business app/portal.
- A full Latin American Spanish version of every page exists under `es/` (and `es/services/`), switchable via an `EN / ES` toggle plus first-visit browser-language auto-detect (choice remembered in `localStorage`).
- `assets/rail.js` is bilingual; translation/switch spec lives in `project-docs/I18N.md`.
- Local preview has been used at `http://127.0.0.1:4173/` (note: a stale preview server may already hold port 4173 — use an alternate port such as 4188 if new pages 404).

## Recently Completed

- Repositioned "Custom Development" as "Custom Business Web Apps."
- Added app-style language around logins, customer records, dashboards, reports, API connections, automations, role-based access, admin tools, and ongoing support.
- Added a premium Team Help Desk care plan at `$1,500+/mo`.
- Expanded the custom web app service page with visual mockups for dashboards, automations, and admin access.
- Fixed mojibake/encoding artifacts in visible page copy.
- Converted the sitewide process rail from six steps to four steps.
- Created this project memory system in Markdown.
- Added a local on-site services category for in-home tech setup and office networking.
- Built the Spanish (`es/`) mirror of the entire site with a language switcher, auto-detect, bilingual rail, and hreflang alternates.
- Fixed desktop Services dropdown heading icons so they render cyan, centered, and consistently sized on deployed/cached browsers.
- Added a prominent Services page category chooser on desktop and mobile, mirrored in Spanish.
- Fixed Spanish process-rail deployment risk by removing stale inline rail scripts from Contact/Case Studies and versioning `assets/rail.js` across English and Spanish pages.
- Added a shared MP4 video hero system across English and Spanish top-level/service pages, using the existing `assets/hero-black-hole.mp4`.
- Tuned mobile homepage hero video framing so English and Spanish use the same slightly zoomed-out MP4 scale while still filling the viewport.
- Adjusted the Spanish desktop homepage hero headline size so the longer Spanish copy no longer pushes the black-hole video stage lower than the English layout.
- Updated Spanish portfolio/page navigation wording from "Casos de Éxito" / "Portafolio" to "Nuestro portafolio" for consistency.
- Redesigned and streamlined the desktop homepage WhatsApp update visual with a smaller WhatsApp logo/message card and automatic update-queue language in English and Spanish.
- Fixed the shared floating process rail so the Process overview page does not incorrectly highlight the Launch step; launch-related service pages still highlight Launch.
- Updated the homepage hero pill copy to position Dark Matter as "Your Complete IT Solution" in English and Spanish.
- Added a first-pass Website Preference Builder page in English and Spanish, connected lightly from Services and Custom Business Web Apps.
- Refined the Website Preference Builder into a simpler vertical step-by-step flow with more consistent visual preference swatches.
- Changed the Website Preference Builder top summary card into a progress/status panel and moved the submit design to a bottom review panel.
- Connected the floating process rail Design step to the Website Preference Builder, while keeping Build routed to Custom Business Web Apps.
- Converted the Website Preference Builder into a real Netlify-detected form in English and Spanish, with hidden selection fields, contact fields, and URL-encoded AJAX submission.
- Reframed the Website Preference Builder as a free website mockup request page with a 48-hour follow-up promise and a visually live submit button.

## Current Priorities

- Keep service messaging consistent across homepage, services index, care plans, and individual service pages.
- Clarify how local/on-site service pricing, travel area, and support boundaries should work.
- Continue improving conversion clarity for business owners who may need custom web apps.
- Maintain consistency between desktop and mobile versions of each page.
- Keep the English and Spanish (`es/`) versions in sync: any content change to an English page must be mirrored in its `es/` counterpart (and vice versa), following `project-docs/I18N.md`.
- Watch for browser cache differences after shared CSS/JS changes; shared `nav.css`, `rail.js`, `site-hero.js`, and `mobile-services-nav.js` links now use cache-busting query strings.
- Preserve all meaningful project decisions and status updates in `project-docs/`.
- Keep memory docs concise; trim core Markdown files around 250-350 lines while preserving current decisions, architecture, tasks, and recent meaningful history.

## Active Blockers

- No active blocker documented.
- Git was previously unavailable in the shell environment, so repository status/commits may need to be checked from another environment if needed.

## Next Recommended Actions

- Review all service pages in the browser for mobile and desktop polish.
- Verify the Website Preference Builder appears as `website-preferences` in Netlify after deployment and that the existing form notification sends submissions to the configured email.
- Consider adding a fuller pricing/package explanation for custom business web apps.
- Consider documenting real client/project entries in `project-docs/CLIENTS.md` as they are confirmed.
- Consider adding starting prices or "request estimate" framing for in-home and office setup visits.
- If the site is deployed, record the production URL and Netlify site name in `PROJECT_OVERVIEW.md` and `CLIENTS.md`.
