import urllib.request,urllib.parse,json,time,io,os
from PIL import Image
UA={'User-Agent':'PalCardsBot/0.1 (personal non-commercial guide; 1 req/s)'}
O='/workspace/palsite/foodimg/'
F=json.load(open('/workspace/palwiki/data/food.json'))
get=lambda u:(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read(),time.sleep(1))[0]
need=[f for f in F if not os.path.exists(O+f['slug']+'.webp')]
T={'File:'+f['slug'].replace('_',' ')+' icon.png':f['slug'] for f in need}
ks=list(T);miss=[]
for i in range(0,len(ks),50):
  d=json.loads(get('https://palworld.wiki.gg/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','prop':'imageinfo','iiprop':'url','titles':'|'.join(ks[i:i+50])})))
  norm={n['to']:n['from'] for n in d['query'].get('normalized',[])}
  for p in d['query']['pages'].values():
    t=norm.get(p['title'],p['title']);s=T.get(t)
    u=p.get('imageinfo',[{}])[0].get('url')
    if not u:miss.append(s);continue
    im=Image.open(io.BytesIO(get(u))).convert('RGBA');im.thumbnail((96,96));im.save(O+s+'.webp','WEBP',quality=85)
print('have',len(os.listdir(O)),'of',len(F),'missing',miss)
