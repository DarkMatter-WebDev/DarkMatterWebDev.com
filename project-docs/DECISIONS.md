# Decisions

## 2026-06-04

Decision:
Add Downloads as a top-level Dark Matter navigation item directly after Services.

Reason:
Dark Matter is beginning to publish created web apps as downloadable/request-access products, and Services is the natural adjacent category for users looking for offerings. The first listing is request-access/coming-soon because no verified package file is present in the repo yet.

Alternatives Considered:
- Put Downloads under the Services dropdown only.
- Link directly to a nonexistent installer/download file.
- Wait to add the page until the first package is uploaded.

## 2026-06-04

Decision:
List SeansAds.com in the Dark Matter Portfolio as a launch-ready project, not as a live public site, until the final domain and Netlify deployment are connected.

Reason:
The standalone Sean's Google Ads mini-site is built and previewable locally, but the production SeansAds.com launch has not been verified in this workspace. "Launch ready" keeps the portfolio accurate while still showing the project as a finished Dark Matter build.

Alternatives Considered:
- Mark it as live and link directly to `https://SeansAds.com`.
- Leave it out of the public Portfolio until the domain is connected.
- Treat it only as an internal Sean's Google Ads cross-promo rather than a Dark Matter project.

## 2026-06-03

Decision:
Begin the client account area with Supabase Auth and Supabase tables while keeping the marketing site static.

Reason:
Supabase gives Dark Matter a managed login layer, hosted database, magic links, email/password auth, and Row Level Security without forcing the whole marketing site into a full application framework immediately. It fits the current Netlify/static workflow and can later support client services, support coverage, billing summaries, and client workspace features.

Alternatives Considered:
- Firebase Auth / Firestore
- Custom authentication
- Waiting for an Astro/React migration before adding login
- Keeping client account information manual/offline for now

## 2026-06-02

Decision:
Use a local compressed WebP version of ESA/Hubble's "The Cosmic Web (Artist's Impression)" as the shared visual background for non-home pages.

Reason:
It reinforces the Dark Matter brand with an actual cosmic-web/dark-matter visual while avoiding heavy MP4 loading on every page. Keeping the file local prevents hotlinking and gives predictable performance.

Alternatives Considered:
- Keep non-home pages as plain grid/black backgrounds.
- Reuse the homepage black-hole MP4 on all pages.
- Use a remote image URL instead of a local optimized asset.

## 2026-06-01

Decision:
Use Markdown files under `project-docs/` as the project's persistent memory system, with `CLIENTS.md` for client operations and `HANDOFF.md` for quick context transfer.

Reason:
Markdown is lightweight, human-readable, AI-readable, and can be kept with the website source. The handoff file prevents future agents from digging through long chat history.

Alternatives Considered:
- Keeping context only in chat history.
- Adding a heavier project management tool.
- Using scattered notes outside the repository.

## 2026-06-01

Decision:
Ship the Spanish site as a parallel set of fully translated static pages under `es/`, mirroring filenames, instead of using a JavaScript in-place string swap.

Reason:
It matches the hand-authored static architecture, gives real Spanish URLs, improves SEO/sharing via `hreflang`, works without JavaScript, and keeps each language independently editable. Target dialect is neutral Latin American Spanish.

Alternatives Considered:
- Single set of files with a JavaScript i18n dictionary.
- Server/build-time templating.

## 2026-06-01

Decision:
Default to English, auto-detect Spanish browsers on first visit, and remember explicit language choice in `localStorage` (`dm_lang`).

Reason:
Most canonical URLs are English-first, but Spanish-speaking visitors can land on the Spanish mirror automatically. Manual EN/ES toggle always wins and persists.

Alternatives Considered:
- Manual toggle only.
- Auto-detect with no persistence.

## 2026-06-01

Decision:
Use "Nuestro portafolio" as the Spanish label for the portfolio/case-study area.

Reason:
It sounds warmer and clearer than "Casos de Éxito" for older or less technical clients while still pointing visitors to completed work.

Alternatives Considered:
- Casos de Éxito
- Portafolio

## 2026-06-01

Decision:
Position the advanced custom offering as "Custom Business Web Apps."

Reason:
This wording is clearer for business owners than generic "custom development" and better describes private tools with logins, dashboards, records, reports, automations, and admin access.

Alternatives Considered:
- Custom Development
- Business App
- Web App
- Client Portal

## 2026-06-01

Decision:
Add a premium Team Help Desk tier at `$1,500+/mo`.

Reason:
Supporting an entire business team, individual user accounts, and app users is significantly more involved than basic website updates and should be priced as premium operational support.

Alternatives Considered:
- Include help desk support inside lower care plans.
- Price support only as hourly work.
- Avoid publishing the tier until custom web apps launch.

## 2026-06-01

Decision:
Standardize the floating process rail to four steps: Design, Build, Launch, Maintain.

Reason:
A four-step process is easier to understand across the site while still allowing discovery/planning and security to be folded into Design, Build, and Launch.

Alternatives Considered:
- Six-step process including Find and Secure.
- Different process language for homepage and process page.

## 2026-06-01

Decision:
Group service navigation into Online Services and In-Home & Office Services.

Reason:
Dark Matter is expanding beyond website-only work into local technology setup, including in-home installations, home offices, office networks, Wi-Fi, printers, devices, and workstation setup. Grouping the menu keeps web services clear while creating room for local service growth.

Alternatives Considered:
- Keep one flat Services dropdown.
- Create a separate top-level navigation item for Local Services.
- Delay local services until pricing is finalized.

## 2026-06-01

Decision:
Make the Services landing page start with three plain-language paths: website/online help, local in-person tech setup, and business app/portal.

Reason:
Older or less technical visitors may not know terms like hosting, SEO, care plans, or custom web apps. A small set of human-readable choices helps them quickly find the right direction, especially the local/in-person installation option.

Alternatives Considered:
- Keep the Services page as a full service grid only.
- Use two categories: online and local.
- Split into many detailed service categories at the top.
