/* Палпедия · Калькулятор крафта «от А до Я» */
(function(){
var S=document.currentScript,B=(S&&S.getAttribute('data-base'))||'/palwiki/',app=document.getElementById('cr-app');if(!app)return;
var D,EN,st={i:null,n:1,v:{},h:{},open:{}};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function it(id){return D.items[id]||{ru:id,en:id}}
function ic(id,sz){var x=it(id);return x.ic?'<img src="'+B+x.ic+'" alt="" width="'+sz+'" height="'+sz+'" loading="lazy" decoding="async">':'<span class="cr-noic" aria-hidden="true">?</span>'}
function fmt(n){return Number(n).toLocaleString('ru-RU')}
var RL=['Обычный','Необычный','Редкий','Эпический','Легендарный'];
function vlab(x,k){return x.r.length===5?RL[k]:'Вариант '+(k+1)}
function readURL(){var u=new URLSearchParams(location.search);var i=EN.find(u.get('i')||u.get('item'));st.i=i&&D.items[i].r?i:null;st.n=Math.max(1,Math.min(9999,parseInt(u.get('qty')||u.get('n'))||1));
 (u.get('v')||'').split(',').forEach(function(p){var a=p.split(':');var id=EN.find(a[0]);if(id)st.v[id]=parseInt(a[1])||0});
 (u.get('h')||'').split(',').forEach(function(p){var id=EN.find(p);if(id)st.h[id]=1});}
function url(){var q=new URLSearchParams();if(st.i)q.set('item',st.i);q.set('qty',st.n);var v=Object.keys(st.v).filter(function(k){return st.v[k]}).map(function(k){return k+':'+st.v[k]});if(v.length)q.set('v',v.join(','));var h=Object.keys(st.h).filter(function(k){return st.h[k]});if(h.length)q.set('h',h.join(','));var s=q.toString();return location.pathname+(s?'?'+s:'')}
function save(){try{history.replaceState(null,'',url())}catch(e){}}
function have(){var o={};for(var k in st.h)if(st.h[k])o[k]=1e12;return o}
/* ---- выбор предмета ---- */
var LIST=[];
function picker(){var x=st.i?it(st.i):null;
 return '<div class="cr-pick cr-card"><div class="cr-f1"><label class="cr-lab" for="cr-q">Что скрафтить</label><div class="cr-cur">'+(x?ic(st.i,40)+'<span><b>'+esc(x.ru)+'</b><small>'+esc(x.t||'')+(x.r[0].tl?' · технология ур. '+x.r[0].tl:'')+'</small></span>':'<span class="cr-mut">Предмет не выбран</span>')+'</div>'
 +'<div class="cr-ac"><input id="cr-q" type="search" role="combobox" aria-expanded="false" aria-controls="cr-lb" aria-autocomplete="list" autocomplete="off" placeholder="Поиск: «лучемёт», «слиток», Beam…"><ul id="cr-lb" role="listbox" aria-label="Предметы" hidden></ul></div></div>'
 +'<div class="cr-qty"><label class="cr-lab" for="cr-n">Сколько</label><div class="cr-stp"><button type="button" class="cr-btn" data-d="-1" aria-label="Меньше">−</button><input id="cr-n" type="number" inputmode="numeric" min="1" max="9999" value="'+st.n+'"><button type="button" class="cr-btn" data-d="1" aria-label="Больше">+</button></div><div class="cr-quick" role="group" aria-label="Быстрый выбор количества">'+[1,5,10,50,100].map(function(v){return '<button type="button" class="cr-btn" data-set="'+v+'" aria-pressed="'+(st.n===v)+'">×'+v+'</button>'}).join('')+'</div></div>'
 +(x&&x.r.length>1?'<div class="cr-vars"><span class="cr-lab" id="cr-vl">Рецепт</span><div class="cr-seg" role="radiogroup" aria-labelledby="cr-vl">'+x.r.map(function(r,k){return '<button type="button" role="radio" aria-checked="'+((st.v[st.i]|0)===k)+'" data-vi="'+st.i+'" data-k="'+k+'">'+vlab(x,k)+'</button>'}).join('')+'</div></div>':'')
 +'</div>'}
function search(q){q=q.trim().toLowerCase();if(!q)return LIST.slice(0,0);var a=[],b=[];LIST.forEach(function(id){var x=D.items[id],r=x.ru.toLowerCase(),e=x.en.toLowerCase();if(r.indexOf(q)===0||e.indexOf(q)===0)a.push(id);else if(r.indexOf(q)>0||e.indexOf(q)>0)b.push(id)});return a.concat(b).slice(0,40)}
function bindPick(){var q=app.querySelector('#cr-q'),lb=app.querySelector('#cr-lb'),act=-1,res=[];
 function draw(){lb.innerHTML=res.length?res.map(function(id,k){var x=D.items[id];return '<li role="option" id="cr-o'+k+'" aria-selected="'+(k===act)+'" data-id="'+id+'">'+ic(id,32)+'<span>'+esc(x.ru)+'<small>'+esc(x.en)+(x.r[0].tl?' · ур. '+x.r[0].tl:'')+'</small></span></li>'}).join(''):'<li class="cr-none" role="option" aria-disabled="true">Ничего не найдено среди крафтящихся предметов</li>';lb.hidden=!q.value.trim();q.setAttribute('aria-expanded',String(!lb.hidden));q.setAttribute('aria-activedescendant',act>=0?'cr-o'+act:'')}
 function pick(id){st.i=id;st.open={};save();render();var n=app.querySelector('#cr-n');n&&n.focus()}
 q.addEventListener('input',function(){res=search(q.value);act=res.length?0:-1;draw()});
 q.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();act=Math.min(res.length-1,act+1);draw()}else if(e.key==='ArrowUp'){e.preventDefault();act=Math.max(0,act-1);draw()}else if(e.key==='Enter'&&act>=0&&res[act]){e.preventDefault();pick(res[act])}else if(e.key==='Escape'){lb.hidden=true;q.setAttribute('aria-expanded','false')}});
 lb.addEventListener('click',function(e){var o=e.target.closest('[data-id]');o&&pick(o.getAttribute('data-id'))});
 q.addEventListener('blur',function(){setTimeout(function(){lb.hidden=true;q.setAttribute('aria-expanded','false')},180)});
 var n=app.querySelector('#cr-n');n.addEventListener('change',function(){st.n=Math.max(1,Math.min(9999,parseInt(n.value)||1));save();render(true)});
 app.querySelectorAll('[data-set]').forEach(function(b){b.onclick=function(){st.n=+b.getAttribute('data-set');save();render(true,'[data-set="'+b.getAttribute('data-set')+'"]')}});
 app.querySelectorAll('.cr-stp .cr-btn').forEach(function(b){b.onclick=function(){st.n=Math.max(1,Math.min(9999,st.n+(+b.getAttribute('data-d'))));save();render(true,'[data-d="'+b.getAttribute('data-d')+'"]')}});}
