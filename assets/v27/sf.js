/* SEARCHFIX: просторечные синонимы, непустой блок ответа, линейные иконки, карта: слои и обитание */
(function(){
var S=document.currentScript&&document.currentScript.src||'';var B=(S.match(/^https?:\/\/[^\/]+(\/.*?)assets\//)||[])[1]||window.PW_BASE||'/palwiki/';
var SL=[
 [/^(конь|коня|коню|конем|коне|кони|коней|коням|конями|конях|коник|коника|лошад|кобыл|жереб|скакун|пегас)/,'Лошади',['Starryon','Starryon Primo','Pyrin','Pyrin Noct','Univolt','Univolt Cryst','Gildane','Frostallion','Frostallion Noct','Paladius','Necromus','Azurmane']],
 [/^(единорог)/,'Единороги',['Univolt','Univolt Cryst','Azurmane','Paladius']],
 [/^(лиса|лисы|лису|лис|лисой|лисиц\S*|лисен\S*)$/,'Лисы',['Foxparks','Foxparks Cryst','Kitsun','Kitsun Noct','Vixy','Wixen','Wixen Noct','Foxcicle']],
 [/^(кит|кита|киты|китов|китом)$/,'Киты',['Whalaska','Whalaska Ignis']],
 [/^(дракон|драко|змей)/,'Драконы',['Jetragon','Elphidran','Elphidran Aqua','Quivern','Quivern Botan','Jormuntide','Jormuntide Ignis','Astegon','Orserk','Faleris','Shaolong','Vanwyrm','Vanwyrm Cryst','Chillet','Dazzi']],
 [/^(пингв)/,'Пингвины',['Pengullet','Pengullet Lux','Penking','Penking Lux']],
 [/^(овц|овеч|баран|барашк)/,'Овцы',['Lamball','Woolipop']],
 [/^(куриц|курочк|куры|кур|петух|цыпл)$/,'Курицы',['Chikipi']],
 [/^(кот|кота|коты|котов|коту|котом|кошк\S*|кошак\S*|котик\S*|котен\S*|котя\S*)$/,'Кошки',['Cattiva','Grintale','Mau','Mau Cryst','Katress','Katress Ignis','Nyafia','Cryolinx','Cryolinx Terra']],
 [/^(волк\S*|собак\S*|пес|песик\S*|пса|псы|щен\S*)$/,'Волки и собаки',['Direhowl','Loupmoon','Loupmoon Cryst','Rayhound','Rayhound Cryst','Blazehowl','Blazehowl Noct','Pupperai','Mimog']],
 [/^(олен\S*|лось|лося|лоси|лосей)$/,'Олени',['Eikthyrdeer','Eikthyrdeer Terra','Celesdir','Celesdir Noct','Reindrix','Fenglope','Fenglope Lux']],
 [/^(сова|совы|сову|совой|сов|совушк\S*|филин\S*)$/,'Совы',['Hoocrates']],
 [/^(утк|утён|утен|селезн)/,'Утки',['Fuack','Fuack Ignis']],
 [/^(панд\S*)$/,'Панды',['Mossanda','Mossanda Lux']],
 [/^(медвед|мишк)/,'Медведи',['Grizzbolt','Kikit','Polapup','Polapup Terra']],
 [/^(мамонт|слон)/,'Мамонты и слоны',['Mammorest','Mammorest Cryst','Teafant']],
 [/^(альпак|лам[аыу]?$)/,'Альпаки',['Melpaca','Kingpaca','Kingpaca Cryst']],
 [/^(коров\S*|бык|быка|быки|быков)$/,'Коровы',['Mozzarina','Bulldosu']],
 [/^(пчел\S*|пчёл\S*)$/,'Пчёлы',['Beegarde','Elizabee']],
 [/^(черепах)/,'Черепахи',['Turtacle','Turtacle Terra','Digtoise','Tetroise','Tetroise Primo']],
 [/^(акул\S*)$/,'Акулы',['Gobfin','Gobfin Ignis']],
 [/^(лев|льва|львы|львов|львом|львиц\S*)$/,'Львы',['Renjishi','Panthalus']],
 [/^(кролик|заяц|зайц|зайк)/,'Кролики',['Ribbuny','Ribbuny Botan']],
 [/^(мышь|мыши|мышей|мышку|мышка|летуч\S*)$/,'Летучие мыши',['Tombat','Felbat','Cave Bat']],
 [/^(еж|ежа|ежи|ежик\S*|ёж|ёжик\S*)$/,'Ежи',['Jolthog','Jolthog Cryst']],
 [/^(обезья|горилл|мартыш)/,'Обезьяны',['Tanzee','Tanzee Ignis','Gorirat','Gorirat Terra']],
 [/^(птиц\S*|птичк\S*|орел|орла|орлы|орлов)$/,'Птицы',['Nitewing','Ragnahawk','Beakon','Galeclaw','Cawgnito']],
 [/^(динозав\S*|дино|ящер\S*)$/,'Динозавры',['Dinossom','Dinossom Lux','Relaxaurus','Relaxaurus Lux','Reptyro']],
 [/^(кальмар|осьмин)/,'Кальмары',['Killamari','Killamari Primo']],
 [/^(рыба|рыбы|рыбу|рыб|рыбк\S*|рыбин\S*)$/,'Рыбы',['Gobfin','Ghangler','Finsider']]
];
var nrm=function(s){return String(s||'').toLowerCase().replace(/ё/g,'е')};
var STOP=/^(где|искать|найти|поймать|ловить|словить|взять|водится|живет|обитает|как|мне|на|в|карте|карта|найду|ищу|нужен|нужна|можно|есть)$/;
function slang(q){var w=nrm(q).split(/[^a-zа-я0-9]+/).filter(Boolean);if(w.length>1&&!w.some(function(x){return /^(где|искать|ищу|найти|найду|поймать|ловить|словить|водится|живет|обитает|обитания|ареал|спавн|встретить)$/.test(x)}))return null;for(var i=0;i<w.length;i++){if(STOP.test(w[i]))continue;for(var j=0;j<SL.length;j++)if(SL[j][0].test(w[i]))return {w:w[i],g:SL[j]}}return null}
window.PW_slang=slang;
var D=null;function data(){if(D)return;try{var f=window.PW_load||window.PW_data;f&&f().then(function(d){D=d})}catch(e){}}
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var IC={
 db:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
 pin:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.4-6-10a6 6 0 0 1 12 0c0 4.6-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>',
 moon:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
 sun:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 tree:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22v-7M7 15h10l-5-11z"/></svg>',
 map:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/></svg>',
 x:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 spark:'<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>'
};
window.PW_sfic=IC;
function palsOf(g){var P=(D&&D.pals)||[];return g[2].map(function(en){return P.find(function(p){return p.en==en})}).filter(function(p){return p&&p.url})}
function renderSlang(a){var ps=a.pals;if(!ps.length)return '';return '<div class="sa sf-ans"><div class="sa-k">Где найти · '+esc(a.g[1])+'</div><div class="sf-grid">'+ps.slice(0,8).map(function(p){return '<div class="sf-pc"><a class="sx-ans sf-pl" href="'+B+p.url+'"><img src="'+B+p.thumb+'" width="44" height="44" alt="" loading="lazy"><b>'+esc(p.ru)+'</b></a><a class="sf-mapb" href="'+B+'map/?pal='+encodeURIComponent(p.id)+'">'+IC.pin+'На карте</a></div>'}).join('')+'</div></div>'}
function realContent(h){if(!h)return false;var d=document.createElement('div');d.innerHTML=h;d.querySelectorAll('.sa-k').forEach(function(x){x.remove()});return (d.textContent||'').replace(/\s+/g,'').length>=8||d.querySelector('a[href],img')}
var FQ=[{re:/((^|[^а-яё])крыл|джетпак|jet ?pack|пропеллер|wing ?pack|ранц|летать без пал|летать сам|полет без пал|полёт без пал|как летать)/i,k:'Крылатый ранец (Wing Pack)',h:function(){var u=B+'4_spravochniki/predmety/глайдеры/#крылатый-ранец',c=B+'4_spravochniki/predmety/расходник/';return '<p><b>Крылатый ранец</b> — легендарный глайдер для настоящего полёта без летающего пала. Рецепт открывается на <b>80 уровне</b> (технология «Крылатый ранец»).</p><ul><li><b>Крафт</b> на Древнем верстаке: Осколок палдиума ×30, Палкизитовый слиток ×6, Ядро ИИ ×20, Термоядро ×20, Ядро древней цивилизации ×10.</li><li><b>Топливо</b> — Крыловая энергоячейка (тоже с 80 ур., Древний верстак: Таинственная древесина + Сырая нефть). Без ячеек ранец не летит.</li><li><b>Как надеть</b>: положи в слот глайдера в снаряжении.</li><li><b>Полёт</b>: ранец даёт настоящий полёт куда угодно без летающего пала и освобождает место в команде. Тяга расходует ячейки; во время полёта выносливость восстанавливается. Это последний глайдер в игре (легендарный, вес 25).</li></ul><p><a class="sx-ans" href="'+u+'">Крылатый ранец</a> · <a class="sx-ans" href="'+c+'">Крыловая энергоячейка</a> · <a class="sx-ans" href="'+B+'4_spravochniki/predmety/глайдеры/">Все глайдеры</a></p>'}}];
window.PW_sfFaq=function(q){return faqOf(q)};function faqOf(q){q=String(q||'');for(var i=0;i<FQ.length;i++)if(FQ[i].re.test(q))return FQ[i];return null}
function hook(){var C=window.PW_core,R=window.PW_render;if(!C||!C.answer||!R)return false;if(C.__sf)return true;C.__sf=1;data();
 var oa=C.answer;C.answer=function(q){var f=faqOf(q);if(f)return {q:q,type:'sf_faq',f:f};var s=slang(q),a=null;try{a=oa.apply(C,arguments)}catch(e){a=null}
  if(s){var direct=a&&a.pal&&s.g[2].indexOf(a.pal.en)>=0;if(!direct){var ps=palsOf(s.g);if(ps.length)return {q:q,type:'sf_slang',g:s.g,pals:ps}}}return a};
 window.PW_render=function(a){if(a&&a.type=='sf_slang')return renderSlang(a);if(a&&a.type=='sf_faq')return '<div class="sa sf-ans sf-faq"><div class="sa-k">'+esc(a.f.k)+'</div>'+a.f.h()+'</div>';var h='';try{h=R.apply(this,arguments)}catch(e){h=''}return realContent(h)?h:''};
 if(C.find){var of=C.find;C.find=function(q,t){var s=slang(q);if(s){var ps=palsOf(s.g);if(ps.length&&(!t||t.indexOf('pal')>=0)){var i=((D&&D.pals)||[]).indexOf(ps[0]);if(i>=0)return {t:'pal',ref:i,name:ps[0].ru,sf:1}}}return of.apply(C,arguments)}}
 return true}
var hk=0,ht=setInterval(function(){if(hook()||++hk>200)clearInterval(ht)},50);
/* линейные иконки вместо эмодзи + непустые блоки */
var EMO=/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B50\u2705]\uFE0F?\s?/gu;
function fix(root){
 root.querySelectorAll&&root.querySelectorAll('.ux-tabbar span[aria-hidden]').forEach(function(sp){if(sp.querySelector('svg'))return;var t=sp.textContent.trim();if(/🔍/.test(t))sp.innerHTML='<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>';else if(EMO.test(t)){EMO.lastIndex=0;sp.textContent=t.replace(EMO,'')}EMO.lastIndex=0});
 root.querySelectorAll&&root.querySelectorAll('.ai-tag:not([data-sf])').forEach(function(t){t.dataset.sf=1;t.innerHTML=IC.db+'<span>Ответ из базы</span>'});
 root.querySelectorAll&&root.querySelectorAll('.sx-card.ai').forEach(function(c){var b=c.cloneNode(true);b.querySelectorAll('.ai-tag,.sx-fu,button,.sa-k').forEach(function(x){x.remove()});if((b.textContent||'').replace(/\s+/g,'').length<8&&!b.querySelector('a[href],img'))c.remove()});
 root.querySelectorAll&&root.querySelectorAll('.ux-aibtn:not([data-sf])').forEach(function(t){t.dataset.sf=1;t.innerHTML=IC.spark+'<span>'+esc(t.textContent.replace(EMO,'').trim())+'</span>'});
 root.querySelectorAll&&root.querySelectorAll('.ux-aiav:not([data-sf])').forEach(function(t){t.dataset.sf=1;t.innerHTML=IC.spark});
 root.querySelectorAll&&root.querySelectorAll('.habchip:not([data-sf])').forEach(function(c){c.dataset.sf=1;c.querySelectorAll('span,a').forEach(function(x){var t=x.textContent,ic=/🌙/.test(t)?IC.moon:/☀/.test(t)?IC.sun:/🌳/.test(t)?IC.tree:/🗺/.test(t)?IC.map:/📍/.test(t)?IC.pin:/✕/.test(t)?IC.x:'';if(!ic)return;if(x.tagName=='SPAN'){x.innerHTML=x.innerHTML.replace(/📍\s?/,'');x.insertAdjacentHTML('afterbegin',ic)}else{var l=t.replace(EMO,'').replace('✕','').trim();x.innerHTML=ic+(l?'<span>'+esc(l)+'</span>':'')}})});
}
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType==1){fix(n);if(n.parentNode)fix(n.parentNode)}})})}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',function(){fix(document);data()});
/* скелетон загрузки умного ответа */
/* карта: чипы статуй/подземелий и режим обитания */
function mapFix(){var X=window.PW_map&&window.PW_map.x,bar=document.querySelector('.ux-layers');if(!X||!bar||!X.set||!X.J)return false;if(bar.dataset.sf)return true;bar.dataset.sf=1;
 var hab=/[?&](pal|drop)=/.test(location.search),J=X.J,W=window.PW_map;
 bar.querySelectorAll('[data-tree],[data-na],.sf-x').forEach(function(x){x.remove()});
 var T0={};((window.PW_D||{}).map||[]).forEach(function(p){T0[p.t]=(T0[p.t]||0)+1});
 bar.querySelectorAll('button[data-k]').forEach(function(x){x.classList.add('sf-pp');x.textContent=x.textContent.replace(/^[^А-Яа-яA-Za-z]+/,'');if(T0[x.dataset.k])x.insertAdjacentHTML('beforeend',' <small>'+T0[x.dataset.k]+'</small>')});
 var ST=Object.keys(J).filter(function(k){return /^statue_/.test(k)&&J[k].length});
 var EXT=[['effigy','Статуэтки Лифмунка',['effigy'],1],['statue','Статуи палов',ST,0],['dungeon','Входы в подземелья',['dungeon'],1],['chest','Сундуки',['chest'],0],['ore','Руды',['ore'],0]];
 var been=bar.querySelector('[data-been]');
 EXT.forEach(function(e){var ks=e[2].filter(function(k){return J[k]&&J[k].length});if(!ks.length)return;var n=ks.reduce(function(s,k){return s+J[k].length},0);var on=!hab&&!!e[3];var b=document.createElement('button');b.type='button';b.className='ux-chip sf-x sf-pp'+(on?' on':'');b.dataset.sx=ks.join(',');b.dataset.sfk=e[0];b.setAttribute('aria-pressed',on);b.innerHTML=esc(e[1])+' <small>'+n+'</small>';been?bar.insertBefore(b,been):bar.appendChild(b);ks.forEach(function(k){X.set(k,on)})});
 bar.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('button[data-sx]');if(!b)return;var on=b.getAttribute('aria-pressed')!='true';b.setAttribute('aria-pressed',on);b.classList.toggle('on',on);b.dataset.sx.split(',').forEach(function(k){X.set(k,on);var cb=document.querySelector('.mleg input[data-x="'+k+'"]');if(cb)cb.checked=on})});
 /* вкладка Мировое древо: свои чипы, управляют легендой карты древа */
 function treeChips(){var lg=document.querySelectorAll('#wtree .mleg input[data-k]');if(!lg.length)return false;if(bar.querySelector('.sf-tr'))return true;
  lg.forEach(function(i){var l=i.closest('label'),sm=l&&l.querySelector('small');var b=document.createElement('button');b.type='button';b.className='ux-chip sf-tr'+(i.checked?' on':'');b.dataset.tk=i.dataset.k;b.setAttribute('aria-pressed',i.checked);b.innerHTML=esc((l?l.textContent:'').replace(sm?sm.textContent:'','').replace(/^[^А-Яа-яA-Za-z]+/,'').trim())+(sm?' <small>'+sm.textContent+'</small>':'');b.onclick=function(){var on=!i.checked;i.checked=on;i.dispatchEvent(new Event('change'));b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)};been?bar.insertBefore(b,been):bar.appendChild(b)});return true}
 function tab(){var t=!!document.querySelector('.mapsw [data-w=t].on');document.documentElement.classList.toggle('sf-tree',t);if(t&&!treeChips()){var n=0,iv=setInterval(function(){if(treeChips()||++n>40)clearInterval(iv)},250)}}
 document.querySelectorAll('.mapsw button').forEach(function(x){x.addEventListener('click',function(){setTimeout(tab,50)})});tab();
 /* подписи */
 var NOTE='Статуэтки Лифмунка стоят на постоянных местах: на Палпагосе их 140. Случайны только входы в подземелья: каждый открывается на время в одной из отмеченных точек.';
 function texts(){document.querySelectorAll('.map-note').forEach(function(n){if(n.dataset.sf!=NOTE){n.textContent=document.documentElement.classList.contains('sf-tree')?'На Мировом древе ещё 15 статуэток Лифмунка — их точек пока нет в наших данных.':NOTE;n.dataset.sf=n.textContent}});document.querySelectorAll('.ux-layers .hlp-pop,.v27panel .hlp-pop').forEach(function(n){if(/появляются в разных местах/.test(n.textContent))n.textContent='Нажми на чип, чтобы показать или скрыть точки этого типа. Число — сколько точек в слое.'})}
 texts();setInterval(texts,1500);document.querySelectorAll('.mapsw button').forEach(function(x){x.addEventListener('click',function(){setTimeout(function(){document.querySelectorAll('.map-note').forEach(function(n){n.dataset.sf=''});texts()},80)})});
 if(hab){document.documentElement.classList.add('sf-hab');setTimeout(function(){if(W&&W.dc&&W.T)Object.keys(W.T).forEach(function(k){W.dc.on(k,false)});bar.querySelectorAll('button[data-k]').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')})},900)}
 return true}

/* пассивки чипами с цветом ранга; блоки ролей; ответы прямо в «Спроси про этого пала» */
var RI={'боец':['swords','Боец'],'рабочий':['tool','Рабочий'],'ездовой':['mount','Ездовой']};
IC.swords='<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l9 9M20 4l-9 9M6 15l3 3M18 15l-3 3M4 20l3-3M20 20l-3-3"/></svg>';
IC.tool='<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5a4 4 0 0 0 4.9 4.9L21 12l-9 9-3-3 9-9zM3 21l6-6"/></svg>';
IC.mount='<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18c2-6 6-9 12-9l3-4 1 5-2 2v6M8 18v3M16 18v3"/></svg>';
function psvChip(n){var P=(D&&D.passives)||[];var x=P.find(function(q){return q.name==n});var r=x?x.rank:0;var cls='sf-psv r'+(r<0?'n':Math.max(0,Math.min(5,r)));return x&&x.url?'<a class="'+cls+'" href="'+B+x.url+'" title="'+esc(x.desc||'')+'">'+esc(n)+'</a>':'<span class="'+cls+'">'+esc(n)+'</span>'}
function renderPassives(a){var p=a.pal;var roles=a.role?[a.role]:Object.keys(p.bp||{});return '<div class="sa-k">Лучшие пассивки · '+esc(p.ru)+'</div><div class="sf-roles">'+roles.map(function(r){var ri=RI[r]||['spark',r];return '<div class="sf-role"><div class="sf-role-h">'+(IC[ri[0]]||'')+'<b>'+esc(ri[1])+'</b></div><div class="sf-chips">'+((p.bp[r]||[]).slice(0,4).map(psvChip).join(''))+'</div></div>'}).join('')+'</div><a class="sf-more" href="'+B+'ux/s-passivkami/?pal='+encodeURIComponent(p.ru)+'">Вывести с этими пассивками</a>'}
var R0=null;function hook2(){var R=window.PW_render;if(!R||R.__sf2)return !!R;var f=function(a){if(a&&a.type=='passives'&&a.pal&&a.pal.bp){data();if(D)return renderPassives(a)}return R.apply(this,arguments)};f.__sf2=1;window.PW_render=f;return true}
var h2=0,h2t=setInterval(function(){if((window.PW_core&&window.PW_core.__sf&&hook2())||++h2>200)clearInterval(h2t)},60);
var SWAP=[[/❤️?\s?/g,'HP '],[/⚔️?\s?/g,'Атк '],[/🛡️?\s?/g,'Защ ']];
function deEmoji(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,L=[];while(n=w.nextNode())L.push(n);L.forEach(function(t){var v=t.nodeValue,o=v;SWAP.forEach(function(s){v=v.replace(s[0],s[1])});v=v.replace(EMO,'');if(v!==o)t.nodeValue=v})}
function cleanAns(root){root.querySelectorAll('.dym').forEach(function(d){if(/Уточни роль/.test(d.textContent)&&root.querySelector('.sf-role'))d.remove()});
 root.querySelectorAll('.sx-fu button:not([data-sf])').forEach(function(b){b.dataset.sf=1;var t=b.textContent,ic=/пассив/i.test(t)?IC.spark:/вывест/i.test(t)?(window.PW_sfic.dna||''):/бить/i.test(t)?(IC.target||''):/сравн/i.test(t)?(IC.scale||''):'';b.innerHTML=ic+'<span>'+esc(t.replace(EMO,'').trim())+'</span>'});
 deEmoji(root)}
IC.dna='<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M8.5 7h7M8.5 17h7"/></svg>';
IC.target='<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></svg>';
IC.scale='<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M7 20h10M5 8h14M5 8l-3 6h6zM19 8l-3 6h6z"/></svg>';
window.PW_sfclean=cleanAns;
new MutationObserver(function(){var s=document.getElementById('sxp');if(s&&!s.hidden&&!s.__sfb){s.__sfb=1;cleanAns(s);setTimeout(function(){s.__sfb=0},0)}}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.md-content button[data-q],.md-content a[data-q],.md-content [data-open-search][data-q]');if(!b||b.closest('#sxp,.sx-body')||document.body.hasAttribute('data-gc-home'))return;e.preventDefault();e.stopImmediatePropagation();
 var box=b.closest('.askmini')||b.parentNode.parentNode||b.parentNode,out=box.querySelector(':scope > .sf-askout');if(!out){out=document.createElement('div');out.className='sf-askout';out.setAttribute('aria-live','polite');box.appendChild(out)}
 box.querySelectorAll('button[data-q]').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
 var q=b.dataset.q;out.innerHTML='<div class="sf-skel"></div>';data();
 var go=function(n){var C=window.PW_core,R=window.PW_render;if(!C||!R||!D){if(n<60)return setTimeout(function(){go(n+1)},100);out.innerHTML='<div class="sf-none">Не удалось загрузить ответ. Попробуй ещё раз.</div>';return}
  var h='';try{var a=C.answer(q);if(a&&a.type!='none')h=R(a)}catch(err){h=''}
  if(!h){out.innerHTML='<div class="sf-none"><b>Не нашли ответ</b> Спроси иначе в поиске сверху.</div>';return}
  out.innerHTML='<div class="sf-acard">'+h+'</div>';out.querySelectorAll('.sa-k').forEach(function(k,i){if(i==0)k.classList.add('sf-acard-h')});
  var mini=out.querySelector('.mini');if(mini&&document.querySelector('.gc-card,.pal-card,h1'))mini.remove();
  cleanAns(out);if(window.root&&root.ppHabInit)root.ppHabInit(out)};go(0)},true);

if(document.getElementById('pwmap')||/\/map\//.test(location.pathname)){var mk=0,mt=setInterval(function(){if(mapFix()||++mk>200)clearInterval(mt)},100)}
})();
/* Enter до загрузки ленивого search_data: дождаться результатов и перейти по первому */
document.addEventListener('keydown',function(e){var t=e.target;if(e.key!='Enter'||!t||t.id!='hsq'||e.__sf)return;var s=document.getElementById('sxp');var has=function(){return s&&s.querySelector('.sx-ans.sel,.sx-r.sel')||s&&s.querySelector('.sx-ans,.sx-r')};if(has())return;if(!t.value.trim())return;e.preventDefault();e.stopImmediatePropagation();var n=0;(function w(){s=document.getElementById('sxp');var a=has();if(a&&a.href){location.href=a.href;return}if(++n<40){if(n%5==0)t.dispatchEvent(new Event('input',{bubbles:true}));setTimeout(w,100)}})()},true);

