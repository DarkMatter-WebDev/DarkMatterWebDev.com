# AI Start Here

This project uses `project-docs/` as persistent memory. Before making changes, read these files in order:

1. `AGENTS.md`
2. `project-docs/PROJECT_OVERVIEW.md`
3. `project-docs/CURRENT_STATUS.md`
4. `project-docs/TASKS.md`
5. `project-docs/DECISIONS.md`
6. `project-docs/HANDOFF.md`

Then summarize the current state to the user and proceed.

## Fast Current Context

- Dark Matter Web Services is a bilingual static site at the project root and `es/`.
- Sean's Google Ads has been intentionally moved out of this repository and is now managed elsewhere; it is normal that `Sean's Google Ads Services/` is not present.
- Sean's Ads is a separate live site at `https://seansads.com/`; Dark Matter is separate at `https://darkmatterwebdev.com/`.
- Cross-site links must use absolute URLs, not local folder-relative URLs.
- Local preview usually runs at `http://127.0.0.1:4173/`.
- There is currently no expected validator warning. Treat any validator warning as something to inspect.

## Recent Work To Remember

- Sean's Ads source is no longer part of this project. Do not look for, recreate, or edit the old `Sean's Google Ads Services/` folder from this repo.
- The Dark Matter account portal shows a green Sean's Ads Google Ads console notice only for `?source=seansads` or `seansads.com` referrers.
- Spanish UI labels and outlying encoding/question-mark artifacts were recently swept, but keep checking Spanish mirrors after edits.

## Validation

After broad HTML/CSS/JS edits, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```
