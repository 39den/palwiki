/* live: smart answer (ported from ux50 preview). Minimal UX shim when ux50.js is not loaded. */
(function(){if(window.UX)return;const B=window.PW_BASE||(document.querySelector('script[src*="assets/ai.js"]')||{src:''}).src.replace(/assets\/ai\.js.*$/,'');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let _D,_X;const data=()=>_D||(_D=(window.PW_load||window.PW_data)());
const ux=()=>_X||(_X=fetch(B+'assets/ux50_data.json').then(r=>r.ok?r.json():null).catch(()=>null));
window.UX={B,esc,data,ux,$:(s,r)=>(r||document).querySelector(s),$$:(s,r)=>[...(r||document).querySelectorAll(s)],live:1};})();
/* Палпедия UX50 — умный ответ в строке поиска: сначала база, потом ИИ (только если база не поняла вопрос) */
(function(){'use strict';
const PALAI='https://palguide-ai.palpedia.workers.dev';
const go=()=>{const U=window.UX;if(!U)return;const {B,esc,data,ux,$}=U;
const N=s=>(window.PW_core?window.PW_core.norm(s):String(s||'').toLowerCase()).trim();
const day=()=>new Date().toISOString().slice(0,10);
const cache=(()=>{try{return JSON.parse(sessionStorage.getItem('ux_ai')||'{}')}catch(e){return {}}})();
const save=()=>{try{sessionStorage.setItem('ux_ai',JSON.stringify(cache))}catch(e){}};
async function askAI(q,ctx){if(localStorage.getItem('palai_off')===day())return {err:'off'};
 try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),12000);
  const r=await fetch(PALAI,{method:'POST',signal:ctl.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({q:q.slice(0,500),ctx:ctx.slice(0,6000)})});clearTimeout(t);
  const d=await r.json().catch(()=>({}));if(r.ok&&d.a)return {a:d.a};
  if(r.status===429&&d.limit==='day'){localStorage.setItem('palai_off',day());return {err:'off'};}
  if(r.status===429)return {err:'minute'};return {err:'fail'};}catch(e){return {err:'fail'};}}
