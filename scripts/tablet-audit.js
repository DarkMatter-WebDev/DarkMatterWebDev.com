const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'http://127.0.0.1:4173';

const PAGES = [
  'index.html',
  'apps.html',
  'app-catalog.html',
  'app-pricing.html',
  'casestudies.html',
  'contact.html',
  'built-by.html',
  'services/website-design-hosting.html',
  'services/in-home-services.html',
  'services/office-network-setup.html',
  'portfolio-seansads.html',
  'portfolio-naplesestatejewelry.html',
  'account.html',
  'auction-house-consignment-store-software.html',
];

const VIEWPORTS = [
  { name: 'tablet-portrait', width: 834, height: 1194 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'tablet-narrow', width: 768, height: 1024 },
];

async function auditPage(page, url, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollW = Math.max(doc.scrollWidth, body ? body.scrollWidth : 0);
    const clientW = doc.clientWidth;
    const overflowX = scrollW - clientW;

    const nav = document.querySelector('nav.fixed.top-0, header.fixed.top-0');
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const navLinks = nav ? Array.from(nav.querySelectorAll('a, button')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }) : [];
    let navOverlap = false;
    for (let i = 0; i < navLinks.length; i++) {
      for (let j = i + 1; j < navLinks.length; j++) {
        const a = navLinks[i].getBoundingClientRect();
        const b = navLinks[j].getBoundingClientRect();
        const overlap = !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
        if (overlap && Math.abs(a.top - b.top) < 40) navOverlap = true;
      }
    }

    const clipped = [];
    document.querySelectorAll('a, button, .sds-btn-primary, .sds-btn-secondary, .portfolio-tile, h1, h2').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (r.right > clientW + 2 || r.left < -2) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString().slice(0, 80);
        clipped.push({ tag, cls, right: Math.round(r.right), left: Math.round(r.left), w: clientW });
      }
    });

    const desktopShell = !!document.querySelector('.hidden.md\\:block');
    const mobileShell = !!document.querySelector('.md\\:hidden');

    return {
      overflowX,
      navOverlap,
      navHeight: navRect ? Math.round(navRect.height) : null,
      clipped: clipped.slice(0, 12),
      desktopShell,
      mobileShell,
    };
  });

  return metrics;
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];

  for (const vp of VIEWPORTS) {
    for (const rel of PAGES) {
      const url = `${BASE}/${rel.replace(/\\/g, '/')}`;
      try {
        const m = await auditPage(page, url, vp);
        if (m.overflowX > 2 || m.navOverlap || m.clipped.length) {
          results.push({ page: rel, viewport: vp.name, ...m });
        }
      } catch (err) {
        results.push({ page: rel, viewport: vp.name, error: String(err.message || err) });
      }
    }
  }

  await browser.close();
  const outPath = path.join(ROOT, 'scripts', 'tablet-audit-results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Wrote ${results.length} issue rows to ${outPath}`);
  for (const row of results) {
    if (row.error) {
      console.log(`[${row.viewport}] ${row.page}: ERROR ${row.error}`);
      continue;
    }
    console.log(`[${row.viewport}] ${row.page}: overflow=${row.overflowX}px navOverlap=${row.navOverlap} clipped=${row.clipped.length}`);
  }
})();
