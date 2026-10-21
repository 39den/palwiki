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
 const done=()=>{try{run()}finally{document.documentElement.classList.add('pp-ready')}};
 if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',done);else done();setTimeout(()=>document.documentElement.classList.add('pp-ready'),2500);
})();
