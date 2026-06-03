# Current Status

Last updated: 2026-06-03

## Currently Working

- Static website pages are present for homepage, services, process, case studies, contact, and referral landing page.
- Individual service pages exist under `services/`.
- Netlify form markup is present on `contact.html`.
- Shared floating process rail is driven by `assets/rail.js`.
- The floating rail has been standardized to four steps: Design, Build, Launch, Maintain.
- The shared process rail is now used on Contact and Case Studies too; all rail script links are cache-busted with `?v=20260601-rail-es`.
- The black-hole MP4 hero is now homepage-only. English and Spanish homepages load optimized responsive video sources: `Hero-Black-Hole-desktop-1080p.mp4` and `Hero-Black-Hole-mobile-720p.mp4`.
- Non-home English and Spanish pages now load a lightweight cosmic-web background treatment from `assets/cosmic-web.css`, using the compressed local WebP asset `assets/cosmic-web-hero.webp` (1600x900, about 198 KB); individual service pages carry `cosmic-tint-*` body classes with stronger hue-rotated colorways for distinct green, blue, purple, gold, and cyan hero treatments.
- Custom Business Web Apps messaging is now part of the service offering.
- Website Care Plans include a premium Team Help Desk tier.
- Website Care Plan summary tiles link to expanded detail sections in English and Spanish, with monthly/yearly pricing, tier-specific visuals, and tinted card styling from `assets/care-plans.css`.
- Service navigation is grouped into Online Services and In-Home & Office Services.
- Mobile top-level pages use a slim top tab bar; the Services tab opens a grouped Web & Online / In-Home & Office service popout.
- In-Home Tech Services and Office Network Setup pages are live in `services/`.
- The main Services page now opens with a simple three-choice gateway: website/online help, in-person tech setup, and business app/portal.
- A full Latin American Spanish version of every page exists under `es/` (and `es/services/`), switchable via an `EN / ES` toggle plus first-visit browser-language auto-detect (choice remembered in `localStorage`).
- `assets/rail.js` is bilingual; translation/switch spec lives in `project-docs/I18N.md`.
- The floating process rail now appears on the Website Preference Builder / free mockup page in English and Spanish.
- The Website Preference Builder now uses the standard site shell: desktop Services dropdown, mobile header/language switch, mobile Services popout support, bottom mobile tabs, powered-by badge, and footer in English and Spanish.
- The homepage WhatsApp visual links to the Process page's dedicated WhatsApp update-queue section; the Maintain step now includes WhatsApp update requests in English and Spanish.
- The Built By referral page now uses the same desktop Services dropdown, language switcher, Contact CTA, mobile header, and mobile bottom navigation pattern in English and Spanish.
- The Naples case study has been rebranded from Naples Antiques LLC to Naples Estate Jewelry in English and Spanish, with new lightweight WebP screenshots captured from the imported client project under `assets/portfolio/naples-estate-jewelry/`.
- The JPS Surette Photography case study is now added in English and Spanish with lightweight WebP previews under `assets/portfolio/jpsurette/`, a live-preview link to `https://jpsurette.netlify.app/`, and an in-progress status/progress bar.
- Naples Estate Jewelry and JPS Surette case-study details now include tall miniaturized page previews so visitors can see more of the full-page design without opening the client projects.
- Case Studies now presents each project by website/domain name (`NaplesEstateJewelry.co`, `EliteYachtDetailing.com`, `JPSurette.com`) with business-type subtitles, and all three case studies use borderless floating full-page mini previews.
- The Elite Yacht and JPS desktop case-study detail sections are constrained to the same centered width as the Naples case study so their main screenshots do not stretch edge-to-edge.
- JPS in-progress accents on the Case Studies page use bright green text/borders/progress fill for better contrast than the earlier purple treatment.
- Navigation labels now use `Portfolio` in English and `Portafolio` in Spanish across the site, while the underlying page URL remains `casestudies.html`.
- Portfolio project summaries now link to separate English/Spanish detail pages for Naples Estate Jewelry, Elite Yacht Detailing, and JPS Surette, keeping the main Portfolio page lighter while preserving deeper screenshots and feature explanations on project pages.
- Each Portfolio project detail page has an animated green live-site widget near the project title in English and Spanish.
- Portfolio project detail photo/highlight cards now use colorful gradient outline treatments across Naples Estate Jewelry, Elite Yacht Detailing, and JPS Surette in English and Spanish.
- A standalone, unlinked `jpsurette.html` Easter egg page exists for direct-link preview; it starts as a 1999-style JPSurette.com photography page with extra filler/keep-scrolling copy, scroll-reveals a modern loading interlude, and routes its quiet final "Okay, just kidding" link to the JPSurette.com Portfolio detail page.
- The `jpsurette.html` loading interlude includes a longer scroll runway plus an animated colorful power-up panel with multiple progress channels and pulsing status cells.
- The English and Spanish homepages include a tiny bottom-left rainbow Easter egg link to `jpsurette.html` at the actual bottom of the page, visible only after scrolling all the way down.
- Sitewide browser/link-preview metadata is in place across live English and Spanish pages, using `assets/favicon.svg`, PNG touch/app icons, `site.webmanifest`, and the 1200x630 Open Graph image `assets/darkmatter-og-image.png`.
- `scripts/validate-site.ps1` is available for static-site integrity checks.
- Temporary full client source folders placed in the project root (for example `naplesestatejewelry/` or `jpsurette/`) are not deployable Dark Matter pages; remove them or exclude them before treating a full validator run as authoritative.
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
- Previously tested a shared MP4 video hero system across non-home pages; this has now been superseded by homepage-only video loading.
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
- Optimized process-rail active-state mapping and links: Design routes/highlights the free mockup builder and design pages; Build routes/highlights Custom Business Web Apps; Launch routes/highlights Process and launch/hosting/SEO pages; Maintain routes/highlights care and local support pages.
- Added the black-hole MP4 hero background to the free mockup / Website Preference Builder page in English and Spanish, with a distinct purple-cyan tint and the live blueprint card overlaid in the hero.
- Added a hero callout on the free mockup page pointing users to fill out the form below.
- Previously tuned page-specific MP4 hero tint themes; current production direction is homepage-only video loading.
- Swept the Spanish site and shared navigation/process text for UTF-8 mojibake artifacts so accents render correctly in dropdowns, page copy, and the floating process rail.
- Renamed the former discovery/consultation service to "Consultation" / "Consulta" across English and Spanish, and reframed the service page as strategic business technology consulting.
- Optimized the Website Preference Builder for mobile by removing its MP4 hero load, using a lightweight gradient treatment, deferring the Tailwind CDN compiler, and adding an immediate loading overlay so slow phones do not appear blank.
- Added a desktop-only left offset to the Website Preference Builder form so the floating four-step process rail no longer covers the Visual Preferences section.
- Slowed and smoothed the Services dropdown animations across desktop and mobile, then cache-busted `assets/nav.css` with `?v=20260602-menu-motion`.
- Changed the prominent top-right project CTA from "Start Project" to "Contact Us" / "Contáctanos" where it appears.
- Added `darkmatterwebsites@gmail.com` as a clickable mail contact across English and Spanish footer/contact areas, plus dedicated email cards on the Contact page.
- Added new English/Spanish service positioning that acknowledges AI tools can help with ideas, while Dark Matter provides accountable website design, hosting, maintenance, and safe updates so one fix does not create multiple new problems.
- Completed a structure audit of the current static HTML site and documented a recommended long-term migration path in `project-docs/STRUCTURE_RECOMMENDATIONS.md`.
- Added and ran `scripts/validate-site.ps1`; it currently passes with no issues found.
- Turned Website Care Plan package tiles into anchor links that jump to detailed package explanations, mirrored on mobile and Spanish pages.
- Expanded Website Care Plan detail panels with monthly/yearly pricing, clearer inclusions, best-fit guidance, support boundaries, and distinct visual accents per tier.
- Simplified the Website Care Plans page so it starts directly with "Monthly Plans / Choose your care plan" instead of the Step 04 hero and "Which service fits you?" decision boxes.
- Tightened the Website Care Plans hero spacing so pricing cards sit directly under the simplified intro.
- Matched Website Care Plan preview tile colors to their corresponding expanded detail-section accents.
- Normalized contact CTA labels sitewide so old "Schedule Consultation" / "Schedule a Consultation" / "Agenda una Consulta" button text now reads "Contact Us" / "Contáctanos" across English and Spanish pages.
- Tightened the Case Studies / Nuestro portafolio hero-to-gallery spacing in English and Spanish.
- Wired in the optimized desktop/mobile homepage hero MP4 files and removed MP4 hero loading from non-home English and Spanish pages.
- Updated the Website Preference Builder to inherit the broader site navigation/footer layout in English and Spanish.
- Centered the desktop main navigation consistently across pages by updating shared nav CSS and cache-busting all nav stylesheet links.
- Added a compressed ESA/Hubble cosmic-web WebP background to non-home pages across English and Spanish, while keeping homepage video loading untouched.
- Strengthened the service-page cosmic-web tint system so the web texture itself shifts color instead of relying only on subtle glow overlays.
- Completed a media compression sweep under a strict no-quality-loss rule: videos and lossy JPEG/WebP assets were left unchanged, while safe PNG assets were optimized losslessly with pixel-identical verification.
- Connected the homepage WhatsApp update card to a new Process page section explaining the dedicated client WhatsApp account and automatic update queue.
- Updated `built-by.html` and `es/built-by.html` so the referral landing page navigation matches the rest of the site.
- Harvested the Naples Estate Jewelry client project for three optimized portfolio screenshots, updated the English/Spanish homepage portfolio teasers and Case Studies sections, aligned the visible case-study domain to `naplesestatejewelry.com`, and removed the old unused `assets/naples-*.png` screenshots.
- Added JPS Surette Photography as a third English/Spanish portfolio and case-study entry, including homepage teasers, case-study detail sections, visual highlight screenshots, tall page previews, Netlify live-preview link, and an in-progress progress bar.
- Added tall full-page mini previews to the Naples Estate Jewelry case study using captured `home-tall.webp` and `shop-tall.webp` assets.
- Updated the Case Studies page presentation so project titles use website/domain names, added business-type subtitles, added Elite full-page mini previews, and removed the black card/frame around tall mini previews in English and Spanish.
- Matched the Elite Yacht and JPS case-study detail widths to the narrower Naples layout in English and Spanish.
- Switched JPS in-progress labels, status pills, and progress bars from purple to high-contrast green in English and Spanish.
- Updated sitewide top-menu labels from Case Studies / Nuestro portafolio to Portfolio / Portafolio without renaming the `casestudies.html` page.
- Split detailed Portfolio project content into dedicated English and Spanish project pages and changed summary buttons to "See more details about this project" / "Ver más detalles de este proyecto."
- Replaced the plain green Portfolio live-site buttons with animated live-site widgets using shared `assets/portfolio-live-widget.css`.
- Expanded `jpsurette.html` with more retro filler copy, keep-scrolling prompts, and a subtler final "Okay, just kidding. Here's the real project." link to the JPSurette.com detail page.
- Softened the early `jpsurette.html` copy so it reads like a sincere rough website draft while preserving the final "Okay, just kidding" reveal.
- Shifted `jpsurette.html` styling/copy toward a rough basic WordPress-style first draft while preserving the same long scroll structure and reveal timing.
- Added large "Your picture here" draft placeholders to `jpsurette.html` so the rough draft requires more scrolling before the reveal.
- Added an animated standalone "wait a second..." pause stage before the main modern loading block on `jpsurette.html`.
- Smoothed the `jpsurette.html` visual transition from the gray rough-draft section into the modern blue-green loading reveal with a longer gradient fade.
- Removed the experimental handoff illustration from `jpsurette.html`; the final "Okay, just kidding" project link is clean by itself again.
- Added colorful gradient outline treatments to Portfolio detail-page photo/highlight cards across all three projects and both language versions.
- Changed the homepage rainbow Easter egg from a floating fixed dot to a normal bottom-of-page link so it only appears after scrolling to the very end.
- Swept Spanish Portfolio pages for literal question-mark accent artifacts and corrected the remaining project-detail copy/footer issues.

