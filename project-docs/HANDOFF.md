# Handoff Notes

Last updated: 2026-06-04

Use this file after reading the required startup files:

1. `PROJECT_OVERVIEW.md`
2. `CURRENT_STATUS.md`
3. `TASKS.md`
4. `DECISIONS.md`

## Immediate State

- The site is static HTML with a full Spanish mirror under `es/`.
- Most large recent work is complete: portfolio pages, Google Ads mini-site, and Supabase client portal scaffolding.
- The current preview URL is usually `http://127.0.0.1:4173/`.
- The only expected validator warning is the hidden English-only `jpsurette.html` Easter egg page missing `es/jpsurette.html`.

## Most Important Paths

- Main homepage: `index.html`, `es/index.html`
- Services: `services.html`, `services/*.html`, `es/services.html`, `es/services/*.html`
- Portfolio summary: `casestudies.html`, `es/casestudies.html`
- Portfolio detail pages: `portfolio-*.html`, `es/portfolio-*.html`
- Client portal: `account.html`, `es/account.html`
- Portal scripts/styles: `assets/client-portal.js`, `assets/client-portal.css`, `assets/supabase-config.js`
- Supabase starter SQL: `supabase/client-portal-schema.sql`
- Google Ads mini-site: `Sean's Google Ads Services/`
- Static validator: `scripts/validate-site.ps1`

## What To Preserve

- Keep English and Spanish pages in sync.
- Keep public Supabase config limited to URL and publishable/anon key only.
- Do not store secrets, passwords, service-role keys, Stripe secret keys, or recovery codes in docs or static files.
- Keep `jpsurette.html` unlinked except for the tiny homepage Easter egg unless the user asks otherwise.
- Keep imported client source folders out of the project root; harvested assets should live under `assets/portfolio/`.

## Before Editing

- Check whether the requested page has a Spanish counterpart.
- Check shared CSS/JS cache-busting query strings if a change appears not to show in preview.
- Prefer updating shared assets over repeating one-off fixes across dozens of HTML files.
- After broad HTML/CSS/JS changes, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

## Current Known Warning

```text
missing-es-pair jpsurette.html Missing Spanish mirror: es/jpsurette.html
```

This is expected unless the user decides the hidden Easter egg needs a Spanish mirror or validator exception.

## Next Good Work

- Complete real Supabase setup and test login data.
- Build real account settings/preferences workflow.
- Build real Google Ads account activity/status data flow.
- Finalize JPS Surette once the project is approved.
- Decide standalone hosting/domain plan for `Sean's Google Ads Services/`.
- Consider Astro migration only after current static output is stable and validated.
