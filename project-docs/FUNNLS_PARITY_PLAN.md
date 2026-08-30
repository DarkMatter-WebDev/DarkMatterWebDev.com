# funnls.com Parity Plan — full-site pass

Drafted 2026-08-18. **Owner decisions recorded 2026-08-18: Gap A → A3 (cut to full funnls parity). Gap B → build one template industry page first. Gap C → build the blog structure.**

**Phase 1 (Gap A) is DONE.** Phases 2 and 3 are not started.

Reference: **funnls.com**, 73 pages (from their sitemap). Our site: 37 pages.

---

## 1. What already matches — do not redo this

`pricing.html` was rebuilt against funnls in Phase 2 of the earlier layout upgrade and is **already a near 1:1 structural match**:

| funnls `/pricing` | our `pricing.html` |
|---|---|
| "One price. *Everything included.*" + monthly/annual toggle | "One monthly price. Everything included." + toggle |
| 4 cards — One Page $65 / Starter $149 / Growth $249 *most popular* / Pro $449 | 4 cards — One Page / Starter / Growth / Pro |
| "Conversion intelligence, *built in.*" | "Conversion intelligence, built in." |
| "No upfront cost *to get started.*" + Fast Track table | "No upfront cost to get started." |
| "Need something *bigger?*" enterprise | "Need something bigger?" |
| FAQ (6) | "The short answers." |
| Closing CTA | "Not sure which plan fits?" |

The nav, the homepage process block, and the websites story page were also aligned in previous passes. **The remaining gap is structural, not cosmetic.**

## 2. The three real gaps

### Gap A — the pricing detail page has no funnls counterpart at all

`services/website-design-hosting.html` is **127 KB** with ~50 headings. **funnls has no equivalent page.** Their `/pricing` *is* the entire public pricing story; everything else is deferred to the sales call (confirmed 2026-08-17: they publish no third-party-cost disclosure anywhere, and even their one setup-fee caveat disappears on the booking page).

Fifteen sections exist only on our detail page:

> Pick the Path That Fits · Compare Plans · Every Plan, In Plain Language · No Contracts. Cancel Anytime. · Pay Once. Own It. · One-Time Build Packages · Keep Your Website Healthy After Launch · How Many Changes Can I Request Each Month? · How Website Leads Reach You · Let Customers Book You Online · From First Call to Launch, in 8 Steps · What You Own, What We Keep, and How Handoff Works · Grow Your Website as Your Business Grows · Everything People Actually Ask Us · Two Clear Ways to Launch

**This is the decision that matters, and it is a business one, not a design one.** That content is not marketing padding — it is *policy*: allowances, revision-round limits, what counts as a post-launch bug fix, ownership and handoff terms, support response vs completion time. It implements `website_pricing_plan.txt`, the documented single source of truth for every plan name, price, allowance and policy on this site.

Matching funnls here means **publishing less**. That is a real trade, not a free win:

- **For:** a leaner funnel, less to contradict, fewer objections raised before the call.
- **Against:** these terms currently set expectations in writing before a client signs. Removing them shifts that burden entirely to the service agreement and the sales conversation. It also deletes a genuine differentiator — funnls' silence on pass-through costs is arguably *less* transparent, not more polished.

Three options, in ascending risk:

- **A1 — Restructure, keep everything.** Reorganise the page into the funnls visual system (`.sds-*` cards, tighter type, collapsed `<details>` for policy detail) without removing a single term. Page gets easier to read; nothing is lost. **Lowest risk, recommended.**
- **A2 — Split it.** Keep a lean public "what's included" page in funnls' style; move the contractual detail to a separate `/terms`-adjacent page linked from the footer and the agreement. Public funnel matches funnls; policy stays published, just not in the funnel.
- **A3 — Cut it to funnls parity.** Delete the policy sections; `pricing.html` becomes the whole story. **Closest to funnls, highest risk.** Requires explicit owner sign-off on each removed term, and `website_pricing_plan.txt` would need a note that the spec is no longer fully published.

### Gap B — 13 industry pages (funnls' single biggest structural asset)

funnls runs a page per trade:

`web-design-for-` hvac · plumbers · law-firms · medical-practices · dentists · roofers · real-estate · home-services · restaurants · auto-repair · contractors · irrigation · custom-projects

