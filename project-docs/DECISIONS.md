# Decisions

Last updated: 2026-08-01

Record only durable decisions here. Do not add routine change history.

## Static Bilingual Site

Decision: keep the current site as static HTML/CSS/JS for now, with English at root and Spanish under `es/`.

Reason: simple deployment, easy preview, and no build pipeline required.

## Multichannel Commerce Product Positioning

Decision (2026-08-01, amended): sell the Naples Estate Jewelry-derived platform as the **Complete Multichannel Commerce Website** with the lead promise **"List it once. Sell everywhere."** The central benefit is removing duplicate work. The core entry workflow is an **AI Listing Assistant**: the seller uploads product images, speaks naturally about the item, and receives a structured, prefilled listing form to review, edit, and approve. That one approved product record supplies the customer's branded store, eBay, Etsy, and Instagram/Facebook product and advertising posts. Website, eBay, Etsy, Instagram, and Facebook publishing are all live and should be presented as available now.

Reason: this language is understandable to sellers and galleries, preserves the ownership advantage without ambiguous "self-hosted" jargon, and reflects the completed marketplace and social publishing rollout.

## Memory System

Decision: use compact markdown files in `project-docs/` plus `AI_START_HERE.md` for AI handoff.

Reason: future agents need fast startup context without reading a huge conversation transcript.

## Sean's Ads Boundary

Decision: Sean's Google Ads source is intentionally external and absent from this repo.

Reason: it is now separately hosted/managed at `https://seansads.com/`; Dark Matter should only link to it or expose portal-related Dark Matter pages.

## Injected Shared Components Are Styled in Plain CSS

Decision (2026-07-16): markup injected at runtime by a shared component (`standard-site-nav.js`, `standard-site-footer.js`) is styled with plain CSS in `assets/nav.css`, not Tailwind utilities.

