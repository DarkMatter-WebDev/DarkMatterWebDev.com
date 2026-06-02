# Architecture

Last updated: 2026-06-01

## System Design

This project is currently a static marketing website. Pages are hand-authored HTML files with Tailwind CSS loaded from the CDN, shared CSS assets, static media, and small JavaScript enhancements.

There is no app server, database, build pipeline, package manager, or framework documented in this workspace at this time.

## Folder Structure

```text
/
  index.html
  services.html
  process.html
  casestudies.html
  contact.html
  built-by.html
  netlify.toml
  assets/
    *.css
    *.js
    *.html snippets
    images and video
    portfolio/
  services/
    complete-website-management.html
    discovery-consultation.html
    website-design.html
    brand-rebranding.html
    managed-hosting.html
    website-care-plans.html
    seo-foundations.html
    custom-development.html
    in-home-services.html
    office-network-setup.html
  es/
    (Spanish mirror of every top-level page)
    index.html, services.html, process.html, casestudies.html,
    contact.html, built-by.html
    services/
      (Spanish mirror of every service page, same filenames)
  project-docs/
    project memory and documentation
```

## Page Model

- Top-level pages provide the main site navigation and conversion flow.
- Service pages under `services/` share the same general visual system and navigation pattern.
- The Services dropdown is grouped into Online Services and In-Home & Office Services.
- On mobile top-level pages, `assets/nav.css` moves the five-item tab bar to the top and `assets/mobile-services-nav.js` turns the Services tab into a grouped service picker.
- `assets/rail.js` controls the shared floating process rail interaction and is loaded with a version query string to avoid stale deployed behavior after rail changes.
- `assets/site-hero.js` applies the shared black-hole MP4 page hero treatment to non-home pages by moving each page's intro/title block into an overlaid video hero at runtime. It is cache-busted with a version query string.
- `assets/care-plans.css`, `assets/nav.css`, `assets/logo.css`, and badge CSS files hold reusable styling.
- Some page behavior is implemented inline in the relevant HTML files.

## Internationalization (English / Spanish)

- The site is bilingual. English pages live at the repo root; Spanish (neutral Latin American) pages are exact, fully-translated mirrors under `es/` and `es/services/` using identical filenames.
- Each page carries an `EN / ES` toggle in the desktop nav and mobile header, plus a small head script that auto-detects Spanish browsers on first visit and remembers the explicit choice in `localStorage` (`dm_lang`). Pages declare `hreflang` alternates (`en` / `es` / `x-default`).
- Spanish files differ from their English source only by: `lang="es"`, asset paths gaining one `../` level, the head detect/toggle URLs, and translated visible text (including user-facing strings in inline scripts). Internal relative links are unchanged so navigation stays within `es/`.
- `assets/rail.js` is shared and bilingual (it selects Spanish popover strings when `document.documentElement.lang` starts with `es`).
- Full glossary, exact snippets, and rules are in `project-docs/I18N.md`. Netlify form `name`/`value` attributes are kept identical across languages so submissions share one schema.
- Maintenance rule: any content change on one language's page must be mirrored on its counterpart.

## Database Schema

No database is currently present.

If custom business web apps are built later, document their data model here before or during implementation.

## API Integrations

- Netlify Forms are used for contact form submissions on `contact.html` and Website Preference Builder submissions on `preference-builder.html` / `es/preference-builder.html`.
- No other confirmed external API integrations are documented in the current codebase.

## Authentication Flow

No authentication exists in the current static marketing site.

The marketing copy now advertises custom business web apps that can include owner, staff, and customer logins. If such an app is implemented later, document the auth provider, roles, permissions, session behavior, and account lifecycle here.

## Hosting Setup

- `netlify.toml` indicates Netlify deployment support.
- Static assets are served directly.
- Forms rely on Netlify form handling.

## Deployment Architecture

Current architecture is a static Netlify-hosted site:

```text
Visitor browser
  -> Netlify static hosting
    -> HTML/CSS/JS/assets
    -> Netlify Forms for contact and website-preference submissions
```

## Local Development

Typical local preview:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/index.html
```
