/* fix4 24.10.2026: одна активная вкладка в нижней панели */
(function(){
function fix(){var bars=document.querySelectorAll('nav.tabbar,.ux-tabbar');bars.forEach(function(t){var as=[].slice.call(t.querySelectorAll('a[href]')),here=location.pathname,best=null,bl=-1;
 as.forEach(function(a){var h=a.getAttribute('href');if(!h||h[0]=='#')return;var p;try{p=new URL(a.href,location.href).pathname}catch(e){return}if(p=='/palwiki/'){if(here==p&&bl<0){best=a;bl=0}return}if(here.indexOf(p)==0&&p.length>bl){best=a;bl=p.length}});
 as.forEach(function(a){var on=a===best;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})})}
function run(){fix();var n=0,iv=setInterval(function(){fix();if(++n>10)clearInterval(iv)},300);var bar=document.querySelector('nav.tabbar');if(bar&&window.MutationObserver){var busy=false;new MutationObserver(function(){if(busy)return;busy=true;fix();setTimeout(function(){busy=false},50)}).observe(bar,{subtree:true,attributes:true,attributeFilter:['class','aria-current']})}}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
