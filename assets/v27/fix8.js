/* fix8 (24.10.2026): каждое поле поиска остаётся в фокусе само, подсказки открываются под ним.
   Причина бага: v27.js и ui2.js на focus/mousedown поля #home-q снимали с него фокус и открывали поиск в шапке (#hsq).
   Теперь движок ui2 (панель #sxp) привязывается к активному полю: window.F8tgt / window.F8anchor. */
(function(){var d=document,B=window.PW_BASE||'/palwiki/';
function vh(){var v=window.visualViewport;return v?v.height+v.offsetTop:innerHeight}
/* верх нижней панели по раскладке (offsetTop без учёта сдвига при прятании): панель может выехать обратно */
var TBT=0;/* нижняя панель прячется при открытой клавиатуре (kbopen) и возвращается — место под неё держим всегда */
function tb(){var t=d.querySelector('.ux-tabbar');if(!t||innerWidth>=960)return vh();if(getComputedStyle(t).display!='none'&&t.offsetHeight)TBT=t.offsetTop;return TBT?Math.min(vh(),TBT):vh()}
addEventListener('load',function(){tb()});setTimeout(tb,500);
window.F8mh=function(r){return Math.round(Math.max(120,Math.min(vh()*0.5,tb()-r.bottom-12)))};
function refit(){var s=d.getElementById('sxp');if(!s||s.hidden)return;var top=s.getBoundingClientRect().top;s.style.setProperty('max-height',Math.round(Math.max(120,Math.min(vh()*0.5,tb()-top-12)))+'px','important')}
new MutationObserver(function(){tb();refit()}).observe(d.documentElement,{attributes:true,attributeFilter:['class']});
if(window.visualViewport){visualViewport.addEventListener('resize',refit);visualViewport.addEventListener('scroll',refit)}
/* защита от гонки: быстрый ответ и ответы из базы только для текущего запроса */
function cur(){var t=window.F8tgt||d.getElementById('hsq');return t?t.value.trim():''}
function nq(x){return String(x||'').toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ').trim()}
function guard(){var s=d.getElementById('sxp');if(!s)return;var v=nq(cur());
  [].forEach.call(s.querySelectorAll('.an-box[data-an-q]'),function(b){if(nq(b.getAttribute('data-an-q'))!==v){b.remove();if(v.length>=2&&window.PW_ans&&PW_ans.ready()){var a=null;try{a=PW_ans.answer(v)}catch(e){}if(a){var w=d.createElement('div');w.innerHTML=PW_ans.render(a);var nb=w.firstChild;nb.setAttribute('data-an-q',v);var body=s.querySelector('.sx-body');body&&body.prepend(nb)}}}});
  var h=d.getElementById('hsq');if(window.F8tgt&&h&&h.value!==window.F8tgt.value){h.value=window.F8tgt.value;h.dispatchEvent(new Event('input'))}}
new MutationObserver(function(m,o){var s=d.getElementById('sxp');if(s&&!s.__f8g){o.disconnect();s.__f8g=1;new MutationObserver(function(){clearTimeout(s.__gt);s.__gt=setTimeout(function(){guard();refit()},30)}).observe(s,{childList:true,subtree:true})}}).observe(d.documentElement,{childList:true,subtree:true});
/* карточка «Быстрый ответ»: клик по тексту ведёт на страницу ответа (или первой карточки) */
d.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#sxp .an-box');if(!b||e.target.closest('a,button'))return;var h=b.getAttribute('data-an-href')||(b.querySelector('.an-m')||{}).href;if(h)location.href=h},true);
function hs(){return d.getElementById('hsq')}
function items(){var s=d.getElementById('sxp');return s&&!s.hidden?[].slice.call(s.querySelectorAll('.sx-ans,.sx-r')):[]}
function go(v,sel){var it=items();var a=sel||it.filter(function(x){return x.classList.contains('sel')})[0]||it[0];
  if(a&&a.href){location.href=a.href;return}
  if(v&&v.trim())location.href=B+'?q='+encodeURIComponent(v.trim())}
function push(v){try{v=v.trim();if(v.length<2)return;var r=JSON.parse(localStorage.getItem('pw_recentq')||'[]').filter(function(x){return x!=v});r.unshift(v);localStorage.setItem('pw_recentq',JSON.stringify(r.slice(0,8)))}catch(e){}}
function anchorOf(x){return x.closest('.smart-box,.f8-anchor')||x.parentNode}
function bind(x){if(!x||x.__f8)return;x.__f8=1;x.setAttribute('role','combobox');x.setAttribute('aria-controls','sxp');x.setAttribute('enterkeyhint','search');
  x.addEventListener('focus',function(){var y=scrollY;window.F8tgt=x;window.F8anchor=anchorOf(x);d.documentElement.classList.add('f8-alt');
    if(window.PW_search)window.PW_search(x.value||'');
    requestAnimationFrame(function(){if(Math.abs(scrollY-y)>2&&innerWidth>=700)scrollTo(scrollX,y)})});
  x.addEventListener('input',function(){var h=hs();if(!h)return;h.value=x.value;h.dispatchEvent(new Event('input'));var s=d.getElementById('sxp');if(s&&s.hidden&&window.PW_search)window.PW_search(x.value)});
  x.addEventListener('keydown',function(e){var h=hs();if(!h)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'||e.key==='Escape'){e.preventDefault();e.stopPropagation();h.dispatchEvent(new KeyboardEvent('keydown',{key:e.key,bubbles:true}))}
    else if(e.key==='Enter'){e.preventDefault();e.stopPropagation();var v=x.value;push(v);if(h.value!==v){h.value=v;h.dispatchEvent(new Event('input'))}setTimeout(function(){go(v)},160)}},true);
}
/* поле в шапке: своя привязка; Enter без результатов ведёт на поиск ?q= */
d.addEventListener('focus',function(e){var t=e.target;if(t&&t.id==='hsq'){window.F8tgt=null;window.F8anchor=null;d.documentElement.classList.remove('f8-alt')}},true);
d.addEventListener('keydown',function(e){var t=e.target;if(t&&t.id==='hsq'&&e.key==='Enter'){var v=t.value;setTimeout(function(){if(!items().length&&v.trim()&&location.search.indexOf('q=')<0)go(v)},200)}},true);
/* выбор подсказки в панели — значение в активное поле */
d.addEventListener('click',function(e){if(window.F8tgt&&e.target.closest&&e.target.closest('#sxp'))setTimeout(function(){var h=hs();if(h&&window.F8tgt){window.F8tgt.value=h.value}},0)},true);
function scan(){bind(d.getElementById('home-q'));[].forEach.call(d.querySelectorAll('input[data-f8]'),bind)}
if(d.readyState=='loading')d.addEventListener('DOMContentLoaded',scan);else scan();
})();