Each is ~1,500–1,800 words on a fixed template: industry-specific hero → 4 industry stats → 4 industry challenges → what we build → 4 common mistakes → pricing (from $149/mo) → marketing cross-sell → FAQ → footer. The HVAC page talks about emergency demand cycles, geo-modified search, $15–45 CPC, seasonal peaks — genuinely specific, not a find-and-replace of a generic template.

**This is their "Businesses" nav item and almost certainly their main organic-search play.** We have zero equivalent. It is the largest single gap.

**Blocked on you, not on me:** which trades you actually serve and want to be found for, and whether the industry statistics can be sourced. Those stats are factual claims about markets — the same class as the 1–2 week turnaround — so they need a real source or they should be dropped from the template.

### Gap C — no blog

funnls has 21 posts across 8 categories (strategy, conversion, product, founders, agencies, seo, design, website-strategy), several of which are clearly sales assets: *custom-website-cost*, *why-your-website-isnt-getting-leads*, *what-pages-does-a-small-business-website-need*.

We have none, and no `/blog` route. **This is an ongoing content commitment, not a build task** — the structure is a day of work; keeping it alive is the real cost. Not worth building empty.

### Smaller funnls patterns we lack

`/integrations` · `/one-page-websites` (a dedicated page for the entry tier) · `/map` · `/mockup` · `/demo` · `/traffic-engine` · `/referral` · `/signs` · `/about` · 6 `marketing/*` service pages (we do not sell marketing, so these are likely N/A).

## 3. Proposed sequencing

1. **Phase 1 — pricing detail page** (Gap A). Self-contained, no new business input needed if A1. Highest-value cleanup.
2. **Phase 2 — one industry page as a template** (Gap B). Build a single page end-to-end, get it approved, then batch the rest. Do not build 13 before the pattern is agreed.
3. **Phase 3 — remaining industry pages**, once the template holds.
4. **Phase 4 — `/one-page-websites` and `/integrations`**, both cheap and both supported by content we already have.
5. **Phase 5 — blog**, only with a commitment to write for it.

## 4. Open questions for the owner

1. **Gap A: A1, A2 or A3?** This is the one that needs a decision before any code moves.
2. **Gap B: which trades?** funnls covers 13. Which do you actually serve, and can the industry stats be sourced?
3. **Gap C: blog — yes or no?** Only worth building if it will be written.
4. Anything on the "smaller patterns" list worth pulling forward?

## 5. Constraints that hold regardless of option

- `website_pricing_plan.txt` remains the source of truth. **No price, plan name, allowance or policy wording changes without it.**
- `pricing.html` and the detail page must stay consistent with each other and with the spec.
- `services/website-design-hosting.html` **keeps its URL** — it is indexed and linked from the nav's Websites item, `pricing.html`, and `websites.html`.
- Any new page needs the theme resolver, `#dm-critical-dark-baseline`, the tokenised `tailwind.config` with `"screens":{"md":"880px"}`, the nav loader and the footer loader. Each new English page adds one to the validator baseline (currently **68**).
- Industry statistics and any turnaround claim are factual claims about the business or its markets — they need a source, per the standing rule on the 1–2 week figure.


---

## 6. Phase 1 outcome (2026-08-18) — detail page cut to funnls parity

`services/website-design-hosting.html`: **127,416 → ~34,000 bytes (-73%)**, ~50 headings → 9 sections.

**Kept** (and rewritten lean, all figures taken verbatim from the prior page):
- `#one-time-builds` — all 8 packages with price, revision rounds and bug-fix period
- `#care-plans` — all 4 plans with monthly and annual prepaid figures, plus the load-bearing note that hosting/care is already included in managed plans
- `#process` — all 8 steps (kept at 8 because `websites.html` calls it "the full eight-step process")
- The `section[id] { scroll-margin-top }` rules, which are documented as load-bearing

**Removed — these terms are now UNPUBLISHED anywhere on the site:**

> Every Plan In Plain Language · Compare Plans table · How Plan Billing Works · No Contracts / Cancel Anytime · A Fully Managed Service · How Many Changes Can I Request Each Month (allowance tables) · Support: Response Time vs Completion Time · Revision Rounds During the Initial Build · What Counts as a Post-Launch Bug Fix · How Website Leads Reach You · Let Customers Book You Online · What You Own, What We Keep, and How Handoff Works · After-12-months ownership/renewal rules · Grow Your Website as Your Business Grows (add-ons) · Everything People Actually Ask Us (full FAQ) · If Your Project Stalls on Your End

