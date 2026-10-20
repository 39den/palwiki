(()=>{const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const q=new URLSearchParams(location.search);if(q.get('theme'))document.documentElement.dataset.theme=q.get('theme');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*70+'ms';if(rm||q.get('static'))el.classList.add('in');else io.observe(el)});
if(rm)return;
const h=document.querySelector('.hero>img');if(h)addEventListener('scroll',()=>{h.style.transform=`scale(1.08) translateY(${scrollY*.18}px)`},{passive:true});
if(matchMedia('(hover:hover)').matches)document.querySelectorAll('[data-tilt]').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
document.querySelectorAll('.tg').forEach(b=>b.onclick=()=>{const r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark'});
})();
