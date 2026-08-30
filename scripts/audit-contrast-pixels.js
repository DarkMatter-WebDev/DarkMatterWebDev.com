// Rendered-pixel contrast sweep driver.
//
//   node scripts/audit-contrast-pixels.js [--themes dark,light]
//        [--widths 1280,1024,768,390] [--pages /a.html] [--out results.json]
//
// Hides every glyph, screenshots the viewport, and samples the exact line boxes
// the glyphs occupied. This is the pass that finds real defects — computed
// style cannot see sibling paint, fixed veils, canvas or photos.
//
// Four things here exist because each produced FALSE failures:
//
//  1. Viewport captures, never fullPage. A full-page capture re-composites
//     fixed layers and produced impossible grounds (near-black AND near-white
//     inside one line box) at 390px.
//  2. Rects are re-measured live and BRACKETED around the capture; a box that
//     moved between the two measurements is dropped. Stale doc coords drift,
//     fixed chrome does not move with the page, and a still-animating scroll
//     puts the rect somewhere the screenshot never showed.
//  3. Per box, keep the BEST-CENTRED sample, not the worst across scroll steps.
//     One bad step (content settling at the viewport edge) would otherwise
//     define the result — that is what made portfolio.html's cream card report
//     as dark-on-dark.
//  4. Occlusion is judged per line by __sdsRectsNow, not per element. A
//     paragraph whose first lines sit behind the fixed header is still a
//     visible element, and those lines would be scored against the nav's fill.
//
// Known blind spot: a <canvas> with pointer-events:none is invisible to the
// occlusion probe (elementFromPoint skips it), so text under canvas art can
// measure as unobstructed. Look at canvas heroes by eye.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.SWEEP_BASE || 'http://localhost:3000';
const AUDIT = path.join(ROOT, 'scripts', 'audit-contrast.js');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : def;
}
const themes = arg('themes', 'dark,light').split(',');
const widths = arg('widths', '1280,1024,768,390').split(',').map(Number);
const OUT = process.env.SWEEP_OUT || arg('out', path.join(ROOT, 'contrast-pixels.json'));
const only = arg('pages', '');
const pages = only ? only.split(',')
  : fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => '/' + f)
      .concat(fs.readdirSync(path.join(ROOT, 'services'))
        .filter(f => f.endsWith('.html')).map(f => '/services/' + f));

(async () => {
  const browser = await chromium.launch();
  const all = [];
  for (const theme of themes) {
    for (const width of widths) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      await ctx.addInitScript(t => { try { localStorage.setItem('sds-theme', t); } catch (e) {} }, theme);
      const page = await ctx.newPage();
      for (const p of pages) {
        const rec = { page: p, theme, width };
        try {
          await page.goto(BASE + p, { waitUntil: 'load', timeout: 45000 });
          await page.evaluate(async () => {
            const step = Math.round(window.innerHeight * 0.8);
            for (let y = 0; y < document.body.scrollHeight; y += step) {
              window.scrollTo(0, y);
              await new Promise(r => setTimeout(r, 60));
            }
            window.scrollTo(0, 0);
          });
          await page.addScriptTag({ path: AUDIT });
          await page.evaluate(() => window.__sdsForceReveal());
          await page.waitForTimeout(2800);
          await page.evaluate(() => window.__sdsForceReveal());

          const boxes = await page.evaluate(() => window.__sdsCollectTextBoxes());
          const byId = new Map(boxes.map(b => [b.id, b]));
          const best = new Map();
          const seenAny = new Set();
          const geom = await page.evaluate(() => ({ vh: window.innerHeight, h: document.body.scrollHeight }));
          const step = Math.round(geom.vh * 0.85);

          for (let y = 0; y <= Math.max(0, geom.h - 1); y += step) {
            await page.evaluate(yy => window.scrollTo(0, yy), y);
            await page.waitForTimeout(160);
            const seen = await page.evaluate(bx => window.__sdsProbeVisible(bx), boxes);
            const ids = Object.keys(seen).map(Number);
            if (!ids.length) continue;

            await page.evaluate(() => window.__sdsHideText());
            await page.waitForTimeout(80);
            const before = await page.evaluate(i => window.__sdsRectsNow(i), ids);
            const shot = await page.screenshot({ type: 'png' });
            const after = await page.evaluate(i => window.__sdsRectsNow(i), ids);
            const same = (a, b) => a && b && a.length === b.length &&
              a.every((r, i) => Math.abs(r.x - b[i].x) < 0.5 && Math.abs(r.y - b[i].y) < 0.5 &&
                                Math.abs(r.w - b[i].w) < 0.5 && Math.abs(r.h - b[i].h) < 0.5);

            const local = [];
            const centring = new Map();
            for (const id of ids) {
              const b = byId.get(id);
              if (!b || !same(before[id], after[id])) continue;
              const rs = after[id];
              const cy = rs.reduce((a, r) => a + r.y + r.h / 2, 0) / rs.length;
              centring.set(id, Math.abs(cy - geom.vh / 2));
              local.push({ ...b, rects: rs });
              seenAny.add(id);
            }
            if (local.length) {
              const res = await page.evaluate(
                ([d, bx]) => window.__sdsSampleGround(d, bx, window.devicePixelRatio),
                ['data:image/png;base64,' + shot.toString('base64'), local]
              );
              for (const r of res) {
                const prev = best.get(r.id);
                const d = centring.get(r.id);
                if (!prev || d < prev.__d) best.set(r.id, Object.assign(r, { __d: d }));
              }
            }
            await page.evaluate(() => {
              const s = document.getElementById('__sds-hide-text');
              if (s) s.remove();
            });
          }
          await page.evaluate(() => window.scrollTo(0, 0));

          const res = [...best.values()];
          rec.boxes = res.length;
          rec.collected = boxes.length;
          rec.unsampled = boxes.length - seenAny.size;
          rec.fails = res.filter(r => r.fails).sort((a, b) => a.median - b.median);
          rec.failCount = rec.fails.length;
          rec.review = res.filter(r => r.review).length;
          rec.thin = res.filter(r => !r.fails && r.median < r.need * 1.15).length;
        } catch (e) {
          rec.error = String(e).slice(0, 200);
        }
        all.push(rec);
        console.log(`${theme}/${width} ${p.padEnd(56)} ${rec.error ? 'ERR ' + rec.error.slice(0, 50)
          : String(rec.failCount).padStart(3) + ' fail  ' + String(rec.boxes).padStart(4) + '/'
            + String(rec.collected).padEnd(4) + ' boxes  thin ' + rec.thin + '  review ' + rec.review}`);
      }
      await ctx.close();
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(all, null, 1));
  console.log('\nTOTAL fails ' + all.reduce((a, r) => a + (r.failCount || 0), 0)
    + '   records ' + all.length + '   errors ' + all.filter(r => r.error).length);
  console.log('wrote ' + OUT);
  await browser.close();
})();
