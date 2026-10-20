(function(){const B=window.PW_BASE,chip=window.PW_chip;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ACT={party:'🎒 из команды',summoned:'🐾 выпущен',mounted:'🐎 верхом',active:'🔘 кнопкой',base:'🏠 на базе'};
const WORKS=['Добыча','Рубка деревьев','Разжигание огня','Полив','Посев семян','Генерация энергии','Ручная работа','Сбор','Фармацевтика','Охлаждение','Транспортировка','Фермерство'];
const ELS=['Нейтральный','Огонь','Вода','Трава','Молния','Лёд','Земля','Тьма','Дракон'];
const card=p=>`<a class="pc card-link g-${({"Нейтральный":"neutral","Огонь":"fire","Вода":"water","Трава":"grass","Молния":"electric","Лёд":"ice","Земля":"ground","Тьма":"dark","Дракон":"dragon"})[p.el[0]]}" href="${B+p.url}"><img src="${B+p.thumb}" alt="${esc(p.ru)}" loading="lazy" width="110" height="110"><small>#${esc(p.no)}</small><b>${esc(p.ru)}</b><span>${p.el.map(chip).join('')}</span></a>`;
function gallery(D){const f=document.getElementById('gal-filters'),g=document.getElementById('gallery');
 const sel=(id,label,opts)=>`<select id="${id}"><option value="">${label}</option>${opts.map(o=>`<option value="${esc(o[0])}">${esc(o[1])}</option>`).join('')}</select>`;
 f.innerHTML=`<input id="gq" type="search" placeholder="Имя…">`+sel('ge','Стихия',ELS.map(e=>[e,e]))+sel('gw','Работа',WORKS.map(e=>[e,e]))+sel('gl','Ур. работы ≥',[1,2,3,4,5].map(e=>[e,'≥ '+e]))+sel('gm','Езда',[['ride','🐎 ездовой'],['fly','🦅 летающий']])+sel('ga','Партнёрка',Object.entries(ACT))+sel('gs','Сортировка',[['no','по номеру'],['ru','по имени'],['atk','атака ↓'],['hp','HP ↓'],['work','уровень работы ↓'],['sprint','скорость ↓']])+`<span class="gal-count" id="gc"></span>`;
 const pals=D.pals.filter(p=>p.url);const $=id=>document.getElementById(id).value;
 const run=()=>{const q=window.PW_core.norm($('gq')),e=$('ge'),w=$('gw'),l=+$('gl')||0,m=$('gm'),a=$('ga'),s=$('gs')||'no';
  const wl=p=>(p.work.find(x=>x[0]==w)||[0,0])[1];
  let r=pals.filter(p=>(!q||window.PW_core.norm(p.ru+' '+p.en).includes(q))&&(!e||p.el.includes(e))&&(!w||wl(p)>=Math.max(1,l))&&(w||!l||p.work.some(x=>x[1]>=l))&&(!m||(m=='ride'?p.mount:p.mount=='fly'))&&(!a||p.act.includes(a)));
  const num=p=>parseFloat(p.no)||999;
  r.sort(s=='ru'?(x,y)=>x.ru.localeCompare(y.ru,'ru'):s=='no'?(x,y)=>num(x)-num(y)||x.no.localeCompare(y.no):s=='work'?(x,y)=>(w?wl(y)-wl(x):Math.max(0,...y.work.map(z=>z[1]))-Math.max(0,...x.work.map(z=>z[1]))):(x,y)=>y[s]-x[s]);
  g.innerHTML=r.map(card).join('');document.getElementById('gc').textContent='Найдено: '+r.length;};
 f.addEventListener('input',run);f.addEventListener('change',run);run();}
function potd(D){const ps=D.pals.filter(p=>p.url&&p.thumb);const d=new Date();const p=ps[(d.getFullYear()*372+d.getMonth()*31+d.getDate())%ps.length];
 document.getElementById('potd').innerHTML=`<a class="potd card-link" href="${B+p.url}"><img src="${B+p.thumb}" alt="" loading="lazy"><div><h3>${esc(p.ru)} <small>#${esc(p.no)}</small></h3>${p.el.map(chip).join('')}<div>${p.work.map(w=>esc(w[0])+' '+w[1]).join(' · ')}</div><div>Партнёрка: <b>${esc(p.psk)}</b> ${p.act.map(x=>ACT[x]||'').join(' ')}</div><span class="open">Открыть →</span></div></a>`;}
function compare(D){const box=document.getElementById('cmp');const ps=D.pals.filter(p=>p.url).sort((a,b)=>a.ru.localeCompare(b.ru,'ru'));
 const dl='<datalist id="cmpl">'+ps.map(p=>`<option value="${esc(p.ru)}">`).join('')+'</datalist>';
 const u=new URLSearchParams(location.search);
 box.innerHTML=dl+`<div class="gal-filters"><input id="c1" list="cmpl" placeholder="Первый пал" value="${esc(u.get('a')||'Анубис')}"><span>⚔️</span><input id="c2" list="cmpl" placeholder="Второй пал" value="${esc(u.get('b')||'Джетрагон')}"></div><div id="cmpo"></div>`;
 const pick=v=>{const a=window.PW_core.find(v,['pal']);return a?D.pals[a.ref]:null;};
 const run=()=>{const a=pick(document.getElementById('c1').value),b=pick(document.getElementById('c2').value);if(!a||!b){document.getElementById('cmpo').innerHTML='<p>Выбери двух палов.</p>';return;}
  const row=(t,f,num)=>{const x=f(a),y=f(b);let cx='',cy='';if(num){if(x>y)cx=' class="win"';else if(y>x)cy=' class="win"';}return `<tr><th>${t}</th><td${cx}>${x}</td><td${cy}>${y}</td></tr>`;};
  const wk=p=>p.work.map(w=>esc(w[0])+' <b>'+w[1]+'</b>').join('<br>');
  document.getElementById('cmpo').innerHTML=`<table class="cmp"><tr><th></th><td><a class="cmp-pal card-link" href="${B+a.url}"><img src="${B+a.thumb}" width="120" loading="lazy"><br>${esc(a.ru)}</a></td><td><a class="cmp-pal card-link" href="${B+b.url}"><img src="${B+b.thumb}" width="120" loading="lazy"><br>${esc(b.ru)}</a></td></tr>`+
  row('Стихия',p=>p.el.map(chip).join(''))+row('Слабость',p=>p.weak.map(chip).join(''))+row('❤️ HP',p=>p.hp,1)+row('⚔️ Атака',p=>p.atk,1)+row('🛡 Защита',p=>p.def,1)+row('🐎 Рывок',p=>p.sprint||'—',1)+row('Редкость',p=>p.rarity,1)+row('Работы',wk)+row('Партнёрка',p=>'<b>'+esc(p.psk)+'</b><br>'+p.act.map(x=>ACT[x]||'').join(' '))+row('Пассивки боец',p=>(p.bp['боец']||[]).map(esc).join(', '))+'</table>';
  history.replaceState(null,'','?a='+encodeURIComponent(a.ru)+'&b='+encodeURIComponent(b.ru));};
 box.addEventListener('change',run);box.addEventListener('input',e=>{if(pick(e.target.value))run();});run();}
function map(D){const el=document.getElementById('pwmap');if(!el||!window.L)return;
 const T={alpha:['👑','Альфы','#ff7a59'],travel:['🗿','Телепорты','#14b8a6'],tower:['🏯','Башни','#9b5de5'],sealed:['🔒','Запечатанные земли','#2f8fe8']};
 const X0=-1923.225927,Y0=1032.79857101,X1=1234.833276624702,Y1=-2125.2606328,S=8192,Z=5;
 const m=L.map(el,{crs:L.CRS.Simple,minZoom:1,maxZoom:6,zoomSnap:.5,attributionControl:true});
 const ll=(x,y)=>m.unproject([(x-X0)/(X1-X0)*S,(Y0-y)/(Y0-Y1)*S],Z);
 const bounds=L.latLngBounds(m.unproject([0,S],Z),m.unproject([S,0],Z));
 L.tileLayer(B+'assets/tiles/{z}/{x}/{y}.webp',{minZoom:1,maxZoom:6,maxNativeZoom:5,noWrap:true,bounds,tileSize:256,attribution:'Карта: <a href="https://palworld.wiki.gg/wiki/File:World_Map.webp">palworld.wiki.gg</a> (CC BY-SA) · © Pocketpair'}).addTo(m);
 m.setMaxBounds(bounds.pad(.2));m.fitBounds(bounds);
 const icon=t=>L.divIcon({className:'pmk pmk-'+t,html:'<span>'+T[t][0]+'</span>',iconSize:[30,30],iconAnchor:[15,15]});
 const groups={};const all=[];Object.keys(T).forEach(k=>groups[k]=(L.markerClusterGroup?L.markerClusterGroup({maxClusterRadius:38,showCoverageOnHover:false,disableClusteringAtZoom:4}):L.layerGroup()).addTo(m));
 D.map.forEach(p=>{const mk=L.marker(ll(p.x,p.y),{icon:icon(p.t),title:p.name}).bindPopup(`<div class="mpop"><div class="mk">${T[p.t][0]} ${esc(p.info||T[p.t][1])}</div><b>${esc(p.name)}</b>${p.lvl?`<div>Уровень ${esc(p.lvl)}</div>`:''}<div class="xy">X ${Math.round(p.x)} · Y ${Math.round(p.y)}</div>${p.url?`<a href="${B+p.url}">Открыть страницу →</a>`:''}</div>`);mk.addTo(groups[p.t]);all.push([p,mk]);});
 const Lg=L.control({position:'topright'});Lg.onAdd=()=>{const d=L.DomUtil.create('div','mleg');const small=window.innerWidth<700;
  d.innerHTML=`<button class="mleg-t">🗺 Слои</button><div class="mleg-b" ${small?'hidden':''}>`+Object.entries(T).map(([k,v])=>`<label><input type="checkbox" checked data-k="${k}"> ${v[0]} ${v[1]} <small>${D.map.filter(p=>p.t==k).length}</small></label>`).join('')+'</div>';
  L.DomEvent.disableClickPropagation(d);d.querySelector('.mleg-t').onclick=()=>{const b=d.querySelector('.mleg-b');b.hidden=!b.hidden;};
  d.querySelectorAll('input').forEach(i=>i.onchange=()=>{i.checked?m.addLayer(groups[i.dataset.k]):m.removeLayer(groups[i.dataset.k]);});return d;};Lg.addTo(m);
 const s=document.getElementById('mapq');s.addEventListener('input',()=>{const q=window.PW_core.norm(s.value);if(q.length<2)return;const h=all.find(([p])=>window.PW_core.norm(p.name).includes(q));if(h){const g=groups[h[0].t];m.addLayer(g);if(g.zoomToShowLayer)g.zoomToShowLayer(h[1],()=>h[1].openPopup());else{m.setView(h[1].getLatLng(),4);h[1].openPopup();}}});
 window.PW_map={m,all};}
function bug(){const art=document.querySelector('article.md-content__inner');if(!art||document.querySelector('.bug-link'))return;
 let p=location.pathname.replace(/^\/palwiki\//,'').replace(/\/$/,'')||'home';p=decodeURIComponent(p);let h=0;for(const c of p)h=(h*31+c.charCodeAt(0))>>>0;
 let sl=p.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'');if(/[^\x00-\x7f]/.test(p))sl=(sl+'_'+h.toString(36));sl=('bug_'+sl).slice(0,64);
 const a=document.createElement('a');a.className='bug-link';a.href='https://t.me/PalGuideBot?start='+sl;a.target='_blank';a.rel='noopener';a.textContent='⚠️ Сообщить об ошибке';art.appendChild(a);}
document.addEventListener('DOMContentLoaded',()=>{bug();
 if('serviceWorker' in navigator)navigator.serviceWorker.register(B+'sw.js').catch(()=>{});
 const need=['gallery','potd','cmp','pwmap'].some(i=>document.getElementById(i));if(!need)return;
 window.PW_data().then(D=>{if(document.getElementById('gallery'))gallery(D);if(document.getElementById('potd'))potd(D);if(document.getElementById('cmp'))compare(D);if(document.getElementById('pwmap'))map(D);});});
})();
(function(){const B=window.PW_BASE,chip=window.PW_chip;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const EI={'Нейтральный':'⚪','Огонь':'🔥','Вода':'💧','Трава':'🌿','Молния':'⚡','Лёд':'❄️','Земля':'🪨','Тьма':'🌑','Дракон':'🐉'};
const EC={'Нейтральный':'neutral','Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon'};
const WI={'Разжигание огня':'🔥','Полив':'💧','Посев семян':'🌱','Генерация энергии':'⚡','Ручная работа':'🖐️','Сбор':'🌾','Рубка деревьев':'🪓','Добыча':'⛏️','Фармацевтика':'💊','Охлаждение':'❄️','Транспортировка':'📦','Фермерство':'🐑'};
function run(D){const box=document.getElementById('bygroup');const ps=D.pals.filter(p=>p.url);let mode='el';
 box.innerHTML='<div class="gal-filters"><div class="seg"><button data-m="el" class="on">По стихиям</button><button data-m="work">По работе</button></div><input id="bgq" type="search" placeholder="Найти пала…"></div><div id="bgo"></div>';
 const mini=(p,lv)=>`<a class="mc card-link" href="${B+p.url}"><img src="${B+p.thumb}" alt="" loading="lazy" width="64" height="64"><span>${esc(p.ru)}</span>${lv?`<em class="lv">${lv}</em>`:''}</a>`;
 const draw=()=>{const q=window.PW_core?window.PW_core.norm(document.getElementById('bgq').value):'';const f=p=>!q||window.PW_core.norm(p.ru+' '+p.en).includes(q);let h='';const open=window.innerWidth>700||q;
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
 sw.querySelectorAll('button').forEach(b=>b.onclick=()=>{view=b.dataset.v;sw.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));g.style.display=view=='grid'?'':'none';const t=document.getElementById('gtable');if(t)t.style.display=view=='grid'?'none':'';draw();});
 new MutationObserver(draw).observe(g,{childList:true});}
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
