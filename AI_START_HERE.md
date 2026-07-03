# AI Start Here

Trigger phrase: when the user says `analyze this project's files`, `analyze my project files`, or asks for handoff/setup, start here.

## Startup Order

1. Read `AGENTS.md`.
2. Read this file.
3. Read `project-docs/PROJECT_OVERVIEW.md`.
4. Read `project-docs/CURRENT_STATUS.md`.
5. Read `project-docs/TASKS.md`.
6. Read `project-docs/DECISIONS.md`.
7. Read `project-docs/HANDOFF.md`.

Then summarize the current state in a few bullets and continue with the user's latest request.

## Project Snapshot

- Static Dark Matter / Surette Data Systems marketing, app-library, and client-portal site.
- English pages live at the repo root. Spanish `es/` mirrors are currently absent from this working copy and should be regenerated/reconciled before a bilingual launch.
- Main app library page is `apps.html`; app brand is Surette Data Systems; old `downloads.html` paths redirect.
- Sean's Google Ads source is intentionally not in this repo. It lives separately at `https://seansads.com/`.
- Local preview usually runs at `http://127.0.0.1:4173/`.

## Core Rules

- Keep English and Spanish pages in sync if/when Spanish mirrors are restored.
- Do not recreate or edit the removed Sean's Ads mini-site source.
- Use `apply_patch` for manual file edits.
- After broad HTML/CSS/JS edits run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

- Before ending meaningful work, update the compact memory docs:
  - `CURRENT_STATUS.md`
  - `TASKS.md`
  - `CHANGELOG.md`
  - `HANDOFF.md`
  - `DECISIONS.md` only for durable architectural/business decisions.
  - `ARCHITECTURE.md` only if structure, hosting, auth, integrations, or deployment changed.