/* map bottom «Фильтры» (.mflt) also opens the layer chips */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.msheet .mflt');if(!b)return;setTimeout(function(){var L=document.querySelector('.ux-layers');if(!L)return;var on=b.closest('.msheet').classList.contains('flt');L.classList.toggle('sf-layopen',on);if(on){var x=L.querySelector('.sf-layx');if(!x){x=document.createElement('button');x.type='button';x.className='sf-layx';x.setAttribute('aria-label','Закрыть слои');x.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>';x.onclick=function(){L.classList.remove('sf-layopen');b.closest('.msheet').classList.remove('flt')};L.appendChild(x)}}},0)},false);

/* пустой поиск: понятные подписи шаблонов, без лишнего «?» */
(function(){var MAP={'Где найти…':'Где найти пала','Чем бить…':'Чем бить босса','Как вывести…':'Как вывести пала','Лучшие пассивки…':'Лучшие пассивки на пала'};
function run(){var s=document.getElementById('sxp');if(!s)return;s.querySelectorAll('button,a').forEach(function(b){var t=(b.textContent||'').trim().replace(/\.\.\.$/,'…');if(MAP[t]&&b.childElementCount==0)b.textContent=MAP[t]});s.querySelectorAll('.hlp,.hlp-term').forEach(function(h){if(!h.closest('.sf-keep'))h.remove()})}
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});})();
