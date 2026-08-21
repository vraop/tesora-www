import { chromium } from 'playwright-core';
import { fileURLToPath } from 'url';
import path from 'path';

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const file = process.argv[2];
const outDir = process.argv[3] || path.dirname(file);
const only = process.argv[4];

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
await page.addStyleTag({content: (await import('node:fs')).readFileSync('/tmp/claude-0/-home-user-tesora-www/e26d6849-dd06-5ce8-96ca-433d6be610a4/scratchpad/fonts-inline.css','utf8')});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(600);

const slides = await page.$$('.slide');
console.log('found', slides.length, 'slides');
for (let i = 0; i < slides.length; i++) {
  if (only && String(i + 1) !== only) continue;
  const n = String(i + 1).padStart(2, '0');
  await slides[i].screenshot({ path: path.join(outDir, `slide-${n}.png`) });
  console.log('wrote slide-' + n + '.png');
}
await browser.close();
