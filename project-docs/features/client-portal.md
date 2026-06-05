# Client Portal

Static portal pages:

- `account.html`
- `es/account.html`
- `account-created.html`
- `es/account-created.html`
- `account-settings.html`
- `account-ads-status.html`
- portal-only app checkout pages
- Sean's direct Google Ads dashboard pages

Shared files:

- `assets/client-portal.js`
- `assets/portal-auth.js`
- `assets/seans-ads-dashboard.js`
- `assets/client-portal.css`
- `assets/supabase-config.js`
- `supabase/client-portal-schema.sql`
- `supabase/portal-role-setup.sql`

Current portal auth is Supabase browser auth. Privileged owner/Sean UI reads `app_metadata.role` first and falls back to email allowlists in `assets/supabase-config.js`. Real private data must still be backed by RLS/server-side authorization before exposure.

Do not add secret keys to static files.
