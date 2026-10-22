/* Палпедия: готовые ответы на типовые вопросы (слой answers). Данные строятся из данных сайта. */
(function(root){
"use strict";
var EN="qwertyuiop[]asdfghjkl;'zxcvbnm,.`",RU="йцукенгшщзхъфывапролджэячсмитьбюё",E2R={};
for(var i=0;i<EN.length;i++)E2R[EN[i]]=RU[i];
function norm(s){return String(s||"").toLowerCase().replace(/ё/g,"е").replace(/[«»"!?(),.\-–—:;'’\/\\+*#&%<>=\[\]{}|^~`$@]/g," ").replace(/\s+/g," ").trim();}
var END=/(иями|ями|ами|ого|его|ому|ему|ыми|ими|ой|ей|ом|ем|ах|ях|ов|ев|ам|ям|ую|юю|ая|яя|ое|ее|ые|ие|ый|ий|ых|их|а|я|у|ю|ы|и|е|о|ь|й)$/;
function stem(w){return w.length>3&&/[а-я]/.test(w)?w.replace(END,""):w;}
function dl(a,b,mx){if(Math.abs(a.length-b.length)>mx)return 9;var p=[],c=[],pp=[],i,j;for(j=0;j<=b.length;j++)p[j]=j;for(i=1;i<=a.length;i++){c=[i];var rm=i;for(j=1;j<=b.length;j++){var x=a[i-1]==b[j-1]?0:1;c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+x);if(i>1&&j>1&&a[i-1]==b[j-2]&&a[i-2]==b[j-1])c[j]=Math.min(c[j],pp[j-2]+1);if(c[j]<rm)rm=c[j];}if(rm>mx)return 9;pp=p;p=c;}return p[b.length];}
var D=null,IX=null;
var STOP=("где как кто что какой какая какие каких какого чем на в во с со и или по для к из у от до за о об а но же ли бы то это мне мой моя меня я ты есть можно нужно надо лучше лучший самый самая самые там тут сейчас вообще всех все всё весь игре игра palworld палворлд пал палы пала палов пале паля how where to the a of in is best get find").split(" ");
var STOPS={};STOP.forEach(function(w){STOPS[w]=1;});
var INT=[
 ["breed",/^(вывест|выводит|выведен|развед|развод|скрест|скрещ|breed|родител|комбинац|получит[ья]? пал|спарит)/],
 ["craft",/^(сдела|скрафт|крафт|рецепт|craft|изготов|собрат|созда|смастер|recipe|make|приготов|свари)/],
 ["fly",/^(лета|полет|летун|flying|fly|крыл|небо)/],
 ["swim",/^(плава|плыв|swim|вод[еау]$|водн|морск|подводн)/],
 ["ride",/^(ездов|езд|ездит|оседл|седл|маунт|mount|ride|кататься|скакун|садил|бега)/],
 ["fast",/^(быстр|скорост|fast|speed|шустр)/],
 ["passive",/^(пассив|перк|passive|трейт|черт[аы])/],
 ["boss",/^(босс|boss|башн|tower|рейд|raid|альф|alpha)/],
 ["best",/^(лучш|топ|best|имб|сильн|top|оптимал|мощн|идеальн|круче)/],
 ["find",/^(где|найт|наход|поймат|пойма|лови|ловл|водит|обита|иска|ищ|спавн|спаун|локац|where|find|встрет|встреча|точк|координат|респ|catch)/],
 ["get",/^(добы|достат|взят|получ|фарм|нафарм|купит|farm|выбит|выпада|дроп)/]
];
var WORK=[[/^(добыч|майн|копа|копат|руд|шахт|камн|камен|кирк|mining|шахтер|копател|копает|добывает)/,"Добыча"],[/^(кузн|плав|печ|печк|огон|огн|разжиг|kindling|плавильн|костер)/,"Разжигание огня"],[/^(ферм|ранч|ranch|farming)/,"Фермерство"],[/^(рубк|руб|лес|дерев|древес|lumber|лесоруб)/,"Рубка деревьев"],[/^(полив|вод|watering)/,"Полив"],[/^(посев|сажат|сажа|посад|семен|planting)/,"Посев семян"],[/^(сбор|урожа|собират|gathering)/,"Сбор"],[/^(переноск|транспорт|носит|перенос|грузч|transport)/,"Транспортировка"],[/^(ручн|верстак|крафт|руки|handiwork|сборк)/,"Ручная работа"],[/^(лекарств|фарма|медиц|medicine|аптек)/,"Фармацевтика"],[/^(охлажд|холодильн|морозил|cooling|холод)/,"Охлаждение"],[/^(электр|генерац|энерги|ток|electricity|генератор)/,"Генерация энергии"]];
var COMBAT=/^(страж|охран|защит|бой|бо[яю]|драк|воин|pvp|атак|урон|сражен|боев|combat|танк)/;
var TOPIC=[
 ["effigy",/^(стату|effigy|идол|статуэт)/,"map/?layer=effigy","Статуи Лифманка на карте"],
 ["chest",/^(сундук|chest|клад|сокровищ)/,"map/?layer=chest","Сундуки на карте"],
 ["dungeon",/^(подзем|данж|dungeon|пещер)/,"map/?layer=dungeon","Подземелья на карте"],
 ["merchant",/^(торгов|прода|магазин|merchant|торгаш|рын[оке])/,"9_faq/","Вопросы и ответы"],
 ["level",/^(уров|лвл|lvl|опыт|прокач|кача|exp|xp)/,"guide/uroven/","Уровни и опыт"],
 ["tech",/^(технолог|очк|tech|древн|чип)/,"9_faq/","Вопросы и ответы"],
 ["food",/^(еда|еду|ед[ыа]|кормит|корм|бафф|баф|голод|food|блюд|готов)/,"guide/eda/","Еда и баффы"],
 ["server",/^(сервер|server|настройк|выделенн|хост|кооп|coop|мультиплеер|мультиплэер|друз|settings|конфиг|ini)/,"7_server/","Сервер и настройки"]
];
var fold=function(o,k,v){(o[k]=o[k]||[]).push(v);};
function init(core,items){
 D=core;if(items){D.I=items.I;D.ia=items.ia;}
 IX={id:{},st:{},one:[],w1:{},nos:{}};
 D.P.forEach(function(p,i){IX.id[p.id]=i;});
 Object.keys(D.syn).forEach(function(k){var s=k.split(" ").map(stem).join(" ");if(!IX.st[s])IX.st[s]=D.syn[k];if(k.indexOf(" ")<0&&k.length>=4)IX.one.push(k);else if(k.indexOf(" ")>0)IX.nos[k.replace(/ /g,"")]=D.syn[k];});
 IX.ist={};if(D.ia)Object.keys(D.ia).forEach(function(k){var s=k.split(" ").map(stem).join(" ");if(IX.ist[s]==null)IX.ist[s]=D.ia[k];});
 IX.fq=D.F.map(function(f){var o={};norm(f[0]).split(" ").forEach(function(w){if(!STOPS[w]&&w.length>2)o[stem(w)]=1;});return o;});
}
var TL=[["sch","щ"],["sh","ш"],["ch","ч"],["zh","ж"],["kh","х"],["ts","ц"],["ya","я"],["yu","ю"],["yo","е"],["ye","е"]],TL1={a:"а",b:"б",v:"в",g:"г",d:"д",e:"е",z:"з",i:"и",y:"ы",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",r:"р",s:"с",t:"т",u:"у",f:"ф",h:"х",c:"ц",w:"в",x:"кс",j:"й",q:"к"};
function translit(q){TL.forEach(function(x){q=q.split(x[0]).join(x[1]);});return q.replace(/[a-z]/g,function(c){return TL1[c]||c;});}
function fixLayout(q){if(/[а-я]/.test(q))return q;var t=q.split("").map(function(c){return E2R[c]||c;}).join("");return /[a-z]/.test(t)?q:t;}
function pal(id){return D.P[IX.id[id]];}
function detect(words){var r={};words.forEach(function(w,i){INT.forEach(function(x){if(x[1].test(w))r[x[0]]=r[x[0]]==null?i:r[x[0]];});});return r;}
function workOf(words){for(var i=0;i<words.length;i++)for(var j=0;j<WORK.length;j++)if(WORK[j][0].test(words[i]))return WORK[j][1];return null;}
function isWork(w){for(var j=0;j<WORK.length;j++)if(WORK[j][0].test(w))return true;return false;}
function isIntentWord(w){if(STOPS[w])return true;for(var i=0;i<INT.length;i++)if(INT[i][1].test(w))return true;return false;}
var FINDI=false,GETI=false;
function applyVar(hit,words,used,j){var nx=words[j];if(!nx||used[j]||hit.ids.length>3)return;var base=pal(hit.ids[0]);if(!base)return;var b0=base.en.toLowerCase().split(" ")[0];
 var subs=D.P.filter(function(p){return p.en.toLowerCase().indexOf(b0+" ")==0;});if(!subs.length||isIntentWord(nx))return;
 var v=D["var"][nx];if(!v&&nx.length>=2){var bd=9;for(var vk in D["var"]){var dd=dl(nx,vk,2);if(dd<bd&&dd<=(vk.length>=5?2:1)){bd=dd;v=D["var"][vk];}}}
 var vid=v&&subs.filter(function(p){return p.en.toLowerCase()==b0+" "+v;})[0];
 if(vid){hit.ids=[vid.id];used[j]=1;return;}
 if(!D.syn[nx]&&!(D.ia&&D.ia[nx]!=null)&&!D.el[stem(nx)]&&nx.length<=6){var bp=D.P.filter(function(p){return p.en.toLowerCase()==b0;})[0];hit.ids=(bp?[bp.id]:[]).concat(subs.map(function(p){return p.id;}));hit.ex=false;hit.amb=1;used[j]=1;}}
function entities(q){
 var words=norm(q).split(" ").filter(Boolean),n=words.length,used=[],groups=[],its=[],els=[];
 var st=words.map(stem);
 for(var i=0;i<n;i++){
  if(used[i])continue;var hit=null;
  for(var L=Math.min(8,n-i);L>=1&&!hit;L--){
   var k=words.slice(i,i+L).join(" "),ks=st.slice(i,i+L).join(" ");
   if(L==1&&STOPS[k])continue;if(L>1&&STOPS[words[i]]&&STOPS[words[i+L-1]])continue;
   var ids=D.syn[k]||IX.st[ks];
   var it=D.ia?(D.ia[k]!=null?D.ia[k]:IX.ist[ks]):null;
   var pf=ids&&FINDI&&!GETI;
   if(it!=null&&it!==undefined&&(!ids||(!pf&&L>1&&k.length>4&&D.ia[k]!=null))){hit={t:"item",i:it,L:L};}
   else if(ids&&!(L==1&&k.length<2)){hit={t:"pal",ids:ids.slice(),L:L,ex:true};}
  }
  if(hit){for(var u=i;u<i+hit.L;u++)used[u]=1;
   if(hit.t=="pal"){applyVar(hit,words,used,i+hit.L);
    hit.pos=i;groups.push(hit);} else {hit.pos=i;its.push(hit);} 
   continue;}
  var w=words[i];
  if(D.el[st[i]]||D.el[w]){els.push(D.el[st[i]]||D.el[w]);continue;}
 }
 for(i=0;i<n;i++){
  if(used[i])continue;var w=words[i];
  var bg=null;if(i+1<n&&used[i+1])groups.forEach(function(x){if(x.pos==i+1&&x.ids.length>3&&!x.fz)bg=x;});
  if(i+1<n&&(!used[i+1]||bg)&&!isIntentWord(words[i+1])&&!isIntentWord(w)){var jw=w+words[i+1],bj=null,bd2=9;for(var jk in IX.nos){var d3=dl(jw,jk,2);if(d3<bd2){bd2=d3;bj=jk;}}if(bj&&bd2<=(jw.length>=8?2:1)){if(bg)groups.splice(groups.indexOf(bg),1);groups.push({t:"pal",ids:IX.nos[bj].slice(),fz:1,pos:i});used[i]=used[i+1]=1;continue;}}
  if(w.length<5||isIntentWord(w)||isWork(w)||D.el[st[i]]||/^\d+$/.test(w))continue;
  var mx=w.length>=7?2:1,best=9,bk=null;
  for(var j=0;j<IX.one.length;j++){var k=IX.one[j];if(k[0]!=w[0]&&k[1]!=w[1])continue;var d=dl(w,k,mx);if(d<best){best=d;bk=k;if(!d)break;}}
  if(bk&&best<=mx){var hh={t:"pal",ids:D.syn[bk].slice(),fz:1,pos:i};used[i]=1;applyVar(hh,words,used,i+1);groups.push(hh);continue;}
  if(D.ia){var bi=null;best=9;for(var key in D.ia){if(key.indexOf(" ")>=0||key.length<4||Math.abs(key.length-w.length)>mx)continue;var d2=dl(w,key,mx);if(d2<best){best=d2;bi=key;}}if(bi&&best<=mx&&D.ia[bi]>=0){its.push({t:"item",i:D.ia[bi],fz:1,pos:i});used[i]=1;}}
 }
 return {words:words,st:st,groups:groups,items:its,els:els};
}
var B="";
function lk(u){return B+u;}
function palCard(p,sub){return {k:p.id,t:"pal",n:p.ru,s:sub||((p.en?p.en+" · ":"")+p.el.join(", ")),img:p.t,u:p.u,btn:[["На карте","map/?pal="+encodeURIComponent(p.id)],["Разведение","breed/?t="+encodeURIComponent(p.ru)]]};}
function itemCard(it){var b=[];if(it.c)b.push(["Рецепт","ux/kraft/?item="+encodeURIComponent(it.c)+"&qty=1"]);if(it.dr||D.ore.indexOf(it.ru)>=0)b.push(["На карте","map/?drop="+encodeURIComponent(it.ru)]);return {k:"item:"+it.ru,t:"item",n:it.ru,s:it.ty||"предмет",img:it.ic,u:it.u,btn:b};}
function list(a,n){a=a.slice(0,n);return a.length<2?a.join(""):a.slice(0,-1).join(", ")+" и "+a[a.length-1];}
function where(p){
 if(p.rg&&p.rg.length){var t=p.ru+" водится: "+list(p.rg,3)+(p.lv&&p.lv.length?", дикие ур. "+p.lv[0]+(p.lv[1]&&p.lv[1]!=p.lv[0]?"–"+p.lv[1]:""):"")+".";if(p.nt)t+=" Появляется только ночью.";if(p.dg&&p.dg.length)t+=" Также в подземельях: "+list(p.dg,2)+".";return t;}
 if(p.dg&&p.dg.length)return p.ru+" встречается в подземельях: "+list(p.dg,2)+".";
 var al=D.B.filter(function(b){return b.pal==p.id;})[0];if(al)return p.ru+": обычных точек появления в данных нет, зато есть босс «"+al.n+"» ("+al.k+(al.pl?", "+al.pl:"")+", ур. "+al.lv.filter(Boolean).join(" / ")+").";
 var b=D.br[p.id];return p.ru+": обычных точек появления в данных нет"+(b?". Его можно вывести разведением: "+pal(b[0][0]).ru+" + "+pal(b[0][1]).ru+".":(p.egg?", ищи в яйце: "+p.egg+".":"."));
}
function breedTxt(p){var b=D.br[p.id];if(!b)return p.ru+": обычной пары для разведения в базе нет. "+where(p);return "Как вывести "+p.ru+": "+b.map(function(x){return pal(x[0]).ru+" + "+pal(x[1]).ru;}).join("; ")+".";}
function faqBest(st,ex){var q={};st.forEach(function(w){if(!STOPS[w]&&w.length>2)q[w]=1;});var best=0,bi=-1;
 IX.fq.forEach(function(f,i){var s=0;for(var w in q)if(f[w])s+=w.length>4?2:1;if(s>best){best=s;bi=i;}});return best>=(ex||1)?bi:-1;}
function faqStrong(q){var ws=q.split(" ").filter(function(w){return !STOPS[w]&&w.length>2;}).map(stem);if(ws.length<2)return -1;var best=0,bi=-1;
 IX.fq.forEach(function(f,i){var m=0,fl=0;ws.forEach(function(w){if(f[w])m++;});for(var k in f)fl++;var r=m/ws.length,c=fl?m/fl:0;var sc=r+c*0.5;if(r>=0.8&&c>=0.5&&sc>best){best=sc;bi=i;}});return bi;}
function sentences(t,n){var m=t.match(/[^.!?]+[.!?]+/g)||[t];return m.slice(0,n).join(" ").trim();}
function byWork(w){return D.P.map(function(p){var l=0;p.wk.forEach(function(x){if(x[0]==w)l=x[1];});return [l,p];}).filter(function(x){return x[0]>0;}).sort(function(a,b){return b[0]-a[0]||(a[1].r-b[1].r);});}
function answer(q0){
 if(!D)return null;var q=norm(q0);if(!q)return null;
 var I=detect(q.split(" "));FINDI=I.find!=null;GETI=I.get!=null||I.craft!=null;
 var E=entities(q);
 if(!E.groups.length&&!E.items.length&&!Object.keys(I).length&&!/[а-я]/.test(String(q0).toLowerCase())){var q2=norm(fixLayout(String(q0).toLowerCase()));if(q2!=q){var I2=detect(q2.split(" "));FINDI=I2.find!=null;GETI=I2.get!=null||I2.craft!=null;var E2=entities(q2);if(E2.groups.length||E2.items.length||Object.keys(I2).length){q=q2;E=E2;I=I2;}}
  if(!E.groups.length&&!E.items.length&&!Object.keys(I).length){var q3=norm(translit(q));var I3=detect(q3.split(" "));FINDI=I3.find!=null;GETI=I3.get!=null||I3.craft!=null;var E3=entities(q3);if(E3.groups.length||E3.items.length){q=q3;E=E3;I=I3;}}}
 FM=-1;FMO=null;var fm=faqStrong(q);
 if(fm>=0){var oo={q:q0,cards:[],text:sentences(D.F[fm][1],3),conf:false,kind:"faq",fq:D.F[fm][0],k2:"faq:"+fm,tag:"faq"};var gi=[];E.groups.forEach(function(x){if(!x.fz)x.ids.forEach(function(id){if(gi.indexOf(id)<0)gi.push(id);});});
  gi.slice(0,2).forEach(function(id){oo.cards.push(palCard(pal(id)));});E.items.slice(0,1).forEach(function(x){if(!x.fz&&D.I[x.i])oo.cards.push(itemCard(D.I[x.i]));});
  oo.cards.push({k:"faq:"+fm,t:"faq",n:D.F[fm][0],s:"ответ из раздела вопросов",u:"9_faq/",btn:[]});FM=fm;FMO=oo;}
 var _u,wk=workOf(E.words),out={q:q0,cards:[],text:"",conf:false,kind:""};
 var topic=null;E.words.some(function(w){return TOPIC.some(function(t){if(t[1].test(w)){topic=t;return true;}});});
 if(topic&&topic[0]=="effigy")E.groups=[];
 var g=E.groups,ids=[];g.forEach(function(x){x.ids.forEach(function(id){if(ids.indexOf(id)<0)ids.push(id);});});
 var ex=g.filter(function(x){return x.ex;});
 if(ids.length&&E.els.length&&g.some(function(x){return x.ids.length>1;})){var f=ids.filter(function(id){var p=pal(id);return E.els.some(function(e){return p.el.indexOf(e)>=0;});});if(f.length)ids=f;}
 var mf=I.fly!=null?"fly":I.swim!=null?"swim":null;
 if(ids.length>1&&mf){var f2=ids.filter(function(id){var p=pal(id);return mf=="fly"?p.mt=="fly":(p.mt=="swim"||p.sw>=1000);});if(f2.length)ids=f2;}
 var item=E.items.length?D.I[E.items[0].i]:null;
 if(wk&&!ids.length&&I.craft==null&&(I.best!=null||E.words.some(function(w){return /^(кто|кого|пал|палы|палов|какой|какие)$/.test(w);}))&&!(I.find!=null&&!I.best)){item=null;E.items=[];}
 if(topic&&!ids.length&&I.craft==null&&!(item&&I.get!=null&&topic[0]!="effigy")){var tf=faqBest(E.st,1);out.kind="topic";out.tag="topic:"+topic[0];out.text=tf>=0?sentences(D.F[tf][1],3):topic[3]+".";
  out.cards.push({k:"topic:"+topic[0],t:"topic",n:topic[3],s:"открыть раздел",u:topic[2],btn:[]});if(item)out.cards.push(itemCard(item));if(tf>=0){out.k2="faq:"+tf;out.fq=D.F[tf][0];out.cards.push({k:"faq:"+tf,t:"faq",n:D.F[tf][0],s:"ответ из раздела вопросов",u:"9_faq/",btn:[]});}return fin(out);}
 // pals with breeding intent
 if(ids.length&&I.breed!=null&&!(item&&I.craft!=null)){var ps=ids.slice(0,4).map(pal);out.kind="breed";out.text=ps.slice(0,2).map(breedTxt).join(" ");
  ps.forEach(function(p){var c=palCard(p);c.btn=[["Разведение","breed/?t="+encodeURIComponent(p.ru)],["На карте","map/?pal="+encodeURIComponent(p.id)]];out.cards.push(c);});
  var b=D.br[ps[0].id];if(b&&ps.length==1)b[0].forEach(function(id){out.cards.push(palCard(pal(id),"родитель"));});
  out.conf=ps.length==1&&ex.length>0;return fin(out);}
 if(ids.length&&I.boss!=null){var bb=D.B.filter(function(b){return ids.indexOf(b.pal)>=0;});if(bb.length){out.kind="boss";var b0=bb[0];out.text=b0.n+" ("+b0.k+", ур. "+b0.lv.filter(Boolean).join(" / ")+"). Слабость: "+(b0.w||[]).join(", ")+".";bb.slice(0,4).forEach(function(b){out.cards.push({k:b.pal,t:"boss",n:b.n,s:b.k+" · ур. "+b.lv.filter(Boolean).join(" / "),img:b.t,u:b.u,btn:[["На карте","map/?pal="+encodeURIComponent(b.pal)]]});});out.conf=bb.length==1&&ex.length>0;return fin(out);}}
 if(item&&!(ids.length&&!E.items[0].fz&&I.get==null&&I.craft==null&&g[0].pos<E.items[0].pos)&&!(ids.length&&E.items[0].fz)){
  if(item.ru&&D.ia&&E.items[0].i<0){}
  out.kind=I.craft!=null?"craft":"item";var t="";
  if(I.craft!=null&&item.rec&&item.rec.length)t=item.ru+": "+item.rec.map(function(r){return r[0]+" ×"+r[1];}).join(", ")+(item.st&&item.st.length?" ("+item.st[0]+")":"")+".";
  var src=(item.src||[]).filter(function(s){return s.indexOf("крафт:")<0&&!/^\s*\(/.test(s);});
  if(D.ore.indexOf(item.ru)>=0)t+=(t?" ":"")+item.ru+" добывают из жил на карте: открой «На карте», там отмечены точки.";
  if(src.length)t+=(t?" ":"")+"Где взять "+item.ru+": "+list(src,4)+".";
  else if(!t&&item.rec&&item.rec.length)t="Крафт "+item.ru+": "+item.rec.map(function(r){return r[0]+" ×"+r[1];}).join(", ")+(item.st&&item.st.length?" ("+item.st[0]+")":"")+".";
  if(!t)t=item.ru+": "+(item.ty||"предмет")+". Подробности на странице предмета.";
  out.text=t;out.cards.push(itemCard(item));
  E.items.slice(1,3).forEach(function(x){var it=D.I[x.i];if(it&&it!==item)out.cards.push(itemCard(it));});
  if(ids.length)ids.slice(0,3).forEach(function(id){out.cards.push(palCard(pal(id)));});
  out.conf=!E.items[0].fz&&!E.els.length&&!/Активный навык/.test(item.ty||"");return fin(out);}
 if(ids.length){var ps2=ids.slice(0,8).map(pal);out.kind="pal";
  if(ps2.length==1){out.text=where(ps2[0]);out.conf=!g[0].fz;}
  else{var lab=E.words.filter(function(w,i){return !isIntentWord(w);}).join(" ");var nm=ps2.map(function(p){return p.ru;});out.text="Под запрос «"+lab+"» подходят "+ids.length+" "+plural(ids.length)+": "+(ids.length>6?nm.slice(0,6).join(", ")+" и ещё "+(ids.length-6):list(nm,6))+". Нажми на нужного, чтобы открыть страницу, или «На карте», чтобы увидеть, где он водится.";}
  ps2.forEach(function(p){out.cards.push(palCard(p,ps2.length>1?(p.en+" · "+p.el.join(", ")+(p.rg[0]?" · "+p.rg[0]:"")):null));});
  return fin(out);}
 // mounts
 if(I.fly!=null||I.swim!=null||(I.ride!=null)||(I.fast!=null&&(I.ride!=null||/садл|сед|маунт|ездов|кон/.test(q)))){
  var m=I.fly!=null?"fly":I.swim!=null?"swim":"ride";var arr=D.P.filter(function(p){return m=="fly"?p.mt=="fly":m=="swim"?p.mt=="swim":(p.mt&&p.mt!="");}).sort(function(a,b){return m=="swim"?b.sw-a.sw:b.rs-a.rs;}).slice(0,6);
  out.kind="mount:"+m;var lbl=m=="fly"?"Лучшие летающие ездовые по скорости":m=="swim"?"Лучшие для плавания по скорости в воде":"Самые быстрые ездовые";
  out.text=lbl+": "+arr.slice(0,4).map(function(p){return p.ru+" ("+(m=="swim"?p.sw:p.rs)+")";}).join(", ")+". Для езды нужно седло, его открывают в технологиях.";
  arr.forEach(function(p){out.cards.push(palCard(p,(m=="swim"?"в воде "+p.sw:"скорость "+p.rs)+" · "+p.el.join(", ")));});out.tag="topic:"+m;return fin(out);}
 if(I.passive!=null){var Q=D.Q.slice().sort(function(a,b){return b.r-a.r;});var key=wk?/работ/:COMBAT.test(q)||/бо[йя]|атак|урон/.test(q)?/атак|урон/i:null;if(/работ|ферм|баз/.test(q))key=/работ/i;if(/скорост|бег|езд/.test(q))key=/скорост|передвиж/i;
  var sel=(key?Q.filter(function(x){return key.test(x.d);}):Q).slice(0,6);if(!sel.length)sel=Q.slice(0,6);
  out.kind="passive";out.tag="topic:passive";out.text="Сильнейшие пассивки"+(key?" под эту задачу":"")+": "+list(sel.slice(0,4).map(function(x){return x.n;}),4)+". Полный список с рангами в разделе пассивок.";
  sel.forEach(function(x){out.cards.push({k:"passive:"+x.n,t:"passive",n:x.n,s:"ранг "+x.r+" · "+x.d.slice(0,60),u:x.u,btn:[["Все пассивки","passivki/"]]});});return fin(out);}
 if(wk||(I.best!=null&&COMBAT.test(E.words.join(" ").replace(/ /g," ")))||(I.best!=null&&E.words.some(function(w){return COMBAT.test(w);}))){
  if(wk){var r=byWork(wk).slice(0,6);out.kind="work";out.tag="work:"+wk;out.text="Лучшие палы для работы «"+wk+"»: "+r.slice(0,4).map(function(x){return x[1].ru+" (ур. "+x[0]+")";}).join(", ")+".";
   r.forEach(function(x){out.cards.push(palCard(x[1],wk+" ур. "+x[0]+" · "+x[1].el.join(", ")));});return fin(out);}
  var cb=D.P.slice().sort(function(a,b){return (b.r||0)-(a.r||0);}).filter(function(p){return p.wild||p.rg.length;}).slice(0,6);
  out.kind="combat";out.tag="topic:combat";var fi=faqBest(E.st,2);out.text=fi>=0?sentences(D.F[fi][1],3):"Сильные бойцы: "+list(cb.map(function(p){return p.ru;}),4)+".";
  cb.forEach(function(p){out.cards.push(palCard(p));});return fin(out);}
 if(I.boss!=null){var tw=D.B.filter(function(b){return /башн|рейд/.test(b.k);}).slice(0,8);out.kind="boss";out.tag="topic:boss";out.text="Боссы башен и рейдов: "+list(tw.slice(0,4).map(function(b){return b.n+" (ур. "+b.lv[0]+")";}),4)+". Слабость и тактика на странице босса.";
  tw.forEach(function(b){out.cards.push({k:b.pal,t:"boss",n:b.n,s:b.k+" · ур. "+b.lv.filter(Boolean).join(" / "),img:b.t,u:b.u,btn:[["Все боссы","boss/"]]});});return fin(out);}
 var fi2=faqBest(E.st,topic?1:2);
 if(topic||fi2>=0){out.kind="faq";out.tag=topic?"topic:"+topic[0]:"faq";if(fi2>=0){out.text=sentences(D.F[fi2][1],3);out.fq=D.F[fi2][0];out.k2="faq:"+fi2;}else out.text=topic[3]+".";
  if(topic)out.cards.push({k:"topic:"+topic[0],t:"topic",n:topic[3],s:"открыть раздел",u:topic[2],btn:[]});
  if(fi2>=0)out.cards.push({k:"faq:"+fi2,t:"faq",n:D.F[fi2][0],s:"ответ из раздела вопросов",u:"9_faq/",btn:[]});return fin(out);}
 out.kind="none";out.text="Точного ответа нет. Попробуй написать имя пала, предмет или вопрос по-другому, например «где найти Анубиса» или «где добыть уголь».";
 out.cards.push({k:"topic:faq",t:"topic",n:"Частые вопросы",s:"все ответы",u:"9_faq/",btn:[]});return fin(out);
}
function plural(n){var a=n%10,b=n%100;return a==1&&b!=11?"пал":a>=2&&a<=4&&(b<10||b>=20)?"пала":"палов";}
var FM=-1,FMO=null;
function fin(o){if(FM>=0){var fo=FMO,fm=FM;FM=-1;FMO=null;if(o.kind=="none"||o.kind=="faq"){o=fo;}else{var fc={k:"faq:"+fm,t:"faq",n:D.F[fm][0],s:"ответ из раздела вопросов",u:"9_faq/",btn:[]};o.text=fo.text;o.fq=fo.fq;o.k2=fo.k2;o.cards.splice(Math.min(2,o.cards.length),0,fc);}}o.keys=o.cards.map(function(c){return c.k;});if(o.cards.length!=1||o.cards[0].t!="pal"&&o.cards[0].t!="item")o.conf=o.conf&&o.cards.length>=1&&(o.kind=="breed"||o.kind=="boss"||o.kind=="item"||o.kind=="craft"||o.kind=="pal");if(o.kind=="pal"&&o.cards.length>1)o.conf=false;o.href=o.conf&&o.cards[0]?o.cards[0].u:null;return o;}
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
function render(a){if(!a)return "";var h='<div class="an-box" data-an-kind="'+esc(a.kind)+'" data-an-keys="'+esc(a.keys.join("|"))+'" data-an-conf="'+(a.conf?1:0)+'"'+(a.href?' data-an-href="'+esc(lk(a.href))+'"':"")+'><div class="an-h">Быстрый ответ</div><p class="an-t">'+esc(a.text)+'</p><div class="an-cs">';
 a.cards.slice(0,8).forEach(function(c){h+='<div class="an-c"><a class="an-m" href="'+esc(lk(c.u))+'">'+(c.img?'<img src="'+esc(lk(c.img))+'" width="44" height="44" alt="" loading="lazy">':'<span class="an-i" aria-hidden="true"></span>')+'<span class="an-n"><b>'+esc(c.n)+'</b><small>'+esc(c.s)+'</small></span></a>'+(c.btn&&c.btn.length?'<span class="an-bs">'+c.btn.map(function(b){return '<a class="an-b" href="'+esc(lk(b[1]))+'">'+esc(b[0])+'</a>';}).join("")+'</span>':"")+'</div>';});
 return h+"</div></div>";}
var API={init:init,answer:answer,render:render,norm:norm,setBase:function(b){B=b||"";},ready:function(){return !!D;}};
if(typeof module!="undefined"&&module.exports)module.exports=API;
root.PW_ans=API;
if(typeof document=="undefined")return;
// ---------- browser glue ----------
B=root.PW_BASE||"/palwiki/";var loading=null;
function load(){if(loading)return loading;loading=Promise.all([fetch(B+"assets/answers/ans_core.json?v=1792693619").then(function(r){return r.json();}),fetch(B+"assets/answers/ans_items.json?v=1792693619").then(function(r){return r.json();})]).then(function(x){init(x[0],x[1]);paintAll();}).catch(function(){loading=null;});return loading;}
function inp(){return document.getElementById("hsq");}
function paint(body,v){if(!body)return;var old=body.querySelector(".an-box");v=(v||"").trim();
 if(v.length<2||!D){if(old)old.remove();return;}
 if(old&&old.getAttribute("data-q")==v&&body.firstElementChild==old)return;
 if(root.PW_sfFaq&&root.PW_sfFaq(v)){if(old)old.remove();return;}
 var a;try{a=answer(v);}catch(e){a=null;}if(!a){if(old)old.remove();return;}
 var w=document.createElement("div");w.innerHTML=render(a);var box=w.firstChild;box.setAttribute("data-q",v);
 if(old)old.remove();if(body.id=="home-answer"){[].slice.call(body.children).forEach(function(e){e.remove();});}else body.querySelectorAll(".sx-card.ai,.sx-ans:not(.sx-cmp),.sf-ans,.dym").forEach(function(e){e.remove();});
 var none=body.querySelector(".sx-none");if(none)none.remove();
 body.prepend(box);}
function paintAll(){var i=inp(),sx=document.getElementById("sxp");if(i&&sx)paint(sx.querySelector(".sx-body"),i.value);var hq=document.getElementById("home-q"),ha=document.getElementById("home-answer");if(hq&&ha)paint(ha,hq.value);}
var obs=new MutationObserver(function(){var sx=document.getElementById("sxp");if(sx&&!sx.__an){sx.__an=1;var b=sx.querySelector(".sx-body");if(b)new MutationObserver(function(){var i=inp();if(i)paint(b,i.value);}).observe(b,{childList:true});}});
function boot(){obs.observe(document.body,{childList:true});var ha=document.getElementById("home-answer");if(ha)new MutationObserver(function(){var hq=document.getElementById("home-q");if(hq)paint(ha,hq.value);}).observe(ha,{childList:true});
 document.addEventListener("focusin",function(e){var t=e.target;if(t&&(t.id=="hsq"||t.id=="home-q"||t.classList&&t.classList.contains("md-search__input")))load();},true);
 document.addEventListener("input",function(e){var t=e.target;if(t&&(t.id=="hsq"||t.id=="home-q")){load();setTimeout(paintAll,140);}},true);
 document.addEventListener("keydown",function(e){var t=e.target;if(e.key!="Enter"||!t||(t.id!="hsq"&&t.id!="home-q"))return;var sx=t.id=="hsq"?document.getElementById("sxp"):document.getElementById("home-answer");var box=sx&&sx.querySelector(".an-box");if(!box||(sx.querySelector(".sel")))return;
  e.preventDefault();e.stopImmediatePropagation();var h=box.getAttribute("data-an-href");if(h){location.href=h;return;}var f=box.querySelector(".an-m");if(f)f.focus();},true);
 var i=inp();if(i&&document.activeElement==i)load();}
if(document.readyState=="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})(typeof window!="undefined"?window:globalThis);
