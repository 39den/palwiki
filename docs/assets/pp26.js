/* «Палпедия» stage-1 DOM tweaks (preview only; loaded with pp26.css) */
(function(){const B=(window.PW_BASE||document.querySelector('link[href$="pp26.css"]').href.replace(/assets\/pp26\.css.*$/,''));
 const run=()=>{const H=document.documentElement;if(!H.classList.contains('pp26'))return;
  const lg=document.querySelector('.md-header__button.md-logo');if(lg&&!document.querySelector('.pp-brand')){const s=document.createElement('a');s.className='pp-brand';s.href=lg.getAttribute('href')||B;s.textContent='Палпедия';lg.after(s)}
  // pal page: big name inside the hero, eyebrow above it
  const ph=document.querySelector('.pal-hero'),h1=document.querySelector('article h1');
  if(ph&&h1&&!ph.querySelector('h1')){document.body.classList.add('pp-pal');const info=ph.querySelector('.pal-info');if(info){const no=info.querySelector('.nochip,.pal-no');const eb=document.createElement('div');eb.className='pp-eb';eb.textContent=['Палы',...[...info.querySelectorAll('.chips .el')].map(e=>e.textContent.trim())].join(' · ')+(no?'   '+no.textContent.trim():'');info.prepend(h1);info.prepend(eb);ph.dataset.wm=h1.textContent.trim()}}
  const bh=document.querySelector('.boss-hero');if(bh){document.body.classList.add('pp-boss');const bi=bh.querySelector('.bi'),h2=bi&&bi.querySelector('h2');if(h1&&h2&&!bi.querySelector('h1')){h2.replaceWith(h1)}}
  const tint=(box)=>{const c=box&&box.querySelector('.el[class*="el-"]');const m=c&&c.className.match(/el-(\w+)/);if(m&&m[1]!='neutral')box.style.setProperty('--e','var(--'+m[1]+')')};tint(ph);tint(bh);
  if(document.querySelector('.hero .smart-box')){document.body.classList.add('pp-home');const hero=document.querySelector('.hero');
   if(!hero.querySelector('.pp-cast')){const c=document.createElement('div');c.className='pp-cast';c.setAttribute('aria-hidden','true');
    c.innerHTML=[['LilyQueen','ly'],['JetDragon','jt'],['SheepBall','lb'],['PinkCat','ct']].map(([id,k])=>`<img class="${k}" src="${B}pp/art/${id}-512.webp" alt="" width="512" height="512" decoding="async">`).join('')+'<span class="sun"></span>';hero.prepend(c)}}
  if(document.querySelector('#gallery'))document.body.classList.add('pp-gal');
  if(document.getElementById('pwmap'))document.body.classList.add('pp-map');
  if(document.querySelector('.igrid,.icard'))document.body.classList.add('pp-items');
 };
 const ready=()=>document.documentElement.classList.add('pp-ready');const done=()=>{try{run()}finally{/* wait (<=900ms) for the ux50 breadcrumbs so they don't push content after first paint */const ux=document.querySelector('script[src*="assets/ux50.js"]');if(!ux)return ready();let n=0;const t=setInterval(()=>{if(document.querySelector('.ux-crumbs')||++n>18){clearInterval(t);requestAnimationFrame(ready)}},50)}};
 if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',done);else done();setTimeout(()=>document.documentElement.classList.add('pp-ready'),2500);
})();
/* items26: sub-category chips filter the tile grid (works together with the text filter) */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.isubs button');if(!b)return;const box=b.closest('.items26');box.querySelectorAll('.isubs button').forEach(x=>x.classList.toggle('on',x===b));const s=b.dataset.sub;box.querySelectorAll('.itm').forEach(d=>{d.classList.toggle('subx',!!s&&d.dataset.sub!==s)});const n=box.querySelectorAll('.itm:not(.subx)').length;const c=document.querySelector('.ifl .pfn');if(c)c.textContent='найдено '+n;});
;(function(){var w=document.querySelector('.pkw');if(!w)return;var q=w.querySelector('.pk-q'),cs=w.querySelectorAll('.pk'),n=w.querySelector('.pk-n'),e=w.querySelector('.pk-empty'),g='',t={};
function f(){var s=q.value.trim().toLowerCase(),k=0,tk=Object.keys(t);cs.forEach(function(c){var ok=(!g||c.dataset.g==g)&&(!s||c.dataset.q.indexOf(s)>=0)&&tk.every(function(x){return ('|'+c.dataset.t+'|').indexOf('|'+x+'|')>=0});c.hidden=!ok;if(ok)k++});n.textContent='Найдено: '+k;e.hidden=k>0}
w.addEventListener('click',function(ev){var b=ev.target.closest('.pk-c');if(!b)return;if(b.hasAttribute('data-g')){g=b.dataset.g;w.querySelectorAll('.pk-c[data-g]').forEach(function(x){x.classList.toggle('on',x==b)})}else{var v=b.dataset.t;if(t[v])delete t[v];else t[v]=1;b.classList.toggle('on',!!t[v])}f()});
q.addEventListener('input',f);f()})();
