/* Умный поиск: раскладка, транслит, опечатки, намерения. Без бэкенда. */
(function(root){
const EN="qwertyuiop[]asdfghjkl;'zxcvbnm,.`",RU="йцукенгшщзхъфывапролджэячсмитьбюё";
const E2R={},R2E={};for(let i=0;i<EN.length;i++){E2R[EN[i]]=RU[i];R2E[RU[i]]=EN[i];}
const norm=s=>(s||'').toLowerCase().replace(/ё/g,'е').replace(/[«»"!?()\-–—:]/g,' ').replace(/\s+/g,' ').trim();
const END=/(ами|ями|ого|его|ому|ему|ой|ей|ом|ем|ах|ях|ов|ев|ам|ям|ую|юю|ая|яя|ые|ие|ый|ий|а|я|у|ю|ы|и|е|о|ь)$/;
const stem=w=>w.length>3?w.replace(END,''):w;
const TR={a:'а',b:'б',v:'в',g:'г',d:'д',e:'е',z:'з',i:'и',y:'и',k:'к',l:'л',m:'м',n:'н',o:'о',p:'п',r:'р',s:'с',t:'т',u:'у',f:'ф',h:'х',c:'к',w:'в',x:'кс',j:'дж',q:'к'};
const DG=[['sch','щ'],['sh','ш'],['ch','ч'],['zh','ж'],['ts','ц'],['ya','я'],['yu','ю'],['yo','е'],['kh','х'],['ph','ф']];
function translit(s){for(const[k,v]of DG)s=s.split(k).join(v);return [...s].map(c=>TR[c]||c).join('');}
function dl(a,b){const m=a.length,n=b.length;if(Math.abs(m-n)>3)return 9;const d=[];for(let i=0;i<=m;i++){d[i]=[i];}for(let j=0;j<=n;j++)d[0][j]=j;
 for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const c=a[i-1]==b[j-1]?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
 if(i>1&&j>1&&a[i-1]==b[j-2]&&a[i-2]==b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);}return d[m][n];}
const WORKS=[[/коп|добыв|добыч|шахт|руд|кам|min/, 'Добыча'],[/руб|дерев|древес|лесоруб|бревн/, 'Рубка деревьев'],[/разжиг|огн|плав|печ|костр|готов/, 'Разжигание огня'],
 [/полив|поли/, 'Полив'],[/посев|сажа|посад|семен/, 'Посев семян'],[/электр|энерг|генер|ток/, 'Генерация энергии'],[/ручн|крафт|ремесл|созда/, 'Ручная работа'],
 [/сбор|собир|урожа/, 'Сбор'],[/медиц|лекар|фарма|аптек/, 'Фармацевтика'],[/охлаж|холодил|морози/, 'Охлаждение'],[/транспорт|перенос|носи|таска/, 'Транспортировка'],[/ферм|пастб|ранч/, 'Фермерство']];
const ROLE=[[/бо[ейя]|бой|битв|рейд|босс|урон|атак|fight/, 'боец'],[/рабоч|работ|баз|work/, 'рабочий'],[/ездов|верх|маунт|скорост|mount/, 'ездовой']];
function Core(D){
 const K=[];// key, kind, ref
 const add=(k,kind,ref)=>{k=norm(k);if(k)K.push([k,kind,ref]);};
 D.pals.forEach((p,i)=>{add(p.ru,'pal',i);add(p.en,'pal',i);});
 for(const[s,t]of Object.entries(D.syn||{})){const i=D.pals.findIndex(p=>p.ru==t);if(i>=0)add(s,'pal',i);}
 D.bosses.forEach((b,i)=>{add(b.name.replace(/\(.*?\)/,''),'boss',i);b.name.split(/ и |\s*\(/)[0]&&add(b.name.split(/ и /)[0],'bossn',i);if(b.place)add(b.place,'boss',i);});
 D.items.forEach((t,i)=>{add(t.ru,'item',i);add(t.en,'item',i);});
 D.passives.forEach((t,i)=>{add(t.name,'passive',i);});
 const IS={'палладий':'Осколок палдиума','палдиум':'Осколок палдиума','паладий':'Осколок палдиума','древние детали':'Деталь древней цивилизации','древняя деталь':'Деталь древней цивилизации','чипы':'Технический чип'};
 for(const[s,t]of Object.entries(IS)){const i=D.items.findIndex(x=>x.ru==t);if(i>=0)add(s,'item',i);}
 const VOC=new Set();K.forEach(([k])=>k.split(' ').forEach(w=>VOC.add(w)));
 'как где кто что чем лучше лучший лучшие лучшая самый топ взять найти добыть получить вывести скрестить бить слабость пассивки пассивка для боец рабочий ездовой копает рубит босс башня пал палы зои серу сера быстро уровень качаться золото фармить почему грустят база'.split(' ').forEach(w=>VOC.add(w));
 D.faq.forEach(f=>norm(f.q).split(' ').forEach(w=>w.length>2&&VOC.add(w)));
 const VS=new Set([...VOC].map(stem));
 const known=w=>VOC.has(w)||VS.has(stem(w))||(w.length>=5&&[...VS].some(v=>v.length>=5&&v.startsWith(w.slice(0,5))));
 function fixLayout(q){let ch=false;const out=q.split(/(\s+)/).map(t=>{if(!t.trim())return t;
   const l=t.toLowerCase();
   if(/^[a-z\[\];',.`]+$/.test(l)){const c=[...l].map(x=>E2R[x]||x).join('').replace(/[.,]$/,'');const cw=norm(c);
     if(!known(l.replace(/\W/g,''))&&(known(cw)||nameHit(cw))){ch=true;return c;}}
   else if(/^[а-яё]+$/.test(l)){const c=[...l].map(x=>R2E[x]||x).join('');if(!known(norm(l))&&/^[a-z]+$/.test(c)&&known(c)){ch=true;return c;}}
   return t;}).join('');return [out,ch];}
 function nameHit(w){return w.length>=4&&K.some(([k])=>k==w||(Math.abs(k.length-w.length)<=2&&k[0]==w[0]&&dl(k,w)<=2));}
 function find(q,kinds){// best entity in query by n-grams
  const ws=norm(q).split(' ').filter(Boolean);let best=null;
  const variants=s=>{const v=[s];if(/[a-z]/.test(s))v.push(translit(s));v.push(s.replace(/(.)\1+/g,'$1'));v.push(s.split(' ').map(stem).join(' '));return [...new Set(v)];};
  for(let n=Math.min(4,ws.length);n>=1;n--)for(let i=0;i+n<=ws.length;i++){const g=ws.slice(i,i+n).join(' ');if(g.length<3)continue;
   for(const v of variants(g))for(const [k,kind,ref] of K){if(kinds&&!kinds.includes(kind))continue;
    let s=0;if(k==v)s=100;else if(stem(k)==stem(v)&&v.length>=4)s=95;else if(v.length>=5&&Math.abs(k.length-v.length)<=3){const d=dl(k,v);if(d==1)s=90;else if(d==2&&v.length>=6)s=82;else if(d==3&&v.length>=9)s=72;}
    else if(v.length>=5&&k.startsWith(v))s=78;
    if(s){s+=n*3;if(kind=='bossn')s-=4;if(!best||s>best.s)best={s,kind:kind=='bossn'?'boss':kind,ref,key:k,g};}}
   }
  return best;}
 function suggest(q,k=3){const v=norm(q);const r=[];for(const[key,kind,ref]of K){if(kind=='bossn')continue;const d=dl(key,v);if(d<=Math.max(2,v.length/3))r.push([d,kind,ref,key]);}
  r.sort((a,b)=>a[0]-b[0]);const seen=new Set();return r.filter(x=>{const id=x[1]+x[2];if(seen.has(id))return false;seen.add(id);return true;}).slice(0,k).map(x=>({kind:x[1],ref:x[2],name:label(x[1],x[2])}));}
 const label=(kind,ref)=>kind=='pal'?D.pals[ref].ru:kind=='item'?D.items[ref].ru:kind=='boss'?D.bosses[ref].name:D.passives[ref].name;
 function topWork(w,n=6){return D.pals.map(p=>[p,(p.work.find(x=>x[0]==w)||[0,0])[1]]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]||b[0].atk-a[0].atk).slice(0,n);}
 function topEl(e,n=5){return D.pals.filter(p=>p.el.includes(e)).sort((a,b)=>b.atk-a.atk).slice(0,n);}
 function breed(t){if(t.up)return {unique:t.up};const r=t.rank,pairs=[];const ps=D.pals.filter(p=>p.rank&&!p.up&&/^\d+$/.test(p.no));
  const ranks=ps.map(p=>p.rank).sort((a,b)=>a-b);
  for(let i=0;i<ps.length&&pairs.length<4;i+=7)for(const b of ps){const c=Math.floor((ps[i].rank+b.rank+1)/2);
   let nb=ps.reduce((m,p)=>Math.abs(p.rank-c)<Math.abs(m.rank-c)?p:m);if(nb===t&&ps[i]!==t&&b!==t&&!pairs.find(x=>x[0]==b||x[1]==b)){pairs.push([ps[i],b]);break;}}
  return {pairs};}
 function faq(q){const ws=norm(q).split(' ').filter(w=>w.length>2).map(stem);if(!ws.length)return null;let best=null;
  for(const f of D.faq){const fw=new Set(norm(f.q).split(' ').map(stem));let s=0;ws.forEach(w=>{if(fw.has(w))s+=1;else if([...fw].some(x=>x.length>4&&dl(x,w)<=1))s+=.7;});s=s/Math.sqrt(ws.length*Math.max(3,fw.size)/2);
   if(!best||s>best.s)best={s,f};}
  return best&&best.s>=.55?best.f:null;}
 function answer(raw){
  let [q,ch]=fixLayout(raw);const n=norm(q);const res={q,fixed:ch?q:null};
  if(n.length<2)return null;
  const has=r=>r.test(n);
  const ent=find(n);
  const role=(ROLE.find(([r])=>r.test(n))||[])[1];
  if(has(/пассив|passive|перк/)&&ent&&ent.kind=='pal'){const p=D.pals[ent.ref];return {...res,type:'passives',pal:p,role:role&&p.bp[role]?role:null};}
  if(has(/чем бить|слабост|слаб|против|контр|weak|убить|победить|пройти/)&&ent&&(ent.kind=='pal'||ent.kind=='boss'))return {...res,type:'weak',kind:ent.kind,e:ent.kind=='pal'?D.pals[ent.ref]:D.bosses[ent.ref]};
  if(has(/вывест|скрест|развед|размнож|breed|получ|завест|яйц/)&&ent&&ent.kind=='pal')return {...res,type:'breed',pal:D.pals[ent.ref],b:breed(D.pals[ent.ref])};
  if(has(/где|взять|найти|добыть|достать|фарм|получ|скрафт|крафт|купить/)&&ent&&ent.kind=='item')return {...res,type:'item',item:D.items[ent.ref]};
  const w=(WORKS.find(([r])=>n.split(' ').some(x=>r.test(x)))||[])[1];
  if(w&&(has(/лучш|топ|кто|сильн|best|какой|какие|самый/)||!ent))return {...res,type:'work',work:w,top:topWork(w)};
  if(has(/(лучш|быстр|самый|топ).*(ездов|маунт|летающ|скакун|верхов)|(ездов|маунт|летающ).*(лучш|быстр)/)){const fly=has(/лета/);return {...res,type:'mount',fly,top:D.pals.filter(p=>fly?p.mount=='fly':p.mount).sort((a,b)=>b.sprint-a.sprint).slice(0,6)};}
  if(has(/^(как|почему|зачем|сколько|что|можно|когда|какой|какая)(\s|$)/)&&n.split(' ').length>=3){const f0=faq(n);if(f0)return {...res,type:'faq',f:f0};}
  if(ent&&ent.s>=78&&!has(/^(как|почему|зачем|сколько|что делать)/)||ent&&ent.s>=95){const o={...res,type:ent.kind};o.e=ent.kind=='pal'?D.pals[ent.ref]:ent.kind=='item'?D.items[ent.ref]:ent.kind=='boss'?D.bosses[ent.ref]:D.passives[ent.ref];return o;}
  const f=faq(n);if(f)return {...res,type:'faq',f};
  if(ent&&ent.s>=72){const o={...res,type:ent.kind};o.e=ent.kind=='pal'?D.pals[ent.ref]:ent.kind=='item'?D.items[ent.ref]:ent.kind=='boss'?D.bosses[ent.ref]:D.passives[ent.ref];return o;}
  return {...res,type:'none',dym:suggest(n)};}
 return {answer,fixLayout,find,suggest,topWork,topEl,breed,norm,D};
}
root.SmartCore=Core;if(typeof module!=='undefined')module.exports=Core;
if(typeof document=='undefined')return;
/* ---------------- UI ---------------- */
const BASE=(document.currentScript&&document.currentScript.src||'').replace(/assets\/smart\.js.*$/,'');root.PW_BASE=BASE;
const EL={'Нейтральный':'neutral','Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon'};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const chip=e=>`<span class="el el-${EL[e]||'neutral'}">${esc(e)}</span>`;root.PW_chip=chip;
const pl=p=>p.url?`<a href="${BASE+p.url}">${esc(p.ru)}</a>`:esc(p.ru);
const lk=(u,t)=>u?`<a href="${BASE+u}">${esc(t)}</a>`:esc(t);
let core=null,loading=null;
const real=()=>loading||(loading=fetch(BASE+'assets/search_data.json').then(r=>r.json()).then(d=>{core=Core(d);root.PW_core=core;return d;}));
const NEED='#gallery,#potd,#cmp,#pwmap,#breed,#mylists,.pal-info,.boss-hero,#bygroup,#ask,#recent,#favs,#home-answer,.pgrid';
root.PW_load=()=>{if(root._pwGo)root._pwGo();return real();};
root.PW_data=()=>{if(loading||typeof document=='undefined'||document.querySelector(NEED))return real();return root._pend||(root._pend=new Promise(r=>{root._pwGo=()=>r(real());['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>setTimeout(root.PW_load,1500),{once:true,passive:true}));}));};
function render(a){if(!a)return '';let h='';const C=core.D;
 const fx=a.fixed?`<div class="dym">Понял как: «${esc(a.fixed)}»</div>`:'';
 const mini=p=>`<div class="mini">${p.thumb?`<img src="${BASE+p.thumb}" alt="" loading="lazy">`:''}<div><h3>${pl(p)} <small>#${esc(p.no)}</small></h3>${p.el.map(chip).join('')} <span>слабость: ${p.weak.map(chip).join('')}</span></div></div>`;
 switch(a.type){
 case 'pal':h=`<div class="sa-k">Пал</div>${mini(a.e)}<div>${a.e.work.map(w=>esc(w[0])+' '+w[1]).join(' · ')}</div><div>Партнёрский навык: <b>${esc(a.e.psk)}</b></div><div>❤️ ${a.e.hp} · ⚔️ ${a.e.atk} · 🛡 ${a.e.def}</div>`;break;
 case 'passives':{const p=a.pal;const roles=a.role?[a.role]:Object.keys(p.bp);h=`<div class="sa-k">Лучшие пассивки</div>${mini(p)}`+roles.map(r=>`<div><b>${r=='боец'?'⚔️ Боец':r=='рабочий'?'🛠 Рабочий':'🐎 Ездовой'}:</b> ${(p.bp[r]||[]).slice(0,4).map(esc).join(', ')}</div>`).join('')+(a.role?'':'<div class="dym">Уточни роль: «боец», «рабочий» или «ездовой».</div>');break;}
 case 'weak':{const e=a.e;h=`<div class="sa-k">Чем бить</div><h3>${a.kind=='pal'?pl(e):lk(e.url,e.name)}</h3>${e.el.map(chip).join('')} → бей стихией ${e.weak.map(chip).join('')}`;
  if(a.kind=='boss')h+=`<div>Уровень ${e.level||'?'} · HP ${e.hp||'?'}</div><div>Отряд: ${e.team.map(esc).join(', ')}</div>`;
  e.weak.forEach(w=>h+=`<div>Сильные палы (${esc(w)}): ${core.topEl(w).map(pl).join(', ')}</div>`);break;}
 case 'boss':{const e=a.e;h=`<div class="sa-k">Босс · ${esc(e.kind)}</div><h3>${lk(e.url,e.name)}</h3><div>${esc(e.place)}</div><div>Уровень ${e.level||'?'} · HP ${e.hp||'?'} · ${e.el.map(chip).join('')} слабость ${e.weak.map(chip).join('')}</div><div>Отряд: ${e.team.map(esc).join(', ')}</div><div>${esc(e.tactics)}</div>`;break;}
 case 'item':case 'itemq':{const e=a.item||a.e;h=`<div class="sa-k">Где взять · ${esc(e.type)}</div><h3>${lk(e.url,e.ru)} <small>${esc(e.en)}</small></h3><ul>${e.src.slice(0,8).map(s=>`<li>${esc(s)}</li>`).join('')||'<li>нет данных об источниках</li>'}</ul>`;break;}
 case 'breed':{const p=a.pal,b=a.b;h=`<div class="sa-k">Как вывести</div>${mini(p)}`+(b.unique?`<div>Особая пара: <b>${b.unique.map(esc).join(' + ')}</b></div>`:`<ul>${(b.pairs||[]).map(x=>`<li>${pl(x[0])} + ${pl(x[1])}</li>`).join('')}</ul><div class="dym">Примеры пар по рангу разведения (${p.rank}). Ещё можно поймать${p.egg?' или вылупить из яйца «'+esc(p.egg)+'»':''}.</div>`);break;}
 case 'work':h=`<div class="sa-k">Лучшие в работе</div><h3>${esc(a.work)}</h3><ol>${a.top.map(([p,l])=>`<li>${pl(p)} — ур. ${l} ${p.el.map(chip).join('')}</li>`).join('')}</ol>`;break;
 case 'mount':h=`<div class="sa-k">Самые быстрые ${a.fly?'летающие':'ездовые'}</div><ol>${a.top.map(p=>`<li>${pl(p)} — рывок ${p.sprint}</li>`).join('')}</ol>`;break;
 case 'passive':h=`<div class="sa-k">Пассивка · ранг ${esc(a.e.rank)}</div><h3>${lk(a.e.url,a.e.name)} <small>${esc(a.e.en)}</small></h3><div>${esc(a.e.desc)}</div>`;break;
 case 'faq':h=`<div class="sa-k">Ответ</div><h3>${esc(a.f.q)}</h3><div>${esc(a.f.a)}</div>`;break;
 case 'none':h=a.dym&&a.dym.length?`<div class="dym">Вы имели в виду: ${a.dym.map(d=>`<a data-q="${esc(d.name)}">${esc(d.name)}</a>`).join('')}</div>`:'';if(!h)return '';break;}
 return `<div class="sa">${fx}${h}</div>`;}
function bind(input,out){let t;const go=()=>{const v=input.value;if(v.trim().length<2){out.innerHTML='';return;}root.PW_data().then(()=>{out.innerHTML=render(core.answer(v));
  out.querySelectorAll('[data-q]').forEach(a=>a.onclick=()=>{input.value=a.dataset.q;input.dispatchEvent(new Event('input',{bubbles:true}));go();});});};
 input.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(go,180);});input.addEventListener('focus',()=>root.PW_data());}
root.PW_render=render;
document.addEventListener('DOMContentLoaded',()=>{
 const si=document.querySelector('.md-search__input');const sw=document.querySelector('.md-search__scrollwrap');
 if(si&&sw){const o=document.createElement('div');o.id='smart-answer';sw.prepend(o);bind(si,o);}
 const hq=document.getElementById('home-q');if(hq){bind(hq,document.getElementById('home-answer'));
  hq.addEventListener('keydown',e=>{if(e.key=='Enter'&&si){si.value=hq.value;document.querySelector('.md-search__toggle')||0;const tg=document.getElementById('__search');if(tg){tg.checked=true;}si.focus();si.dispatchEvent(new Event('input',{bubbles:true}));}});}
});
})(typeof window!='undefined'?window:globalThis);
