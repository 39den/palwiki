/* HX faq/gloss: свёрнутые разделы, поиск (ё=е, по ответам), #id, наверх */
(()=>{const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const N=s=>(s||'').toLowerCase().replace(/ё/g,'е');const MORE=8;
const hdr=()=>{let t=0;$$('.md-header,.md-tabs,.ux-crumbs').forEach(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();const st=c.position=='fixed'||c.position=='sticky'||!!(e.closest('.md-header')&&getComputedStyle(e.closest('.md-header')).position!='static');if(st&&r.top<=60&&c.opacity!='0'&&!e.hidden&&r.height>0&&c.visibility!='hidden')t=Math.max(t,r.bottom);});document.documentElement.style.setProperty('--hx-top',Math.max(0,Math.round(t))+'px');};
hdr();addEventListener('resize',hdr);let _hq;addEventListener('scroll',()=>{if(!_hq)_hq=requestAnimationFrame(()=>{_hq=0;hdr();});},{passive:true});
const mark=(el,q)=>{el.querySelectorAll('mark.hx-m').forEach(m=>m.replaceWith(m.textContent));el.normalize();if(!q)return;const w=document.createTreeWalker(el,4);const ns=[];while(w.nextNode())ns.push(w.currentNode);
 ns.forEach(n=>{const t=n.nodeValue,i=N(t).indexOf(q);if(i<0)return;const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+q.length);const m=document.createElement('mark');m.className='hx-m';r.surroundContents(m);});};
const top=document.createElement('button');top.type='button';top.className='hx-up';top.setAttribute('aria-label','Наверх');top.textContent='↑';top.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(top);
addEventListener('scroll',()=>top.classList.toggle('on',scrollY>innerHeight),{passive:true});
/* FAQ */
const T=$('.fqs.hx-top');if(T){const b=document.createElement('button');b.type='button';b.className='ux-chip hx-top-more';b.textContent='Ещё 5 вопросов';b.setAttribute('aria-expanded','false');b.onclick=()=>{T.classList.add('hx-all');b.remove();};T.after(b);}
const F=$('.hx-faq');if(F){document.documentElement.classList.add('hx-faqpage');const secs=$$('.hx-sec',F);
 const lim=(s,all)=>{$$('details.fq',s).forEach((d,i)=>d.classList.toggle('hx-hid',!all&&i>=MORE));let b=$('.hx-more',s);const n=$$('details.fq',s).length;
  if(n>MORE&&!all){if(!b){b=document.createElement('button');b.type='button';b.className='hx-more ux-chip';$('.hx-sb',s).after(b);b.onclick=()=>{lim(s,true);b.remove();};}b.textContent=`Показать ещё ${n-MORE}`;b.hidden=$('.hx-sb',s).hidden;}else if(b)b.remove();};
 const open=(s,o)=>{const t=$('.hx-st',s);t.setAttribute('aria-expanded',o);$('.hx-sb',s).hidden=!o;const b=$('.hx-more',s);if(b)b.hidden=!o;};
 secs.forEach(s=>{lim(s,false);$('.hx-st',s).onclick=()=>open(s,$('.hx-st',s).getAttribute('aria-expanded')!='true');});
 const q=$('.hx-q'),cnt=$('.hx-n');let tm;
 const run=()=>{const v=N(q.value.trim());let tot=0;secs.forEach(s=>{let k=0;$$('details.fq',s).forEach(d=>{const hit=!v||N(d.textContent).includes(v);d.classList.toggle('hx-off',!hit);mark(d,v);if(v&&hit){k++;}});tot+=k;
  s.classList.toggle('hx-off',!!v&&!k);if(v){open(s,!!k);lim(s,true);}else{open(s,false);lim(s,false);}});cnt.textContent=v?(tot?`Найдено: ${tot}`:'Ничего не нашлось'):'';};
 q.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(run,120);});
 const go=()=>{const id=decodeURIComponent(location.hash.slice(1));if(!id)return;const el=document.getElementById(id);if(!el)return;const s=el.closest('.hx-sec');if(s){open(s,true);lim(s,true);}if(el.tagName=='DETAILS')el.open=true;setTimeout(()=>el.scrollIntoView({block:'start'}),30);};
 addEventListener('hashchange',go);go();
 F.addEventListener('toggle',e=>{const d=e.target;if(d.tagName=='DETAILS'&&d.open&&d.id)history.replaceState(null,'','#'+d.id);},true);}
/* Словарь */
const G=$('.hx-gl');if(G){const cards=$$('.hx-gt',G),q=$('.hx-q'),cnt=$('.hx-n');let c='',L='';
 const run=()=>{const v=N(q.value.trim());let n=0;cards.forEach(k=>{const hit=(!v||N(k.dataset.s+' '+k.textContent).includes(v))&&(!c||k.dataset.c==c)&&(!L||k.dataset.l==L);k.hidden=!hit;if(hit)n++;mark($('.gc-t b',k),v);});cnt.textContent=`${n} из ${cards.length}`;};
 $$('.hx-cats [data-c]').forEach(b=>b.onclick=()=>{c=b.dataset.c;$$('.hx-cats [data-c]').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b);});run();});
 $$('.hx-abc [data-l]').forEach(b=>b.onclick=()=>{L=L==b.dataset.l?'':b.dataset.l;$$('.hx-abc [data-l]').forEach(x=>{x.classList.toggle('on',x.dataset.l==L);x.setAttribute('aria-pressed',x.dataset.l==L);});run();});
 q.addEventListener('input',run);run();
 const id=decodeURIComponent(location.hash.slice(1));const el=id&&document.getElementById(id);if(el){el.classList.add('hx-hl');setTimeout(()=>el.scrollIntoView({block:'center'}),50);}}
})();
