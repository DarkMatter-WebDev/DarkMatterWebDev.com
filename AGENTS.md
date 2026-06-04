# Project Memory Instructions

This project uses `project-docs/` as persistent memory for AI sessions and future contributors. If present, read `AI_START_HERE.md` first for the quick startup map, then continue with the required files below.

At the start of a session, read these files before making changes:

1. `AI_START_HERE.md`
2. `project-docs/PROJECT_OVERVIEW.md`
3. `project-docs/CURRENT_STATUS.md`
4. `project-docs/TASKS.md`
5. `project-docs/DECISIONS.md`
6. `project-docs/HANDOFF.md`

Then summarize the current project state and proceed with the user's request.

Before ending a meaningful work session:

1. Update `project-docs/CURRENT_STATUS.md`.
2. Update `project-docs/TASKS.md`.
3. Add major decisions to `project-docs/DECISIONS.md`.
4. Add meaningful changes to `project-docs/CHANGELOG.md`.
5. Update `project-docs/ARCHITECTURE.md` if structure, hosting, integrations, auth, or deployment changed.

After broad HTML/CSS/JS edits, run the static-site validator:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

Never store passwords, secret keys, recovery codes, or private credentials in project docs. `project-docs/CLIENTS.md` may contain references to credential locations only.
