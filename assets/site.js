(function(){const B=window.PW_BASE,chip=window.PW_chip;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ACT={party:'🎒 из команды',summoned:'🐾 выпущен',mounted:'🐎 верхом',active:'🔘 кнопкой',base:'🏠 на базе'};
const WORKS=['Добыча','Рубка деревьев','Разжигание огня','Полив','Посев семян','Генерация энергии','Ручная работа','Сбор','Фармацевтика','Охлаждение','Транспортировка','Фермерство'];
const ELS=['Нейтральный','Огонь','Вода','Трава','Молния','Лёд','Земля','Тьма','Дракон'];
const card=p=>`<a class="pc card-link" href="${B+p.url}"><img src="${B+p.thumb}" alt="${esc(p.ru)}" loading="lazy" width="110" height="110"><small>#${esc(p.no)}</small><b>${esc(p.ru)}</b><span>${p.el.map(chip).join('')}</span></a>`;
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
function potd(D){const ps=D.pals.filter(p=>p.url&&p.thumb.startsWith('art'));const d=new Date();const p=ps[(d.getFullYear()*372+d.getMonth()*31+d.getDate())%ps.length];
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
 const T={alpha:['👑 Альфы','#ff7a59'],travel:['🗿 Телепорты','#14b8a6'],tower:['🏯 Башни','#7a3fb0'],sealed:['🔒 Запечатанные земли','#2f8fe8']};
 const m=L.map(el,{crs:L.CRS.Simple,minZoom:-2,maxZoom:3,zoomSnap:.5});const bounds=[[-2000,-1800],[1000,1400]];
 const grid=L.layerGroup().addTo(m);for(let v=-2000;v<=1400;v+=250){L.polyline([[v,-1800],[v,1400]],{color:'#8aa',weight:.5,opacity:.4}).addTo(grid);L.polyline([[-2000,v],[1000,v]],{color:'#8aa',weight:.5,opacity:.4}).addTo(grid);}
 const groups={};const all=[];Object.keys(T).forEach(k=>groups[k]=L.layerGroup().addTo(m));
 D.map.forEach(p=>{const mk=L.circleMarker([p.y,p.x],{radius:p.t=='tower'?9:6,color:'#fff',weight:1.5,fillColor:T[p.t][1],fillOpacity:.95}).bindPopup(`<b>${esc(p.name)}</b><br>${esc(p.info||'')}<br><small>X ${p.x}, Y ${p.y}</small>`).bindTooltip(esc(p.name));mk.addTo(groups[p.t]);all.push([p,mk]);});
 L.control.layers(null,Object.fromEntries(Object.entries(T).map(([k,v])=>[v[0]+' ('+D.map.filter(p=>p.t==k).length+')',groups[k]])),{collapsed:false}).addTo(m);m.fitBounds(bounds);
 const s=document.getElementById('mapq');s.addEventListener('input',()=>{const q=window.PW_core.norm(s.value);if(q.length<2)return;const h=all.find(([p])=>window.PW_core.norm(p.name).includes(q));if(h){m.setView(h[1].getLatLng(),1.5);h[1].openPopup();}});}
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
