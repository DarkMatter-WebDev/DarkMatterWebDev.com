# Blog — how it works and how to add a post

Built 2026-08-18 (funnls parity, Gap C). Two files:

- **`blog.html`** — the index. Category filter chips, a post grid (`#bl-grid`), and an empty state.
- **`blog-post-template.html`** — copy-me template for a post. Unlinked and `noindex` on purpose.

## Why one page instead of funnls' category pages

funnls runs `/blog` plus **8 separate `/blog/category/*` pages**. This site is static with no build step, so that would mean 8 real files to keep in sync — and 8 empty ones until posts exist. Instead the categories filter one grid client-side. That keeps the URL count at 1, and **without JS every post is simply visible**, which is the correct degradation.

Categories are deliberately **4, not 8**: `websites`, `software`, `local`, `process`. Do not add more until there are enough posts to justify them.

## Adding a post

1. Copy `blog-post-template.html` → `blog-<slug>.html`.
2. **Remove the `noindex` meta from the copy.** It exists so the template itself is never indexed; a real post must not carry it.
3. Replace every `POST TITLE`, `REPLACE ME`, and `blog-your-slug` — including the canonical and `og:url`.
4. Set the `<time datetime="...">` and the visible date.
5. Paste a card into `#bl-grid` in `blog.html` (pattern below).
6. Re-run the validator. **Each new English page adds 1 to the baseline** (68 before the blog; 70 with the two blog files).

### The index card to paste

```html
<a class="sds-card bl-card" href="blog-your-slug.html" data-category="websites">
  <p class="bl-meta">
    <span class="bl-meta__cat">Websites</span><span>&middot;</span>
    <time datetime="2026-08-18">Aug 18, 2026</time>
  </p>
  <h3 class="sds-h3">Your post title goes here.</h3>
  <p class="sds-body">One or two sentences of summary — the same text as the post's meta description.</p>
</a>
```

**`data-category` must be one of `websites` / `software` / `local` / `process`**, matching a chip's `data-filter`. A typo hides the post under every filter except "All", silently.

## Constraints

- **The index is not in the nav yet, on purpose.** An empty blog in the header is worse than no blog. Add it once the first post ships — a 5th nav pill was measured and **fits at 880px**, the narrowest desktop width, with no overflow.
- Both files carry the standard scaffolding (theme resolver, `#dm-critical-dark-baseline`, tokenised `tailwind.config` with `"screens":{"md":"880px"}`, nav loader, footer loader) because they were built from `websites.html`'s head. Any new post copied from the template inherits it.
- Page-scoped CSS uses `.bl-*` on the index and `.bp-*` on posts, all token-driven. **No hex literals** — a literal would opt the page out of the light theme with no error.
- **Do not put example `href=` markup in an HTML comment in a page.** `scripts/validate-site.ps1` regexes for `href=` without parsing comments, so a commented example registers as a broken link. That is why this card pattern lives here.

## Verified at build time

Index renders at 1280 / 880 / 390 in both themes; 5 chips; filter exercised with injected cards (all → 3, websites → 2, software → 1, process → 0 **with the empty state correctly revealed**, back to all → 3); exactly one chip pressed at a time; nav and footer inject; zero overflow; zero mojibake.
