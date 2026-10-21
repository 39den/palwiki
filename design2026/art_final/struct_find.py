import json,urllib.request,urllib.parse,time
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
def api(q):
  time.sleep(1.2);return json.loads(urllib.request.urlopen(urllib.request.Request('https://palworld.fandom.com/api.php?'+urllib.parse.urlencode(dict(q,format='json',maxlag=5)),headers=UA),timeout=30).read())
m=api(dict(action='query',list='categorymembers',cmtitle='Category:Structures',cmlimit=500,cmnamespace=0))['query']['categorymembers']
T=[x['title'] for x in m];out={}
for i in range(0,len(T),50):
  r=api(dict(action='query',titles='|'.join(T[i:i+50]),prop='pageimages',piprop='original|name',pilimit=50))
  for pg in r['query']['pages'].values():
    if 'original' in pg: out[pg['title']]=dict(file=pg.get('pageimage'),url=pg['original']['source'],w=pg['original']['width'],h=pg['original']['height'])
json.dump(out,open('src/structures_found.json','w'),indent=1)
print(len(T),'structures',len(out),'with image');print([t for t in T if t not in out])
import collections;print(collections.Counter((v['w'],v['h']) for v in out.values()).most_common(5))
