# Project Overview

Dark Matter Surette Systems Portal is a static bilingual marketing site for web services, portfolio work, a client portal entry point, and custom business apps.

## Shape

- Root HTML files are English.
- `es/` contains Spanish mirrors.
- `services/` and `es/services/` contain service detail pages.
- `assets/` contains shared CSS, JS, images, video, app screenshots, and portfolio media.
- `project-docs/` is the compact project memory system.
- `supabase/` contains the client portal starter schema.
- `scripts/validate-site.ps1` validates static links and common site issues.

## Important Boundaries

- Sean's Google Ads source was intentionally moved out of this repo. Its absence is normal.
- Sean's Ads production links should point to `https://seansads.com/`.
- Dark Matter production links generally point to `https://darkmatterwebdev.com/`.
- The Dark Matter / Surette Data Systems portal uses its own dedicated Supabase project and is fully separated from the Naples Estate Jewelry Supabase project.
- Do not store passwords, secret keys, recovery codes, or private credentials in docs.

## Main Workflows

- Keep bilingual changes mirrored.
- Prefer local style/patterns over new abstractions.
- For frontend changes, verify mobile and desktop when practical.
- For broad edits, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

## Startup

Read `AI_START_HERE.md`, then `CURRENT_STATUS.md`, `TASKS.md`, `DECISIONS.md`, and `HANDOFF.md`.
