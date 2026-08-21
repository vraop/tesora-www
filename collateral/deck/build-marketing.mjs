import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const dir = '/tmp/claude-0/-home-user-tesora-www/e26d6849-dd06-5ce8-96ca-433d6be610a4/scratchpad';
let html = readFileSync(path.join(dir, 'tesora-marketing.html'), 'utf8');
const assets = [['asset-rater-gui.webp','webp'],['asset-post.png','png'],['asset-compete.png','png'],['asset-foundation.png','png'],['asset-tesora-chat.png','png'],['asset-reserving.png','png'],['asset-triangle.png','png'],['asset-bernegger.png','png'],['asset-soc2.png','png'],['photo-vr.png','png'],['photo-fr.png','png'],['photo-pb.png','png'],['photo-mp.png','png'],['photo-el.png','png'],['adv-ethan.png','png'],['adv-mario.png','png'],['adv-joanne.png','png']];
for (const [f, type] of assets) {
  if (!existsSync(path.join(dir, f))) { console.log('skip missing', f); continue; }
  const b64 = readFileSync(path.join(dir, f)).toString('base64');
  html = html.split(`src="${f}"`).join(`src="data:image/${type};base64,${b64}"`);
}
// The Google Fonts link does not resolve in this container, so print-to-PDF was
// silently falling back to Liberation Sans. Inline the real faces, same as the
// artifact build does.
const fonts = readFileSync(path.join(dir,'fonts-inline.css'),'utf8');
html = html.replace(/<link rel="preconnect"[^>]*>\s*/g,'');
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/,'');
html = html.replace('<style>', '<style>\n'+fonts+'\n');

const standalone = path.join(dir, 'tesora-marketing-standalone.html');
writeFileSync(standalone, html);
console.log('wrote standalone', (html.length/1024).toFixed(0)+'kb');
const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('file://' + standalone, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '@page{size:1280px 720px;margin:0}' });
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: path.join(dir,'Tesora-Marketing.pdf'), width:'1280px', height:'720px', printBackground:true, preferCSSPageSize:true });
await browser.close();
console.log('wrote Tesora-Marketing.pdf');
