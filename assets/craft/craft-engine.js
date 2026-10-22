/* Движок калькулятора крафта Палпедии. Без DOM, работает в Node. Данные: craft.json */
(function(G){
function E(D){this.D=D;this.I=D.items;this.al={};for(const id in this.I){const x=this.I[id];this.al[id]=id;this.al[x.en.toLowerCase()]=id;this.al[x.ru.toLowerCase()]=id;}}
E.prototype.find=function(k){if(k==null)return null;k=String(k);if(this.I[k])return k;var l=k.toLowerCase();return this.al[l]||this.al[l.replace(/[_ ]+/g,'-')]||this.al[l.replace(/[_-]+/g,' ')]||this.al[l.replace(/_/g,' ')]||null;};
E.prototype.recipe=function(id,vars){const x=this.I[id];if(!x||!x.r||!x.r.length)return null;const v=(vars&&vars[id])|0;return x.r[Math.min(v,x.r.length-1)];};
/* дерево: на каждом узле q, запуски крафта, станки, уровень; have вычитается из общего пула по ходу обхода */
E.prototype.tree=function(id,q,o){o=o||{};const vars=o.vars||{},pool=Object.assign({},o.have||{}),self=this;
 function go(id,q,path,top){const x=self.I[id]||{ru:id,en:id};const n={id:id,q:q,ru:x.ru};
  if(!top&&pool[id]>0){const u=Math.min(pool[id],q);pool[id]-=u;n.have=u;q-=u;n.need=q;}else n.need=q;
  if(path.indexOf(id)>=0){n.cycle=true;return n;}
  const r=self.recipe(id,vars);if(!r){n.raw=true;n.norec=!(x.r&&x.r.length)&&!x.rawKnown;return n;}
  if(n.need<=0){n.r=r;n.runs=0;n.kids=[];return n;}
  n.r=r;n.runs=Math.ceil(n.need/(r.y||1));n.kids=r.m.map(([c,k])=>go(c,k*n.runs,path.concat(id),false));return n;}
 return go(id,q,[],true);};
/* сводка: агрегировано по графу (общий округлённый расход), промежуточные в порядке изготовления */
E.prototype.summary=function(id,q,o){o=o||{};const vars=o.vars||{},have=o.have||{},self=this;
 const order=[],seen={},onst={},cyc=[];
 (function dfs(i){if(seen[i])return;seen[i]=1;onst[i]=1;const r=self.recipe(i,vars);if(r)for(const [c] of r.m){if(onst[c]){cyc.push([i,c]);continue;}dfs(c);}onst[i]=0;order.push(i);})(id);
 const need={};need[id]=q;const runs={},raw={},inter=[],st={},tech={};
 for(let k=order.length-1;k>=0;k--){const i=order[k],r=this.recipe(i,vars);let n=need[i]||0;if(!n)continue;
  if(i!==id){const h=Math.min(have[i]||0,n);n-=h;}
  if(!r||cyc.some(e=>e[1]===i&&e[0]!==i&&false)){raw[i]=(raw[i]||0)+n;continue;}
  const ru=Math.ceil(n/(r.y||1));runs[i]=ru;if(ru<=0)continue;
  for(const [c,kk] of r.m){if(cyc.some(e=>e[0]===i&&e[1]===c)){raw[c]=(raw[c]||0)+kk*ru;continue;}need[c]=(need[c]||0)+kk*ru;}
  if(i!==id)inter.push({id:i,q:n,runs:ru,y:r.y||1});
  (r.st||[]).length&&(st[r.st[0]]=st[r.st[0]]||{all:r.st,items:[]},st[r.st[0]].items.push(i));
  if(r.tl)tech[i]=r.tl;}
 inter.reverse();
 return {raw:raw,inter:inter,stations:st,tech:tech,cycles:cyc,maxTech:Math.max(0,...Object.values(tech))};};
if(typeof module!=='undefined')module.exports=E;else G.CraftEngine=E;
})(this);
