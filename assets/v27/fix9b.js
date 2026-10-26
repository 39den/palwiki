/* fix9b: «Недавние» — запись пала сразу при открытии и мгновенная отрисовка на главной из localStorage (без ожидания данных) */
(function(){var d=document,B='/palwiki/';
function J(k,v){try{return JSON.parse(localStorage.getItem(k)||'')||v}catch(e){return v}}
function S(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rec(){var i=d.querySelector('.pal-info[data-pal]');if(!i)return;var id=i.getAttribute('data-pal');
 var r=J('pw_recent',[]).filter(function(x){return x!=id});r.unshift(id);S('pw_recent',r.slice(0,12));
 var h=d.querySelector('.md-content h1');var m=J('pw_recent_meta',{});
 m[id]=[(h?h.textContent:'').trim(),location.pathname.indexOf(B)==0?location.pathname.slice(B.length):'', 'pp/art/'+id+'-256.webp'];S('pw_recent_meta',m)}
function home(){var el=d.getElementById('recent');if(!el||el.querySelector('a'))return;var m=J('pw_recent_meta',{});
 var h=J('pw_recent',[]).filter(function(i){return m[i]&&m[i][0]&&m[i][1]}).slice(0,10).map(function(i){var x=m[i];
  return '<a class="mc card-link" href="'+B+x[1]+'"><img src="'+B+x[2]+'" alt="" loading="lazy" width="56" height="56"><span>'+esc(x[0])+'</span></a>'}).join('');
 if(h)el.innerHTML=h}
function run(){rec();home()}
if(d.readyState=='loading')d.addEventListener('DOMContentLoaded',run);else run()})();
