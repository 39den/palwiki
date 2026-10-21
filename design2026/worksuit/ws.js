(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fmt=x=>{x=x<10?Math.round(x*100)/100:Math.round(x);return String(x).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'\u2009')};
const dur=s=>s<1?'меньше 1 с':s<90?fmt(s<10?Math.round(s*10)/10:Math.round(s))+' с':s<5400?fmt(s<600?Math.round(s/6)/10:Math.round(s/60))+' мин':fmt(Math.round(s/360)/10)+' ч';
let W=WD.w[0];const CMP=['handiwork','medicine'];
const st={food:50};
function equiv(S,L){if(S<L[0])return[0,0];if(S>=L[9])return[10,0];for(let i=0;i<9;i++)if(S>=L[i]&&S<L[i+1])return[i+1,(S-L[i])/(L[i+1]-L[i])]}
function tiles(){const L=W.L,mx=Math.log(L[9]/L[0])||1;const S=pSpeed();const [lv]=CMP.includes(W.id)?equiv(S,L):[0];
 $('#lvls').innerHTML=L.map((v,i)=>{const ex=W.extra?`<em>${(W.extra.fmt||'×{}').replace('{}',fmt(W.extra.values[i]))}</em>`:(W.unit&&W.unit!=='сила'?`<em>шт.</em>`:'');
  const fill=W.hide?(i+1)/10:(Math.log(v/L[0])/mx*0.92+0.08);
  return `<div class="lv${i===9?' max':''}${lv===i+1?' hit':''}"><small>${lv===i+1?'ТЫ ≈':W.hide?'УРОВЕНЬ':'УР '+(i+1)}</small><b>${W.hide?i+1:String(v)}</b>${ex}<i><s style="transform:scaleX(${fill.toFixed(3)})"></s></i></div>`}).join('');
 $('#wnote').textContent=(W.note||W.what)+' · напарник +1: '+W.aura;
 $('#books').innerHTML=`<span class="pill">📘 ${W.book}</span>`}
function pSpeed(){const v=+$('#ps').value||1000;let m=1;$$('.side .tc[data-p]').forEach(b=>{if(b.getAttribute('aria-pressed')==='true')m*=1+b.dataset.p/100});return v*m}
function calc(){const SW=CMP.includes(W.id)?W:WD.w[0];const L=SW.L;const S=pSpeed();const wl=+$('#wl').value||3000;
 const lvl=+$('#pl').value,pp=+$('#pp').value,so=+$('#pso').value*3,fd=st.food,bl=$('#bld').getAttribute('aria-pressed')==='true'?20:0;
 $('#plv').textContent=lvl;$('#ppv').textContent='+'+pp+'%';$('#psov').textContent='+'+so+'%';
 const m=(1+pp/100)*(1+so/100)*(1+fd/100)*(1+bl/100);const P=L[lvl-1]*m;
 const [e,fr]=equiv(S,L);
 $('#rw').textContent=SW.em+' '+SW.short;
 $('#r1').innerHTML=e===0?'Слабее <em>1-го</em> уровня':e===10?'Как пал <em>10</em> уровня':fr<.12?`Как пал <em>${e}</em> уровня`:fr>.88?`Почти пал <em>${e+1}</em> уровня`:`Между <em>${e}</em> и <em>${e+1}</em> уровнем`;
 $('#r2').textContent=e===10?`Твои ${fmt(S)} — не меньше, чем у пала 10 уровня (${fmt(L[9])})`:e===0?`Твои ${fmt(S)} — меньше, чем у пала 1 уровня (${fmt(L[0])})`:`Твои ${fmt(S)} против силы пала ${fmt(L[e-1])}–${fmt(L[e])}`;
 $('#r3').textContent=dur(wl/(S/100));$('#r4').textContent=dur(wl/(P/100));
 const k=P/S;$('#r5l').textContent=k>=1?'Пал быстрее тебя':'Ты быстрее пала';$('#r5').textContent='×'+fmt(Math.round((k>=1?k:1/k)*10)/10);
 $('#r6').innerHTML=[`ур. ${lvl}: ${fmt(L[lvl-1])}`,`пассивки ×${fmt(1+pp/100)}`,`души ×${fmt(1+so/100)}`,`еда ×${fmt(1+fd/100)}`,`постройки ×${fmt(1+bl/100)}`,`= ${fmt(Math.round(P))}`].map(x=>`<span>${x}</span>`).join('');
 tiles()}
$$('.wc').forEach(b=>b.onclick=()=>{$$('.wc').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');W=WD.w.find(w=>w.id===b.dataset.w);calc()});
$$('.side .tc').forEach(b=>b.onclick=()=>{b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');calc()});
$$('.seg2 button').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');st.food=+b.dataset.v;calc()});
['#ps','#wl','#pl','#pp','#pso'].forEach(s=>$(s).addEventListener('input',calc));
$$('.qm').forEach(b=>{const t=document.getElementById(b.getAttribute('aria-controls'));const set=o=>{b.setAttribute('aria-expanded',o);t.classList.toggle('on',o)};
 b.addEventListener('click',e=>{e.stopPropagation();const o=b.getAttribute('aria-expanded')!=='true';$$('.qm').forEach(x=>{if(x!==b){x.setAttribute('aria-expanded','false');document.getElementById(x.getAttribute('aria-controls')).classList.remove('on')}});set(o)});
 if(matchMedia('(hover:hover)').matches){b.addEventListener('mouseenter',()=>set(true));b.addEventListener('mouseleave',()=>set(false))}});
document.addEventListener('click',()=>$$('.qm').forEach(x=>{x.setAttribute('aria-expanded','false');document.getElementById(x.getAttribute('aria-controls')).classList.remove('on')}));
const q=new URLSearchParams(location.search);if(q.get('tip'))document.querySelector(`[aria-controls=${q.get('tip')}]`)?.click();if(q.get('w'))document.querySelector(`.wc[data-w=${q.get('w')}]`)?.click();
calc()})();