/* ---- дерево ---- */
function station(r){return r.st&&r.st.length?r.st[0]:'станок не указан'}
function chip(n){var m=(D.st&&D.st[n])||{};return '<span class="cr-chip">'+(m.ic?'<img src="'+B+m.ic+'" alt="" width="20" height="20" loading="lazy">':'⚒ ')+esc(n)+(m.tl?' <i>ур. '+m.tl+'</i>':'')+'</span>'}
function stChips(r){if(!r.st||!r.st.length)return '<span class="cr-chip cr-warn">станок не указан в источнике</span>';var h=chip(r.st[0]);if(r.st.length>1)h+='<details class="cr-stm"><summary aria-label="Ещё станки: '+(r.st.length-1)+'">+'+(r.st.length-1)+'</summary><span class="cr-stl">'+r.st.slice(1).map(chip).join('')+'</span></details>';return h}
function node(n,path,depth){var x=it(n.id),kid=n.kids&&n.kids.length,key=path,op=st.open[key]!==undefined?st.open[key]:(st.all||depth<1);
 var meta='';if(n.cycle)meta='<span class="cr-tag cr-warn">цикл в рецепте — дальше не раскрываем</span>';
 else if(n.r){meta=(n.runs?stChips(n.r)+(n.r.tl?'<span class="cr-tag">технология ур. '+n.r.tl+'</span>':'')+(n.r.y>1?'<span class="cr-tag">'+n.runs+' крафт. × '+n.r.y+'</span>':'')+(n.r.yu?'<span class="cr-tag cr-warn">выход за крафт не указан, считаю ×1</span>':''):'')+(n.have?'<span class="cr-tag cr-ok">есть: '+fmt(n.have)+'</span>':'');}
 else meta=(x.rk||x.w?'<span class="cr-tag cr-raw">сырьё</span>':'<span class="cr-tag cr-warn">рецепта нет в источниках</span>')+'<span class="cr-lw">'+where(n.id)+'</span>';
 var h='<li role="treeitem" aria-level="'+(depth+1)+'"'+(kid?' aria-expanded="'+op+'"':'')+' data-k="'+esc(key)+'"><div class="cr-node'+(n.need<=0?' cr-done':'')+'">'
 +(kid?'<button type="button" class="cr-tg" aria-label="'+(op?'Свернуть':'Раскрыть')+' '+esc(x.ru)+'" data-k="'+esc(key)+'">'+(op?'▾':'▸')+'</button>':'<span class="cr-tg0" aria-hidden="true"></span>')
 +'<span data-item="'+esc(n.id)+'" class="cr-ni">'+ic(n.id,32)+'</span><span class="cr-nn"><b>'+esc(x.ru)+'</b><span class="cr-tags">'+meta+'</span></span><span class="cr-q">×'+fmt(n.q)+'</span></div>';
 if(kid&&op)h+='<ul role="group">'+n.kids.map(function(c,k){return node(c,key+'.'+k,depth+1)}).join('')+'</ul>';return h+'</li>'}
