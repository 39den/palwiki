(function(){const B=window.PW_BASE,chip=window.PW_chip;const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const ELS=['Нейтральный','Огонь','Вода','Трава','Молния','Лёд','Земля','Тьма','Дракон'];
const b36=(n,l)=>n.toString(36).padStart(l,'0');
/* ---------- lists ---------- */
const lists=()=>{const L=LS.get('pw_lists',null)||{'Избранное':LS.get('pw_fav',[]),'Команда':[],'Фарм':[]};return L;};
const saveL=L=>{LS.set('pw_lists',L);LS.set('pw_fav',L['Избранное']||[]);};
window.PW_lists={lists,saveL};
/* ---------- breeding ---------- */
function breedCore(D){if(D.BJ){const J=D.BJ,ix={};J.pals.forEach((x,i)=>ix[x.ru]=i);const by=n=>D.pals.find(p=>p.ru==n)||{ru:n};const sp={};J.special.forEach(x=>sp[[x.a,x.b].sort().join('|')]=x.child);
  const breed=(a,b)=>{const k=sp[[a.ru,b.ru].sort().join('|')];if(k)return [by(k),'особая пара'];const i=ix[a.ru],j=ix[b.ru];if(i==null||j==null)return [a,'нет данных'];const c=J.pairs[Math.min(i,j)+','+Math.max(i,j)];return [by(J.pals[c].ru),a.ru==b.ru?'тот же вид':'по рангам разведения'];};
  const parents=(ch,lim=30)=>{const o=[];J.special.forEach(x=>{if(x.child==ch.ru)o.push([x.a,x.b]);});const t=ix[ch.ru];if(!o.length)for(const k in J.pairs)if(J.pairs[k]==t){const [i,j]=k.split(',').map(Number);if(i!=t&&j!=t)o.push([J.pals[i].ru,J.pals[j].ru]);}
   const pop=n=>(D.pals.find(x=>x.ru==n)||{rarity:9}).rarity;o.sort((x,y)=>pop(x[0])+pop(x[1])-pop(y[0])-pop(y[1]));return o.slice(0,lim);};return {breed,parents};}const BR=D.pals.filter(p=>p.rank&&!p.collab);const UQ={};D.pals.forEach(p=>{if(p.up)UQ[p.up.slice().sort().join('|')]=p;});const kids=new Set(Object.values(UQ).map(p=>p.ru));
 const FORM=BR.filter(p=>!kids.has(p.ru)&&p.rank<9999);
 const breed=(a,b)=>{if(a.ru==b.ru)return [a,'тот же вид'];const u=UQ[[a.ru,b.ru].sort().join('|')];if(u)return [u,'особая пара'];const t=Math.floor((a.rank+b.rank+1)/2);
  let c=FORM[0];for(const p of FORM){const d=Math.abs(p.rank-t),dc=Math.abs(c.rank-t);if(d<dc||(d==dc&&p.rank<c.rank))c=p;}return [c,'по рангам разведения'];};
 const parents=(ch,lim=30)=>{if(ch.up)return [[ch.up[0],ch.up[1]]];const o=[];for(let i=0;i<BR.length;i++)for(let j=i;j<BR.length;j++){const [c]=breed(BR[i],BR[j]);if(c.ru==ch.ru&&BR[i].ru!=ch.ru&&BR[j].ru!=ch.ru){o.push([BR[i].ru,BR[j].ru]);}}
  const pop=n=>{const p=D.pals.find(x=>x.ru==n);return p?p.rarity:9};o.sort((x,y)=>pop(x[0])+pop(x[1])-pop(y[0])-pop(y[1]));return o.slice(0,lim);};
 return {breed,parents,BR};}
function breedPage(D){const el=document.getElementById('breed');if(!el||window.PW_breed2)return;const C=breedCore(D);if(!D.BJ){fetch(B+'assets/breeding.json').then(r=>r.json()).then(j=>{D.BJ=j;el.innerHTML='';breedPage(D);});return;}const ps=D.pals.filter(p=>p.url).sort((a,b)=>a.ru.localeCompare(b.ru,'ru'));
 const by=n=>D.pals.find(p=>p.ru==n);const pk=v=>{const a=window.PW_core.find(v,['pal']);return a?D.pals[a.ref]:null;};
 const mini=p=>p?`<a class="mc card-link" href="${B+p.url}"><img src="${B+p.thumb}" width="60" height="60" alt=""><span>${esc(p.ru)}</span></a>`:'';
 const u=new URLSearchParams(location.search);
 el.innerHTML=`<datalist id="bl">${ps.map(p=>`<option value="${esc(p.ru)}">`).join('')}</datalist>
 <div class="seg" id="bm"><button data-m="f" class="on">Родители → ребёнок</button><button data-m="r">Как получить пала</button></div>
 <div id="bf" class="bcalc"><input list="bl" id="p1" placeholder="Родитель 1" value="${esc(u.get('a')||'Ламболл')}"><span class="plus">+</span><input list="bl" id="p2" placeholder="Родитель 2" value="${esc(u.get('b')||'Каттива')}"><div id="bo"></div></div>
 <div id="br" class="bcalc" hidden><input list="bl" id="pt" placeholder="Кого хочешь получить?" value="${esc(u.get('t')||'Анубис')}"><div id="bro"></div></div>
 <p class="map-note">Расчёт по рангам разведения из данных игры; особые пары учтены. Пол родителей на результат не влияет, кроме нескольких особых пар — таких данных у нас пока нет.</p>`;
 const f=()=>{const a=pk(document.getElementById('p1').value),b=pk(document.getElementById('p2').value);const o=document.getElementById('bo');if(!a||!b){o.innerHTML='';return;}const [c,how]=C.breed(a,b);
  o.innerHTML=`<div class="bres">${mini(a)}<span class="op">+</span>${mini(b)}<span class="op">=</span>${mini(c)}</div><div class="map-note">${esc(how)}</div>`;history.replaceState(null,'','?a='+encodeURIComponent(a.ru)+'&b='+encodeURIComponent(b.ru));};
 const r=()=>{const t=pk(document.getElementById('pt').value);const o=document.getElementById('bro');if(!t){o.innerHTML='';return;}const pr=C.parents(t);t.up=pr.length&&D.BJ.special.some(x=>x.child==t.ru);
  o.innerHTML=pr.length?`<div class="map-note">${t.up?'Особая пара — только так:':'Самые доступные пары (из '+pr.length+'+):'}</div>`+pr.slice(0,12).map(([x,y])=>`<div class="bres sm">${mini(by(x))}<span class="op">+</span>${mini(by(y))}</div>`).join(''):'<p>Этого пала нельзя вывести — только поймать.</p>';history.replaceState(null,'','?t='+encodeURIComponent(t.ru));};
 el.querySelectorAll('#bm button').forEach(b=>b.onclick=()=>{el.querySelectorAll('#bm button').forEach(x=>x.classList.toggle('on',x===b));document.getElementById('bf').hidden=b.dataset.m!='f';document.getElementById('br').hidden=b.dataset.m!='r';(b.dataset.m=='f'?f:r)();});
 ['p1','p2'].forEach(i=>document.getElementById(i).addEventListener('change',f));document.getElementById('pt').addEventListener('change',r);
 if(u.get('t'))el.querySelector('[data-m=r]').click();else f();}
/* ---------- my lists + team coverage ---------- */
function myPage(D){const el=document.getElementById('mylists');if(!el)return;const by=Object.fromEntries(D.pals.map(p=>[p.id,p]));
 const draw=()=>{const L=lists();el.innerHTML=Object.entries(L).map(([n,ids])=>{const ps=ids.map(i=>by[i]).filter(Boolean);
   let cov='';if(n=='Команда'&&ps.length){const els=new Set(ps.flatMap(p=>p.el));const bosses=D.bosses.filter(b=>b.weak&&b.weak.length);const ok=bosses.filter(b=>b.weak.some(w=>els.has(w)));const gaps=[...new Set(bosses.filter(b=>!b.weak.some(w=>els.has(w))).flatMap(b=>b.weak))];
    cov=`<div class="cov">Стихии команды: ${[...els].map(chip).join('')}<br>Покрывает слабость ${ok.length} из ${bosses.length} боссов.${gaps.length?` Не хватает: ${gaps.map(chip).join('')}`:' 👍 Все боссы закрыты.'}${ps.length>5?'<br><b>В команде больше 5 палов</b> — в игре в отряде максимум 5.':''}</div>`;}
   return `<details class="grp" open><summary>${esc(n)} <span class="cnt">${ps.length}</span>${['Избранное','Команда','Фарм'].includes(n)?'':` <button class="lnk" data-del="${esc(n)}">удалить</button>`}</summary>${cov}<div class="mgrid">${ps.map(p=>`<div class="mcw"><a class="mc card-link" href="${B+p.url}"><img src="${B+p.thumb}" width="60" height="60" alt=""><span>${esc(p.ru)}</span></a><button class="rm" data-l="${esc(n)}" data-i="${p.id}" aria-label="Убрать">×</button></div>`).join('')||'<small>Пусто. Добавляй палов кнопками ★ ⚔️ 🌾 на их страницах.</small>'}</div></details>`;}).join('')+
  `<div class="gal-filters plain"><input id="nl" name="pp-list-name" type="text" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Название списка"><button class="md-button md-button--primary" id="nlb">Создать</button></div>`+builds(D);
  el.querySelectorAll('.rm').forEach(b=>b.onclick=()=>{const L=lists();L[b.dataset.l]=L[b.dataset.l].filter(x=>x!=b.dataset.i);saveL(L);draw();});
  el.querySelectorAll('[data-del]').forEach(b=>b.onclick=ev=>{ev.preventDefault();const L=lists();delete L[b.dataset.del];saveL(L);draw();});
  el.querySelectorAll('[data-bdel]').forEach(b=>b.onclick=()=>{const S=LS.get('pw_builds',[]);S.splice(+b.dataset.bdel,1);LS.set('pw_builds',S);draw();});
  document.getElementById('nlb').onclick=()=>{const ni=document.getElementById('nl'),v=ni.value.trim();if(!v){ni.focus();ni.placeholder='Сначала впиши название';ni.classList.add('need');setTimeout(()=>ni.classList.remove('need'),1200);return;}const L=lists();L[v]=L[v]||[];saveL(L);draw();};};
 draw();}
function builds(D){const S=LS.get('pw_builds',[]);if(!S.length)return '<h2>🛠 Мои сборки</h2><small>Сохраняй сборки на страницах палов (вкладка «Сборка»).</small>';
 return '<h2>🛠 Мои сборки</h2>'+S.map((s,i)=>{const p=D.PI[s.p];if(!p)return '';return `<div class="pset"><div class="pset-h"><a href="${B+p.url}#b=${s.code}">${esc(p.ru)} · ★${s.st} · ур. ${s.lv}</a> <button class="lnk" data-bdel="${i}">удалить</button></div><div class="tags">${s.ps.map(j=>`<span class="psv">${esc((D.QI[j]||{}).name||'')}</span>`).join('')}</div></div>`;}).join('');}
/* ---------- list buttons on pal page ---------- */
function palLists(D){const info=document.querySelector('.pal-info[data-pal]');if(!info)return;const id=info.dataset.pal;const old=info.querySelector('.fav');if(old)old.remove();
 const w=document.createElement('div');w.className='lbtns';const draw=()=>{const L=lists();w.innerHTML=Object.keys(L).map(n=>`<button class="fav ${L[n].includes(id)?'on':''}" data-n="${esc(n)}">${n=='Избранное'?'★':n=='Команда'?'⚔️':n=='Фарм'?'🌾':'📋'} ${esc(n)}</button>`).join('');
  w.querySelectorAll('button').forEach(b=>b.onclick=()=>{const L=lists();const a=L[b.dataset.n]||[];L[b.dataset.n]=a.includes(id)?a.filter(x=>x!=id):[id,...a];saveL(L);draw();});};draw();info.appendChild(w);}
/* ---------- gallery extras: rarity, passive rank, url state ---------- */
function galleryExtra(D){const f=document.getElementById('gal-filters');if(!f||document.getElementById('gr'))return;
 f.insertAdjacentHTML('beforeend','<select id="gr"><option value="">Редкость</option><option value="1-4">обычные (1–4)</option><option value="5-7">редкие (5–7)</option><option value="8-20">легендарные (8+)</option></select><select id="gp"><option value="">Врождённая пассивка</option><option value="4">ранг 4+</option><option value="3">ранг 3+</option><option value="1">любая</option></select>');
 const by=Object.fromEntries(D.pals.map(p=>[B+p.url,p]));
 setTimeout(()=>gsheet(f),0);
 const apply=()=>{const r=document.getElementById('gr').value,pr=+document.getElementById('gp').value||0;let n=0;
  document.querySelectorAll('#gallery a.pc').forEach(a=>{const p=by[a.getAttribute('href')];let ok=true;if(p){if(r){const [lo,hi]=r.split('-').map(Number);ok=p.rarity>=lo&&p.rarity<=hi;}if(ok&&pr)ok=(p.natp||[]).some(x=>x[1]>=pr);}a.style.display=ok?'':'none';n+=ok;});
  const gc=document.getElementById('gc');if(gc)gc.textContent='Найдено: '+n;
  const st={};f.querySelectorAll('select,input').forEach(x=>{if(x.value&&x.id)st[x.id]=x.value;});history.replaceState(null,'','#'+new URLSearchParams(st));};
 const h=new URLSearchParams(location.hash.slice(1));h.forEach((v,k)=>{const x=document.getElementById(k);if(x)x.value=v;});
 f.dispatchEvent(new Event('input'));f.addEventListener('input',()=>setTimeout(apply,0));f.addEventListener('change',()=>setTimeout(apply,0));
 new MutationObserver(()=>apply()).observe(document.getElementById('gallery'),{childList:true});setTimeout(apply,50);
 // star on cards
 document.getElementById('gallery').addEventListener('click',e=>{const s=e.target.closest('.star');if(!s)return;e.cancelable&&e.preventDefault();e.stopPropagation();const L=lists();const id=s.dataset.id;const a=L['Избранное'];L['Избранное']=a.includes(id)?a.filter(x=>x!=id):[id,...a];saveL(L);s.classList.toggle('on');s.textContent=s.classList.contains('on')?'★':'☆';});
 const addStars=()=>{const fav=new Set(lists()['Избранное']);document.querySelectorAll('#gallery a.pc').forEach(a=>{if(a.querySelector('.star'))return;const p=by[a.getAttribute('href')];if(!p)return;a.insertAdjacentHTML('afterbegin',`<span class="star ${fav.has(p.id)?'on':''}" data-id="${p.id}" role="button" aria-label="В избранное">${fav.has(p.id)?'★':'☆'}</span>`);});};
 new MutationObserver(addStars).observe(document.getElementById('gallery'),{childList:true});addStars();}
function gsheet(f){if(f.querySelector('.gsheet'))return;const q=document.getElementById('gq');const sh=document.createElement('div');sh.className='gsheet';sh.hidden=true;
 sh.innerHTML='<div class="gsh">Фильтры <button type="button" class="x gdone" aria-label="Закрыть">×</button></div>';
 const sels=[...f.querySelectorAll('select')].filter(x=>x.id!='gs');sels.forEach(x=>sh.appendChild(x));const done=document.createElement('button');done.type='button';done.className='md-button md-button--primary gdone';done.textContent='Показать';sh.appendChild(done);
 const top=document.createElement('div');top.className='gtop';if(q)top.appendChild(q);const bt=document.createElement('button');bt.type='button';bt.className='gfbtn';top.appendChild(bt);const so=document.getElementById('gs');if(so)top.appendChild(so);
 const act=document.createElement('div');act.className='gactive';const gc=document.getElementById('gc');if(gc)gc.className='gcount';
 f.prepend(top);f.appendChild(sh);f.appendChild(act);const gv=document.getElementById('gview');if(gv)f.appendChild(gv);if(gc)f.appendChild(gc);
 let bg=null;const close=()=>{sh.hidden=true;if(bg){bg.remove();bg=null;}};const open=()=>{sh.hidden=false;bg=document.createElement('div');bg.className='sheet-bg';bg.onclick=close;document.body.appendChild(bg);};
 bt.onclick=open;sh.querySelectorAll('.gdone').forEach(b=>b.onclick=close);
 const upd=()=>{const on=sels.filter(x=>x.value);bt.innerHTML='⚙️ Фильтры'+(on.length?' <b>'+on.length+'</b>':'');act.innerHTML=on.map(x=>`<button type="button" data-id="${x.id}">${esc(x.options[x.selectedIndex].text)} ✕</button>`).join('');
  act.querySelectorAll('button').forEach(b=>b.onclick=()=>{const x=document.getElementById(b.dataset.id);x.value='';x.dispatchEvent(new Event('change',{bubbles:true}));upd();});};
 f.addEventListener('change',upd);upd();}
/* ---------- passives index filter ---------- */
function psvFilter(){if(!/\/passivki\/$/.test(location.pathname))return;const art=document.querySelector('article');const i=document.createElement('input');i.type='search';i.placeholder='Найти пассивку…';i.className='psvq';art.querySelector('h1').after(i);
 i.oninput=()=>{const q=window.PW_core?window.PW_core.norm(i.value):i.value.toLowerCase();art.querySelectorAll('a.psv').forEach(a=>a.style.display=!q||a.textContent.toLowerCase().replace(/ё/g,'е').includes(q)?'':'none');};}
/* ---------- PWA install ---------- */
let deferred=null;addEventListener('beforeinstallprompt',e=>{e.cancelable&&e.preventDefault();deferred=e;showInstall();});
function showInstall(){if(document.querySelector('.inst')||matchMedia('(display-mode: standalone)').matches||LS.get('pw_noinst',false))return;const ios=/iphone|ipad/i.test(navigator.userAgent);if(!deferred&&!ios)return;
 /* 21.10 live hotfix: banner never floats over content (it covered the mini-map/text on iPhone): shown only on the home page, inline at the end of the article */const _art=document.querySelector('.md-content__inner');if(!document.getElementById('home-q')||!_art)return;
 const d=document.createElement('div');d.className='inst';d.innerHTML=`<span>📲 Установи энциклопедию как приложение — работает и без интернета.</span>${deferred?'<button class="md-button md-button--primary" data-i>Установить</button>':'<small>В Safari: «Поделиться» → «На экран Домой»</small>'}<button class="x" aria-label="Закрыть">×</button>`;d.classList.add('inl');_art.appendChild(d);
 d.querySelector('.x').onclick=()=>{LS.set('pw_noinst',true);d.remove();};const bt=d.querySelector('[data-i]');if(bt)bt.onclick=async()=>{deferred.prompt();await deferred.userChoice;d.remove();};}
window.PW_showInstall=()=>{LS.set('pw_noinst',false);const ios=true;deferred=deferred||null;const d=document.querySelector('.inst');if(d)d.remove();if(!deferred){const x=document.createElement('div');x.className='inst';x.innerHTML='<span>📲 Установи энциклопедию как приложение — работает и без интернета.</span><small>Chrome: меню ⋮ → «Установить приложение». Safari: «Поделиться» → «На экран Домой».</small><button class="x">×</button>';document.body.appendChild(x);x.querySelector('.x').onclick=()=>x.remove();}else showInstall();};
/* ---------- map pal filter ---------- */
function mapPal(D){const M=window.PW_map;const s=document.getElementById('mapq');if(!M||!s||s.dataset.on)return;s.dataset.on=1;const C=window.PW_core,N=C.norm;
 const box=s.parentElement,dd=box.querySelector('.msd'),cnt=box.querySelector('.mcnt'),x=box.querySelector('.msx');
 const byRu=Object.fromEntries(D.pals.map(p=>[p.ru,p]));const TL={alpha:'альфа',travel:'телепорт',tower:'башня',sealed:'запеч. земли'};
 const EL={'огн':'Огонь','вод':'Вода','трав':'Трава','молн':'Молния','элект':'Молния','лед':'Лёд','лёд':'Лёд','земл':'Земля','тьм':'Тьма','темн':'Тьма','драк':'Дракон','нейтр':'Нейтральный'};
 const pal=p=>p.t=='alpha'?p.name:p.t=='sealed'?(p.info.split('· ')[1]||''):'';
 const twBoss=p=>D.bosses.find(b=>b.place&&N(b.place)==N(p.name));
 const d2=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
 const fixq=q=>{const f=C.fixLayout?C.fixLayout(q.toLowerCase()):null;const n=N(q);return f&&f[1]?[N(f[0]),n]:[n,null];};
 function search(q){let [n,alt]=fixq(q);n=n.replace(/^(где|как)\s+(найти|найт|искать|поймать|взять)\s+/,'').replace(/^(где|найти)\s+/,'').trim();const R=[];
  const near=n.match(/^(телепорт|статуя|статую|тп)\s+(рядом с|возле|у|около)\s+(.+)$/);
  if(near){const t=search(near[3]).filter(r=>r.pts.length)[0];if(t){const c=t.pts[0];const tr=M.all.filter(([p])=>p.t=='travel').sort((a,b)=>d2(a[0],c)-d2(b[0],c)).slice(0,3);return [{lbl:'Телепорты рядом с '+t.lbl,ic:'🗿',ty:'ближайшие',pts:tr.map(z=>z[0])}];}}
  if(/^(башн|босс)/.test(n)){const e=Object.keys(EL).find(k=>n.includes(k));const tw=M.all.filter(([p])=>p.t=='tower').map(z=>z[0]).filter(p=>{if(!e)return true;const b=twBoss(p);return b&&(b.el||[]).includes(EL[e]);});
   if(tw.length)R.push({lbl:e?'Босс-башни: '+EL[e]:'Все башни',ic:'🏯',ty:'башни',pts:tw});}
  if(/^(телепорт|статуи|статуя|тп)$/.test(n))R.push({lbl:'Все телепорты',ic:'🗿',ty:'телепорты',pts:M.all.filter(([p])=>p.t=='travel').map(z=>z[0])});
  if(/^альф/.test(n))R.push({lbl:'Все альфы',ic:'👑',ty:'альфы',pts:M.all.filter(([p])=>p.t=='alpha').map(z=>z[0])});
  const terms=[n,alt].filter(Boolean);const hit=f=>terms.some(t=>t.length>1&&N(f).includes(t));
  const pm=C.find(n,['pal'])||(alt?C.find(alt,['pal']):null);const pn=pm?D.pals[pm.ref].ru:null;const groups=new Map();
  M.all.forEach(([p])=>{const pp=pal(p);const b=p.t=='tower'?twBoss(p):null;if(hit(p.name)||hit(pp)||(pn&&pp==pn)||(b&&(hit(b.name)||hit(b.pal||'')))){const k=pp||p.name;const g=groups.get(k)||{lbl:k,ic:byRu[pp]?'':'📍',img:byRu[pp]?B+byRu[pp].thumb:'',ty:new Set(),pts:[]};g.ty.add(TL[p.t]);g.pts.push(p);groups.set(k,g);}});
  groups.forEach(g=>R.push({...g,ty:[...g.ty].join(' · ')}));
  const seen=new Set(R.map(r=>r.lbl));const hv=p=>p.hab&&(p.hab.d||p.hab.n||p.hab.t||p.hab.a);
  D.pals.filter(p=>p.url&&!seen.has(p.ru)&&terms.some(t=>N(p.ru).startsWith(t)||N(p.en||'').startsWith(t)||(t.length>2&&N(p.ru).includes(t)))).sort((a,b)=>(hv(b)?1:0)-(hv(a)?1:0)||a.ru.localeCompare(b.ru,'ru')).slice(0,8).forEach(p=>{seen.add(p.ru);R.push({lbl:p.ru,img:B+p.thumb,ty:hv(p)?'где живёт · '+((p.hab.d||0)+(p.hab.t||0))+' точек':'в дикой природе нет — страница пала',pts:[],url:p.url})});
  if(pn&&!seen.has(pn))R.push({lbl:pn,img:B+byRu[pn].thumb,ty:'на карте нет точек — смотри страницу пала',pts:[],url:byRu[pn].url});
  const st=r=>terms.some(t=>N(r.lbl).startsWith(t))?0:1;R.sort((a,b)=>st(a)-st(b));
  return R.slice(0,12);}
 const show=pts=>{const set=new Set(pts);M.all.forEach(([p,mk])=>{mk.setOpacity(!pts||set.has(p)?1:.18);mk.setZIndexOffset(pts&&set.has(p)?1000:0);});
  if(pts){Object.values(M.groups).forEach(g=>M.m.addLayer(g));cnt.hidden=false;cnt.textContent='найдено '+pts.length;x.hidden=false;
   const mks=M.all.filter(([p])=>set.has(p)).map(z=>z[1]);if(mks.length==1){const g=Object.values(M.groups).find(g=>g.hasLayer&&g.hasLayer(mks[0]));if(g&&g.zoomToShowLayer)g.zoomToShowLayer(mks[0],()=>mks[0].openPopup());else{M.m.flyTo(mks[0].getLatLng(),4);mks[0].openPopup();}}
   else if(mks.length)M.m.flyToBounds(L.latLngBounds(mks.map(k=>k.getLatLng())).pad(.3),{maxZoom:4});}
  else{cnt.hidden=true;x.hidden=true;}};
 let cur=[];const pick=r=>{dd.hidden=true;s.value=r.lbl;s.blur();if(!r.pts.length){const pp=(typeof byRu!='undefined')&&byRu[r.lbl];const h=pp&&pp.hab;if(h&&(h.d||h.n||h.t||h.a)&&new URLSearchParams(location.search).get('pal')!=pp.id){location.search='?pal='+encodeURIComponent(pp.id);return;}}if(r.url&&!r.pts.length){location.href=B+r.url;return;}show(r.pts);};
 s.addEventListener('input',()=>{const v=s.value.trim();x.hidden=!v;if(v.length<2){dd.hidden=true;if(!v)show(null);return;}cur=search(v);
  dd.innerHTML=cur.map((r,i)=>`<button type="button" data-i="${i}">${r.img?`<img src="${r.img}" width="28" height="28" alt="">`:`<span class="ic">${r.ic}</span>`}<span class="t">${esc(r.lbl)}<small>${esc(r.ty)}${r.pts.length?' · '+r.pts.length:''}</small></span></button>`).join('')||'<div class="none">Ничего не нашлось</div>';dd.hidden=false;});
 dd.addEventListener('click',e=>{const b=e.target.closest('button');if(b)pick(cur[+b.dataset.i]);});
 s.addEventListener('keydown',e=>{if(e.key=='Enter'&&cur[0]){e.cancelable&&e.preventDefault();pick(cur[0]);s.blur();}if(e.key=='Escape')dd.hidden=true;});
 x.onclick=()=>{s.value='';dd.hidden=true;show(null);s.focus();};document.addEventListener('click',e=>{if(!box.contains(e.target))dd.hidden=true;});
 const u=new URLSearchParams(location.search).get('q');if(u){s.value=u;s.dispatchEvent(new Event('input'));if(cur[0])pick(cur[0]);}
 // world switch
 const sw=document.querySelector('.mapsw'),wt=document.getElementById('wtree'),pm=document.getElementById('pwmap');if(sw)sw.querySelectorAll('button').forEach(b=>b.onclick=()=>{sw.querySelectorAll('button').forEach(z=>z.classList.toggle('on',z===b));const t=b.dataset.w=='t';wt.hidden=!t;pm.hidden=t;box.hidden=t;if(!t)M.m.invalidateSize();
  if(t&&window.PW_tree){const T=window.PW_tree();T&&setTimeout(()=>T.m.invalidateSize(),60)}});
 if(location.hash=='#tree'&&sw)sw.querySelector('[data-w=t]').click();}
/* ---------- popular ---------- */
function popular(D){const el=document.getElementById('potd');if(!el||!D.popular||!D.popular.length||document.getElementById('pop'))return;const by=Object.fromEntries(D.pals.map(p=>[p.id,p]));
 el.parentElement.insertAdjacentHTML('beforeend',`<h2>🔥 Чаще всего спрашивают у бота</h2><div id="pop" class="mini-row">${D.popular.map(([i])=>by[i]).filter(p=>p&&p.url).map(p=>`<a class="mc card-link" href="${B+p.url}"><img src="${B+p.thumb}" width="56" height="56" alt=""><span>${esc(p.ru)}</span></a>`).join('')}</div>`);}
/* ---------- BUILDER ---------- */
const STAT_RE=[[/\bAttack\s*([+-])\s*(\d+)\s*%/i,'atk'],[/\bDefense\s*([+-])\s*(\d+)\s*%/i,'def'],[/\bWork Speed\s*([+-])\s*(\d+)\s*%/i,'ws'],[/Max Health\s*([+-])\s*(\d+)\s*%/i,'hp']];
function effects(q){const o={atk:0,def:0,ws:0,hp:0};let rest=q.de||'';for(const [r,k] of STAT_RE){const m=rest.match(r);if(m){o[k]+=(m[1]=='-'?-1:1)*+m[2];}}return o;}
function statsH(s,b0){const d=(a,b)=>{const x=a-b;return x?`<em class="${x>0?'up':'dn'}">${x>0?'+':''}${x}</em>`:''};return `<div class="bstats"><div><span>❤️ HP</span><b>${s.hp}</b>${d(s.hp,b0.hp)}</div><div><span>⚔️ Атака</span><b>${s.atk}</b>${d(s.atk,b0.atk)}</div><div><span>🛡 Защита</span><b>${s.def}</b>${d(s.def,b0.def)}</div><div><span>⚙️ Работа</span><b>${s.ws}%</b>${d(s.ws,b0.ws)}</div></div>`;}
function stats(p,st,lv,iv,ps,D,stt){const c=1+.05*st,i=1+iv/100,su=1+(stt||0)/100;let e={atk:0,def:0,ws:0,hp:0};ps.forEach(j=>{const x=effects(D.QI[j]);for(const k in e)e[k]+=x[k];});
 const hp=(500+5*lv+p.hp*.5*lv*i)*c*su*(1+e.hp/100),atk=(100+p.atk*.075*lv*i)*c*su*(1+e.atk/100),df=(50+p.def*.075*lv*i)*c*su*(1+e.def/100);return {hp:Math.floor(hp),atk:Math.floor(atk),def:Math.floor(df),ws:Math.round(100*c*(1+e.ws/100)),e};}
function builder(D){const info=document.querySelector('.pal-info[data-pal]');if(!info||document.getElementById('bld'))return;const p=D.pals.find(x=>x.id==info.dataset.pal);if(!p)return;
 const box=document.createElement('section');box.id='bld';box.className='bld';
 const tabs=document.querySelector('.tabbed-set');(tabs||info.closest('.pal-hero')).after(box);
 let st=0,lv=50,iv=0,ps=[],stt=0;const h=new URLSearchParams(location.hash.slice(1)).get('b');
 if(h&&h.length>=6){st=+h[2]||0;lv=parseInt(h.slice(3,5),36)||50;const ivc=h[5];iv=ivc=='a'?30:(+ivc||0)*3;for(let k=6;k+1<h.length+1&&ps.length<4;k+=2){const j=parseInt(h.slice(k,k+2),36);if(!isNaN(j)&&D.QI[j])ps.push(j);}}
 const P=D.QI,PL=D.passives;const rc=r=>r<0?'r-neg':'r-'+Math.min(5,r||1);
 const code=()=>b36(p.i,2)+st+b36(lv,2)+(iv>=30?'a':String(Math.round(iv/3)))+ps.map(j=>b36(j,2)).join('');
 const roles=Object.keys(p.bp||{});const base=stats(p,0,lv,iv,[],D);
 const draw=()=>{const s=stats(p,st,lv,iv,ps,D,stt),b0=stats(p,st,lv,iv,[],D,stt);
  const d=(a,b)=>{const x=a-b;return x?`<em class="${x>0?'up':'dn'}">${x>0?'+':''}${x}</em>`:''};
  
  const other=ps.map(j=>P[j]).filter(q=>{const e=effects(q);return !(e.atk||e.def||e.ws||e.hp)||/[A-Za-zА-Яа-я]/.test((q.de||'').replace(/(Attack|Defense|Work Speed|Max Health)\s*[+-]\s*\d+\s*%|\(ToSelf\)/gi,'').replace(/[\d%+.,\s-]/g,''));});
  box.innerHTML=`<h2>🛠 Сборка</h2>
  <div class="bld-row"><span class="lbl">Звёзды</span><div class="stars">${[0,1,2,3,4].map(k=>`<button data-st="${k}" class="${k<=st&&k>0?'on':''} ${k==0?'zero':''}" aria-label="${k} звёзд">${k==0?'0':'★'}</button>`).join('')}</div><small>+${st*5}% к HP, атаке, защите и скорости работы</small></div>
  <div class="bld-row"><span class="lbl">Уровень <b class="v" data-for="blv">${lv}</b></span><div class="rng"><button type="button" class="stp" data-s="blv" data-d="-1" aria-label="Меньше">−</button><input type="range" min="1" max="80" step="1" value="${lv}" id="blv" aria-label="Уровень"><button type="button" class="stp" data-s="blv" data-d="1" aria-label="Больше">+</button></div></div>
  <div class="bld-row"><span class="lbl">Таланты <b class="v" data-for="biv">+${iv}%</b></span><div class="rng"><button type="button" class="stp" data-s="biv" data-d="-3" aria-label="Меньше">−</button><input type="range" min="0" max="30" step="3" value="${iv}" id="biv" aria-label="Таланты"><button type="button" class="stp" data-s="biv" data-d="3" aria-label="Больше">+</button></div></div>
  <div class="bld-row"><span class="lbl">Статуя силы <b class="v" data-for="bstt">+${stt}%</b></span><div class="rng"><button type="button" class="stp" data-s="bstt" data-d="-3" aria-label="Меньше">−</button><input type="range" min="0" max="60" step="3" value="${stt}" id="bstt" aria-label="Статуя силы"><button type="button" class="stp" data-s="bstt" data-d="3" aria-label="Больше">+</button></div></div>
  ${statsH(s,b0)}
  <div class="bld-row"><span class="lbl">Пассивки (${ps.length}/4)</span><div class="tags">${ps.map((j,k)=>`<span class="psv ${rc(P[j].rank)}">${esc(P[j].name)} <button class="rmp" data-k="${k}" aria-label="Убрать">×</button></span>`).join('')}${ps.length<4?'<button type="button" id="bq" class="addp">+ добавить пассивку</button>':''}</div></div>
  ${roles.length?`<div class="bld-row"><span class="lbl">Готовая сборка</span>${roles.map(r=>`<button class="fav" data-role="${r}">${r=='боец'?'⚔️':r=='рабочий'?'🛠':'🐎'} ${r}</button>`).join('')}</div>`:''}
  ${other.length?`<div class="bnote"><b>Другие эффекты:</b><ul>${other.map(q=>`<li>${esc(q.name)}: ${esc(q.desc)}</li>`).join('')}</ul></div>`:''}
  ${ps.length?`<div class="bnote"><b>Как получить эти пассивки:</b><ul>${ps.map(j=>{const q=P[j];const w=[];if(q.nat&&q.nat.length)w.push('с рождения у '+q.nat.slice(0,4).join(', '));if(q.breed)w.push('разведением от родителя с ней');if(q.how=='gold')w.push('операционный стол — '+String(q.gold).replace(/\B(?=(\d{3})+$)/g,' ')+' золота');if(q.how=='disposable')w.push('имплант из Древних реликвий');return `<li><b>${esc(q.name)}</b>: ${w.join('; ')||'—'}</li>`;}).join('')}</ul></div>`:''}
  ${cmpRoles(p,ps,P)}
  ${vsBoss(p,s,D)}
  <div class="bld-row"><button class="md-button md-button--primary" id="bsave">💾 Сохранить</button><button class="md-button" id="bshare">🔗 Ссылка</button><a class="md-button" href="https://t.me/PalGuideBot?start=build_${code()}" target="_blank" rel="noopener">🤖 Открыть в боте</a></div>
  <p class="approx">Цифры с пассивками примерные</p>`;
  box.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{st=+b.dataset.st;draw();});
  const V={blv:[v=>lv=v,()=>lv,''],biv:[v=>iv=v,()=>iv,'+','%'],bstt:[v=>stt=v,()=>stt,'+','%']};
  const upd=()=>{const s2=stats(p,st,lv,iv,ps,D,stt),b2=stats(p,st,lv,iv,[],D,stt);box.querySelector('.bstats').outerHTML=statsH(s2,b2);for(const k in V){const e=box.querySelector('[data-for='+k+']');e.textContent=(V[k][2]||'')+V[k][1]()+(V[k][3]||'');}history.replaceState(null,'','#b='+code());};
  for(const k in V){const r=box.querySelector('#'+k);r.addEventListener('input',()=>{V[k][0](+r.value);upd();});r.addEventListener('change',()=>{V[k][0](+r.value);draw();});}
  box.querySelectorAll('.stp').forEach(b=>b.onclick=()=>{const r=box.querySelector('#'+b.dataset.s);r.value=Math.min(+r.max,Math.max(+r.min,+r.value+ +b.dataset.d));V[b.dataset.s][0](+r.value);draw();});
  box.querySelectorAll('.v').forEach(e=>e.onclick=()=>{const k=e.dataset.for,r=box.querySelector('#'+k);const n=prompt('Введите значение ('+r.min+'–'+r.max+')',r.value);if(n==null||isNaN(+n))return;V[k][0](Math.min(+r.max,Math.max(+r.min,Math.round(+n))));draw();});
  box.querySelectorAll('.rmp').forEach(b=>b.onclick=()=>{ps.splice(+b.dataset.k,1);draw();});
  box.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{ps=(p.bp[b.dataset.role]||[]).map(n=>(PL.find(q=>q.name==n)||{}).i).filter(j=>j!=null).slice(0,4);draw();});
  const q=box.querySelector('#bq');if(q)q.onclick=()=>picker(p,P,PL,ps,j=>{if(ps.length<4&&!ps.includes(j))ps.push(j);draw();});
  box.querySelector('#bsave').onclick=()=>{const S=LS.get('pw_builds',[]);S.unshift({p:p.i,st,lv,iv,ps,code:code()});LS.set('pw_builds',S.slice(0,30));box.querySelector('#bsave').textContent='✅ Сохранено в «Мои списки»';};
  box.querySelector('#bshare').onclick=async()=>{const u=location.origin+location.pathname+'#b='+code();try{if(navigator.share)await navigator.share({title:p.ru+' — сборка',url:u});else{await navigator.clipboard.writeText(u);box.querySelector('#bshare').textContent='✅ Скопировано';}}catch(e){}};
  history.replaceState(null,'','#b='+code());};
 draw();}
