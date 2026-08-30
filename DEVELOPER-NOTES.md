# Developer Notes — Surette Data Systems site (surettesystems.com)

Handoff notes for whoever (human or AI) works on this site next. Last updated **2026-08-17**.

> The project was branded **Dark Matter** until mid-2026 and the folder names, some asset
> filenames, and a few `dm-` CSS prefixes still say so. The brand is **Surette Data Systems**;
> use SDS in anything new. The "built by dark matter" badges are kept deliberately.

For the full running history see `project-docs/` (`CURRENT_STATUS.md`, `TASKS.md`,
`DECISIONS.md`, `HANDOFF.md`, `CHANGELOG.md`). This file is the short orientation; those
are the detail. **Note: `project-docs/` currently trails the code by a session** — the docs
are stamped 2026-08-16 while shipped assets are on `?v=20260817-cta-r5`.

---

## 1. What this site is

A **static HTML site** — no build step, no framework, no bundler. Pages are hand-written
`.html` files; shared logic lives in `assets/*.js`. A client portal is layered on top using
**Supabase** (auth + a few tables).

- **37 pages**: 34 at the root (English) + 3 under `services/`.
- There is a root `package.json`, but it is **dev-only** — it exists solely to install
  Playwright for the audit scripts under `scripts/`. Netlify serves the repo root as-is and
  never runs it. Do not add a build step on the strength of it being there.
- **Spanish `es/` mirrors are absent from this working copy.** The site was bilingual and the
  nav generator still carries full Spanish copy, so the plumbing is intact — but there is
  nothing to mirror to right now. The validator reports every English page as a missing
  Spanish pair; that is expected noise, not a bug.
- Styling is **Tailwind via the CDN, compiled in the browser at runtime** (not precompiled).
  See §7 — this single fact is behind four separate confirmed bugs in this repo.

## 2. Deployment — READ THIS FIRST

- The live site is published by **drag-and-dropping a folder into Netlify** (manual deploy,
  not Git-connected). This copy *is* a git repo, but git plays no part in shipping — a clean
  or dirty index tells you nothing about what is live.
- **Netlify "Pretty URLs" is ON.** At deploy time Netlify rewrites in-page links from
  `account.html` → `/account` (drops the `.html`). So the **live HTML differs from the source**:
  source says `href="account.html"`, the live site serves `href="/account"`.
  Any JavaScript that matches links by URL must handle **both** forms.
- There are **many near-identical local copies** of this project on the machine
  (`DarkMatter - Codex - Copy (4) - Copy - Copy`, `... - Copy - Copy - Copy`, etc.).
  Before editing, make sure you are in the copy that actually gets dragged to Netlify,
  or your changes will never go live.
- After deploying, **hard-refresh** (Ctrl+Shift+R) to bypass browser cache when testing.

Local preview: `start-preview.bat` (or `npx http-server`). The batch file pins
`http://127.0.0.1:4173/`; `.claude/launch.json` uses `autoPort` and will pick its own.

## 3. Cache-busting convention

Every shared script is referenced with a `?v=YYYYMMDD<letter>-<label>` query string, e.g.
`assets/standard-site-nav.js?v=20260817-cta-r5`. **When you change a shared `.js` or `.css`,
bump the `?v=` on every page that references it** (otherwise browsers keep the old cached file).
A quick way to bump across all pages:

```bash
# from the project root (git-bash / WSL)
grep -rl 'standard-site-nav\.js?v=OLD' --include=*.html . | grep -v node_modules \
  | xargs sed -i 's/standard-site-nav\.js?v=OLD/standard-site-nav.js?v=NEW/g'
```

## 4. Nav and footer have ONE source each

Every public page renders its **entire** nav — desktop header, mobile header + hamburger
dropdown, mobile bottom tab bar — from `assets/standard-site-nav.js`, via a single tag:

```html
<script src="assets/standard-site-nav.js?v=20260817-cta-r5" data-active="websites"></script>
```

The footer works the same way through `assets/standard-site-footer.js` (add
`data-variant="desktop"` / `"mobile"` on the two-layout pages). Under `services/` use
`../assets/...`; the loader auto-prefixes every link it emits.

**Never hand-copy nav or footer markup into a page.** No page carries inline nav markup, and
the legacy `assets/unified-mobile-menu.js` shim was deleted in July 2026.

- **31 pages** load the nav loader; **30** load the footer loader. The gap is the portal
  utility pages (`account-admin`, `account-users`, `account-settings`, `account-created`,
  `app-checkout`), which keep their own minimal chrome on purpose, plus the unlinked noindex
  experiment `multichannel-commerce-website-test-4.html`.
- Current top-level nav is **Websites · Software · Work · Pricing**, plus an icon-only Client
  Login and a gradient "Get started" CTA. There is no Home item — the logo carries it. There
  is **no Services dropdown**; do not reintroduce one.
