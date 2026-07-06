# Pokécard Drop-in

A self-contained package with **two things**:

1. **`app-template/`** — the full secondary website (a reusable, single-config
   business marketing site + a small admin backend). Static-hostable as-is.
2. **`pokecard/`** — the Pokémon-trading-card widget that showcases that site
   (3D hover-tilt, diagonal glare, click/keyboard flip, touch-friendly,
   reduced-motion aware). No frameworks, no build step, no dependencies.

Cut this whole folder into a new project and you have both the card and the
site it links to.

```
pokecard-dropin/
├── example.html              ← open this to see it working
├── README.md
├── app-template/             ← the secondary site (the card's target)
│   ├── index.html            ← landing page ("View Live" points here)
│   ├── login/register/quote/account/admin.html
│   ├── styles.css · siteConfig.js · render.js · landing.js · site-bg.js
│   └── vendor/               ← three.js, gsap, scrolltrigger, lenis, matter
└── pokecard/                 ← the widget
    ├── pokecard.css          ← styles (fonts bundled — fully self-contained)
    ├── pokecard.js           ← behaviour (tilt / glare / flip)
    ├── template-preview.jpg  ← the art-window screenshot
    ├── card.html             ← copy-paste markup snippet
    └── fonts/                ← vcr-osd-mono + ibm-plex-mono (woff2)
```

## Quick start (just see it)

Serve the folder over http (needed so the browser can load the fonts, image,
and the bundled site) and open `example.html`:

```bash
# from inside pokecard-dropin/
python -m http.server 8000
# then visit  http://localhost:8000/example.html
```

Opening `example.html` directly from disk (`file://`) mostly works, but a local
server is recommended so `app-template/` and the fonts load cleanly.

## Add the card to your own page

1. **Copy** the `app-template/` and `pokecard/` folders into your project's
   web root (or wherever you serve static files).

2. In your page's `<head>`:

   ```html
   <link rel="stylesheet" href="pokecard/pokecard.css">
   ```

3. In your page's `<body>`, paste the markup from **`pokecard/card.html`**.

4. Before `</body>`:

   ```html
   <script src="pokecard/pokecard.js"></script>
   ```

5. **Fix two paths** for your layout (both flagged with `EDIT` in
   `card.html`):
   - the `.poke-art` `<img src>` → your path to `pokecard/template-preview.jpg`
   - the two **“View Live”** `<a href>` → where you deploy `app-template/`.
     To match the original exactly, host `app-template/` at your site root and
     use `href="/app-template/"`.

That's it — the widget auto-initialises every `.poke-scene` on the page.

## Behaviour & accessibility

- **Desktop:** hover to tilt in 3D; a diagonal glare sweeps across; a single
  click anywhere on the card (except the buttons) flips it.
- **Touch:** tap the card to flip; no tilt (hover isn't real on touch).
- **Keyboard:** the card is focusable; `Enter` / `Space` flips it; the hidden
  face is made `inert` so you never tab onto off-screen links.
- **Reduced motion:** respects `prefers-reduced-motion` — tilt + glare are
  disabled and the flip cross-fades instead of spinning.
- **Performance:** only `transform` / `opacity` animate; the mousemove handler
  is `requestAnimationFrame`-throttled.

## Hosting the secondary site (`app-template/`)

- The **landing page renders fully static** — it falls back to the bundled
  `siteConfig.js` when no backend is present. This is all the card needs.
- The **admin/login/quote** flows use a small Node/Express backend
  (`server/` in the original project, not bundled here since a static drop-in
  can't run it). Deploy those on a Node host if you want them live; otherwise
  those pages display but their forms won't submit.

## Editing content

Everything on the secondary site comes from `app-template/siteConfig.js`
(business name, copy, pricing, colours). Edit that one file to rebrand it, then
refresh the screenshot in `pokecard/template-preview.jpg` if you want the card's
art window to match.
