/* MAPFIX: ?drop=<пал> → режим обитания; Enter в поиске карты по предмету → ?drop=; «точек нет» → как получить */
(function(){if(!/\/map\/?$/.test(location.pathname)&&!/\/map\/index\.html$/.test(location.pathname))return;
var B=window.PW_BASE||'/palwiki/',R=document.documentElement;R.classList.add('mf-map');
var sp=new URLSearchParams(location.search),dq=(sp.get('drop')||'').trim();
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var SD=null;function sd(){return SD||(SD=fetch(B+'assets/search_data.json').then(function(r){return r.json()}).catch(function(){return {pals:[],items:[]}}))}
function low(s){return String(s||'').toLowerCase().replace(/ё/g,'е').trim()}
function pal(D,q){q=low(q);return (D.pals||[]).find(function(p){return low(p.ru)==q||low(p.en)==q})}
if(dq)sd().then(function(D){var p=pal(D,dq);if(p){location.replace(B+'map/?pal='+encodeURIComponent(p.id));return}
 var it=(D.items||[]).find(function(x){return low(x.ru)==low(dq)||low(x.en)==low(dq)});
 var n=0,iv=setInterval(function(){var el=document.querySelector('.gc-mapn');if(!el){if(++n>80)clearInterval(iv);return}clearInterval(iv);
  if(R.dataset.drop==='0'){var src=it&&it.src&&it.src.length?it.src.slice(0,3).join('; '):'';var u=it&&it.url?B+it.url:'';
   el.innerHTML=esc(dq)+': на карте точек нет.'+(src?' Где взять: '+esc(src)+'.':'')+(u?' <a href="'+u+'">Подробнее</a>':'')}},150)});
function hook(){var q=document.getElementById('mapq');if(!q){return false}if(q.dataset.mf)return true;q.dataset.mf=1;
 q.addEventListener('keydown',function(e){if(e.key!='Enter')return;var v=q.value.trim();if(!v)return;
  var o=[].slice.call(document.querySelectorAll('#gc-mapl option')).map(function(x){return x.value}).find(function(x){return low(x)==low(v)});
  if(!o)return;sd().then(function(D){if(pal(D,v))return;location.search='?drop='+encodeURIComponent(o)})},true);
 /* палы без точек: вместо «найдено 0» — как получить */
 var c=q.parentElement.querySelector('.mcnt');if(c)new MutationObserver(function(){if(c.dataset.mfw)return;var t=c.textContent||'';if(!/(^|\D)0(\D|$)|нет/.test(t)){return}
  sd().then(function(D){var p=pal(D,q.value);if(!p)return;c.dataset.mfw=1;c.innerHTML=esc(p.ru)+': диких точек нет. Получить: <a href="'+B+'breed/?t='+encodeURIComponent(p.ru)+'">разведение</a>'+(p.url?' · <a href="'+B+p.url+'">страница пала</a>':'');setTimeout(function(){c.dataset.mfw=''},50)})}).observe(c,{childList:true,characterData:true,subtree:true});
 return true}
var k=0,t=setInterval(function(){if(hook()||++k>100)clearInterval(t)},150);
})();
/* MAPFIX: включённый слой всегда виден — мелкие точки (сундуки, деревья, источники) не прячутся на малом зуме; если их нет в кадре — карта показывает их */
(function(){if(!document.documentElement.classList.contains('mf-map'))return;
function D(tree){return tree?(window.PW_tmap&&window.PW_tmap.dc):(window.PW_map&&window.PW_map.dc)}
function M(tree){return tree?(window.PW_tmap&&window.PW_tmap.m):(window.PW_map&&window.PW_map.m)}
function sync(tree,just){var dc=D(tree),m=M(tree);if(!dc||!dc.items||!m)return;var s=new Set();dc.items.forEach(function(it){if(dc.isOn(it.t)&&it.prio<1)s.add(it.mk)});dc.boost(s);
 if(!just||!just.length)return;setTimeout(function(){var its=dc.items.filter(function(it){return just.indexOf(it.t)>=0});if(!its.length)return;if(its.some(function(it){return it.mk._map}))return;
  m.fitBounds(L.latLngBounds(its.map(function(it){return it.mk.getLatLng()})).pad(0.1));setTimeout(function(){dc.run()},350)},120)}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.ux-layers button[data-k],.ux-layers button[data-sx],.ux-layers button[data-tk],.mleg input[data-k]');if(!b)return;
 setTimeout(function(){var tree=!!document.querySelector('.mapsw [data-w=t].on');var on=b.tagName=='INPUT'?b.checked:b.getAttribute('aria-pressed')=='true';var k=(b.dataset.k||b.dataset.sx||b.dataset.tk||'').split(',');sync(tree,on?k:null)},60)},true);
var n=0,iv=setInterval(function(){if(D(false))sync(false);if(D(true))sync(true);if(++n>20)clearInterval(iv)},500);
})();