Reason: the Tailwind CDN only generates a utility if it finds that class in the page's own static HTML. A class used *only* inside injected markup exists nowhere for it to find, so it silently resolves to nothing — not an error, just wrong. Observed three times: `text-on-primary-container/60` rendered the footer's legal line white; `portfolio.html`'s hamburger lines resolved to transparent, leaving a clickable but invisible menu button; and (2026-07-21) the nav bars' `border-starlight-white/10` hairlines fell back to preflight `#e5e7eb` on portfolio.html only — a solid light-gray line under the header and above the bottom tab bar, proving the failure is also *per-page nondeterministic* (the CDN's DOM observer caught the class on 27 pages and missed one). Failures are per-page and invisible until someone looks, which makes them exactly the kind of drift this repo keeps paying for. Bar backgrounds AND bar borders are both pinned in `nav.css` now.

## Footer Single Source of Truth

Decision (2026-07-16): all public pages render one footer, injected from `assets/standard-site-footer.js`. Two variants mirror the homepage — the wide footer from 768px up and the phone footer below it. No page may carry inline footer markup.

Reason: the site had drifted to roughly ten hand-copied footers with differing link sets, so any change to "the footer" only reached the page it was made on — the same failure the navigation had.

## Navigation Single Source of Truth

Decision (2026-07-15): all public pages render their navigation — desktop header, mobile header + hamburger dropdown, and mobile bottom tab bar — exclusively from `assets/standard-site-nav.js` via one `<script ... data-active="...">` tag. No page may carry hand-copied inline nav markup; the legacy runtime shim `assets/unified-mobile-menu.js` was removed. Portal utility pages (account-admin/-users/-settings/-created, app-checkout) are the deliberate exception and keep minimal chrome.

Reason: the nav previously existed in one generator plus ~16 hand-pasted copies in four vintages, patched at runtime by shims. Every nav change landed in the generator and silently missed the copies, producing constant visible drift (wrong active highlights, stale login styling, structurally different menus per page). One injection point makes drift structurally impossible.

## Apps URL

Decision: the app library is `apps.html` / `es/apps.html`; old Downloads paths redirect.

Reason: user-facing naming changed from Downloads to Apps.

## Portfolio Hub

Decision: use `portfolio.html` as the top-level navigation category for work examples, with Apps (`apps.html`) and Websites (`casestudies.html`) as downstream pages.

Reason: the header needs one concise Portfolio category instead of separate Apps and Websites items, while preserving the existing full pages and detail routes.

## Public Navigation Compatibility (SUPERSEDED 2026-07-15)

Superseded by "Navigation Single Source of Truth" above: the consolidation this decision deferred ("until the HTML can be consolidated") happened on 2026-07-15 — every public page now renders its nav from `assets/standard-site-nav.js`, and the `assets/unified-mobile-menu.js` compatibility layer was deleted. Kept for history only.

Original decision: retain the homepage/`assets/standard-site-nav.js` navigation design as the public visual standard, and use `assets/unified-mobile-menu.js` to give legacy public templates the same phone navigation behavior until the HTML can be consolidated.

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

## Publish Build Estimates On Portfolio Work — In Hours, At A Published Rate

Decision (2026-07-16, amended same day from dollar ranges to hours): every portfolio entry shows an approximate **build time in hours** — a pill on the gallery card and an hours-led `#build-pricing` breakdown on the detail page — plus the published shop rate of **$125/hr**, stated once per page. The rate lives in `website_pricing_plan.txt` §37 (owner decision; the $95–$150/hr range remains for scoped hourly work in proposals). Hours were derived from the original package-based dollar ranges at $125/hr, so hours × rate reconciles with the pricing page instead of contradicting it.

Reason: the work was being shown with no sense of scale, so visitors could not tell a 15-hour landing page from a 400-hour platform; hours communicate effort with less sticker shock than dollars. Guardrails that must survive future edits: estimates are always ranges with the "estimate only / scoped and quoted individually" disclosure **plus an explicit "hours × rate is not a quote"** (packages stay fixed-price per the spec); each detail page keeps its named package's dollar anchor so the portfolio and pricing page can never tell different stories. `website_pricing_plan.txt` stays the source of truth — if the rate or plan prices change, the hours must be re-derived.

## Galleries Share One Card Component

Decision (2026-07-16): the Websites and Apps galleries render the same collectible card from `assets/collectible-card.css` + `pokecard-dropin`, themed per gallery via `--tcg-*` variables. Do not copy the CSS into a page; do not edit the drop-in.

Reason: two pages needed the same component, and this repo's recurring failure is the hand-copied variant (the nav once had ~16, the footer ~10). The drop-in stays untouched so it remains reusable and its hero card stays green; the component overrides the three rules where the widget hardcodes its own colour.

## Card Face Overlays Stay In Flow

Decision (2026-07-16): anything overlaid on a flip-card face is in-flow content — no `position: absolute`, no `z-index`, no `transform`, no `will-change`, no opacity transitions. Overlap is done with layout (a zero-height row plus negative margin), not positioning.

Reason: established over four device round-trips. Those properties invite a mobile compositor to promote the element out of the card's 3D flattening, after which it paints its backface through the flipped card (mirrored) and flickers mid-rotation — none of which reproduces on desktop, so it ships unseen. In-flow face content (the badges) never glitched once. Every clever workaround — `backface-visibility`, a state-driven opacity hide, a permanent `will-change` layer — was strictly worse than removing the promotion. Positioned overlays are fine on pages with no 3D context (e.g. the portfolio hub's folder cards).

## Card Back Faces Must Fit By Container Width, Not Viewport Width

Decision (2026-07-17): the gallery card back-face guarantee is "copy fits, never scrolls" — enforced by tightening back-face type in `assets/collectible-card.css` via a `@container tcg-card (max-width: 336px)` rule keyed to `.poke-scene.tcg-card`'s own rendered width, not a `max-width` viewport media query.

