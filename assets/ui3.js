(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mob=()=>innerWidth<700;
async function share(url,title,btn){try{if(navigator.share){await navigator.share({title,url});return;}await navigator.clipboard.writeText(url);if(btn){const t=btn.textContent;btn.textContent='✅ Скопировано';setTimeout(()=>btn.textContent=t,1500);}}catch(e){}}
window.PW_share=share;
document.addEventListener('DOMContentLoaded',()=>{
 /* compact pal hero: art lightbox */
 const hero=document.querySelector('.pal-hero');if(hero){hero.classList.add('compact');const im=hero.querySelector('.pal-card');if(im){im.setAttribute('role','button');im.setAttribute('tabindex','0');im.setAttribute('aria-label','Открыть карточку');const open=()=>{const bx=document.createElement('div');bx.className='lbx';bx.innerHTML=`<img src="${im.dataset.card||im.currentSrc||im.src}" alt="${esc(im.alt)}"><button type="button" class="x" aria-label="Закрыть">×</button>`;bx.onclick=()=>bx.remove();document.body.appendChild(bx);};im.addEventListener('click',open);im.addEventListener('keydown',e=>{if(e.key=='Enter')open();});}}
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
  if(mob()){document.documentElement.classList.add('mapfull');const sh=document.createElement('div');sh.className='msheet';const q=document.querySelector('.msq'),sw=document.querySelector('.mapsw');sh.innerHTML='<div class="pkg"></div><div class="mrow"></div>';const row=sh.querySelector('.mrow');if(sw){row.appendChild(sw);const tb=sw.querySelector('[data-w=t]');if(tb)tb.textContent='Древо';}if(q){row.appendChild(q);const qi=q.querySelector('input');if(qi)qi.placeholder='Пал или босс';}
   const fb=document.createElement('button');fb.type='button';fb.className='mflt';fb.setAttribute('aria-label','Фильтры');fb.setAttribute('aria-expanded','false');fb.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg><span>Фильтры</span>';row.appendChild(fb);
   fb.onclick=()=>{const on=sh.classList.toggle('flt');fb.setAttribute('aria-expanded',on);sh.classList.remove('min');};document.body.appendChild(sh);
   const lg=document.querySelector('.mleg');if(lg){lg.classList.add('in-sheet');sh.appendChild(lg);}let y0=null;const g=sh.querySelector('.pkg');g.onclick=()=>sh.classList.toggle('min');g.addEventListener('touchstart',e=>y0=e.touches[0].clientY,{passive:true});g.addEventListener('touchend',e=>{if(y0==null)return;const d=e.changedTouches[0].clientY-y0;if(d>30)sh.classList.add('min');if(d<-30)sh.classList.remove('min');y0=null;});
   setTimeout(()=>M.m.invalidateSize(),50);}
  M.m.on('popupopen',e=>{const c=e.popup.getElement();if(!c||c.querySelector('.mshare'))return;const ll=e.popup.getLatLng();const hit=M.all.find(([p,mk])=>mk.getLatLng().equals(ll));if(!hit)return;const p=hit[0];const u=location.origin+location.pathname+'?pt='+p.x+','+p.y;
   const b=document.createElement('button');b.type='button';b.className='mshare';b.textContent='🔗 Поделиться точкой';b.onclick=()=>share(u,p.name+' — карта Palworld',b);const box=c.querySelector('.leaflet-popup-content');box&&box.appendChild(b);});
  const pt=new URLSearchParams(location.search).get('pt');if(pt){const [x,y]=pt.split(',').map(Number);const h=M.all.slice().sort((a,b)=>((a[0].x-x)**2+(a[0].y-y)**2)-((b[0].x-x)**2+(b[0].y-y)**2))[0];if(h){const g=Object.values(M.groups).find(g=>g.hasLayer&&g.hasLayer(h[1]));if(g&&g.zoomToShowLayer)g.zoomToShowLayer(h[1],()=>h[1].openPopup());else{M.m.setView(h[1].getLatLng(),4);h[1].openPopup();}}}
 },150);});
})();
document.addEventListener('DOMContentLoaded',()=>{const f=document.querySelector('.ifl');if(!f)return;const q=f.querySelector('.pfq'),n=f.querySelector('.pfn');const cards=[...document.querySelectorAll('.icard,.itm')];
 const run=()=>{const v=(q.value||'').toLowerCase().replace(/ё/g,'е');let c=0;cards.forEach(x=>{const ok=!v||x.dataset.n.replace(/ё/g,'е').includes(v);x.style.display=ok?'':'none';const h=x.previousElementSibling;if(h&&/^H2$/.test(h.tagName))h.style.display=ok?'':'none';c+=ok;});n.textContent='найдено '+c;};q.addEventListener('input',run);run();
 /* item tiles: deep link opens the card; one open card at a time */
 const openHash=()=>{const id=decodeURIComponent(location.hash.slice(1));const d=id&&document.getElementById(id);if(d&&d.tagName=='DETAILS'){d.open=true;setTimeout(()=>d.scrollIntoView({block:'start',behavior:'smooth'}),60)}};openHash();addEventListener('hashchange',openHash);
 document.querySelectorAll('details.itm').forEach(d=>d.addEventListener('toggle',()=>{if(d.open){document.querySelectorAll('details.itm[open]').forEach(o=>{if(o!==d)o.open=false});history.replaceState(null,'','#'+d.id)}}));});
