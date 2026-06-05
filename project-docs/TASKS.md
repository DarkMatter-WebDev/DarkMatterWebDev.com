# Tasks

Last updated: 2026-06-05

## Active

- Keep memory docs compact and current after meaningful work.
- Keep English and Spanish pages mirrored.
- Run the static validator after broad HTML/CSS/JS edits.

## Near-Term

- Review all high-value pages on desktop and mobile before launch.
- Finish Supabase setup before treating portal/account/billing as live:
  - run `supabase/client-portal-schema.sql`
  - run `supabase/portal-role-setup.sql`
  - set Auth user `app_metadata.role` values:
    - owner `rcman12589@aol.com` -> `super_admin`
    - Sean `scochrane495@gmail.com` -> `sean_ads_admin`
  - configure Auth redirects and email templates
  - create test users/client rows
  - verify RLS
  - confirm Netlify forms
- Add secure backend/Netlify Function before real Stripe recurring billing or admin operations.
- Keep Auction and SDMS screenshots current with their hosted demos.
- Review app pricing copy and rates after real client feedback.

## Backlog

- Native Spanish review before major public launch.
- Add real client/operations references to `CLIENTS.md` when approved.
- Decide first analytics source for portal traffic summaries.
- Build real account settings and Google Ads activity/status workflows.
- Consider future migration from duplicated hand-authored HTML to generated static HTML with shared layouts and structured bilingual content.

## Recently Completed

- Compacted project markdown memory, trimmed old feature docs, removed a stale imported Elite Yacht design brief, removed the old meeting note, and removed unreferenced root `sean-check-*.png` leftovers.
- Ran mobile sweep and fixed pricing banner CTA containment, two-wide app pricing tiers, SDMS mobile profile overflow, Built By decorative blur overflow, Preference Builder hero overflow, and SeansAds portfolio mobile overflow.
- Made pricing tier cards clickable through the client portal to app checkout context.
- Added/updated Auction and SDMS app profile pages with WebP screenshots, modal previews, pricing CTAs, language callouts, and powered-by/footer shells.
