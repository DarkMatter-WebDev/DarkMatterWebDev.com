# Handoff

Last updated: 2026-06-05

## Startup Prompt

If the user says `analyze this project's files`, start by reading:

1. `AGENTS.md`
2. `AI_START_HERE.md`
3. `project-docs/PROJECT_OVERVIEW.md`
4. `project-docs/CURRENT_STATUS.md`
5. `project-docs/TASKS.md`
6. `project-docs/DECISIONS.md`
7. `project-docs/HANDOFF.md`

Then summarize the project in a few bullets and continue with the latest request.

## Immediate Context

- Static bilingual Dark Matter Web Services site.
- English root pages, Spanish mirrors under `es/`.
- Local preview usually: `http://127.0.0.1:4173/`.
- Sean's Ads source is intentionally not here; do not recreate it.
- `git` may be unavailable in this environment.

## Most Recent Work

- Wired portal privileged access to Supabase `app_metadata.role` through `assets/portal-auth.js`.
- Sean dashboard now uses shared gating: Sean sees his customer center; super admin sees Sean's tools plus member workspace in owner oversight mode.
- Added `supabase/portal-role-setup.sql` for future RLS role helpers.
- Compacted project markdown memory so future AI sessions have a lighter startup path.
- Trimmed old feature docs into short pointers and removed stale markdown-only leftovers, including `assets/portfolio/elite/DESIGN.md` and the old meeting note.
- Removed unreferenced root PNG leftovers:
  - `sean-check-final.png`
  - `sean-check-matte_loose.png`
  - `sean-check-matte_soft.png`
  - `sean-check-plain.png`
- Mobile pricing page was verified:
  - `Ask a Question` stays inside the banner.
  - Pricing cards are two-wide on mobile.
  - Page has zero horizontal overflow in the checked mobile viewport.
- Static validator passed after recent edits.

## Important Page Notes

- `apps.html` and `es/apps.html`: compact app gallery and custom app CTAs.
- `app-pricing.html` and `es/app-pricing.html`: pricing tiers and portal/checkout links.
- `auction-house-consignment-store-software.html` and Spanish mirror: Auction app profile.
- `secondhand-dealer-management-system.html` and Spanish mirror: SDMS app profile.
- `account.html` / `es/account.html`: Supabase-facing portal.
- `seans-google-ads-dashboard.html` / Spanish mirror: Sean/owner-only portal UI.

## Validation

Run after broad edits:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

## Do Not Forget

- Mirror English/Spanish changes.
- Do not store secrets in markdown.
- Browser-side portal gates are not true security.
- Update compact memory docs before ending meaningful sessions.