/* ---- сырьё: где добыть ---- */
function where(id){var x=it(id),s=x.w||{},o=[];if(s.how)o.push('<span class="cr-how">'+esc(s.how)+'</span>');
 if(s.ore)o.push('<a href="'+B+'map/?layer=ore">⛏ Руда на карте</a>');
 (s.pals||[]).slice(0,3).forEach(function(p){o.push(p[1]?'<a href="'+B+p[1]+'">'+esc(p[0])+'</a>'+(p[2]?' '+esc(p[2]):''):esc(p[0]))});
 if(s.pals&&s.pals.length>3)o.push('<a href="'+B+(x.u||'')+'">ещё '+(s.pals.length-3)+'</a>');
 if(s.m)o.push('у торговцев');if(x.u&&!(s.pals&&s.pals.length>3))o.push('<a href="'+B+x.u+'">о предмете</a>');if(s.cr)o.push('крафт (см. рецепт)');
 return o.length?o.join(' · '):'<span class="cr-mut">где добыть — нет данных в базе</span>'}
function card(id,q,extra,cls){var x=it(id);return '<div class="cr-card cr-it '+(cls||'')+'"><div class="cr-ih"><span data-item="'+esc(id)+'" class="cr-ni">'+ic(id,40)+'</span><span class="cr-nn"><b>'+esc(x.ru)+'</b><span class="cr-big">×'+fmt(q)+'</span></span></div><div class="cr-ib">'+extra+'</div></div>'}
function render(keep,focusSel){var f=document.activeElement&&document.activeElement.id;
 var h=picker();
 if(st.i){var o={vars:st.v,have:have()},t=EN.tree(st.i,st.n,o),s=EN.summary(st.i,st.n,o);
  h+='<div class="cr-acts"><button type="button" class="cr-btn cr-main" id="cr-share">🔗 Поделиться</button><button type="button" class="cr-btn" id="cr-all">Раскрыть всё</button><button type="button" class="cr-btn" id="cr-none">Свернуть всё</button><span id="cr-msg" class="cr-mut" role="status" aria-live="polite"></span></div>';
  h+='<section class="cr-sec" aria-labelledby="cr-h1"><h2 id="cr-h1">Дерево крафта</h2><div class="cr-card cr-treebox"><ul role="tree" class="cr-tree" aria-labelledby="cr-h1">'+node(t,'0',0)+'</ul></div></section>';
  var raw=Object.keys(s.raw).filter(function(k){return s.raw[k]>0}).sort(function(a,b){return s.raw[b]-s.raw[a]});
  h+='<section class="cr-sec" aria-labelledby="cr-h2"><h2 id="cr-h2">Итого сырья</h2><div class="cr-grid">'+(raw.length?raw.map(function(id){var x=it(id);return card(id,s.raw[id],(x.r?'<span class="cr-tag cr-warn">из-за цикла в рецепте считается как сырьё</span>':'')+(!x.r&&!x.rk&&!(x.w&&(x.w.pals||x.w.ore||x.w.m))?'<span class="cr-tag cr-warn">рецепта нет в источниках</span>':'')+'<p class="cr-where">'+where(id)+'</p>')}).join(''):'<p class="cr-mut">Всё уже есть — сырьё не нужно.</p>')+'</div></section>';
  var inter=s.inter;
  h+='<section class="cr-sec" aria-labelledby="cr-h3"><h2 id="cr-h3">Промежуточные крафты — по порядку</h2>'+(inter.length?'<div class="cr-grid cr-steps">'+inter.map(function(c,k){var x=it(c.id),r=EN.recipe(c.id,st.v);return card(c.id,c.q,'<p class="cr-step">Шаг '+(k+1)+(r.tl?' · технология ур. '+r.tl:'')+(c.y>1?' · '+c.runs+' крафт. по '+c.y:'')+'</p><p class="cr-chips">'+stChips(r)+'</p>'+(x.r.length>1?'<p><label class="cr-mut">Рецепт: <select data-vi="'+c.id+'">'+x.r.map(function(rr,k2){return '<option value="'+k2+'"'+((st.v[c.id]|0)===k2?' selected':'')+'>'+vlab(x,k2)+'</option>'}).join('')+'</select></label></p>':'')+'<label class="cr-have"><input type="checkbox" data-h="'+c.id+'"> уже есть в инвентаре</label>')}).join('')+'</div>':'<p class="cr-mut">Нет промежуточных крафтов.</p>');
  var hv=Object.keys(st.h).filter(function(k){return st.h[k]});if(hv.length)h+='<div class="cr-grid">'+hv.map(function(id){return card(id,0,'<label class="cr-have"><input type="checkbox" data-h="'+id+'" checked> уже есть в инвентаре</label>','cr-dim')}).join('')+'</div>';
  h+='</section>';
  var sts=Object.keys(s.stations);var top=EN.recipe(st.i,st.v);
  h+='<section class="cr-sec" aria-labelledby="cr-h4"><h2 id="cr-h4">Станки и технологии</h2><div class="cr-grid">'+sts.map(function(k){var a=s.stations[k];return '<div class="cr-card cr-stc"><p class="cr-chips">'+stChips({st:a.all})+'</p><p class="cr-mut">'+(a.all.length>1?'Минимальный станок; остальные под «+'+(a.all.length-1)+'».':'Единственный станок.')+'</p><p>'+a.items.map(function(i){var r=s.tech[i];return esc(it(i).ru)+(r?' <span class="cr-tag">ур. '+r+'</span>':'')}).join(', ')+'</p></div>'}).join('')+'</div><p class="cr-mut">Максимальный уровень технологии в цепочке: <b>'+(s.maxTech||'—')+'</b>.'+(s.cycles.length?' В рецептах есть цикл, он не раскрывается.':'')+'</p></section>';
  h+='<p class="cr-src">Рецепты: paldb.cc (данные игры 1.0.5), дополнительно wiki.gg. Станок в карточке — первый из подходящих; остальные указаны в блоке «Станки».</p>';
 }else h+='<div class="cr-card cr-empty"><p>'+(new URLSearchParams(location.search).get('item')?'Предмет «'+esc(new URLSearchParams(location.search).get('item'))+'» не найден среди крафтящихся. ':'')+'Выбери предмет — например, <a href="?item=beam-launcher&qty=1">Лучемёт</a>, <a href="?item=plasma-rifle&qty=1">Плазменная винтовка</a> или <a href="?item=wing-pack&qty=1">Крылатый ранец</a>.</p></div>';
 app.innerHTML=h;bindPick();bind();
 if(focusSel){var e=app.querySelector(focusSel);e&&e.focus()}else if(keep&&f){var e2=document.getElementById(f);e2&&e2.focus()}}
