(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const chip=e=>window.PW_chip?window.PW_chip(e):`<span class="el">${esc(e)}</span>`;
window.PW_breed2=true;
let lock=0;const bodyLock=v=>{lock=Math.max(0,lock+(v?1:-1));document.documentElement.classList.toggle('sheet-open',lock>0);};
/* ---------- generic index ---------- */
let IDX=null;function index(D){if(IDX)return IDX;const N=window.PW_core.norm;IDX=[];const add=o=>{o.k=N(o.label+' '+(o.alt||''));IDX.push(o);};
 const pop=Object.fromEntries((D.popular||[]).map(([i,c])=>[i,c]));
 D.pals.forEach(p=>p.url&&add({t:'pal',label:p.ru,alt:p.en,sub:'№'+p.no+' · '+p.el.join(', '),img:p.thumb,url:p.url,w:(pop[p.id]||0)+1,ref:p}));
 (D.bcards||[]).forEach(b=>add({t:'boss',label:b.n,alt:b.pal,sub:b.k+' · ур. '+b.lv.filter(Boolean).join(' / '),img:b.t,url:b.u,w:2}));
 D.passives.forEach(q=>add({t:'passive',label:q.name,alt:q.en,sub:'ранг '+q.rank+' · '+(q.desc||'').slice(0,60),url:q.url,w:1,rank:q.rank}));
 D.items.forEach(i=>i.url&&add({t:'item',label:i.ru,alt:i.en,sub:i.type||'предмет',url:i.url,w:.5}));
 [/*WORKCALC off 21.10*/['Работа палов','2_mehaniki/rabota/','🛠️','скорость работы ручная работа уровень работы как апнуть работу поднять работу пригодность к работе калькулятор работы'],['Карта','map/','🗺️','карта map телепорт башня'],['Калькулятор разведения','breed/','🧬','разведение скрестить вывести'],['Сравнить палов','compare/','⚖️','сравнить сравнение'],['Галерея палов','gallery/','🐾','галерея палы фильтр'],['Мои списки','my/','⭐','избранное списки сборки команда'],['Все боссы','boss/','👑','боссы башни рейды'],['Все пассивки','passivki/','✨','пассивки'],['Еда и баффы','guide/eda/','🍲','еда баф бафф бафы пицца блюдо блюда кухня готовить сытость']].filter(x=>x[1]!='2_mehaniki/rabota/').forEach(([l,u,i,a])=>add({t:'page',label:l,alt:a,sub:'раздел',ic:i,url:u,w:1}));
 return IDX;}
const dl=(a,b)=>{if(Math.abs(a.length-b.length)>3)return 9;const m=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){let p=m[0];m[0]=i;for(let j=1;j<=b.length;j++){const t=m[j];m[j]=Math.min(m[j]+1,m[j-1]+1,p+(a[i-1]==b[j-1]?0:1));p=t;}}return m[b.length];};
function match(D,q,types){const C=window.PW_core,N=C.norm;let n=N(q);const fx=C.fixLayout(q.toLowerCase());let fixed=null;if(fx&&fx[1]){fixed=fx[0];n=N(fx[0]);}
 if(!n)return {res:[],fixed};const ws=n.split(' ');const R=[];
 for(const o of index(D)){if(types&&!types.includes(o.t))continue;const k=o.k;let s=0;
  if(k.startsWith(n))s=100;else if(k.includes(' '+n)||N(o.label).split(' ').some(w=>w.startsWith(n)))s=80;else if(k.includes(n))s=60;
  else if(ws.every(w=>k.includes(w)))s=50;else if(n.length>=3){const best=Math.min(...N(o.label+' '+(o.alt||'')).split(' ').map(w=>dl(w.slice(0,n.length+1),n)));if(best<=Math.max(1,Math.floor(n.length/4)))s=35-best*5;}
  if(s)R.push([s+Math.log(1+o.w)*3,o]);}
 R.sort((a,b)=>b[0]-a[0]);return {res:R.map(x=>x[1]),fixed};}
const TT={pal:'Пал',boss:'Босс',passive:'Пассивка',item:'Предмет',page:'Раздел'};
const rc=r=>r<0?'r-neg':'r-'+Math.min(5,r||1);
const row=o=>`<a class="sx-r" href="${B+o.url}" data-u="${esc(o.url)}">${o.img?`<img src="${B+o.img}" width="40" height="40" alt="" loading="lazy">`:`<span class="sx-ic ${o.t=='passive'?'psv '+rc(o.rank):''}">${o.ic||(o.t=='passive'?'✨':o.t=='item'?'📦':'📄')}</span>`}<span class="sx-t"><b>${esc(o.label)}</b><small>${esc(o.sub||'')}</small></span><span class="sx-b sx-${o.t}">${TT[o.t]}</span></a>`;
/* ---------- pal picker sheet ---------- */
window.PW_pickPal=function(D,title,cb){const sh=document.createElement('div');sh.className='pk';const bg=document.createElement('div');bg.className='sheet-bg';
 const close=()=>{sh.remove();bg.remove();bodyLock(false);};bg.onclick=close;bodyLock(true);
 const rec=LS.get('pw_recent',[]).map(id=>D.pals.find(p=>p.id==id)).filter(p=>p&&p.url).slice(0,8);const pop=(D.popular||[]).map(([i])=>D.pals.find(p=>p.id==i)).filter(p=>p&&p.url).slice(0,8);
 const it=p=>`<button type="button" class="pki pp" data-id="${esc(p.id)}"><img src="${B+p.thumb}" width="40" height="40" alt=""><span><b>${esc(p.ru)}</b><small>№${esc(p.no)} · ${p.el.map(esc).join(', ')}</small></span></button>`;
 const body=v=>{if(v.trim()){const r=match(D,v,['pal']).res.slice(0,40);return r.length?r.map(o=>it(o.ref)).join(''):'<p class="sx-none">Не нашёл. Попробуй по-другому или английское имя.</p>';}
  return (rec.length?'<div class="pkt">Недавние</div>'+rec.map(it).join(''):'')+(pop.length?'<div class="pkt">Популярные</div>'+pop.map(it).join(''):'')+'<div class="pkt">Все палы</div>'+D.pals.filter(p=>p.url).map(it).join('');};
 sh.innerHTML=`<div class="pkg"></div><div class="pkhd"><input type="search" placeholder="${esc(title||'Найти пала…')}" autocomplete="off" enterkeyhint="search"><button type="button" class="x" aria-label="Закрыть">×</button></div><div class="pkl">${body('')}</div>`;
 document.body.append(bg,sh);sh.querySelector('.x').onclick=close;const L=sh.querySelector('.pkl'),inp=sh.querySelector('input');let t;inp.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{L.innerHTML=body(inp.value);L.scrollTop=0;},120);};
 L.addEventListener('click',e=>{const b=e.target.closest('.pp');if(!b)return;const p=D.pals.find(x=>x.id==b.dataset.id);close();cb(p);});
 inp.addEventListener('keydown',e=>{if(e.key=='Enter'){const b=L.querySelector('.pp');if(b)b.click();}});};
