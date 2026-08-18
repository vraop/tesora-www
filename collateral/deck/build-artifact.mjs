import { readFileSync, writeFileSync, existsSync } from 'node:fs';
let h = readFileSync('tesora-marketing.html','utf8');

// 1. swap in compressed web images, inlined
const imgs = ['asset-post.png','asset-triangle.png','asset-bernegger.png','asset-compete.png',
  'adv-ethan.png','adv-mario.png','adv-joanne.png','photo-vr.png','photo-fr.png','photo-pb.png',
  'photo-mp.png','photo-el.png','asset-foundation.png','asset-soc2.png'];
for (const f of imgs){
  const web = f.replace(/\.(png|webp)$/,'')+'-web.webp';
  if(!existsSync(web)) { console.log('missing',web); continue; }
  h = h.split(`src="${f}"`).join(`src="data:image/webp;base64,${readFileSync(web).toString('base64')}"`);
}
// rater gui is already small
h = h.split('src="asset-rater-gui.webp"').join(`src="data:image/webp;base64,${readFileSync('asset-rater-gui.webp').toString('base64')}"`);

// 2. inline fonts, drop the blocked CDN link
const fonts = readFileSync('fonts-inline.css','utf8');
h = h.replace(/<link rel="preconnect"[^>]*>\s*/g,'');
h = h.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/,'');
h = h.replace('<style>', '<style>\n'+fonts+'\n');

// 3. responsive scaling wrapper so the body never scrolls sideways
h = h.replace(/<section class="slide">/g,'<div class="sw"><section class="slide">');
h = h.replace(/<\/section>/g,'</section></div>');
h = h.replace('.deck{display:flex;flex-direction:column;align-items:center;gap:30px;padding:30px 0;counter-reset:pg}',
`.deck{display:flex;flex-direction:column;align-items:center;gap:22px;padding:22px 14px;counter-reset:pg}
.sw{width:100%;max-width:1280px;aspect-ratio:1280/720;position:relative;overflow:hidden;container-type:inline-size;counter-increment:pg}
.sw>.slide{position:absolute;top:0;left:0;transform-origin:top left;counter-increment:none}`);

// 4. strip the document shell; the artifact host supplies it
const style = h.slice(h.indexOf('<style>'), h.indexOf('</style>')+8);
const body  = h.slice(h.indexOf('<svg width="0"'), h.lastIndexOf('</body>'));
const fit = `<script>
(function(){
  function fit(){
    document.querySelectorAll('.sw').forEach(function(w){
      var sl=w.querySelector('.slide'); if(!sl) return;
      sl.style.transform='scale('+(w.clientWidth/1280)+')';
    });
  }
  window.addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fit);}
  fit();
})();
<\/script>`;
const out = `<title>Frontier AI for Actuaries</title>\n${style}\n${body}\n${fit}`;
writeFileSync('tesora-deck-artifact.html', out);
console.log('artifact', (out.length/1048576).toFixed(2)+'MB');
