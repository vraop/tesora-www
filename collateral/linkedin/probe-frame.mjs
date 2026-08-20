import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const EXEC='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const br=await chromium.launch({executablePath:EXEC,args:['--no-sandbox']});
const pg=await br.newPage();
const out=await pg.evaluate(async(s)=>{
  const i=new Image(); i.src=s; await i.decode();
  const W=i.naturalWidth,H=i.naturalHeight;
  const c=document.createElement('canvas'); c.width=W;c.height=H;
  const x=c.getContext('2d'); x.drawImage(i,0,0);
  const d=x.getImageData(0,0,W,H).data;
  const at=(ii,j)=>{const o=(Math.round(j)*W+Math.round(ii))*4;return [d[o],d[o+1],d[o+2]];};
  const cx=369.5, cy=338.5, R=311.5;
  const P=(a,r)=>[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];

  // 1. clean background grey, sampled on the mirror side (no frame) at matching radii
  const bgByR={};
  for(let r=150;r<=310;r+=10){
    const s1=at(...P(-45,r)), s2=at(...P(-20,r)), s3=at(...P(-70,r));
    bgByR[r]=[0,1,2].map(ch=>Math.round((s1[ch]+s2[ch]+s3[ch])/3));
  }
  // 2. solid frame colour: deepest saturated point
  const F=at(...P(140,300));
  // 3. radial alpha profile at angles whose underlay is clean grey
  const radial={};
  for(const a of [165,175,185,195,200]){
    const rows=[];
    for(let r=310;r>=140;r-=4){
      const o=at(...P(a,r));
      const bgr=Math.round(r/10)*10; const C=bgByR[Math.min(310,Math.max(150,bgr))];
      // least-squares alpha over the channels with the largest F-C separation
      let num=0,den=0;
      for(let ch=0;ch<3;ch++){const dF=F[ch]-C[ch]; num+=(o[ch]-C[ch])*dF; den+=dF*dF;}
      rows.push([r, Math.max(0,Math.min(1, num/den))]);
    }
    radial[a]=rows;
  }
  // 4. angular alpha profile just inside the outer edge, where underlay is background
  const ang=[];
  for(let a=0;a<360;a+=2){
    const o=at(...P(a,296)); const C=bgByR[300];
    let num=0,den=0;
    for(let ch=0;ch<3;ch++){const dF=F[ch]-C[ch]; num+=(o[ch]-C[ch])*dF; den+=dF*dF;}
    ang.push([a, Math.max(0,Math.min(1,num/den))]);
  }
  return {F, bg300:bgByR[300], radial, ang};
}, 'data:image/png;base64,'+readFileSync('paste-74.png').toString('base64'));
await br.close();
console.log('solid frame colour :', out.F, ' | clean bg at r=300 :', out.bg300);
console.log('\nangular alpha at r=296 (deg:alpha), alpha>0.04 only:');
console.log('  '+out.ang.filter(([a,v])=>v>0.04).map(([a,v])=>a+':'+v.toFixed(2)).join('  '));
for(const a of Object.keys(out.radial)){
  console.log(`\nradial alpha at ${a}deg (r:alpha):`);
  console.log('  '+out.radial[a].filter(([r,v])=>v>0.02).map(([r,v])=>r+':'+v.toFixed(2)).join('  '));
}
writeFileSync('frame-profile.json', JSON.stringify(out));
