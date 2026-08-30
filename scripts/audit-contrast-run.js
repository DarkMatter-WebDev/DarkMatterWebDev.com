// Computed-style contrast sweep driver (the "ancestor walk" pass).
//
//   node scripts/audit-contrast-run.js [--themes dark,light] [--widths 1280,1024,768,390]
//                                      [--pages /a.html,/b.html] [--out results.json]
//
// Needs the local preview running (scripts default to http://localhost:3000;
// override with SWEEP_BASE). Injects scripts/audit-contrast.js and calls its
// window.__sdsAuditContrast().
//
// This pass walks ANCESTORS only, so it is blind to sibling paint, fixed
// overlays and canvas. Always run audit-contrast-pixels.js as well and require
// BOTH to be clean — see the header of audit-contrast.js for why.
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
const OUT = process.env.SWEEP_OUT || arg('out', path.join(ROOT, 'contrast-computed.json'));
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
      const pageErrors = [];
      page.on('pageerror', e => pageErrors.push(String(e).slice(0, 200)));
      for (const p of pages) {
        const rec = { page: p, theme, width };
        try {
          pageErrors.length = 0;
          await page.goto(BASE + p, { waitUntil: 'load', timeout: 45000 });
          // .reveal-up sections stay at opacity 0 until surette-logo.js's
          // IntersectionObserver fires, so the page has to be scrolled or they
          // are silently skipped (64 elements on the homepage alone).
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
          // 2800ms, not 900: long enough for apps.html's physics wordmark intro
          // (~3s) to settle, not just nav.css's ~800ms object reveal.
          await page.waitForTimeout(2800);
          await page.evaluate(() => window.__sdsForceReveal());
          rec.revealOk = await page.evaluate(() => window.__sdsRevealOk());
          Object.assign(rec, await page.evaluate(() => window.__sdsAuditContrast()));
          rec.pageErrors = pageErrors.slice(0, 3);
        } catch (e) {
          rec.error = String(e).slice(0, 300);
        }
        all.push(rec);
        console.log(`${theme}/${width} ${p.padEnd(56)} ${rec.error ? 'ERR ' + rec.error.slice(0, 50)
          : String(rec.failCount).padStart(3) + ' fail  ' + String(rec.checked).padStart(4) + ' checked'
            + (rec.canvases ? '  ' + rec.canvases + ' canvas' : '')}`);
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
