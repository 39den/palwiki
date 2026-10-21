import json,urllib.request,urllib.parse,time
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
m=json.load(open('manifest.json'));B=[p for p in m['pals'] if p['kind']=='icon-portrait']
out={};exact={}
for p in B:
  n=p['en'].replace(' ','_')
  try:
    q=urllib.parse.urlencode(dict(action='query',list='allimages',aiprefix=n,aiprop='size|url',ailimit=50,format='json'))
    r=json.loads(urllib.request.urlopen(urllib.request.Request('https://palworld.fandom.com/api.php?'+q,headers=UA),timeout=20).read())
    v=[(x['name'],x['width'],x['height'],x['url']) for x in r['query']['allimages']];out[p['id']]=v
    c=[x for x in v if x[0].rsplit('.',1)[0].lower()==n.lower()]
    if c: exact[p['id']]=c[0]
  except Exception as e: out[p['id']]=str(e)
  time.sleep(1.1)
json.dump(out,open('src/hunt/fandom.json','w'),indent=1);json.dump(exact,open('src/hunt/fandom_exact.json','w'),indent=1)
print(len(exact),'exact');print([k for k in out if k not in exact])
