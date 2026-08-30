# Nav Restructure Plan — condensing Websites / Software / Work

Drafted 2026-08-17. **Owner approved Option A the same day**, plus "yes" to §6 Q3
(Pricing covers both product lines). Implemented 2026-08-17.

Reference site: **funnls.com** (`Why Funnls · Businesses · Pricing · Blog` + a "Get started" CTA).

---

## 1. The problem, stated precisely

Current top-level nav is `Websites · Software · Work · Pricing` + icon-only Client Login +
"Get started". Three of those four items resolve to pages that show work that has been built,
so a visitor cannot predict which one holds what they want.

Measured overlap in the actual page content:

| Nav item | Destination | What it actually contains |
|---|---|---|
| **Websites** | `websites.html` | Service story + a **"Websites we've built"** section |
| **Software** | `apps.html` | **"Ready-to-deploy business apps"** + multichannel + custom builds |
| **Work** | `portfolio.html` | Two folder cards: **"Surette Data Systems apps"** and **"Websites we've built"** |
| **Pricing** | `pricing.html` | Website plans only |

So:

- **"Websites we've built" exists on three pages** — `websites.html`, `portfolio.html`, and
  `casestudies.html` (which is the real gallery).
- **The app list exists on three pages** — `apps.html`, `portfolio.html`, and
  `app-catalog.html` (the real gallery).
- **`portfolio.html` is a pure interstitial.** Both of its cards lead somewhere else, and one
  of them (`apps.html`) is *already a top-level nav item*. Clicking Work → Apps lands you
  exactly where clicking Software would have.
- **Software and Work are partially the same destination.** That is the sharpest instance of
  the confusion.

Two further defects surfaced while mapping this:

- **`app-pricing.html` is in no menu at all.** The nav's Pricing item covers websites only, so
  software pricing is unreachable from the header.
- **`process.html` is in no menu.** It is reachable only from CTAs buried in service pages,
  despite being the closest thing the site has to funnls' "Why Funnls" page.

## 2. What funnls actually does, and the lesson

funnls' four items are `Why Funnls`, `Businesses`, `Pricing`, `Blog`. Note what is **not**
there: any portfolio, work, case-studies, or gallery item.

The organising principle is **the visitor's decision path, not the vendor's output**:
*why should I trust you → is this for someone like me → what does it cost → learn more*.
Proof is embedded as evidence inside those pages; it is never its own destination.

Applied here, the rule is: **the nav should name what a visitor can buy. Work becomes
evidence inside those pages, not a fourth sibling competing with them.**

## 3. Recommendation — Option A, three items

```
Websites · Software · Pricing        [Client Login icon]  [Get started]
```

`Work` is retired as a nav item. Each gallery moves under its parent service page, which is
where visitors already expect proof:

```
Websites  → websites.html  → casestudies.html  → 6 portfolio-*.html detail pages
Software  → apps.html      → app-catalog.html  → 6 app profile pages
Pricing   → pricing.html   → services/website-design-hosting.html  (full website detail)
                           → app-pricing.html                      (software plans)
Get started → contact.html
```

Why this one:

- It removes the ambiguity at the source rather than relabelling it. There is no longer a page
  whose job is "show work", so nothing competes with Websites and Software.
- Both galleries keep their URLs, their SEO content, and their inbound links. Nothing is
  deleted; one interstitial stops being a nav destination.
- Three items plus a CTA is close to funnls' weight, and it frees header width — useful,
  because the desktop bar also carries the theme toggle, the login pill, and the CTA.
- It is the smallest change that fixes the reported problem.

**The cost:** "Work" is a strong word for a services business and some visitors do look for a
portfolio by name. Mitigation is in step 4 below — proof gets *more* prominent inside the two
service pages, not less.

### Variant B — four items, if a value-prop slot is wanted

```
Websites · Software · Pricing · Process        [Client Login]  [Get started]
```

Same retirement of Work, but `process.html` takes the freed slot as the local equivalent of
funnls' "Why Funnls". This page already exists and is currently unreachable from any menu, so
this is close to free. Choose this if the nav feels too thin at three items.

### Variant C — keep four, merge the galleries (not recommended)

