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
- Sean's Google Ads lives in `Sean's Google Ads Services/` with Spanish pages in `Sean's Google Ads Services/es/`.
- Sean's Ads is now a separate live site at `https://seansads.com/`; Dark Matter is separate at `https://darkmatterwebdev.com/`.
- Cross-site links must use absolute URLs, not local folder-relative URLs.
- Local preview usually runs at `http://127.0.0.1:4173/`.
- The expected validator warning is only:

```text
missing-es-pair jpsurette.html Missing Spanish mirror: es/jpsurette.html
```

This warning is intentional because `jpsurette.html` is a hidden English-only Easter egg.

## Recent Work To Remember

- Sean's Ads homepage card for `About Sean Cochrane` now uses Sean's portrait as the small card icon.
- Sean's Ads header brand mark was changed from a Google-like letter badge to a multicolor Google `G` SVG across English and Spanish pages.
- Sean's Ads contact-page mobile hero/contact blocks were made smaller in English and Spanish.
- The Dark Matter account portal shows a green Sean's Ads Google Ads console notice only for `?source=seansads` or `seansads.com` referrers.
- Spanish UI labels and outlying encoding/question-mark artifacts were recently swept, but keep checking Spanish mirrors after edits.

## Validation

After broad HTML/CSS/JS edits, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```
