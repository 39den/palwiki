/* MAPICONS 21.10: game-style map icons (palworld.wiki.gg Compass icons, CC BY-SA) + collision declutter instead of red clusters */
(function(){const B=()=>window.PW_BASE||'/palwiki/';
 const I={travel:['travel.webp','#2ec4b6',3],tower:['tower.webp','#b07cff',3],alpha:['alpha.webp','#ff6b5a',2],sealed:['sealed.svg','#4aa3ff',2],dungeon:['dungeon.webp','#e0b04a',2],watch:['watch.webp','#8fb3c9',1],npc:['npc.webp','#36bb91',1],merchant:['merchant.webp','#36bb91',1],chest:['chest.svg','#f0c45a',0],fruit:['fruit.svg','#7bd389',0],spring:['spring.svg','#5fb4ff',0],fish:['fish.webp','#5fb4ff',0],ore:['ore.webp','#c9c9c9',0],effigy:['effigy.svg','#9fe870',0],hab:['hab.webp','#ffd34d',1]};
 const v=t=>I[t]||I.hab;
 const face=n=>{const P=(window.PW_D||{}).pals||[];const q=P.find(p=>p.ru==n)||P.find(p=>p.en==n);return q&&q.thumb?B()+q.thumb:''};
 const icon=(t,sz,nm)=>{sz=sz||28;const f=t=='alpha'&&nm?face(nm):'';if(f)sz=Math.max(sz,34);return L.divIcon({className:'gmk gmk-'+t+(f?' gmk-face':''),html:`<i style="--c:${v(t)[1]};width:${sz}px;height:${sz}px"><img src="${f||B()+'assets/mapicons/'+v(t)[0]}" alt="" draggable="false"></i>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2],popupAnchor:[0,-sz/2]})};
 const leg=t=>{if(t=='alpha'){const f=face('Чиллет')||face('Chillet');if(f)return `<i class="gmk-l gmk-lf"><img src="${f}" alt=""></i>`}return `<i class="gmk-l" style="--c:${v(t)[1]}"><img src="${B()}assets/mapicons/${v(t)[0]}" alt=""></i>`};
 const POP={maxWidth:280,minWidth:220,autoPan:true,autoPanPaddingTopLeft:[12,72],autoPanPaddingBottomRight:[12,24]};
 (window.PW_maps=window.PW_maps||[]);
 if(!window.PW_escG){window.PW_escG=1;
  document.addEventListener('keydown',e=>{if(e.key!='Escape')return;(window.PW_maps||[]).forEach(m=>m.closePopup());document.querySelectorAll('.lbx').forEach(x=>x.remove());const d=document.getElementById('__drawer');if(d&&d.checked){d.checked=false;d.dispatchEvent(new Event('change'))}});
  document.addEventListener('pointerdown',e=>{(window.PW_maps||[]).forEach(m=>{const c=m.getContainer();if(!c.contains(e.target)&&!(e.target.closest&&e.target.closest('.leaflet-popup')))m.closePopup()})},true)}
 function fit(m){window.PW_maps.push(m);m.on('popupopen',e=>{const pp=e.popup;const fx=()=>{if(!pp.isOpen())return;const el=pp.getElement();if(!el)return;const r=el.getBoundingClientRect(),mr=m.getContainer().getBoundingClientRect();const lo=Math.max(mr.left,0),hi=Math.min(mr.right,innerWidth),tp=Math.max(mr.top,0),bt=Math.min(mr.bottom,innerHeight);let dx=0,dy=0;if(r.left<lo+6)dx=r.left-lo-6;else if(r.right>hi-6)dx=r.right-hi+6;if(r.bottom>bt-6)dy=r.bottom-bt+6;else if(r.top<tp+6)dy=r.top-tp-6;if(dx||dy)m.panBy([dx,dy],{animate:false});{const r3=el.getBoundingClientRect();let ex=0;if(r3.left<lo+6)ex=lo+6-r3.left;else if(r3.right>hi-6)ex=hi-6-r3.right;if(ex){const of=L.point(pp.options.offset||[0,7]);pp.options.offset=L.point(of.x+ex,of.y);pp.update();const t=el.querySelector('.leaflet-popup-tip-container');if(t)t.style.marginLeft=(-20-ex)+'px'}}};setTimeout(fx,60);setTimeout(fx,200);setTimeout(fx,450);setTimeout(fx,900);setTimeout(fx,1500);setTimeout(()=>{const el=pp.getElement();el&&el.querySelectorAll('img').forEach(i=>i.complete||i.addEventListener('load',fx,{once:true}))},0);requestAnimationFrame(()=>{const el=pp.getElement();if(!el)return;const r=el.getBoundingClientRect(),mr=m.getContainer().getBoundingClientRect();
   if(r.top<mr.top+4&&!pp._dn){pp._dn=1;pp.options.offset=L.point(0,r.height+34);el.classList.add('pop-dn');pp.update()}
   const r2=el.getBoundingClientRect();const lo=Math.max(mr.left,0),hi=Math.min(mr.right,innerWidth);let dx=0;if(r2.left<lo+6)dx=r2.left-lo-6;else if(r2.right>hi-6)dx=r2.right-hi+6;if(dx)m.panBy([dx,0],{animate:false})})});
  m.on('popupclose',e=>{const pp=e.popup;if(pp._dn){pp._dn=0;pp.options.offset=L.point(0,7);const el=pp.getElement();el&&el.classList.remove('pop-dn')}})}
 function DC(m){const items=[],off=new Set();let pin=null,boost=null,raf=0;
  const run=()=>{raf=0;const max=m.getZoom()>=m.getMaxZoom()-.01,sz=m.getSize(),placed=[];
   const pr=it=>(it.mk===pin?9:0)+(boost&&boost.has(it.mk)?5:0)+it.prio+(it.mk.isPopupOpen&&it.mk.isPopupOpen()?20:0);
   const order=items.slice().sort((a,b)=>pr(b)-pr(a));
   const hit=(x,y,s)=>placed.some(q=>Math.abs(q[0]-x)<(q[2]+s)/2+3&&Math.abs(q[1]-y)<(q[2]+s)/2+3);
   for(const it of order){const mk=it.mk;const keep=mk.isPopupOpen&&mk.isPopupOpen();
    if(off.has(it.t)&&mk!==pin&&!keep){mk._map&&m.removeLayer(mk);continue}
    const p=m.latLngToContainerPoint(mk.getLatLng());
    if(p.x<-80||p.y<-80||p.x>sz.x+80||p.y>sz.y+80){if(mk._map&&!keep)m.removeLayer(mk);continue}
    let dx=0,dy=0,ok=!hit(p.x,p.y,it.s);const force=max||(it.prio>=3&&m.getZoom()>=m.getMinZoom()+2)||mk===pin||keep||(boost&&boost.has(mk));if(it.prio<1&&!force&&m.getZoom()<m.getMinZoom()+2){if(mk._map)m.removeLayer(mk);continue}
    if(!ok&&force)for(let k=1;k<=40&&!ok;k++){const a=k*2.4,r=it.s*(.9+k*.18);dx=Math.round(Math.cos(a)*r);dy=Math.round(Math.sin(a)*r);ok=!hit(p.x+dx,p.y+dy,it.s)}
    if(ok||keep){placed.push([p.x+dx,p.y+dy,it.s]);if(!mk._map)mk.addTo(m);const e=mk.getElement&&mk.getElement();const i=e&&e.firstChild;if(i)i.style.transform=dx||dy?`translate(${dx}px,${dy}px)`:'';if(e)e.classList.toggle('gmk-sh',!!(dx||dy))}
    else if(mk._map)m.removeLayer(mk)}};
  const q=()=>{if(!raf)raf=requestAnimationFrame(run)};m.on('zoomend moveend resize',q);
  const api={items,add(mk,t,s,prio){items.push({mk,t,s:s||28,prio:prio==null?v(t)[2]:prio});mk.on('popupclose',q);q();return mk},
   on:(t,b)=>{b?off.delete(t):off.add(t);q()},isOn:t=>!off.has(t),pin:mk=>{pin=mk;run()},boost:s=>{boost=s;q()},run,
   group(t){const g=L.layerGroup();g.hasLayer=mk=>items.some(it=>it.mk===mk&&it.t===t);g.zoomToShowLayer=(mk,cb)=>{m.setView(mk.getLatLng(),Math.max(m.getZoom(),4),{animate:false});api.pin(mk);setTimeout(cb,60)};return g}};
  return api}
 window.PW_MI={I,icon,leg,POP,DC,fit};})();

/* map popups: one tappable card linking to the entity page (pal / boss / guide section) */
window.PW_pop=function(o){const B=window.PW_BASE||'/palwiki/';const D=window.PW_D||{};const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const EM={'Огонь':'🔥','Вода':'💧','Трава':'🌿','Молния':'⚡','Лёд':'❄️','Земля':'🪨','Тьма':'🌑','Дракон':'🐉','Нейтральный':'⚪'};
 const T={alpha:'👑 Альфа',sealed:'🔒 Запечатанные земли',tower:'🏯 Башня',travel:'🗿 Телепорт',watch:'🗼 Смотровая вышка',npc:'🧑 Персонаж',chest:'🎁 Сундук',fruit:'🌳 Плодовое дерево',spring:'💧 Источник',fish:'🎣 Место рыбалки',hab:'📍 Обитание'};
 const G={travel:['guide/11_mir/#быстрое-перемещение','Как работают телепорты'],fish:['guide/11_mir/#рыбалка','Как рыбачить'],chest:['guide/sekrety/','Секреты и сундуки'],npc:['guide/11_mir/#особые-npc','Персонажи мира'],watch:['guide/11_mir/','Гид по миру'],fruit:['guide/11_mir/','Гид по миру'],spring:['guide/11_mir/','Гид по миру'],tower:['4_spravochniki/bossy/','Все боссы башен']};
 const pals=D.pals||[];const byRu=n=>pals.find(p=>p.ru==n)||pals.find(p=>p.en==n);
 let pal=null,boss=null,url=o.url||'',label='';
 if(o.t=='alpha'||o.t=='hab')pal=byRu(o.name);
 if(o.t=='sealed')pal=byRu((o.info||'').split('· ')[1]||'')||byRu(o.name);
 if(o.t=='tower'){boss=(D.bosses||[]).find(b=>b.place==o.name)||(D.bosses||[]).find(b=>b.pal&&o.name.indexOf(b.pal)>=0)||(D.bosses||[]).find(b=>b.name&&b.name.indexOf(o.name)>=0);
  if(!boss){const bc=(D.bcards||[]).find(b=>b.n==o.name||b.pal==o.name||(b.n||'').indexOf(o.name)>=0);if(bc)boss={url:bc.u,el:bc.el,weak:bc.w,pal:bc.pal,t:bc.t}}}
 if(pal&&!url)url=pal.url;if(boss)url=boss.url||url;
 if(!url&&G[o.t]){url=G[o.t][0];label=G[o.t][1]}
 const el=(pal&&pal.el)||(boss&&boss.el)||[],wk=(pal&&pal.weak)||(boss&&boss.weak)||[];
 const bp=boss&&!pal?byRu(boss.pal):null;const th=(pal&&pal.thumb)||(boss&&boss.t)||(bp&&bp.thumb)||'';
 const chips=el.length?`<div class="mpe">${el.map(e=>`<span>${EM[e]||''} ${esc(e)}</span>`).join('')}</div>`:'';
 const w=wk.length?`<div class="mpw">Слабость: ${wk.map(e=>(EM[e]||'')+' '+esc(e)).join(', ')}</div>`:'';
 const body=`${th?`<img class="mpt" src="${B+th}" alt="" width="56" height="56" loading="lazy">`:''}<div class="mpb"><div class="mk">${esc(o.kind||T[o.t]||'')}</div><b>${esc(o.name||T[o.t]||'')}</b>${o.lvl?`<div class="mpl">Уровень ${esc(o.lvl)}</div>`:''}${o.sub?`<div class="mpl">${esc(o.sub)}</div>`:''}${chips}${w}</div>`;
 const go=label||(pal?'Страница пала':boss?'Страница босса':'Подробнее');
 return url?`<a class="mpop mpcard" href="${B+url.replace(/^\//,'')}">${body}<span class="mpgo">${esc(go)} →</span></a>`:`<div class="mpop mpcard">${body}</div>`};
(function(){const B=window.PW_BASE,chip=window.PW_chip;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ACT={party:'🎒 из команды',summoned:'🐾 выпущен',mounted:'🐎 верхом',active:'🔘 кнопкой',base:'🏠 на базе'};
const WORKS=['Добыча','Рубка деревьев','Разжигание огня','Полив','Посев семян','Генерация энергии','Ручная работа','Сбор','Фармацевтика','Охлаждение','Транспортировка','Фермерство'];
const ELS=['Нейтральный','Огонь','Вода','Трава','Молния','Лёд','Земля','Тьма','Дракон'];
const card=p=>`<a class="pc card-link g-${({"Нейтральный":"neutral","Огонь":"fire","Вода":"water","Трава":"grass","Молния":"electric","Лёд":"ice","Земля":"ground","Тьма":"dark","Дракон":"dragon"})[p.el[0]]}" href="${B+p.url}"><img src="${B+p.thumb}" alt="${esc(p.ru)}" loading="lazy" width="110" height="110"><small>#${esc(p.no)}</small><b>${esc(p.ru)}</b><span>${p.el.map(chip).join('')}</span></a>`;
function gallery(D){const f=document.getElementById('gal-filters'),g=document.getElementById('gallery');
 const sel=(id,label,opts)=>`<select id="${id}"><option value="">${label}</option>${opts.map(o=>`<option value="${esc(o[0])}">${esc(o[1])}</option>`).join('')}</select>`;
 f.innerHTML=`<input id="gq" name="pp-q-gq" type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="Найти пала…">`+sel('ge','Стихия',ELS.map(e=>[e,e]))+sel('gw','Работа',WORKS.map(e=>[e,e]))+sel('gl','Ур. работы ≥',[1,2,3,4,5].map(e=>[e,'≥ '+e]))+sel('gm','Езда',[['ride','🐎 ездовой'],['fly','🦅 летающий']])+sel('ga','Партнёрка',Object.entries(ACT))+sel('gs','Сортировка',[['no','по номеру'],['ru','по имени'],['atk','атака ↓'],['hp','HP ↓'],['work','уровень работы ↓'],['sprint','скорость ↓']])+`<span class="gal-count" id="gc"></span>`;
 const pals=D.pals.filter(p=>p.url);const $=id=>document.getElementById(id).value;
 const _qv=v=>{v=(v||'').trim();const C=window.PW_core;if(!v)return [];if(!C||!C.norm)return [v.toLowerCase().replace(/ё/g,'е')];const n=C.norm(v);let f=null;try{f=C.fixLayout&&C.fixLayout(v.toLowerCase())}catch(e){}return f&&f[1]?[n,C.norm(f[0])]:[n]};const run=()=>{const qs=_qv($('gq')),e=$('ge'),w=$('gw'),l=+$('gl')||0,m=$('gm'),a=$('ga'),s=$('gs')||'no';
  const wl=p=>(p.work.find(x=>x[0]==w)||[0,0])[1];
  let r=pals.filter(p=>(!qs.length||qs.some(q=>window.PW_core.norm(p.ru+' '+p.en).includes(q)))&&(!e||p.el.includes(e))&&(!w||wl(p)>=Math.max(1,l))&&(w||!l||p.work.some(x=>x[1]>=l))&&(!m||(m=='ride'?p.mount:p.mount=='fly'))&&(!a||p.act.includes(a)));
  const num=p=>parseFloat(p.no)||999;
  r.sort(s=='ru'?(x,y)=>x.ru.localeCompare(y.ru,'ru'):s=='no'?(x,y)=>num(x)-num(y)||x.no.localeCompare(y.no):s=='work'?(x,y)=>(w?wl(y)-wl(x):Math.max(0,...y.work.map(z=>z[1]))-Math.max(0,...x.work.map(z=>z[1]))):(x,y)=>y[s]-x[s]);
  g.innerHTML=r.map(card).join('');document.getElementById('gc').textContent='Найдено: '+r.length;};
 f.addEventListener('input',run);f.addEventListener('change',run);run();}
function potd(D){const ps=D.pals.filter(p=>p.url&&p.thumb);const d=new Date();const p=ps[(d.getFullYear()*372+d.getMonth()*31+d.getDate())%ps.length];
 document.getElementById('potd').innerHTML=`<a class="potd card-link" href="${B+p.url}"><img src="${B+p.thumb}" alt="" loading="lazy"><div><h3>${esc(p.ru)} <small>#${esc(p.no)}</small></h3>${p.el.map(chip).join('')}<div>${p.work.map(w=>esc(w[0])+' '+w[1]).join(' · ')}</div><div>Партнёрка: <b>${esc(p.psk)}</b> ${p.act.map(x=>ACT[x]||'').join(' ')}</div><span class="open">Открыть →</span></div></a>`;}
function compare(D){const box=document.getElementById('cmp');const u=new URLSearchParams(location.search);
 const WI={'Разжигание огня':'🔥','Полив':'💧','Посев семян':'🌱','Генерация энергии':'⚡','Ручная работа':'🖐️','Сбор':'🌾','Рубка деревьев':'🪓','Добыча':'⛏️','Фармацевтика':'💊','Охлаждение':'❄️','Транспортировка':'📦','Фермерство':'🐑'};
 const PR=Object.fromEntries((D.passives||[]).map(q=>[q.name,q]));
 const rc=r=>r<0?'r-neg':r>=2?'r-'+Math.min(r,5):'';
 const pchip=n=>{const q=PR[n];return q&&q.url?`<a class="psv ${rc(q.rank)}" data-psv="${esc(n)}" href="${B+q.url}">${esc(n)}</a>`:`<span class="psv">${esc(n)}</span>`;};
 box.innerHTML=`<input id="c1" type="hidden" value="${esc(u.get('a')||'Анубис')}"><input id="c2" type="hidden" value="${esc(u.has('b')?u.get('b'):'Джетрагон')}"><div id="cmpo"></div>`;
 const c1=document.getElementById('c1'),c2=document.getElementById('c2');
 const pick=v=>{if(!v)return null;const a=window.PW_core.find(v,['pal']);return a?D.pals[a.ref]:null;};
 const setU=()=>{const q=new URLSearchParams();if(c1.value)q.set('a',c1.value);if(c2.value)q.set('b',c2.value);history.replaceState(null,'','?'+q);};
 const choose=(inp,t)=>window.PW_pickPal(D,t,p=>{inp.value=p.ru;setU();run();});
 const head=(p,i)=>p?`<div class="cx-pal cx-${i?'b':'a'}"><a href="${B+p.url}" class="cx-av"><img src="${B+p.thumb}" width="56" height="56" alt=""></a><div class="cx-nm"><b>${esc(p.ru)}</b><span class="cx-no">#${esc(p.no)}</span><span class="cx-els">${p.el.map(chip).join('')}</span></div><button type="button" class="cx-chg" data-i="${i}">Сравнить с другим</button></div>`:`<button type="button" class="cx-pal cx-empty cx-chg" data-i="${i}"><span class="plus">＋</span><b>Выбрать пала</b></button>`;
 const run=()=>{const a=pick(c1.value),b=pick(c2.value);
  let h=`<div class="cx-head">${head(a,0)}<button type="button" class="cx-swap" aria-label="Поменять местами" title="Поменять местами">⇄</button>${head(b,1)}</div>`;
  if(!a||!b){document.getElementById('cmpo').innerHTML=h+'<p class="cx-hint">Выбери второго пала, чтобы сравнить.</p>';return bind();}
  const st=[['❤️','HP','hp'],['⚔️','Атака','atk'],['🛡','Защита','def'],['🐎','Рывок','sprint']];
  const bars=st.map(([ic,l,k])=>{const x=+a[k]||0,y=+b[k]||0,m=Math.max(x,y)||1,d=Math.abs(x-y);const wa=x>y?' win':'',wb=y>x?' win':'';
   return `<div class="cx-st"><div class="cx-sl"><span class="cx-v${wa}">${x||'—'}</span><span class="cx-lb">${ic} ${l}${d?` <small class="cx-d">${x>y?'◀':''} +${d} ${y>x?'▶':''}</small>`:' <small class="cx-d">=</small>'}</span><span class="cx-v${wb}">${y||'—'}</span></div><div class="cx-bars"><div class="cx-bar l"><i class="${wa}" style="width:${x/m*100}%"></i></div><div class="cx-bar r"><i class="${wb}" style="width:${y/m*100}%"></i></div></div></div>`;}).join('');
  const wk=p=>p.work.length?p.work.map(w=>`<span class="cx-wk" title="${esc(w[0])}"><span>${WI[w[0]]||'🔧'}</span>${esc(w[0])}<b>${w[1]}</b></span>`).join(''):'<span class="cx-none">нет</span>';
  const ps=p=>`<div class="cx-psk"><b>${esc(p.psk||'—')}</b><small>${(p.act||[]).map(x=>ACT[x]||'').join(' · ')}</small></div>`;
  const nat=p=>(p.natp||[]).map(x=>x[0]),na=nat(a),nb=nat(b),sh=na.filter(x=>nb.includes(x));
  const bp=p=>(p.bp&&p.bp['боец'])||[],ba=bp(a),bb=bp(b),bsh=ba.filter(x=>bb.includes(x));
  const prow=(t,xa,xb,s)=>{const oa=xa.filter(x=>!s.includes(x)),ob=xb.filter(x=>!s.includes(x));if(!xa.length&&!xb.length)return '';
   return `<div class="cx-sec"><h3>${t}</h3>${s.length?`<div class="cx-common"><span class="cx-cl">Общие</span>${s.map(pchip).join('')}</div>`:''}<div class="cx-two"><div>${oa.map(pchip).join('')||'<span class="cx-none">—</span>'}</div><div>${ob.map(pchip).join('')||'<span class="cx-none">—</span>'}</div></div></div>`;};
  const two=(t,f)=>`<div class="cx-sec"><h3>${t}</h3><div class="cx-two"><div>${f(a)}</div><div>${f(b)}</div></div></div>`;
  h+=`<div class="cx-sec"><h3>Характеристики</h3>${bars}</div>`+two('Слабость',p=>p.weak.map(chip).join('')||'<span class="cx-none">—</span>')+two('Работа',wk)+two('Партнёрский навык',ps)+prow('Врождённые пассивки',na,nb,sh)+prow('Лучшие пассивки для боя',ba,bb,bsh);
  document.getElementById('cmpo').innerHTML=h;bind();};
 const bind=()=>{box.querySelectorAll('.cx-chg').forEach(x=>x.onclick=e=>{e.preventDefault();const i=+x.dataset.i;choose(i?c2:c1,i?'Второй пал…':'Первый пал…');});
  const s=box.querySelector('.cx-swap');if(s)s.onclick=()=>{[c1.value,c2.value]=[c2.value,c1.value];setU();run();};};
 run();}
function map(D){const el=document.getElementById('pwmap');if(!el||!window.L)return;
 if(D&&!window.PW_D)window.PW_D=D;
 const T={alpha:['👑','Альфы','#ff7a59'],travel:['🗿','Телепорты','#14b8a6'],tower:['🏯','Башни','#9b5de5'],sealed:['🔒','Запечатанные земли','#2f8fe8']};
 const X0=-1923.225927,Y0=1032.79857101,X1=1234.833276624702,Y1=-2125.2606328,S=8192,Z=5;
 const m=L.map(el,{crs:L.CRS.Simple,minZoom:1,maxZoom:6,zoomSnap:.5,attributionControl:true});
 const ll=(x,y)=>m.unproject([(x-X0)/(X1-X0)*S,(Y0-y)/(Y0-Y1)*S],Z);
 const bounds=L.latLngBounds(m.unproject([0,S],Z),m.unproject([S,0],Z));
 L.tileLayer(B+'assets/tiles/{z}/{x}/{y}.webp',{minZoom:1,maxZoom:6,maxNativeZoom:5,noWrap:true,bounds,tileSize:256,attribution:'Карта: <a href="https://palworld.wiki.gg/wiki/File:World_Map.webp">palworld.wiki.gg</a> (CC BY-SA) · © Pocketpair'}).addTo(m);
 m.setMaxBounds(bounds.pad(.05));m.fitBounds(bounds);el.style.background='#0c161e'; /* 21.10 hotfix: sea colour around the map, no big empty frame */
 const MI=window.PW_MI,dc=MI.DC(m);MI.fit(m);
 const groups={};const all=[];Object.keys(T).forEach(k=>groups[k]=dc.group(k));
 D.map.forEach(p=>{const mk=L.marker(ll(p.x,p.y),{icon:MI.icon(p.t,0,p.name),title:p.name,riseOnHover:true}).bindPopup(()=>window.PW_pop({t:p.t,name:p.name,lvl:p.lvl,info:p.info,url:p.url,kind:T[p.t][0]+' '+(p.info||T[p.t][1]),sub:'X '+Math.round(p.x)+' · Y '+Math.round(p.y)}),MI.POP);dc.add(mk,p.t);all.push([p,mk]);});
 const Lg=L.control({position:'topright'});Lg.onAdd=()=>{const d=L.DomUtil.create('div','mleg');const small=window.innerWidth<700;
  d.innerHTML=`<button class="mleg-t">🗺 Слои</button><div class="mleg-b" ${small?'hidden':''}>`+Object.entries(T).map(([k,v])=>`<label><input type="checkbox" checked data-k="${k}"> ${MI.leg(k)} ${v[1]} <small>${D.map.filter(p=>p.t==k).length}</small></label>`).join('')+'</div>';
  L.DomEvent.disableClickPropagation(d);d.querySelector('.mleg-t').onclick=()=>{const b=d.querySelector('.mleg-b');b.hidden=!b.hidden;};
  d.querySelectorAll('input').forEach(i=>i.onchange=()=>dc.on(i.dataset.k,i.checked));return d;};Lg.addTo(m);
 dc.run();
 window.PW_map={m,all,groups,T,dc};}
function bug(){const art=document.querySelector('article.md-content__inner');if(!art||document.querySelector('.bug-link'))return;
 let p=location.pathname.replace(/^\/palwiki\//,'').replace(/\/$/,'')||'home';p=decodeURIComponent(p);let h=0;for(const c of p)h=(h*31+c.charCodeAt(0))>>>0;
 let sl=p.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'');if(/[^\x00-\x7f]/.test(p))sl=(sl+'_'+h.toString(36));sl=('bug_'+sl).slice(0,64);
 const a=document.createElement('a');a.className='bug-link';a.href='https://t.me/PalGuideBot?start='+sl;a.target='_blank';a.rel='noopener';a.textContent='⚠️ Сообщить об ошибке';art.appendChild(a);}
document.addEventListener('DOMContentLoaded',()=>{bug();
 if('serviceWorker' in navigator)navigator.serviceWorker.register(B+'sw.js',{updateViaCache:'none'}).catch(()=>{});
 const need=['gallery','potd','cmp','pwmap'].some(i=>document.getElementById(i));if(!need)return;
 window.PW_data().then(D=>{if(document.getElementById('gallery'))gallery(D);if(document.getElementById('potd'))potd(D);if(document.getElementById('cmp'))compare(D);if(document.getElementById('pwmap'))map(D);});});
})();
(function(){const B=window.PW_BASE,chip=window.PW_chip;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const EI={'Нейтральный':'⚪','Огонь':'🔥','Вода':'💧','Трава':'🌿','Молния':'⚡','Лёд':'❄️','Земля':'🪨','Тьма':'🌑','Дракон':'🐉'};
const EC={'Нейтральный':'neutral','Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon'};
const WI={'Разжигание огня':'🔥','Полив':'💧','Посев семян':'🌱','Генерация энергии':'⚡','Ручная работа':'🖐️','Сбор':'🌾','Рубка деревьев':'🪓','Добыча':'⛏️','Фармацевтика':'💊','Охлаждение':'❄️','Транспортировка':'📦','Фермерство':'🐑'};
function run(D){const box=document.getElementById('bygroup');const ps=D.pals.filter(p=>p.url);let mode='el';
 box.innerHTML='<div class="gal-filters plain"><div class="seg"><button data-m="el" class="on">По стихиям</button><button data-m="work">По работе</button></div><input id="bgq" name="pp-q-bgq" type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="Найти пала…"></div><div id="bgo"></div>';
 const mini=(p,lv)=>`<a class="mc card-link" href="${B+p.url}"><img src="${B+p.thumb}" alt="" loading="lazy" width="64" height="64"><span>${esc(p.ru)}</span>${lv?`<em class="lv">${lv}</em>`:''}</a>`;
 const _qv=v=>{v=(v||'').trim();const C=window.PW_core;if(!v)return [];if(!C||!C.norm)return [v.toLowerCase().replace(/ё/g,'е')];const n=C.norm(v);let f=null;try{f=C.fixLayout&&C.fixLayout(v.toLowerCase())}catch(e){}return f&&f[1]?[n,C.norm(f[0])]:[n]};const draw=()=>{const qs=_qv(document.getElementById('bgq').value),q=qs.length?qs[0]:'';const f=p=>!qs.length||qs.some(x=>window.PW_core.norm(p.ru+' '+p.en).includes(x));let h='';const open=window.innerWidth>700||q;
  if(mode=='el')for(const e of Object.keys(EI)){const g=ps.filter(p=>p.el.includes(e)&&f(p));if(!g.length)continue;h+=`<details class="grp g-${EC[e]}" ${open?'open':''}><summary>${EI[e]} ${e} <span class="cnt">${g.length}</span></summary><div class="mgrid">${g.map(p=>mini(p)).join('')}</div></details>`;}
  else for(const w of Object.keys(WI)){const g=ps.map(p=>[p,(p.work.find(x=>x[0]==w)||[0,0])[1]]).filter(x=>x[1]&&f(x[0])).sort((a,b)=>b[1]-a[1]);if(!g.length)continue;h+=`<details class="grp" ${open?'open':''}><summary>${WI[w]} ${w} <span class="cnt">${g.length}</span></summary><div class="mgrid">${g.map(x=>mini(x[0],x[1])).join('')}</div></details>`;}
  document.getElementById('bgo').innerHTML=h||'<p>Ничего не найдено.</p>';};
 box.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;box.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b));draw();});
 document.getElementById('bgq').addEventListener('input',draw);draw();}
document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('bygroup'))window.PW_data().then(run);});})();
(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={get:k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function tabbar(){if(document.querySelector('.tabbar'))return;const here=location.pathname;const t=document.createElement('nav');t.className='tabbar';
 const it=[['🏠','Главная',B],['🐾','Палы',B+'gallery/'],['🔍','Поиск','#search'],['📍','Карта',B+'map/'],['☰','Ещё','#more']];
 t.innerHTML=it.map(([i,l,u])=>`<a href="${u}" class="${u.length>1&&u[0]!='#'&&new URL(u,location.href).pathname==here?'on':''}"><span>${i}</span>${l}</a>`).join('');document.body.appendChild(t);
 t.querySelector('[href="#search"]').onclick=e=>{e.preventDefault();const s=document.getElementById('__search');if(s){s.checked=true;setTimeout(()=>document.querySelector('.md-search__input').focus(),50);}};
 t.querySelector('[href="#more"]').onclick=e=>{e.preventDefault();const d=document.getElementById('__drawer');if(d)d.checked=!d.checked;};}
function palPage(D){const info=document.querySelector('.pal-info[data-pal]');if(!info)return;const id=info.dataset.pal;
 let r=LS.get('pw_recent').filter(x=>x!=id);r.unshift(id);LS.set('pw_recent',r.slice(0,12));
 const b=document.createElement('button');b.className='fav';const upd=()=>{const f=LS.get('pw_fav');b.textContent=f.includes(id)?'★ В избранном':'☆ В избранное';b.classList.toggle('on',f.includes(id));};
 b.onclick=()=>{let f=LS.get('pw_fav');f=f.includes(id)?f.filter(x=>x!=id):[id,...f];LS.set('pw_fav',f);upd();};upd();info.appendChild(b);}
function homeLists(D){const by=Object.fromEntries(D.pals.map(p=>[p.id,p]));
 const row=(k,el)=>{const ids=LS.get(k).filter(i=>by[i]&&by[i].url);if(!ids.length||!el)return;el.innerHTML=ids.slice(0,10).map(i=>{const p=by[i];return `<a class="mc card-link" href="${B+p.url}"><img src="${B+p.thumb}" alt="" loading="lazy" width="56" height="56"><span>${esc(p.ru)}</span></a>`}).join('');};
 row('pw_recent',document.getElementById('recent'));row('pw_fav',document.getElementById('favs'));}
function table(D){const g=document.getElementById('gallery'),f=document.getElementById('gal-filters');if(!g||!f||document.getElementById('gview'))return;
 const sw=document.createElement('div');sw.className='seg';sw.id='gview';sw.innerHTML='<button class="on" data-v="grid">▦ Плитки</button><button data-v="table">☰ Таблица</button>';f.prepend(sw);
 let view='grid',key='no',dir=1;const cols=[['no','№'],['ru','Имя'],['el','Стихия'],['hp','HP'],['atk','Атака'],['def','Защита'],['sprint','Рывок'],['work','Лучшая работа']];
 const best=p=>p.work.slice().sort((a,b)=>b[1]-a[1])[0]||['—',0];
 const draw=()=>{if(view=='grid')return;const cards=[...g.querySelectorAll('a.pc')].map(a=>a.getAttribute('href'));const ps=cards.map(h=>D.pals.find(p=>B+p.url==h)).filter(Boolean);
  const val=p=>key=='no'?(parseFloat(p.no)||999):key=='el'?p.el[0]:key=='work'?best(p)[1]:p[key];
  ps.sort((a,b)=>{const x=val(a),y=val(b);return (typeof x=='string'?x.localeCompare(y,'ru'):x-y)*dir;});
  let t=document.getElementById('gtable');if(!t){t=document.createElement('div');t.id='gtable';g.after(t);}
  t.innerHTML=`<div class="md-typeset__table"><table class="ptable"><thead><tr>${cols.map(([k,l])=>`<th data-k="${k}" class="${k==key?(dir>0?'asc':'desc'):''}">${l}</th>`).join('')}</tr></thead><tbody>${ps.map(p=>`<tr onclick="location.href='${B+p.url}'"><td>${esc(p.no)}</td><td><img src="${B+p.thumb}" width="32" height="32" loading="lazy" alt=""> <a href="${B+p.url}">${esc(p.ru)}</a></td><td>${p.el.map(window.PW_chip).join('')}</td><td>${p.hp}</td><td>${p.atk}</td><td>${p.def}</td><td>${p.sprint||'—'}</td><td>${esc(best(p)[0])} ${best(p)[1]||''}</td></tr>`).join('')}</tbody></table></div>`;
  t.querySelectorAll('th').forEach(th=>th.onclick=()=>{const k=th.dataset.k;dir=k==key?-dir:(['ru','no','el'].includes(k)?1:-1);key=k;draw();});};
 sw.querySelectorAll('button').forEach(b=>b.onclick=()=>{view=b.dataset.v;try{localStorage.setItem('pw_gview',view)}catch(e){};sw.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));g.style.display=view=='grid'?'':'none';const t=document.getElementById('gtable');if(t)t.style.display=view=='grid'?'none':'';draw();});
 new MutationObserver(draw).observe(g,{childList:true});const sv=localStorage.getItem('pw_gview');if(sv&&sv!='grid'){const bt=sw.querySelector('[data-v='+sv+']');bt&&setTimeout(()=>bt.click(),0);}}