Reason: `casestudies.html`'s mobile zigzag layout (`assets/portfolio-mobile-fixes.css`) shrinks the card independently of viewport width to make room for its number chip, so card width and viewport width no longer move together. A viewport query tightened (or failed to tighten) the wrong cards once that decoupling existed — it reopened the back-fit budget from the day before, badly, before being caught. A container query is correct by construction regardless of what shrinks the card. One tier only: an earlier two-tier attempt (mild tier for viewport-driven narrow widths, aggressive tier for the zigzag's narrowest case) left a gap where the mild tier wasn't tight enough just above the aggressive tier's cutoff — collapsed to a single tier sized for the tightest case, since more width only ever adds slack once font-size/line-height are fixed. Any future feature that changes card width (on either gallery) must re-sweep `scrollHeight === clientHeight` across the full width range, not just the usual 320/375/1440 spot-checks — this bug lived at a tier boundary a narrower sweep missed.

**`scrollHeight === clientHeight` proves the back doesn't scroll — it does NOT prove the back is full, and don't use it to judge whether there's room to grow the text.** `.poke-back-inner .poke-links` carries `margin-top: auto` (pokecard.css), which stretches the flex column to fill `clientHeight` no matter how little text is above it — `scrollHeight` can never read below `clientHeight` once that auto-margin exists, even with 60px of genuinely empty space on screen. Learned 2026-07-17 when a font-size increase, verified "correct" by that check, turned out barely perceptible — the owner had to point at a screenshot with visible empty space for it to be caught. To judge actual slack, measure `clientHeight − (sum of the back's direct children's own heights + gaps + padding)` instead, and do it per card — the shortest-copy card (most visual slack) is not the one that constrains how far you can push a uniform font-size; the longest-copy card (AuctionBuddha) is, and it can look deceptively fuller than the short cards even while it's the actual ceiling.

## Fixed Background Canvases Ignore Mobile Height-Only Resizes And Live On Composited Layers

Decision (2026-07-21, generalizing the 2026-07-xx Nova fix): any fixed full-viewport background canvas must (1) debounce its resize handling and **skip height-only viewport changes on mobile widths (<880px)** — width or device-pixel-ratio changes still resize, folding in any accumulated height delta — and (2) be promoted to its own composited layer (`transform: translate3d`, `backface-visibility: hidden`, `contain: strict` on the fixed container). Canvas resize paths must also **skip no-op resizes** (unchanged width/height/DPR): assigning `canvas.width` its current value still blanks the bitmap.

Applied to: the Nova engine mount (`#nova-bg`, index.html — the original fix), `fractal.js` + `#canvas-container` (apps.html, process.html, account.html), and `SurettePhysicsWordmark._resize()` (apps.html, terms.html).

Reason: mobile browser chrome collapses/expands during scroll and fires height-only resize events mid-gesture. A resize handler that reallocates a WebGL buffer or clears a 2D canvas on every event turns every scroll into visible stutter — observed on the homepage (Nova, fixed earlier) and again on the apps page (fractal, 2026-07-21). The compositor promotion keeps the fixed layer off the scroll repaint path. Any future background canvas gets this treatment from day one.

## Website Pricing Model

Decision: website services are sold through two purchasing paths — managed website plans (12-month initial agreement, $0 upfront build on qualifying tiers, monthly or discounted annual prepay) and one-time website builds (customer owns and manages after handoff). `website_pricing_plan.txt` at the project root is the source of truth for all plan names, prices, allowances, ownership rules, and customer policies shown on `services/website-design-hosting.html`.

Reason: owner-defined pricing/policy model; the public page must never drift from the spec file. Never describe the $0 upfront offer as a "free website."

## Future Structure

Decision: if the site grows much further, prefer generated static HTML with shared layouts/components and structured bilingual content. Astro is the likely path for marketing pages; React/Next-style app architecture is reserved for authenticated app/dashboard needs.
