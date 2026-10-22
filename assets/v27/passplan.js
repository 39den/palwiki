/* Палпедия · «Вывести пала с нужными пассивками» (PASSPLAN). Данные: assets/teamcheck/tc.json (paldb 1.0.5) + tc_breed.json. */
(function(){
'use strict';
var app=document.getElementById('pp-app');if(!app)return;
var R=app.getAttribute('data-root')||'../../';
var WIKI='https://palworld.wiki.gg/wiki/Breeding',WIKI_PS='https://palworld.wiki.gg/wiki/Passive_Skills',PALDB='https://paldb.cc/ru/Passive_Skills',PALDB_S='https://paldb.cc/ru/Pal_Surgery_Table';
var MUT={'Babysitter':1,'Heavily Armored':1,'Idiosyncratic':1,'Immortality':1,'Skymarcher':1};
var NORAND={'Legend':1,'Lucky':1};
// шанс «ребёнок получил ВСЕ пассивки родителей и ни одной случайной» — таблица wiki.gg/Breeding
var CHANCE={1:40,2:24,3:12,4:10};
var T,BR,PAL={},PID={},PAS={},PEN={},PROD={},st={pal:null,sel:[]},open={pal:false,pas:false},more={};
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function low(s){return String(s||'').toLowerCase().replace(/ё/g,'е')}
function img(p,sz){return p&&p.thumb?'<img src="'+R+p.thumb+'" width="'+sz+'" height="'+sz+'" alt="" loading="lazy" decoding="async">':'<span class="pp-noimg">?</span>'}
function palA(n,opt){var p=PAL[n];opt=opt||{};if(!p)return '<span class="pp-pal">'+e(n)+'</span>';
  return '<span class="pp-pal'+(opt.big?' big':'')+'"><a class="pp-pa" href="'+R+p.url+'" title="'+e(p.ru)+'">'+img(p,opt.big?48:36)+'<span>'+e(p.ru)+'</span></a>'+(opt.nomap||!p.hab||!p.hab.wild?'':'<a class="pp-map" href="'+R+'map/?pal='+encodeURIComponent(p.id)+'" title="'+e(p.ru)+' на карте" aria-label="'+e(p.ru)+' на карте">📍</a>')+'</span>'}
function pairChip(a,b,c){return '<span class="pp-pair">'+palA(a)+'<b class="gc-op">+</b>'+palA(b)+(c?'<b class="gc-op">→</b>'+palA(c,{nomap:1}):'')+'</span>'}
function rk(r){var c=r>0?'rk'+r:'rkn';return '<span class="gc-rk '+c+' pp-rk" title="Ранг '+r+'">'+(r>0?'▲'.repeat(Math.min(r,4)):'▼')+'</span>'}
function rkTxt(r){return r>0?'Ранг '+r:'Вредная'}
function wildLv(p){return p&&p.hab&&p.hab.wild&&p.hab.lv?p.hab.lv[0]:999}
function kind(s){if(MUT[s.en])return'mut';if(s.how=='disposable')return'impl';if(s.nat&&s.nat.length&&!s.how)return'fixed';if(NORAND[s.en])return'special';return'wild'}
function pct(n){return n+'%'}
function load(u){return fetch(R+u).then(function(r){if(!r.ok)throw r.status;return r.json()})}
Promise.all([load('assets/teamcheck/tc.json'),load('assets/teamcheck/tc_breed.json')]).then(function(d){T=d[0];BR=d[1];init()}).catch(function(){app.innerHTML='<div class="gc pp-err"><div class="gc-t"><b>Не удалось загрузить данные</b></div><p>Проверь соединение и обнови страницу.</p></div>'});
function init(){
  T.pals.forEach(function(p){PAL[p.ru]=p;PID[low(p.id)]=p;PID[low(p.en)]=p;PID[low(p.ru)]=p});
  T.pas.forEach(function(s){PAS[s.n]=s;PEN[low(s.en)]=s;PEN[low(s.n)]=s});
  var N=BR.pals;Object.keys(BR.pairs).forEach(function(k){var ij=k.split(','),c=N[BR.pairs[k]],a=N[+ij[0]],b=N[+ij[1]];if(!c||!a||!b)return;(PROD[c]=PROD[c]||[]).push([a,b])});
  (BR.special||[]).forEach(function(x){(PROD[x.child]=PROD[x.child]||[]).push([x.a,x.b])});
  Object.keys(PROD).forEach(function(c){var seen={};PROD[c]=PROD[c].filter(function(q){var k=[q[0],q[1]].sort().join('|');if(seen[k])return false;seen[k]=1;return true})
    .sort(function(x,y){return score(x)-score(y)})});
  readURL();render();
  window.addEventListener('popstate',function(){readURL();render()});
}
function score(q){var a=PAL[q[0]],b=PAL[q[1]];var s=Math.max(wildLv(a),wildLv(b));if(q[0]==q[1])s+=1;return s}
function readURL(){var u=new URLSearchParams(location.search);var p=u.get('pal');st.pal=p&&PID[low(p)]?PID[low(p)].ru:null;
  var raw=u.get('passives')||u.get('p')||'';st.sel=[];raw.split(/[|,]/).forEach(function(x){x=x.trim();var s=PEN[low(x)];if(s&&st.sel.indexOf(s.n)<0&&st.sel.length<4)st.sel.push(s.n)})}
function writeURL(){var u=new URLSearchParams(location.search);u.delete('p');
  if(st.pal)u.set('pal',PAL[st.pal].id);else u.delete('pal');
  if(st.sel.length)u.set('passives',st.sel.map(function(n){return PAS[n].en}).join('|'));else u.delete('passives');
  var q=u.toString().replace(/%7C/gi,'|');history.replaceState(null,'',location.pathname+(q?'?'+q:'')+location.hash)}
function set(fn){fn();writeURL();render()}
/* ---------- render ---------- */
function render(){
  var h='';
  h+='<div class="gcg pp-top" data-cat="pp">'+cardPal()+cardSel()+'</div>';
  if(open.pal)h+=pickerPal();
  if(open.pas)h+=pickerPas();
  if(st.sel.length){h+='<h2 class="pp-h" id="gde-vzyat">Где взять пассивки</h2><div class="gcg pp-where" data-cat="pp">'+st.sel.map(cardWhere).join('')+'</div>'}
  if(st.pal){h+='<h2 class="pp-h" id="plan">План разведения</h2>'+plan()}
  else h+='<div class="gc pp-hint"><div class="gc-t"><span class="pp-ic">👆</span><b>Выбери пала</b></div><p>Начни с того, кого хочешь вывести. Потом отметь до 4 пассивок, и здесь появится план по шагам.</p></div>';
  h+='<h2 class="pp-h" id="mehanika">Как работает наследование</h2>'+mech();
  app.innerHTML=h;bind();
}
function cardPal(){var p=st.pal&&PAL[st.pal];
  return '<div class="gc pp-who"><div class="gc-t"><span class="pp-ic">🎯</span><b>Кого выводим</b></div>'+
   (p?'<div class="pp-cur">'+img(p,64)+'<div class="pp-curt"><a href="'+R+p.url+'"><b>'+e(p.ru)+'</b></a><span class="gc-sub">'+e(p.el.join(' · '))+(p.natp&&p.natp.length?' · от рождения: '+e(p.natp.map(function(x){return x[0]}).join(', ')):'')+'</span></div></div>':'<p class="pp-muted">Пал не выбран</p>')+
   '<button type="button" class="gc-btn pp-btn" data-act="pal" aria-expanded="'+open.pal+'">'+(p?'Сменить пала':'Выбрать пала')+'</button></div>'}
function cardSel(){var p=st.pal&&PAL[st.pal];
  var chips=st.sel.map(function(n){var s=PAS[n];return '<span class="pp-sel">'+rk(s.r)+'<span>'+e(n)+'</span><button type="button" data-rm="'+e(n)+'" aria-label="Убрать '+e(n)+'">×</button></span>'}).join('');
  var pre='';if(p&&p.bp){pre=Object.keys(p.bp).filter(function(r){return(p.bp[r]||[]).length}).map(function(r){return '<button type="button" class="gc-btn pp-btn ghost" data-preset="'+e(r)+'">Набор «'+e(r)+'»</button>'}).join('')}
  return '<div class="gc pp-want"><div class="gc-t"><span class="pp-ic">🧬</span><b>Нужные пассивки <span class="pp-cnt">'+st.sel.length+'/4</span></b></div>'+
   '<div class="pp-sels">'+(chips||'<span class="pp-muted">Пока ничего не выбрано</span>')+'</div>'+
   '<div class="pp-btns"><button type="button" class="gc-btn pp-btn" data-act="pas" aria-expanded="'+open.pas+'"'+(st.sel.length>=4&&!open.pas?' disabled':'')+'>'+(st.sel.length>=4?'Выбрано 4 из 4':'+ Добавить пассивку')+'</button>'+pre+(st.sel.length?'<button type="button" class="gc-btn pp-btn ghost" data-act="clear">Очистить</button>':'')+'</div></div>'}
function pickerPal(){return '<div class="gc pp-picker" id="pp-pickpal"><div class="gc-t"><b>Выбери пала</b><button type="button" class="pp-x" data-act="pal" aria-label="Закрыть">×</button></div>'+
  '<input type="search" class="gcf-q pp-q" id="pp-qpal" placeholder="Имя пала: Анубис, Jetragon…" autocomplete="off" aria-label="Поиск пала"><div class="pp-pgrid" id="pp-pgrid"></div></div>'}
function pickerPas(){return '<div class="gc pp-picker" id="pp-pickpas"><div class="gc-t"><b>Выбери пассивку</b><button type="button" class="pp-x" data-act="pas" aria-label="Закрыть">×</button></div>'+
  '<div class="pp-frow"><input type="search" class="gcf-q pp-q" id="pp-qpas" placeholder="Название или эффект: работа, атака…" autocomplete="off" aria-label="Поиск пассивки">'+
  '<div class="pp-rf" role="group" aria-label="Ранг"><button type="button" data-rf="" class="on">Все</button><button type="button" data-rf="4">Р4+</button><button type="button" data-rf="3">Р3</button><button type="button" data-rf="1">Р1–2</button><button type="button" data-rf="neg">Минус</button></div></div><div class="pp-sgrid" id="pp-sgrid"></div></div>'}
var SRC={fixed:['🐾','От рождения'],wild:['🌿','Дикие'],impl:['💠','Имплант'],mut:['🧪','Мутация'],special:['✨','Особая']};
function srcTag(s){var k=kind(s),t=SRC[k];var g=s.how=='gold'?'<span class="gc-b pp-gold">🪙 Хирургия</span>':'';return '<span class="gc-b pp-src '+k+'">'+t[0]+' '+t[1]+'</span>'+g}
function fillPal(q){var g=document.getElementById('pp-pgrid');if(!g)return;q=low(q).trim();var syn=T.syn||{};var alias=syn[q];
  var L=T.pals.filter(function(p){return !q||low(p.ru).indexOf(q)>=0||low(p.en).indexOf(q)>=0||(alias&&p.ru==alias)||String(p.no)==q});
  g.innerHTML=L.length?L.map(function(p){return '<button type="button" class="pp-po'+(p.ru==st.pal?' on':'')+'" data-pal="'+e(p.ru)+'">'+img(p,56)+'<span>'+e(p.ru)+'</span></button>'}).join(''):'<p class="pp-muted">Никого не нашлось. Попробуй по-английски или короче.</p>'}
var rf='';
function fillPas(q){var g=document.getElementById('pp-sgrid');if(!g)return;q=low(q).trim();
  var L=T.pas.filter(function(s){if(rf=='4'&&s.r<4)return false;if(rf=='3'&&s.r!=3)return false;if(rf=='1'&&!(s.r==1||s.r==2))return false;if(rf=='neg'&&s.r>0)return false;
    return !q||low(s.n).indexOf(q)>=0||low(s.en).indexOf(q)>=0||low(s.d).indexOf(q)>=0}).sort(function(a,b){return b.r-a.r||a.n.localeCompare(b.n,'ru')});
  g.innerHTML=L.length?L.map(function(s){var on=st.sel.indexOf(s.n)>=0;return '<button type="button" class="pp-so'+(on?' on':'')+'" data-pas="'+e(s.n)+'" aria-pressed="'+on+'"'+(!on&&st.sel.length>=4?' disabled':'')+'><span class="pp-sot">'+rk(s.r)+'<b>'+e(s.n)+'</b></span><span class="pp-sod">'+e(short(s.d))+'</span><span class="pp-sos">'+srcTag(s)+'</span></button>'}).join(''):'<p class="pp-muted">Ничего не нашлось.</p>'}
function short(d){d=String(d||'').split(';').map(function(x){return x.trim()}).filter(function(x){return x&&!/Мирового Древа/.test(x)});var s=d.slice(0,2).join(' · ');return s.length>70?s.slice(0,68)+'…':s}
/* ---------- где взять ---------- */
function carriersWild(n){// дикие палы, у которых пассивка фиксирована
  return (PAS[n].nat||[]).filter(function(x){return PAL[x]})}
function cardWhere(n){var s=PAS[n],k=kind(s),p=st.pal&&PAL[st.pal],rows=[];
  var own=p&&(p.natp||[]).some(function(x){return x[0]==n});
  if(own)rows.push(row('✅','У «'+e(p.ru)+'» есть от рождения','Каждый «'+e(p.ru)+'» уже с ней — ловить и выводить не нужно.'));
  if(s.nat&&s.nat.length){var c=carriersWild(n);rows.push(row('🐾','От рождения у '+c.length+' '+plural(c.length,'пала','палов','палов'),'<div class="pp-chips">'+c.slice(0,more['n'+n]?99:6).map(function(x){return palA(x)}).join('')+(c.length>6&&!more['n'+n]?'<button type="button" class="pp-more" data-more="n'+e(n)+'">Ещё '+(c.length-6)+'</button>':'')+'</div>'))}
  if(k=='wild'){var w=[];if(p&&p.hab&&p.hab.wild)w.push(p.ru);(PROD[st.pal]||[]).slice(0,30).forEach(function(q){q.forEach(function(x){if(w.length<4&&w.indexOf(x)<0&&PAL[x]&&PAL[x].hab&&PAL[x].hab.wild)w.push(x)})});
    rows.push(row('🌿','Случайно у диких палов и альф','Может выпасть у любого дикого пала, в том числе у альфы. Отдельного источника в данных paldb нет. Совет: лови много и смотри пассивки на экране поимки.'+(w.length?'<div class="pp-chips">'+w.map(function(x){return palA(x)}).join('')+'</div><span class="pp-note">Удобнее всего ловить '+(p?'«'+e(p.ru)+'» или его родителей':'нужный вид')+': пассивку не придётся переносить на другой вид.</span>':'')))}
  if(k=='special'&&s.en=='Lucky')rows.push(row('✨','Только у «удачливых» палов','В дикой природе бывает лишь у редких сверкающих палов (они крупнее и светятся). Дальше передаётся разведением. <a href="'+WIKI_PS+'" target="_blank" rel="noopener">wiki.gg</a>'));
  if(k=='special'&&s.en!='Lucky'&&!(s.nat&&s.nat.length))rows.push(row('✨','Случайно не выпадает','Есть только у определённых палов, дальше переносится разведением.'));
  if(s.how=='gold')rows.push(row('<img src="'+R+'pp/items/gold-coin-64.webp" width="24" height="24" alt="">','Стол хирургии: '+fmt(s.gold)+' золота','Можно поставить уже готовому палу, без разведения. Выгодно оставить её на конец: чем меньше пассивок у родителей, тем выше шанс на остальные. <a href="'+PALDB_S+'" target="_blank" rel="noopener">paldb</a>'));
  if(k=='impl'||k=='mut'){var dr=(s.drops||[]).map(function(d){return '<span class="gc-b">'+relic(d[0])+e(d[0])+' · '+e(d[1])+'</span>'}).join('');
    rows.push(row('💠','Одноразовый имплант','Выпадает из переработки древних реликвий'+(dr?':<div class="pp-chips">'+dr+'</div>':'.')+'Ещё её носят дикие палы с голубой аурой у Мирового Древа и палы из Зловещих яиц. <a href="'+WIKI_PS+'" target="_blank" rel="noopener">wiki.gg</a>'))}
  if(k=='mut')rows.push(row('🧪','Мутировавшее яйцо','Эксклюзив мутации: изредка появляется в мутировавшем яйце при разведении. <a href="'+WIKI+'" target="_blank" rel="noopener">wiki.gg</a>'));
  return '<div class="gc pp-wcard"><div class="gc-t">'+rk(s.r)+'<span class="pp-wt"><b><a href="'+R+s.url+'">'+e(n)+'</a></b><span class="gc-sub">'+rkTxt(s.r)+' · '+e(short(s.d))+'</span></span></div><div class="pp-rows">'+rows.join('')+'</div></div>'}
function relic(n){var f=/Сияющ/.test(n)?'glistening-ancient-relic':/Светящ|Мерцающ/.test(n)?'dormant-ancient-relic':'decayed-ancient-relic';return '<img src="'+R+'pp/items/'+f+'-64.webp" width="18" height="18" alt="">'}
function row(ic,t,b){return '<div class="pp-row"><span class="pp-ric">'+ic+'</span><div><b>'+t+'</b><div class="pp-rb">'+b+'</div></div></div>'}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function plural(n,a,b,c){var m=n%10,mm=n%100;return m==1&&mm!=11?a:m>=2&&m<=4&&(mm<10||mm>=20)?b:c}
/* ---------- план ---------- */
function plan(){var p=PAL[st.pal],nat=(p.natp||[]).map(function(x){return x[0]});
  var need=st.sel.filter(function(n){return nat.indexOf(n)<0});
  var late=need.filter(function(n){return PAS[n].how=='gold'});
  var br=need.filter(function(n){return late.indexOf(n)<0});
  // если все пассивки — хирургия, их всё равно можно развести; но дешевле в конце
  var steps=[],prod=PROD[st.pal]||[];
  // шаг 1: пара вида
  var b1='';
  if(p.hab&&p.hab.wild)b1+='<p>Лови в дикой природе'+(p.hab.lv?': ур. '+p.hab.lv[0]+'–'+p.hab.lv[1]:'')+(p.hab.rg&&p.hab.rg.length?', '+e(p.hab.rg.slice(0,2).join(', ')):'')+'.</p><div class="pp-chips">'+palA(st.pal,{big:1})+'</div>';
  if(prod.length){var lim=more.prod?prod.length:6;b1+='<p>'+(p.hab&&p.hab.wild?'Или выведи':'В дикой природе не встречается. Выведи')+' из пары ('+prod.length+' '+plural(prod.length,'вариант','варианта','вариантов')+', сверху самые доступные):</p><div class="pp-chips">'+prod.slice(0,lim).map(function(q){return pairChip(q[0],q[1])}).join('')+(prod.length>lim?'<button type="button" class="pp-more" data-more="prod">Ещё '+(prod.length-lim)+'</button>':'')+'</div>'}
  b1+='<p class="pp-note">Нужны самец и самка. Дальше пара «'+e(p.ru)+'» + «'+e(p.ru)+'» всегда даёт «'+e(p.ru)+'».</p>';
  steps.push(['🥚','Получи «'+e(p.ru)+'»: самца и самку',b1]);
  // шаг 2: носители
  br.forEach(function(n){var s=PAS[n],k=kind(s),b='';
    var fix=(s.nat||[]).filter(function(x){return PAL[x]&&x!=st.pal});
    if(fix.length){var X=fix[0],pr=prod.filter(function(q){return q[0]==X||q[1]==X});
      b+='<p>Носитель от рождения: </p><div class="pp-chips">'+fix.slice(0,4).map(function(x){return palA(x)}).join('')+'</div>';
      if(pr.length)b+='<p>Скрести его так, чтобы родился «'+e(p.ru)+'»:</p><div class="pp-chips">'+pr.slice(0,3).map(function(q){return pairChip(q[0],q[1],st.pal)}).join('')+'</div><p class="pp-note">Если у второго родителя нет пассивок, ребёнок получит «'+e(n)+'» без лишних: '+CHANCE[1]+'% за яйцо.</p>';
      else b+='<p>Прямой пары до «'+e(p.ru)+'» нет. Скрести носителя с любым палом из шага 1, чтобы перенести пассивку на родителя, а потом выведи «'+e(p.ru)+'».</p>'}
    else if(s.en=='Lucky')b+='<p>Ищи «удачливых» палов: они крупнее обычных и светятся. Лучше всего — сам «'+e(p.ru)+'» или его родители из шага 1.</p><p class="pp-note">Если попался удачливый пал другого вида, скрести его с палом вида «'+e(p.ru)+'» и бери детей нужного вида.</p>';
    else if(k=='wild'||k=='special')b+='<p>Лови «'+e(p.ru)+'» (или его родителей из шага 1), пока не попадётся с «'+e(n)+'». Смотри пассивки прямо на экране поимки.</p><p class="pp-note">Если пассивка попалась на другом виде, скрести его с палом вида «'+e(p.ru)+'» и бери детей нужного вида. Вид ребёнка определяется по комбо, а не по пассивкам.</p>';
    else b+='<p>Получи имплант «'+e(n)+'» (см. «Где взять») и поставь его на Столе хирургии одному из «'+e(p.ru)+'».</p>';
    steps.push(['🔎','Добудь «'+e(n)+'»',b])});
  // шаг 3: сведение
  if(br.length>=2){var acc=[br[0]];for(var i=1;i<br.length;i++){acc.push(br[i]);var c=CHANCE[acc.length];
    steps.push(['💞','Сведи: '+acc.length+' пассивк'+(acc.length<5?'и':''),'<p>«'+e(p.ru)+'» с «'+e(acc.slice(0,-1).join('», «'))+'» + «'+e(p.ru)+'» с «'+e(br[i])+'».</p><div class="pp-odds"><b>'+c+'%</b><span>шанс за одно яйцо, что ребёнок получит все '+acc.length+' и ни одной лишней. В среднем ~'+Math.ceil(100/c)+' яиц. <a href="'+WIKI+'" target="_blank" rel="noopener">wiki.gg</a></span></div><p class="pp-note">У обоих родителей не должно быть других пассивок. Держи в сундуке ранчо запас тортов. Оставь лучшего ребёнка и пару другого пола.</p>'])}}
  else if(br.length==1)steps.push(['💞','Закрепи пассивку','<p>Получив «'+e(p.ru)+'» с «'+e(br[0])+'», скрести его с чистым «'+e(p.ru)+'» противоположного пола — так появится пара носителей.</p><div class="pp-odds"><b>'+CHANCE[1]+'%</b><span>шанс за яйцо получить ровно эту пассивку без лишних. <a href="'+WIKI+'" target="_blank" rel="noopener">wiki.gg</a></span></div>']);
  if(late.length)steps.push(['🪙','Добавь на Столе хирургии',(br.length?'<p>Когда соберёшь остальное, добавь готовому палу «'+e(p.ru)+'»:</p>':'<p>Разводить не обязательно. Поставь на Столе хирургии:</p>')+'<div class="pp-chips">'+late.map(function(n){return '<span class="gc-b pp-gold">'+e(n)+' · '+fmt(PAS[n].gold)+' 🪙</span>'}).join('')+'</div><p class="pp-note">Итого '+fmt(late.reduce(function(a,n){return a+(PAS[n].gold||0)},0))+' золота. <a href="'+PALDB_S+'" target="_blank" rel="noopener">paldb</a></p>']);
  if(nat.length)steps.push(['✅','Уже есть от рождения','<p>'+e(nat.join(', '))+' есть у каждого пала вида «'+e(p.ru)+'». Это место занято сразу, свободных слотов: '+Math.max(0,4-nat.length)+'.</p>']);
  if(!st.sel.length)steps.push(['➕','Отметь пассивки','<p>Выбери до 4 пассивок выше, и план дополнится шагами сведения с шансами.</p>']);
  return '<ol class="gcg pp-steps" data-cat="pp">'+steps.map(function(s,i){return '<li class="gc pp-step"><div class="gc-t"><span class="pp-num">'+(i+1)+'</span><span class="pp-ic">'+s[0]+'</span><b>'+s[1]+'</b></div><div class="pp-sb">'+s[2]+'</div></li>'}).join('')+'</ol>'}
function mech(){var src='<a href="'+WIKI+'" target="_blank" rel="noopener">wiki.gg · Breeding</a>';
  var c=[
   ['🔢','Сколько наследуется','<p>Пассивки обоих родителей складываются в общий список без дублей. Игра выбирает число X от 1 до 4: <b>1 — 40%</b>, <b>2 — 30%</b>, <b>3 — 20%</b>, <b>4 — 10%</b>. Ребёнок берёт X случайных пассивок из списка (или все, если их меньше).</p>'],
   ['🎲','Шансы и лишние пассивки','<p>Второй бросок Y по тем же шансам: если Y больше X, ребёнку добавляются случайные пассивки. Шанс получить все пассивки родителей и ни одной лишней: 1 — 40%, 2 — 24%, 3 — 12%, 4 — 10%. Не важно, у какого родителя какая пассивка. Дубли у обоих родителей шанс не повышают.</p>'],
   ['<img src="'+R+'pp/items/cake-64.webp" width="28" height="28" alt="">','Торт','<p>Без торта в сундуке Ранчо разведения палы не разводятся. Разведение идёт, пока есть торт и на ранчо меньше 20 яиц. Работоспособность пала на скорость разведения не влияет.</p>'],
   ['⚥','Самец и самка','<p>Нужна пара разного пола. У большинства видов пол 1:1, но у некоторых есть перекос (таблица на вики). Для Каттивы и Викси результат зависит от того, кто из них самка.</p>'],
   ['🔁','Родился не тот вид','<p>Вид ребёнка задаётся только комбо родителей, пассивки на него не влияют. Если вышел другой вид, скрести ребёнка с палом нужного вида: пассивки перейдут, а вид определит комбо. Вид × тот же вид всегда даёт тот же вид.</p>'],
   ['⭐','Альфа и мутация','<p>Выведенный пал с шансом 5% будет альфой, это не наследуется. Изредка выпадает мутировавшее яйцо: в нём всегда 4 пассивки, из них минимум две ранга 4.</p>']];
  return '<div class="gcg pp-mech" data-cat="pp">'+c.map(function(x){return '<div class="gc pp-mc"><div class="gc-t"><span class="pp-ic">'+x[0]+'</span><b>'+x[1]+'</b></div><div class="pp-sb">'+x[2]+'</div><span class="gc-sp">Источник: '+src+'</span></div>'}).join('')+'</div>'}
/* ---------- события ---------- */
function bind(){
  app.querySelectorAll('[data-act]').forEach(function(b){b.onclick=function(){var a=b.getAttribute('data-act');
    if(a=='pal'){open.pal=!open.pal;open.pas=false;render();if(open.pal)focus('pp-qpal')}
    else if(a=='pas'){open.pas=!open.pas;open.pal=false;render();if(open.pas)focus('pp-qpas')}
    else if(a=='clear')set(function(){st.sel=[]})}});
  app.querySelectorAll('[data-rm]').forEach(function(b){b.onclick=function(){var n=b.getAttribute('data-rm');set(function(){st.sel=st.sel.filter(function(x){return x!=n})})}});
  app.querySelectorAll('[data-preset]').forEach(function(b){b.onclick=function(){var p=PAL[st.pal];set(function(){st.sel=(p.bp[b.getAttribute('data-preset')]||[]).filter(function(n){return PAS[n]}).slice(0,4)})}});
  app.querySelectorAll('[data-more]').forEach(function(b){b.onclick=function(){more[b.getAttribute('data-more')]=1;render()}});
  var qp=document.getElementById('pp-qpal');if(qp){fillPal('');qp.oninput=function(){fillPal(qp.value)};
    document.getElementById('pp-pgrid').onclick=function(ev){var t=ev.target.closest('[data-pal]');if(!t)return;open.pal=false;more={};set(function(){st.pal=t.getAttribute('data-pal')})}}
  var qs=document.getElementById('pp-qpas');if(qs){fillPas('');qs.oninput=function(){fillPas(qs.value)};
    app.querySelectorAll('[data-rf]').forEach(function(b){b.onclick=function(){rf=b.getAttribute('data-rf');app.querySelectorAll('[data-rf]').forEach(function(x){x.classList.toggle('on',x==b)});fillPas(qs.value)}});
    document.getElementById('pp-sgrid').onclick=function(ev){var t=ev.target.closest('[data-pas]');if(!t||t.disabled)return;var n=t.getAttribute('data-pas'),v=qs.value;
      set(function(){var i=st.sel.indexOf(n);if(i>=0)st.sel.splice(i,1);else if(st.sel.length<4)st.sel.push(n);if(st.sel.length>=4)open.pas=false});
      var q2=document.getElementById('pp-qpas');if(q2){q2.value=v;fillPas(v);app.querySelectorAll('[data-rf]').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-rf')==rf)})}}}
  app.querySelectorAll('.pp-x').forEach(function(x){x.onkeydown=null});
}
function focus(id){var el=document.getElementById(id);if(el){el.focus({preventScroll:true});el.scrollIntoView({block:'nearest'})}}
document.addEventListener('keydown',function(ev){if(ev.key=='Escape'&&(open.pal||open.pas)){open.pal=open.pas=false;render()}});
if(typeof module!=='undefined')module.exports={kind:kind,CHANCE:CHANCE};
})();
