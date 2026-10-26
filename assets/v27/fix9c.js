(function(){
function fit(){document.querySelectorAll('#recent .mc span,#favs .mc span,#pop .mc span,.pcard .pch b,.gc-psv b').forEach(function(e){var fs=parseFloat(getComputedStyle(e).fontSize),n=0;while(e.scrollWidth>e.clientWidth+1&&fs>10&&n++<12){fs-=1;e.style.setProperty('font-size',fs+'px','important')}})}
function reset(){var q=document.getElementById('home-q');if(q&&q.value){q.value='';try{q.dispatchEvent(new Event('input',{bubbles:true}))}catch(e){}}
 document.querySelectorAll('#home-answer .an-box').forEach(function(e){e.remove()});var x=document.getElementById('sxp');if(x){var bd=x.querySelector('.sx-body');if(bd)bd.innerHTML='';x.hidden=true;x.classList.remove('open','on','show')}}
function side(){var s=document.querySelector('.md-sidebar--primary');if(!s)return;var sr=s.getBoundingClientRect();if(document.documentElement.classList.contains('f9c-noside')||sr.left<0||sr.width<100||getComputedStyle(s).position=='fixed'&&sr.left<0)return;var n=[].filter.call(s.querySelectorAll('a.md-nav__link'),function(a){var r=a.getBoundingClientRect();return r.width>0&&r.height>0&&r.right>0&&getComputedStyle(a).visibility!='hidden'}).length;document.documentElement.classList.toggle('f9c-noside',n<=1)}
function run(){fit();side();if(document.getElementById('home-q'))reset()}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.addEventListener('pageshow',function(e){if(e.persisted)reset()});
window.addEventListener('load',function(){fit();side()});
var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(fit,150)}).observe(document.documentElement,{childList:true,subtree:true});
})();
// fix9d: клик по чипам выпадашки. Корень: mousedown уводит фокус с поля → blur перерисовывает #sxp →
// кнопка, по которой идёт click, уже отсоединена от DOM и click не всплывает до обработчика body.
(function(){
document.addEventListener('mousedown',function(e){var t=e.target;if(!t||!t.closest)return;var c=t.closest('#sxp [data-q],#sxp [data-tq],#sxp [data-del]');if(c)e.preventDefault()},true);
document.addEventListener('click',function(e){var t=e.target;if(!t||!t.closest)return;var c=t.closest('[data-q]');if(!c||c.isConnected||!/sx-c/.test(c.className+' '+(c.parentElement&&c.parentElement.className)))return;
 var inp=window.F8tgt||document.getElementById('home-q');if(!inp)return;e.preventDefault();inp.value=c.dataset.q;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.focus({preventScroll:true})},true);
})();
// fix9e: новая выдача #sxp всегда с начала (scrollTop=0) — после клика чипа и при каждом новом запросе
(function(){
var last=null;function top0(){var x=document.getElementById('sxp');if(!x)return;[x].concat([].slice.call(x.querySelectorAll('.sx,.sx-inline,.sx-body'))).forEach(function(e){if(e.scrollTop)e.scrollTop=0})}
document.addEventListener('input',function(e){var t=e.target;if(t&&t.matches&&t.matches('#home-q,#hsq,input[type=search]')&&t.value!==last){last=t.value;top0();requestAnimationFrame(top0);setTimeout(top0,120)}},true);
document.addEventListener('click',function(e){var t=e.target;if(t&&t.closest&&t.closest('#sxp [data-q],#sxp [data-tq]')){requestAnimationFrame(top0);setTimeout(top0,150);setTimeout(top0,400)}},true);
})();
