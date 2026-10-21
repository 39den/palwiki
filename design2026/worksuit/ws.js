(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fmt=x=>{x=x<10?Math.round(x*100)/100:Math.round(x);return String(x).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'\u2009')};
let W=WD.w[0];const CMP=['handiwork','medicine'];
const st={food:0,pp:0};
function equiv(S,L){if(S<L[0])return[0,0];if(S>=L[9])return[10,0];for(let i=0;i<9;i++)if(S>=L[i]&&S<L[i+1])return[i+1,(S-L[i])/(L[i+1]-L[i])]}
function tiles(){const L=W.L,mx=Math.log(L[9]/L[0])||1;const S=pSpeed();const [lv]=CMP.includes(W.id)?equiv(S,L):[0];
 $('#lvls').innerHTML=L.map((v,i)=>{const ex=W.extra?`<em>${(W.extra.fmt||'×{}').replace('{}',fmt(W.extra.values[i]))}</em>`:(W.unit&&W.unit!=='сила'?`<em>шт.</em>`:'');
  const fill=W.hide?(i+1)/10:(Math.log(v/L[0])/mx*0.92+0.08);
  return `<div class="lv${i===9?' max':''}${lv===i+1?' hit':''}"><small>${lv===i+1?'ТЫ ≈':W.hide?'УРОВЕНЬ':'УР '+(i+1)}</small><b>${W.hide?i+1:String(v)}</b>${ex}<i><s style="transform:scaleX(${fill.toFixed(3)})"></s></i></div>`}).join('');
 $('#wnote').textContent=(W.note||W.what)+' · напарник +1: '+W.aura;
 $('#books').innerHTML=`<span class="pill">📘 ${W.book}</span>`}
const dur=s=>{s=Math.ceil(s);if(s<60)return s+' с';if(s<3600){const m=Math.floor(s/60),r=s%60;return m+' мин'+(r?' '+r+' с':'')}const h=Math.floor(s/3600),m=Math.round(s%3600/60);return h+' ч'+(m?' '+m+' мин':'')};
const wn=n=>{n=Math.abs(n)%100;const a=n%10;return n>10&&n<20?'штук':a===1?'штуку':a>1&&a<5?'штуки':'штук'};
function pSpeed(){const pts=Math.min(50,Math.max(0,+$('#pts').value||0));let m=1;$$('.side .tc[data-p]').forEach(b=>{if(b.getAttribute('aria-pressed')==='true')m*=1+b.dataset.p/100});return (100+50*pts)*m}
function rec(){const v=$('#rc').value;if(v==='c')return{n:'Свой предмет',w:CMP.includes(W.id)?W.id:'handiwork',a:Math.max(1,+$('#wl').value||50)};return WD.rec[+v]}
function calc(){const R=rec();const SW=WD.w.find(w=>w.id===R.w);const L=SW.L;const S=pSpeed();const q=Math.max(1,Math.round(+$('#qty').value||1));
 $('#wlf').hidden=$('#rc').value!=='c';
 $('#wlh').textContent=`На 1 штуку нужно ${fmt(R.a)} единиц работы. Герой без прокачки делает 1 единицу в секунду.`;
 const lvl=+$('#pl').value,pp=st.pp,fd=st.food,bl=$('#bld').getAttribute('aria-pressed')==='true'?20:0;
 $('#plv').textContent=lvl;
 const m=(1+pp/100)*(1+fd/100)*(1+bl/100);const P=L[lvl-1]*m;
 const tY=q*R.a/(S/100),tP=q*R.a/(P/100);
 $('#rw').textContent=SW.em+' '+SW.ru;
 const pn=$('#pn').value.trim();
 $('#r1').innerHTML=`${pn?pn:'Пал'} сделает за <em>${dur(tP)}</em>`;
 $('#r2').textContent=`${q} ${wn(q)} — ${R.n.toLowerCase()}`;
 $('#r3').textContent=dur(tY);$('#r4').textContent=dur(tP);
 const k=P/S;$('#r5l').textContent=k>=1?'Пал быстрее тебя':'Ты быстрее пала';$('#r5').textContent='в '+fmt(Math.round((k>=1?k:1/k)*10)/10)+' раза';
 $('#r6').innerHTML=[`уровень ${lvl}: ${fmt(L[lvl-1])} в секунду`,pp?`пассивки ×${fmt(1+pp/100)}`:'',fd?`еда ×${fmt(1+fd/100)}`:'',bl?`постройки ×${fmt(1+bl/100)}`:'',`твоя скорость: ${fmt(Math.round(S))}`].filter(Boolean).map(x=>`<span>${x}</span>`).join('');
 tiles()}
function pickPal(){const n=$('#pn').value.trim().toLowerCase();const p=WD.pals.find(x=>x.n.toLowerCase()===n);if(!p)return;const R=rec();const lv=p[R.w]||p.handiwork||p.medicine;if(lv){$('#pl').value=lv}}
$$('.wc').forEach(b=>b.onclick=()=>{$$('.wc').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');W=WD.w.find(w=>w.id===b.dataset.w);calc()});
$$('.side .tc').forEach(b=>b.onclick=()=>{b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');calc()});
$$('.seg2 button').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');st[b.parentElement.dataset.g]=+b.dataset.v;calc()});
['#pts','#wl','#qty','#pl'].forEach(s=>$(s).addEventListener('input',calc));$('#rc').addEventListener('change',()=>{pickPal();calc()});['input','change'].forEach(ev=>$('#pn').addEventListener(ev,()=>{pickPal();calc()}));
$$('.qm').forEach(b=>{const t=document.getElementById(b.getAttribute('aria-controls'));const set=o=>{b.setAttribute('aria-expanded',o);t.classList.toggle('on',o)};
 b.addEventListener('click',e=>{e.stopPropagation();const o=b._hov?true:b.getAttribute('aria-expanded')!=='true';b._hov=false;$$('.qm').forEach(x=>{if(x!==b){x.setAttribute('aria-expanded','false');document.getElementById(x.getAttribute('aria-controls')).classList.remove('on')}});set(o)});
 if(matchMedia('(hover:hover)').matches){b.addEventListener('mouseenter',()=>{b._hov=true;set(true)});b.addEventListener('mouseleave',()=>{b._hov=false;set(false)})}});
document.addEventListener('click',()=>$$('.qm').forEach(x=>{x.setAttribute('aria-expanded','false');document.getElementById(x.getAttribute('aria-controls')).classList.remove('on')}));
const q=new URLSearchParams(location.search);if(q.get('tip'))document.querySelector(`[aria-controls=${q.get('tip')}]`)?.click();if(q.get('w'))document.querySelector(`.wc[data-w=${q.get('w')}]`)?.click();
calc()})();