## Current Priorities

- Treat the current site as stable static output, but reduce long-term maintenance risk by moving toward reusable layouts/components and structured bilingual content.
- Keep service messaging consistent across homepage, services index, care plans, and individual service pages.
- Clarify how local/on-site service pricing, travel area, and support boundaries should work.
- Continue improving conversion clarity for business owners who may need custom web apps.
- Maintain consistency between desktop and mobile versions of each page.
- Keep the English and Spanish (`es/`) versions in sync: any content change to an English page must be mirrored in its `es/` counterpart (and vice versa), following `project-docs/I18N.md`.
- Preserve all Spanish content as UTF-8 and re-scan for mojibake markers (`Ã`, `Â`, `â`, `�`) after bulk translation or copy updates.
- Watch for browser cache differences after shared CSS/JS changes; shared `nav.css`, `rail.js`, and `mobile-services-nav.js` links use cache-busting query strings.
- Preserve all meaningful project decisions and status updates in `project-docs/`.
- Keep memory docs concise; trim core Markdown files around 250-350 lines while preserving current decisions, architecture, tasks, and recent meaningful history.

## Active Blockers

- No active blocker documented.
- Git was previously unavailable in the shell environment, so repository status/commits may need to be checked from another environment if needed.

## Next Recommended Actions

- Review all service pages in the browser for mobile and desktop polish.
- Review the expanded Website Care Plan package-detail copy for final pricing, annual discount language, and legal/support boundaries.
- Verify the Website Preference Builder appears as `website-preferences` in Netlify after deployment and that the existing form notification sends submissions to the configured email.
- Keep watching Website Preference Builder mobile performance; the form stays active on mobile and no longer loads a page-hero MP4, but the page still relies on Tailwind's CDN compiler until the site gets a production CSS build step.
- Run `scripts/validate-site.ps1` after broad HTML/CSS/JS edits and before migration work.
- Delete or move temporary imported client source folders from the project root before relying on a full-site validator run.
- Consider migrating the marketing site to Astro static output after validation is in place; reserve React/Next-style app architecture for future authenticated dashboards, portals, and business apps.
- Consider adding a fuller pricing/package explanation for custom business web apps.
- Finalize the JPS Surette case study status/copy once the project is no longer in progress.
- Consider documenting real client/project entries in `project-docs/CLIENTS.md` as they are confirmed.
- Consider adding starting prices or "request estimate" framing for in-home and office setup visits.
- If the site is deployed, record the production URL and Netlify site name in `PROJECT_OVERVIEW.md` and `CLIENTS.md`.
