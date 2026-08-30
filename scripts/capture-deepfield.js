// Captures deepfieldgallery.com screenshots for the Websites portfolio.
// Mirrors scripts/capture-metalscalc.js. Run: node scripts/capture-deepfield.js
//
// The card art on casestudies.html is a 16/10-ish cover crop, so the viewport
// capture (not fullPage) is what the card uses. Keep an eye on file size —
// portfolio screenshots have run 1–2 MB each and websites.html's proof cards
// had to be re-shot to get under budget.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '../assets/portfolio/deepfield-gallery');
fs.mkdirSync(OUT, { recursive: true });

// The site shows an essential-cookies notice over the hero. It is HIDDEN for the
// capture rather than dismissed — clicking "Accept" would be consenting on the
// owner's behalf, and this only needs the banner out of the frame.
const HIDE_CONSENT = `
  [class*="cookie" i], [id*="cookie" i],
  [class*="consent" i], [id*="consent" i] { display: none !important; }
`;

(async () => {
  const browser = await chromium.launch();

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('https://deepfieldgallery.com', { waitUntil: 'networkidle', timeout: 45000 });
  await page.addStyleTag({ content: HIDE_CONSENT });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/home.png`, fullPage: false });
  await page.screenshot({ path: `${OUT}/home-tall.png`, fullPage: true });

  // Shop / collections view, if reachable — useful for a detail page later.
  try {
    await page.click('a:has-text("Shop")', { timeout: 5000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/shop.png`, fullPage: false });
  } catch (e) { console.log('Shop link not found, skipping'); }

  const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobPage = await mobCtx.newPage();
  await mobPage.goto('https://deepfieldgallery.com', { waitUntil: 'networkidle', timeout: 45000 });
  await mobPage.addStyleTag({ content: HIDE_CONSENT });
  await mobPage.waitForTimeout(2500);
  await mobPage.screenshot({ path: `${OUT}/mobile-home.png`, fullPage: false });

  await browser.close();
  console.log('Captured to', OUT);
})();

// --- Proof-card capture -------------------------------------------------
// index.html's "Recent work" cards are budgeted: the three of them together
// were deliberately cut from 3.2 MB to ~566 KB and must stay lean. The full
// 1440px PNG above is 787 KB on its own, so the card uses a 1200x750 JPEG
// sized to the card's own width/height attributes instead.
// Run: node scripts/capture-deepfield.js --card
if (process.argv.includes('--card')) {
  (async () => {
    const b = await chromium.launch();
    const c = await b.newContext({ viewport: { width: 1200, height: 750 } });
    const p = await c.newPage();
    await p.goto('https://deepfieldgallery.com', { waitUntil: 'networkidle', timeout: 45000 });
    await p.addStyleTag({ content: HIDE_CONSENT });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${OUT}/card.jpg`, type: 'jpeg', quality: 82, fullPage: false });
    await b.close();
    console.log('Proof-card capture written to', `${OUT}/card.jpg`);
  })();
}
