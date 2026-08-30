# Decisions

Last updated: 2026-08-27

Record only durable decisions here. Do not add routine change history.

## Packaged business apps and stores are no longer sold (2026-08-27)

**Decision:** Surette Data Systems sells websites. Packaged business applications and
e-commerce stores are withdrawn as products.

**Why it matters later:** this is a positioning change, not a page cleanup. The company
was previously described as "custom desktop and web-based CRM, ERP, inventory, workflow
and operations software, plus websites/hosting". That sentence, and the sales paths that
went with it, are gone from the site.

**What was kept and why:** the six app profiles survive as **case studies**. They are
proof that the shop can build serious systems, which helps sell website work. `apps.html`
was repurposed from a sales page into a case-study index rather than deleted, because 17
pages linked to it. **Do not re-add `app-catalog.html`, `app-pricing.html`,
`app-checkout.html`, a Software nav pill, or store/app options in the contact form.**

## AI is a website feature, not a product (2026-08-27)

**Decision:** AI is sold as part of a website, never as an application.

**The test, recorded in `website_pricing_plan.txt` §29c:** *if the customer switched it
off tomorrow, would they lose a feature or lose their operations?* Visitor-facing AI —
answering, qualifying, routing, drafting, summarising, booking — is a website feature;
data passes through it and lands in email, a CRM, or a spreadsheet. Logins, roles,
inventory, payroll, scheduling, or AI that reads and writes the business's own records
are custom software and are out of scope.

**Why this exists:** the one-time build ladder includes a tier described as "multi-page
with backend tables, forms". Backend tables are stored business records, which is
app-shaped and carries app-shaped support expectations. Without this boundary the app
business returns under a website label, at website prices, with no maintenance contract.
Tier 3 is therefore capped at **records the customer reads**, not records they operate.

## Hosting-account ownership splits by payment model (2026-08-27)

**Decision:** on a managed monthly plan, Surette Data Systems owns and operates the
hosting account, because hosting is part of the service being paid for. On a one-time
build with **Self-Hosting Setup** (`§29b`, $450 / $750), every account — hosting, domain,
email, analytics — is created **in the customer's name**, and SDS is added as an
administrator only where continued access is needed.

**Why:** a one-time customer who has paid in full should not depend on a Surette Data
Systems account to keep their website online. This makes "you own it" literally true
rather than a marketing phrase, and it matches §8, which already preferred
customer-owned accounts. Support after handover is 14 days, then the published $125/hr.


## Home Is a Conditional Pill, Not a Permanent Nav Item

Decision (2026-08-17, owner request): the desktop bar shows a **Home pill on every page except the homepage itself**. It is generated in `standard-site-nav.js` and is the first pill in the row.

This **amends, but does not reverse**, the earlier "there is no Home item — the logo carries it, following funnls.com" rule. The logo still links home from everywhere. What changed is that once a visitor has navigated away, the route home is now explicit rather than implied by a logo, which is a convention most visitors expect. The homepage itself still spends no slot on a self-link, so the clean funnls-style bar survives where the reference site's reasoning actually applied.

**Detection deliberately checks two things**, in `isHomePage()`: `data-active === "home"` is the fast path, but a page that forgot to set it would otherwise render a Home pill pointing at itself, so the URL is checked too. The pattern must accept a bare directory (`/`, `/es/`) because **Netlify Pretty URLs serve the homepage as `/`, not `/index.html`** — and must not match extensionless Pretty URLs like `/account`. Both forms were verified.

Nav width was the risk worth checking: the row is now four pills plus the icon-only login, the theme toggle, and the CTA. Verified fitting with no overflow down to **880px**, the narrowest width at which the desktop bar renders at all.

**The hamburger dropdown follows the same rule** (owner request, same day): its Home row is omitted on the homepage, so the desktop pill and the phone menu agree. Homepage dropdown is 5 rows; every other page is 6.

**The phone bottom tab bar deliberately does NOT follow it.** It keeps its Home tab on every page. A tab bar holds a *constant* set of destinations and marks the current one — dropping a tab on one page would shift the remaining three horizontally under the user's thumb, so a tap lands on a different destination depending on which page you were on. That is a different component from a menu, and the inconsistency is intentional.

