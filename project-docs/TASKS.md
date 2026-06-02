# Tasks

## Backlog

- Review service page copy for consistency after the Custom Business Web Apps positioning update.
- Add confirmed production deployment details when available.
- Add real client entries to `project-docs/CLIENTS.md` when client data is confirmed.
- Consider a dedicated custom web app pricing section or estimate range.
- Define local/on-site service pricing, travel area, and minimum visit policy.
- Decide whether In-Home Tech Services should include residential support, business-only home offices, or both.
- Review mobile layouts for each top-level page and service page.
- After deployment, confirm Netlify detects `website-preferences` submissions from the Website Preference Builder and sends the configured email notification.
- Periodically trim project memory docs when core files approach 250-350 lines, keeping current state and recent history.
- Document any future app authentication, database, and API choices in `ARCHITECTURE.md`.
- Have a native Spanish speaker review flagged translation choices (e.g., "Iguala mensual de soporte" for retainer, "joyería de patrimonio", quotation-mark style « » vs " ").
- When adding any new page or editing copy, create/update the matching `es/` mirror per `project-docs/I18N.md`.

## In Progress

- Maintain project memory files as part of every meaningful work session.

## Completed

- Created `project-docs/` memory framework.
- Added root `AGENTS.md` to point future agents to the memory files.
- Created project overview, current status, architecture, decisions, tasks, changelog, client tracker, feature notes, and meeting notes.
- Added Custom Business Web Apps messaging to the site.
- Added premium Team Help Desk support tier.
- Standardized the floating process rail to four steps.
- Fixed visible encoding artifacts found during recent page review.
- Added grouped Online Services / In-Home & Office Services navigation.
- Added In-Home Tech Services and Office Network Setup pages.
- Built the full Spanish (`es/`) site mirror with language switcher, browser auto-detect, bilingual rail.js, hreflang alternates, and the `I18N.md` spec.
- Fixed the Spanish homepage hero headline clipping on desktop (allowed balanced wrapping + trimmed the font-size clamp in `es/index.html`).
- Fixed desktop Services dropdown heading icon styling and cache-busted `assets/nav.css` across English and Spanish pages.
- Added a three-choice Services page gateway for website/online help, in-person tech setup, and business app/portal paths.
- Unified Contact and Case Studies onto the shared four-step process rail and cache-busted `assets/rail.js` across the site.
- Added shared black-hole MP4 hero treatment to non-home pages with `assets/site-hero.js`.
- Tuned and matched English/Spanish mobile homepage MP4 hero framing to show more of the black-hole scene while maintaining full-bleed coverage.
- Rebalanced Spanish desktop homepage hero spacing so the black-hole video height/position matches the English homepage more closely.
- Moved the mobile tab bar to the top, slimmed it down, removed the visible hamburger dropdown, and added the Services popout menu.
- Updated Spanish portfolio navigation/page labels to use "Nuestro portafolio".
- Redesigned the desktop homepage WhatsApp update card with a branded WhatsApp logo/message visual.
- Added the first-pass Website Preference Builder in English and Spanish and linked it from Services / Custom Business Web Apps.
- Converted the Website Preference Builder into a Netlify Forms intake flow with synced hidden preference fields, contact fields, and AJAX submission in English and Spanish.