**⚠ Checked and confirmed: `terms.html` does NOT back-stop these.** Greps return zero for handoff, revision, bug fix, allowance, cancel, refund and response time. Only "ownership" appears, once. **So cancellation terms, revision limits, the post-launch bug-fix window and handoff rules now have no public statement at all.** They survive only in `website_pricing_plan.txt` (source of truth, unchanged) and in whatever the signed agreement says.

**Recommended follow-up, owner's call:** move the cancellation, revision-round, bug-fix-window and ownership/handoff terms into `terms.html`, or confirm the service agreement covers them to your satisfaction. This is the residual risk of A3 and it is worth closing deliberately rather than by omission.

**Also fixed:** `websites.html` claimed the detail page covered "what happens if a project stalls" — that section was removed, so the sentence was edited to stay true.

**Left behind:** ~76 orphaned `.wp-*` CSS rules in the page's head. Dead but harmless; not swept in the same pass because the load-bearing scroll-margin rules share the block. Logged in TASKS.

**Verified:** all 3 externally-linked anchors present; 8 build cards / 4 care cards / 8 steps at 1280, 880 and 390; new `.wb-price` and `.wb-step-num` resolve in both themes (dark `#fff` / cyan `0 240 255`, light `11 14 16` / `0 104 121`); nav, footer and theme scaffolding intact; zero overflow; zero mojibake; validator at 68.

---

## 7. Phase 3 outcome (2026-08-18) — blog structure

`blog.html` + `blog-post-template.html` (noindex, unlinked) + `project-docs/BLOG.md`.

**Departed from funnls deliberately:** they run `/blog` plus 8 `/blog/category/*` pages. On a static site with no build step that means 8 files to keep in sync and 8 empty ones until posts exist, so categories filter one grid client-side instead — URL count stays at 1, and without JS every post is simply visible. Four categories, not eight.

**Not in the nav** until the first post ships. A 5th nav pill was measured and fits at 880px with no overflow.

**Validator trap:** `validate-site.ps1` regexes `href=` without parsing HTML comments, so a copy-paste card example inside a comment read as a broken link. Pattern moved to `BLOG.md`.

## 8. Phase 2 outcome (2026-08-18) — HVAC industry page template

`web-design-for-hvac.html`, ~1,345 words, 7 sections, built to funnls' industry-page shape and marked up as the template for the other 12.

**funnls' four-stat band was deliberately omitted.** Their page leans on "46% of searches are local", "78% conversion rate", "3x organic leads", "$15–45 CPC" — unsourced factual claims about a market, the same class as the 1–2 week turnaround figure this project requires be sourced or qualified. **Everything on our page is either a description of our own service or a general observation about the trade.** Verified: zero percentage claims anywhere in the body. If sourced figures are supplied, the band goes directly under the hero.

**No HVAC client is implied.** We have none, so the proof strip carries its real attribution (a Naples medical office) rather than suggesting HVAC experience. If that changes, swap it for a real HVAC quote.

**funnls' marketing cross-sell band was replaced** with our actual adjacent offerings (custom software, on-site tech, how the service works) — we do not sell marketing.

Prices were verified against `pricing.html` before publishing: One Page $65 / Starter $149 / Growth $249 / Pro $449, one-time builds from $1,500. Our tiers match funnls' exactly except our entry is $65 against their $149.

**Cloning for another trade** — swap only: title/meta/canonical/og, hero headline + lead, the four "what makes X different" cards, the four "what we build" cards, the four mistakes, the four FAQ entries. Keep the pricing band, also-available band, final CTA and all scaffolding. The swap list is repeated in a comment at the top of the page body.

**Verified:** 1280/880/390 in both themes; 7 sections; 4 FAQ accordions closed by default and opening correctly (details 62 → 137px, marker `+` → `−`); nav active pill resolves to Websites; footer injects; contrast **68 elements, 0 failures in each theme**; zero overflow; zero mojibake; validator **71 = 70 + 1**.

**Still open:** an industries hub and a nav route. funnls uses a "Businesses" nav item pointing at `/industries`. With one industry page there is nothing to hub yet — revisit at 3+.