/* ---------- full-screen search ---------- */
let SX=null,SXo=null;function hsInput(){let w=document.getElementById('hsx');if(w)return w.querySelector('input');const hd=document.querySelector('.md-header__inner');if(!hd)return null;w=document.createElement('div');w.id='hsx';w.className='hsx';w.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" id="hsq" name="pp-site-q" type="search" placeholder="'+(innerWidth<480?'Пал, босс…':'Пал, босс или вопрос')+'" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="Поиск" aria-controls="sxp" aria-expanded="false"><button type="button" class="sx-clr" aria-label="Очистить" hidden>×</button>';const t=hd.querySelector('.md-header__title');(t||hd.lastChild).after(w);return w.querySelector('input');}
function openSearch(pre){const hi=hsInput();if(hi&&pre==null)hi.focus({preventScroll:true});(window.PW_load||window.PW_data)().then(D=>{if(SX){if(pre!=null){hi.value=pre;}SXo();if(pre!=null)hi.dispatchEvent(new Event('input'));hi.focus({preventScroll:true});return;}
 const s=document.getElementById('__search');if(s)s.checked=false;
 SX=document.createElement('div');SX.className='sx sx-inline';SX.id='sxp';SX.setAttribute('role','listbox');SX.setAttribute('aria-label','Результаты поиска');SX.hidden=true;
 const recQ=()=>LS.get('pw_recentq',[]);const pushQ=q=>{q=q.trim();if(q.length<2)return;LS.set('pw_recentq',[q,...recQ().filter(x=>x!=q)].slice(0,8));};
 const pop=(D.popular||[]).map(([i])=>D.pals.find(p=>p.id==i)).filter(p=>p&&p.url).slice(0,8);
 const tiles=[['🐾','Палы','gallery/'],['👑','Боссы','boss/'],['✨','Пассивки','passivki/'],['📦','Предметы','4_spravochniki/predmety/'],['🗺️','Карта','map/'],['🧬','Разведение','breed/'],['🛠','Сборка','my/'],['⚖️','Сравнить','compare/']];
 const ex=['кто лучше копает','чем бить зои','где взять серу','пассивки фросталион боец','как вывести анубиса','сравнить анубис и джетрагон'];
 const empty=()=>`${recQ().length?`<div class="sx-h">Недавние</div><div class="sx-chips">${recQ().map(q=>`<span class="sx-c"><button type="button" data-q="${esc(q)}">🕘 ${esc(q)}</button><button type="button" class="sx-del" data-del="${esc(q)}" aria-label="Удалить">×</button></span>`).join('')}</div>`:''}
  ${pop.length?`<div class="sx-h">Популярное</div><div class="sx-chips">${pop.map(p=>`<a class="sx-c sx-p" href="${B+p.url}"><img src="${B+p.thumb}" width="22" height="22" alt="">${esc(p.ru)}</a>`).join('')}</div>`:''}
  ${document.getElementById('pwmap')?'':`<div class="sx-h">Разделы</div><div class="sx-tiles">${tiles.map(([i,l,u])=>`<a href="${B+u}"><span>${i}</span>${l}</a>`).join('')}</div>`}
  <div class="sx-h">Можно спросить</div><div class="sx-chips">${ex.map(q=>`<button type="button" class="sx-c" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`;
 SX.innerHTML=`<button type="button" class="sx-x" aria-label="Закрыть">×</button><div class="sx-body">${empty()}</div>`;
 document.body.appendChild(SX);const inp=hi,body=SX.querySelector('.sx-body'),clr=inp.parentNode.querySelector('.sx-clr');
 const place=()=>{const r=inp.parentNode.getBoundingClientRect(),mob=innerWidth<700;SX.style.top=(r.bottom+6)+'px';if(mob){SX.style.left='8px';SX.style.right='8px';SX.style.width='';}else{const w=Math.max(r.width,520);SX.style.left=Math.min(r.left,innerWidth-w-12)+'px';SX.style.width=w+'px';SX.style.right='';}};
 SXo=()=>{place();SX.hidden=false;clr.hidden=false;clr.setAttribute('aria-label',inp.value?'Очистить':'Закрыть поиск');inp.setAttribute('aria-expanded','true');document.documentElement.classList.add('sx-open');};
 const close=()=>{SX.hidden=true;inp.setAttribute('aria-expanded','false');document.documentElement.classList.remove('sx-open');if(!inp.value)clr.hidden=true;};SX.querySelector('.sx-x').onclick=()=>{close();inp.blur();};
 addEventListener('resize',()=>{if(!SX.hidden)place();},{passive:true});addEventListener('scroll',()=>{if(!SX.hidden)place();},{passive:true});
 document.addEventListener('pointerdown',e=>{if(SX.hidden)return;if(SX.contains(e.target)||inp.parentNode.contains(e.target))return;close();},true);
 inp.addEventListener('focus',()=>{draw();SXo();});
 const cmp=v=>{const m=window.PW_core.norm(v).match(/^сравн\S*\s+(.+?)\s+(?:и|с|vs|против|или)\s+(.+)$/);if(!m)return null;const a=window.PW_core.find(m[1],['pal']),b=window.PW_core.find(m[2],['pal']);if(!a||!b)return null;const A=D.pals[a.ref],Bp=D.pals[b.ref];
  return `<a class="sx-ans sx-cmp" href="${B}compare/?a=${encodeURIComponent(A.ru)}&b=${encodeURIComponent(Bp.ru)}"><img src="${B+A.thumb}" width="48" height="48" alt=""><b>⚖️ Сравнить ${esc(A.ru)} и ${esc(Bp.ru)}</b><img src="${B+Bp.thumb}" width="48" height="48" alt=""></a>`;};
 const draw=()=>{const v=inp.value;clr.hidden=!v&&SX.hidden;clr.setAttribute('aria-label',v?'Очистить':'Закрыть поиск');if(v.trim().length<1){body.innerHTML=empty();return;}
  const {res,fixed}=match(D,v);let h=fixed?`<div class="dym">Понял как: «${esc(fixed)}»</div>`:'';const c=cmp(v);if(c)h+=c;
  let ans='';try{const a=window.PW_core.answer(v);if(a&&a.type!='none'&&window.PW_render)ans=window.PW_render(a);}catch(e){}
  let fu='';try{const a2=window.PW_core.answer(v);const pn=a2&&(a2.pal||a2.e&&a2.e.ru&&a2.e)&&(a2.pal||a2.e).ru;if(pn){const opts=[['✨ Лучшие пассивки','пассивки '+pn],['🧬 Как вывести','как вывести '+pn],['🎯 Чем бить','чем бить '+pn],['⚖️ Сравнить','сравнить '+pn+' и ']].filter(o=>window.PW_core.norm(o[1])!=window.PW_core.norm(v));fu=`<div class="sx-fu">${opts.map(([l,q])=>`<button type="button" class="sx-c" data-q="${esc(q)}">${l}</button>`).join('')}</div>`;}}catch(e){}
  if(ans&&!c)h+=`<div class="sx-card ai"><span class="ai-tag">🤖 Ответ из базы</span>${ans}${fu}</div>`;
  if(res.length){const g={};res.slice(0,30).forEach(o=>(g[o.t]=g[o.t]||[]).push(o));h+=['pal','boss','passive','item','page'].filter(t=>g[t]).map(t=>`<div class="sx-h">${TT[t]}ы</div>`.replace('Палы','Палы').replace('Боссы','Боссы').replace('Пассивкаы','Пассивки').replace('Предметы','Предметы').replace('Разделы','Разделы')+g[t].slice(0,t=='pal'?8:5).map(row).join('')).join('');}
  else if(!ans&&!c){const s=window.PW_core.suggest?window.PW_core.suggest(v,4):[];h+=`<div class="sx-none"><b>Ничего не нашлось</b><p>Проверь написание или попробуй:</p><div class="sx-chips">${s.map(x=>`<button type="button" class="sx-c" data-q="${esc(x.name)}">${esc(x.name)}</button>`).join('')}${['анубис','башня','легенда'].map(q=>`<button type="button" class="sx-c" data-q="${q}">${q}</button>`).join('')}</div></div>`;}
  body.innerHTML=h;};
 let t;inp.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(draw,90);});clr.onclick=()=>{if(!inp.value&&!SX.hidden){close();inp.blur();clr.hidden=true;return;}inp.value='';draw();inp.focus({preventScroll:true});SXo();};inp.addEventListener('input',()=>{if(SX.hidden)SXo();});
 body.addEventListener('click',e=>{const d=e.target.closest('[data-del]');if(d){LS.set('pw_recentq',recQ().filter(x=>x!=d.dataset.del));draw();return;}const q=e.target.closest('[data-q]');if(q){e.preventDefault();inp.value=q.dataset.q;draw();inp.focus({preventScroll:true});return;}const a=e.target.closest('a');if(a)pushQ(inp.value);});
 let sel=-1;const items=()=>[...body.querySelectorAll('.sx-ans,.sx-r')];const mark=()=>items().forEach((x,i)=>x.classList.toggle('sel',i==sel));inp.addEventListener('input',()=>{sel=-1;});
 inp.addEventListener('keydown',e=>{const it=items();if(e.key=='ArrowDown'){e.preventDefault();sel=Math.min(it.length-1,sel+1);mark();it[sel]&&it[sel].scrollIntoView({block:'nearest'});}else if(e.key=='ArrowUp'){e.preventDefault();sel=Math.max(-1,sel-1);mark();}
  else if(e.key=='Enter'){pushQ(inp.value);const a=it[sel>=0?sel:0];if(a)location.href=a.href;}if(e.key=='Escape'){e.preventDefault();close();}});
 SX.addEventListener('keydown',e=>{if(e.key=='Escape'){close();inp.focus({preventScroll:true});}});
 if(pre!=null)inp.value=pre;draw();SXo();inp.focus({preventScroll:true});});}
window.PW_search=openSearch;
// iOS: focus must happen in the user gesture -> create input synchronously when data already cached
document.addEventListener('click',e=>{const l=e.target.closest('label[for=__search],.md-search__icon,[href="#search"],.md-search__input');if(!l)return;e.preventDefault();e.stopPropagation();const s=document.getElementById('__search');if(s)s.checked=false;openSearch();},true);
document.addEventListener('keydown',e=>{const tg=e.target;const typing=tg.closest&&tg.closest('input,textarea,select,[contenteditable]');if((e.key=='k'||e.key=='K'||e.key=='л')&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.stopPropagation();openSearch();}else if(e.key=='/'&&!typing){e.preventDefault();e.stopPropagation();openSearch();}},true);
document.addEventListener('DOMContentLoaded',()=>{const hi0=hsInput();if(hi0)hi0.addEventListener('focus',()=>{if(!SX)openSearch();},{once:true});const s=document.getElementById('__search');if(s)s.addEventListener('change',()=>{if(s.checked){s.checked=false;openSearch();}});window.PW_data();
 const hq=document.getElementById('home-q');if(hq){hq.addEventListener('focus',e=>{hq.blur();openSearch(hq.value);});}document.querySelectorAll('[data-open-search]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openSearch(b.dataset.q||null);}));
 const q=new URLSearchParams(location.search).get('q');if(q&&!document.getElementById('pwmap'))openSearch(q);});
/* ---------- compare button on pal page + compare picker ---------- */
document.addEventListener('DOMContentLoaded',()=>window.PW_data().then(D=>{
 const info=document.querySelector('.pal-info[data-pal]');if(info){const p=D.pals.find(x=>x.id==info.dataset.pal);if(p){const a=document.createElement('a');a.className='fav cmpb';a.href=B+'compare/?a='+encodeURIComponent(p.ru);a.textContent='⚖️ Сравнить';info.appendChild(a);}}
 const c1=document.getElementById('c1'),c2=document.getElementById('c2');if(c1&&c2&&c1.type!=='hidden'&&!c1.dataset.pk){[c1,c2].forEach((inp,i)=>{inp.dataset.pk=1;inp.readOnly=true;inp.removeAttribute('list');const slot=document.createElement('button');slot.type='button';slot.className='pslot';inp.style.display='none';inp.after(slot);
   const paint=()=>{const a=window.PW_core.find(inp.value,['pal']);const p=a?D.pals[a.ref]:null;slot.innerHTML=p?`<img src="${B+p.thumb}" width="64" height="64" alt=""><b>${esc(p.ru)}</b><small>сменить</small>`:'<span class="plus">＋</span><b>Выбрать пала</b>';};paint();
   slot.onclick=()=>window.PW_pickPal(D,i?'Второй пал…':'Первый пал…',p=>{inp.value=p.ru;paint();inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));const u=new URLSearchParams(location.search);u.set(i?'b':'a',p.ru);history.replaceState(null,'','?'+u);});});
  if(!new URLSearchParams(location.search).get('b')&&new URLSearchParams(location.search).get('a')){c2.value='';c2.dispatchEvent(new Event('input',{bubbles:true}));c2.nextElementSibling.innerHTML='<span class="plus">＋</span><b>Выбрать второго</b>';}}
 breed2(D);}));
/* ---------- breeding v2 ---------- */
function breed2(D){const el=document.getElementById('breed');if(!el)return;fetch(B+'assets/breeding.json').then(r=>r.json()).then(J=>{
 const ix={};J.pals.forEach((x,i)=>ix[x.ru]=i);const by=n=>D.pals.find(p=>p.ru==n)||{ru:n,el:[],thumb:'',url:''};const sp={};J.special.forEach(x=>sp[[x.a,x.b].sort().join('|')]=x.child);
 const child=(a,b)=>{const k=sp[[a.ru,b.ru].sort().join('|')];if(k)return [by(k),true];const i=ix[a.ru],j=ix[b.ru];if(i==null||j==null)return [null,false];return [by(J.pals[J.pairs[Math.min(i,j)+','+Math.max(i,j)]].ru),false];};
 const easy=p=>(p.rarity||5)+(p.rank?0:5);
 const pairs=t=>{const o=[];J.special.forEach(x=>{if(x.child==t.ru)o.push([x.a,x.b,true]);});const ti=ix[t.ru];if(!o.length&&ti!=null)for(const k in J.pairs)if(J.pairs[k]==ti){const [i,j]=k.split(',').map(Number);if(i!=ti&&j!=ti)o.push([J.pals[i].ru,J.pals[j].ru,false]);}
  return o.map(([a,b,s])=>[by(a),by(b),s]).filter(([a,b])=>a.url&&b.url).sort((x,y)=>easy(x[0])+easy(x[1])-easy(y[0])-easy(y[1]));};
 const u=new URLSearchParams(location.search);let A=by(u.get('a')||'Ламболл'),Bp=by(u.get('b')||'Каттива'),T=by(u.get('t')||'Анубис'),mode=u.get('t')?'r':'f',onlyMine=false,page=1;
 const av=(p,lbl)=>p&&p.url?`<img src="${B+p.thumb}" width="72" height="72" alt=""><b>${esc(p.ru)}</b><span class="els">${p.el.map(chip).join('')}</span>`:`<span class="plus">＋</span><b>${lbl}</b>`;
 const mine=()=>new Set(Object.values(LS.get('pw_lists',{})).flat());
 const draw=()=>{const [c,spc]=A.url&&Bp.url?child(A,Bp):[null,false];
  el.innerHTML=`<div class="seg bseg"><button type="button" data-m="f" class="${mode=='f'?'on':''}">Родители → детёныш</button><button type="button" data-m="r" class="${mode=='r'?'on':''}">Как получить</button><button type="button" class="hlp" data-tip="Выбери двух родителей — увидишь, кто вылупится. Или выбери нужного пала во вкладке «Как получить» — покажем пары родителей, начиная с самых простых.">?</button></div>
  ${mode=='f'?`<div class="bpar"><button type="button" class="pslot" data-s="a">${av(A,'Родитель 1')}</button><button type="button" class="bswap" aria-label="Поменять местами">⇄</button><button type="button" class="pslot" data-s="b">${av(Bp,'Родитель 2')}</button></div>
   <div class="beq">=</div>${c?`<div class="bchild">${spc?'<span class="spc">💞 Особая пара</span>':''}<img src="${B+c.thumb}" width="120" height="120" alt=""><h3>${esc(c.ru)}</h3><div>${c.el.map(chip).join('')}</div><div class="bb"><a class="md-button" href="${B+c.url}">Страница пала</a><a class="md-button md-button--primary" href="${B+c.url}#bld">🛠 Собрать сборку</a></div></div>`:'<div class="bchild empty">Выбери двух родителей</div>'}`
  :`<button type="button" class="pslot wide" data-s="t">${av(T,'Кого хочешь получить?')}</button><label class="bmine"><input type="checkbox" ${onlyMine?'checked':''}> только палы из моих списков</label><div class="bpairs"></div>`}`;
  if(mode=='r'&&T.url){let ps=pairs(T);if(onlyMine){const M=mine();ps=ps.filter(([a,b])=>M.has(a.id)&&M.has(b.id));}const per=12;const sh=ps.slice(0,page*per);
   el.querySelector('.bpairs').innerHTML=(ps.length?`<div class="gcount">Пар: ${ps.length}${ps[0]&&ps[0][2]?' · 💞 только особая пара':''}</div>`:'<p>'+(onlyMine?'В твоих списках нет подходящих пар.':'Этого пала нельзя вывести — только поймать.')+'</p>')+sh.map(([a,b,s])=>`<a class="bpair" href="?a=${encodeURIComponent(a.ru)}&b=${encodeURIComponent(b.ru)}"><span><img src="${B+a.thumb}" width="48" height="48" alt="">${esc(a.ru)}</span><i>+</i><span><img src="${B+b.thumb}" width="48" height="48" alt="">${esc(b.ru)}</span>${s?'<em>💞</em>':''}</a>`).join('')+(ps.length>sh.length?'<button type="button" class="md-button bmore">Показать ещё</button>':'');}
  el.querySelectorAll('.bseg [data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;page=1;draw();});
  el.querySelectorAll('.pslot').forEach(b=>b.onclick=()=>window.PW_pickPal(D,b.dataset.s=='t'?'Кого вывести?':'Выбери родителя…',p=>{if(b.dataset.s=='a')A=p;else if(b.dataset.s=='b')Bp=p;else{T=p;page=1;}history.replaceState(null,'',mode=='f'?`?a=${encodeURIComponent(A.ru)}&b=${encodeURIComponent(Bp.ru)}`:`?t=${encodeURIComponent(T.ru)}`);draw();if(mode=='f'){const c=el.querySelector('.bchild');c&&c.classList.add('pop');}}));
  const sw=el.querySelector('.bswap');if(sw)sw.onclick=()=>{[A,Bp]=[Bp,A];draw();};
  const mm=el.querySelector('.bmine input');if(mm)mm.onchange=()=>{onlyMine=mm.checked;page=1;draw();};const mo=el.querySelector('.bmore');if(mo)mo.onclick=()=>{page++;draw();};};
 draw();});}
})();
(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* passive card filters */
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.pfl').forEach(f=>{const g=f.nextElementSibling&&f.nextElementSibling.classList.contains('pgrid')?f.nextElementSibling:document.querySelector('.pgrid');if(!g)return;let rk=null,cat=null;const q=f.querySelector('.pfq'),n=f.querySelector('.pfn');
 const run=()=>{const v=(q.value||'').toLowerCase().replace(/ё/g,'е');let c=0;g.querySelectorAll('.pcard').forEach(x=>{const r=+x.dataset.rk;let ok=!v||x.dataset.n.replace(/ё/g,'е').includes(v);if(ok&&rk)ok=rk=='neg'?r<0:rk.includes('-')?(r>=+rk.split('-')[0]&&r<=+rk.split('-')[1]):r==+rk;if(ok&&cat)ok=x.dataset.cat.split(' ').includes(cat);x.style.display=ok?'':'none';c+=ok;});n.textContent='найдено '+c;};
 f.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.rk!=null){rk=rk==b.dataset.rk?null:b.dataset.rk;f.querySelectorAll('[data-rk]').forEach(x=>x.classList.toggle('on',x.dataset.rk==rk));}if(b.dataset.cat!=null){cat=cat==b.dataset.cat?null:b.dataset.cat;f.querySelectorAll('[data-cat]').forEach(x=>x.classList.toggle('on',x.dataset.cat==cat));}run();});q.addEventListener('input',run);run();});
 /* faq filters */
 const fa=document.getElementById('fqall');if(fa){let lv='',cat=null;const run=()=>fa.querySelectorAll('.fq').forEach(d=>{d.style.display=(!lv||d.dataset.lv==lv)&&(!cat||d.dataset.cat==cat)?'':'none';});
  document.querySelectorAll('.fqlv button').forEach(b=>b.onclick=()=>{lv=b.dataset.lv;document.querySelectorAll('.fqlv button').forEach(x=>x.classList.toggle('on',x===b));run();});
  document.querySelectorAll('.fqc button').forEach(b=>b.onclick=()=>{cat=cat==b.dataset.cat?null:b.dataset.cat;document.querySelectorAll('.fqc button').forEach(x=>x.classList.toggle('on',x.dataset.cat==cat));run();});}
 /* ask assistant */
 const ask=document.getElementById('ask');if(ask)window.PW_data().then(D=>{const C=window.PW_core,N=C.norm;const st=w=>w.length>5?w.slice(0,5):w;const SW=new Set('как где что кто чем для это или the а в на и с по у о из'.split(' '));
  const FQ=D.faq.map(f=>({f,w:new Set(N(f.q).split(' ').filter(w=>!SW.has(w)).map(st))}));
  const inp=document.getElementById('askq'),out=document.getElementById('asko');
  const ph=['Спроси про Palworld…','Например: где взять серу?','Например: чем бить Зои?','Например: как вывести Анубиса?'];let pi=0;setInterval(()=>{if(!inp.value&&document.activeElement!==inp){pi=(pi+1)%ph.length;inp.placeholder=ph[pi];}},2600);
  const kb=t=>esc(t).replace(/(Клавиш[аиу]|Нажми|клавиш[аиу])\s+([A-Za-z0-9]+)/g,(m,a,k)=>a+' <kbd>'+k+'</kbd>');
  const go=()=>{const raw=inp.value.trim();if(raw.length<2)return;const fx=C.fixLayout(raw.toLowerCase());const q=fx&&fx[1]?fx[0]:raw;const ws=N(q).split(' ').filter(w=>!SW.has(w)).map(st);
   const sc=FQ.map(x=>[ws.reduce((a,w)=>a+(x.w.has(w)?1:0),0)/Math.max(2,x.w.size)**.5,x.f]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]);
   let ent='';try{const a=C.answer(q);if(a&&a.type!='none'&&a.type!='faq')ent=window.PW_render(a);}catch(e){}
   const best=sc[0]&&sc[0][0]>=.5?sc[0][1]:null;const rel=sc.slice(best?1:0,5).map(x=>x[1].q);
   out.innerHTML=`<div class="bub me">${esc(raw)}</div>`+((best||ent)?`<div class="bub ai"><span class="ai-av">🐑</span><div>${best?`<b>${esc(best.q)}</b><p>${kb(best.a)}</p>`:''}${ent?`<div class="sx-card">${ent}</div>`:''}</div></div>`:`<div class="bub ai"><span class="ai-av">🐑</span><div><p>Пока не знаю точного ответа.</p><a class="md-button md-button--primary" href="https://t.me/PalGuideBot?start=ask" target="_blank" rel="noopener">Спросить в боте</a></div></div>`)+(rel.length?`<div class="ask-chips rel">${rel.map(r=>`<button type="button" data-q="${esc(r)}">${esc(r)}</button>`).join('')}</div>`:'');};
  ask.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b){inp.value=b.dataset.q;go();}});document.getElementById('asks').onclick=go;inp.addEventListener('keydown',e=>{if(e.key=='Enter')go();});let _at;inp.addEventListener('input',()=>{clearTimeout(_at);if(inp.value.trim().length<2){out.innerHTML='';return;}_at=setTimeout(go,250);});
  const u=new URLSearchParams(location.search).get('ask');if(u){inp.value=u;go();}});
 /* ask box on pal / boss pages */
 const info=document.querySelector('.pal-info[data-pal]'),bh=document.querySelector('.boss-hero');if(info||bh){const name=((document.querySelector('article h1')||{}).textContent||'').replace(/[¶§\u200b-\u200d\u2060\u2063\ufeff]/g,'').trim();const nm=name.trim();
  const qs=info?[['📍 где найти','где найти '+nm],['✨ лучшие пассивки','пассивки '+nm],['🧬 разведение','как вывести '+nm],['🎯 слабость','чем бить '+nm]]:[['🎯 чем бить','чем бить '+nm],['📍 где','где '+nm]];
  const box=document.createElement('div');box.className='askmini';box.innerHTML=`<div class="am-h">🤖 Спроси про ${info?'этого пала':'этого босса'}</div><div class="ask-chips">${qs.map(([l,q])=>`<button type="button" data-q="${esc(q)}">${l}</button>`).join('')}<button type="button" data-ig>🎮 В игре</button></div>`;box.querySelector('[data-ig]').onclick=()=>window.PW_ingame&&window.PW_ingame(true);
  (info?info.closest('.pal-hero'):bh).after(box);box.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b&&window.PW_search)window.PW_search(b.dataset.q);});}
 /* sync to bot */
 const my=document.getElementById('mylists');if(my)window.PW_data().then(D=>{const by=Object.fromEntries(D.pals.map(p=>[p.id,p]));
  const mk=()=>{const L=JSON.parse(localStorage.getItem('pw_lists')||'null')||{};const seg=(c,ids)=>c+ids.map(i=>i.toString(36).padStart(2,'0')).join('');const segs=[];
   [['f','Избранное'],['t','Команда'],['m','Фарм']].forEach(([c,n])=>{const ids=(L[n]||[]).map(id=>by[id]).filter(Boolean).map(p=>p.j);for(let k=0;k<ids.length;k+=28)segs.push(seg(c,ids.slice(k,k+28)));});
   const links=[];let cur='';segs.forEach(s=>{if(cur&&(cur+'-'+s).length>59){links.push(cur);cur=s;}else cur=cur?cur+'-'+s:s;});if(cur)links.push(cur);return links;};
  const w=document.createElement('div');w.className='syncb';my.before(w);
  const draw=()=>{const l=mk();w.innerHTML=`<div class="am-h">📲 Перенести списки в бота <button type="button" class="hlp" data-tip="Избранное, Команда и Фарм откроются в боте @PalGuideBot. Нажми ссылку — бот добавит палов в свои списки.">?</button></div>`+(l.length?l.map((c,i)=>`<a class="md-button md-button--primary" target="_blank" rel="noopener" href="https://t.me/PalGuideBot?start=sync_${c}">В бота${l.length>1?' · часть '+(i+1):''}</a>`).join(' '):'<small>Списки пусты — добавь палов, и появится кнопка.</small>');};
  draw();my.addEventListener('click',()=>setTimeout(draw,50));});
});})();
(function(){document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('article.md-content__inner > ul, article .tabbed-block > ul').forEach(ul=>{const n=ul.children.length;if(n<=8||ul.closest('.md-nav'))return;ul.classList.add('lgrid');
 if(n>30){const f=document.createElement('input');f.type='search';f.className='pfq lgq';f.placeholder='Фильтр по списку ('+n+')…';ul.before(f);const items=[...ul.children];let lim=60;const show=()=>{const v=f.value.toLowerCase().replace(/ё/g,'е');let c=0;items.forEach(li=>{const ok=!v||li.textContent.toLowerCase().replace(/ё/g,'е').includes(v);li.style.display=ok&&(v||c<lim)?'':'none';if(ok)c++;});mb.hidden=!!v||c<=lim;};
  const mb=document.createElement('button');mb.type='button';mb.className='md-button lgmore';mb.textContent='Показать ещё';mb.onclick=()=>{lim+=60;show();};ul.after(mb);f.oninput=show;show();}});});})();
(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
/* settings */
const S=Object.assign({fs:'m',mode:'full'},LS.get('pw_set',{}));const apply=()=>{const h=document.documentElement;h.classList.toggle('fs-l',S.fs=='l');h.classList.toggle('fs-xl',S.fs=='xl');h.classList.toggle('simple',S.mode=='simple');};apply();
function scheme(v){const b=document.body;if(!b)return;b.setAttribute('data-md-color-scheme',v=='light'?'default':'slate');document.documentElement.setAttribute('data-md-color-scheme',v=='light'?'default':'slate');document.documentElement.style.colorScheme=v=='light'?'light':'dark';try{const k=(typeof __md_scope!='undefined'?__md_scope.pathname:new URL((window.PW_BASE||'/')+'/',location).pathname).replace(/\/+$/,'/')+'.__palette';const sc=v=='light'?'default':'slate';localStorage.setItem(k,JSON.stringify({index:v=='light'?1:0,color:{media:'',scheme:sc,primary:'custom',accent:'custom'}}));const i=document.getElementById('__palette_'+(v=='light'?1:0));if(i)i.checked=true;}catch(e){}}
function panel(){const bg=document.createElement('div');bg.className='sheet-bg';const p=document.createElement('div');p.className='setp';p.setAttribute('role','dialog');const cur=document.body.getAttribute('data-md-color-scheme')=='default'?'light':'dark';
 const seg=(k,opts,v)=>`<div class="seg" data-k="${k}">${opts.map(([a,t])=>`<button type="button" data-v="${a}" class="${a==v?'on':''}">${t}</button>`).join('')}</div>`;
 p.innerHTML=`<h3>⚙️ Настройки</h3><div class="row"><span>Тема</span>${seg('th',[['dark','🌙 Тёмная'],['light','☀️ Светлая']],cur)}</div><div class="row"><span>Крупный текст</span>${seg('fs',[['m','А'],['l','А+'],['xl','А++']],S.fs)}</div><div class="row"><span>Простой режим</span>${seg('mode',[['full','Выкл'],['simple','Вкл']],S.mode)}</div><div class="row"><span>Режим «В игре»</span><button type="button" class="md-button" data-ig>${document.documentElement.classList.contains('ingame')?'Выключить':'🎮 Включить — экран не гаснет'}</button></div><button type="button" class="md-button" data-tour>Показать обучение</button><button type="button" class="md-button md-button--primary" data-x>Готово</button>`;
 const close=()=>{p.remove();bg.remove();};bg.onclick=close;document.body.append(bg,p);
 p.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const sg=b.closest('.seg');if(sg){sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));const k=sg.dataset.k;if(k=='th')scheme(b.dataset.v);else{S[k]=b.dataset.v;LS.set('pw_set',S);apply();}}
  if(b.hasAttribute('data-x'))close();if(b.hasAttribute('data-tour')){close();tour(true);}if(b.hasAttribute('data-ig')){ingame(!document.documentElement.classList.contains('ingame'));close();}});}
/* in-game mode with Wake Lock */
let wl=null;async function ingame(on){document.documentElement.classList.toggle('ingame',on);LS.set('pw_ingame',on);let ib=document.querySelector('.igb');
 if(on){try{if('wakeLock' in navigator){wl=await navigator.wakeLock.request('screen');}}catch(e){}if(!ib){ib=document.createElement('button');ib.className='igb';ib.type='button';ib.onclick=()=>ingame(false);document.body.appendChild(ib);}ib.textContent='🎮 В игре'+(wl?' · экран не гаснет':'')+' ✕';}
 else{try{wl&&wl.release();}catch(e){}wl=null;ib&&ib.remove();}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible'&&document.documentElement.classList.contains('ingame')&&'wakeLock' in navigator)navigator.wakeLock.request('screen').then(w=>wl=w).catch(()=>{});});
/* onboarding */
function tour(force){if(!force&&LS.get('pw_onb',false))return;const steps=[['🔍','Ищи что угодно','Нажми «Поиск» внизу или клавишу /. Понимаю опечатки и английскую раскладку: «fye,bc» — это «Анубис».'],['🛠','Собирай палов','На странице пала есть конструктор: звёзды, уровень, пассивки. Сборку можно сохранить и отправить в бота.'],['⭐','Списки и бот','Добавляй палов в Избранное, Команду и Фарм. В «Мои списки» есть кнопка «В бота» — списки окажутся в @PalGuideBot.']];let i=0;
 const bg=document.createElement('div');bg.className='sheet-bg';const p=document.createElement('div');p.className='setp onb';p.setAttribute('role','dialog');document.body.append(bg,p);const close=()=>{p.remove();bg.remove();LS.set('pw_onb',true);};bg.onclick=close;
 const draw=()=>{const [e,t,d]=steps[i];p.innerHTML=`<div class="big">${e}</div><h3>${t}</h3><p>${d}</p><div class="dots">${steps.map((_,k)=>`<i class="${k==i?'on':''}"></i>`).join('')}</div><div class="seg" style="justify-content:space-between"><button type="button" data-s>Пропустить</button><button type="button" class="on" data-n>${i<2?'Дальше':'Начать'}</button></div>`;
  p.querySelector('[data-s]').onclick=close;p.querySelector('[data-n]').onclick=()=>{if(i<2){i++;draw();}else close();};};draw();}
/* hover / long-press preview for pal & passive links */
let pv=null,tmr=null;const hide=()=>{clearTimeout(tmr);if(pv){pv.remove();pv=null;}};
function preview(a,x,y){(window.PW_load||window.PW_data)().then(D=>{hide();const h=a.getAttribute('href')||'';let html='';const pn=a.dataset.psv;
  if(pn){const q=D.passives.find(z=>z.name==pn);if(q)html=`<b>${esc(q.name)}</b><small>ранг ${q.rank}</small><div>${esc(q.desc)}</div>`;}
  else{const p=D.pals.find(z=>z.url&&h.split('#')[0].endsWith(z.url));if(p)html=`<img src="${B+p.thumb}" width="56" height="56" alt=""><b>${esc(p.ru)}</b><div>${p.el.map(e=>window.PW_chip?window.PW_chip(e):e).join('')}</div><small>❤️ ${p.hp} · ⚔️ ${p.atk} · 🛡 ${p.def}</small>`;
   else{const b=(D.bcards||[]).find(z=>h.split('#')[0].endsWith(z.u));if(b)html=`<img src="${B+b.t}" width="56" height="56" alt=""><b>${esc(b.n)}</b><small>${esc(b.k)} · ур. ${b.lv.filter(Boolean).join(' / ')}</small><div>Слабость: ${b.w.map(e=>window.PW_chip?window.PW_chip(e):e).join('')}</div>`;}}
  if(!html)return;pv=document.createElement('div');pv.className='pvw';pv.innerHTML=html;document.body.appendChild(pv);pv.style.left=Math.max(8,Math.min(x+12,innerWidth-275))+'px';pv.style.top=(y+20+pv.offsetHeight>innerHeight?y-pv.offsetHeight-12:y+16)+'px';});}
const tgt=e=>e.target.closest&&e.target.closest('article a[href*="/paly/"],article a[href*="/boss/"],article a.psv[data-psv],.sx a[href*="/paly/"]');
document.addEventListener('mouseover',e=>{if(!matchMedia('(hover:hover)').matches)return;const a=tgt(e);if(!a)return;clearTimeout(tmr);tmr=setTimeout(()=>preview(a,e.clientX,e.clientY),350);});
document.addEventListener('mouseout',e=>{if(tgt(e))hide();});
let lp=null;document.addEventListener('touchstart',e=>{const a=tgt(e);if(!a)return;const t=e.touches[0];lp=setTimeout(()=>{lp='fired';preview(a,t.clientX,t.clientY);if(navigator.vibrate)navigator.vibrate(10);},450);},{passive:true});
document.addEventListener('touchmove',()=>{if(lp&&lp!=='fired')clearTimeout(lp);},{passive:true});
document.addEventListener('touchend',e=>{if(lp==='fired'){e.preventDefault();setTimeout(hide,1800);}else clearTimeout(lp);lp=null;});
document.addEventListener('contextmenu',e=>{if(tgt(e)&&matchMedia('(pointer:coarse)').matches)e.preventDefault();});addEventListener('scroll',hide,{passive:true});
document.addEventListener('DOMContentLoaded',()=>{const b=document.createElement('button');b.type='button';b.className='setb';b.setAttribute('aria-label','Настройки');b.textContent='⚙️';b.onclick=panel;document.body.appendChild(b);window.PW_settings=panel;const nt=document.querySelector('.md-nav--primary');if(nt&&!nt.querySelector('.drw-set')){const x=document.createElement('button');x.type='button';x.className='drw-set';x.textContent='⚙️ Настройки';x.onclick=()=>{const d=document.getElementById('__drawer');if(d)d.checked=false;document.documentElement.classList.remove('drawer-open');panel()};nt.appendChild(x)}
 if(LS.get('pw_ingame',false))ingame(true);if(!/[?&](nobanner|test)/.test(location.search)&&!navigator.webdriver)setTimeout(()=>tour(false),1200);
 const hm=document.querySelector('.hero, .home-hero');window.PW_settings=panel;window.PW_tour=tour;window.PW_ingame=ingame;});
})();
