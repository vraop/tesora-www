import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b64=readFileSync('asset-tree.png').toString('base64');
const W=3606,H=2454;
const cfg=JSON.parse(process.argv[2]);
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H}});
await p.setContent(`<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden}
img{width:${W}px;height:${H}px;display:block}
.patch{position:absolute;left:${cfg.x}px;top:${cfg.y}px;width:${cfg.w}px;height:${cfg.h}px;background:#fff}
.title{position:absolute;left:${cfg.tx}px;top:${cfg.ty}px;
  font-family:'Figtree',sans-serif;font-weight:800;color:${cfg.color};
  font-size:${cfg.fs}px;line-height:${cfg.lh}px;letter-spacing:${cfg.ls}px}
</style></head><body>
<img src="data:image/png;base64,${b64}">
<div class="patch"></div>
<div class="title">What<br>Actuaries<br>Deliver</div>
</body></html>`);
await p.waitForTimeout(1200);
await p.screenshot({path:'asset-tree-clean.png'});
await b.close();
console.log('wrote asset-tree-clean.png');
