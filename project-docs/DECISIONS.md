# Decisions

Last updated: 2026-06-14

Record only durable decisions here. Do not add routine change history.

## Static Bilingual Site

Decision: keep the current site as static HTML/CSS/JS for now, with English at root and Spanish under `es/`.

Reason: simple deployment, easy preview, and no build pipeline required.

## Memory System

Decision: use compact markdown files in `project-docs/` plus `AI_START_HERE.md` for AI handoff.

Reason: future agents need fast startup context without reading a huge conversation transcript.

## Sean's Ads Boundary

Decision: Sean's Google Ads source is intentionally external and absent from this repo.

Reason: it is now separately hosted/managed at `https://seansads.com/`; Dark Matter should only link to it or expose portal-related Dark Matter pages.

## Apps URL

Decision: the app library is `apps.html` / `es/apps.html`; old Downloads paths redirect.

Reason: user-facing naming changed from Downloads to Apps.

## App Brand

Decision: the app/software line is branded as Surette Data Systems.

Reason: current user-facing software branding should use the Surette Data Systems logo/icon and name everywhere app-branding appears.

## Portal Auth

Decision: no local `admin` / `admin` bypass. Privileged UI uses Supabase Auth `app_metadata.role` as the primary source of truth, with email allowlists in `assets/supabase-config.js` as a temporary UI fallback.

Roles:
- `super_admin` for the Dark Matter owner account
- `sean_ads_admin` for Sean's Google Ads portal access

Reason: roles in `app_metadata` are server-controlled and prepare the portal for RLS-backed data access. Email allowlists remain only as a fallback during account setup.

## Dedicated Portal Supabase

Decision: the Dark Matter / Surette Data Systems portal uses its own dedicated Supabase project and is fully separated from the Naples Estate Jewelry Supabase project.

Reason: portal auth, account-holder lists, billing, app checkout, support messages, and future admin workflows should not share database/auth state with client or portfolio projects.

## App Checkout

Decision: public app pricing/profile CTAs route purchase intent through the client portal before the shared checkout pages.

Reason: shopping cart/payment request flow should live behind portal login.

## Future Structure

Decision: if the site grows much further, prefer generated static HTML with shared layouts/components and structured bilingual content. Astro is the likely path for marketing pages; React/Next-style app architecture is reserved for authenticated app/dashboard needs.