document.addEventListener('DOMContentLoaded',()=>{const F=document.querySelector('.food');if(!F)return;const g=F.querySelector('.fgrid'),q=F.querySelector('.ffq'),so=F.querySelector('.ffs'),n=F.querySelector('.ffn');let e='';const cards=[...g.children];
 const run=()=>{const t=(q.value||'').toLowerCase().replace(/ё/g,'е');let c=0;const k=so.value;cards.sort((a,b)=>k=='n'?a.dataset.n.localeCompare(b.dataset.n,'ru'):(+b.dataset[k]-+a.dataset[k]));cards.forEach(x=>{const ok=(!e||x.dataset.e.split(' ').includes(e))&&(!t||x.dataset.n.replace(/ё/g,'е').includes(t));x.hidden=!ok;if(ok)c++;g.appendChild(x);});n.textContent='Найдено '+c;};
 F.querySelectorAll('.fc').forEach(b=>b.onclick=()=>{e=b.dataset.e;F.querySelectorAll('.fc').forEach(z=>z.classList.toggle('on',z===b));run();});q.oninput=run;so.onchange=run;run();});
/* habitat mini map: points from hab/<id>.json (game data via paldb.cc). Owns pinch / pan / double-tap itself:
   transform-only zoom on one stage layer, markers on one canvas with grid clustering (splits on zoom), rAF-batched. */
