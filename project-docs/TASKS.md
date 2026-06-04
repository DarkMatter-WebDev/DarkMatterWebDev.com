# Tasks

Last updated: 2026-06-04

## Backlog

- Keep English and Spanish pages mirrored after every content, navigation, or layout change.
- Review all service pages for final mobile/desktop polish.
- Review Website Care Plan pricing, annual discount language, support boundaries, and legal wording.
- Add production deployment details when the live domain and Netlify site name are confirmed.
- Add real client entries to `project-docs/CLIENTS.md` when operational details are confirmed.
- Define local/on-site service pricing, travel area, minimum visit policy, and residential vs business scope.
- Add clearer starting prices or estimate language for in-home and office setup visits.
- Add a dedicated custom business web app pricing/estimate section.
- Keep the Auction House & Consignment Store Software listing and screenshots current with the hosted `https://auctionconsignmentapp.netlify.app/` app.
- Add a real hosted demo, screenshots, or downloadable package for the Secondhand Dealer Management System (SDMS) listing when product assets exist.
- Decide whether hidden `jpsurette.html` should stay English-only, get an `es/` mirror, or be added as a validator exception.
- Update the JPS Surette case study from in-progress to final/live-complete once approved.
- Add approved Google Ads portfolio examples, screenshots, or campaign summaries when Sean has public work cleared.
- Have a native Spanish speaker review translation choices before a major public launch.
- Add a poster image and documented loading rules for the optimized homepage hero MP4s.
- Plan a staged migration from hand-authored static HTML to Astro-generated static HTML with shared layouts, components, and structured bilingual content.

## Client Portal / Supabase Backlog

- Run `supabase/client-portal-schema.sql` in Supabase SQL editor.
- Configure Supabase Auth redirect URLs and email templates for `/account.html`, `/es/account.html`, `account-created.html`, and `es/account-created.html`.
- Create test users plus matching rows in `client_profiles`, `client_services`, `client_billing`, `client_website_status`, and `client_website_stats`.
- Verify Row Level Security policies restrict reads to `user_id = auth.uid()`.
- Decide whether public signups should require manual approval/client-row linking.
- Confirm Netlify detects the `client-request` form after deployment and sends notifications correctly.
- Decide whether first traffic summaries come from Netlify Web Analytics, Google Analytics, Search Console, Plausible, or manual/admin updates.
- Add a secure Netlify Function or equivalent backend endpoint for Stripe Customer Portal sessions before enabling recurring billing management.
- Build out the placeholder account settings/preferences workflow.
- Build out the placeholder Google Ads activity/status workflow with real campaign/client data.

## In Progress

- Maintain project memory files as part of every meaningful work session.

## Recently Completed