function picker(p,P,PL,ps,add){document.querySelectorAll('.pk,.sheet-bg').forEach(e=>e.remove());const rc=r=>r<0?'r-neg':'r-'+Math.min(5,r||1);
 const bg=document.createElement('div');bg.className='sheet-bg';const sh=document.createElement('div');sh.className='pk';sh.setAttribute('role','dialog');
 const close=()=>{bg.remove();sh.remove();document.body.style.overflow='';};bg.onclick=close;
 const item=q=>{const dis=ps.includes(q.i);return `<button type="button" class="pki" data-j="${q.i}" ${dis?'disabled':''}><span class="psv ${rc(q.rank)}">${esc(q.name)}</span><small>${esc(dis?'уже выбрана':(q.desc||'').slice(0,90))}</small></button>`;};
 const RI={'боец':'⚔️','рабочий':'🛠','ездовой':'🐎'};const all=PL.slice().sort((a,b)=>(b.rank||0)-(a.rank||0)||a.name.localeCompare(b.name,'ru'));
 const body=v=>{const n=window.PW_core.norm(v);if(n)return all.filter(q=>window.PW_core.norm(q.name+' '+q.en+' '+q.desc).includes(n)).map(item).join('')||'<p>Не найдено</p>';
  const rec=Object.entries(p.bp||{}).map(([r,v])=>{const qs=v.map(nm=>PL.find(q=>q.name==nm)).filter(Boolean);return qs.length?`<div class="pkh">${RI[r]||'⭐'} ${esc(r)}</div>`+qs.map(item).join(''):'';}).join('');
  return (rec?`<div class="pkt">Рекомендуемые для ${esc(p.ru)}</div>`+rec:'')+'<div class="pkt">Все пассивки</div>'+all.map(item).join('');};
 sh.innerHTML=`<div class="pkg"></div><div class="pkhd"><input type="search" placeholder="Найти пассивку…" autocomplete="off" enterkeyhint="search"><button type="button" class="x" aria-label="Закрыть">×</button></div><div class="pkl">${body('')}</div>`;
 document.body.append(bg,sh);document.body.style.overflow='hidden';sh.querySelector('.x').onclick=close;
 const L=sh.querySelector('.pkl');sh.querySelector('input').oninput=e=>{L.innerHTML=body(e.target.value);L.scrollTop=0;};
 L.addEventListener('click',e=>{const t=e.target.closest('.pki');if(!t||t.disabled)return;close();add(+t.dataset.j);});
 let y0=null;sh.querySelector('.pkg').addEventListener('touchstart',e=>y0=e.touches[0].clientY,{passive:true});sh.querySelector('.pkg').addEventListener('touchend',e=>{if(y0!=null&&e.changedTouches[0].clientY-y0>60)close();y0=null;});}
