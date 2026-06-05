# Changelog

This file is intentionally compact. Keep only high-signal recent changes and major milestones.

## 2026-06-05

- Wired portal privileged access to Supabase `app_metadata.role` via `assets/portal-auth.js`, with email allowlist fallback and shared Sean dashboard gating in `assets/seans-ads-dashboard.js`.
- Added `supabase/portal-role-setup.sql` for future RLS role helpers.
- Compacted project markdown memory for faster AI handoff and added an explicit startup trigger for `analyze this project's files`.
- Trimmed old feature docs into short pointers and removed stale markdown-only leftovers, including the imported Elite Yacht `DESIGN.md` and the old meeting note.
- Removed unreferenced root screenshot leftovers: `sean-check-final.png`, `sean-check-matte_loose.png`, `sean-check-matte_soft.png`, and `sean-check-plain.png`.
- Ran a phone-width mobile layout sweep, fixed app pricing question-button containment, kept pricing tiers two-wide on mobile, and patched targeted overflow on Built By, Preference Builder, SeansAds portfolio, and SDMS profile pages.
- Made app pricing tier cards clickable through the client portal to the selected app checkout context.
- Shortened Apps hero copy and added soft translucent color backing to app gallery tiles.
- Added app-aware pricing return links and pricing CTAs from Auction and SDMS app profiles.
- Slimmed the app pricing page to a compact banner plus immediate tiers and removed public benchmark links.
- Updated Auction and SDMS app profile pages with WebP screenshots, modal preview tiles, pricing/custom/demo CTA rows, language callouts, powered-by banner, and footer.
- Added/updated portal-only checkout pages and safe `next` redirects for app checkout.
- Added browser-side owner/Sean allowlists for portal UI access; removed the temporary `admin` / `admin` bypass.

## 2026-06-04

- Renamed the app library from Downloads to Apps, including `apps.html`, Spanish mirror, nav labels, and redirects from old Downloads URLs.
- Reworked Apps and Portfolio pages into gallery-first layouts with standalone detail pages.
- Added SDMS as a second Dark Matter app listing and full app profile.
- Added Auction House & Consignment Store Software profile pages and live demo/request CTA flow.
- Added powered-by/footer shells to app pages.
- Restored legitimate English/Spanish question marks and fixed malformed Spanish `textarea` tags.
- Documented that Sean's Google Ads source moved out of this repo and is managed separately.

## Earlier Milestones

- Built the static bilingual Dark Matter Web Services site.
- Added Services, Process, Contact, Built By, Portfolio, Apps, Website Preference Builder, and Client Portal surfaces.
- Added Supabase starter config/schema for the portal.
- Added homepage hero media and shared cosmic-web visual system.