- Recorded Sean's Ads as an intentional navigation exception: keep its own Google Ads co-branded menu/header format rather than applying the Dark Matter homepage navigation to those pages.
- Added Open Graph/Twitter preview image metadata for `darkmatterwebsites.com` to the Apps gallery and full app profile pages in English and Spanish.
- Added a `Customize Yours Now` / `Personaliza la tuya ahora` CTA button to the Apps page customization/language banner, linking to Contact in English and Spanish.
- Renamed the Dark Matter app-library files from `downloads.html` / `es/downloads.html` to `apps.html` / `es/apps.html`, updated internal links and metadata, preserved app-card hash anchors, and added Netlify redirects from the old Downloads URLs.
- Simplified the Apps page into a gallery-only preview page, removed the lower detail sections, linked app tiles directly to full profile pages, and added a custom business/language banner in English and Spanish.
- Added the powered-by Dark Matter banner and footer shell to the Apps page plus the Auction House & Consignment Store Software and SDMS full profile pages in English and Spanish.
- Added tag printing and on-the-fly tag/template customization details to the Auction House & Consignment Store Software listing and full profile pages in English and Spanish.
- Added language/localization customization messaging to the Auction House & Consignment Store Software full profile pages in English and Spanish.
- Added full Auction House & Consignment Store Software profile pages in English and Spanish, linked app-flow screenshot cards to profile anchors, renamed the auction CTA to `Open full app profile`, and changed the demo CTA to `Request live app demo`.
- Linked the Auction House & Consignment Store Software listing to the live hosted app, added cropped app-flow screenshots, refreshed features, and added full customization messaging.
- Added a back-to-Sean's-Google-Ads link to the source-triggered account portal banner and compacted the unauthenticated portal intro/wormhole block on mobile.
- Swept the project for legitimate question marks removed during earlier Spanish artifact cleanup, restoring clear Spanish and matching English question punctuation and correcting malformed `textárea` tags.
- Ran a second English-focused punctuation sweep and restored missing question marks on the Dark Matter Built By and Contact page copy.
- Updated the SDMS full profile pages so their top navigation includes the full Dark Matter homepage-style menu/button set in English and Spanish.
- Added Secondhand Dealer Management System (SDMS) as the second Dark Matter Apps listing in English and Spanish, including a gallery tile, lower detail section, and dedicated full profile pages.
- Reworked the Dark Matter Apps pages into a compact gallery-first layout with app tiles that jump to detailed sections below, mirrored in English and Spanish.
- Renamed the Dark Matter `apps.html` / `es/apps.html` page-facing title/metadata/hero labels from Downloads/Descargas to Apps while keeping file URLs unchanged.
- Changed the Dark Matter main navigation label from `Downloads` / `Descargas` to `Apps` across English and Spanish desktop/mobile menus.
- Unified Sean's Ads header action bars across all English and Spanish mini-site pages so every page matches the homepage top-button format.
- Routed Sean's Ads top-right `Contact Us` / `Contáctanos` header buttons to the local Contact Sean page across English and Spanish mini-site pages.
- Doubled the Sean's Ads header service-name text size across English/Spanish homepage, contact pages, and shared detail pages while keeping the Google `G` mark size unchanged.
- Added Sean's portrait as the small icon on the Sean's Ads homepage `About Sean Cochrane` card in English and Spanish.
- Replaced the Sean's Ads header brand badge with a multicolor Google `G` SVG across all English and Spanish mini-site pages while keeping the existing logo size.
- Made the Sean's Ads contact page mobile hero, Call/Text card, and Email card much smaller in English and Spanish.
- Added a source-triggered green Google Ads console notifier on the English and Spanish account portal that only appears for visitors coming from Sean's Ads.
- Translated remaining Spanish Sean's Ads UI labels, including homepage portal/contact CTAs, subpage contact CTAs, co-branding line, language-toggle aria labels, and related Spanish accent polish.
- Tightened the Sean's Ads to Dark Matter portal handoff by adding `?source=seansads` to Sean's Ads portal/contact/pricing links, clarifying pricing CTAs, adding an account-portal handoff note, and sweeping Spanish pages for visible question-mark/mojibake artifacts.
- Added periodic blog/content publishing hooks to Dark Matter Website Care Plan tiers in English and Spanish, including homepage, Services-page summaries, and detailed care-plan pages.
- Updated Dark Matter and Sean's Ads cross-domain links for the live separate `https://seansads.com/` deployment, including English/Spanish account, Services, SEO Foundations, Portfolio, mini-site Dark Matter return links, favicon, and social preview image paths.
- Normalized Dark Matter menu rendering across English and Spanish pages, including Downloads, by adding the missing theme config to Downloads pages, forcing shared desktop nav gap/CTA sizing, and cache-busting `assets/nav.css`.
- Added the standard Dark Matter mobile header/top-tab menu shell to the English and Spanish Downloads pages and tightened mobile content/card edge spacing for consistency.
- Leveled the Downloads/Descargas navigation item by normalizing shared mobile tab icon spacing, covering the Downloads page mobile-nav markup, and cache-busting `assets/nav.css` across the site.
- Added a skinny/tall portrait mobile rule on the Dark Matter homepage hero video in English and Spanish so the video zooms out only slightly while staying in cover mode.
- Applied the compact mobile button/header treatment across Sean's Google Ads subpages, including shared detail pages and contact pages, so language/contact/back-home controls are much smaller.
- Greatly compacted the Sean's Google Ads homepage mobile top action controls in English and Spanish so other services, portal login, language switcher, and contact fit in one short row.
- Added a Dark Matter Downloads area in English and Spanish, placed `Downloads` / `Descargas` directly after Services in the main menu, and listed Auction House & Consignment Store Complete Management Software as the first request-access app.
- Tightened Sean's Google Ads mobile typography, buttons, gutters, and contact header behavior; added a mobile-only draggable grid-orb control for touch interaction with the background.
- Added SeansAds.com as the fourth Dark Matter Portfolio project in English and Spanish, including homepage teasers, case-study summary sections, mobile cards, dedicated detail pages, and WebP preview assets.
- Fixed account/login portal form field visibility so typed text shows against the intended dark input background.
- Audited and cleaned Sean's Google Ads mini-site media assets for GitHub/Netlify upload, leaving only the used lossless portrait WebP and social preview PNG.
- Cleaned up the Sean's Google Ads portfolio card copy around the Naples Estate Jewelry profile in English and Spanish.
- Added Naples Estate Jewelry & Antiques as the first Sean's Google Ads portfolio research profile, with honest SEO benchmark ranges pending verified analytics.
- Added a Covenant Jewelry Buyers public-data research brief and Google Ads campaign-structure notes to Sean's Google Ads portfolio in English and Spanish.
- Rebuilt the main Dark Matter social/share preview image with a modern logo-led design and updated sitewide metadata to use it.
- Added Sean's Google Ads social/share preview image metadata across the standalone English and Spanish mini-site for Netlify launch.
- Stylized the Dark Matter wordmark on the account login portal card in English and Spanish.
- Linked the main SEO Foundations cards/checklists and foundation-map visual blocks to the account login in English and Spanish.
- Replaced Sean Cochrane's About-page portrait with the supplied transparent lossless WebP cutout in English and Spanish.
- Smoothed the account/client portal wormhole core so the floating blue circle moves less and eases more naturally on hover.
- Expanded the SEO Foundations service page in English and Spanish with a visual foundation-map block before the Sean's Google Ads cross-promo.
- Added stronger hover motion to the account/client portal wormhole core and dashboard command orb, plus the `#client-contact` account request/contact anchor with a `#client-request` alias.
- Updated Sean's Google Ads mini-site co-branding from "presents" to "partnered with," routed top-right Contact Us links to the Dark Matter account dashboard contact area, and standardized mini-site portal login labels.
- Created `project-docs/HANDOFF.md` and compressed startup docs for the next agent.
- Added Google Ads ad-details/activity tracking language to the Login Portal and a Google-styled ad activity/status workspace panel with lightweight English/Spanish placeholder pages.
- Added a second row of logged-in account dashboard action cards for site preferences, Sean's Google Ads, and next-upgrade planning.
- Created lightweight English/Spanish account settings placeholder pages.
- Added an optimized WebP portrait and styled bio card to Sean Cochrane's Google Ads About page in English and Spanish.
- Expanded Sean Cochrane's Google Ads About page bio in English and Spanish.
- Reframed the Dark Matter account login screen as a Login Portal / client wormhole with animated spacetime visuals.
- Expanded the logged-in account dashboard into a full-width workspace with quick buttons and interactive cards.
- Routed standalone Google Ads pricing-tier CTAs to the Dark Matter account portal in English and Spanish.
- Added the standalone bilingual Google Ads mini-site with contact, About, Portfolio, focus-detail, and pricing-tier pages.
- Added first-pass Supabase-ready client portal pages, shared CSS/JS, public config, Netlify client-request form, signup modal, email confirmation pages, and starter SQL.
- Split Portfolio project details into dedicated English and Spanish project pages.
- Added JPS Surette as the third Portfolio entry and marked it in progress.
- Rebranded Naples portfolio/case-study entry to Naples Estate Jewelry and harvested optimized screenshots.
- Added sitewide favicon/app icon/manifest/Open Graph metadata.
- Wired optimized homepage MP4 files and removed MP4 hero loading from non-home pages.
- Added compressed cosmic-web background treatment for non-home pages.
- Built the full Spanish site mirror and bilingual navigation/process rail.
- Added `scripts/validate-site.ps1` as the static-site integrity check.
