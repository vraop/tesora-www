import { readFileSync } from 'node:fs';
const f = process.argv[2];
let t = readFileSync(f,'utf8');
t = t.replace(/<style[\s\S]*?<\/style>/g,'').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<svg[\s\S]*?<\/svg>/g,'');
const text = t.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
console.log('=== '+f+' ===');
console.log('words:', text.split(' ').length);
const HARD=[];
if(/[—–]/.test(text)) HARD.push('em/en dash');
for(const w of ['leverage','utilize','robust','seamless','synergy','best-in-class','game-chang','revolutioniz','empower','unlock the power','cutting-edge','delve']){
  const re=new RegExp(w,'i'); if(re.test(text)) HARD.push('banned: '+w);
}
const anti=(text.match(/\bnot\s+\w+[,.]|\brather than\b|\binstead of\b/gi)||[]).length;
console.log('HARD violations:', HARD.length, '  |   antithesis constructions:', anti);
if(HARD.length) console.log(HARD.join('\n'));
