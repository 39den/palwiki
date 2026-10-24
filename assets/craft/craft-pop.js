/* Палпедия · всплывающий рецепт для любого [data-item]. Без зависимостей. */
(function(){
var skip=null,S=document.currentScript,B=(S&&S.getAttribute('data-base'))||'/palwiki/',DATA=null,DR={},EN=null,LD=null,pop=null,cur=null,tmo=0,touchT=0;
function load(){if(LD)return LD;LD=Promise.all([fetch(B+'assets/craft/craft.json').then(function(r){return r.json()}),fetch(B+'assets/craft/drops.json').then(function(r){return r.json()}).catch(function(){return {}})]).then(function(a){DATA=a[0];DR=a[1];EN=new CraftEngine(DATA);return DATA});return LD;}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ic(x,sz){return x&&x.ic?'<img src="'+B+x.ic+'" alt="" width="'+sz+'" height="'+sz+'" loading="lazy" decoding="async">':'<span class="crp-noic" aria-hidden="true">?</span>'}
function drp(id){var L=(DR.d||{})[id]||[];if((DR.nc||[]).indexOf(id)>=0)return '<p class="crp-dr"><b>Где взять:</b> источник не подтверждён</p>';if(!L.length)return '';var h='<p class="crp-dr"><b>Где взять:</b> ';h+=L.slice(0,3).map(function(e){var n=esc(e[0]);return (e[1]?'<a href="'+B+e[1]+'">'+n+'</a>':n)+(e[2]?' <small>'+esc(e[2])+'</small>':'')}).join(', ');if(L.length>3)h+=', ещё '+(L.length-3);return h+'</p>';}
function body(id){var x=DATA.items[id];if(!x){var nm=(cur.getAttribute('aria-label')||cur.textContent||cur.getAttribute('data-item')).trim().slice(0,80);return '<div class="crp-hd"><span class="crp-noic" aria-hidden="true">?</span><div><b class="crp-t" id="crp-t">'+esc(nm)+'</b></div></div><p class="crp-na">Нет данных о предмете.</p>';}
 var ti=cur&&cur.querySelector('img'),hi=x.ic?ic(x,48):(ti?'<img src="'+esc(ti.currentSrc||ti.src)+'" alt="" width="48" height="48">':ic(x,48));var h='<div class="crp-hd">'+hi+'<div><b class="crp-t" id="crp-t">'+esc(x.ru)+'</b><small>'+esc(x.t||'')+'</small></div></div>';
 var r=x.r&&x.r[0];h+=drp(id);
 if(!r){if(x.rk||!drp(id))h+='<p class="crp-na">Не крафтится.</p>';if(x.u)h+='<a class="crp-go" href="'+B+x.u+'">Страница предмета →</a>';return h;}
 h+='<ul class="crp-ing" aria-label="Ингредиенты">';r.m.forEach(function(p){var c=DATA.items[p[0]]||{ru:p[0]};h+='<li>'+ic(c,28)+'<span>'+esc(c.ru)+'</span><b>×'+p[1]+'</b></li>'});h+='</ul>';
 h+='<p class="crp-meta"><span>⚒ '+esc(r.st&&r.st.length?r.st[0]:'станок не указан в источнике')+(r.st&&r.st.length>1?' +'+(r.st.length-1):'')+'</span>'+(r.tl?'<span>Технология ур. '+r.tl+'</span>':'')+(r.y>1?'<span>Выход ×'+r.y+'</span>':'')+(x.r.length>1?'<span>'+x.r.length+' варианта рецепта</span>':'')+'</p>';
 h+='<a class="crp-go" href="'+B+'ux/kraft/?item='+encodeURIComponent(id)+'&qty=1">Полный крафт →</a>';return h;}
function ensure(){if(pop)return pop;pop=document.createElement('div');pop.id='crp';pop.className='crp';pop.setAttribute('role','dialog');pop.setAttribute('aria-labelledby','crp-t');pop.hidden=true;document.body.appendChild(pop);
 pop.addEventListener('mouseenter',function(){clearTimeout(tmo)});pop.addEventListener('mouseleave',function(){later()});
 pop.addEventListener('focusout',function(e){if(!pop.contains(e.relatedTarget)&&e.relatedTarget!==cur)later()});return pop;}
function place(t){var p=pop,vw=document.documentElement.clientWidth,vh=window.innerHeight,r=t.getBoundingClientRect(),m=8;
 p.style.maxHeight='';p.style.left='0px';p.style.top='0px';var w=Math.min(p.offsetWidth,vw-2*m),h=p.offsetHeight;
 var below=vh-r.bottom-m-6,above=r.top-m-6,top;
 if(h<=below)top=r.bottom+6;else if(h<=above)top=r.top-6-h;else if(below>=above){top=r.bottom+6;p.style.maxHeight=below+'px'}else{p.style.maxHeight=above+'px';top=r.top-6-Math.min(h,above)}
 var left=Math.max(m,Math.min(r.left+r.width/2-w/2,vw-m-w));p.style.left=(left+window.scrollX)+'px';p.style.top=(top+window.scrollY)+'px';}
function open(t){clearTimeout(tmo);load().then(function(){var id=EN.find(t.getAttribute('data-item'));ensure();if(cur&&cur!==t)cur.setAttribute('aria-expanded','false');cur=t;pop.innerHTML=body(id)+'<button type="button" class="crp-x" aria-label="Закрыть">×</button>';pop.hidden=false;t.setAttribute('aria-expanded','true');t.setAttribute('aria-controls','crp');place(t);pop.querySelector('.crp-x').onclick=function(){close(true)};});}
function close(fb){clearTimeout(tmo);if(!pop||pop.hidden)return;pop.hidden=true;if(cur){cur.setAttribute('aria-expanded','false');if(fb){skip=cur;cur.focus();setTimeout(function(){skip=null},0)}}cur=null;}
function later(){clearTimeout(tmo);tmo=setTimeout(function(){close()},220)}
function trig(e){var t=e.target&&e.target.closest&&e.target.closest('[data-item]');return t&&!t.closest('#crp')&&!(t.tagName==='DETAILS'&&t.classList.contains('itm'))?t:null}
function prep(root){root=root||document;var L=[].slice.call(root.querySelectorAll('[data-item]'));if(root.matches&&root.matches('[data-item]'))L.push(root);L.forEach(function(t){if(t.closest('#crp'))return;t.setAttribute('aria-haspopup','dialog');if(!t.hasAttribute('aria-expanded'))t.setAttribute('aria-expanded','false');if(!/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)&&!t.hasAttribute('tabindex'))t.tabIndex=0;})}
var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
document.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')touchT=Date.now();if(pop&&!pop.hidden&&!pop.contains(e.target)&&!trig(e))close()},true);
document.addEventListener('mouseover',function(e){if(Date.now()-touchT<800)return;var t=trig(e);if(t){if(t!==cur){clearTimeout(tmo);tmo=setTimeout(function(){open(t)},140)}else clearTimeout(tmo)}});
document.addEventListener('mouseout',function(e){var t=trig(e);if(t&&!(e.relatedTarget&&(t.contains(e.relatedTarget)||(pop&&pop.contains(e.relatedTarget)))))later()});
document.addEventListener('focusin',function(e){var t=trig(e);if(t&&t!==skip&&(!fine||e.target.matches(':focus-visible'))){if(t!==cur||!pop||pop.hidden)open(t);else clearTimeout(tmo)}});
document.addEventListener('focusout',function(e){var t=trig(e);if(t&&t===cur&&!(e.relatedTarget&&((pop&&pop.contains(e.relatedTarget))||t.contains(e.relatedTarget))))later()});
document.addEventListener('click',function(e){var t=trig(e);if(!t)return;if(Date.now()-touchT<800||!fine){if(cur!==t||!pop||pop.hidden){e.preventDefault();open(t)}}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pop&&!pop.hidden){close(true)}else if((e.key==='Enter'||e.key===' ')&&trig(e)&&!/^(A|BUTTON)$/.test(e.target.tagName)){e.preventDefault();open(trig(e))}else if(e.key==='ArrowDown'&&trig(e)&&cur===trig(e)&&pop&&!pop.hidden){e.preventDefault();var a=pop.querySelector('a,button');a&&a.focus()}});
window.addEventListener('resize',function(){if(cur&&pop&&!pop.hidden)place(cur)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){prep()});else prep();
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1&&!(pop&&pop.contains(n)))prep(n)})})}).observe(document.documentElement,{childList:true,subtree:true});
window.CraftPop={open:open,close:close,load:load};
})();
