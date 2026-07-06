import { chromium } from 'playwright-core'
const [url, out] = [process.argv[2], process.argv[3]]
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
const p = await b.newPage({ viewport: { width: 1512, height: 1000 }, deviceScaleFactor: 2 })
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(1200)
await p.screenshot({ path: out, fullPage: true })
await b.close(); console.log('ok')