/* справка из нашей базы под вопрос */
function context(D,X,q){const n=' '+N(q)+' ';const words=n.split(' ').filter(w=>w.length>=4).map(w=>w.slice(0,Math.max(4,w.length-2)));const hit=s=>{const k=N(s);return k&&(n.includes(' '+k+' ')||n.includes(' '+k)||k.split(' ').every(w=>w.length>=4&&words.some(x=>w.startsWith(x))));};
 const out=[];const pals=D.pals.filter(p=>hit(p.ru)||hit(p.en)).slice(0,3);
 pals.forEach(p=>{const x=(X&&X.pals[p.id])||{};out.push(`Пал ${p.ru} (№${p.no}). Стихия: ${p.el.join(', ')}. Слабость: ${(p.weak||[]).join(', ')||'нет'}. Работа: ${(p.work||[]).map(w=>w[0]+' '+w[1]).join(', ')||'нет'}. Партнёрский навык: ${p.psk||'—'}. HP ${p.hp}, атака ${p.atk}, защита ${p.def}.${p.mount?' Ездовой'+(p.mount=='fly'?', летает':'')+'.':''} ${x.wild?`В дикой природе: ${x.lv?'уровни '+x.lv.join('–')+', ':''}точек днём ${(x.sp||[])[0]||'?'}, ночью ${(x.sp||[])[1]||'?'}${(x.dng||[]).length?', подземелья: '+x.dng.join(', '):''}.`:'В дикой природе не встречается, только разведение.'} ${x.egg?'Яйцо: '+x.egg+'.':''} Лучшие пассивки: ${Object.entries(p.bp||{}).map(([r,l])=>r+' — '+l.join(', ')).join('; ')}. ${(x.dr||[]).length?'Дроп: '+x.dr.map(d=>d[0]+' '+d[1]+' ('+d[2]+')').join(', ')+'.':''}${(x.ad||[]).length?' Дроп альфы: '+x.ad.map(d=>d[0]+' ('+d[2]+')').join(', ')+'.':''}`);});
 (D.bosses||[]).filter(b=>hit(b.name.replace(/\(.*?\)/,''))||(b.pal&&hit(b.pal))).slice(0,3).forEach(b=>out.push(`Босс ${b.name}: ${b.kind}, ${b.place||''}, уровень ${b.level}, HP ${b.hp||'?'}, стихия ${(b.el||[]).join(', ')}, слабость ${(b.weak||[]).join(', ')}, отряд против: ${(b.team||[]).join(', ')}.`));
 (D.items||[]).filter(i=>i.ru&&i.ru.length>3&&hit(i.ru)).slice(0,3).forEach(i=>out.push(`Предмет ${i.ru} (${i.type||''}): ${String(i.desc||'').replace(/\n/g,' ')} Где взять: ${(i.src||[]).slice(0,8).join('; ')}.`));
 (D.passives||[]).filter(p=>hit(p.name)).slice(0,3).forEach(p=>out.push(`Пассивка ${p.name}: ${p.desc}. Ранг ${p.rank}.${(p.nat||[]).length?' С рождения у: '+p.nat.slice(0,8).join(', ')+'.':''}`));
 const qs=new Set(n.split(' ').filter(w=>w.length>=4).map(w=>w.slice(0,5)));
 (D.faq||[]).map(f=>[f,N(f.q).split(' ').filter(w=>w.length>=4&&qs.has(w.slice(0,5))).length]).filter(a=>a[1]>=1).sort((a,b)=>b[1]-a[1]).slice(0,4).forEach(([f])=>out.push(`Вопрос: ${f.q} Ответ: ${f.a}`));
 const PL=/(посад|посев|сеять|семен|семя|ягод|грядк|огород|урожа|плантац|пшениц|томат|салат)/.test(n);if(PL)out.push('Плантацию (ягоды, пшеница, томаты, салат) обслуживают три работы: «Посев семян» — сажают, «Полив» — поливают, «Сбор» — собирают урожай. Работа «Фермерство» — это ранчо: там палы сами дают яйца, шерсть, молоко, мёд, к плантации она не относится.');
 const WK=[['Посев семян',/(посад|посев|сеять|семен|семя|ягод|грядк|огород|урожа|плантац)/],['Полив',/(полив|вод[аыу]|ягод|плантац|урожа)/],['Сбор',/(сбор|собира|ягод|плантац|урожа)/],['Фермерство',PL?/^$/:/(ферм|ранч|яйц|шерст|молок|мёд|мед)/],['Рубка деревьев',/(рубк|дерев|брёвн|древесин)/],['Добыча',/(добыч|руд|камн|копат|копа)/],['Ручная работа',/(крафт|создан|ручн|верстак|делат)/],['Транспортировка',/(перенос|транспорт|таска)/],['Разжигание огня',/(огонь|огня|печ|плав|готов)/],['Охлаждение',/(холод|охлажд|морозил)/],['Генерация энергии',/(энерг|электр|генератор)/],['Фармацевтика',/(лекарств|медиц|аптек|фармац)/]];
 const early=/(начал|новичк|перв|ранн|старт)/.test(n);
 WK.filter(([w,re])=>re.test(n)).slice(0,3).forEach(([w])=>{let L=D.pals.filter(p=>(p.work||[]).some(x=>x[0]===w)).map(p=>{const x=(X&&X.pals[p.id])||{};return {p,l:(p.work.find(x=>x[0]===w)||[])[1]||0,lv:x.lv?x.lv[0]:99,wild:x.wild};});
  const top=[...L].sort((a,b)=>b.l-a.l).slice(0,6);const easy=L.filter(a=>a.wild&&a.lv<=15).sort((a,b)=>b.l-a.l||a.lv-b.lv).slice(0,6);
  const f=a=>`${a.p.ru} (сила работы ${a.l}${a.wild&&a.lv<99?', ловится с уровня игрока '+a.lv:''})`;
  out.push(`Лучшие палы для работы «${w}»: ${top.map(f).join(', ')}.`);if(easy.length)out.push(`Для работы «${w}» в начале игры легко поймать: ${easy.map(f).join(', ')}.`);});
 if(X&&X.gl)X.gl.filter(g=>hit(g.t)).slice(0,2).forEach(g=>out.push(`${g.t} — ${g.d}`));
 return out.join('\n').slice(0,6000);}
