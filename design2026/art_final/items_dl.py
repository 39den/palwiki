import json,urllib.request,time,os,hashlib
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
R=json.load(open('src/items_found.json'))['res'];os.makedirs('src/items',exist_ok=True)
urls=sorted({v['url'] for v in R.values()});n=0
for u in urls:
  f='src/items/'+hashlib.md5(u.encode()).hexdigest()[:12]+'.png'
  if os.path.exists(f) and os.path.getsize(f)>200: continue
  for t in range(3):
    try: open(f,'wb').write(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read());break
    except Exception as e: time.sleep(5)
  n+=1;time.sleep(1.0)
  if n%100==0: print(n,len(urls),flush=True)
print('DONE',len(urls))