## Nav Names What You Can Buy — Proof Is Never Its Own Destination

Decision (2026-08-17, owner-approved): the header carries **`Websites · Software · Pricing`** plus an icon-only Client Login and a "Get started" CTA. The **`Work` item is retired and must not return as a fourth sibling.** Galleries hang off their parent service page: Websites → `casestudies.html`, Software → `app-catalog.html`.

Reason: three of the four items resolved to pages showing built work, so nothing predicted which held what. The decisive evidence was structural, not aesthetic — `portfolio.html` was a two-card interstitial and **one of its cards led to `apps.html`, which was already the Software nav item**. Clicking Work → Apps landed exactly where Software would have.

The principle is taken from **funnls.com** (`Why Funnls · Businesses · Pricing · Blog`), the owner's design reference, which carries no portfolio item at all: the nav follows the visitor's decision path — *is this for me → what does it cost* — and proof is embedded as evidence inside those pages. Consult funnls.com before any future IA change.

Rejected alternative: keeping `Work` and merging both galleries into `portfolio.html`. It resolves the ambiguity in the other direction but contradicts the goal of condensing and would collapse two well-developed SEO pages into one.

`portfolio.html` is **kept live and deliberately not redirected** — it has 6 inbound in-page links and legitimately serves anyone searching "portfolio". It is simply unlinked from the header. `process.html` is the standing candidate if a fourth slot is ever wanted; it exists already and is currently in no menu.

## Never Bulk-Edit HTML Through PowerShell Text Cmdlets

Decision (2026-08-17): bulk edits to `.html` in this repo must use `[IO.File]::ReadAllText/WriteAllText` with an explicit `UTF8Encoding($false,$true)`, the editor's own edit tooling, or git-bash `sed`. **Never `Get-Content`/`Set-Content`/`Out-File`.**

Reason: Windows PowerShell 5.1 decodes UTF-8-without-BOM as Windows-1252, so a read-modify-write round-trip re-encodes every non-ASCII character. A cache-buster bump across 31 pages turned every curly quote, em-dash and middot into `â€™`/`â€”`/`Â·`. The failure is **silent** — the intended edit lands correctly and the page still loads — and was caught only by the validator jumping from its 69 baseline to 271. This is the same class of corruption as the site-wide mojibake swept in July 2026, and it will recur on any machine using Windows PowerShell.

Corollary: **always re-run `scripts/validate-site.ps1` after a bulk pass.** The baseline delta is the cheapest available detector. To reverse the damage: decode the bytes as UTF-8, re-encode that string as CP1252, and those bytes are the original file — build both encoders with exception fallbacks so an unmangled file throws instead of being corrupted, and loop while the marker count strictly decreases.

## Theming: Flip Token Values, Never Add `dark:` Variants

Decision: the light theme works by swapping the *values* of CSS custom properties under `:root[data-theme="light"]`. Selectors and class names never change. The Tailwind palette lives in `assets/nav.css` as space-separated RGB channel triplets (`--t-void-black: 5 5 5`), and every page's inline `tailwind.config` consumes them as `rgb(var(--t-NAME) / <alpha-value>)`.

Reason: the two workhorse utilities, `text-starlight-white` (306 uses) and `text-on-surface-variant` (280), carry most of the site's copy. Variable-backed values make them follow the theme with **zero markup changes**. The alternative — adding `dark:` variants — would have meant editing thousands of class attributes across 34 hand-authored pages. The channel-triplet form is mandatory: `<alpha-value>` only works inside `rgb()`, so the opacity variants (`/10`, `/60`) break if the palette is stored as hex.

Consequence: **never hardcode a palette colour again.** A literal defeats the theme silently, with no error — see the next decision.

## nav.css's Pinned Utility Fallbacks Must Stay Token-Driven

Decision: the hand-pinned Tailwind utility duplicates in `nav.css` (`.text-starlight-white`, `.text-electric-cyan`, …) must reference `--t-*` tokens, never literals.

