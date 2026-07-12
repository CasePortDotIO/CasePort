// Usage: node scripts/shot.mjs <url> <out.png> [width] [height] [fullPage?] [selector?]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const [url, out, w = '1440', h = '900', full = 'true', selector = ''] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 3500 }); } catch {}
await page.waitForTimeout(1200); // fonts-ready gate
// Trigger reveal-on-scroll, then force any remaining .r visible for a complete capture.
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += Math.round(window.innerHeight * 0.5)) { window.scrollTo(0, y); await sleep(40); }
  window.scrollTo(0, 0);
  document.querySelectorAll('.r').forEach((el) => el.classList.add('in'));
  await sleep(150);
});
await page.waitForTimeout(350);
if (selector) {
  const el = await page.$(selector);
  if (!el) { console.log('SELECTOR NOT FOUND: ' + selector); await browser.close(); process.exit(1); }
  await el.screenshot({ path: out });
} else {
  await page.screenshot({ path: out, fullPage: full === 'true' });
}
await browser.close();
if (errors.length) console.log('CONSOLE ERRORS:\n' + errors.join('\n'));
else console.log('OK no console errors -> ' + out);
