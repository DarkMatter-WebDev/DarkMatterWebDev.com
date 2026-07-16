# Developer Notes — Dark Matter site (surettesystems.com)

Handoff notes for whoever (human or AI) works on this site next. Last updated **2026-06-10**.

---

## 1. What this site is

A **static HTML site** (no build system, no framework, no package.json at root).
Pages are hand-written `.html` files; shared logic lives in `assets/*.js`.
A client portal is layered on top using **Supabase** (auth + a few tables).

- English pages live at the root; Spanish mirrors live under `es/`.
- Styling is Tailwind utility classes (precompiled) + a few custom CSS files in `assets/`.

## 2. Deployment — READ THIS FIRST

- The live site is published by **drag-and-dropping a folder into Netlify** (manual deploy, not Git-connected).
- **Netlify "Pretty URLs" is ON.** At deploy time Netlify rewrites in-page links from
  `account.html` → `/account` (drops the `.html`). So the **live HTML differs from the source**:
  source says `href="account.html"`, the live site serves `href="/account"`.
  Any JavaScript that matches links by URL must handle **both** forms.
- There are **many near-identical local copies** of this project on the machine
  (`DarkMatter - Codex - Copy (4) - Copy - Copy`, `... - Copy - Copy - Copy`, etc.).
  Before editing, make sure you are in the copy that actually gets dragged to Netlify,
  or your changes will never go live. None of these copies is a git repo.
- After deploying, **hard-refresh** (Ctrl+Shift+R) to bypass browser cache when testing.

## 3. Cache-busting convention

Every shared script is referenced with a `?v=YYYYMMDD<letter>-<label>` query string, e.g.
`assets/account-nav.js?v=20260610d-account-logout`. **When you change a shared `.js`,
bump the `?v=` on every page that references it** (otherwise browsers keep the old cached file).
A quick way to bump across all pages:

```bash
# from the project root (git-bash / WSL)
grep -rl 'account-nav\.js?v=OLD' --include=*.html . | grep -v node_modules \
  | xargs sed -i 's/account-nav\.js?v=OLD/account-nav.js?v=NEW/g'
```

## 4. The login / "Client Login" â†” "Account" nav button

This is the most-touched, most-subtle part of the site. How it works:

- **`assets/account-nav.js`** runs on every normal page (38 pages include it before `</body>`).
  It decides logged-in vs logged-out by reading `localStorage`:
  1. a simple `dm_logged_in === "1"` flag, OR
  2. a fallback that detects a Supabase token key (`sb-<ref>-auth-token`, incl. chunked).
  - When signed **in** it rewrites the button to **"Account" / "Cuenta"**.
  - When signed **out** it restores the button's **original** markup ("Client Login" / "Acceso"),
    which it snapshotted into a `data-dm-orig` attribute on first run. Restoring verbatim is how
    it preserves the Spanish label and the original icon without hard-coding them.
  - It re-runs on **`pageshow`** (so back/forward navigation restored from the bfcache updates too)
    and on **`storage`** (so logging in/out in one tab updates other open tabs).
  - Link matching uses the regex `/(^|\/)account(\.html)?([?#]|$)/i` so it matches
    `account.html`, `/account`, `../account.html`, `/account.html`, `account`, and `?query`/`#hash`
    variants — but **not** `account-settings`, `account-created`, `account-ads-status`.

- **The account page itself** (`account.html`) does NOT rely on `account-nav.js` for its button.
  Its own script `assets/client-portal.js` updates its nav button directly and is the source of truth
  that **sets/clears the `dm_logged_in` flag** (also done by `assets/account-settings.js` and
  `assets/seans-ads-dashboard.js` for their pages).

### The class of bug this caused (history)
- A previous selector `a[href$="account.html"]` matched **nothing** on the live site because
  Pretty URLs had turned the links into `/account`. The script ran but changed nothing, so the
  button appeared "stuck" on Client Login after login. Fixed by the regex above (2026-06-10).
- Logout originally never reverted the button on other pages (the script only rewrote when logged in).
  Fixed by the snapshot/restore + `pageshow`/`storage` re-runs (2026-06-10).

### How to debug it quickly
Log in, go to a normal page, open the console, and run:
```js
console.log('flag:', localStorage.getItem('dm_logged_in'),
            '| sb keys:', Object.keys(localStorage).filter(k=>k.startsWith('sb-')),
            '| nav script:', !!document.querySelector('script[src*="account-nav"]'));
```
- `flag`/`sb keys` present but button wrong → the reader isn't matching the link (URL form) or isn't loaded.
- `nav script: false` → the page isn't loading `account-nav.js` (or Netlify renamed it via JS bundling).

## 5. Supabase

- Config (public) is in `assets/supabase-config.js` — project `evzluixourmsefwdsieu`, a **publishable**
  anon key (`sb_publishable_...`). Tables: `client_profiles`, `client_services`, `client_invoices`,
  `client_documents`, `client_messages`. Super-admin / Sean-ads-admin gating is by email allowlist +
  `client_profiles.portal_role` + `app_metadata`.
- **Never** put service-role or Stripe secret keys in any `assets/*.js` (these ship to the browser).

## 6. Known open issues (not yet fixed)

- **Account dashboard data fails to load.** On the logged-in account page, the Supabase REST calls
  return `400 Bad Request` on `client_profiles` / `client_services` / `client_invoices` /
  `client_documents` / `client_messages`, and `404 Not Found` on the `get_portal_role` RPC.
  This is a **data-layer** problem (likely a missing `user_id` column / RLS policy mismatch, and a
  missing `get_portal_role` Postgres function), **separate from the nav/login button** which works.
  Next step: verify the table schemas (the query filters on `user_id`) and create/rename the
  `get_portal_role` RPC, or adjust `resolveProfilePortalRole` in `assets/portal-auth.js`.

## 7. Files changed on 2026-06-10 (this handoff)

- `assets/account-nav.js` — clean-URL-tolerant link matching; `pageshow` + `storage` re-runs;
  symmetric logout via `data-dm-orig` snapshot/restore.
- `assets/client-portal.js` — set `dm_logged_in` the instant a session exists (before any
  post-login redirect); clear it immediately in the sign-out handler.
- All 38 nav pages — bumped `account-nav.js?v=` to `20260610d-account-logout`.
- `account.html`, `es/account.html` — bumped `client-portal.js?v=` to `20260610c-login-flag`.
