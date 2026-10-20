const V='pw-v202610201503';const CORE=['./','assets/search_data.json','assets/extra.css','assets/smart.js','assets/site.js','assets/features.js','gallery/'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;
 e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok&&(new URL(r.url).origin==location.origin||/unpkg|fonts/.test(r.url))){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;}).catch(()=>hit);return hit||net;}));});
