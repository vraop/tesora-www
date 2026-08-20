import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// LinkedIn frame spec, measured off the screenshot (fractions of outer radius / screen degrees)
const F={ inner:211/310.5, fadeIn:[35,58], solid:[58,185], fadeOut:[185,211],
          txtIn:241/310.5, txtOut:282/310.5, txtMid:120.5 };
const OUT=400, C=OUT/2, R=OUT/2, CAP=0.729;
const rIn=F.inner*R, rTxt=F.txtOut*R, fs=((F.txtOut-F.txtIn)*R)/CAP;
const f=(n)=>Math.round(n*1000)/1000;
const cw=(a)=>f(a+90);
const pt=(a,r)=>[f(C+r*Math.cos(a*Math.PI/180)), f(C+r*Math.sin(a*Math.PI/180))];
const [ax,ay]=pt(F.txtMid+34,rTxt), [bx,by]=pt(F.txtMid-34,rTxt);

const PEOPLE=[
  ['photo-vr.png','Vivek Rao','linkedin-vivek.png'],
  ['photo-fr.png','Federico Reyes','linkedin-federico.png'],
  ['photo-pb.png','Philo Bishay','linkedin-philo.png'],
  ['photo-mp.png','Michael Palmich','linkedin-michael.png'],
  ['photo-el.png','Eric Lam','linkedin-eric.png'],
];

const br=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const pg=await br.newPage({viewport:{width:OUT,height:OUT}});

async function circleOf(b64){
  return pg.evaluate(async(s)=>{
    const i=new Image(); i.src=s; await i.decode();
    const W=i.naturalWidth,H=i.naturalHeight;
    const c=document.createElement('canvas'); c.width=W;c.height=H;
    const x=c.getContext('2d'); x.drawImage(i,0,0);
    const d=x.getImageData(0,0,W,H).data;
    const bg=[d[0],d[1],d[2]];
    const isBg=(p)=>{const o=p*4;return Math.abs(d[o]-bg[0])<16&&Math.abs(d[o+1]-bg[1])<16&&Math.abs(d[o+2]-bg[2])<16;};
    let x0=W,y0=H,x1=0,y1=0;
    for(let p=0;p<W*H;p++) if(!isBg(p)){const ii=p%W,j=(p-ii)/W;if(ii<x0)x0=ii;if(ii>x1)x1=ii;if(j<y0)y0=j;if(j>y1)y1=j;}
    return {W,H,cx:(x0+x1)/2, cy:(y0+y1)/2, r:Math.min(x1-x0,y1-y0)/2};
  }, 'data:image/png;base64,'+b64);
}

function html(b64,g,zoom,dyFrac,label){
  const k=(R/g.r)*zoom, dw=g.W*k, dh=g.H*k;
  const dx=C-g.cx*k, dy=C-g.cy*k+R*dyFrac;
  return `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:transparent}
#w{position:relative;width:${OUT}px;height:${OUT}px;border-radius:50%;overflow:hidden}
#ph{position:absolute;left:${f(dx)}px;top:${f(dy)}px;width:${f(dw)}px;height:${f(dh)}px}
#band{position:absolute;inset:0;border-radius:50%;
  background:linear-gradient(to top right,#6E009C 0%,#A400E4 55%,#C43BFF 100%);
  -webkit-mask-image:
    radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${f(rIn-0.75)}px, #000 ${f(rIn+0.75)}px),
    conic-gradient(from 0deg, rgba(0,0,0,0) ${cw(F.fadeIn[0])}deg, #000 ${cw(F.fadeIn[1])}deg,
                   #000 ${cw(F.fadeOut[0])}deg, rgba(0,0,0,0) ${cw(F.fadeOut[1])}deg);
  -webkit-mask-composite:source-in;mask-composite:intersect}
svg{position:absolute;inset:0}
text{font-family:"Liberation Sans",Arial,sans-serif;font-weight:700;font-size:${f(fs)}px;letter-spacing:.045em;fill:#fff}
</style><div id="w">
<img id="ph" src="data:image/png;base64,${b64}">
<div id="band"></div>
<svg width="${OUT}" height="${OUT}" viewBox="0 0 ${OUT} ${OUT}">
 <path id="t" d="M${ax} ${ay} A${f(rTxt)} ${f(rTxt)} 0 0 0 ${bx} ${by}" fill="none"/>
 <text><textPath href="#t" startOffset="50%" text-anchor="middle">${label}</textPath></text>
</svg></div>`;
}