function cmpRoles(p,ps,P){const roles=Object.entries(p.bp||{});if(!roles.length||!ps.length)return '';const mine=new Set(ps.map(j=>P[j].name));
 return `<div class="bnote"><b>Сравнение с типовыми сборками:</b><ul>${roles.map(([r,v])=>{const hit=v.filter(n=>mine.has(n)).length;return `<li>${r}: совпадает ${hit} из ${v.length}${hit<v.length?' — не хватает: '+v.filter(n=>!mine.has(n)).join(', '):' ✅'}</li>`;}).join('')}</ul></div>`;}
function vsBoss(p,s,D){const bs=D.bosses.filter(b=>b.weak&&b.weak.length&&b.level);if(!bs.length)return '';const byRu=Object.fromEntries(D.pals.map(x=>[x.ru,x]));
 const grp=a=>{const m=new Map();a.forEach(b=>{const n=b.name.replace(/\s*\(.*?\)/g,'').trim();const md=(b.name.match(/\((.*?)\)/)||[])[1];const g=m.get(n)||{n,pal:b.pal,url:b.url,md:new Set()};if(md)g.md.add(md);m.set(n,g);});return [...m.values()];};
 const ch=(g,c)=>{const pp=byRu[g.pal];return `<a class="bchip ${c}" ${g.url?`href="${B+g.url}"`:''}>${pp?`<img src="${B+pp.thumb}" width="22" height="22" alt="">`:''}<span>${esc(g.n)}</span>${g.md.size?`<small>${[...g.md].map(esc).join(' · ')}</small>`:''}</a>`;};
 const sc=b=>{let v=0;if(b.weak.some(w=>p.el.includes(w)))v++;if((b.el||[]).some(e=>p.weak.includes(e)))v--;return v;};const both=b=>b.weak.some(w=>p.el.includes(w))&&(b.el||[]).some(e=>p.weak.includes(e));
 const good=grp(bs.filter(b=>sc(b)>0)),bad=grp(bs.filter(b=>sc(b)<0)),mix=grp(bs.filter(both));const MX=new Set(mix.map(g=>g.n));const _g=good.filter(g=>!MX.has(g.n)),_b=bad.filter(g=>!MX.has(g.n));good.length=0;good.push(..._g);bad.length=0;bad.push(..._b);
 return `<div class="bnote"><b>Против боссов</b><button class="hlp" data-h="vsboss">?</button>${good.length?`<div class="bl">✅ Бьёт по слабости</div><div class="bchips">${good.map(g=>ch(g,'ok')).join('')}</div>`:''}${bad.length?`<div class="bl">⚠️ Опасно</div><div class="bchips">${bad.map(g=>ch(g,'bad')).join('')}</div>`:''}${mix.length?`<div class="bl">⚖️ Смешанно</div><div class="bchips">${mix.map(g=>ch(g,'mix').replace('<a ','<a title="Пал бьёт по слабости босса, но и босс бьёт по слабости пала" ')).join('')}</div>`:''}${!good.length&&!bad.length&&!mix.length?'<div>Нейтрален против всех боссов.</div>':''}</div>`;}
