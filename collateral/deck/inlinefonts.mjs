import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const URL='https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500&family=JetBrains+Mono:wght@400;500;600;700&display=block';
let css=execSync(`curl -sS --max-time 30 -A ${JSON.stringify(UA)} ${JSON.stringify(URL)}`,{maxBuffer:1<<26}).toString();
// keep only the latin subsets; the deck has no other scripts
css=css.split('@font-face').filter((b,i)=> i===0 || /U\+0000-00FF|U\+0100-02(AF|BA)/.test(b))
       .join('@font-face');
const urls=[...new Set(css.match(/https:\/\/fonts\.gstatic\.com[^)]+/g)||[])];
console.log('unique font files:', urls.length);
for (const u of urls){
  const b64=execSync(`curl -sS --max-time 30 -A ${JSON.stringify(UA)} ${JSON.stringify(u)} | base64 -w0`,{maxBuffer:1<<26}).toString().trim();
  css=css.split(u).join(`data:font/woff2;base64,${b64}`);
  console.log('  inlined', u.split('/').pop(), (b64.length/1365).toFixed(0)+'KB');
}
css=css.replace(/\/\*[^*]*\*\//g,'').replace(/\n{2,}/g,'\n');
writeFileSync('fonts-inline.css', css);
console.log('wrote fonts-inline.css', (css.length/1024).toFixed(0)+'KB,', (css.match(/@font-face/g)||[]).length, 'faces');
