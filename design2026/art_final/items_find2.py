import json,re,urllib.request,urllib.parse,time,os
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
F=json.load(open('src/items_found.json'));D=json.load(open('/workspace/palwiki/data/items.json'))
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def norm(s): return re.sub(r"[^a-z0-9]","",s.lower().replace("'s","s"))
cache=json.load(open('src/items_find2.json')) if os.path.exists('src/items_find2.json') else {}
miss=[i for i in D if slug(i['en']) not in F['res']]
for it in miss:
  s=slug(it['en'])
  if s in cache: continue
  base=re.sub(r' Schematic \d+$','',it['en']);pre=base.split(' ')[0].rstrip('s')
  try:
    q=urllib.parse.urlencode(dict(action='query',list='allimages',aiprefix=pre,aiprop='size|url',ailimit=200,format='json',maxlag=5))
    r=json.loads(urllib.request.urlopen(urllib.request.Request('https://palworld.fandom.com/api.php?'+q,headers=UA),timeout=20).read())['query']['allimages']
  except Exception as e: r=[]
  want=norm(base)+'icon';hit=None
  for x in r:
    n=norm(x['name'].rsplit('.',1)[0])
    if n==want or n==norm(base.replace('Large ','').replace('Huge ',''))+'icon': hit=dict(file='File:'+x['name'],url=x['url'],w=x['width']);break
  cache[s]=hit;json.dump(cache,open('src/items_find2.json','w'));time.sleep(1.1)
n=0
for s,h in cache.items():
  if h: F['res'][s]=h;n+=1
json.dump(F,open('src/items_found.json','w'),indent=1)
print('extra',n,'total',len(F['res']),'of',len(D))
print([s for s,h in cache.items() if not h][:60])