- Valid `data-active` values: `websites`, `software`, `work`, `pricing`, `home`, `account`,
  `contact`, `none`. The pre-August `apps`/`portfolio`/`services` values still resolve through
  the `LEGACY_ACTIVE` map in the generator, so an un-remapped page degrades to the right
  highlight rather than losing it.
- `assets/mobile-services-nav.js` is **unreferenced and must stay that way**. It identifies the
  retired Services tab by regex-testing hrefs for the string "services" — the Websites tab's
  href matches, so re-adding the script would attach a dead popout to the wrong tab.

The current IA is modelled on **funnls.com**, the owner's chosen design reference
(`Why Funnls · Businesses · Pricing · Blog` + a "Get started" CTA). Its influence also shows in
the `.sds-*` layout system and the pricing front-door page. Consult it before changing the IA.

## 5. The breakpoint is 880px — one line for everything

Below 880: hamburger, bottom tab bar, mobile page layout, mobile footer. At 880+: full header,
wide layout, wide footer. **Two halves must stay in step:**

1. **Tailwind `md:`** is retargeted via `"screens": {"md": "880px"}` in every page's inline
   `tailwind.config` (and in `assets/tailwind-nav-config.js`). A new page must include it, or
   its layout flips at Tailwind's stock 768 while the nav flips at 880 — which is exactly the
   bug that put a mobile bar over a squeezed desktop grid.
2. **Hand-written media queries** use `max-width: 879.98px` / `min-width: 880px`.
   Never write 767/768 in site CSS.

Deliberate exceptions: the portal utility pages (no `md:` utilities, no nav loader), and
`client-portal.css` (700/860px are its own component reflow points).

## 6. Theming — dark and light

The site has **two themes**. Dark is the default and is visually unchanged; light is opt-in
through a toggle in the shared nav, persisted in `localStorage` as `sds-theme` and synced
across tabs. A visitor with no stored choice gets **dark regardless of `prefers-color-scheme`**.

**How it works: values flip, selectors never do.** `assets/nav.css` defines the whole Tailwind
palette as space-separated RGB triplets (`--t-void-black: 5 5 5`), with light values under
`:root[data-theme="light"]`. Every page's inline `tailwind.config` reads them as
`rgb(var(--t-NAME) / <alpha-value>)`.

Three rules, each of which has already cost real debugging time:

- **The triplet form is mandatory.** `<alpha-value>` only works inside `rgb()`, so storing the
  palette as hex silently breaks every `/10` `/60` opacity variant.
- **Never hardcode a palette colour.** A literal opts that element out of the theme with no
  error. Use `--t-*` for palette colours, `--c-veil-rgb` / `--c-shadow-rgb` for translucent
  overlays, and `.sds-on-accent` for text sitting on gradient fills.
- **The pre-paint resolver is load-bearing.** `<script id="sds-theme-resolver">` is the first
  script in all 36 themed heads and stamps `data-theme` before anything paints. It also
  overwrites the `<html>` inline `style` background, which outranks every stylesheet.
  `#dm-critical-dark-baseline` keeps hex literals **on purpose** — it runs before `nav.css`
  defines any variable.

**A new page needs all three of:** the resolver as the first `<head>` script,
`#dm-critical-dark-baseline` including its `html[data-theme="light"]` rules, and a tokenised
`tailwind.config`. Copy them from any current page, or re-run `node scripts/add-theme-resolver.js`
and `node scripts/tokenize-tailwind-config.js` — both are idempotent.

`multichannel-commerce-website-test-4.html` is outside the theme system by design (it is the
unlinked noindex experiment and is already a light cream page).

## 7. The Tailwind CDN trap — read before styling anything injected

The CDN only builds the utility classes it finds in a page's **static HTML**, and it injects
its `<style>` block **after** `nav.css` loads. Two consequences:

1. **Injected markup cannot rely on Tailwind utilities.** The shared nav and footer are built
   by JS, so their classes may never be generated. That is why the footer, hamburger line
   colours, nav bar tint, and hairline borders are all pinned as plain CSS in `nav.css`.
2. **You cannot fix a Tailwind *built-in* colour from `nav.css`.** For built-ins like `white`
   the CDN emits a hard literal and wins at equal specificity, because it loads last. The
   page's `tailwind.config` is the only place that works — which is why every config overrides
   `"white": "rgb(var(--t-starlight-white) / <alpha-value>)"`.

Four separate confirmed bugs in this repo trace to this interaction. When injected markup
renders the wrong colour, suspect this first.

## 8. The login / "Client Login" ↔ "Account" nav button

This is the most-touched, most-subtle part of the site. How it works:

- **`assets/account-nav.js`** runs on **31 pages**. It decides logged-in vs logged-out by
  reading `localStorage`:
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
  - The mobile header's control is **icon-only** by design; the script updates its
    `aria-label`/`title` rather than adding a text label.

