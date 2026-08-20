import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const br=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const pg=await br.newPage();
const out=await pg.evaluate(async(args)=>{
  const load=async(s)=>{const i=new Image();i.src=s;await i.decode();
    const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;
    const x=c.getContext('2d');x.drawImage(i,0,0);
    return {W:c.width,H:c.height,d:x.getImageData(0,0,c.width,c.height).data};};
  const A=await load(args.framed), B=await load(args.clean);

  // --- A: exact boundary of the fully opaque crescent
  const at=(im,ii,j)=>{const o=(Math.round(j)*im.W+Math.round(ii))*4;return [im.d[o],im.d[o+1],im.d[o+2]];};
  const cx=369.5, cy=338.5, R=311.5;
  const solid=(p)=>Math.abs(p[0]-130)<7&&Math.abs(p[1]-68)<7&&Math.abs(p[2]-203)<7;
  const inner=[], ends=[];
  for(let a=0;a<360;a++){
    let lo=null, hi=null;
    for(let r=R-1;r>=R*0.5;r-=0.5){
      const q=[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];
      if(solid(at(A,q[0],q[1]))){ if(hi===null) hi=r; lo=r; }
      else if(hi!==null && r<lo-4) break;
    }
    if(hi!==null){ inner.push([a, +lo.toFixed(1), +hi.toFixed(1)]); ends.push(a); }
  }
  // fade width measured radially inward from the solid inner edge, at a solid-zone angle
  const fade=[];
  for(const a of [90,110,130,150]){
    const e=inner.find(v=>v[0]===a); if(!e) continue;
    const row=[];
    for(let r=e[1]+6;r>=e[1]-46;r-=2){
      const q=[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];
      row.push([+ (r-e[1]).toFixed(0), at(A,q[0],q[1])]);
    }
    fade.push([a,row]);
  }
  // --- B: where is his face in the clean asset
  const skin=(p)=>p[0]>92&&p[1]>42&&p[2]>18&&p[0]>p[1]&&p[1]>p[2]&&(p[0]-p[1])>13&&(p[0]-p[2])>22;
  let sx0=1e9,sy0=1e9,sx1=0,sy1=0,n=0;
  for(let j=0;j<B.H;j++)for(let ii=0;ii<B.W;ii++){
    const o=(j*B.W+ii)*4;
    if(!skin([B.d[o],B.d[o+1],B.d[o+2]])) continue;
    n++; if(ii<sx0)sx0=ii; if(ii>sx1)sx1=ii; if(j<sy0)sy0=j; if(j>sy1)sy1=j;
  }
  // dark hair mass, to get the top of the head
  let hy0=1e9;
  for(let j=0;j<B.H;j++){let run=0;
    for(let ii=0;ii<B.W;ii++){const o=(j*B.W+ii)*4;
      if(B.d[o]<62&&B.d[o+1]<62&&B.d[o+2]<62) run++;}
    if(run>26){hy0=j;break;}
  }
  return {solidAngles:[ends[0],ends[ends.length-1]], innerByAngle:inner.filter(v=>v[0]%10===0),
          fade, skinBox:[sx0,sy0,sx1,sy1], skinPx:n, hairTop:hy0, cleanDims:[B.W,B.H]};
}, {framed:'data:image/png;base64,'+readFileSync('paste-74.png').toString('base64'),
    clean:'data:image/png;base64,'+readFileSync('photo-vr.png').toString('base64')});
await br.close();
console.log('opaque crescent spans deg', JSON.stringify(out.solidAngles));
console.log('inner/outer radius by angle (deg, inner, outer):');
console.log('  '+out.innerByAngle.map(v=>`${v[0]}:${v[1]}-${v[2]}`).join('  '));
console.log('\nfade inward from the solid edge (offset px -> rgb):');
out.fade.forEach(([a,row])=>console.log(`  ${a}deg: `+row.filter((_,k)=>k%3===0).map(([o,c])=>`${o}:${c.join(',')}`).join('  ')));
console.log('\nclean asset', out.cleanDims.join('x'), '| skin bbox', out.skinBox.join(','), '| skin px', out.skinPx, '| hair top y=', out.hairTop);
writeFileSync('frame-geo.json', JSON.stringify(out));
