# Decisions

Last updated: 2026-07-15

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

## Navigation Single Source of Truth

Decision (2026-07-15): all public pages render their navigation — desktop header, mobile header + hamburger dropdown, and mobile bottom tab bar — exclusively from `assets/standard-site-nav.js` via one `<script ... data-active="...">` tag. No page may carry hand-copied inline nav markup; the legacy runtime shim `assets/unified-mobile-menu.js` was removed. Portal utility pages (account-admin/-users/-settings/-created, app-checkout) are the deliberate exception and keep minimal chrome.

Reason: the nav previously existed in one generator plus ~16 hand-pasted copies in four vintages, patched at runtime by shims. Every nav change landed in the generator and silently missed the copies, producing constant visible drift (wrong active highlights, stale login styling, structurally different menus per page). One injection point makes drift structurally impossible.

## Apps URL

Decision: the app library is `apps.html` / `es/apps.html`; old Downloads paths redirect.

Reason: user-facing naming changed from Downloads to Apps.

## Portfolio Hub

Decision: use `portfolio.html` as the top-level navigation category for work examples, with Apps (`apps.html`) and Websites (`casestudies.html`) as downstream pages.

Reason: the header needs one concise Portfolio category instead of separate Apps and Websites items, while preserving the existing full pages and detail routes.

## Public Navigation Compatibility

Decision: retain the homepage/`assets/standard-site-nav.js` navigation design as the public visual standard, and use `assets/unified-mobile-menu.js` to give legacy public templates the same phone navigation behavior until the HTML can be consolidated.

Reason: the project has several historical header markup paths. A compatibility layer keeps the visible header, menu, account control, and bottom nav consistent across current public pages without a risky full-template rewrite.

## App Brand

Decision: the app/software line is branded as Surette Data Systems.

Reason: current user-facing software branding should use the Surette Data Systems logo/icon and name everywhere app-branding appears.

## Portal Auth

Decision: no local `admin` / `admin` bypass. Privileged UI uses Supabase Auth `app_metadata.role` as the primary source of truth, with email allowlists in `assets/supabase-config.js` as a temporary UI fallback.

Roles:
- `super_admin` for the Dark Matter owner account

Reason: roles in `app_metadata` are server-controlled and prepare the portal for RLS-backed data access. Email allowlists remain only as a fallback during account setup.

## Removed Sean's Ads Portal

Decision: removed the internal Sean's Google Ads portal feature entirely (`seans-google-ads-dashboard.html`, `account-ads-status.html`, `assets/seans-ads-dashboard.js`, the `sean_ads_admin` role, and all UI wiring in `account.html`/`account-settings.html`/`account-admin.html`). The public SeansAds.com portfolio case study (`portfolio-seansads.html`, its `casestudies.html` tile) is a separate showcased client website and was intentionally left in place.

Reason: owner decision to discontinue the internal Sean-specific portal/dashboard feature.

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

## Owner Email Notifications

Decision: message email notifications should use Netlify Forms notifications, while Supabase remains the durable message-center record.

Reason: Netlify can provide owner email alerts without adding a separate email API provider or storing notification credentials in the project.

## Website Pricing Model

Decision: website services are sold through two purchasing paths — managed website plans (12-month initial agreement, $0 upfront build on qualifying tiers, monthly or discounted annual prepay) and one-time website builds (customer owns and manages after handoff). `website_pricing_plan.txt` at the project root is the source of truth for all plan names, prices, allowances, ownership rules, and customer policies shown on `services/website-design-hosting.html`.

Reason: owner-defined pricing/policy model; the public page must never drift from the spec file. Never describe the $0 upfront offer as a "free website."

## Future Structure

Decision: if the site grows much further, prefer generated static HTML with shared layouts/components and structured bilingual content. Astro is the likely path for marketing pages; React/Next-style app architecture is reserved for authenticated app/dashboard needs.
