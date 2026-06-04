# Client Portal

Last updated: 2026-06-04

## Purpose

Create a private client login area where Dark Matter clients can review active services, website health, traffic summaries, support coverage, recurring billing information, and submit questions or change requests.

## Current Implementation

- English page: `account.html`.
- Spanish page: `es/account.html`.
- Public Supabase config placeholder: `assets/supabase-config.js`.
- Portal behavior: `assets/client-portal.js`.
- Portal styling: `assets/client-portal.css`.
- Starter Supabase SQL: `supabase/client-portal-schema.sql`.
- Desktop navigation now includes `Client Login` / `Acceso` links across the site.
- Homepage mobile navigation includes the login link.
- Dashboard includes website-health/status cards, website traffic/stat cards, active services, recurring billing summaries, and a client request form.
- Dashboard includes a second row of action cards for site preferences/settings, Sean's Google Ads, and planning the next website upgrade.
- The login screen is framed as a Login Portal / client wormhole with animated spacetime visuals.
- Placeholder pages exist for future client workflows:
  - `account-settings.html` / `es/account-settings.html`
  - `account-ads-status.html` / `es/account-ads-status.html`
- The Google Ads activity/status placeholder is intended for campaign notes, setup progress, lead activity, budget reminders, and Sean's cleanup recommendations.
- Login panel supports email/password sign-in and magic email links. New account creation opens a focused signup modal powered by Supabase Auth, collecting name, phone, email, password, and password confirmation.
- Because email confirmation is required in Supabase, successful signup redirects to `account-created.html` / `es/account-created.html` with a check-your-email message, Gmail/Outlook/mail app buttons, and a functional sign-in area for after confirmation.

The portal has the public Supabase URL/key configured. Login is initialized, but dashboard data will only appear after Supabase tables, RLS policies, users, and client rows are created.

## Planned Supabase Tables

### `client_profiles`

- `id` uuid primary key
- `user_id` uuid references `auth.users.id`
- `display_name` text
- `company_name` text
- `phone` text
- `website` text
- `created_at` timestamp with time zone

### `client_services`

- `id` uuid primary key
- `user_id` uuid references `auth.users.id`
- `name` text
- `description` text
- `status` text
- `support_level` text
- `created_at` timestamp with time zone

### `client_billing`

- `id` uuid primary key
- `user_id` uuid references `auth.users.id`
- `plan_name` text
- `billing_period` text
- `status` text
- `next_invoice_label` text
- `stripe_customer_id` text
- `created_at` timestamp with time zone

### `client_website_status`

- `id` uuid primary key
- `user_id` uuid references `auth.users.id`
- `site_name` text
- `site_url` text
- `health_score` integer
- `uptime_status` text
- `ssl_status` text
- `backup_status` text
- `update_status` text
- `last_checked_label` text
- `notes` text
- `created_at` timestamp with time zone

### `client_website_stats`

- `id` uuid primary key
- `user_id` uuid references `auth.users.id`
- `site_name` text
- `site_url` text
- `period_label` text
- `visitors` integer
- `page_views` integer
- `top_page` text
- `top_referrer` text
- `conversion_notes` text
- `source` text
- `updated_at` timestamp with time zone
- `created_at` timestamp with time zone

Stats should be stored as client-safe summaries. Possible sources include Netlify Web Analytics, Google Analytics, Google Search Console, Plausible, or manual monthly/admin updates.

Do not call analytics APIs directly from browser JavaScript if an API token is required. Use a secure Netlify Function/import job, then store summaries in Supabase.

## Request Form

- Form name: `client-request`.
- English and Spanish account pages include the same Netlify form schema.
- The logged-in email is copied into the hidden `client_email` field by `assets/client-portal.js`.
- Current request types: Website update, Question, Billing question, Technical support.

## Security Rules

- Enable Row Level Security on every client table.
- Users should only read rows where `user_id = auth.uid()`.
- Do not expose Supabase service-role keys in static files.
- Do not expose Stripe secret keys in static files.
- Create Stripe Customer Portal sessions through a secure Netlify Function or equivalent server endpoint.

## Next Steps

- Create the Supabase project.
- Run `supabase/client-portal-schema.sql` in the Supabase SQL editor to create the tables and RLS policies.
- Configure Supabase Auth redirect URLs for `/account.html` and `/es/account.html`.
- Review Supabase Auth signup settings: email confirmation, allowed domains if needed, and whether new public signups should require manual approval before client rows are attached.
- Confirm Netlify detects `client-request` after deployment and sends notifications to the desired email.
- Add a secure billing portal function before enabling the recurring billing button.
- Build real settings/preferences and Google Ads activity/status data flows after the core Supabase tables are live.
