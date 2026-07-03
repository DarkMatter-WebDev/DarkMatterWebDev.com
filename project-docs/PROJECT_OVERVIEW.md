# Project Overview

Dark Matter Surette Systems Portal is a static marketing site for web services, portfolio work, a client portal entry point, and custom business apps under the Surette Data Systems brand.

## Shape

- Root HTML files are English.
- Spanish `es/` mirrors are currently absent from this working copy; restore/reconcile them before a bilingual launch.
- `services/` contains English service detail pages.
- `assets/` contains shared CSS, JS, images, video, app screenshots, and portfolio media.
- `project-docs/` is the compact project memory system.
- `supabase/` contains setup SQL for the client portal, message center, newsletter subscribers, public-form message capture, and related RLS/RPC helpers.
- `scripts/validate-site.ps1` validates static links and common site issues.

## Important Boundaries

- Sean's Google Ads source was intentionally moved out of this repo. Its absence is normal.
- Sean's Ads production links should point to `https://seansads.com/`.
- Dark Matter production links generally point to `https://surettesystems.com/`.
- The Dark Matter / Surette Data Systems portal uses its own dedicated Supabase project and is fully separated from the Naples Estate Jewelry Supabase project.
- Do not store passwords, secret keys, recovery codes, or private credentials in docs.

## Main Workflows

- Keep bilingual changes mirrored if/when Spanish pages are restored.
- Prefer local style/patterns over new abstractions.
- For frontend changes, verify mobile and desktop when practical.
- For broad edits, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

## Startup

Read `AI_START_HERE.md`, then `CURRENT_STATUS.md`, `TASKS.md`, `DECISIONS.md`, and `HANDOFF.md`.
