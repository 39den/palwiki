import json,re,urllib.request,urllib.parse,time
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
D=json.load(open('/workspace/palwiki/data/items.json'))
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
cand={}
for it in D:
  en=it['en'];base=re.sub(r' Schematic \d+$',' Schematic',en)
  vs=[base]
  m=re.match(r"^(\S+?)s (.+)$",base)
  if m: vs.append(f"{m.group(1)}'s {m.group(2)}")
  vs+= [re.sub(r"(\w)s (Saddle|Harness|Saddled|Gloves|Gun|Submachine|Rocket|Shotgun|Assault|Grappling|Glider|Slab|Bow|Talisman|Plume|Petal|Crown|Mask)",r"\1's \2",base)]
  if base.endswith(' Schematic'): vs.append(base[:-10]); 
  cand[slug(en)]=[f"File:{v.replace(' ','_')}_icon.png" for v in dict.fromkeys(vs)]
titles=sorted({t for v in cand.values() for t in v})
import os
found=json.load(open('src/items_cache.json')) if os.path.exists('src/items_cache.json') else {}
done=set(json.load(open('src/items_done.json'))) if os.path.exists('src/items_done.json') else set()
def get(q):
  for t in range(4):
    try: r=json.loads(urllib.request.urlopen(urllib.request.Request('https://palworld.fandom.com/api.php?'+urllib.parse.urlencode(q),headers=UA),timeout=30).read());time.sleep(1.1);return r
    except Exception as e: time.sleep(6)
  return None
for i in range(0,len(titles),50):
  if i in done: continue
  r=get(dict(action='query',titles='|'.join(titles[i:i+50]),prop='imageinfo',iiprop='url|size',format='json',maxlag=5))
  if not r: print('fail batch',i);continue
  norm={n['to']:n['from'] for n in r['query'].get('normalized',[])}
  for pg in r['query']['pages'].values():
    if 'imageinfo' in pg: ii=pg['imageinfo'][0];found[norm.get(pg['title'],pg['title'])]=(ii['url'],ii['width'])
  done.add(i);json.dump(found,open('src/items_cache.json','w'));json.dump(sorted(done),open('src/items_done.json','w'));print('batch',i,len(found),flush=True)
res={}
for s,v in cand.items():
  for t in v:
    if t in found: res[s]=dict(file=t,url=found[t][0],w=found[t][1]);break
json.dump(dict(cand=cand,res=res),open('src/items_found.json','w'),indent=1)
print(len(cand),'items',len(res),'found',len(titles),'titles')
miss=[s for s in cand if s not in res];print(miss[:40])
