/* Палпедия v27 — поведение слоя. */
(function(){
const d=document,H=d.documentElement;if(!H.classList.contains('v27'))return;H.classList.add('v27js');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const P={shield:'<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',paw:'<circle cx="6" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="10" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5-2 3-4 3-4 0-4-3z"/>',scale:'<path d="M12 4v16M5 20h14M5 8h14M7 8l-3 6a3 3 0 0 0 6 0zM17 8l-3 6a3 3 0 0 0 6 0z"/>',crown:'<path d="m3 8 4 4 5-7 5 7 4-4-2 11H5z"/>',route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/>',spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',dna:'<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M8 7h8M8 17h8"/>',bowl:'<path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',bot:'<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',tower:'<path d="M6 21V8l6-5 6 5v13M9 21v-5h6v5M4 10h16"/>',pin:'<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',tree:'<path d="M12 21v-7M7 14a5 5 0 1 1 3-9 4 4 0 0 1 7 3 4 4 0 0 1-1 6z"/>',check:'<path d="m5 12 4 4 10-10"/>',cave:'<path d="M3 20c0-9 4-15 9-15s9 6 9 15zM9 20c0-4 1.5-7 3-7s3 3 3 7"/>',chest:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 13h18M11 13v3h2v-3M5 8a7 4 0 0 1 14 0"/>',pick:'<path d="M14 6 4 20M9 4c5 0 9 2 11 6M14 6l4 4"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',bolt:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-6h4v6"/>',sliders:'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'};
const E={'🛡️':'shield','🛡':'shield','🔗':'share','❤️':'heart','☆':'star','★':'star','🐾':'paw','⚖️':'scale','👑':'crown','🗺️':'route','✨':'spark','🤫':'lock','📍':'pin','🎒':'bag','🧬':'dna','🍲':'bowl','⭐':'star','🤖':'bot','🗿':'tower','🏯':'tower','🔒':'lock','🌳':'tree','✅':'check','🕳️':'cave','🧰':'chest','⛏️':'pick','🕘':'clock','⚡':'bolt','🏠':'home','🗼':'tower','🎁':'chest'};
const svg=k=>'<svg class="v27i" viewBox="0 0 24 24" aria-hidden="true">'+P[k]+'</svg>';
const EM=/^\s*([\p{Extended_Pictographic}\u2B50\u2705][\uFE0F\u200D\p{Extended_Pictographic}]*)\s*/u;
function strip(el,icon){const w=d.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n=w.nextNode();while(n&&!n.nodeValue.trim())n=w.nextNode();if(!n)return;const m=n.nodeValue.match(EM);if(!m)return;n.nodeValue=n.nodeValue.slice(m[0].length);if(icon&&E[m[1]]&&!el.querySelector('.v27i'))el.insertAdjacentHTML('afterbegin',svg(E[m[1]]))}

const TX=[["Энциклопедия Palworld","Твой проводник по Палпагосу","h1"],
["Всё о Palworld на русском: уровни 0–80, 299 палов, 1599 предметов, боссы, пассивки, разведение и секреты.","299 палов, боссы, разведение и тайники — коротко и по-русски."],
["двух палов рядом","бок о бок"],["с 1 до 80 уровня","по шагам до финала"],["лучшие наборы","что кому ставить"],["пасхалки и тайники","что легко пропустить"],
["где взять и крафт","добыча и крафт"],["калькулятор пар","кто с кем"],["блюда, баффы, кухни","еда перед боем"],
["Открой пару палов — они появятся здесь.","Здесь появятся палы, которых ты смотрел."],["Нажми ☆ на странице пала.","Отмечай палов ☆ — они соберутся здесь."],
["Сообщить об ошибке","Нашёл ошибку? Напиши"],["Что дальше?","Куда дальше"],["Скрыть, где был","Скрыть посещённые"],
["Что делать на моём уровне","Что делать на моём уровне"],["404 - Not found","Такой страницы нет"],["Спросить","Поиск"],
["Статуэтки Лифмунка и входы в подземелья меняют место, поэтому их нет на карте. Мировое Древо — отдельная карта.","Статуэтки Лифмунка и подземелья каждый раз в новом месте — поэтому их нет на карте. Мировое древо открывается отдельно."],
["Кто лучше копает?","Найти пала, предмет или босса"]];
function texts(root){const w=d.createTreeWalker(root||d.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.parentElement.closest('.pal-card,script,style'))continue;const v=n.nodeValue.trim();if(!v)continue;for(const [a,b,only] of TX){if(v===a&&(!only||n.parentElement.closest(only))){n.nodeValue=n.nodeValue.replace(a,b);break}}}
 d.querySelectorAll('input[placeholder]').forEach(i=>{for(const [a,b] of TX)if(i.placeholder===a)i.placeholder=b})}

function run(root){root=root||d;texts(root.body||root);
 root.querySelectorAll('.md-typeset h1,.md-typeset h2,.md-typeset h3,.ux-cr,.md-header__topic .md-ellipsis,.md-tabs__link,.md-nav__link,.ux-next .ux-h,.bug-link').forEach(e=>strip(e,false));
 root.querySelectorAll('.ux-btn,.ux-chip,.ux-ver,.ux-act,.lbtns button,.partner .actc,.wbar>span,.pal-info .works>span').forEach(e=>strip(e,true));
 root.querySelectorAll('.potd div,.potd span').forEach(e=>{for(const n of e.childNodes)if(n.nodeType==3)n.nodeValue=n.nodeValue.replace(/[\p{Extended_Pictographic}\uFE0F]/gu,'').replace(/ {2,}/g,' ')});
 root.querySelectorAll('.ux-tabbar a>span[aria-hidden]').forEach(sp=>{const k=E[sp.textContent.trim()]||({'🔍':'search'})[sp.textContent.trim()];if(!sp.querySelector('.v27i'))sp.innerHTML=k&&P[k]?svg(k):(k=='search'?'<svg class="v27i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>':'')});
 root.querySelectorAll('.tile .ti').forEach(t=>{const k=E[t.textContent.trim()];if(k&&!t.querySelector('.v27i')){t.innerHTML=svg(k);}});
 if(!RM&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  let i=0;root.querySelectorAll('.md-content__inner>h2,.md-content__inner>p,.md-content__inner>table,.md-content__inner>.admonition,.md-content__inner>details,.tiles>.tile,.ux-tiles>.ux-tile,.bento2>div').forEach(e=>{if(e.classList.contains('v27rv')||e.closest('.v27panel'))return;const r=e.getBoundingClientRect();if(r.top<innerHeight)return;e.classList.add('v27rv');e.style.setProperty('--d',(i++%6)*40+'ms');io.observe(e)})}
}
function top(){const h=d.querySelector('.md-header'),t=d.querySelector('.md-tabs');let y=h?h.getBoundingClientRect().bottom:56;if(t&&t.offsetHeight&&getComputedStyle(t).display!='none'&&t.getBoundingClientRect().bottom>y)y=t.getBoundingClientRect().bottom;H.style.setProperty('--v-top',Math.round(y)+'px');const s=d.querySelector('.md-sidebar--primary');H.style.setProperty('--v-sbw',s&&innerWidth>=1220?Math.round(s.getBoundingClientRect().right)+'px':'0px')}
function map(){const m=d.getElementById('pwmap');if(!m)return;d.body.classList.add('v27map');if(d.querySelector('.msheet')){run(d.querySelector('.msheet'));top();return}let p=d.querySelector('.v27panel');if(!p){p=d.createElement('div');p.className='v27panel';p.setAttribute('role','search');p.innerHTML='<button class="v27tg" type="button" aria-label="Фильтры">'+svg('sliders')+'</button>';d.querySelector('.md-content__inner').prepend(p);p.querySelector('.v27tg').onclick=()=>p.classList.toggle('v27min');if(innerWidth<600)p.classList.add('v27min')}
 const put=()=>{['.mrow','.mapsw','.msq','.ux-layers','.habchip','.map-note'].forEach(s=>{const e=d.querySelector('.md-content__inner '+s);if(e&&!p.contains(e)){e.classList.remove('v27rv');p.appendChild(e)}});run(p);top();window.dispatchEvent(new Event('resize'))};
 put();new MutationObserver(()=>{if(d.querySelector('.md-content__inner .habchip:not(.v27panel .habchip),.md-content__inner>.ux-layers'))put()}).observe(d.querySelector('.md-content__inner'),{childList:true,subtree:true})}
const idle=f=>(window.requestIdleCallback?requestIdleCallback(f,{timeout:2500}):setTimeout(f,600));
function go(){run();top();map();setTimeout(()=>idle(()=>{run();top();if(d.getElementById('pwmap'))map()}),1200)}
addEventListener('resize',top,{passive:true});
if(d.readyState=='loading')d.addEventListener('DOMContentLoaded',go);else go();
})();
;(function(){const d=document;if(!d.documentElement.classList.contains('v27'))return;const hq=d.getElementById('home-q');if(!hq)return;
const open=v=>{hq.blur();(window.PW_search?window.PW_search(v||null):(window.UX&&UX.openSearch?UX.openSearch(v):0))};
hq.addEventListener('focus',e=>e.stopImmediatePropagation(),true);
hq.addEventListener('mousedown',e=>{e.preventDefault();open(hq.value)});
hq.addEventListener('keydown',e=>{if(e.key==='Enter'||(e.key.length===1&&!e.ctrlKey&&!e.metaKey)){e.preventDefault();open((hq.value||'')+(e.key.length===1?e.key:''))}});})();
;(function(){const d=document;if(!d.documentElement.classList.contains('v27'))return;let tries=0;function toc(){const qa=d.querySelector('.ux-qa');if(!qa||!d.querySelector('.pal-card')||!d.querySelector('.ux-palx')){if(tries++<20)setTimeout(toc,250);return}if(d.querySelector('.v27-toc'))return;
const S=[['.ux-palx','Где живёт'],['.infotiles','Характеристики'],['.tabbed-set','Работа и навыки'],['section.bld','Сборка'],['.ux-sim','Похожие']];
const n=d.createElement('nav');n.className='v27-toc';n.setAttribute('aria-label','Разделы страницы');
S.forEach(([s,t],i)=>{const e=d.querySelector('.md-content '+s);if(!e)return;e.id=e.id||'s-'+i;e.style.scrollMarginTop='120px';const a=d.createElement('a');a.href='#'+e.id;a.textContent=t;n.appendChild(a)});
if(n.children.length<2)return;qa.after(n);
const links=[...n.querySelectorAll('a')];if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.hash==='#'+x.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});links.forEach(l=>{const t=d.getElementById(l.hash.slice(1));t&&io.observe(t)})}}if(d.readyState=='complete')toc();else addEventListener('load',toc)})();
;(function(){const f=()=>{const q=document.getElementById('hsq');if(q&&q.hasAttribute('aria-expanded')&&!q.getAttribute('role'))q.setAttribute('role','combobox')};f();addEventListener('load',f)})();

