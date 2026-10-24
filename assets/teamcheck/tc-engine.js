/* Палпедия · «Разбор команды» — движок рекомендаций. Только данные базы (tc.json, paldb 1.0.5). Без DOM. */
(function(root,f){var m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.TCE=m;})(this,function(){
'use strict';
var DB=null,IDX=null,BR=null;
var GOALS={boss:'Бой с боссами и рейды',explore:'Исследование и езда',base:'Работа на базе'};
var STAGES={early:'Ранняя игра',end:'Эндгейм'};
var BPKEY={boss:'боец',base:'рабочий',explore:'ездовой'};
var MAXSQ=5,MAXBASE=25,MAXLV=80;
var TR={'a':'а','b':'б','v':'в','g':'г','d':'д','e':'е','z':'з','i':'и','y':'й','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п','r':'р','s':'с','t':'т','u':'у','f':'ф','h':'х','c':'к','x':'кс','w':'в','j':'дж','q':'к'};
function norm(s){return String(s==null?'':s).toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9 ]+/g,' ').replace(/\s+/g,' ').trim();}
function translit(s){s=norm(s).replace(/sh/g,'ш').replace(/ch/g,'ч').replace(/zh/g,'ж').replace(/ya/g,'я').replace(/yu/g,'ю').replace(/kh/g,'х').replace(/ts/g,'ц');return s.replace(/[a-z]/g,function(c){return TR[c]||c;});}
function lev(a,b){if(a===b)return 0;var m=a.length,n=b.length;if(!m)return n;if(!n)return m;var p=[],i,j;for(j=0;j<=n;j++)p[j]=j;for(i=1;i<=m;i++){var c=[i];for(j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function init(db,breed){DB=db;BR=breed||null;IDX={pal:{},pas:{},byId:{},pasByN:{}};
  db.pals.forEach(function(p,i){p._i=i;IDX.byId[p.id]=p;[p.ru,p.en,p.id].forEach(function(k){IDX.pal[norm(k)]=p;});});
  Object.keys(db.syn||{}).forEach(function(k){var t=IDX.pal[norm(db.syn[k])];if(t&&!IDX.pal[norm(k)])IDX.pal[norm(k)]=t;});
  db.pas.forEach(function(p,i){p._i=i;IDX.pas[norm(p.n)]=p;IDX.pas[norm(p.en)]=p;IDX.pasByN[p.n]=p;});
  // перцентили статов
  ['atk','def','hp'].forEach(function(k){var v=db.pals.map(function(p){return p[k]||0;}).sort(function(a,b){return a-b;});IDX['s_'+k]=v;});
  var cp=db.pals.map(combatPower).sort(function(a,b){return a-b;});IDX.s_cp=cp;
  if(BR)initBreed(BR);return true;}
function initBreed(b){BR=b;BR._ix={};b.pals.forEach(function(n,i){BR._ix[n]=i;});BR._child={};Object.keys(b.pairs).forEach(function(k){var c=b.pairs[k];(BR._child[c]=BR._child[c]||[]).push(k);});}
function pct(arr,v){var c=0;for(var i=0;i<arr.length;i++)if(arr[i]<v)c++;return Math.round(100*c/arr.length);}
function combatPower(p){return (p.atk||0)+0.5*(p.def||0)+0.5*(p.hp||0);}
function best(q,map,keys){q=norm(q);if(!q)return null;if(map[q])return{v:map[q],how:'exact'};var t=translit(q);if(map[t])return{v:map[t],how:'translit'};
  var bestK=null,bd=99;for(var i=0;i<keys.length;i++){var k=keys[i];if(k.indexOf(q)===0&&q.length>=3){var d0=(k.length-q.length)*0.01;if(d0<bd){bd=d0;bestK=k;}continue;}
    var d=Math.min(lev(q,k),lev(t,k));var lim=q.length<=4?1:(q.length<=8?2:3);if(d<=lim&&d<bd){bd=d;bestK=k;}}
  return bestK?{v:map[bestK],how:bd<1?'prefix':'typo'}:null;}
var _pk=null,_sk=null;
function findPal(q){if(!_pk)_pk=Object.keys(IDX.pal);var r=best(q,IDX.pal,_pk);return r?{pal:r.v,how:r.how}:null;}
function findPassive(q){if(!_sk)_sk=Object.keys(IDX.pas);var r=best(q,IDX.pas,_sk);return r?{pas:r.v,how:r.how}:null;}
function suggest(q,kind,n){q=norm(q);n=n||8;if(!q)return[];var t=translit(q),out=[],seen={};var list=kind==='pas'?DB.pas:DB.pals;
  list.forEach(function(x){var names=kind==='pas'?[x.n,x.en]:[x.ru,x.en];var sc=99;names.forEach(function(nm){var k=norm(nm);if(k.indexOf(q)===0||k.indexOf(t)===0)sc=Math.min(sc,0);else if(k.indexOf(q)>0||k.indexOf(t)>0)sc=Math.min(sc,1);});if(sc<99&&!seen[x.n||x.id]){seen[x.n||x.id]=1;out.push([sc,x]);}});
  if(kind!=='pas')Object.keys(DB.syn||{}).forEach(function(k){if(norm(k).indexOf(q)===0){var p=IDX.pal[norm(DB.syn[k])];if(p&&!seen[p.id]){seen[p.id]=1;out.push([0.5,p]);}}});
  if(out.length<3){var f=kind==='pas'?findPassive(q):findPal(q);if(f){var x=f.pas||f.pal;if(!seen[x.n||x.id])out.push([2,x]);}}
  out.sort(function(a,b){return a[0]-b[0];});return out.slice(0,n).map(function(a){return a[1];});}
function clampInt(v,a,b,d){v=parseInt(v,10);if(isNaN(v))return d;return Math.max(a,Math.min(b,v));}
/* нормализация записи: {id,lv,g,stars,pas:[names],iv:{hp,atk,def},act:[names]} */
function clean(e){var w=[];if(!e||typeof e!=='object')return{ok:false,warn:['Пустая запись']};
  var p=IDX.byId[e.id]||(e.name?(findPal(e.name)||{}).pal:null);if(!p)return{ok:false,warn:['Пал «'+esc(String(e.name||e.id||'').slice(0,40))+'» не найден в базе']};
  var lv=clampInt(e.lv,1,MAXLV,null);if(e.lv!=null&&e.lv!==''&&(parseInt(e.lv,10)>MAXLV||parseInt(e.lv,10)<1))w.push('Уровень '+esc(String(e.lv).slice(0,8))+' вне 1–80, взял '+lv);
  var stars=clampInt(e.stars,0,4,0);var pas=[],seen={};(e.pas||[]).forEach(function(n){var f=IDX.pasByN[n]?{pas:IDX.pasByN[n]}:findPassive(n);if(!f){w.push('Пассивка «'+esc(String(n).slice(0,40))+'» не найдена');return;}if(seen[f.pas.n]){w.push('«'+f.pas.n+'» указана дважды — одна и та же пассивка на пале не ставится дважды');return;}seen[f.pas.n]=1;pas.push(f.pas.n);});
  if(pas.length>4){w.push('На пале не больше 4 пассивок — оставил первые 4');pas=pas.slice(0,4);}
  var iv=null;if(e.iv&&typeof e.iv==='object'){iv={};['hp','atk','def'].forEach(function(k){if(e.iv[k]!=null&&e.iv[k]!=='')iv[k]=clampInt(e.iv[k],0,100,0);});if(!Object.keys(iv).length)iv=null;}
  var acts=(e.act||[]).filter(function(a){return DB.act[a];}).slice(0,3);
  return{ok:true,warn:w,v:{id:p.id,lv:lv,g:e.g==='m'||e.g==='f'?e.g:'',stars:stars,pas:pas,iv:iv,act:acts}};}
/* быстрый ввод: «Анубис 45 Мастер боя, Свирепый; Джетрагон 50» */
function parseQuick(text){var out=[],warn=[];text=String(text==null?'':text).slice(0,4000);var parts=text.split(/[;\n]+/).map(function(s){return s.trim();}).filter(Boolean);
  if(!parts.length)return{items:[],warn:['Пусто — напиши, например: «Анубис 45 Свирепый, Мастеровитый; Джетрагон 50»']};
  parts.slice(0,60).forEach(function(part){var name=part,lv=null,rest='';
    var mm=part.match(/^(.*?)\s+(?:ур\.?\s*|lv\.?\s*)?(\d{1,4})\b\s*(.*)$/i);if(mm){name=mm[1];lv=mm[2];rest=mm[3];}else{var toks=part.split(/\s*,\s*/);name=toks.shift();rest=toks.join(',');}
    var stars=null;rest=rest.replace(/(\d)\s*(?:★|\*|зв[её]зд\w*)/i,function(_,d){stars=+d;return '';});
    var f=findPal(name);if(!f){// имя из двух слов + пассивки без запятой
      var w0=name.split(' ');for(var k=w0.length-1;k>0&&!f;k--){var tryn=w0.slice(0,k).join(' ');var ff=findPal(tryn);if(ff&&ff.how!=='typo'){f=ff;rest=w0.slice(k).join(' ')+(rest?', '+rest:'');}}}
    if(!f){warn.push('Не нашёл пала «'+esc(name.slice(0,40))+'»');return;}
    var pas=rest.split(/\s*[,+\/]\s*/).map(function(s){return s.trim();}).filter(Boolean);
    out.push({id:f.pal.id,lv:lv,stars:stars,pas:pas,_how:f.how,_q:name});});
  if(parts.length>60)warn.push('Взял первые 60 записей');return{items:out,warn:warn};}
/* ---- ценность пассивки для роли ---- */
function pval(ps,goal,pal){var e=ps.e||{},v=0,why=[];var el=pal?pal.el:[];
  if(goal==='boss'){if(e.atk){v+=e.atk;why.push('атака '+sg(e.atk)+'%');}if(e.def){v+=e.def*0.5;why.push('защита '+sg(e.def)+'%');}if(e.hp){v+=e.hp*0.4;why.push('HP '+sg(e.hp)+'%');}
    if(e.dmg){Object.keys(e.dmg).forEach(function(k){if(el.indexOf(k)>=0){v+=e.dmg[k];why.push('урон «'+k+'» +'+e.dmg[k]+'% — это стихия пала');}else why.push('урон «'+k+'» +'+e.dmg[k]+'%, но у пала другая стихия');});}
    if(e.cd){v+=e.cd*0.3;why.push('перезарядка навыков −'+Math.abs(e.cd)+'%'+(e.cd<0?' (хуже)':''));if(e.cd<0)v+=e.cd*0.3*-2;}
    if(e.res){Object.keys(e.res).forEach(function(k){v+=e.res[k]*0.2;why.push('урон от «'+k+'» −'+e.res[k]+'%');});}
    if(e.paci){v-=40;why.push('пацифист: не добивает цель (HP не ниже 1)');}if(e.mv&&!e.atk){why.push('скорость бега — в бою почти не помогает');}}
  else if(goal==='base'){if(e.ws){v+=e.ws;why.push('скорость работы '+sg(e.ws)+'%');}if(e.san){v+=e.san*12;why.push(e.san>0?'рассудок тратится медленнее':'рассудок тратится быстрее');}
    if(e.food){v+=e.food*6;why.push(e.food>0?'сытость тратится медленнее':'сытость тратится быстрее');}
    if(e.farm){var hasF=pal&&pal.work.some(function(w){return w[0]==='Фермерство';});v+=hasF?e.farm*25:0;why.push('Фермерство +'+e.farm+(hasF?'':' — но у пала нет Фермерства'));}
    if(e.night){v+=15;why.push('работает и ночью');}if(e.nap){v-=20;why.push('часто дремлет днём');}if(e.egg){v+=10;why.push('ускоряет яйца на ферме');}
    if(e.atk&&!e.ws)why.push('атака на базе не нужна');}
  else{if(e.mv){v+=e.mv;why.push('скорость передвижения '+sg(e.mv)+'%');}if(e.stam!=null){v+=e.stam*0.4;why.push('выносливость '+sg(e.stam)+'% (только для ездовых)');}
    if(e.jump){v+=e.jump*15;why.push('+'+e.jump+' прыжк. в езде');}if(e.atk){v+=e.atk*0.2;why.push('атака '+sg(e.atk)+'%');}if(e.food){v+=e.food*4;}}
  if(!why.length)why.push(ps.d);return{v:Math.round(v),why:why};}
function sg(n){return(n>0?'+':'')+n;}
function verdict(v){return v>=25?['great','отлично для роли']:v>=8?['good','полезно']:v>-5?['meh','почти не влияет на эту роль']:['bad','вредит роли'];}
/* ---- роль и сильные стороны ---- */
function maxWork(p){var m=null;p.work.forEach(function(w){if(!m||w[1]>m[1])m=w;});return m;}
function roleOf(p,goal){var cp=pct(IDX.s_cp,combatPower(p)),mw=maxWork(p),mount=p.mount;
  var s={boss:cp,base:mw?Math.min(100,mw[1]*14+(p.work.length-1)*4):0,explore:mount?(mount==='fly'?60:40)+Math.min(40,Math.round((p.sprint||0)/80)):0};
  var top=Object.keys(s).sort(function(a,b){return s[b]-s[a];})[0];return{scores:s,top:top,fit:s[goal]};}
function strengths(p){var out=[];var a=pct(IDX.s_atk,p.atk),d=pct(IDX.s_def,p.def),h=pct(IDX.s_hp,p.hp);
  out.push({k:'stats',t:'Атака '+p.atk+' (выше, чем у '+a+'% палов), защита '+p.def+' ('+d+'%), HP '+p.hp+' ('+h+'%)',src:DB.src});
  out.push({k:'el',t:'Стихия: '+p.el.join(' + ')+'. Сильнее против: '+(attackVs(p.el).join(', ')||'никого (нейтральная)')+'. Боится: '+(p.weak.join(', ')||'—')+(Object.keys(p.wm||{}).length?' (×'+DB.elmult.weak+')':''),src:DB.src});
  if(p.work.length)out.push({k:'work',t:'Работы: '+p.work.map(function(w){return w[0]+' '+w[1];}).join(', ')+' (потолок '+DB.wcap+')',src:DB.src});
  out.push({k:'psk',t:'Партнёрский навык «'+p.psk.n+'»: '+p.psk.d,src:DB.src});
  if(p.mount)out.push({k:'mount',t:(p.mount==='fly'?'Летающий':'Ездовой')+(p.sprint?', скорость бега '+p.sprint:''),src:DB.src});
  return out;}
function attackVs(els){var o=[];els.forEach(function(e){(DB.chart[e]||[]).forEach(function(x){if(o.indexOf(x)<0)o.push(x);});});return o;}
function elemMult(atkEl,defPal){if(defPal.wm&&defPal.wm[atkEl])return defPal.wm[atkEl];if(defPal.rm&&defPal.rm[atkEl])return defPal.rm[atkEl];return 1;}
/* ---- идеальный набор пассивок ---- */
function idealSet(p,goal,stage){var cur=DB.pas.filter(function(x){return x.r>=1;});var bp=(p.bp||{})[BPKEY[goal]];var set=[],src='';
  if(bp&&bp.length){bp.forEach(function(n){var x=IDX.pasByN[n];if(x&&set.indexOf(x)<0)set.push(x);});src='подборка базы Палпедии для роли «'+BPKEY[goal]+'»';}
  var ranked=cur.map(function(x){return[pval(x,goal,p).v,x];}).filter(function(a){return a[0]>0;}).sort(function(a,b){return b[0]-a[0]||b[1].r-a[1].r;});
  if(stage==='early'){var early=ranked.filter(function(a){return a[1].r<5;}).map(function(a){return a[1];});
    // в ранней игре — то, что реально достать: покупка, носители или ранг до 4
    set=set.filter(function(x){return x.r<5;});early.forEach(function(x){if(set.length<4&&set.indexOf(x)<0)set.push(x);});if(!src)src='лучшие по цифрам среди доступных до эндгейма';else src+=' (без легендарных пассивок ранга 5 — их дают только артефакты Мирового Древа)';}
  ranked.forEach(function(a){if(set.length<4&&set.indexOf(a[1])<0)set.push(a[1]);});if(!src)src='лучшие по цифрам из базы пассивок';
  set=set.slice(0,4);var tot={};set.forEach(function(x){var e=x.e||{};['atk','def','hp','ws','mv'].forEach(function(k){if(e[k])tot[k]=(tot[k]||0)+e[k];});if(e.dmg)p.el.forEach(function(el){if(e.dmg[el])tot['dmg_'+el]=(tot['dmg_'+el]||0)+e.dmg[el];});});
  return{set:set.map(function(x){var pv=pval(x,goal,p);return{n:x.n,r:x.r,url:x.url,why:pv.why,v:pv.v,how:howGet(x)};}),src:src,tot:tot};}
function howGet(x){var o=[];if(x.nat&&x.nat.length){o.push({k:'nat',t:'с рождения бывает у: '+x.nat.slice(0,4).join(', ')+(x.nat.length>4?' и ещё '+(x.nat.length-4):''),pals:x.nat.slice(0,4)});}
  if(x.how==='gold'&&x.gold)o.push({k:'gold',t:'операционный стол: '+fmt(x.gold)+' золота'});
  if(x.how==='disposable'){var d=(x.drops||[])[0];o.push({k:'relic',t:'одноразовый имплант'+(d?': '+d[0]+' — '+d[1]:'')});}
  o.push({k:'breed',t:'разведение: передаётся от родителя'});return o;}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
/* ---- разведение ---- */
function parentsFor(p,have){if(!BR)return{pending:true};var ci=BR._ix[p.ru];if(ci==null)return{pairs:[],note:'Пала нет в таблице разведения базы'};
  var keys=(BR._child[ci]||[]);var haveN={};(have||[]).forEach(function(id){var x=IDX.byId[id];if(x)haveN[x.ru]=1;});
  var pairs=keys.map(function(k){var ab=k.split(',').map(Number);return[BR.pals[ab[0]],BR.pals[ab[1]]];}).filter(function(ab){return!(ab[0]===p.ru&&ab[1]===p.ru);});
  pairs.sort(function(a,b){return((haveN[b[0]]?1:0)+(haveN[b[1]]?1:0))-((haveN[a[0]]?1:0)+(haveN[a[1]]?1:0));});
  var sp=(BR.special||[]).filter(function(s){return s.child===p.ru;});
  return{pairs:pairs.slice(0,5).map(function(ab){return{a:ab[0],b:ab[1],own:!!(haveN[ab[0]]||haveN[ab[1]])};}),total:pairs.length+1,special:sp,self:p.ru+' × '+p.ru};}
function inheritPlan(curPas,ideal){var miss=ideal.filter(function(n){return curPas.indexOf(n)<0;});var c=DB.facts.inherit;
  return{miss:miss,chance:c,text:'Сложи у двух родителей все '+ideal.length+' нужные пассивки и ничего лишнего. Малыш получает 1/2/3/4 пассивки родителей с шансами '+c.join('/')+'%, поэтому все 4 без мусора выпадают в '+c[3]+'% яиц. Каждая лишняя пассивка у родителей снижает шанс.',src:DB.facts.inherit_src};}
/* ---- активные навыки ---- */
function bestActives(p,goal,lv){var L=lv||MAXLV;var list=p.act.map(function(a){var pw=a[3]||0,ct=a[4];var stab=p.el.indexOf(a[2])>=0?DB.facts.stab:1;var score=ct?pw*stab/Math.max(1,ct)*10:pw*stab/10;return{lv:a[0],n:a[1],el:a[2],pw:pw,ct:ct,stab:stab>1,score:score,have:a[0]<=L,fr:(DB.act[a[1]]||{}).fr||[]};});
  list.sort(function(a,b){return b.score-a.score;});return list.slice(0,3);}
/* ---- улучшения ---- */
function upgrades(e,p,goal){var o=[],c=DB.facts.cond,s=e.stars||0;
  if(s<4){var need=0;for(var i=s;i<4;i++)need+=c[i];o.push({k:'cond',t:'Конденсация: сейчас '+s+'★. До следующей звезды нужно '+c[s]+' копий, до 4★ — '+need+'. Каждая звезда даёт +'+DB.facts.cond_bonus+'% к HP, атаке и защите и усиливает партнёрский навык, на 4★ ещё +1 ко всем работам.',src:DB.facts.cond_src});}
  else o.push({k:'cond',t:'4★ — конденсация на максимуме.',src:DB.facts.cond_src});
  o.push({k:'statue',t:'Монумент силы: за души палов можно до '+DB.facts.statue_steps+' шагов поднять '+(goal==='base'?'скорость работы':'HP, атаку и защиту')+'.',src:DB.facts.statue_src,url:'2_mehaniki/monument_sily/'});
  if(e.iv){var low=Object.keys(e.iv).filter(function(k){return e.iv[k]<50;});if(low.length)o.push({k:'iv',t:'Скрытые таланты (IV) ниже 50: '+low.map(function(k){return{hp:'HP',atk:'атака',def:'защита'}[k]+' '+e.iv[k];}).join(', ')+'. IV частично передаются от родителей, так что для боевого пала стоит разводить от родителей с высокими IV.',src:'guide/07_razvedenie'});}
  if(e.lv&&e.lv<MAXLV&&goal==='boss')o.push({k:'lv',t:'Уровень '+e.lv+' из '+MAXLV+': урон растёт с уровнем (в формуле урона есть √(Ур+1)).',src:DB.facts.dmg_src});
  return o;}
/* ---- замены ---- */
var ctxUsed={};function replacements(p,goal,stage,boss){var used=(boss&&boss._used)||null;var pool=DB.pals.filter(function(x){return x.id!==p.id&&x.hab&&!(ctxUsed[x.id]);});var sc;
  if(goal==='boss'){sc=function(x){var m=1;if(boss)m=Math.max.apply(null,x.el.map(function(el){return boss.weak.indexOf(el)>=0?DB.elmult.weak:1;}));return combatPower(x)*m;};}
  else if(goal==='base'){var mw=maxWork(p);if(!mw)return[];sc=function(x){var w=x.work.filter(function(y){return y[0]===mw[0];})[0];return w?w[1]*100+combatPower(x)/10:0;};}
  else sc=function(x){return x.mount?(x.mount==='fly'?2000:0)+(x.sprint||0):0;};
  if(stage==='early')pool=pool.filter(function(x){return x.hab.lv&&x.hab.lv[0]<=40||(!x.hab.wild);});
  var mine=sc(p);var c=pool.map(function(x){return[sc(x),x];}).filter(function(a){return a[0]>mine*1.15;}).sort(function(a,b){return b[0]-a[0];}).slice(0,3);
  return c.map(function(a){var x=a[1];return{id:x.id,ru:x.ru,url:x.url,why:replWhy(x,goal,boss),where:whereTxt(x)};});}
function replWhy(x,goal,boss){if(goal==='base'){return x.work.map(function(w){return w[0]+' '+w[1];}).join(', ');}if(goal==='explore')return(x.mount==='fly'?'летает':'ездовой')+(x.sprint?', скорость бега '+x.sprint:'');var t='атака '+x.atk+', защита '+x.def+', HP '+x.hp+', стихия '+x.el.join('+');if(boss&&x.el.some(function(e){return boss.weak.indexOf(e)>=0;}))t+=' — бьёт слабость босса ×'+DB.elmult.weak;return t;}
function whereTxt(x){var h=x.hab||{};var o=[];if(h.wild&&h.rg&&h.rg.length)o.push('дикий: '+h.rg.slice(0,2).join(', ')+(h.lv?' (ур. '+h.lv[0]+'–'+h.lv[1]+')':''));if(h.dg&&h.dg.length)o.push('подземелья: '+h.dg.slice(0,2).join(', '));if(h.egg)o.push('яйцо: '+h.egg);if(!o.length)o.push('только разведением');return o.join('; ');}
/* ---- разбор одного пала ---- */
function analyzePal(e,ctx){var p=IDX.byId[e.id];ctx=ctx||{};var goal=GOALS[ctx.goal]?ctx.goal:'boss',stage=STAGES[ctx.stage]?ctx.stage:'end';
  var role=roleOf(p,goal);var cur=e.pas.map(function(n){var x=IDX.pasByN[n];var pv=pval(x,goal,p);var vd=verdict(pv.v);if(x.r<0&&pv.v>=-4){vd=['meh','плохая пассивка (ранг '+x.r+'), хоть и не мешает этой роли'];}return{n:n,r:x.r,url:x.url,v:pv.v,cls:vd[0],verdict:vd[1],why:pv.why};});
  var ideal=idealSet(p,goal,stage);var idealN=ideal.set.map(function(x){return x.n;});
  var bad=cur.filter(function(c){return c.cls==='bad';});var free=4-e.pas.length;
  var fitTxt=role.fit>=70?'отлично подходит':role.fit>=45?'подходит':role.fit>=20?'слабоват':'не для этой роли';
  if(goal==='explore'&&!p.mount)fitTxt='не ездовой и не летает';if(goal==='base'&&!p.work.length)fitTxt='не работает на базе';
  return{id:p.id,ru:p.ru,url:p.url,thumb:p.thumb,el:p.el,lv:e.lv,stars:e.stars,goal:goal,role:role,fitTxt:fitTxt,strengths:strengths(p),cur:cur,bad:bad,free:free,ideal:ideal,
    inherit:inheritPlan(e.pas,idealN),breed:parentsFor(p,ctx.have),actives:bestActives(p,goal,e.lv),upgrades:upgrades(e,p,goal),
    replace:role.fit<45||(goal==='explore'&&!p.mount)||(goal==='base'&&!p.work.length)?replacements(p,goal,stage,ctx.boss):[],psk:p.psk};}
/* ---- разбор команды ---- */
function analyzeTeam(state){var w=[];state=state||{};var goal=GOALS[state.goal]?state.goal:'boss',stage=STAGES[state.stage]?state.stage:'end';
  var sq=[],bs=[];function take(arr,max,dst,label){(Array.isArray(arr)?arr:[]).slice(0,200).forEach(function(e){var c=clean(e);if(!c.ok){w=w.concat(c.warn);return;}w=w.concat(c.warn.map(function(x){return DB&&IDX.byId[c.v.id].ru+': '+x;}));if(dst.length>=max){if(dst.length===max)w.push(label+': больше '+max+' нельзя, лишних не учитываю');dst.length++;return;}dst.push(c.v);});dst.length=Math.min(dst.length,max);}
  take(state.squad,MAXSQ,sq,'Отряд');take(state.base,MAXBASE,bs,'База');
  var boss=null;if(state.boss){boss=DB.boss.filter(function(b){return b.n===state.boss;})[0]||null;}
  var have=sq.concat(bs).map(function(e){return e.id;});var ctx={goal:goal,stage:stage,boss:boss,have:have};
  var focus=goal==='base'?bs.concat(sq):sq.concat(bs);
  if(!sq.length&&!bs.length)return{empty:true,warn:w.length?w:['Добавь хотя бы одного пала — например, напиши «Анубис 45» в быстром вводе.'],goal:goal,stage:stage};
  ctxUsed={};have.forEach(function(id){ctxUsed[id]=1;});var per=focus.slice(0,30).map(function(e){var a=analyzePal(e,ctx);if(a.replace[0])ctxUsed[a.replace[0].id]=1;return a;});ctxUsed={};
  var sqP=sq.map(function(e){return IDX.byId[e.id];}),bsP=bs.map(function(e){return IDX.byId[e.id];});
  var cov=coverage(sqP.length?sqP:bsP);var bossR=boss?bossCheck(sqP.length?sqP:bsP,boss):null;var works=workCover(bsP.length?bsP:sqP,bs.length?bs:sq);
  var dup=duplicates(sqP),syn=synergy(sqP);var sc=score({per:per,cov:cov,boss:bossR,works:works,goal:goal,dup:dup});
  var dupes=sameCount(sq.concat(bs));
  return{goal:goal,stage:stage,warn:w,per:per,cov:cov,boss:bossR,works:works,dup:dup,syn:syn,score:sc,top3:top3(per,cov,works,bossR,goal),dupes:dupes,counts:{sq:sq.length,bs:bs.length}};}
function sameCount(list){var c={};list.forEach(function(e){c[e.id]=(c[e.id]||0)+1;});return Object.keys(c).filter(function(k){return c[k]>1;}).map(function(k){return{ru:IDX.byId[k].ru,n:c[k],cond:c[k]-1};});}
function coverage(ps){var els=Object.keys(DB.chart);var hit={},weak={};ps.forEach(function(p){attackVs(p.el).forEach(function(x){(hit[x]=hit[x]||[]).push(p.ru);});(p.weak||[]).forEach(function(x){(weak[x]=weak[x]||[]).push(p.ru);});});
  var gaps=els.filter(function(x){return!hit[x]&&x!=='Нейтральный';});var shared=Object.keys(weak).filter(function(x){return weak[x].length>=2;});
  return{hit:hit,gaps:gaps,weak:weak,shared:shared,els:els};}
function bossCheck(ps,b){var rows=ps.map(function(p){var off=Math.max.apply(null,p.el.map(function(el){return b.weak.indexOf(el)>=0?DB.elmult.weak:1;}));var def=Math.max.apply(null,b.el.map(function(el){return elemMult(el,p);}));
  var cls=off>1&&def<=1?'good':off>1?'ok':def>1?'bad':'meh';var t=off>1?'бьёт слабость (×'+DB.elmult.weak+')':'обычный урон';t+=def>1?'; сам уязвим к «'+b.el.join('+')+'» (×'+def+')':def<1?'; держит удар «'+b.el.join('+')+'» (×'+def+')':'';return{ru:p.ru,cls:cls,t:t};});
  var sug=[];if(!rows.some(function(r){return r.cls==='good'||r.cls==='ok';})){sug=DB.pals.filter(function(x){return x.el.some(function(e){return b.weak.indexOf(e)>=0;});}).sort(function(a,c){return combatPower(c)-combatPower(a);}).slice(0,3).map(function(x){return{ru:x.ru,url:x.url,where:whereTxt(x)};});}
  return{b:b,rows:rows,sug:sug};}
function workCover(ps,entries){var res=DB.works.map(function(t){var best=0,who=[];ps.forEach(function(p,i){p.work.forEach(function(w){if(w[0]===t.ru){var lv=w[1]+(entries&&entries[i]&&entries[i].stars>=4?1:0);lv=Math.min(lv,DB.wcap);if(lv>best){best=lv;}who.push(p.ru+' '+lv);}});});return{ru:t.ru,short:t.short,best:best,who:who.slice(0,4)};});
  var miss=res.filter(function(r){return!r.best;}).map(function(r){return r.ru;});var low=res.filter(function(r){return r.best&&r.best<3;}).map(function(r){return r.ru+' '+r.best;});
  var naps=[],night=[];(entries||[]).forEach(function(e){e.pas.forEach(function(n){var x=IDX.pasByN[n];if(x&&x.e.nap)naps.push(IDX.byId[e.id].ru);if(x&&x.e.night)night.push(IDX.byId[e.id].ru);});});
  return{rows:res,miss:miss,low:low,naps:naps,night:night};}
function duplicates(ps){var roles={};ps.forEach(function(p){var r=roleOf(p,'boss').top;(roles[r]=roles[r]||[]).push(p.ru);});var els={};ps.forEach(function(p){p.el.forEach(function(e){(els[e]=els[e]||[]).push(p.ru);});});
  return{els:Object.keys(els).filter(function(k){return els[k].length>=3;}).map(function(k){return{el:k,who:els[k]};})};}
function synergy(ps){var o=[];var boostEl=ps.filter(function(p){return(p.psk.cat||[]).indexOf('element-boost')>=0;});boostEl.forEach(function(p){var mates=ps.filter(function(q){return q!==p&&q.el.some(function(e){return p.el.indexOf(e)>=0;});});o.push({t:'«'+p.psk.n+'» ('+p.ru+'): '+p.psk.d+(mates.length?' Рядом той же стихии: '+mates.map(function(q){return q.ru;}).join(', ')+'.':'')});});
  var heal=ps.filter(function(p){return(p.psk.cat||[]).indexOf('heal')>=0;});heal.forEach(function(p){o.push({t:'«'+p.psk.n+'» ('+p.ru+') лечит: '+p.psk.d});});
  var mounts=ps.filter(function(p){return p.mount==='fly';});if(!mounts.length&&ps.length)o.push({t:'В отряде нет летающего пала — для исследования карты пригодится.',warn:1});return o;}
function score(r){var s=0,why=[];var fits=r.per.map(function(p){return Math.min(100,p.role.fit);});var avgFit=fits.length?fits.reduce(function(a,b){return a+b;},0)/fits.length:0;s+=avgFit*0.45;why.push('Пригодность палов к цели: '+Math.round(avgFit)+'/100 (вес 45%)');
  var pq=r.per.map(function(p){if(!p.cur.length)return 40;var good=p.cur.filter(function(c){return c.cls==='great'||c.cls==='good';}).length,bad=p.bad.length;return Math.max(0,Math.min(100,good*25-bad*30+(4-p.cur.length)*5+20));});var avgP=pq.length?pq.reduce(function(a,b){return a+b;},0)/pq.length:0;s+=avgP*0.30;why.push('Пассивки под роль: '+Math.round(avgP)+'/100 (вес 30%)');
  var c;if(r.goal==='base'){c=100*(12-r.works.miss.length)/12;why.push('Покрытие работ: '+(12-r.works.miss.length)+' из 12 (вес 25%)');}else if(r.boss){var g=r.boss.rows.filter(function(x){return x.cls==='good'||x.cls==='ok';}).length;c=Math.min(100,g*50);why.push('Против босса «'+r.boss.b.pal+'»: бьют слабость '+g+' (вес 25%)');}else{c=100*(8-r.cov.gaps.length)/8;why.push('Покрытие стихий: '+(8-r.cov.gaps.length)+' из 8 (вес 25%)');}
  s+=c*0.25;s=Math.round(s);return{v:s,label:s>=80?'Отличная команда':s>=60?'Хорошая основа':s>=40?'Есть что улучшить':'Нужна перестройка',why:why};}
function top3(per,cov,works,boss,goal){var a=[];per.forEach(function(p){p.bad.forEach(function(b){a.push({w:60+Math.abs(b.v),t:'Убери у '+p.ru+' пассивку «'+b.n+'»: '+b.why.join(', ')+'.'});});if(p.replace.length)a.push({w:50,t:p.ru+' '+p.fitTxt+' — замени на '+p.replace[0].ru+' ('+p.replace[0].why+').'});
    var miss=p.ideal.set.filter(function(x){return p.cur.every(function(c){return c.n!==x.n;});});if(p.cur.length<4&&miss.length&&p.role.fit>=45)a.push({w:30+miss[0].v/2,t:'Поставь '+p.ru+' «'+miss[0].n+'» ('+miss[0].why[0]+'). Где взять: '+miss[0].how[0].t+'.'});});
  if(goal==='base'&&works.miss.length)a.push({w:55,t:'На базе нет работ: '+works.miss.join(', ')+'.'});
  if(goal==='base'&&works.naps.length)a.push({w:45,t:'«Полуночник» у '+works.naps.join(', ')+' — часто дремлет днём, на базе мешает.'});
  if(goal==='boss'&&boss&&!boss.rows.some(function(r){return r.cls==='good'||r.cls==='ok';})&&boss.sug.length)a.push({w:58,t:'Никто не бьёт слабость «'+boss.b.pal+'» ('+boss.b.weak.join(', ')+'). Возьми, например, '+boss.sug[0].ru+'.'});
  if(goal==='boss'&&!boss&&cov.shared.length)a.push({w:35,t:'Сразу несколько палов боятся «'+cov.shared.join(', ')+'» — разбавь отряд.'});
  a.sort(function(x,y){return y.w-x.w;});var seen={},out=[];a.forEach(function(x){if(!seen[x.t]&&out.length<3){seen[x.t]=1;out.push(x.t);}});if(!out.length)out.push('Серьёзных проблем не нашёл. Дальше — конденсация и Монумент силы.');return out;}
/* ---- шаринг ---- */
function encodeState(st){var pk=function(e){return[e.id,e.lv||0,e.stars||0,(e.pas||[]).map(function(n){var x=IDX.pasByN[n];return x?x._i:-1;}).filter(function(i){return i>=0;}),e.g||'',e.iv?[e.iv.hp==null?-1:e.iv.hp,e.iv.atk==null?-1:e.iv.atk,e.iv.def==null?-1:e.iv.def]:0];};
  var o={g:state0(st.goal,GOALS,'boss'),s:state0(st.stage,STAGES,'end'),b:st.boss||'',q:(st.squad||[]).slice(0,MAXSQ).map(pk),a:(st.base||[]).slice(0,MAXBASE).map(pk)};var j=JSON.stringify(o);
  var b64=(typeof btoa==='function'?btoa(unescape(encodeURIComponent(j))):Buffer.from(j,'utf8').toString('base64'));return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function state0(v,o,d){return o[v]?v:d;}
function decodeState(s){try{s=String(s).slice(0,20000).replace(/-/g,'+').replace(/_/g,'/');var j=typeof atob==='function'?decodeURIComponent(escape(atob(s))):Buffer.from(s,'base64').toString('utf8');var o=JSON.parse(j);
  var up=function(a){return(Array.isArray(a)?a:[]).filter(function(x){return Array.isArray(x)&&IDX.byId[x[0]];}).map(function(x){var iv=Array.isArray(x[5])?{hp:x[5][0]<0?null:x[5][0],atk:x[5][1]<0?null:x[5][1],def:x[5][2]<0?null:x[5][2]}:null;return{id:x[0],lv:x[1]||null,stars:x[2]||0,pas:(Array.isArray(x[3])?x[3]:[]).map(function(i){return DB.pas[i]&&DB.pas[i].n;}).filter(Boolean),g:x[4]||'',iv:iv};});};
  return{goal:state0(o.g,GOALS,'boss'),stage:state0(o.s,STAGES,'end'),boss:typeof o.b==='string'?o.b:'',squad:up(o.q),base:up(o.a)};}catch(e){return null;}}
return{init:init,initBreed:initBreed,norm:norm,translit:translit,findPal:findPal,findPassive:findPassive,suggest:suggest,clean:clean,parseQuick:parseQuick,pval:pval,analyzePal:analyzePal,analyzeTeam:analyzeTeam,encodeState:encodeState,decodeState:decodeState,esc:esc,GOALS:GOALS,STAGES:STAGES,MAXSQ:MAXSQ,MAXBASE:MAXBASE,_idx:function(){return IDX;},db:function(){return DB;}};
});
