(function(){const B=window.PW_BASE;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const chip=e=>window.PW_chip?window.PW_chip(e):`<span class="el">${esc(e)}</span>`;
window.PW_breed2=true;
let lock=0,ly=0;const bodyLock=v=>{const b=document.body;if(v){if(lock++)return;ly=scrollY;b.style.position='fixed';b.style.top=-ly+'px';b.style.left=b.style.right='0';}else{if(--lock>0)return;lock=0;b.style.position=b.style.top=b.style.left=b.style.right='';scrollTo(0,ly);}};
/* ---------- generic index ---------- */
let IDX=null;function index(D){if(IDX)return IDX;const N=window.PW_core.norm;IDX=[];const add=o=>{o.k=N(o.label+' '+(o.alt||''));IDX.push(o);};
 const pop=Object.fromEntries((D.popular||[]).map(([i,c])=>[i,c]));
 D.pals.forEach(p=>p.url&&add({t:'pal',label:p.ru,alt:p.en,sub:'№'+p.no+' · '+p.el.join(', '),img:p.thumb,url:p.url,w:(pop[p.id]||0)+1,ref:p}));
 (D.bcards||[]).forEach(b=>add({t:'boss',label:b.n,alt:b.pal,sub:b.k+' · ур. '+b.lv.filter(Boolean).join(' / '),img:b.t,url:b.u,w:2}));
 D.passives.forEach(q=>add({t:'passive',label:q.name,alt:q.en,sub:'ранг '+q.rank+' · '+(q.desc||'').slice(0,60),url:q.url,w:1,rank:q.rank}));
 D.items.forEach(i=>i.url&&add({t:'item',label:i.ru,alt:i.en,sub:i.type||'предмет',url:i.url,w:.5}));
 [['Карта','map/','🗺️','карта map телепорт башня'],['Калькулятор разведения','breed/','🧬','разведение скрестить вывести'],['Сравнить палов','compare/','⚖️','сравнить сравнение'],['Галерея палов','gallery/','🐾','галерея палы фильтр'],['Мои списки','my/','⭐','избранное списки сборки команда'],['Все боссы','boss/','👑','боссы башни рейды'],['Все пассивки','passivki/','✨','пассивки']].forEach(([l,u,i,a])=>add({t:'page',label:l,alt:a,sub:'раздел',ic:i,url:u,w:1}));
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
let SX=null;function openSearch(pre){window.PW_data().then(D=>{if(SX){SX.querySelector('input').focus();return;}
 const s=document.getElementById('__search');if(s)s.checked=false;
 SX=document.createElement('div');SX.className='sx';SX.setAttribute('role','dialog');SX.setAttribute('aria-label','Поиск');bodyLock(true);
 const recQ=()=>LS.get('pw_recentq',[]);const pushQ=q=>{q=q.trim();if(q.length<2)return;LS.set('pw_recentq',[q,...recQ().filter(x=>x!=q)].slice(0,8));};
 const pop=(D.popular||[]).map(([i])=>D.pals.find(p=>p.id==i)).filter(p=>p&&p.url).slice(0,8);
 const tiles=[['🐾','Палы','gallery/'],['👑','Боссы','boss/'],['✨','Пассивки','passivki/'],['📦','Предметы','4_spravochniki/predmety/'],['🗺️','Карта','map/'],['🧬','Разведение','breed/'],['🛠','Сборка','my/'],['⚖️','Сравнить','compare/']];
 const ex=['кто лучше копает','чем бить зои','где взять серу','пассивки фросталион боец','как вывести анубиса','сравнить анубис и джетрагон','fye,bc'];
 const empty=()=>`${recQ().length?`<div class="sx-h">Недавние</div><div class="sx-chips">${recQ().map(q=>`<span class="sx-c"><button type="button" data-q="${esc(q)}">🕘 ${esc(q)}</button><button type="button" class="sx-del" data-del="${esc(q)}" aria-label="Удалить">×</button></span>`).join('')}</div>`:''}
  ${pop.length?`<div class="sx-h">Популярное</div><div class="sx-chips">${pop.map(p=>`<a class="sx-c sx-p" href="${B+p.url}"><img src="${B+p.thumb}" width="22" height="22" alt="">${esc(p.ru)}</a>`).join('')}</div>`:''}
  <div class="sx-h">Разделы</div><div class="sx-tiles">${tiles.map(([i,l,u])=>`<a href="${B+u}"><span>${i}</span>${l}</a>`).join('')}</div>
  <div class="sx-h">Можно спросить</div><div class="sx-chips">${ex.map(q=>`<button type="button" class="sx-c" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`;
 SX.innerHTML=`<div class="sx-top"><button type="button" class="sx-back" aria-label="Закрыть">←</button><input type="search" placeholder="Пал, босс, предмет или вопрос…" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"><button type="button" class="sx-clr" aria-label="Очистить" hidden>×</button></div><div class="sx-body">${empty()}</div>`;
 document.body.appendChild(SX);requestAnimationFrame(()=>SX.classList.add('on'));const inp=SX.querySelector('input'),body=SX.querySelector('.sx-body'),clr=SX.querySelector('.sx-clr');
 const close=()=>{if(!SX)return;SX.remove();SX=null;bodyLock(false);};SX.querySelector('.sx-back').onclick=close;
 const cmp=v=>{const m=window.PW_core.norm(v).match(/^сравн\S*\s+(.+?)\s+(?:и|с|vs|против|или)\s+(.+)$/);if(!m)return null;const a=window.PW_core.find(m[1],['pal']),b=window.PW_core.find(m[2],['pal']);if(!a||!b)return null;const A=D.pals[a.ref],Bp=D.pals[b.ref];
  return `<a class="sx-ans sx-cmp" href="${B}compare/?a=${encodeURIComponent(A.ru)}&b=${encodeURIComponent(Bp.ru)}"><img src="${B+A.thumb}" width="48" height="48" alt=""><b>⚖️ Сравнить ${esc(A.ru)} и ${esc(Bp.ru)}</b><img src="${B+Bp.thumb}" width="48" height="48" alt=""></a>`;};
 const draw=()=>{const v=inp.value;clr.hidden=!v;if(v.trim().length<1){body.innerHTML=empty();return;}
  const {res,fixed}=match(D,v);let h=fixed?`<div class="dym">Понял как: «${esc(fixed)}»</div>`:'';const c=cmp(v);if(c)h+=c;
  let ans='';try{const a=window.PW_core.answer(v);if(a&&a.type!='none'&&window.PW_render)ans=window.PW_render(a);}catch(e){}
  if(ans&&!c)h+=`<div class="sx-card">${ans}</div>`;
  if(res.length){const g={};res.slice(0,30).forEach(o=>(g[o.t]=g[o.t]||[]).push(o));h+=['pal','boss','passive','item','page'].filter(t=>g[t]).map(t=>`<div class="sx-h">${TT[t]}ы</div>`.replace('Палы','Палы').replace('Боссы','Боссы').replace('Пассивкаы','Пассивки').replace('Предметы','Предметы').replace('Разделы','Разделы')+g[t].slice(0,t=='pal'?8:5).map(row).join('')).join('');}
  else if(!ans&&!c){const s=window.PW_core.suggest?window.PW_core.suggest(v,4):[];h+=`<div class="sx-none"><b>Ничего не нашлось</b><p>Проверь написание или попробуй:</p><div class="sx-chips">${s.map(x=>`<button type="button" class="sx-c" data-q="${esc(x.name)}">${esc(x.name)}</button>`).join('')}${['анубис','башня','легенда'].map(q=>`<button type="button" class="sx-c" data-q="${q}">${q}</button>`).join('')}</div></div>`;}
  body.innerHTML=h;};
 let t;inp.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(draw,90);});clr.onclick=()=>{inp.value='';draw();inp.focus();};
 body.addEventListener('click',e=>{const d=e.target.closest('[data-del]');if(d){LS.set('pw_recentq',recQ().filter(x=>x!=d.dataset.del));draw();return;}const q=e.target.closest('[data-q]');if(q){e.preventDefault();inp.value=q.dataset.q;draw();return;}const a=e.target.closest('a');if(a)pushQ(inp.value);});
 inp.addEventListener('keydown',e=>{if(e.key=='Enter'){pushQ(inp.value);const a=body.querySelector('.sx-ans,.sx-r');if(a)location.href=a.href;}if(e.key=='Escape')close();});
 SX.addEventListener('keydown',e=>{if(e.key=='Escape')close();});
 if(pre){inp.value=pre;draw();}inp.focus();});}
window.PW_search=openSearch;
// iOS: focus must happen in the user gesture -> create input synchronously when data already cached
document.addEventListener('click',e=>{const l=e.target.closest('label[for=__search],.md-search__icon,[href="#search"],.md-search__input');if(!l)return;e.preventDefault();e.stopPropagation();const s=document.getElementById('__search');if(s)s.checked=false;openSearch();},true);
document.addEventListener('keydown',e=>{const tg=e.target;const typing=tg.closest&&tg.closest('input,textarea,select,[contenteditable]');if((e.key=='k'||e.key=='K'||e.key=='л')&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.stopPropagation();openSearch();}else if(e.key=='/'&&!typing){e.preventDefault();e.stopPropagation();openSearch();}},true);
document.addEventListener('DOMContentLoaded',()=>{const s=document.getElementById('__search');if(s)s.addEventListener('change',()=>{if(s.checked){s.checked=false;openSearch();}});window.PW_data();
 const hq=document.getElementById('home-q');if(hq){hq.addEventListener('focus',e=>{hq.blur();openSearch(hq.value);});}
 const q=new URLSearchParams(location.search).get('q');if(q&&!document.getElementById('pwmap'))openSearch(q);});
/* ---------- compare button on pal page + compare picker ---------- */
document.addEventListener('DOMContentLoaded',()=>window.PW_data().then(D=>{
 const info=document.querySelector('.pal-info[data-pal]');if(info){const p=D.pals.find(x=>x.id==info.dataset.pal);if(p){const a=document.createElement('a');a.className='fav cmpb';a.href=B+'compare/?a='+encodeURIComponent(p.ru);a.textContent='⚖️ Сравнить';info.appendChild(a);}}
 const c1=document.getElementById('c1'),c2=document.getElementById('c2');if(c1&&c2&&!c1.dataset.pk){[c1,c2].forEach((inp,i)=>{inp.dataset.pk=1;inp.readOnly=true;inp.removeAttribute('list');const slot=document.createElement('button');slot.type='button';slot.className='pslot';inp.style.display='none';inp.after(slot);
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
