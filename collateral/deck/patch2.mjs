import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b64=readFileSync('tree-src.png').toString('base64');
const W=1206,H=820, S=3;
const c=JSON.parse(process.argv[2]);
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:S});
await p.setContent(`<!doctype html><style>
*{margin:0;padding:0}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden}
img{width:${W}px;height:${H}px;display:block}
.patch{position:absolute;left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;background:#fff}
.t{position:absolute;left:${c.tx}px;top:${c.ty}px;
  font-family:Arial,Helvetica,sans-serif;font-weight:700;color:${c.col};
  font-size:${c.fs}px;line-height:${c.lh}px;letter-spacing:${c.ls}px}
</style><img src="data:image/png;base64,${b64}">
<div class="patch"></div><div class="t">What<br>Actuaries<br>Deliver</div>`);
await p.waitForTimeout(400);
await p.screenshot({path:'asset-tree-clean.png'});
await b.close(); console.log('ok');
