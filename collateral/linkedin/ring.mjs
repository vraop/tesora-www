import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const src=readFileSync('photo-vr.png').toString('base64');
const br=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const pg=await br.newPage();
// find the circular photo inside the clean asset
const m=await pg.evaluate(async(s)=>{
  const i=new Image(); i.src=s; await i.decode();
  const W=i.naturalWidth,H=i.naturalHeight;
  const c=document.createElement('canvas'); c.width=W;c.height=H;
  const x=c.getContext('2d'); x.drawImage(i,0,0);
  const d=x.getImageData(0,0,W,H).data;
  const bg=[d[0],d[1],d[2]];
  const isBg=(p)=>{const o=p*4;return Math.abs(d[o]-bg[0])<16&&Math.abs(d[o+1]-bg[1])<16&&Math.abs(d[o+2]-bg[2])<16;};
  let x0=W,y0=H,x1=0,y1=0;
  for(let p=0;p<W*H;p++) if(!isBg(p)){const ii=p%W,j=(p-ii)/W;if(ii<x0)x0=ii;if(ii>x1)x1=ii;if(j<y0)y0=j;if(j>y1)y1=j;}
  return {W,H,bg,x0,y0,x1,y1};
}, 'data:image/png;base64,'+src);
console.log('clean source:', m.W+'x'+m.H, 'circle box', [m.x0,m.y0,m.x1,m.y1].join(','),
            '-> diameter', Math.round(Math.min(m.x1-m.x0, m.y1-m.y0)));
const SCX=(m.x0+m.x1)/2, SCY=(m.y0+m.y1)/2, SR=Math.min(m.x1-m.x0, m.y1-m.y0)/2;

const OUT=400, C=OUT/2, R=OUT/2;
const ZOOM=1.15;                             // tighten to match the LinkedIn crop's head size
const k=(R/SR)*ZOOM;
const f=(n)=>Math.round(n*100)/100;
const dw=m.W*k, dh=m.H*k, dx=C-SCX*k, dy=C-SCY*k-R*0.02;
const pt=(a,r)=>[f(C+r*Math.cos(a*Math.PI/180)), f(C+r*Math.sin(a*Math.PI/180))];

function build(kind,label,size){
  const rIn = kind==='crescent' ? R*0.675 : R*0.85;
  const rTxt = kind==='crescent' ? (rIn+R)/2 + size*0.34 : (rIn+R)/2 + size*0.33;
  const [ax,ay]=pt(176,rTxt), [bx,by]=pt(64,rTxt);
  const arc=`M${ax} ${ay} A${f(rTxt)} ${f(rTxt)} 0 0 0 ${bx} ${by}`;
  let shape;
  if(kind==='crescent'){
    const A0=36,A1=206;
    const [ox0,oy0]=pt(A0,R),[ox1,oy1]=pt(A1,R),[ix1,iy1]=pt(A1,rIn),[ix0,iy0]=pt(A0,rIn);
    shape=`<path d="M${ox0} ${oy0} A${R} ${R} 0 0 1 ${ox1} ${oy1} L${ix1} ${iy1} A${f(rIn)} ${f(rIn)} 0 0 0 ${ix0} ${iy0} Z" fill="url(#g)"/>`;
  } else {
    shape=`<circle cx="${C}" cy="${C}" r="${R}" fill="url(#g)" mask="url(#m)"/>`;
  }
  return `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:transparent}
#w{position:relative;width:${OUT}px;height:${OUT}px;border-radius:50%;overflow:hidden}
#w img{position:absolute;left:${f(dx)}px;top:${f(dy)}px;width:${f(dw)}px;height:${f(dh)}px}
svg{position:absolute;inset:0}
text{font-family:"Liberation Sans",Arial,sans-serif;font-weight:700;font-size:${size}px;letter-spacing:.05em;fill:#fff}
</style><div id="w"><img src="data:image/png;base64,${src}">
<svg width="${OUT}" height="${OUT}" viewBox="0 0 ${OUT} ${OUT}">
 <defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
   <stop offset="0" stop-color="#6E009C"/><stop offset=".55" stop-color="#A400E4"/><stop offset="1" stop-color="#C43BFF"/></linearGradient>
  <mask id="m"><circle cx="${C}" cy="${C}" r="${R}" fill="#fff"/><circle cx="${C}" cy="${C}" r="${f(rIn)}" fill="#000"/></mask></defs>
 ${shape}
 <path id="t" d="${arc}" fill="none"/>
 <text><textPath href="#t" startOffset="50%" text-anchor="middle">${label}</textPath></text>
</svg></div>`;
}
const p2=await br.newPage({viewport:{width:OUT,height:OUT}});
for (const [kind,file,size] of [['crescent','linkedin-tesora.png',31],['ring','linkedin-tesora-ring.png',22]]){
  await p2.setContent(build(kind,'#TESORA',size));
  await p2.waitForTimeout(250);
  writeFileSync(file, await (await p2.$('#w')).screenshot({omitBackground:true}));
  console.log('wrote', file);
}
await br.close();