document.addEventListener('DOMContentLoaded',()=>{tabbar();window.PW_data().then(D=>{palPage(D);homeLists(D);setTimeout(()=>table(D),0);});});})();
(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function close(){document.querySelectorAll('.sheet,.sheet-bg').forEach(e=>e.remove());}
document.addEventListener('keydown',e=>{if(e.key=='Escape')close();});
document.addEventListener('click',e=>{const a=e.target.closest('a.psv[data-psv]');if(!a||e.metaKey||e.ctrlKey)return;e.preventDefault();
 window.PW_data().then(D=>{const q=D.passives.find(x=>x.name==a.dataset.psv);if(!q){location.href=a.href;return;}close();
  const rk=+q.rank||0;const g=[];if(q.nat&&q.nat.length)g.push('🐣 С рождения: '+q.nat.slice(0,6).map(esc).join(', ')+(q.nat.length>6?'…':''));if(q.breed)g.push('🧬 Передаётся разведением');
  if(q.how=='gold')g.push('🏥 Операционный стол: '+String(q.gold).replace(/\B(?=(\d{3})+$)/g,' ')+' золота');if(q.how=='disposable')g.push('💉 Имплант из Древних реликвий');
  const bg=document.createElement('div');bg.className='sheet-bg';bg.onclick=close;const s=document.createElement('div');s.className='sheet';s.setAttribute('role','dialog');
  s.innerHTML=`<button class="x" aria-label="Закрыть">×</button><span class="psv ${a.className.split(' ').find(c=>c.startsWith('r-'))||''}">${esc(q.name)}</span> <small>ранг ${rk}</small><h3>${rk<0?'Плохая пассивка':rk>=4?'Топовая пассивка':'Что даёт'}</h3><div>${esc(q.desc)}</div><ul>${g.map(x=>'<li>'+x+'</li>').join('')}</ul><a href="${a.href}">Подробнее →</a>`;
  document.body.append(bg,s);s.querySelector('.x').onclick=close;
  if(window.innerWidth>700){const r=a.getBoundingClientRect();s.style.left=Math.min(r.left,window.innerWidth-440)+'px';s.style.top=Math.min(r.bottom+8,window.innerHeight-s.offsetHeight-10)+'px';}});});})();