Reason: those pins exist because the Tailwind CDN only builds classes found in a page's *static* HTML, so injected nav/footer markup can't rely on it. But `nav.css` loads **after** the CDN's injected `<style>`, so the pins win on cascade order. On the first light-theme pass the CDN correctly emitted `rgb(var(--t-starlight-white) / …)` while this block still forced `#FFFFFF` — producing white body text on the light ground. This is the fourth distinct bug caused by the injected-markup/Tailwind interaction.

## `starlight-white` Is Two Different Things; `--c-on-accent` Splits Them

Decision: text sitting on a brand-accent fill uses `.sds-on-accent` / `--c-on-accent` (white in both themes), not `text-starlight-white`.

Reason: `starlight-white` is a literal colour name doing two jobs — primary body/heading text (301 of 306 uses, which must flip to ink) and labels on the cyan→purple gradient (3 uses plus the nav CTA, which must stay white because that gradient is dark in both themes). Flipping all of them turned the gradient CTAs invisible.

## Dark Mode Is the Default and Must Stay Byte-Identical

Decision: a visitor with no stored choice gets dark, regardless of `prefers-color-scheme`. Every light-mode rule is *additive* — dark values are never consolidated, refactored, or "tidied" while adding light ones.

Reason: dark is the brand's intended look and the only one with years of visual QA behind it. Honouring the OS preference would have silently flipped a large share of visitors into a theme that had never been the primary experience. Concretely, this is why the seven bespoke page-panel colours (`--t-panel-*`) each keep their exact original hex on the dark side rather than collapsing onto one surface token, and why the cosmic-web light variant is a separate `:root[data-theme="light"]` block rather than a restructuring of the shared rule.

## The Theme Must Resolve Before First Paint

Decision: an inline `<script id="sds-theme-resolver">` is the **first** script in every page's `<head>`, and `#dm-critical-dark-baseline` keeps hardcoded literals.

Reason: the no-white-flash baseline paints `#050505` from three places before any content shows — the `<html>` inline `style` attribute, the critical `<style>` block, and `nav.css`. Applying a stored light theme any later means a black flash on every navigation. The baseline block cannot use `var()` because it runs before `nav.css` has defined anything; tokenising it would reintroduce the very flash it exists to prevent. The resolver also overwrites the inline `style` attribute, which outranks every stylesheet rule.

`theme-color` is deliberately *not* set by the resolver: the `<meta>` tag is parsed later in `<head>` than the script runs, so it does not exist yet. `standard-site-nav.js` sets it once the DOM is ready — it only tints mobile browser chrome, so a few ms late is imperceptible.

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

## Mobile Bottom Navigation Scroll Behavior

Decision (2026-08-01): on viewports below 880px, the shared bottom navigation hides while the user scrolls down and reappears when the user scrolls up. Use directional distance thresholds (24px down, 6px up) to suppress jitter; keep it visible at the top and outside the mobile range. Keyboard input must reveal it immediately, and reduced-motion preferences must remove the transition rather than remove navigation access.

Reason: this is the conventional Material bottom-navigation behavior, recovers meaningful phone viewport space while reading, and keeps the four top-level destinations close as soon as the user reverses direction. Thresholds and accessibility fallbacks prevent a noisy or keyboard-hostile implementation.

## Hosted App Demos Retired — Access By Request

Decision (2026-08-08): five of the six Surette Data Systems apps — Auction House & Consignment, SDMS, Benji Payroll, Third Street / Antique Mall, and MetalsPredictor — are no longer online for open evaluation. Every public surface presents them as **access by request**, routing to `contact.html`. All outbound links to the retired instances (`auctionconsignmentapp.netlify.app`, `secondhanddealer.netlify.app`, `benjipayroll.netlify.app`, `thirdstreetauctions.com`, `chrisappmet.netlify.app`, and the shared `portal.darkmatterapps.com`) were removed from the site. SpotCalc is the one exception and stays live.

The `.tcg-stat-pill` on `app-catalog.html` now carries **availability** rather than delivery type: five cards read `By Request`, SpotCalc reads `PWA`. This is a deliberate change of meaning from the 2026-07-16 catalog design (LIVE DEMO / PWA / WEB APP) — with nothing self-serve, delivery type was the less useful thing to spend that corner on.

