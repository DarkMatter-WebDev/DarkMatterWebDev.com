# Architecture

Last updated: 2026-06-05

## Current Stack

- Static HTML/CSS/JS.
- English pages at repo root.
- Spanish mirrors under `es/`.
- No build step required for normal editing.
- Local preview commonly uses Vite/static server at `http://127.0.0.1:4173/`.
- Netlify-style static deployment and redirects in `netlify.toml`.

## Key Directories

- `assets/`: shared CSS/JS/media.
- `assets/apps/auction/`: compressed WebP auction app screenshots.
- `assets/apps/sdms/`: compressed WebP SDMS screenshots.
- `assets/portfolio/`: portfolio media.
- `services/`: English service pages.
- `es/services/`: Spanish service pages.
- `project-docs/`: compact AI/project memory.
- `supabase/`: starter SQL for the client portal.
- `scripts/validate-site.ps1`: static-site validation.

## Shared Behavior

- Main navigation is hand-authored across pages; keep English/Spanish and desktop/mobile navs consistent.
- `assets/mobile-services-nav.js` supports mobile services navigation.
- `assets/client-portal.js` handles portal UI/auth behavior and safe `next` redirects.
- `assets/portal-auth.js` reads Supabase `app_metadata.role` for privileged portal access, with email allowlist fallback in `assets/supabase-config.js`.
- `assets/seans-ads-dashboard.js` gates Sean's Google Ads dashboard pages using the shared portal auth helpers.
- `assets/supabase-config.js` stores public Supabase config plus non-secret email allowlists for browser-side UI fallback.

## Auth/Portal

- Portal uses Supabase browser auth for email/password and magic-link style flows.
- Privileged portal UI uses Supabase `app_metadata.role` first (`super_admin`, `sean_ads_admin`), with email allowlist fallback in `assets/supabase-config.js`.
- SQL helpers in `supabase/portal-role-setup.sql` support future RLS policies.
- Any real customer/admin/Sean data must still be protected with Supabase RLS, custom claims, server-side functions, or another backend authorization layer.
- No local `admin` / `admin` bypass should exist.

## Forms

- Contact, request, checkout, and preference-builder flows use static/Netlify form markup.
- Keep form names/field names stable across language mirrors unless intentionally changing the backend schema.

## Assets

- Prefer WebP for screenshots and optimized images.
- Homepage hero video uses:
  - `assets/Hero-Black-Hole-desktop-1080p.mp4`
  - `assets/Hero-Black-Hole-mobile-720p.mp4`
- Avoid adding large root-level temporary screenshots.

## Future Direction

If duplication becomes too heavy, migrate to generated static HTML using shared layouts and structured bilingual content. Astro is the preferred marketing-site candidate; authenticated app/dashboard work may need a separate app stack.