(function(){const h=document.querySelector('.pal-hero[data-el]');const c=document.getElementById('fx');if(!h||!c||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const el=h.dataset.el,ctx=c.getContext('2d');const C={fire:['#ff8a4c','#ffcf6b'],ice:['#ffffff','#bfefff'],water:['#7cc4ff','#d6efff'],grass:['#7ee08f','#c9f2a0'],electric:['#ffe066','#fff6b0'],ground:['#d9a868','#f0d2a0'],dark:['#b28cff','#e0ccff'],dragon:['#ff8fd0','#ffd0ec'],neutral:['#e8e4d8','#ffffff']}[el]||['#fff','#fff'];
 let W,H,P=[];const n=innerWidth<700?14:28;const rs=()=>{W=c.width=h.clientWidth;H=c.height=h.clientHeight;};rs();addEventListener('resize',rs);
 const up=el=='fire'||el=='electric'||el=='dark'||el=='dragon';
 for(let i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*2.5,v:.2+Math.random()*.6,d:Math.random()*6.28,c:C[i%2]});
 let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(h);
 (function f(){if(vis){ctx.clearRect(0,0,W,H);for(const p of P){p.d+=.02;p.x+=Math.sin(p.d)*.3;p.y+=up?-p.v:p.v;if(p.y<-5)p.y=H+5;if(p.y>H+5)p.y=-5;ctx.globalAlpha=.55;ctx.fillStyle=p.c;ctx.beginPath();
  if(el=='grass'){ctx.ellipse(p.x,p.y,p.r*1.8,p.r,p.d,0,6.28);}else ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill();}}requestAnimationFrame(f);})();})();