Keep `Work`, but make `portfolio.html` the *only* gallery by folding `casestudies.html` and
`app-catalog.html` into it, and strip the recent-work sections from `websites.html` and
`apps.html`. This resolves the ambiguity in the other direction. Rejected because it is
substantially more build work, it contradicts the goal of condensing, and it would collapse
two well-developed SEO pages into one.

## 4. Implementation steps

All nav markup is generated in `assets/standard-site-nav.js`. There is no per-page nav HTML,
so the structural change is one file.

1. **Desktop pill row** (`standard-site-nav.js` ~L179–196): remove the `work` anchor and its
   `portfolio-nav-button` class. That class is referenced **only** at L189 in this file — no
   CSS or other page uses it, so it can go with the anchor.
2. **Mobile dropdown** (~L233): remove the `work` row. Order becomes Home · Websites ·
   Software · Pricing · Client Login · Get started.
3. **Bottom tab bar**: no change needed. It is already Home · Websites · Pricing · Contact and
   never carried Work or Software.
4. **`copy.work`** (both EN and ES blocks): leave the string in place. It costs nothing and
   the Spanish copy is the only surviving artefact of the bilingual build.
5. **Remap `data-active`.** 8 pages currently declare `work`:
   - the 6 `portfolio-*.html` detail pages and `casestudies.html` → **`websites`**
   - `portfolio.html` → **`none`** (see step 6)

   Then add `work: "websites"` and keep `portfolio: "websites"` in the `LEGACY_ACTIVE` map, so
   any page missed in the sweep still highlights something sensible instead of nothing. Note
   `LEGACY_ACTIVE` currently maps `portfolio → work`; that entry must be repointed, not left.
6. **Decide `portfolio.html`'s fate.** It has 6 inbound links (`apps.html`, `index.html` ×2,
   `pricing.html`, `websites.html`, and a self-link). Recommended: **keep the page live** —
   it costs nothing, it is a legitimate landing page for anyone who arrives searching
   "portfolio", and killing it would mean rewriting six links. Just remove it from the nav and
   set `data-active="none"`. Do **not** add a Netlify redirect; a redirect would strand its
   inbound links on a page that no longer answers them.
7. ~~**Fold software pricing into the Pricing page.**~~ **Already done** — `pricing.html:466`
   carries a "Software, not a website" route to `app-pricing.html` in its escape-hatch band.
   The §1 defect was overstated: `app-pricing.html` is absent from the *header*, but Pricing is
   already its front door. No edit needed.
8. ~~**Strengthen the proof sections** on `websites.html` and `apps.html`.~~ **Already
   satisfied** — `websites.html:230` has "See all websites" → `casestudies.html`, and
   `apps.html:201` has a primary CTA → `app-catalog.html` (plus `:219` → `app-pricing.html`).
   Both galleries stayed reachable with no content edits. Whether those links should be *more
   prominent* now that they are the only route is a live follow-up, tracked in TASKS.
9. **Bump the cache-buster** on `standard-site-nav.js` across all **31** pages that load it,
   and on `nav.css` if any pill geometry changes. Pills are sized in `nav.css` under
   `.sds-nav-pill`; dropping an item changes the row width, so re-check the 880px boundary
   where the desktop bar appears.

## 5. Verification checklist

- All 31 nav pages at **1280 / 1024 / 880 / 879 / 390px** — no overflow, correct active pill,
  desktop bar still fits with the toggle + login + CTA at the narrowest desktop width.
- Every remapped page highlights exactly one pill.
- Mobile dropdown and bottom bar have **no duplicate destinations** (the dropdown once shipped
  two `contact.html` rows).
- `scripts/validate-site.ps1` — expect the **69-item baseline**, unchanged. A jump means a
  link broke.
- Contrast is unaffected (no colour change), but re-run if pill geometry moves.

## 6. Open questions for the owner

1. **Three items or four?** Option A vs Variant B. B costs almost nothing and surfaces
   `process.html`, which is currently unreachable from any menu.
2. **Does "Work" need a home at all?** The recommendation keeps `portfolio.html` live but
   unlinked from the header. If the portfolio matters commercially, Variant C is the honest
   alternative — but it is a much larger job.
3. **Should Pricing cover both product lines**, or should software pricing stay on
   `apps.html`? Step 7 assumes the former.