- **The account page itself** (`account.html`) does NOT rely on `account-nav.js` for its button.
  Its own script `assets/client-portal.js` updates its nav button directly and is the source of truth
  that **sets/clears the `dm_logged_in` flag** (also done by `assets/account-settings.js` and
  `assets/seans-ads-dashboard.js` for their pages).

- **Inline styles written from JS cannot be themed from CSS.** `account-nav.js` sets the account
  icon's colour inline, which outranks every stylesheet rule, so it must reference a CSS
  variable (`var(--sds-acct-out)`) or it freezes to one theme.

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
            '| nav script:', !!document.querySelector('script[src*="standard-site-nav"]'));
```
- `flag`/`sb keys` present but button wrong → the reader isn't matching the link (URL form) or isn't loaded.
- `nav script: false` → the page isn't loading the nav generator (or Netlify renamed it via JS bundling).

## 9. Supabase

- Config (public) is in `assets/supabase-config.js` — project `evzluixourmsefwdsieu`, a **publishable**
  anon key (`sb_publishable_...`). Tables: `client_profiles`, `client_services`, `client_invoices`,
  `client_documents`, `client_messages`. Super-admin / Sean-ads-admin gating is by email allowlist +
  `client_profiles.portal_role` + `app_metadata`.
- **Never** put service-role or Stripe secret keys in any `assets/*.js` (these ship to the browser).
- `assets/site-message-forms.js` loads supabase-js **lazily** (dynamic import on first submit, plus
  an idle warm-up after `load`). **Do not reintroduce a top-level import there** — it used to fetch
  and execute the whole library at DOMContentLoaded, landing inside the page reveal animation and
  making the contact page load visibly choppy.

## 10. Verification — how to actually check work here

- **Screenshots do not work in the preview pane.** It does not composite frames, and
  `requestAnimationFrame` never fires (measured: 0 callbacks in 3s). Verify by computed style,
  geometry, and hit-testing instead.
- Because the site sets `scroll-behavior: smooth`, programmatic scroll tests animate on rAF and
  read 0 in the pane. Use `scrollTo({top: x, behavior: 'instant'})`.
- The pane's **console buffer persists across reloads**, so errors from an earlier broken load
  look like they are recurring. Open a fresh tab for a clean console.
- **Audit at 390px as well as 1280px.** This site renders a genuinely separate mobile DOM — the
  phone footer, the injected phone account icon, the bottom tab bar, the phone gallery zigzag —
  none of which exists at 1280px. A desktop-only contrast sweep once reported 0 failures while
  **169 elements were failing at 390px in both themes.**
- After broad HTML/CSS/JS edits, run the validator:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\validate-site.ps1
```

  **The known-good baseline is 69 issues** — 52 missing `es/` mirrors plus scans of
  `node_modules/` and the `pokecard-dropin/` templates. Each new English page adds one more.
  Compare against the baseline; do not expect zero.

## 11. Known open issues (not yet fixed)

- **Account dashboard data fails to load.** On the logged-in account page, the Supabase REST calls
  return `400 Bad Request` on `client_profiles` / `client_services` / `client_invoices` /
  `client_documents` / `client_messages`, and `404 Not Found` on the `get_portal_role` RPC.
  This is a **data-layer** problem (likely a missing `user_id` column / RLS policy mismatch, and a
  missing `get_portal_role` Postgres function), **separate from the nav/login button** which works.
  Next step: verify the table schemas (the query filters on `user_id`) and create/rename the
  `get_portal_role` RPC, or adjust `resolveProfilePortalRole` in `assets/portal-auth.js`.
  The updated `supabase/portal-role-setup.sql` still needs to be run in the hosted project.
- **Signed-in portal content has never been contrast-audited** — it is auth-gated, so the sweeps
  report 0 checked elements on those four pages.
- **`spotcalc.com` / `app.spotcalc.com` have not been reachability-tested.** SpotCalc is the only
  app still presented as live, so a dead link there is the one remaining way a visitor hits a wall.
- **The nav's Pricing item covers websites only.** `app-pricing.html` (software pricing) is in no
  menu. See the IA restructure plan in `project-docs/`.

## 12. History — 2026-06-10 handoff

The notes in §8 were written alongside these changes; kept for context on why that code looks
the way it does.

- `assets/account-nav.js` — clean-URL-tolerant link matching; `pageshow` + `storage` re-runs;
  symmetric logout via `data-dm-orig` snapshot/restore.
- `assets/client-portal.js` — set `dm_logged_in` the instant a session exists (before any
  post-login redirect); clear it immediately in the sign-out handler.
- All nav pages — bumped `account-nav.js?v=` to `20260610d-account-logout`.
- `account.html`, `es/account.html` — bumped `client-portal.js?v=` to `20260610c-login-flag`.