The retirement notice is a shared `.app-access-notice` rule in `assets/surette-data-systems-app-profile.css`, not five copies in five inline `<style>` blocks. Same reasoning as the nav and footer decisions above: this repo's recurring failure is the hand-copied variant.

**`thirdstreetauctions.com` is offline too** (owner-confirmed 2026-08-08). It is included in the five deliberately, not by mistake. Earlier docs describe it as a live client site and the CHANGELOG records a 2026-07 refresh "around the live ThirdStreetAuctions.com app" — that is history. Do not "restore" its links on the strength of those entries.

Reason: owner decision. The demo instances are gone, so leaving "Open Live App Demo" buttons on the site pointed visitors at dead URLs and advertised evaluation access that no longer existed.

## App Brand Renamed MetalsCalc → SpotCalc

Decision (2026-08-08): the precious-metal buying calculator is named **SpotCalc**, at `spotcalc.com` with the app at `app.spotcalc.com`. The rename is site-wide and covers both the app surfaces (`app-catalog.html`, the app profile) and the Websites gallery surfaces (`casestudies.html`'s two duplicated grids, `portfolio-metalscalc.html`).

**Page filenames and asset directories deliberately keep the old `metalscalc` spelling** — `metalscalc-buying-calculator.html`, `portfolio-metalscalc.html`, `assets/apps/metalscalc/`, `assets/portfolio/metalscalc/`. Renaming files would change live URLs and require redirects for no user-visible benefit; the paths are not user-facing. This split is also what makes the rename safely scriptable: the brand strings are `MetalsCalc` / `metalscalc.com`, the paths are lowercase `metalscalc-` / `metalscalc/`, so a case-sensitive substitution hits every brand string and no path. **If the brand ever changes again, use that same distinction rather than a blanket case-insensitive replace.**

Reason: owner decision on product naming.

## Portfolio Sites: Only Naples Estate Jewelry And SpotCalc Are Live

Decision (2026-08-08): of the six Websites gallery entries, only **NaplesEstateJewelry.com** and **SpotCalc.com** remain online. Elite Yacht Detailing, JPSurette, Sean's Ads, and AuctionBuddha are offline; their outbound links were removed everywhere and replaced with a request-to-view path into `contact.html`. Gallery card status tags read `status - offline`, and the detail pages' `.portfolio-live-widget` gets a `--offline` modifier.

**This supersedes the "Sean's Ads Boundary" decision's link guidance.** That entry says Sean's Ads production links should point to `https://seansads.com/`; that site is down, so the link is gone. The rest of that decision still holds — the Sean's Ads *source* is still intentionally absent from this repo and must not be recreated here.

**Naples Estate Jewelry moved from `.co` to `.com`** in the same pass. There is no redirect assumption baked into the site: every reference was rewritten.

Label note: the gallery card button says **"Ask to View"**, not "Request Viewing". That is a fit constraint, not a style preference - see the card-back entry below.

Reason: owner decision; the sites are down, and a portfolio full of dead "Live" buttons is worse than no button at all.

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

**Foot-button labels are part of that budget (2026-08-08).** Changing the gallery cards' outbound button from `Live` / `Live Site` to a request-to-view label re-broke AuctionBuddha's back by **24px** at 320px. The button itself did not wrap — its height stayed 25px. The **`.poke-links` row** wrapped: two buttons no longer fit side by side, so the row became two rows. The threshold at a 237px card is ~105px of button width: `Request Viewing` renders 108px (overflows), `Request Access` 102px (fits, but barely), `Ask to View` 84px (fits with real margin) — hence the shipped label is **"Ask to View"**. When changing any card foot/back button text, measure the *row* height, not just the button, and prefer margin over a squeaker; the 2026-07-17 regression came from razor-thin margins. Note also that the desktop grid is `display:none` below 880px, so its 6 backs report fake zero-overflow at 320px — filter to cards with a non-zero rect or you will "verify" nothing.

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
