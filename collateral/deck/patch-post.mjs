import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b64=readFileSync('post-src.webp').toString('base64');
const W=1206,H=1134;
const c=JSON.parse(process.argv[2]);
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:3});
await p.setContent(`<!doctype html><style>
*{margin:0;padding:0}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:#fff}
img{width:${W}px;height:${H}px;display:block}
.p{position:absolute;background:#fff}
.ttl{position:absolute;left:${c.tx}px;top:${c.ty}px;font-family:Arial,Helvetica,sans-serif;font-weight:700;
  color:#1B3A63;font-size:${c.fs}px;line-height:${c.lh}px;letter-spacing:-0.6px}
.col{position:absolute;left:${c.cx}px;top:${c.cy}px;font-family:Arial,Helvetica,sans-serif;
  color:#1D2226;font-size:${c.cfs}px;line-height:1}
</style><img src="data:image/webp;base64,${b64}">
<div class="p" style="left:6px;top:274px;width:215px;height:150px"></div>
<div class="ttl">What<br>Actuaries<br>Deliver</div>
<div class="p" style="left:${c.ex}px;top:${c.ey}px;width:${c.ew}px;height:${c.eh}px"></div>
<div class="col">:</div>`);
await p.waitForTimeout(500);
await p.screenshot({path:'asset-post.png'});
await b.close(); console.log('ok');
