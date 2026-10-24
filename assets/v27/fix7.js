/* fix7: подсказка к показателю «Скорость бега» (title + кнопка «?» для телефона) */
(function(){var T='Скорость пала на бегу; у ездовых — и скорость под седлом. Больше — быстрее.';var pop=null,sy0=0;
function hide(){if(pop){pop.remove();pop=null}}
function show(b){hide();sy0=scrollY;pop=document.createElement('div');pop.className='f7pop';pop.setAttribute('role','tooltip');pop.textContent=T;document.body.appendChild(pop);
 var r=b.getBoundingClientRect(),w=Math.min(260,innerWidth-16);pop.style.width=w+'px';var x=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2));pop.style.left=x+'px';
 var y=r.bottom+6;if(y+pop.offsetHeight>innerHeight-8)y=Math.max(8,r.top-6-pop.offsetHeight);pop.style.top=y+'px'}
function scan(){document.querySelectorAll('th,.il,.ux-cmp-l,span,b,small,div').forEach(function(e){if(e.dataset.f7||e.children.length>2)return;var t=(e.childNodes[0]&&e.childNodes[0].nodeType==3?e.childNodes[0].textContent:'').trim();if(!/^Скорость бега/.test(t))return;e.dataset.f7=1;e.title=T;
 if(e.tagName=='TH'){var b=document.createElement('button');b.type='button';b.className='f7q';b.textContent='?';b.setAttribute('aria-label','Что такое скорость бега');b.title=T;
  b.addEventListener('click',function(ev){ev.stopPropagation();ev.preventDefault();pop&&pop._b===b?hide():(show(b),pop._b=b)});e.appendChild(b)}})}
document.addEventListener('click',function(e){if(pop&&!e.target.closest('.f7q'))hide()});addEventListener('scroll',function(){if(pop&&Math.abs(scrollY-sy0)>40)hide()},{passive:true});
new MutationObserver(function(){clearTimeout(scan._t);scan._t=setTimeout(scan,60)}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState!='loading')scan();else document.addEventListener('DOMContentLoaded',scan)})();
