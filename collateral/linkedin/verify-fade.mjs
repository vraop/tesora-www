import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const F={ inner:211/310.5, fadeIn:[35,58], solid:[58,185], fadeOut:[185,211] };
const OUT=400, C=OUT/2, R=OUT/2, rIn=F.inner*R;
const cw=(a)=>a+90;
const band=(bg)=>`<!doctype html><style>html,body{margin:0}
#w{width:${OUT}px;height:${OUT}px;background:${bg};position:relative;border-radius:50%;overflow:hidden}
#band{position:absolute;inset:0;border-radius:50%;background:#000;
 -webkit-mask-image:
   radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${rIn-0.75}px, #000 ${rIn+0.75}px),
   conic-gradient(from 0deg, rgba(0,0,0,0) ${cw(F.fadeIn[0])}deg, #000 ${cw(F.fadeIn[1])}deg,
                  #000 ${cw(F.fadeOut[0])}deg, rgba(0,0,0,0) ${cw(F.fadeOut[1])}deg);
 -webkit-mask-composite:source-in;mask-composite:intersect}
</style><div id="w"><div id="band"></div></div>`;
const br=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const pg=await br.newPage({viewport:{width:OUT,height:OUT}});
const shots={};
for(const [k,bg] of [['w','#fff'],['b','#000']]){
  await pg.setContent(band(bg)); await pg.waitForTimeout(120);
  shots[k]=(await (await pg.$('#w')).screenshot()).toString('base64');
}
const mine=await pg.evaluate(async(a)=>{
  const rd=async(s)=>{const i=new Image();i.src='data:image/png;base64,'+s;await i.decode();
    const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;
    c.getContext('2d').drawImage(i,0,0);return c.getContext('2d').getImageData(0,0,c.width,c.height);};
  const W=await rd(a.w), B=await rd(a.b);
  const out=[];
  for(let deg=0;deg<360;deg+=2){
    const r=a.R*0.952;                                  // matches LinkedIn probe at r=296/310.5
    const ii=Math.round(a.C+r*Math.cos(deg*Math.PI/180)), j=Math.round(a.C+r*Math.sin(deg*Math.PI/180));
    const o=(j*W.width+ii)*4;
    out.push([deg, Math.max(0,Math.min(1, 1-(W.data[o]-B.data[o])/255))]);
  }
  return out;
}, {w:shots.w, b:shots.b, C, R});
await br.close();

const li=JSON.parse(readFileSync('frame-profile.json','utf8')).ang;
const liMap=new Map(li.map(([a,v])=>[a,v]));
console.log(' deg | LinkedIn | mine  | diff');
console.log('-----+----------+-------+------');
let worst=0, sum=0, n=0;
for(const [deg,v] of mine){
  const L=liMap.get(deg); if(L===undefined) continue;
  const dv=Math.abs(L-v);
  if(deg>=24 && deg<=220){ sum+=dv; n++; if(dv>worst) worst=dv; }
  if(deg%6===0 && deg>=24 && deg<=220)
    console.log(String(deg).padStart(4), '|', L.toFixed(2).padStart(8), '|', v.toFixed(2).padStart(5), '|', dv.toFixed(2));
}
console.log('\nmean |diff| over the frame arc:', (sum/n).toFixed(3), ' worst:', worst.toFixed(3));
