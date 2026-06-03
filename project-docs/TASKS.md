# Tasks

## Backlog

- Review service page copy for consistency after the Custom Business Web Apps positioning update.
- Add confirmed production deployment details when available.
- Add real client entries to `project-docs/CLIENTS.md` when client data is confirmed.
- Consider a dedicated custom web app pricing section or estimate range.
- Define local/on-site service pricing, travel area, and minimum visit policy.
- Decide whether In-Home Tech Services should include residential support, business-only home offices, or both.
- Review mobile layouts for each top-level page and service page.
- Review expanded Website Care Plan package-detail copy for final pricing, annual discount language, support boundaries, and wording.
- After deployment, confirm Netlify detects `website-preferences` submissions from the Website Preference Builder and sends the configured email notification.
- Periodically trim project memory docs when core files approach 250-350 lines, keeping current state and recent history.
- Document any future app authentication, database, and API choices in `ARCHITECTURE.md`.
- Have a native Spanish speaker review flagged translation choices (e.g., "Iguala mensual de soporte" for retainer, "joyería de patrimonio", quotation-mark style « » vs " ").
- When adding any new page or editing copy, create/update the matching `es/` mirror per `project-docs/I18N.md`.
- Plan a staged migration from hand-authored static HTML to Astro-generated static HTML with shared layouts, components, and structured bilingual content.
- Add a poster image and documented loading rules for the optimized homepage hero MP4s.
- Move repeated navigation, Services dropdown, footer, language switcher, process rail markup, service data, and care-plan data into reusable sources during the future Astro migration.
- Delete or move imported client source folders such as `naplesestatejewelry/` and `jpsurette/` before running the full recursive static-site validator as a final deploy check.
- Update the JPS Surette case study from in-progress to final/live-complete once the project is approved.

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
- Tested a shared black-hole MP4 hero treatment on non-home pages with `assets/site-hero.js`, then superseded it with homepage-only video loading.
- Tuned and matched English/Spanish mobile homepage MP4 hero framing to show more of the black-hole scene while maintaining full-bleed coverage.
- Rebalanced Spanish desktop homepage hero spacing so the black-hole video height/position matches the English homepage more closely.
- Moved the mobile tab bar to the top, slimmed it down, removed the visible hamburger dropdown, and added the Services popout menu.
- Updated Spanish portfolio navigation/page labels to use "Nuestro portafolio".
- Redesigned the desktop homepage WhatsApp update card with a branded WhatsApp logo/message visual.
- Added the first-pass Website Preference Builder in English and Spanish and linked it from Services / Custom Business Web Apps.
- Converted the Website Preference Builder into a Netlify Forms intake flow with synced hidden preference fields, contact fields, and AJAX submission in English and Spanish.
- Added the four-step process rail to the Website Preference Builder and optimized rail active-state/link behavior across English and Spanish pages.
- Swept and fixed Spanish-site mojibake/character rendering artifacts across page copy, service dropdowns, and the shared process rail.
- Renamed the service label to Consultation / Consulta across both language versions and reframed the page as strategic business technology consulting.
- Optimized the Website Preference Builder for mobile by removing the heavy MP4 hero download below tablet width, deferring the Tailwind CDN compiler, and adding a visible loading overlay while keeping the form available.
- Added desktop spacing to the Website Preference Builder so the floating process rail no longer blocks the Visual Preferences section.
- Smoothed and slowed the Services dropdown/menu animations across desktop and mobile.
- Updated the top-right project CTA wording to Contact Us / Contáctanos and added `darkmatterwebsites@gmail.com` to site contact areas in English and Spanish.
- Added AI-era positioning copy to English and Spanish website design, hosting, management, and care-plan messaging.
- Added `project-docs/STRUCTURE_RECOMMENDATIONS.md` with a full site-structure audit and recommended staged migration path.
- Added `scripts/validate-site.ps1` to check old email strings, mojibake markers, broken internal links, missing same-page anchors, missing English/Spanish page pairs, and non-clickable email mentions.
- Turned Website Care Plan package tiles into jump links with matching detail sections in English and Spanish, plus stronger tinted card styling.
- Expanded Website Care Plan detail panels with month-to-month/yearly prices, richer inclusions, best-fit guidance, mobile pricing cues, and distinct visual accents for each tier.
- Simplified the Website Care Plans page opening in English and Spanish by removing the extra hero/decision-box sections.
- Matched Website Care Plan preview tile colors to the corresponding detailed tier sections in English and Spanish.
- Normalized Contact Us / Contáctanos CTA wording across English and Spanish pages.
- Tightened Case Studies / Nuestro portafolio intro-to-gallery spacing in English and Spanish.
- Wired optimized 1080p desktop and 720p mobile homepage hero MP4 files into English and Spanish homepages, and removed MP4 hero loading from non-home pages.
- Updated the Website Preference Builder shell so English and Spanish versions use the standard desktop Services dropdown, mobile header/tab navigation, powered-by badge, and footer.
- Centered the desktop main navigation consistently across English and Spanish pages with shared nav CSS.
- Added a compressed cosmic-web WebP background treatment to non-home English and Spanish pages while keeping the homepage MP4-only.
- Added distinct cosmic-web tint themes to each English and Spanish service subpage.
- Completed a no-quality-loss media sweep and losslessly optimized safe PNG-format portfolio screenshots.
- Linked the homepage WhatsApp update card to the Process page and added the dedicated WhatsApp update-queue explanation in English and Spanish.
- Standardized the Built By referral page navigation across English and Spanish.
- Rebranded the Naples case study to Naples Estate Jewelry in English and Spanish.
- Replaced the old Naples portfolio screenshots with three lightweight WebP captures from the imported Naples Estate Jewelry project.
- Removed the old unused `assets/naples-hero.png`, `assets/naples-pricing.png`, and `assets/naples-product.png` files.
- Added JPS Surette Photography as the third portfolio/case-study entry in English and Spanish.
- Wired the JPS Surette case study live-preview link to `https://jpsurette.netlify.app/` and marked the case study as in progress with progress bars.
- Added tall full-page mini previews to the JPS Surette and Naples Estate Jewelry case-study detail sections.
- Updated Case Studies project labels to domain-style website names and restyled all full-page mini previews as borderless floating screenshots.
- Split Portfolio project details into dedicated English and Spanish pages with summary-page buttons linking to the deeper project views.
- Added prominent green live-site CTAs to each Portfolio project detail page in English and Spanish.
- Added the animated colorful power-up loading panel and longer reveal timing to `jpsurette.html`.
- Added sitewide favicon, app icon, manifest, and link-preview Open Graph/Twitter metadata.
