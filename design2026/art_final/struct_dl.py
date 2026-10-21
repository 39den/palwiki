import json,urllib.request,time,os,re
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
S=json.load(open('src/structures_found.json'));os.makedirs('src/structures',exist_ok=True)
for t,v in S.items():
  s=re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-');f=f'src/structures/{s}.png'
  if os.path.exists(f) and os.path.getsize(f)>200: continue
  for k in range(3):
    try: open(f,'wb').write(urllib.request.urlopen(urllib.request.Request(v['url'],headers=UA),timeout=30).read());break
    except Exception: time.sleep(5)
  time.sleep(1.0)
print('DONE')
