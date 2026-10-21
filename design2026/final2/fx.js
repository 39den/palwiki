(()=>{const d=document,de=d.documentElement,q=new URLSearchParams(location.search);
const saved=localStorage.getItem('theme');de.dataset.theme=q.get('theme')||saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches||q.has('static');
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'}):null;
d.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*60+'ms';if(rm||!io)el.classList.add('in');else io.observe(el)});
d.querySelectorAll('.tg').forEach(b=>b.onclick=()=>{const t=de.dataset.theme==='dark'?'light':'dark';const go=()=>{de.dataset.theme=t;localStorage.setItem('theme',t)};(d.startViewTransition&&!rm)?d.startViewTransition(go):go()});
const so=d.getElementById('so');const open=()=>{so.classList.add('open')},close=()=>so.classList.remove('open');
d.querySelectorAll('[data-open-search]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();open()}));
so&&so.querySelectorAll('[data-close]').forEach(b=>b.onclick=close);
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'||e.key==='/'&&!/input|textarea/i.test(e.target.tagName)){e.preventDefault();open()}if(e.key==='Escape')close()});
if(rm)return;
const par=[...d.querySelectorAll('[data-par]')],bn=d.querySelector('.bn');let ly=0,tk=0;
addEventListener('scroll',()=>{if(tk)return;tk=requestAnimationFrame(()=>{const y=scrollY;par.forEach(p=>p.style.translate=`0 ${y*+p.dataset.par}px`);if(bn){bn.classList.toggle('hide',y>ly&&y>200);ly=y}tk=0})},{passive:true});
if(matchMedia('(hover:hover) and (pointer:fine)').matches)d.querySelectorAll('[data-tilt]').forEach(c=>{let r;c.addEventListener('pointerenter',()=>{r=c.getBoundingClientRect();c.style.transition='transform .15s'});c.addEventListener('pointermove',e=>{const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-4px)`});c.addEventListener('pointerleave',()=>{c.style.transition='';c.style.transform=''})});
})();
/* animated pals: static first frame at rest; play on hover (fine pointer) or tap; only one active; stop when off-screen; never with reduced motion */
(()=>{const q=new URLSearchParams(location.search),rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const W=[...document.querySelectorAll('.anim-wrap')];if(!W.length)return;let act=null;
const img=w=>w.querySelector('img.anim');
const stop=w=>{if(!w)return;const i=img(w);i.src=i.dataset.still;w.classList.remove('active');w.setAttribute('aria-pressed','false');if(act===w)act=null};
const play=w=>{if(rm||act===w)return;stop(act);const i=img(w);i.src=i.dataset.anim;w.classList.add('active');w.setAttribute('aria-pressed','true');act=w};
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
W.forEach(w=>{w.setAttribute('role','button');w.tabIndex=0;w.setAttribute('aria-label','Показать анимацию');w.setAttribute('aria-pressed','false');
 if(fine){w.addEventListener('pointerenter',()=>play(w));w.addEventListener('pointerleave',()=>stop(w))}
 w.addEventListener('click',e=>{if(!fine){e.preventDefault();act===w?stop(w):play(w)}});
 w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act===w?stop(w):play(w)}});
 w.addEventListener('pointerenter',()=>{const l=new Image();l.src=img(w).dataset.anim},{once:true})});
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting&&e.target===act)stop(e.target)}),{threshold:.25});W.forEach(w=>io.observe(w))}
if(q.get('play')){const w=W.find(w=>w.dataset.id===q.get('play'));if(w){const i=img(w);i.src=i.dataset.anim;w.classList.add('active');act=w}}
if(q.get('hover')){document.querySelectorAll('[data-hover-demo]').forEach(c=>c.classList.add('is-hover'))}
})();