;(function(){const d=document,H=d.documentElement;if(!H.classList.contains('v27'))return;
const base=(d.querySelector('link[href*="assets/v27/v27.css"]')||{}).href;if(!base)return;const G=base.replace(/v27\.css.*$/,'game/');
const EL={neutral:'Neutral',fire:'Fire',water:'Water',grass:'Grass',electric:'Electric',ice:'Ice',ground:'Ground',dark:'Dark',dragon:'Dragon'};
const ELR={'Нейтральный':'Neutral','Огонь':'Fire','Вода':'Water','Трава':'Grass','Молния':'Electric','Лёд':'Ice','Земля':'Ground','Тьма':'Dark','Дракон':'Dragon'};
const WK={'Генерация энергии':'Generating_Electricity','Добыча':'Mining','Охлаждение':'Cooling','Полив':'Watering','Посев семян':'Planting','Разжигание огня':'Kindling','Рубка деревьев':'Lumbering','Ручная работа':'Handiwork','Сбор':'Gathering','Транспортировка':'Transporting','Фармацевтика':'Medicine_Production','Фермерство':'Farming'};
const img=(n,a)=>{const i=d.createElement('img');i.className='v27g';i.src=G+n+'.webp';i.alt='';i.width=18;i.height=18;i.decoding='async';i.setAttribute('aria-hidden','true');return i};
function go(root){root=root||d;
 root.querySelectorAll('.el:not(.v27gd)').forEach(e=>{if(e.closest('.pal-card'))return;const m=(e.className.match(/el-([a-z]+)/)||[])[1];const n=EL[m]||ELR[e.textContent.trim()];if(!n)return;e.classList.add('v27gd');const dot=e.querySelector('i,.dot');e.insertBefore(img(n),e.firstChild)});
 root.querySelectorAll('.works>span:not(.v27gd),.wbar>span:not(.v27gd)').forEach(e=>{if(e.closest('.pal-card'))return;const t=e.textContent.replace(/[\d\s]+$/,'').trim();const n=WK[t];if(!n)return;e.classList.add('v27gd');e.insertBefore(img(n),e.firstChild)});}
const run=()=>{go();new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType==1)go(n)}).observe(d.body,{childList:true,subtree:true})};
if(d.readyState!='loading')run();else d.addEventListener('DOMContentLoaded',run);})();

