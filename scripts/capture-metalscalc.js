const { chromium } = require('playwright');
const path = require('path');

const OUT_APP = path.join(__dirname, '../assets/apps/metalscalc');
const OUT_SITE = path.join(__dirname, '../assets/portfolio/metalscalc');

(async () => {
  const browser = await chromium.launch();

  // --- app.metalscalc.com screenshots ---
  const appCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const appPage = await appCtx.newPage();
  await appPage.goto('https://app.metalscalc.com', { waitUntil: 'networkidle', timeout: 30000 });
  await appPage.waitForTimeout(2000);
  await appPage.screenshot({ path: `${OUT_APP}/metalscalc-dashboard.png`, fullPage: false });

  // Try to click the Single tab
  try {
    await appPage.click('text=Single', { timeout: 4000 });
    await appPage.waitForTimeout(800);
    await appPage.screenshot({ path: `${OUT_APP}/metalscalc-single.png`, fullPage: false });
  } catch(e) { console.log('Single tab not found, skipping'); }

  // Try to click the Invoices tab
  try {
    await appPage.click('text=Invoices', { timeout: 4000 });
    await appPage.waitForTimeout(800);
    await appPage.screenshot({ path: `${OUT_APP}/metalscalc-invoices.png`, fullPage: false });
  } catch(e) { console.log('Invoices tab not found, skipping'); }

  // Mobile view of app
  const appMobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const appMobPage = await appMobCtx.newPage();
  await appMobPage.goto('https://app.metalscalc.com', { waitUntil: 'networkidle', timeout: 30000 });
  await appMobPage.waitForTimeout(2000);
  await appMobPage.screenshot({ path: `${OUT_APP}/metalscalc-mobile.png`, fullPage: false });

  // --- metalscalc.com landing page screenshots ---
  const siteCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const sitePage = await siteCtx.newPage();
  await sitePage.goto('https://metalscalc.com', { waitUntil: 'networkidle', timeout: 30000 });
  await sitePage.waitForTimeout(2000);
  await sitePage.screenshot({ path: `${OUT_SITE}/home.png`, fullPage: false });
  await sitePage.screenshot({ path: `${OUT_SITE}/home-tall.png`, fullPage: true });

  // Mobile view of landing
  const siteMobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const siteMobPage = await siteMobCtx.newPage();
  await siteMobPage.goto('https://metalscalc.com', { waitUntil: 'networkidle', timeout: 30000 });
  await siteMobPage.waitForTimeout(2000);
  await siteMobPage.screenshot({ path: `${OUT_SITE}/mobile-home.png`, fullPage: false });

  await browser.close();
  console.log('All screenshots captured.');
})();
