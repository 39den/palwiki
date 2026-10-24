/* Палпедия · «Подбор палов под базу» (обратный режим). Требует TCE (tc-engine.js). Только данные базы. */
(function(root,f){var m=f(typeof module==='object'&&module.exports?require('./tc-engine.js'):root.TCE);if(typeof module==='object'&&module.exports)module.exports=m;else root.TCP=m;})(this,function(T){
'use strict';
var W={h:'Ручная работа',k:'Разжигание огня',md:'Фармацевтика',c:'Охлаждение',mi:'Добыча',l:'Рубка деревьев',p:'Посев семян',wa:'Полив',g:'Сбор',e:'Генерация энергии',t:'Транспортировка',f:'Фермерство'};
var PURPOSES={
 ore:{n:'Ферма руды и металла',w:['Добыча','Транспортировка'],ore:[0],b:['Рудник (металл)','Карьер']},
 qsc:{n:'Кварц, сера, уголь',w:['Добыча','Транспортировка'],ore:[3,2,1],b:['Рудник (уголь, сера, кварц)']},
 smelt:{n:'Слитки и переплавка',w:['Разжигание огня','Транспортировка','Добыча'],ore:[0,1],b:['Печи','Рудник']},
 food:{n:'Ферма еды и полей',w:['Посев семян','Полив','Сбор','Разжигание огня','Охлаждение','Транспортировка'],b:['Кухня','Холодильник/охлаждение']},
 ranch:{n:'Ранчо: молоко, яйца, шерсть, мёд',w:['Фермерство','Транспортировка'],ranch:1,b:['Пастбище для скота']},
 craft2:{n:'Патроны, сферы, лекарства',w:['Ручная работа','Фармацевтика','Транспортировка'],b:['Сферическая Мастерская','Средневековый стол фармацевта','Конвейерные фабрики']},
 power:{n:'Электричество',w:['Генерация энергии'],b:['Генератор энергии']},
 wood:{n:'Лесопилка и камень',w:['Рубка деревьев','Добыча','Транспортировка'],b:['Лесопилка','Карьер']},
 craft:{n:'Крафт-база',w:['Ручная работа','Транспортировка','Разжигание огня','Генерация энергии'],b:['Конвейерные фабрики','Сферическая Мастерская']},
 breed:{n:'Разведение',w:['Ручная работа','Транспортировка','Разжигание огня'],breed:1,b:['Пастбище свиданий','Инкубатор']}};
var CLIMATE={
 cold:{n:'Холод: снег, горы',t:'днём −3, ночью −3',w:['Разжигание огня'],eq:'Обогреватель (+1, нужен пал с «Разжиганием огня») или электрообогреватель (+2, ещё и электричество)'},
 hot:{n:'Жара: вулкан',t:'днём +3, ночью +1',w:['Охлаждение'],eq:'Кулер (−1, нужен пал с «Охлаждением») или электрокулер (−2)'},
 desert:{n:'Пустыня',t:'днём +2, ночью −3',w:['Разжигание огня','Охлаждение'],eq:'Днём кулер, ночью обогреватель: нужны и «Охлаждение», и «Разжигание огня»'}};
var CLIMATE_NOTE='Климат: самим палам на базе холод и жара не вредят — у палов в данных игры нет терпимости к температуре. Температура важна тебе и инкубатору (у яиц разных стихий своя идеальная), поэтому добавил работу для обогревателя или кулера.';
var CALM_NOTE='Драк между своими палами на базе в игре нет. Настоящая «ссора» с базой — это падение рассудка: болезни (язва, депрессия) и простой в работе. Вид пала на рассудок не влияет, влияют пассивки и условия: кровати, еда, горячий источник.';
var STAGE={early:{n:'Ранний этап',max:25},mid:{n:'Средний этап',max:50},late:{n:'Поздний этап',max:99}};
function wl(p,w){var x=p.work.filter(function(a){return a[0]===w;})[0];return x?x[1]:0;}
function ranchItem(p){var d=p.psk.d||'';var k=d.indexOf('Пастбище для скота');if(k<0)return null;var t=d.slice(k).split(/[.]/)[0];var m=/(?:выпа[а-яё]*|выпадения|откладывает|производ[а-яё]*|создавать|выкапыва[а-яё]*(?: из земли)?|падать|оставлять после себя|добывать|получить)\s+(.+)$/i.exec(t);if(!m)return null;return m[1].replace(/\s+из земли$/,'').trim();}
function avail(p,stage){var h=p.hab||{};if(stage==='late')return true;var lv=h.lv&&h.lv[0];return!!(h.wild&&lv&&lv<=STAGE[stage].max);}
/* opts: {purpose, works:[ru], limit, stage, have:[ids|names], night, lowFood, climate:cold|hot|desert, calm} */
function pick(opts){var DB=T.db(),out={warn:[],team:[],covered:[],missing:[],impossible:[]};opts=opts||{};
  var pu=PURPOSES[opts.purpose]||null;var works=(pu?pu.w.slice():[]);(Array.isArray(opts.works)?opts.works:[]).forEach(function(w){if(DB.works.some(function(t){return t.ru===w;})&&works.indexOf(w)<0)works.push(w);});
  if(!works.length&&!(pu&&pu.ranch)){out.empty=true;out.warn.push('Выбери назначение базы или хотя бы одну работу галочкой.');return out;}
  var limit=parseInt(opts.limit,10);if(isNaN(limit))limit=15;if(limit<1){out.impossible.push('На базе должен быть хотя бы 1 пал.');limit=1;}if(limit>50){out.warn.push('Больше 50 палов на базе не бывает даже на сервере с настройками — взял 50.');limit=50;}
  var stage=STAGE[opts.stage]?opts.stage:'late';
  var pool=DB.pals.filter(function(p){return p.work.length;});
  if(Array.isArray(opts.have)&&opts.have.length){var ids={};opts.have.forEach(function(h){var f=T._idx().byId[h]?{pal:T._idx().byId[h]}:T.findPal(h);if(f)ids[f.pal.id]=1;else out.warn.push('Не нашёл пала «'+T.esc(String(h).slice(0,40))+'»');});pool=pool.filter(function(p){return ids[p.id];});out.onlyHave=true;}
  else pool=pool.filter(function(p){return avail(p,stage);});
  if(opts.lowFood){var fs=DB.pals.map(function(p){return p.food||0;}).sort(function(a,b){return a-b;});var med=fs[Math.floor(fs.length/2)];pool=pool.filter(function(p){return(p.food||0)<=med;});out.note=(out.note||[]).concat(['Аппетит: взял палов с расходом еды не выше среднего ('+med+').']);}
  if(opts.night){var np=pool.filter(function(p){return p.noct;});out.night={n:np.length};
    if(np.length){pool=np;out.note=(out.note||[]).concat(['Ночная смена: взял только ночных палов (в данных игры Nocturnal, paldb.cc 1.0.5) — они не спят и работают круглые сутки, но рассудок у них падает быстрее. Любому другому палу ночную работу даёт пассивка «Бессонница».']);}
    else{out.impossible.push((out.onlyHave?'Среди твоих палов':'Среди доступных на этом этапе палов')+' нет ночных. Ночью работают и палы с пассивкой «Бессонница».');pool=[];}}
  var CL=CLIMATE[opts.climate];if(CL){CL.w.forEach(function(w){if(works.indexOf(w)<0)works.push(w);});out.climate={n:CL.n,t:CL.t,eq:CL.eq};out.note=(out.note||[]).concat([CLIMATE_NOTE]);}
  if(opts.calm){var sp=DB.pas.filter(function(x){return x.e&&x.e.san&&!x.e.player;});out.calm={good:sp.filter(function(x){return x.e.san>0;}).map(function(x){return{n:x.n,r:x.r,url:x.url};}),bad:sp.filter(function(x){return x.e.san<0;}).map(function(x){return{n:x.n,r:x.r,url:x.url};}),text:CALM_NOTE};}
  if(pu&&pu.ranch){var rp=pool.filter(function(p){return ranchItem(p);});var pri=function(p){return/молок|яйц|шерст|м[её]д/i.test(ranchItem(p))?1:0;};rp.sort(function(a,b){return pri(b)-pri(a)||wl(b,'Фермерство')-wl(a,'Фермерство');});var seenI={};
    rp.forEach(function(p){var it=ranchItem(p);if(!seenI[it]&&out.team.length<limit){seenI[it]=1;out.team.push(mk(p,['Фермерство'],'даёт на пастбище: '+it));}});
    if(!rp.length)out.impossible.push('Среди доступных палов нет никого, кто что-то даёт на Пастбище для скота.');}
  // жадное покрытие: на каждую работу лучший по уровню, потом второй на главные
  var used={};out.team.forEach(function(t){used[t.id]=1;});
  var order=works.slice();var rounds=[order,pu?pu.w.slice(0,1):[]];
  rounds.forEach(function(ws){ws.forEach(function(w){if(out.team.length>=limit)return;var c=pool.filter(function(p){return!used[p.id]&&wl(p,w)>0;}).sort(function(a,b){return wl(b,w)-wl(a,w)||(b.work.filter(function(x){return works.indexOf(x[0])>=0;}).length-a.work.filter(function(x){return works.indexOf(x[0])>=0;}).length);});
    if(c[0]){used[c[0].id]=1;var does=c[0].work.filter(function(x){return works.indexOf(x[0])>=0;}).map(function(x){return x[0];});out.team.push(mk(c[0],does,null));}});});
  var main=pu?pu.w.slice(0,Math.max(1,pu.w.length-1)):works.slice();var guard=0;while(out.team.length<limit&&guard++<60){var added=false;main.forEach(function(w){if(out.team.length>=limit)return;var c=pool.filter(function(p){return!used[p.id]&&wl(p,w)>=2;}).sort(function(a,b){return wl(b,w)-wl(a,w);})[0];if(c){used[c.id]=1;added=true;out.team.push(mk(c,c.work.filter(function(x){return works.indexOf(x[0])>=0;}).map(function(x){return x[0];}),null));}});if(!added)break;}
  works.forEach(function(w){var best=0,who='';out.team.forEach(function(t){var p=T._idx().byId[t.id];if(wl(p,w)>best){best=wl(p,w);who=p.ru;}});if(best)out.covered.push({w:w,lv:best,who:who});else out.missing.push(w);});
  if(out.missing.length&&out.team.length>=limit)out.impossible.push('Лимит '+limit+' пал. не хватает, чтобы закрыть: '+out.missing.join(', ')+'.');
  else if(out.missing.length)out.impossible.push((out.onlyHave?'Среди твоих палов':'Среди доступных на этом этапе палов')+' никто не умеет: '+out.missing.join(', ')+'.');
  out.alts={};['early','mid','late'].forEach(function(s){if(out.onlyHave)return;out.alts[s]=works.slice(0,4).map(function(w){var c=DB.pals.filter(function(p){return wl(p,w)>0&&avail(p,s);}).sort(function(a,b){return wl(b,w)-wl(a,w);})[0];return c?{w:w,ru:c.ru,lv:wl(c,w),url:c.url}:{w:w,none:1};});});
  out.passives=workPassives(works);out.build=pu?pu.b:[];out.works=works;out.limit=limit;out.stage=stage;out.purpose=pu?pu.n:'Свои нужды';
  out.sites=pu&&pu.ore?oreSites(pu.ore):[];return out;}
function mk(p,does,extra){return{id:p.id,ru:p.ru,url:p.url,thumb:p.thumb,work:p.work.slice(),does:does,extra:extra,where:where(p)};}
function where(p){var h=p.hab||{};var o=[];if(h.wild&&h.rg&&h.rg.length)o.push('дикий: '+h.rg.slice(0,2).join(', ')+(h.lv?' (ур. '+h.lv[0]+'–'+h.lv[1]+')':''));if(h.egg)o.push('яйцо: '+h.egg);if(!o.length)o.push('только разведением');return o.join('; ');}
function workPassives(works){var DB=T.db();var c=DB.pas.filter(function(x){var e=x.e||{};return x.r>0&&(e.ws>0||e.san>0||e.night||e.farm||e.food>0)&&!e.player;});
  c=c.map(function(x){var e=x.e,v=(e.ws||0)+(e.san>0?12:0)+(e.night?15:0)+(e.food>0?6:0)+(e.farm&&works.indexOf('Фермерство')>=0?50:0)+(e.ws<0?0:0);var why=[];if(e.ws)why.push('скорость работы '+(e.ws>0?'+':'')+e.ws+'%');if(e.san)why.push('рассудок медленнее');if(e.night)why.push('работает ночью');if(e.food>0)why.push('сытость медленнее');if(e.farm)why.push('Фермерство +'+e.farm);return{n:x.n,r:x.r,url:x.url,v:v,why:why};});
  c.sort(function(a,b){return b.v-a.v;});return c.slice(0,5);}
function oreSites(types){var DB=T.db(),G=120,cells={};DB.ore.pts.forEach(function(o){if(types.indexOf(o[2])<0)return;var k=Math.round(o[0]/G)+','+Math.round(o[1]/G);var c=cells[k]=cells[k]||{n:0,x:0,y:0,t:{}};c.n++;c.x+=o[0];c.y+=o[1];c.t[o[2]]=(c.t[o[2]]||0)+1;});
  return Object.keys(cells).map(function(k){var c=cells[k];var x=Math.round(c.x/c.n),y=Math.round(c.y/c.n);return{x:x,y:y,n:c.n,what:Object.keys(c.t).map(function(t){return DB.ore.names[t]+' ×'+c.t[t];}).join(', '),url:'map/?pt='+x+','+y};}).sort(function(a,b){return b.n-a.n;}).slice(0,5);}
function toTeam(r){return(r.team||[]).map(function(t){return{id:t.id,lv:null,stars:0,pas:[]};});}
return{pick:pick,CLIMATE:CLIMATE,PURPOSES:PURPOSES,STAGE:STAGE,toTeam:toTeam,ranchItem:ranchItem};
});