async function faceHits(b64,g,zoom,dyFrac){
  await pg.setContent(html(b64,g,zoom,dyFrac,'#TESORA'));
  await pg.waitForTimeout(90);
  const png=(await (await pg.$('#ph')).screenshot({omitBackground:true})).toString('base64');
  const k=(R/g.r)*zoom;
  return pg.evaluate(async(a)=>{
    const i=new Image(); i.src='data:image/png;base64,'+a.png; await i.decode();
    const c=document.createElement('canvas'); c.width=a.OUT;c.height=a.OUT;
    const x=c.getContext('2d'); x.drawImage(i,a.dx,a.dy,a.dw,a.dh);
    const d=x.getImageData(0,0,a.OUT,a.OUT).data;
    const skin=(p)=>p[0]>92&&p[1]>42&&p[2]>18&&p[0]>p[1]&&p[1]>p[2]&&(p[0]-p[1])>13&&(p[0]-p[2])>22;
    let n=0,worst=0;
    for(let j=0;j<a.OUT;j++)for(let ii=0;ii<a.OUT;ii++){
      const o=(j*a.OUT+ii)*4; if(d[o+3]<128) continue;
      if(!skin([d[o],d[o+1],d[o+2]])) continue;
      const rr=Math.hypot(ii-a.C,j-a.C); if(rr<a.rIn||rr>a.R) continue;
      let ang=Math.atan2(j-a.C,ii-a.C)*180/Math.PI; if(ang<0)ang+=360;
      if(ang<110||ang>215) continue;
      n++; if(rr-a.rIn>worst) worst=rr-a.rIn;
    }
    return {n,worst:Math.round(worst)};
  }, {png,OUT,C,R,rIn,dx:C-g.cx*k,dy:C-g.cy*k+R*dyFrac,dw:g.W*k,dh:g.H*k});
}

for (const [file,name,outfile] of PEOPLE){
  const b64=readFileSync(file).toString('base64');
  const g=await circleOf(b64);
  // zoom never drops below 1.0 or the source circle stops filling the frame and
  // its own dark surround shows. Raise the crop instead: the crescent is lower-left.
  // score every framing, then take the cleanest. Ties go to the larger zoom and to
  // the offset closest to the natural crop.
  let best=null;
  for (const z of [1.14,1.10,1.06,1.02,1.00]){
    for (const d of [-0.02,-0.05,-0.08,-0.11,-0.14]){
      const r=await faceHits(b64,g,z,d);
      const score=r.n*1000 + r.worst*200 + (1.14-z)*40 + Math.abs(d+0.02)*300;
      if (best===null || score<best.score) best={z,d,r,score};
      if (r.n===0 && d===-0.02) break;
    }
    if (best && best.r.n===0 && best.d===-0.02) break;
  }
  const chosen=best.z, dy=best.d, res=best.r;
  await pg.setContent(html(b64,g,chosen,dy,'#TESORA'));
  await pg.waitForTimeout(160);
  writeFileSync(outfile, await (await pg.$('#w')).screenshot({omitBackground:true}));
  console.log(`${name.padEnd(16)} circle d=${Math.round(g.r*2)}px  zoom ${chosen.toFixed(2)} dy ${dy.toFixed(2)}  skin-in-crescent ${res.n}px (deepest ${res.worst}px)  -> ${outfile}`);
}
await br.close();
