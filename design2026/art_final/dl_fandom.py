import json,urllib.request,time,os
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
E=json.load(open('src/hunt/fandom_exact.json'))
for pid,(n,w,h,u) in E.items():
  f=f'src/fandom/{pid}.'+n.rsplit('.',1)[1].lower()
  if os.path.exists(f) and os.path.getsize(f)>1000: continue
  for t in range(3):
    try: open(f,'wb').write(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read());break
    except Exception as e: print('retry',pid,e);time.sleep(5)
  time.sleep(1.1)
