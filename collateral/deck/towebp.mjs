import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const jobs=[
  ['asset-post.png','png',1500,0.86],['asset-triangle.png','png',1500,0.86],
  ['asset-bernegger.png','png',1500,0.84],['asset-compete.png','png',1200,0.88],
  ['adv-ethan.png','png',300,0.85],['adv-mario.png','png',300,0.85],['adv-joanne.png','png',300,0.85],
  ['photo-vr.png','png',300,0.85],['photo-fr.png','png',300,0.85],['photo-pb.png','png',300,0.85],
  ['photo-mp.png','png',300,0.85],['photo-el.png','png',300,0.85],
  ['asset-foundation.png','png',400,0.9],
  ['asset-soc2.png','png',260,0.92],
];
const b=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const p=await b.newPage();
for(const [f,type,maxw,q] of jobs){
  const b64=readFileSync(f).toString('base64');
  const out=await p.evaluate(async ({src,maxw,q})=>{
    const i=new Image(); i.src=src; await i.decode();
    const scale=Math.min(1, maxw/i.naturalWidth);
    const c=document.createElement('canvas');
    c.width=Math.round(i.naturalWidth*scale); c.height=Math.round(i.naturalHeight*scale);
    c.getContext('2d').drawImage(i,0,0,c.width,c.height);
    return c.toDataURL('image/webp',q);
  },{src:`data:image/${type};base64,${b64}`,maxw,q});
  const buf=Buffer.from(out.split(',')[1],'base64');
  const name=f.replace(/\.(png|webp)$/,'')+'-web.webp';
  writeFileSync(name,buf);
  console.log(name, (buf.length/1024).toFixed(0)+'KB');
}
await b.close();
