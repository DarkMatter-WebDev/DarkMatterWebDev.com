# Decisions

Last updated: 2026-07-03

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

## Auth Redirect Base

Decision: Supabase auth email redirects should use the canonical production site URL from `assets/supabase-config.js` instead of `window.location.origin`.

Reason: password reset and magic-link emails requested from local preview must not send users to localhost or `127.0.0.1`.

## Admin Surface Split

Decision: keep owner-only admin features out of the regular client dashboard. Super-admin users should see the same account dashboard as clients except for an Admin Center link, and private admin views should live on separate owner-only pages.

Reason: this keeps the normal client account experience clean while leaving room for larger admin tools such as the subscriber table. The Admin Center can use a left-anchored tab workspace as those private tools grow.

## Admin Destructive Actions

Decision: destructive Admin Center table actions must use a confirmation modal in the UI and owner-only Supabase RPCs for the actual delete operation.

Reason: browser-side gates are not enough for privileged operations, and account deletion needs server-side checks such as owner role verification and self-delete prevention.

## Subscriber And Account Lists

Decision: Admin Center account holders and newsletter subscribers are separate lists. New portal account creation mirrors the account email/profile info into `homepage_email_signups`, but the Subscribers UI reads only subscriber rows and never falls back to auth/account-holder rows.

Reason: an account holder may or may not be a subscriber, and deleting someone from Subscribers should remove them from that table without deleting or re-showing their portal account.

## Minimal Client Profiles

Decision: client profile data is limited to account identity/contact essentials such as name, phone, email, and portal role. Do not collect or store profile-level business/company name or website URL fields.

Reason: those fields are not needed for the current portal experience and add clutter to account settings, Admin Center tables, and Supabase schema setup.

## Portal Message Center

Decision: authenticated account-dashboard support/change requests should write to Supabase `client_messages` and be reviewed in the owner-only Admin Center Message Center instead of using Netlify Forms.

Reason: authenticated client messages belong with portal/account data, and the owner needs a single admin surface for reviewing and deleting account-originated requests.

## Public Form Messages

Decision: public website forms should also write to Supabase `client_messages` through `submit_site_message()` instead of Netlify Forms, with optional image attachments stored in a private Supabase Storage bucket.

Reason: keeping contact, consultation, checkout, and portal messages in one owner-only Message Center gives the admin one operational inbox while avoiding Netlify dashboard/email fragmentation.

## Future Structure

Decision: if the site grows much further, prefer generated static HTML with shared layouts/components and structured bilingual content. Astro is the likely path for marketing pages; React/Next-style app architecture is reserved for authenticated app/dashboard needs.