function bind(){
 app.querySelectorAll('[data-vi]').forEach(function(b){var ch=function(k){st.v[b.getAttribute('data-vi')]=k;save();render(false,b.tagName==='SELECT'?'select[data-vi="'+b.getAttribute('data-vi')+'"]':'[data-vi="'+b.getAttribute('data-vi')+'"][data-k="'+k+'"]')};if(b.tagName==='SELECT')b.onchange=function(){ch(+b.value)};else b.onclick=function(){ch(+b.getAttribute('data-k'))}});
 app.querySelectorAll('[data-h]').forEach(function(c){c.onchange=function(){st.h[c.getAttribute('data-h')]=c.checked?1:0;save();render(false,'[data-h="'+c.getAttribute('data-h')+'"]')}});
 app.querySelectorAll('.cr-tg').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-k'),li=b.closest('li');st.open[k]=li.getAttribute('aria-expanded')!=='true';render(false,'.cr-tg[data-k="'+k+'"]')}});
 var sh=app.querySelector('#cr-share');if(sh)sh.onclick=function(){save();var u=location.href,m=app.querySelector('#cr-msg');(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){m.textContent='Ссылка скопирована'},function(){m.textContent=u})};
 var al=app.querySelector('#cr-all');if(al)al.onclick=function(){st.open={};st.all=true;render(false,'#cr-all')};
 var no=app.querySelector('#cr-none');if(no)no.onclick=function(){st.open={'0':false};st.all=false;render(false,'#cr-none')};
 var tr=app.querySelector('.cr-tree');if(tr)tr.addEventListener('keydown',function(e){var b=e.target.closest('.cr-tg');if(!b)return;var li=b.closest('li');if((e.key==='ArrowRight'&&li.getAttribute('aria-expanded')==='false')||(e.key==='ArrowLeft'&&li.getAttribute('aria-expanded')==='true')){e.preventDefault();b.click()}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();var all=[].slice.call(app.querySelectorAll('.cr-tg')),i=all.indexOf(b);var n=all[i+(e.key==='ArrowDown'?1:-1)];n&&n.focus()}});}
fetch(B+'assets/craft/craft.json').then(function(r){return r.json()}).then(function(d){D=d;EN=new CraftEngine(d);LIST=Object.keys(d.items).filter(function(k){return d.items[k].r}).sort(function(a,b){return d.items[a].ru.localeCompare(d.items[b].ru,'ru')});readURL();render()}).catch(function(){app.innerHTML='<p class="cr-card">Не удалось загрузить рецепты. Обнови страницу.</p>'});
})();
