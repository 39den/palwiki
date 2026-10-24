(function(){var R=document.getElementById('breed27');if(!R)return;
fetch('/palwiki/assets/breed27.json?v=2').then(function(r){return r.json()}).then(init);
function E(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function init(D){var P=D.pals,sp={},sl={};D.spec.forEach(function(s){sp[k(s[0],s[1])]=1});
function k(a,b){return a<b?a+','+b:b+','+a}
function nz(t){return t.toLowerCase().replace(/ё/g,'е').replace(/(.)\1+/g,'$1')}
function lev(a,b){var m=a.length,n=b.length,d=[],i,j;for(i=0;i<=m;i++){d[i]=[i]}for(j=1;j<=n;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]==b[j-1]?0:1));return d[m][n]}
function score(p,q){var r=nz(p.ru),e=nz(p.en),z=nz(q);if(r.indexOf(z)>=0||e.indexOf(z)>=0)return 0;if(z.length<4)return 9;var k=z.length<=5?1:2,best=9;[r,e].forEach(function(w){w.split(/[ \-]/).concat([w]).forEach(function(x){best=Math.min(best,lev(z,x.slice(0,z.length)),lev(z,x))})});return best<=k?best:9}
var BASE=(document.querySelector('link[rel=icon]')||{}).href?'/palwiki/':'/palwiki/';
function card(i,lbl){var a=E(P[i].u?'a':'span','b27c');if(P[i].u)a.href=BASE+P[i].u;if(P[i].i){var im=E('img');im.src=BASE+P[i].i;im.alt='';im.width=56;im.height=56;im.loading='lazy';a.append(im)}var t=E('span');t.append(E('small',null,lbl),E('b',null,nm(i)));if(P[i].u)t.append(E('em',null,'Страница пала →'));a.append(t);return a}
function nm(i){return P[i].ru+(P[i].site?'':' (нет на сайте)')}
function child(a,b){return D.m[a][b]}
function kind(a,b){if(a==b)return 'одного вида';if(sp[k(a,b)])return 'особая пара';return 'по рангам'}
function gnote(a,b){var o=[];D.gender.forEach(function(g){if(k(a,b)==k(g[0],g[1]))o.push(g[3]+' = '+P[g[2]].ru)});return o.length?'Зависит от пола: '+o.join('; ')+'.':''}
R.innerHTML='';R.appendChild(E('p','b27ver','Данные разведения: игра 1.0, сверены с патчем 1.0.5 (последний в Steam, 15.09.2026)'));var T=E('div','b27tabs'),b1=E('button',null,'Родители → детёныш'),b2=E('button',null,'Кто даёт пала');
b1.type=b2.type='button';T.append(b1,b2);R.append(T);var F=E('div');R.append(F);
function pick(lbl,id,cb){var w=E('div');var l=E('label',null,lbl);l.htmlFor=id;var f=E('div','b27f'),i=E('input');i.id=id;i.placeholder='Начни вводить название';i.autocomplete='off';i.setAttribute('data-b27',id);
var u=E('ul','b27l');u.hidden=true;f.append(i,u);w.append(l,f);
i.oninput=function(){var q=i.value.trim().toLowerCase();u.innerHTML='';i.dataset.v='';if(!q){u.hidden=true;cb(null);return}
var n=0,H=[];P.forEach(function(p,j){var sc=score(p,q);if(sc<9)H.push([sc,j])});H.sort(function(x,y){return x[0]-y[0]});H.slice(0,30).forEach(function(h){var j=h[1],p=P[j];{n++;var li=E('li',null,nm(j));li.tabIndex=0;li.onclick=li.onkeydown=function(e){if(e.type=='keydown'&&e.key!='Enter')return;i.value=P[j].ru;u.hidden=true;i.dataset.v=j;cb(j)};u.append(li)}});
if(!n)u.append(E('li',null,'Такого пала нет в данных'));u.hidden=false};return w}
function show(r){setTimeout(function(){var b=r.getBoundingClientRect(),bar=document.querySelector('.pw-tb,.ux-tb,[class*=tabbar]');var lim=window.innerHeight-(bar?bar.getBoundingClientRect().height+24:110);if(b.bottom>lim||b.top<60)window.scrollBy({top:b.bottom-lim+8,behavior:'smooth'})},60)}
function fwd(){F.innerHTML='';var a=null,b=null,r=E('div','b27r','Выбери обоих родителей.');
function go(){if(a==null||b==null){r.textContent='Выбери обоих родителей.';return}var c=child(a,b);r.innerHTML='';
var g0=gnote(a,b);if(g0){r.append(E('strong',null,g0));return}if(c==null||c<0){r.textContent='Пара не подтверждена источником.';return}
r.append(card(c,'Детёныш'),E('small',null,'Тип: '+kind(a,b)));var g=gnote(a,b);if(g){r.append(E('br'),E('small',null,g))}r.dataset.child=P[c].en;show(r)}
F.append(pick('Родитель А','b27a',function(j){a=j;go()}),pick('Родитель Б','b27b',function(j){b=j;go()}),r)}
function rev(){F.innerHTML='';var r=E('div','b27r','Выбери нужного пала.');
F.append(pick('Нужный пал','b27c',function(c){if(c==null){r.textContent='Выбери нужного пала.';return}var L=[],S=[];
for(var a=0;a<P.length;a++)for(var b=a;b<P.length;b++)if(D.m[a][b]==c&&!gnote(a,b)){(a==b||sp[k(a,b)]?S:L).push(nm(a)+' + '+nm(b)+(a==b?' (одного вида)':sp[k(a,b)]?' (особая пара)':''))}
D.gender.forEach(function(g){if(g[2]==c)S.push(g[3]+' (зависит от пола)')});
r.innerHTML='';r.append(E('strong',null,nm(c)+': пар — '+(L.length+S.length)));
if(!L.length&&!S.length){r.append(E('br'),E('small',null,'Через разведение не получается или пара не подтверждена источником.'));return}
var o=E('ol');S.concat(L).forEach(function(t){o.append(E('li',null,t))});r.prepend(card(c,'Нужный пал'));r.append(o);show(r)}),r)}
function tab(n){b1.setAttribute('aria-selected',n==1);b2.setAttribute('aria-selected',n==2);n==1?fwd():rev()}
b1.onclick=function(){tab(1)};b2.onclick=function(){tab(2)};tab(1);
var nt=E('small',null,'Источник: '+D.src+'.'+(D.unconfirmed.length?' Не подтверждены: '+D.unconfirmed.join(', ')+'.':''));nt.style.display='block';nt.style.marginTop='12px';R.append(nt)}
})();
