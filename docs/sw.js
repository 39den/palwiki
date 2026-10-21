const V='pw-v202610211956';const CORE=['./','assets/search_data.json','assets/extra.css','assets/smart.js','assets/site.js','assets/features.js','assets/ui2.js','assets/ui3.js','gallery/'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);
 const ok=res=>res&&res.ok&&(u.origin==location.origin||/unpkg|fonts/.test(r.url));
 const put=res=>{if(ok(res)){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;};
 const html=r.mode=='navigate'||(r.headers.get('accept')||'').includes('text/html')||/\.json$/.test(u.pathname);
 if(html){e.respondWith(fetch(r,{cache:'no-cache'}).then(put).catch(()=>caches.match(r).then(h=>h||caches.match('./'))));return;}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(put)));});
self.addEventListener('message',e=>{if(e.data=='skip')self.skipWaiting();});
