# Structure Recommendations

Last updated: 2026-06-05

## Current Recommendation

Stay static for now, but avoid growing hand-authored duplication forever.

## If Refactoring Later

Use generated static HTML with:

- shared layouts
- shared nav/footer components
- structured bilingual content
- data-driven app/portfolio/service cards
- image metadata helpers
- validation checks in CI

Astro is the preferred candidate for the marketing site because it can output static pages while reducing duplicated HTML. Keep authenticated portals/business apps separate unless the project intentionally moves into a full app framework.

## Do Not Do Yet

- Do not migrate frameworks casually during small content/layout tasks.
- Do not mix the external Sean's Ads source back into this repo.
- Do not move portal security into front-end-only logic for real private data.
