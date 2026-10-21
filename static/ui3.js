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
document.addEventListener('DOMContentLoaded',()=>{const F=document.querySelector('.food');if(!F)return;const g=F.querySelector('.fgrid'),q=F.querySelector('.ffq'),so=F.querySelector('.ffs'),n=F.querySelector('.ffn');let e='';const cards=[...g.children];
 const run=()=>{const t=(q.value||'').toLowerCase().replace(/ё/g,'е');let c=0;const k=so.value;cards.sort((a,b)=>k=='n'?a.dataset.n.localeCompare(b.dataset.n,'ru'):(+b.dataset[k]-+a.dataset[k]));cards.forEach(x=>{const ok=(!e||x.dataset.e.split(' ').includes(e))&&(!t||x.dataset.n.replace(/ё/g,'е').includes(t));x.hidden=!ok;if(ok)c++;g.appendChild(x);});n.textContent='Найдено '+c;};
 F.querySelectorAll('.fc').forEach(b=>b.onclick=()=>{e=b.dataset.e;F.querySelectorAll('.fc').forEach(z=>z.classList.toggle('on',z===b));run();});q.oninput=run;so.onchange=run;run();});
/* habitat mini map on pal pages: points from hab/<id>.json (game data via paldb.cc) */
(function(){
  const X0=-1923.225927,Y0=1032.79857101,X1=1234.833276624702,Y1=-2125.2606328;
  function init(root){
    const box=root.querySelectorAll('.habmap:not([data-ok])');
    box.forEach(el=>{el.dataset.ok=1;const img=el.querySelector('.hm-img'),dots=el.querySelector('.hm-dots'),cnt=el.querySelector('.hm-c'),full=el.querySelector('.hm-full');
      const base=img.getAttribute('src').replace(/assets\/wtree\/mini_\w+\.webp$/,'');let H=null,tod='d',w=(+el.dataset.d||+el.dataset.n)?'p':'t';
      if(!(+el.dataset.d)&&+el.dataset.n)tod='n';
      el.querySelectorAll('.hm-tod button').forEach(b=>b.classList.toggle('on',b.dataset.k==tod));
      function draw(){if(!H)return;const W=H[w]||{};let pts=(W[tod]||[]);const al=W.a||[];
        let h='';const f=w=='p'?(x,y)=>[(x-X0)/(X1-X0),(Y0-y)/(Y0-Y1)]:(x,y)=>[x,y];
        let mnx=1,mny=1,mxx=0,mxy=0;
        pts.forEach(p=>{const[a,b]=f(p[0],p[1]);mnx=Math.min(mnx,a);mny=Math.min(mny,b);mxx=Math.max(mxx,a);mxy=Math.max(mxy,b);h+=`<i style="left:${(a*100).toFixed(2)}%;top:${(b*100).toFixed(2)}%"></i>`});
        al.forEach(p=>{const[a,b]=f(p[0],p[1]);h+=`<i class="al" title="Альфа" style="left:${(a*100).toFixed(2)}%;top:${(b*100).toFixed(2)}%"></i>`});
        dots.innerHTML=h;img.src=base+'assets/wtree/mini_'+(w=='p'?'palpagos':'tree')+'.webp';
        // zoom to the spawn area (keeps context)
        const bx=el.querySelector('.hm-box');if(pts.length){const cx=(mnx+mxx)/2,cy=(mny+mxy)/2,sp=Math.max(mxx-mnx,mxy-mny,.12)*1.6,sc=Math.min(4,Math.max(1,1/sp));
          bx.style.setProperty('--s',sc);bx.style.setProperty('--x',((.5-cx)*100*sc).toFixed(2)+'%');bx.style.setProperty('--y',((.5-cy)*100*sc).toFixed(2)+'%')}else{bx.style.setProperty('--s',1);bx.style.setProperty('--x','0%');bx.style.setProperty('--y','0%')}
        cnt.textContent=pts.length?`${pts.length} ${tod=='d'?'точек днём':'точек ночью'}`+(al.length?` · альфа: ${al.length}`:''):(tod=='n'?'Ночью не появляется':'Днём не появляется');
        if(full)full.href=base+'map/?pal='+el.dataset.pal+(w=='t'?'&w=tree':'')+(tod=='n'?'&t=n':'')}
      el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.k){tod=b.dataset.k;el.querySelectorAll('.hm-tod button').forEach(x=>x.classList.toggle('on',x===b))}if(b.dataset.w){w=b.dataset.w;el.querySelectorAll('.hm-w button').forEach(x=>x.classList.toggle('on',x===b))}draw()});
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
  m.setMaxBounds(bounds.pad(.2));m.fitBounds(bounds);
  const groups={};const lay=L.control({position:'topright'});
  fetch(B+'assets/wtree/markers.json').then(r=>r.json()).then(J=>{const cnt={};
   J.pts.forEach(p=>{const t=TT[p.t];if(!t)return;cnt[p.t]=(cnt[p.t]||0)+1;const g=groups[p.t]||(groups[p.t]=(L.markerClusterGroup?L.markerClusterGroup({maxClusterRadius:38,showCoverageOnHover:false,disableClusteringAtZoom:3}):L.layerGroup()));
    const nm=p.t=='alpha'?RU(p.n):p.n;
    L.marker(ll(p.x,p.y),{icon:L.divIcon({className:'pmk pmk-'+({alpha:'alpha',tower:'tower',travel:'travel'}[p.t]||'misc'),html:'<span>'+t[0]+'</span>',iconSize:[30,30],iconAnchor:[15,15]}),title:nm})
     .bindPopup(`<div class="mpop"><div class="mk">${t[0]} ${esc(t[1])}</div><b>${esc(nm||t[1])}</b>${p.lv?`<div>Уровень ${esc(p.lv)}</div>`:''}</div>`).addTo(g)});
   ['alpha','tower','travel','watch','npc'].forEach(k=>groups[k]&&groups[k].addTo(m));
   lay.onAdd=()=>{const d=L.DomUtil.create('div','mleg');const small=innerWidth<700;d.innerHTML=`<button class="mleg-t">🗺 Слои</button><div class="mleg-b" ${small?'hidden':''}>`+Object.keys(TT).filter(k=>cnt[k]).map(k=>`<label><input type="checkbox" ${m.hasLayer(groups[k])?'checked':''} data-k="${k}"> ${TT[k][0]} ${TT[k][1]} <small>${cnt[k]}</small></label>`).join('')+'</div>';
    L.DomEvent.disableClickPropagation(d);d.querySelector('.mleg-t').onclick=()=>{const b=d.querySelector('.mleg-b');b.hidden=!b.hidden};d.querySelectorAll('input').forEach(i=>i.onchange=()=>i.checked?m.addLayer(groups[i.dataset.k]):m.removeLayer(groups[i.dataset.k]));return d};lay.addTo(m);
   habitat();});
  TM={m,ll};setTimeout(()=>m.invalidateSize(),60);return TM};
 let HL=null;
 function habitat(){const q=new URLSearchParams(location.search),id=q.get('pal');if(!id)return;const tod=q.get('t')=='n'?'n':'d';
  fetch(B+'hab/'+id+'.json').then(r=>r.json()).then(H=>{const D=window.PW_D;const pal=D&&D.pals.find(p=>p.id==id);const nm=pal?pal.ru:id;
   const add=(M,ll,pts,al)=>{if(!M)return null;const g=L.layerGroup();pts.forEach(p=>L.circleMarker(ll(p[0],p[1]),{radius:5,color:'#1b1300',weight:1,fillColor:'#ffd34d',fillOpacity:.9}).bindPopup(`<div class="mpop"><b>${esc(nm)}</b><div>${tod=='n'?'Ночью':'Днём'}${p[2]?' · ур. '+p[2]:''}</div></div>`).addTo(g));
     (al||[]).forEach(p=>L.circleMarker(ll(p[0],p[1]),{radius:8,color:'#fff',weight:2,fillColor:'#ff5a6a',fillOpacity:1}).bindPopup(`<div class="mpop"><b>${esc(nm)}</b><div>Альфа</div></div>`).addTo(g));g.addTo(M.m);
     const b=pts.concat(al||[]);if(b.length)M.m.fitBounds(L.latLngBounds(b.map(p=>ll(p[0],p[1]))).pad(.3),{maxZoom:4});return g};
   const P=window.PW_map,pm=P&&{m:P.m,ll:(x,y)=>P.m.unproject([(x-X0)/(X1-X0)*S,(Y0-y)/(Y0-Y1)*S],Z)};
   const wantTree=q.get('w')=='tree'||!(H.p&&((H.p[tod]||[]).length||(H.p.a||[]).length));
   if(wantTree&&H.t){const sw=document.querySelector('.mapsw [data-w=t]');if(sw&&!TM){sw.click();return}if(TM&&!HL)HL=add(TM,TM.ll,H.t[tod]||[],H.t.a)}
   else if(H.p&&pm&&!HL)HL=add(pm,pm.ll,H.p[tod]||[],H.p.a);
   const n=((wantTree?H.t:H.p)||{})[tod]||[];
   if(!document.querySelector('.habchip')){const c=document.createElement('div');c.className='habchip';c.innerHTML=`<span>📍 Обитание: <b>${esc(nm)}</b> · ${tod=='n'?'ночь':'день'} · ${n.length} точек</span><a href="?pal=${encodeURIComponent(id)}&t=${tod=='n'?'d':'n'}${wantTree?'&w=tree':''}">${tod=='n'?'☀️ День':'🌙 Ночь'}</a><a href="${location.pathname}" aria-label="Убрать">✕</a>`;
    const anchor=document.querySelector('.msq');anchor?anchor.after(c):document.getElementById('pwmap').before(c)}
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
