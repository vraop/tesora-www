import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const src=readFileSync('photo-vr.png').toString('base64');

// ---- LinkedIn's frame, measured off the screenshot (fractions of the outer radius)
const F={ inner:211/310.5, fadeIn:[35,58], solid:[58,185], fadeOut:[185,211],
          txtIn:241/310.5, txtOut:282/310.5, txtMid:120.5 };
const OUT=400, C=OUT/2, R=OUT/2;
const SCX=149.5, SCY=144.5, SR=141.5;          // circle in photo-vr.png
const SW=332, SH=301;
const CAP=0.729;                               // Liberation Sans cap height / em
const f=(n)=>Math.round(n*1000)/1000;

const rIn=F.inner*R, rTxt=F.txtOut*R, fs=((F.txtOut-F.txtIn)*R)/CAP;
const cw=(a)=>f(a+90);                         // screen degrees -> conic degrees
const pt=(a,r)=>[f(C+r*Math.cos(a*Math.PI/180)), f(C+r*Math.sin(a*Math.PI/180))];
const [ax,ay]=pt(F.txtMid+34,rTxt), [bx,by]=pt(F.txtMid-34,rTxt);

function html(zoom, dyFrac, label){
  const k=(R/SR)*zoom, dw=SW*k, dh=SH*k;
  const dx=C-SCX*k, dy=C-SCY*k+R*dyFrac;
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
text{font-family:"Liberation Sans",Arial,sans-serif;font-weight:700;font-size:${f(fs)}px;
  letter-spacing:.045em;fill:#fff}
</style><div id="w">
<img id="ph" src="data:image/png;base64,${src}">
<div id="band"></div>
<svg width="${OUT}" height="${OUT}" viewBox="0 0 ${OUT} ${OUT}">
 <path id="t" d="M${ax} ${ay} A${f(rTxt)} ${f(rTxt)} 0 0 0 ${bx} ${by}" fill="none"/>
 <text><textPath href="#t" startOffset="50%" text-anchor="middle">${label}</textPath></text>
</svg></div>`;
}

const br=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const pg=await br.newPage({viewport:{width:OUT,height:OUT}});

// does the opaque crescent land on face skin anywhere between 110 and 215 degrees?
async function faceHits(zoom,dyFrac){
  await pg.setContent(html(zoom,dyFrac,'#TESORA'));
  await pg.waitForTimeout(120);
  const png=(await (await pg.$('#ph')).screenshot({omitBackground:true})).toString('base64');
  return await pg.evaluate(async(a)=>{
    const i=new Image(); i.src='data:image/png;base64,'+a.png; await i.decode();
    const c=document.createElement('canvas'); c.width=a.OUT;c.height=a.OUT;
    const x=c.getContext('2d');
    x.drawImage(i, a.dx, a.dy, a.dw, a.dh);
    const d=x.getImageData(0,0,a.OUT,a.OUT).data;
    const skin=(p)=>p[0]>92&&p[1]>42&&p[2]>18&&p[0]>p[1]&&p[1]>p[2]&&(p[0]-p[1])>13&&(p[0]-p[2])>22;
    let n=0, worst=0;
    for(let j=0;j<a.OUT;j++)for(let ii=0;ii<a.OUT;ii++){
      const o=(j*a.OUT+ii)*4; if(d[o+3]<128) continue;
      if(!skin([d[o],d[o+1],d[o+2]])) continue;
      const rr=Math.hypot(ii-a.C, j-a.C); if(rr<a.rIn || rr>a.R) continue;
      let ang=Math.atan2(j-a.C, ii-a.C)*180/Math.PI; if(ang<0)ang+=360;
      if(ang<110||ang>215) continue;
      n++; const depth=rr-a.rIn; if(depth>worst) worst=depth;
    }
    return {n, worst:Math.round(worst)};
  }, {png, OUT, C, R, rIn, dx:C-SCX*(R/SR)*zoom, dy:C-SCY*(R/SR)*zoom+R*dyFrac,
      dw:SW*(R/SR)*zoom, dh:SH*(R/SR)*zoom});
}

console.log('crescent  : r', f(F.inner)+'R -> 1.00R  | opaque', F.solid.join('-')+'deg',
            '| fades', F.fadeIn.join('-'), 'and', F.fadeOut.join('-'));
console.log('text      : baseline', f(F.txtOut)+'R, cap height', f(F.txtOut-F.txtIn)+'R, font', f(fs)+'px');
console.log('\nface-clearance search (skin px inside the crescent, 110-215deg):');
let best=null;
for(const z of [1.15,1.10,1.05,1.00,0.96,0.92,0.88]){
  const r=await faceHits(z,-0.02);
  console.log(`  zoom ${z.toFixed(2)}  ->  ${String(r.n).padStart(5)} px   deepest ${r.worst}px`);
  if(best===null && r.n<=40) best=z;
}
console.log('\nchosen zoom:', best);
writeFileSync('chosen.json', JSON.stringify({zoom:best}));
for(const [label,file] of [['#TESORA','linkedin-tesora.png']]){
  await pg.setContent(html(best,-0.02,label));
  await pg.waitForTimeout(200);
  writeFileSync(file, await (await pg.$('#w')).screenshot({omitBackground:true}));
  console.log('wrote', file);
}
await br.close();
