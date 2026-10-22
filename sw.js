const C='v27-r12',B='/palwiki/';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll([B,B+'offline.html',B+'assets/v27/all.css',B+'assets/v27/mark.svg'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||!r.url.startsWith(self.location.origin))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(C).then(c=>c.put(r,y));return x}).catch(()=>caches.match(r).then(x=>x||caches.match(B+'offline.html'))));return}
 if(/\.(css|js|webp|png|svg|woff2)$/.test(new URL(r.url).pathname))e.respondWith(caches.match(r).then(x=>x||fetch(r).then(y=>{const z=y.clone();caches.open(C).then(c=>c.put(r,z));return y})));});
