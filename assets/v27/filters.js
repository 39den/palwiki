/* FIX_AUDIT · единая панель фильтров (все страницы): поиск+сортировка+вид+«Найдено» в одну строку,
   группы чипов в ровной сетке, активные чипы с ✕ и «Сбросить», на телефоне и в Telegram Mini App — нижняя панель
   «Фильтры (N)», которая сама закрывается после выбора. Оригинальные элементы и их обработчики сохраняются. Состояние в URL. */
(function(){
var B=window.PW_BASE||'/palwiki/';
var ROOTS='.gal-filters,.skf,.pfl,.gcf,.ffl';
var TG=window.Telegram&&Telegram.WebApp;
function setVH(){var h=TG&&(TG.viewportStableHeight||TG.viewportHeight);document.documentElement.style.setProperty('--fx-vh',h?h+'px':'100dvh')}
setVH();if(TG&&TG.onEvent)try{TG.onEvent('viewportChanged',setVH)}catch(e){}
if(TG)document.documentElement.classList.add('fx-tg');
var EL={'нейтрал':'Neutral','огон':'Fire','огн':'Fire','вод':'Water','трав':'Grass','молни':'Electric','лёд':'Ice','лед':'Ice','земл':'Ground','тьм':'Dark','дракон':'Dragon'};
var WK={'разведение огня':'Kindling','полив':'Watering','посадк':'Planting','электр':'Generating_Electricity','ручн':'Handiwork','сбор':'Gathering','рубк':'Lumbering','добыч':'Mining','фармац':'Medicine_Production','лекар':'Medicine_Production','охлажд':'Cooling','переноск':'Transporting','ферм':'Farming'};
var P={sword:'<path d="M14.5 3H21v6.5L10 20.5 3.5 14z"/><path d="M5 19l-2 2M7.5 13.5l3 3"/>',tool:'<path d="M14 6a4 4 0 0 0 5 5l-8 8a2 2 0 0 1-3-3z"/>',ride:'<path d="M4 17c2-5 6-7 10-7l3-4 2 1-1 4c1 1 2 3 2 6"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',tower:'<path d="M7 21V8l5-4 5 4v13zM10 21v-4h4v4"/>',crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',tree:'<path d="M12 21v-6"/><path d="M12 3a6 6 0 0 0-6 6 4 4 0 0 0 1 7h10a4 4 0 0 0 1-7 6 6 0 0 0-6-6z"/>',wave:'<path d="M3 15c3-3 6 3 9 0s6 3 9 0"/><path d="M3 10c3-3 6 3 9 0s6 3 9 0"/>',gem:'<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',shield:'<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z"/>',spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',food:'<path d="M5 11h14a7 7 0 0 1-14 0zM9 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 3 5 3 3 0 0 0 4 2V4.5A3 3 0 0 0 9 4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-3 5 3 3 0 0 1-4 2"/>',boom:'<path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M5 19l3.5-3.5M15.5 8.5 19 5"/>',filter:'<path d="M4 5h16l-6 8v5l-4 2v-7z"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',sort:'<path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>'};
var WI={'бой':'sword','атак':'sword','рейд':'sword','работ':'tool','езд':'ride','баз':'home','башн':'tower','альф':'crown','древ':'tree','мировой босс':'wave','радуж':'gem','золот':'gem','редк':'gem','отриц':'down','защит':'shield','опыт':'spark','особ':'boom','голод':'food','рассуд':'brain'};
function svg(k){return '<svg class="fx-i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+P[k]+'</svg>'}
var EMO=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u2B50\u2B06\u2194-\u21FF\u2300-\u23FF]\uFE0F?\s?/gu;
function iconFor(t){t=t.toLowerCase();var W=t.split(/[\s,.()«»-]+/);function st(k){return W.some(function(w){return w.indexOf(k)==0})||(k.indexOf(' ')>0&&t.indexOf(k)>=0)}for(var k in EL)if(t.indexOf(k)==0)return '<img class="fx-gi" src="'+B+'assets/v27/game/'+EL[k]+'.webp" alt="" width="18" height="18">';for(var k2 in WK)if(st(k2))return '<img class="fx-gi" src="'+B+'assets/v27/game/'+WK[k2]+'.webp" alt="" width="18" height="18">';for(var k3 in WI)if(st(k3))return svg(WI[k3]);return ''}
function clean(btn){if(btn._fxc)return;btn._fxc=1;var had=EMO.test(btn.textContent);EMO.lastIndex=0;var w=document.createTreeWalker(btn,NodeFilter.SHOW_TEXT),n,arr=[];while(n=w.nextNode())arr.push(n);arr.forEach(function(t){t.nodeValue=t.nodeValue.replace(EMO,'')});
  if(!btn.querySelector('img,svg,.el')){var ic=iconFor(btn.textContent.trim());if(ic)btn.insertAdjacentHTML('afterbegin',ic)}}
function num(el){if(!el)return null;var m=(el.textContent||'').replace(/\s/g,'').match(/\d+/);return m?+m[0]:null}
function val(b){for(var a of ['v','rk','al','e','cat']){if(b.hasAttribute('data-'+a))return b.getAttribute('data-'+a)}return null}
function keyOf(b){for(var a of ['v','rk','al','e','cat']){if(b.hasAttribute('data-'+a))return a}return 'v'}
function isOn(b){return b.classList.contains('on')||b.getAttribute('aria-pressed')=='true'||b.classList.contains('active')}
function labelOf(g,bs){var il=g.querySelector('.il');if(il)return il.textContent.trim();var k=bs[0]?keyOf(bs[0]):'';return {rk:(g.closest('.gcf')?'Ранг':'Редкость'),cat:'Категория',al:'Тип',e:'Эффект'}[k]||(g.getAttribute('data-g')=='el'?'Стихия':'Фильтр')}
var mobile=function(){return innerWidth<=760||(innerHeight<=500&&innerWidth<=1000)};
function build(R){
  if(R._fx||!R.isConnected)return;R._fx=1;
  if(R.matches('.ffl')){var nx=R.nextElementSibling;var W=document.createElement('div');W.className='fx-wrap';R.parentNode.insertBefore(W,R);W.appendChild(R);if(nx&&nx.matches('.ffc'))W.appendChild(nx);R=W;R._fx=1}
  R.classList.add('fx-root');
  var q=R.querySelector('input[type=search],input[type=text]');
  var sels=[...R.querySelectorAll('select')];
  var ctl=new Set([...R.querySelectorAll('.fcs[data-s]')].map(function(f){return f.getAttribute('data-s')}));
  var sort=sels.find(function(s){return /сорт/i.test(s.getAttribute('aria-label')||'')||/sort|sk-s|ffs/.test(s.className)||s.id=='gs'});
  var fsel=sels.filter(function(s){return s!==sort&&!ctl.has(s.id)&&s.options.length>1});
  var groups=[...R.querySelectorAll('.fcs,.pfc,.ffc')];
  var loose=[...R.querySelectorAll(':scope>button[data-al],:scope>button[data-rk]')];
  if(loose.length){var lg=document.createElement('div');lg.className='fx-lg';loose[0].parentNode.insertBefore(lg,loose[0]);loose.forEach(function(b){lg.appendChild(b)});groups.push(lg)}
  var cnt=R.querySelector('.ffn,.pfn,.gcf-n,.skn,.gcount:not(.fx-own)');[...R.querySelectorAll('.fx-own')].forEach(function(o,i){if(cnt||i)o.remove();else cnt=o});
  var seg=R.querySelector('.seg');
  function resEl(){var r=R.nextElementSibling;while(r&&(r.tagName=='DATALIST'||r.tagName=='SCRIPT'||r.offsetHeight<20))r=r.nextElementSibling;return r}
  function ownCount(){var r=resEl();if(!r)return 0;var k=r.children.length==1&&r.firstElementChild.children.length>1?r.firstElementChild:r;return [...k.children].filter(function(x){return x.offsetParent!==null&&x.offsetHeight>0}).length}
  if(!cnt){cnt=document.createElement('span');cnt.className='gcount fx-own';cnt.textContent='Найдено: '+ownCount();var rr=resEl();if(rr&&window.MutationObserver)new MutationObserver(function(){cnt.textContent='Найдено: '+ownCount()}).observe(rr,{subtree:true,attributes:true,attributeFilter:['hidden','style','class']})}
  var fx=document.createElement('div');fx.className='fx';
  fx.innerHTML='<div class="fx-top"></div><div class="fx-body" role="dialog" aria-label="Фильтры"><div class="fx-sh-h"><b>Фильтры</b><button type="button" class="fx-close" aria-label="Закрыть">'+svg('x')+'</button></div><div class="fx-grid"></div><div class="fx-sh-f"><button type="button" class="fx-show">Показать</button></div></div><div class="fx-act" aria-live="polite"></div>';
  R.appendChild(fx);
  var top=fx.querySelector('.fx-top'),body=fx.querySelector('.fx-body'),grid=fx.querySelector('.fx-grid'),act=fx.querySelector('.fx-act');
  if(q){var qs=document.createElement('div');qs.className='fx-q';qs.appendChild(q);top.appendChild(qs)}
  var G=[];
  // sort dropdown
  if(sort){var sd=mkDD(sort,'Сортировка',true);top.appendChild(sd)}
  if(seg)top.appendChild(seg);
  var fb=null;if(groups.length||fsel.length){fb=document.createElement('button');fb.type='button';fb.className='fx-fbtn';fb.innerHTML=svg('filter')+'<span>Фильтры</span><b class="fx-n"></b>';top.appendChild(fb)}
  if(cnt){cnt.classList.add('fx-count');top.appendChild(cnt)}
  groups.forEach(function(g){var bs=[...g.querySelectorAll('button')];if(!bs.length)return;bs.forEach(clean);var sec=sect(labelOf(g,bs));sec.querySelector('.fx-chips').appendChild(g);g.classList.add('fx-cg');
    G.push({sec:sec,kind:'btn',el:g,key:(g.getAttribute('data-s')||g.getAttribute('data-g')||keyOf(bs[0])),label:sec.dataset.l,
      get:function(){return [...g.querySelectorAll('button')].filter(function(b){return isOn(b)&&val(b)!==''&&val(b)!==null})},
      clear:function(){var all=[...g.querySelectorAll('button')].find(function(b){return val(b)===''});if(all){if(!isOn(all))all.click()}else this.get().forEach(function(b){b.click()})},
      setv:function(v){var b=[...g.querySelectorAll('button')].find(function(x){return val(x)===v});if(b&&!isOn(b))b.click()}})});
  fsel.forEach(function(s){var lab=s.getAttribute('aria-label')||(s.options[0]&&s.options[0].text)||'Фильтр';var sec=sect(lab);var box=sec.querySelector('.fx-chips');var cg=document.createElement('div');cg.className='fx-cg fx-sg';box.appendChild(cg);
    [...s.options].forEach(function(o,i){if(o.value==='')return;var b=document.createElement('button');b.type='button';b.className='fc';b.dataset.v=o.value;b.innerHTML=iconFor(o.text)+'<span>'+o.text.replace(EMO,'')+'</span>';b.onclick=function(){s.value=(s.value===o.value?'':o.value);s.dispatchEvent(new Event('change',{bubbles:true}));s.dispatchEvent(new Event('input',{bubbles:true}));sync()};cg.appendChild(b)});
    G.push({sec:sec,kind:'sel',el:s,key:s.id||s.className,label:lab,get:function(){return s.value?[{textContent:(s.options[s.selectedIndex]||{}).text||s.value}]:[]},clear:function(){if(s.value){s.value='';s.dispatchEvent(new Event('change',{bubbles:true}))}},setv:function(v){if([...s.options].some(function(o){return o.value===v})){s.value=v;s.dispatchEvent(new Event('change',{bubbles:true}))}},paint:function(){[...cg.children].forEach(function(b){b.classList.toggle('on',b.dataset.v===s.value);b.setAttribute('aria-pressed',b.dataset.v===s.value)})}})});
  function sect(l){var sec=document.createElement('section');sec.className='fx-grp';sec.dataset.l=l;sec.innerHTML='<button type="button" class="fx-gh" aria-expanded="true"><span class="fx-gl">'+l+'</span><span class="fx-gv"></span><svg class="fx-car" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><div class="fx-chips"></div>';grid.appendChild(sec);sec.querySelector('.fx-gh').onclick=function(){var o=sec.classList.toggle('fx-col');this.setAttribute('aria-expanded',!o)};return sec}
  function mkDD(s,lab,isSort){var d=document.createElement('div');d.className='fx-dd';d.innerHTML='<button type="button" class="fx-ddb" aria-haspopup="listbox" aria-expanded="false" aria-label="'+lab+'">'+svg('sort')+'<span></span><svg class="fx-car" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><div class="fx-ddl" role="listbox" hidden></div>';
    var bt=d.querySelector('.fx-ddb'),ls=d.querySelector('.fx-ddl');
    function paint(){var o=s.options[s.selectedIndex];bt.querySelector('span').textContent=o&&o.value!==''?o.text.replace(EMO,''):lab;ls.innerHTML='';[...s.options].forEach(function(o){var b=document.createElement('button');b.type='button';b.setAttribute('role','option');b.setAttribute('aria-selected',o.selected);b.textContent=o.value===''?lab+': по умолчанию':o.text.replace(EMO,'');b.onclick=function(){s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}));close();paint();sync()};ls.appendChild(b)})}
    function close(){ls.hidden=true;bt.setAttribute('aria-expanded','false')}
    bt.onclick=function(e){e.stopPropagation();var o=ls.hidden;document.querySelectorAll('.fx-ddl').forEach(function(x){x.hidden=true});ls.hidden=!o;bt.setAttribute('aria-expanded',o);if(o)paint()};
    document.addEventListener('click',function(e){if(!d.contains(e.target))close()});d.addEventListener('keydown',function(e){if(e.key=='Escape')close()});
    s.classList.add('fx-hid');paint();d._paint=paint;return d}
  // hide legacy chrome
  [...R.querySelectorAll('.gfbtn,.gc-frow,.gactive')].forEach(function(x){if(!x.contains(cnt))x.classList.add('fx-hid');else x.classList.add('fx-hid2')});
  var gsheet=R.querySelector('.gsheet');if(gsheet)gsheet.classList.add('fx-hid');
  fsel.forEach(function(s){s.classList.add('fx-hid')});
  var base=null;
  function activeN(){var n=0;G.forEach(function(g){n+=g.get().length});return n}
  function sync(){setTimeout(function(){
    var n=0;var frag=document.createElement('div');var act0=act;act=frag;
    G.forEach(function(g){if(g.paint)g.paint();var a=g.get();n+=a.length;var t=a.map(function(b){return (b.textContent||'').replace(EMO,'').trim()}).join(', ');g.sec.querySelector('.fx-gv').textContent=t;g.sec.classList.toggle('fx-has',!!a.length);
      a.forEach(function(b){var c=document.createElement('button');c.type='button';c.className='fx-chip';c.innerHTML='<span>'+g.label+': '+(b.textContent||'').replace(EMO,'').trim()+'</span>'+svg('x');c.setAttribute('aria-label','Убрать фильтр '+(b.textContent||'').trim());c.onclick=function(){if(g.kind=='btn'&&b.click){var all=[...g.el.querySelectorAll('button')].find(function(x){return val(x)===''});if(all)all.click();else b.click()}else g.clear();sync()};act.appendChild(c)})});
    if(q&&q.value){var c=document.createElement('button');c.type='button';c.className='fx-chip';c.innerHTML='<span>«'+q.value.replace(/[<>&]/g,'')+'»</span>'+svg('x');c.onclick=function(){q.value='';q.dispatchEvent(new Event('input',{bubbles:true}));sync()};act.appendChild(c)}
    if(n||(q&&q.value)){var r=document.createElement('button');r.type='button';r.className='fx-reset';r.textContent='Сбросить';r.onclick=reset;act.appendChild(r)}
    act=act0;var sigA=[...frag.children].map(function(x){return x.textContent}).join('|');if(act._sig!==sigA){act._sig=sigA;act.innerHTML='';while(frag.firstChild)act.appendChild(frag.firstChild)}
    act.classList.toggle('fx-empty',!act.children.length);if(cnt&&cnt.classList.contains('fx-own'))cnt.textContent='Найдено: '+ownCount();
    if(fb){fb.querySelector('.fx-n').textContent=n?'('+n+')':'';fb.classList.toggle('on',!!n)}
    var show=fx.querySelector('.fx-show');var c2=num(cnt);show.textContent=c2!=null?'Показать: '+c2:'Показать';
    writeURL()},60)}
  function reset(){var old=R.querySelector('.gc-reset');if(q&&q.value){q.value='';q.dispatchEvent(new Event('input',{bubbles:true}))}G.forEach(function(g){g.clear()});if(old)old.click();sync()}
  // URL state
  var PFX='f_';
  function writeURL(){try{var u=new URL(location.href);[...u.searchParams.keys()].filter(function(k){return k.indexOf(PFX)==0}).forEach(function(k){u.searchParams.delete(k)});
    G.forEach(function(g){var a=g.kind=='sel'?(g.el.value?[g.el.value]:[]):g.get().map(val);if(a.length)u.searchParams.set(PFX+g.key,a.join('|'))});
    if(sort&&sort.value&&sort.selectedIndex>0)u.searchParams.set(PFX+'sort',sort.value);if(q&&q.value)u.searchParams.set(PFX+'q',q.value);
    if(u.href!==location.href)history.replaceState(history.state,'',u.href)}catch(e){}}
  function readURL(){var u=new URL(location.href),any=0;G.forEach(function(g){var v=u.searchParams.get(PFX+g.key);if(v){v.split('|').forEach(function(x){g.setv(x)});any=1}});var s=u.searchParams.get(PFX+'sort');if(s&&sort){sort.value=s;sort.dispatchEvent(new Event('change',{bubbles:true}));any=1}var qq=u.searchParams.get(PFX+'q');if(qq&&q){q.value=qq;q.dispatchEvent(new Event('input',{bubbles:true}));any=1}return any}
  // sheet (phone) behaviour
  function open(){fx.classList.add('fx-open');document.body.classList.add('fx-lock');body.scrollTop=0}
  function shut(scroll){fx.classList.remove('fx-open');document.body.classList.remove('fx-lock');if(scroll)toResults()}
  function toResults(){var r=R.nextElementSibling;while(r&&(r.offsetHeight<8||r.tagName=='DATALIST'))r=r.nextElementSibling;var y=(r||fx).getBoundingClientRect().top+scrollY-fx.querySelector('.fx-top').offsetHeight-70;if(Math.abs(y-scrollY)>40)scrollTo({top:Math.max(0,y),behavior:'instant'})}
  if(fb)fb.onclick=function(){if(mobile())fx.classList.contains('fx-open')?shut():open();else{fx.classList.toggle('fx-coll');}};
  fx.querySelector('.fx-close').onclick=function(){shut()};fx.querySelector('.fx-show').onclick=function(){shut(true)};
  grid.addEventListener('click',function(e){var b=e.target.closest('.fx-chips button');if(!b)return;var sec=b.closest('.fx-grp');sync();
    setTimeout(function(){var has=sec.classList.contains('fx-has');if(has)sec.classList.add('fx-col');if(mobile()&&fx.classList.contains('fx-open'))shut(true)},90)});
  R.addEventListener('input',function(){sync()});R.addEventListener('change',function(){sync()});
  document.addEventListener('keydown',function(e){if(e.key=='Escape'&&fx.classList.contains('fx-open'))shut()});
  // desktop: big groups start collapsed
  G.forEach(function(g){var n=g.sec.querySelectorAll('.fx-chips button').length;if(n>12)g.sec.classList.add('fx-col')});
  readURL();sync();setTimeout(sync,400);
  function adopt(){var q2=R.querySelector(':scope>.gtop input[type=search],:scope>.gtop input[type=text],:scope>input[type=search],:scope>input[type=text]');if(q2&&q2!==q){var qs2=top.querySelector('.fx-q');if(!qs2){qs2=document.createElement('div');qs2.className='fx-q';top.insertBefore(qs2,top.firstChild)}qs2.innerHTML='';qs2.appendChild(q2);q=q2}
    var s3=R.querySelector(':scope>.gtop select');if(s3&&s3!==sort&&sort&&s3.id===sort.id){var od=top.querySelector('.fx-dd');sort=s3;var nd=mkDD(s3,'Сортировка',true);if(od)top.replaceChild(nd,od)}
    var s2=R.querySelector(':scope>.seg');if(s2&&s2!==seg){if(seg&&seg.parentNode)seg.remove();seg=s2;top.insertBefore(s2,fb||null)}var c3=R.querySelector(':scope>.gcount,:scope>.gc-frow .gcount');if(c3&&c3!==cnt){if(cnt&&cnt.parentNode&&cnt.closest('.fx'))cnt.remove();cnt=c3;cnt.classList.add('fx-count');top.appendChild(cnt)}}
  adopt();var _ad=0,_ai=setInterval(function(){adopt();if(++_ad>40)clearInterval(_ai)},150);
  R._fxApi={G:G,sync:sync,reset:reset,open:open,shut:shut,adopt:adopt};
}
function scan(){document.querySelectorAll(ROOTS).forEach(function(r){if(r.closest('.fx'))return;if(r.matches('.ffl')&&r.parentElement&&r.parentElement.classList.contains('fx-wrap'))return;if(r.closest('.md-header,.md-sidebar'))return;if(r.matches('.gal-filters')&&!r.querySelector('select,button'))return;if(r.matches('.plain'))return;if(r.id=='gal-filters'&&!(r.querySelector('.gsheet')&&document.getElementById('gview')&&document.getElementById('gr')))return;if(r._fx&&r._fxApi&&r.querySelector(':scope>.fx'))r._fxApi.adopt();if(r._fx&&!r.querySelector(':scope>.fx')&&!r.matches('.fx-wrap')){r._fx=0;r.classList.remove('fx-root')}build(r)})}
function go(){scan();var pend=0;new MutationObserver(function(){if(pend)return;pend=setTimeout(function(){pend=0;scan()},200)}).observe(document.body,{childList:true,subtree:true})}
// «наверх» не перекрывает панель/кнопки
var io=window.IntersectionObserver&&new IntersectionObserver(function(es){es.forEach(function(e){document.body.classList.toggle('fx-vis',e.isIntersecting)})});
function watchVis(){if(!io)return;document.querySelectorAll('.fx').forEach(function(f){if(!f._io){f._io=1;io.observe(f)}})}
setInterval(watchVis,1000);
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,50)});else setTimeout(go,50);
})();