const fix=D=>{if(D._f)return D;D._f=1;D.QI={};D.passives.forEach(q=>D.QI[q.i]=q);D.PI={};D.pals.forEach(q=>D.PI[q.i]=q);return D;};
document.addEventListener('DOMContentLoaded',()=>{psvFilter();setTimeout(showInstall,4000);if(!window.PW_data)return;window.PW_data().then(D=>{fix(D);breedPage(D);myPage(D);palLists(D);galleryExtra(D);popular(D);builder(D);setTimeout(()=>mapPal(D),300);});});
})();
(function(){const set=v=>{document.documentElement.classList.toggle('drawer-open',v);};document.addEventListener('change',e=>{if(e.target&&e.target.id=='__drawer')set(e.target.checked);});document.addEventListener('DOMContentLoaded',()=>{const d=document.getElementById('__drawer');if(d)setInterval(()=>set(d.checked),200);});})();
(function(){document.addEventListener('DOMContentLoaded',()=>{const f=document.getElementById('bfl');if(!f)return;const _qv=v=>{v=(v||'').trim();const C=window.PW_core;if(!v)return [];if(!C||!C.norm)return [v.toLowerCase().replace(/ё/g,'е')];const n=C.norm(v);let f=null;try{f=C.fixLayout&&C.fixLayout(v.toLowerCase())}catch(e){}return f&&f[1]?[n,C.norm(f[0])]:[n]};const run=()=>{const qs=_qv(document.getElementById('bq2').value),k=document.getElementById('bk').value,e=document.getElementById('be').value,l=document.getElementById('bl').value;let n=0;
 document.querySelectorAll('.bgal .bc').forEach(a=>{const dn=a.dataset.n.toLowerCase().replace(/ё/g,'е');let ok=(!qs.length||qs.some(q=>dn.includes(q)||(window.PW_core&&window.PW_core.norm(dn).includes(q))))&&(!k||a.dataset.k==k)&&(!e||a.dataset.el.includes(e));if(ok&&l){const [lo,hi]=l.split('-').map(Number);const v=+a.dataset.lv;ok=v>=lo&&v<=hi;}a.style.display=ok?'':'none';n+=ok;});document.getElementById('bcnt').textContent='найдено '+n;};
 f.addEventListener('input',run);f.addEventListener('change',run);run();});})();