const QW=/^(как|где|что|чем|кто|какой|какая|какие|какую|почему|зачем|можно|сколько|когда|стоит|лучше|нужно|надо|если)\b/;
const isQuestion=v=>{const n=N(v);return n.length>=10&&(n.split(' ').length>=3||/\?/.test(v))&&(QW.test(n)||/\?/.test(v)||n.split(' ').length>=4);};
const clean=t=>String(t).replace(/\*\*|__|`/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/https?:\/\/\S+/g,'').replace(/\s*\((источник|source)[^)]*\)/gi,'').trim();
const render=t=>{const L=clean(t).split(/\n+/).map(s=>s.trim()).filter(Boolean);let h='',ul=false;for(const l of L){if(/^[-•*]\s+/.test(l)){if(!ul){h+='<ul>';ul=true;}h+='<li>'+esc(l.replace(/^[-•*]\s+/,''))+'</li>';}else{if(ul){h+='</ul>';ul=false;}h+='<p>'+esc(l)+'</p>';}}return h+(ul?'</ul>':'');};
let D=null,X=null;data().then(d=>D=d);ux().then(x=>X=x);
let pending=null,tmr=null,last='';
function card(q,st){const c=document.createElement('div');c.className='sx-card ux-aicard'+(st.wait?' wait':'');c.dataset.q=q;c.setAttribute('aria-live','polite');
 c.innerHTML=st.a?`<div class="ux-aih"><span class="ux-aiav" aria-hidden="true">✨</span><b>Умный ответ</b></div><div class="ux-aib">${render(st.a)}</div>`:
  st.wait?`<div class="ux-aih"><span class="ux-aiav" aria-hidden="true">✨</span><b>Думаю над ответом…</b></div><div class="ux-skel"><i></i><i></i><i style="width:60%"></i></div>`:
  st.err=='minute'?`<div class="ux-aih"><span class="ux-aiav" aria-hidden="true">⏳</span><b>Подожди минутку — пока вот что нашёл в базе</b></div>`:'';return c;}
function place(body,q){const st=cache[N(q)];const old=body.querySelector('.ux-aicard');if(old&&old.dataset.q===q&&!old._stale)return;old&&old.remove();
 if(st&&(st.a||st.wait||st.err=='minute')){const c=card(q,st);if(!c.innerHTML)return;const anchor=body.querySelector('.dym');anchor?anchor.after(c):body.prepend(c);}
 else if(!st&&q.trim().length>=3&&localStorage.getItem('palai_off')!==day()&&body.querySelector('.sx-card.ai')){/* база ответила — ИИ по кнопке */if(!body.querySelector('.ux-aibtn')){const b=document.createElement('button');b.type='button';b.className='sx-c ux-aibtn';b.textContent='✨ Спросить умный ответ';b.onclick=e=>{e.preventDefault();e.stopPropagation();run(q,body,true);};const fu=body.querySelector('.sx-card.ai .sx-fu')||body.querySelector('.sx-card.ai');fu&&fu.appendChild(b);}}}
async function run(q,body,force){const k=N(q);if(cache[k]&&!cache[k].err)return place(body,q);if(!D)D=await data();if(!X)X=await ux().catch(()=>null);
 cache[k]={wait:1};place(body,q);const loc=[...body.querySelectorAll('.sx-card.ai:not(.ux-aicard)')].map(e=>e.innerText.replace(/✨ Спросить умный ответ/g,'').replace(/🤖 Ответ из базы/g,'').replace(/\s+/g,' ').trim()).filter(Boolean).join('\n').slice(0,1500);let r=await askAI(q,((loc?'Что нашёл быстрый поиск по базе (может быть не про то; если ниже есть более точные факты — опирайся на них): '+loc+'\n':'')+context(D,X,q)));if(r.a&&/в моей базе этого (пока )?нет|в базе этого нет|нет данных/i.test(r.a.trim().slice(0,80)))r={err:'none'};cache[k]=r.a?{a:r.a}:{err:r.err};if(r.a)save();
 const inp=document.getElementById('hsq');if(inp&&N(inp.value)===k){const o=body.querySelector('.ux-aicard');if(o)o._stale=1;place(body,q);}}
function hook(){const sx=document.getElementById('sxp');if(!sx||sx.dataset.ai)return;sx.dataset.ai=1;const body=sx.querySelector('.sx-body'),inp=document.getElementById('hsq');if(!body||!inp)return;
 const check=()=>{const q=inp.value.trim();if(!q){return;}place(body,q);if(q===last)return;last=q;clearTimeout(tmr);
  const local=body.querySelector('.sx-card.ai, .sx-cmp');if(local||!isQuestion(q)||cache[N(q)])return;
  tmr=setTimeout(()=>{if(inp.value.trim()===q&&!body.querySelector('.sx-card.ai, .sx-cmp'))run(q,body);},1100);};
 new MutationObserver(()=>{last='';check();}).observe(body,{childList:true});
 inp.addEventListener('keydown',e=>{if(e.key=='Enter'){const q=inp.value.trim();clearTimeout(tmr);setTimeout(()=>{if(inp.value.trim()===q&&isQuestion(q)&&!body.querySelector('.sx-card.ai, .sx-cmp')&&!cache[N(q)])run(q,body);},450);}});}
new MutationObserver(hook).observe(document.body,{childList:true});hook();
U.askAI=askAI;U.aiContext=(q)=>context(D,X,q);};
document.readyState=='loading'?document.addEventListener('DOMContentLoaded',()=>setTimeout(go,80)):setTimeout(go,80);})();
(()=>{const H=document.documentElement;const upd=()=>{const sx=document.getElementById('sxp');const inp=document.getElementById('hsq');const open=(inp&&document.activeElement===inp)||(sx&&!sx.hidden&&getComputedStyle(sx).display!=='none'&&sx.querySelector('.sx-body')&&sx.querySelector('.sx-body').children.length>0&&sx.getBoundingClientRect().height>0);H.classList.toggle('ux-sxon',!!open);
 const b=document.querySelector('.inst');const bh=b&&getComputedStyle(b).display!=='none'&&!open?b.getBoundingClientRect().height:0;const v=bh?Math.round(bh+16)+'px':'';if(document.body&&document.body.style.paddingBottom!==v)document.body.style.paddingBottom=v;};
 document.addEventListener('focusin',upd);document.addEventListener('input',()=>setTimeout(upd,60));document.addEventListener('focusout',()=>setTimeout(upd,60));document.addEventListener('click',()=>setTimeout(upd,60));
 const mo=new MutationObserver(()=>{clearTimeout(mo.t);mo.t=setTimeout(upd,40);});const start=()=>{mo.observe(document.body,{childList:true});const sx=document.getElementById('sxp');sx&&mo.observe(sx,{attributes:true,attributeFilter:['hidden','class'],childList:true});upd();};document.body?start():document.addEventListener('DOMContentLoaded',start);})();
