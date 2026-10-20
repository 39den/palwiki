(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mob=()=>innerWidth<700;
async function share(url,title,btn){try{if(navigator.share){await navigator.share({title,url});return;}await navigator.clipboard.writeText(url);if(btn){const t=btn.textContent;btn.textContent='✅ Скопировано';setTimeout(()=>btn.textContent=t,1500);}}catch(e){}}
window.PW_share=share;
document.addEventListener('DOMContentLoaded',()=>{
 /* compact pal hero: art lightbox */
 const hero=document.querySelector('.pal-hero');if(hero){hero.classList.add('compact');const im=hero.querySelector('.pal-card');if(im){im.setAttribute('role','button');im.setAttribute('tabindex','0');im.setAttribute('aria-label','Открыть карточку');const open=()=>{const bx=document.createElement('div');bx.className='lbx';bx.innerHTML=`<img src="${im.src}" alt="${esc(im.alt)}"><button type="button" class="x" aria-label="Закрыть">×</button>`;bx.onclick=()=>bx.remove();document.body.appendChild(bx);};im.addEventListener('click',open);im.addEventListener('keydown',e=>{if(e.key=='Enter')open();});}}
 /* passive effect on chip */
 const chips=[...document.querySelectorAll('article a.psv[data-psv]')].filter(a=>!a.closest('.pgrid,.psv-hero'));if(chips.length)window.PW_data().then(D=>{const M=Object.fromEntries(D.passives.map(q=>[q.name,q]));
  chips.forEach(a=>{const q=M[a.dataset.psv];if(!q||a.querySelector('.pe'))return;const e=(q.desc||'').split(';')[0].replace(/([+\-−])\s+(\d)/g,'$1$2').replace(/(\d)\s+%/g,'$1%').replace(/(\d+)\.0%/g,'$1%').trim();if(e)a.insertAdjacentHTML('beforeend',`<small class="pe">${esc(e.length>34?e.slice(0,32)+'…':e)}</small>`);});});
 /* skeleton removal hook */
 document.querySelectorAll('[data-skel]').forEach(x=>new MutationObserver((m,o)=>{x.removeAttribute('data-skel');o.disconnect();}).observe(x,{childList:true}));
 /* breeding share */
 const br=document.getElementById('breed');if(br)br.addEventListener('click',e=>{const b=e.target.closest('.bshare');if(b)share(location.href,'Разведение — Энциклопедия Palworld',b);});
 if(br)new MutationObserver(()=>{const c=br.querySelector('.bchild .bb');if(c&&!c.querySelector('.bshare'))c.insertAdjacentHTML('beforeend','<button type="button" class="md-button bshare">🔗 Поделиться</button>');}).observe(br,{childList:true,subtree:true});
 /* bottom bar: hide on scroll down, active section */
 const tb=document.querySelector('.tabbar');if(tb){const P=location.pathname;const sec=/\/(gallery|4_spravochniki\/paly|compare|breed|my)\//.test(P)?'gallery/':/\/map\//.test(P)?'map/':P.replace(/\/$/,'')==B.replace(/\/$/,'')?'home':'';
  tb.querySelectorAll('a').forEach(a=>{const h=a.getAttribute('href');a.classList.toggle('on',(sec=='home'&&h==B)||(sec&&sec!='home'&&h.endsWith(sec)));if(a.classList.contains('on'))a.setAttribute('aria-current','page');});
  let ly=scrollY,acc=0;addEventListener('scroll',()=>{const y=scrollY,d=y-ly;ly=y;if(document.documentElement.classList.contains('drawer-open'))return;acc=(Math.sign(d)==Math.sign(acc)?acc:0)+d;if(acc>40&&y>120)tb.classList.add('hid');if(acc<-30||y<60)tb.classList.remove('hid');},{passive:true});}
});
/* map: fullscreen mobile + share point + ?pt= */
document.addEventListener('DOMContentLoaded',()=>{const el=document.getElementById('pwmap');if(!el)return;document.documentElement.classList.add('mappage');
 const wait=setInterval(()=>{const M=window.PW_map;if(!M)return;clearInterval(wait);
  if(mob()){document.documentElement.classList.add('mapfull');const sh=document.createElement('div');sh.className='msheet';const q=document.querySelector('.msq'),sw=document.querySelector('.mapsw');sh.innerHTML='<div class="pkg"></div>';if(sw)sh.appendChild(sw);if(q)sh.appendChild(q);document.body.appendChild(sh);
   const lg=document.querySelector('.mleg');if(lg){lg.classList.add('in-sheet');sh.appendChild(lg);}let y0=null;const g=sh.querySelector('.pkg');g.onclick=()=>sh.classList.toggle('min');g.addEventListener('touchstart',e=>y0=e.touches[0].clientY,{passive:true});g.addEventListener('touchend',e=>{if(y0==null)return;const d=e.changedTouches[0].clientY-y0;if(d>30)sh.classList.add('min');if(d<-30)sh.classList.remove('min');y0=null;});
   setTimeout(()=>M.m.invalidateSize(),50);}
  M.m.on('popupopen',e=>{const c=e.popup.getElement();if(!c||c.querySelector('.mshare'))return;const ll=e.popup.getLatLng();const hit=M.all.find(([p,mk])=>mk.getLatLng().equals(ll));if(!hit)return;const p=hit[0];const u=location.origin+location.pathname+'?pt='+p.x+','+p.y;
   const b=document.createElement('button');b.type='button';b.className='mshare';b.textContent='🔗 Поделиться точкой';b.onclick=()=>share(u,p.name+' — карта Palworld',b);const box=c.querySelector('.leaflet-popup-content');box&&box.appendChild(b);});
  const pt=new URLSearchParams(location.search).get('pt');if(pt){const [x,y]=pt.split(',').map(Number);const h=M.all.slice().sort((a,b)=>((a[0].x-x)**2+(a[0].y-y)**2)-((b[0].x-x)**2+(b[0].y-y)**2))[0];if(h){const g=Object.values(M.groups).find(g=>g.hasLayer&&g.hasLayer(h[1]));if(g&&g.zoomToShowLayer)g.zoomToShowLayer(h[1],()=>h[1].openPopup());else{M.m.setView(h[1].getLatLng(),4);h[1].openPopup();}}}
 },150);});
})();
document.addEventListener('DOMContentLoaded',()=>{const f=document.querySelector('.ifl');if(!f)return;const q=f.querySelector('.pfq'),n=f.querySelector('.pfn');const cards=[...document.querySelectorAll('.icard')];
 const run=()=>{const v=(q.value||'').toLowerCase().replace(/ё/g,'е');let c=0;cards.forEach(x=>{const ok=!v||x.dataset.n.replace(/ё/g,'е').includes(v);x.style.display=ok?'':'none';const h=x.previousElementSibling;if(h&&/^H2$/.test(h.tagName))h.style.display=ok?'':'none';c+=ok;});n.textContent='найдено '+c;};q.addEventListener('input',run);run();});
