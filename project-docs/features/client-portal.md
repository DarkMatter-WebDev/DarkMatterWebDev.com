# Client Portal

Static portal pages:

- `account.html`
- `es/account.html`
- `account-created.html`
- `es/account-created.html`
- `account-settings.html`
- portal-only app checkout pages

Shared files:

- `assets/client-portal.js`
- `assets/portal-auth.js`
- `assets/client-portal.css`
- `assets/supabase-config.js`
- `supabase/client-portal-schema.sql`
- `supabase/portal-role-setup.sql`

Current portal auth is Supabase browser auth. Privileged owner UI reads `app_metadata.role` first and falls back to email allowlists in `assets/supabase-config.js`. Real private data must still be backed by RLS/server-side authorization before exposure.

Note: the internal Sean's Google Ads portal feature (`seans-google-ads-dashboard.html`, `account-ads-status.html`, `assets/seans-ads-dashboard.js`, `sean_ads_admin` role) was removed 2026-07-15. The public SeansAds.com portfolio case study is unrelated and still lives at `portfolio-seansads.html`.

Do not add secret keys to static files.
