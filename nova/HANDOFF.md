# Nova Particle Background — Implementation Handoff

## For the implementing AI agent — READ FIRST

**Use `nova-widget.html` exactly as-is.** It is a finished, self-contained widget. Do **not**
refactor it, rename anything, change the shader, restructure the engine, "clean it up,"
or rewrite it in a framework. The only thing you are permitted to change is the values
inside the `CONFIG` object (see below).

The file is fully self-contained: it pulls Three.js from a CDN (`esm.sh`) at runtime, so
there are **no build steps, no npm install, no bundler**. Drop it in and it works.

---

## What it is

A WebGL particle "galaxy" background — a glowing gold core surrounded by a purple
particle disk that slowly rotates and shimmers. It renders to a `<canvas>` injected into
a mount `<div>`. The old "Nova" text overlay from the original source has been removed.

---

## How to embed it in the website

Pick whichever fits the host page:

**Option A — drop-in page / hero section (simplest):**
Serve `nova-widget.html` directly, or copy its three pieces into the target page:
1. the `#nova-bg` styles from the `<style>` block,
2. the `<div id="nova-bg"></div>` mount element,
3. the entire `<script type="module">…</script>` block.

**Option B — background behind existing content:**
The mount div is already `position: fixed; inset: 0; z-index: -1`, so it sits behind all
page content automatically. Just make sure page content has a higher stacking context
(normal flow content will). If you'd rather mount it inside a specific container instead
of the full viewport, set `CONFIG.mountSelector` to that container's selector and give
that container `position: relative` and an explicit height.

> Requirement: the script tag **must** be `type="module"` (it uses ES module imports).
> The host page must be served over http/https (CDN imports won't load from `file://`
> in some browsers — for local testing use a static server or just open the file directly,
> most modern browsers allow it).

---

## The ONLY things you may change — the `CONFIG` block

Inside the module script, between the clearly marked
`▼ MODIFIABLE VARIABLES` / `▲ END OF MODIFIABLE VARIABLES` banners:

| Variable          | Default            | What it does |
|-------------------|--------------------|--------------|
| `mountSelector`   | `"#nova-bg"`       | CSS selector of the container the canvas mounts into. |
| `backgroundColor` | `0x160016`         | Scene background color (hex). |
| `colorInner`      | `[227, 155, 0]`    | Warm core color, RGB 0–255 (gold). |
| `colorOuter`      | `[100, 50, 255]`   | Outer rim color, RGB 0–255 (purple). |
| `coreParticles`   | `50000`            | Particle count in the bright core. |
| `diskParticles`   | `100000`           | Particle count in the surrounding disk. |
| `particleSize`    | `0.125`            | Base particle size. |
| `cameraHeight`    | `4`                | Camera Y position. |
| `cameraDistance`  | `21`               | Camera Z position (zoom; larger = further out). |
| `tilt`            | `0.2`              | Disk tilt in radians. |
| `animationSpeed`  | `0.5`              | Shimmer/flow speed of particles. |
| `rotationSpeed`   | `0.05`            | Auto-spin speed of the whole galaxy. |
| `enableControls`  | `true`             | Let visitors drag to orbit the camera. Set `false` for a static background. |

**Performance note:** `coreParticles + diskParticles` is the main cost. The default
150,000 looks like the reference image but is GPU-heavy. On low-end / mobile targets,
lower both (e.g. `20000` / `40000`). Do not touch anything outside `CONFIG`.

---

## Everything below `END OF MODIFIABLE VARIABLES` is the engine — leave it alone.