(function(){const H={boss:'Тип босса: башня, рейд, альфа или босс Мирового древа.',counter:'Палы, чья стихия бьёт по слабости босса: их атаки наносят больше урона.',vsboss:'Сравнение стихий пала и босса. Зелёные — пал бьёт по слабости, красные — босс бьёт по слабости пала, жёлтые — и то и другое.'};
let pop=null;const close=()=>{if(pop){pop.remove();pop=null;}};
const open=b=>{close();const t=b.dataset.tip||H[b.dataset.h]||b.title;if(!t)return;pop=document.createElement('div');pop.className='hlp-pop';pop.setAttribute('role','tooltip');pop.textContent=t;document.body.appendChild(pop);const r=b.getBoundingClientRect();pop.style.left=Math.max(8,Math.min(r.left-20,innerWidth-pop.offsetWidth-8))+'px';pop.style.top=(r.bottom+8+pop.offsetHeight>innerHeight?r.top-pop.offsetHeight-8:r.bottom+8)+'px';};
document.addEventListener('click',e=>{const b=e.target.closest('.hlp,.gl');if(b){e.cancelable&&e.preventDefault();e.stopPropagation();if(pop&&pop._b===b&&pop._pin)close();else{if(!(pop&&pop._b===b))open(b);if(pop){pop._b=b;pop._pin=true;}}return;}if(pop&&e.target.closest&&pop.contains&&pop.contains(e.target))return;close();},true);
document.addEventListener('keydown',e=>{if(e.key=='Escape')close();});
document.addEventListener('mouseover',e=>{const b=e.target.closest&&e.target.closest('.hlp,.gl');if(b&&matchMedia('(hover:hover)').matches&&!(pop&&pop._pin)){open(b);pop&&(pop._b=b,pop._pin=false);}});
document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('.hlp,.gl')&&matchMedia('(hover:hover)').matches&&!(pop&&pop._pin))close();});addEventListener('scroll',close,{passive:true});})();
(function(){document.addEventListener('DOMContentLoaded',()=>{const pn=document.querySelector('.pn');if(!pn)return;const as=[...pn.querySelectorAll('a')];const prev=as.find(a=>a.textContent.trim().startsWith('←')),next=as.find(a=>a.textContent.trim().endsWith('→'));
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 // prefetch + speculation rules + decode neighbour card image
 const urls=[prev,next].filter(Boolean).map(a=>a.href.split('#')[0]);
 if(HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules')){const sr=document.createElement('script');sr.type='speculationrules';sr.textContent=JSON.stringify({prerender:[{source:'list',urls}]});document.head.appendChild(sr);}
 else urls.forEach(u=>{const l=document.createElement('link');l.rel='prefetch';l.href=u;document.head.appendChild(l);});
 /* WebKit reports aborted in-flight fetches as 'access control checks' errors on navigation: only warm up where requestIdleCallback exists, and abort on pagehide */const _ac=window.AbortController?new AbortController():null;addEventListener('pagehide',()=>_ac&&_ac.abort());addEventListener('beforeunload',()=>_ac&&_ac.abort());if(window.requestIdleCallback)requestIdleCallback(()=>urls.forEach(u=>fetch(u,{credentials:'same-origin',signal:_ac&&_ac.signal}).then(r=>r.text()).then(t=>{const m=t.match(/class="pal-card[^"]*" src="([^"]+)"/);if(m){const im=new Image();im.src=new URL(m[1],u).href;im.decode&&im.decode().catch(()=>{});}}).catch(()=>{})));
 const hero=document.querySelector('.pal-hero,.boss-hero,.psv-hero');const card=hero&&hero.querySelector('.pal-card,.bimg')||hero;
 const go=(a,dir)=>{if(!a)return;const u=a.href.split('#')[0];if(RM||!card){location.href=u;return;}card.style.transition='transform .18s ease-out,opacity .18s';card.style.transform=`translate3d(${dir*-110}%,0,0)`;card.style.opacity='0';setTimeout(()=>location.href=u,170);};
 if(hero){if(getComputedStyle(hero).position=='static')hero.style.position='relative';const eg=document.createElement('nav');eg.className='edges';eg.setAttribute('aria-label','Соседние страницы');[[prev,'l','‹'],[next,'r','›']].forEach(([a,c,t])=>{const b=document.createElement('a');if(!a){b.className='edge e'+c+' none';b.setAttribute('aria-hidden','true');eg.appendChild(b);return;}const nm=a.textContent.replace(/[←→]/g,'').trim();b.className='edge e'+c;b.href=a.href.split('#')[0];b.title=nm;b.innerHTML=c=='l'?`<span>${t}</span><small>${nm}</small>`:`<small>${nm}</small><span>${t}</span>`;b.onclick=e=>{e.cancelable&&e.preventDefault();go(a,c=='l'?-1:1);};eg.appendChild(b);});hero.after(eg);}
 const skip=e=>e.target.closest('#bld,.bld,.askmini,input,select,textarea,button,.leaflet-container,.md-typeset__table,.tabbed-labels,.mini-row,.bchips,#gtable,[data-noswipe],.pk,.sheet,.lbx,.habmap,.fcs,.wchips,.skf,.ctrs,.kvs,pre,code,.leaflet-container');
 if(hero&&card){const Z=document.querySelector('article.md-content__inner')||hero;let x0=null,y0=0,t0=0,dx=0,dir=0,raf=0,W=1;card.style.willChange='auto';
  const paint=()=>{raf=0;card.style.transform=`translate3d(${dx}px,0,0)`;};
  Z.addEventListener('touchstart',e=>{if(e.touches.length!=1||skip(e)){x0=null;return;}x0=e.touches[0].clientX;y0=e.touches[0].clientY;t0=performance.now();dx=0;dir=0;W=innerWidth;},{passive:true});
  Z.addEventListener('touchmove',e=>{if(x0==null)return;const t=e.touches[0],mx=t.clientX-x0,my=t.clientY-y0;if(!dir){if(Math.abs(mx)<8&&Math.abs(my)<8)return;dir=Math.abs(mx)>Math.abs(my)*1.5?1:-1;if(dir==1&&!RM){card.style.transition='none';card.style.willChange='transform';}}
   if(dir!=1||RM)return;dx=((mx<0&&!next)||(mx>0&&!prev))?mx*.25:mx;if(!raf)raf=requestAnimationFrame(paint);},{passive:true});
  const end=()=>{if(x0==null)return;x0=null;if(dir!=1)return;const v=Math.abs(dx)/(performance.now()-t0);const ok=Math.abs(dx)>60||v>.5;
   if(ok&&dx<0&&next){go(next,1);return;}if(ok&&dx>0&&prev){go(prev,-1);return;}
   if(!RM){card.style.transition='transform .2s ease-out';card.style.transform='translate3d(0,0,0)';setTimeout(()=>{card.style.willChange='auto';card.style.transition='';},220);}};
  Z.addEventListener('touchend',end,{passive:true});Z.addEventListener('touchcancel',end,{passive:true});
  window.PW_swipeSim=(dist)=>new Promise(res=>{const fr=[];let last=performance.now(),k=0;card.style.transition='none';card.style.willChange='transform';const step=()=>{const n=performance.now();fr.push(n-last);last=n;dx=-dist*(++k/30);card.style.transform=`translate3d(${dx}px,0,0)`;if(k<30)requestAnimationFrame(step);else{card.style.transform='';card.style.willChange='auto';res(fr.slice(1));}};requestAnimationFrame(step);});}
 document.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea,[contenteditable]')||e.metaKey||e.ctrlKey||e.altKey)return;const s=document.getElementById('__search');if((s&&s.checked)||document.querySelector('.sx'))return;if(e.key=='ArrowLeft')go(prev,-1);if(e.key=='ArrowRight')go(next,1);});});})();
;(function(){function w(){const ni=document.getElementById('nl'),nb=document.getElementById('nlb');if(!ni||!nb||ni.dataset.h)return;ni.dataset.h=1;
const h=document.createElement('div');h.className='nl-hint';h.hidden=true;ni.closest('.gal-filters').after(h);
ni.addEventListener('input',()=>{const v=ni.value.trim();h.hidden=!v;if(v){h.innerHTML='';const b=document.createElement('button');b.type='button';b.className='md-button';b.textContent='＋ Создать список «'+v.slice(0,40)+'»';b.onclick=()=>{nb.click();h.hidden=true};h.appendChild(b)}})}
if(document.readyState!='loading')w();else document.addEventListener('DOMContentLoaded',w);if(window.document$)document$.subscribe(()=>setTimeout(w,50))})();