;(function(){const d=document;if(!d.documentElement.classList.contains('v27'))return;const go=()=>{
 d.querySelectorAll('.pal-info span,.pal-info div').forEach(e=>{if(e.children.length||e.closest('.pal-card'))return;const t=e.textContent;const m=t.match(/❤️\s*(\d+)\s*·\s*⚔️\s*(\d+)\s*·\s*🛡\uFE0F?\s*(\d+)/);if(m){e.innerHTML='<span class="v27stat"><i>HP</i><b>'+m[1]+'</b></span><span class="v27stat"><i>Атака</i><b>'+m[2]+'</b></span><span class="v27stat"><i>Защита</i><b>'+m[3]+'</b></span>'}});
 d.querySelectorAll('.ux-h,.ux-panel h3,.ux-panel h2,.ux-palx h3,.ux-palx .ux-h').forEach(e=>{const w=d.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const v=n.nodeValue.replace(/^\s*[\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u,'');if(v!==n.nodeValue){n.nodeValue=v;break}if(n.nodeValue.trim())break}});};
if(d.readyState=='complete')setTimeout(go,50);else addEventListener('load',()=>setTimeout(go,50));})();
/* v27: подсказка не перекрывает кнопки «?» */
(function(){function fix(p){for(let i=0;i<4;i++){const r=p.getBoundingClientRect();const hit=[...document.querySelectorAll('button,a,[role=button]')].find(b=>{if(p.contains(b)||!b.offsetParent)return false;const q=b.getBoundingClientRect();return q.width&&q.left<r.right&&q.right>r.left&&q.top<r.bottom&&q.bottom>r.top});if(!hit)return;const q=hit.getBoundingClientRect();let t=q.bottom+8;if(t+r.height>innerHeight-8)t=q.top-r.height-8;if(t<8){p.style.left=Math.max(8,Math.min(q.right+8,innerWidth-r.width-8))+'px';}else p.style.top=t+'px';}}
new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType==1&&n.classList.contains('hlp-pop'))requestAnimationFrame(()=>fix(n))}))).observe(document.body,{childList:true});})();