(function(){
  const X0=-1923.225927,Y0=1032.79857101,X1=1234.833276624702,Y1=-2125.2606328,SMAX=12;
  const ok=s=>Math.max(1,Math.min(SMAX,s));
  function init(root){
    root.querySelectorAll('.habmap:not([data-ok])').forEach(el=>{el.dataset.ok=1;
      const img=el.querySelector('.hm-img'),dots=el.querySelector('.hm-dots'),cnt=el.querySelector('.hm-c'),full=el.querySelector('.hm-full'),bx=el.querySelector('.hm-box');
      const base=img.getAttribute('src').replace(/assets\/wtree\/mini_\w+\.webp$/,'');let H=null,tod='d',w=(+el.dataset.d||+el.dataset.n)?'p':'t';
      if(!(+el.dataset.d)&&+el.dataset.n)tod='n';
      el.querySelectorAll('.hm-tod button').forEach(b=>b.classList.toggle('on',b.dataset.k==tod));
      if(dots)dots.remove();
      const st=document.createElement('div');st.className='hm-stage';img.before(st);st.appendChild(img);
      const cv=document.createElement('canvas');cv.className='hm-cv';cv.setAttribute('aria-hidden','true');bx.appendChild(cv);
      const zc=document.createElement('div');zc.className='hm-zc';zc.innerHTML='<button type="button" data-z="1" aria-label="Приблизить">+</button><button type="button" data-z="-1" aria-label="Отдалить">−</button><button type="button" data-z="0" aria-label="Показать всю область">⤢</button>';bx.appendChild(zc);
      let P=[],A=[],s=1,tx=0,ty=0,fit={s:1,tx:0,ty:0},bw=0,bh=0,dpr=1,raf=0,anim=0;
      const ctx=cv.getContext('2d');
      const size=()=>{bw=bx.clientWidth;bh=bx.clientHeight;dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(bw*dpr);cv.height=Math.round(bh*dpr);};
      const clamp=()=>{s=ok(s);tx=Math.min(0,Math.max(bw-bw*s,tx));ty=Math.min(0,Math.max(bh-bh*s,ty));};
      const zoomed=()=>s>fit.s*1.05;
      const req=()=>{if(!raf)raf=requestAnimationFrame(frame)};
      let last=[];
      function frame(){const f0=performance.now();raf=0;clamp();st.style.transform=`translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
        bx.classList.toggle('zin',zoomed());
        ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,bw,bh);const C=26,G=new Map();last=[];
        for(const p of P){const x=tx+p[0]*bw*s,y=ty+p[1]*bh*s;if(x<-12||y<-12||x>bw+12||y>bh+12)continue;const k=((x/C)|0)+':'+((y/C)|0);const g=G.get(k);if(g){g.n++;g.x+=x;g.y+=y}else G.set(k,{n:1,x,y})}
        ctx.lineWidth=1.5;
        G.forEach(g=>{const x=g.x/g.n,y=g.y/g.n;if(g.n==1){ctx.beginPath();ctx.arc(x,y,4,0,6.283);ctx.fillStyle='#ffd34d';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.55)';ctx.stroke();return}
          const r=g.n<10?10:g.n<100?12:14;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fillStyle='#ffd34d';ctx.fill();ctx.strokeStyle='#1b1300';ctx.stroke();
          ctx.fillStyle='#1b1300';ctx.font='800 11px Manrope,system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(g.n,x,y+.5);last.push({x,y,r,n:g.n})});
        for(const p of A){const x=tx+p[0]*bw*s,y=ty+p[1]*bh*s;ctx.beginPath();ctx.arc(x,y,7,0,6.283);ctx.fillStyle='#ff5a6a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke()}
        if(window.PW_hmFrame)window.PW_hmFrame(f0,performance.now()-f0);}
      const zoomAt=(ns,cx,cy)=>{ns=ok(ns);const k=ns/s;tx=cx-(cx-tx)*k;ty=cy-(cy-ty)*k;s=ns;req()};
      const tween=(to,ms=280)=>{cancelAnimationFrame(anim);const f={s,tx,ty},t0=performance.now();if(matchMedia('(prefers-reduced-motion:reduce)').matches)ms=1;
        const step=t=>{const q=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-q,3);s=f.s+(to.s-f.s)*e;tx=f.tx+(to.tx-f.tx)*e;ty=f.ty+(to.ty-f.ty)*e;frame();if(q<1)anim=requestAnimationFrame(step)};anim=requestAnimationFrame(step)};
      function draw(){if(!H)return;const W=H[w]||{};const f=w=='p'?(x,y)=>[(x-X0)/(X1-X0),(Y0-y)/(Y0-Y1)]:(x,y)=>[x,y];
        P=(W[tod]||[]).map(p=>f(p[0],p[1]));A=(W.a||[]).map(p=>f(p[0],p[1]));
        img.src=base+'assets/wtree/mini_'+(w=='p'?'palpagos':'tree')+'.webp';size();
        let to={s:1,tx:0,ty:0};
        if(P.length){let a=1,b=1,c=0,d=0;P.forEach(p=>{a=Math.min(a,p[0]);b=Math.min(b,p[1]);c=Math.max(c,p[0]);d=Math.max(d,p[1])});
          const cx=(a+c)/2,cy=(b+d)/2,sp=Math.max(c-a,d-b,.12)*1.6,sc=Math.min(4,Math.max(1,1/sp));to={s:sc,tx:bw/2-cx*bw*sc,ty:bh/2-cy*bh*sc}}
        fit=to;tween(to);
        cnt.textContent=P.length?`${P.length} ${tod=='d'?'точек днём':'точек ночью'}`+(A.length?` · альфа: ${A.length}`:''):(tod=='n'?'Ночью не появляется':'Днём не появляется');
        if(full)full.href=base+'map/?pal='+el.dataset.pal+(w=='t'?'&w=tree':'')+(tod=='n'?'&t=n':'')}
      el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
        if(b.dataset.z!=null){const z=+b.dataset.z;if(!z)tween(fit);else{const ns=ok(s*(z>0?2:.5));const k=ns/s;tween({s:ns,tx:bw/2-(bw/2-tx)*k,ty:bh/2-(bh/2-ty)*k})}return}
        if(b.dataset.k){tod=b.dataset.k;el.querySelectorAll('.hm-tod button').forEach(x=>x.classList.toggle('on',x===b))}if(b.dataset.w){w=b.dataset.w;el.querySelectorAll('.hm-w button').forEach(x=>x.classList.toggle('on',x===b))}draw()});
      /* touch: 2 fingers = pinch (never the page), 1 finger = pan only when zoomed in or moving sideways, double-tap = zoom */
      const pt=(t,r)=>({x:t.clientX-r.left,y:t.clientY-r.top});
      let g=null,tap=null;
      bx.addEventListener('touchstart',e=>{if(e.target.closest('.hm-zc'))return;const r=bx.getBoundingClientRect();cancelAnimationFrame(anim);
        if(e.touches.length>=2){e.preventDefault();const a=pt(e.touches[0],r),b=pt(e.touches[1],r);g={m:'pinch',d0:Math.hypot(a.x-b.x,a.y-b.y)||1,s0:s,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,tx0:tx,ty0:ty,r}}
        else{const a=pt(e.touches[0],r);g={m:'one',x0:a.x,y0:a.y,tx0:tx,ty0:ty,r,dir:zoomed()?'pan':null,t:performance.now()}}},{passive:false});
      bx.addEventListener('touchmove',e=>{if(!g)return;const r=g.r;
        if(e.touches.length>=2){e.preventDefault();const a=pt(e.touches[0],r),b=pt(e.touches[1],r);if(g.m!='pinch')g={m:'pinch',d0:Math.hypot(a.x-b.x,a.y-b.y)||1,s0:s,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,tx0:tx,ty0:ty,r};
          const d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2,ns=ok(g.s0*d/g.d0),k=ns/g.s0;s=ns;tx=mx-(g.cx-g.tx0)*k;ty=my-(g.cy-g.ty0)*k;req();return}
        if(g.m!='one')return;const a=pt(e.touches[0],r),dx=a.x-g.x0,dy=a.y-g.y0;
        if(!g.dir&&Math.hypot(dx,dy)>8)g.dir=Math.abs(dx)>Math.abs(dy)*1.2&&s>1.001?'pan':'page';
        if(g.dir=='pan'){e.preventDefault();tx=g.tx0+dx;ty=g.ty0+(zoomed()?dy:0);req()}},{passive:false});
      bx.addEventListener('touchend',e=>{if(!g)return;const was=g;if(e.touches.length){if(g.m=='pinch'&&e.touches.length==1){const a=pt(e.touches[0],g.r);g={m:'one',x0:a.x,y0:a.y,tx0:tx,ty0:ty,r:g.r,dir:'pan'}}return}g=null;
        if(was.m=='one'&&!was.dir&&e.changedTouches.length){const a=pt(e.changedTouches[0],was.r),now=performance.now();
          const hit=last.find(c=>Math.hypot(c.x-a.x,c.y-a.y)<=c.r+6);
          if(tap&&now-tap.t<320&&Math.hypot(tap.x-a.x,tap.y-a.y)<30){e.preventDefault();tap=null;const ns=zoomed()&&s>=SMAX*.98?fit.s:ok(s*2);const k=ns/s;tween({s:ns,tx:a.x-(a.x-tx)*k,ty:a.y-(a.y-ty)*k});return}
          tap={t:now,x:a.x,y:a.y};if(hit){e.preventDefault();const ns=ok(s*2.2),k=ns/s;tween({s:ns,tx:a.x-(a.x-tx)*k,ty:a.y-(a.y-ty)*k})}}},{passive:false});
      bx.addEventListener('touchcancel',()=>{g=null});
      ['gesturestart','gesturechange','gestureend'].forEach(n=>bx.addEventListener(n,e=>e.preventDefault(),{passive:false}));
      /* mouse / trackpad */
      bx.addEventListener('wheel',e=>{if(!e.ctrlKey&&!zoomed()&&Math.abs(e.deltaY)<Math.abs(e.deltaX))return;e.preventDefault();const r=bx.getBoundingClientRect();zoomAt(s*Math.exp(-e.deltaY*(e.ctrlKey?.01:.0022)),e.clientX-r.left,e.clientY-r.top)},{passive:false});
      let md=null;bx.addEventListener('pointerdown',e=>{if(e.pointerType!='mouse'||e.button||e.target.closest('.hm-zc'))return;md={x:e.clientX,y:e.clientY,tx0:tx,ty0:ty};bx.setPointerCapture(e.pointerId);bx.classList.add('drag')});
      bx.addEventListener('pointermove',e=>{if(!md)return;tx=md.tx0+e.clientX-md.x;ty=md.ty0+e.clientY-md.y;req()});
      const mu=()=>{md=null;bx.classList.remove('drag')};bx.addEventListener('pointerup',mu);bx.addEventListener('pointercancel',mu);
      bx.addEventListener('dblclick',e=>{e.preventDefault();const r=bx.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,ns=ok(s*2),k=ns/s;tween({s:ns,tx:x-(x-tx)*k,ty:y-(y-ty)*k})});
      if('ResizeObserver' in window)new ResizeObserver(()=>{const ow=bw;size();if(!ow&&bw&&H){draw();return}if(ow&&bw&&ow!=bw){const k=bw/ow;tx*=k;ty*=k;fit={s:fit.s,tx:fit.tx*k,ty:fit.ty*k}}req()}).observe(bx);
      el._hm={get s(){return s},get fit(){return fit.s},get pts(){return P.length},get badges(){return last.length}};
      const go=()=>fetch(base+'hab/'+el.dataset.pal+'.json').then(r=>r.json()).then(j=>{H=j;draw()}).catch(()=>{cnt.textContent='Карта недоступна офлайн'});
      if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){io.disconnect();go()}},{rootMargin:'300px'});io.observe(el)}else go();
    })}
  window.ppHabInit=init;
  const run=()=>init(document);
  if(window.document$&&document$.subscribe)document$.subscribe(run);else document.addEventListener('DOMContentLoaded',run);
  document.addEventListener('click',()=>setTimeout(run,0),{passive:true});
})();
/* World Tree map (tiles + markers from game data via paldb.cc) and habitat layer (?pal=ID[&t=n][&w=tree]) */
(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const X0=-1923.225927,Y0=1032.79857101,X1=1234.833276624702,Y1=-2125.2606328,S=8192,Z=5;
 const TT={alpha:['👑','Альфы и полевые боссы'],tower:['🏯','Башни'],travel:['🗿','Телепорты'],watch:['🗼','Смотровые вышки'],npc:['🧑','Персонажи'],chest:['🎁','Сундуки'],fruit:['🌳','Плодовые деревья'],spring:['💧','Источники'],fish:['🎣','Рыбалка']};
 const RU=n=>{const D=window.PW_D;if(!D)return n;const p=D.pals.find(p=>p.en==n);return p?p.ru:n};
 let TM=null;
 window.PW_tree=function(){const wt=document.getElementById('wtree');if(!wt||TM)return TM;wt.innerHTML='<div id="wtmap"></div>';const el=wt.firstChild;
  const m=L.map(el,{crs:L.CRS.Simple,minZoom:0,maxZoom:5,zoomSnap:.5,attributionControl:true});const ll=(x,y)=>m.unproject([x*4096,y*4096],3);
  const bounds=L.latLngBounds(ll(0,1),ll(1,0));
  L.tileLayer(B+'assets/wtree/tiles/z{z}x{x}y{y}.webp',{minZoom:0,maxZoom:5,maxNativeZoom:3,tileSize:512,noWrap:true,bounds,errorTileUrl:B+'assets/wtree/tiles/blank.webp',attribution:'Карта и точки: <a href="https://paldb.cc/ru/Map_Tree">paldb.cc</a> · © Pocketpair'}).addTo(m);
  m.setMaxBounds(bounds.pad(.05));m.options.maxBoundsViscosity=1;m.fitBounds(bounds);el.style.background='#0d151c';
  const groups={};const lay=L.control({position:'topright'});
  fetch(B+'assets/wtree/markers.json').then(r=>r.json()).then(J=>{const cnt={};
   J.pts.forEach(p=>{const t=TT[p.t];if(!t)return;cnt[p.t]=(cnt[p.t]||0)+1;const g=groups[p.t]||(groups[p.t]=(L.markerClusterGroup?L.markerClusterGroup({maxClusterRadius:38,showCoverageOnHover:false,disableClusteringAtZoom:3}):L.layerGroup()));
    const nm=p.n;
    L.marker(ll(p.x,p.y),{icon:L.divIcon({className:'pmk pmk-'+({alpha:'alpha',tower:'tower',travel:'travel'}[p.t]||'misc'),html:'<span>'+t[0]+'</span>',iconSize:[30,30],iconAnchor:[15,15]}),title:nm})
     .bindPopup(()=>window.PW_pop({t:p.t,name:nm,lvl:p.lv,kind:t[0]+' '+t[1]}),{maxWidth:280,minWidth:220}).addTo(g)});
   ['alpha','tower','travel','watch','npc'].forEach(k=>groups[k]&&groups[k].addTo(m));
   lay.onAdd=()=>{const d=L.DomUtil.create('div','mleg');const small=innerWidth<700;d.innerHTML=`<button class="mleg-t">🗺 Слои</button><div class="mleg-b" ${small?'hidden':''}>`+Object.keys(TT).filter(k=>cnt[k]).map(k=>`<label><input type="checkbox" ${m.hasLayer(groups[k])?'checked':''} data-k="${k}"> ${TT[k][0]} ${TT[k][1]} <small>${cnt[k]}</small></label>`).join('')+'</div>';
    L.DomEvent.disableClickPropagation(d);d.querySelector('.mleg-t').onclick=()=>{const b=d.querySelector('.mleg-b');b.hidden=!b.hidden};d.querySelectorAll('input').forEach(i=>i.onchange=()=>i.checked?m.addLayer(groups[i.dataset.k]):m.removeLayer(groups[i.dataset.k]));return d};lay.addTo(m);
   habitat();});
  TM={m,ll};setTimeout(()=>m.invalidateSize(),60);return TM};
 let HL=null;
 function habitat(){const q=new URLSearchParams(location.search),id=q.get('pal');if(!id)return;const tod=q.get('t')=='n'?'n':'d';
  fetch(B+'hab/'+id+'.json').then(r=>r.json()).then(H=>{const D=window.PW_D;const pal=D&&D.pals.find(p=>p.id==id);const nm=pal?pal.ru:id;
   const add=(M,ll,pts,al)=>{if(!M)return null;const g=L.layerGroup();pts.forEach(p=>L.circleMarker(ll(p[0],p[1]),{radius:5,color:'#1b1300',weight:1,fillColor:'#ffd34d',fillOpacity:.9}).bindPopup(()=>window.PW_pop({t:'hab',name:nm,sub:(tod=='n'?'Ночью':'Днём')+(p[2]?' · ур. '+p[2]:'')}),{maxWidth:280,minWidth:220}).addTo(g));
     (al||[]).forEach(p=>L.circleMarker(ll(p[0],p[1]),{radius:8,color:'#fff',weight:2,fillColor:'#ff5a6a',fillOpacity:1}).bindPopup(()=>window.PW_pop({t:'alpha',name:nm,kind:'👑 Альфа'}),{maxWidth:280,minWidth:220}).addTo(g));g.addTo(M.m);
     const b=pts.concat(al||[]);if(b.length)M.m.fitBounds(L.latLngBounds(b.map(p=>ll(p[0],p[1]))).pad(.3),{maxZoom:4});return g};
   const P=window.PW_map,pm=P&&{m:P.m,ll:(x,y)=>P.m.unproject([(x-X0)/(X1-X0)*S,(Y0-y)/(Y0-Y1)*S],Z)};
   const wantTree=q.get('w')=='tree'||!(H.p&&((H.p[tod]||[]).length||(H.p.a||[]).length));
   if(wantTree&&H.t){const sw=document.querySelector('.mapsw [data-w=t]');if(sw&&!TM){sw.click();return}if(TM&&!HL)HL=add(TM,TM.ll,H.t[tod]||[],H.t.a)}
   else if(H.p&&pm&&!HL)HL=add(pm,pm.ll,H.p[tod]||[],H.p.a);
   const n=((wantTree?H.t:H.p)||{})[tod]||[];
   if(!document.querySelector('.habchip')){const c=document.createElement('div');c.className='habchip';c.innerHTML=`<span>📍 Обитание: <b>${esc(nm)}</b> · ${tod=='n'?'ночь':'день'} · ${n.length} точек</span><a href="?pal=${encodeURIComponent(id)}&t=${tod=='n'?'d':'n'}${wantTree?'&w=tree':''}">${tod=='n'?'☀️ День':'🌙 Ночь'}</a><a href="${location.pathname}" aria-label="Убрать">✕</a>`;
    const anchor=document.querySelector('.msheet .mrow')||document.querySelector('.msq');anchor?anchor.after(c):document.getElementById('pwmap').before(c)}
  }).catch(()=>{})}
 document.addEventListener('DOMContentLoaded',()=>{if(!document.getElementById('pwmap'))return;const w=setInterval(()=>{if(!window.PW_map)return;clearInterval(w);
   if(!window.PW_D&&window.PW_data)window.PW_data().then(D=>{window.PW_D=D;habitat()});else habitat();
   if(new URLSearchParams(location.search).get('w')=='tree'||location.hash=='#tree'){let n=0;const t=setInterval(()=>{const b=document.querySelector('.mapsw [data-w=t]');if(b&&b.onclick)b.click();if(document.getElementById('wtmap')||++n>40)clearInterval(t)},150)}},150)});
})();
/* active skills gallery */
document.addEventListener('DOMContentLoaded',()=>{const F=document.querySelector('.skf');if(!F)return;const g=document.querySelector('.skg'),q=F.querySelector('.sk-q'),so=F.querySelector('.sk-s'),n=F.querySelector('.skn');
 const cards=[...g.children];const st={el:'',pw:'',ct:'',ef:'',u:'',f:''};const rng=(v,r)=>{if(!r)return true;const[a,b]=r.split('-').map(Number);return v>=a&&v<=b};
 const u=new URLSearchParams(location.search);Object.keys(st).forEach(k=>{if(u.get(k))st[k]=u.get(k)});if(u.get('q'))q.value=u.get('q');if(u.get('s'))so.value=u.get('s');
 const paint=()=>F.querySelectorAll('.fc').forEach(b=>b.classList.toggle('on',st[b.dataset.g]==b.dataset.v));
 const run=()=>{const t=(q.value||'').toLowerCase().replace(/ё/g,'е').trim();const k=so.value;
  cards.sort((a,b)=>k=='n'?a.dataset.n.localeCompare(b.dataset.n,'ru'):k=='ct'?(+a.dataset.ct-+b.dataset.ct):(+b.dataset.pw-+a.dataset.pw));
  let c=0;const fr=document.createDocumentFragment();cards.forEach(x=>{const d=x.dataset;const ok=(!st.el||d.el==st.el)&&rng(+d.pw,st.pw)&&rng(+d.ct,st.ct)&&(!st.ef||d.ef.split(' ').includes(st.ef))&&(!st.u||d.u=='1')&&(!st.f||d.f=='1')&&(!t||d.n.replace(/ё/g,'е').includes(t)||d.ef.toLowerCase().includes(t));
   x.hidden=!ok;c+=ok;fr.appendChild(x)});g.appendChild(fr);n.textContent=c?('Найдено: '+c):'Ничего не нашлось — сбрось фильтры';paint();
  const p=new URLSearchParams();Object.entries(st).forEach(([a,b])=>b&&p.set(a,b));if(t)p.set('q',t);if(k!='pw')p.set('s',k);history.replaceState(null,'',(p+''?'?'+p:location.pathname)+location.hash)};
 F.addEventListener('click',e=>{const b=e.target.closest('.fc');if(!b)return;const gk=b.dataset.g;st[gk]=(st[gk]==b.dataset.v&&b.dataset.v)?'':b.dataset.v;run()});
 q.addEventListener('input',run);so.addEventListener('change',run);run();
 if(location.hash){const x=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(x&&x.tagName=='DETAILS'){x.open=true;x.hidden=false;setTimeout(()=>x.scrollIntoView({block:'center'}),100)}}});
/* G11: glossary — first mention of a hard word gets a dotted underline and a one-line tip */
document.addEventListener('DOMContentLoaded',()=>{const art=document.querySelector('article.md-content__inner');if(!art)return;
 const G=[[/\bIV\b/,'Таланты (IV) — скрытые бонусы пала к здоровью, атаке и защите, от 0 до 100. Чем больше, тем сильнее.'],
  [/[Кк]онденсаци[яиюей]/,'Конденсация — слияние одинаковых палов в Конденсаторе. Даёт звёзды: пал становится сильнее и лучше работает.'],
  [/[Сс]ила разведения/,'Сила разведения — скрытое число вида. Ребёнок получается с силой, близкой к среднему двух родителей.'],
  [/[Мм]ножитель поимки/,'Множитель поимки — насколько легко поймать пала. Больше — проще.'],
  [/\bCT\b/,'CT — перезарядка навыка в секундах.'],[/\bмет[аеуы]\b/,'Мета — то, чем чаще всего пользуются сильные игроки.'],
  [/[Пп]ригодност[ьи]/,'Пригодность к работе — какие работы пал умеет и на каком уровне (1–10).'],[/[Кк]улдаун/,'Кулдаун — время до повторного использования.'],
  [/[Рр]еспаун/,'Респаун — повторное появление после гибели или сбора.'],[/[Сс]павн/,'Спавн — место, где появляются палы или предметы.'],[/\bDPS\b/,'DPS — урон в секунду.'],[/\bкап\b/,'Кап — потолок, выше которого значение не растёт.']];
 const done=new Set();const w=document.createTreeWalker(art,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('a,button,code,pre,kbd,h1,h2,h3,input,label,select,textarea,.gl,.hlp-pop,script,style,.leaflet-container,summary.tabbed-labels')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
 for(const n of nodes){for(let i=0;i<G.length;i++){if(done.has(i))continue;const m=n.nodeValue.match(G[i][0]);if(!m)continue;done.add(i);
   const r=n.splitText(m.index);r.splitText(m[0].length);const s=document.createElement('span');s.className='gl';s.tabIndex=0;s.setAttribute('role','button');s.dataset.tip=G[i][1];s.textContent=r.nodeValue;r.replaceWith(s);break}
  if(done.size==G.length)break}});
/* L02: boss filters as chip rows driving the hidden selects */
document.addEventListener('click',e=>{const b=e.target.closest('#bfl .fcs .fc');if(!b)return;const row=b.closest('.fcs'),sel=document.getElementById(row.dataset.s);if(!sel)return;sel.value=b.dataset.v;row.querySelectorAll('.fc').forEach(x=>x.classList.toggle('on',x===b));sel.dispatchEvent(new Event('change',{bubbles:true}))});
/* map search keyboard mode (iOS): keep the sheet above the keyboard, collapse filters, map stays visible */
document.addEventListener('DOMContentLoaded',()=>{const q=document.getElementById('mapq');if(!q)return;const vv=window.visualViewport;
 const sh=()=>document.querySelector('.msheet');
 const place=()=>{const s=sh();if(!s||!s.classList.contains('kb'))return;const kb=vv?Math.max(0,innerHeight-vv.height-vv.offsetTop):0;s.style.setProperty('--kb',kb+'px');
  const free=(vv?vv.height:innerHeight)-130;s.style.setProperty('--kbh',Math.max(120,Math.min(free*0.55,300))+'px')};
 q.addEventListener('focus',()=>{const s=sh();if(!s)return;s.classList.add('kb');document.documentElement.classList.add('mapkb');place();setTimeout(place,300)});
 q.addEventListener('blur',()=>setTimeout(()=>{if(document.activeElement===q)return;const s=sh();if(s){s.classList.remove('kb');s.style.removeProperty('--kb')}document.documentElement.classList.remove('mapkb')},200));
 if(vv){vv.addEventListener('resize',place);vv.addEventListener('scroll',place)}});
/* all search inputs: no contact autofill / autocorrect on iOS */
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('input[type=search],input[type=text],#mapq,#hsq,.sk-q,#bq2,#gq,.pfq,.psvq,.ffq,#askq,#home-q').forEach(i=>{if(i.type=='range'||i.type=='number')return;
 i.setAttribute('autocomplete','off');i.setAttribute('autocorrect','off');i.setAttribute('autocapitalize','off');i.setAttribute('spellcheck','false');i.setAttribute('enterkeyhint','search');if(i.type=='text')i.type='search';if(!i.name)i.name='pp-q-'+(i.id||i.className.split(' ')[0]||'f')})});
