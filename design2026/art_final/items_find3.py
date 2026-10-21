import json,re,urllib.request,urllib.parse,time,os,difflib
UA={'User-Agent':'PalpediaArtBot/0.3 (personal non-commercial fan guide; 1 req/s)'}
F=json.load(open('src/items_found.json'));D=json.load(open('/workspace/palwiki/data/items.json'))
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def norm(s): return re.sub(r"[^a-z0-9]","",s.lower().replace("'s","s").replace("'",""))
C=json.load(open('src/items_prefix_cache.json')) if os.path.exists('src/items_prefix_cache.json') else {}
def listing(pre):
  if pre in C: return C[pre]
  out=[];cont={}
  for _ in range(5):
    q=dict(action='query',list='allimages',aiprefix=pre,aiprop='url|size',ailimit=500,format='json',maxlag=5,**cont)
    try: r=json.loads(urllib.request.urlopen(urllib.request.Request('https://palworld.fandom.com/api.php?'+urllib.parse.urlencode(q),headers=UA),timeout=30).read())
    except Exception: break
    time.sleep(1.1);out+=[(x['name'],x['url'],x['width']) for x in r['query']['allimages'] if 'icon' in x['name'].lower()]
    if 'continue' in r: cont={'aicontinue':r['continue']['aicontinue']}
    else: break
  C[pre]=out;json.dump(C,open('src/items_prefix_cache.json','w'));return out
miss=[i for i in D if slug(i['en']) not in F['res']];shared={};n=0
for it in miss:
  en=it['en'];s=slug(en);base=re.sub(r' Schematic( \d+)?$','',en)
  m=re.match(r'^(?:(\w+) )?Skill Fruit: (.+)$',base)
  pres=[]
  if m: pres=['Skill_Fruit',(m.group(1) or '')+'_Skill_Fruit'];target='skillfruit'+norm(m.group(2))
  else: pres=[base.split(' ')[0].replace("'","")[:6]];target=norm(base)
  best=(0,None)
  for p in pres:
    for name,url,w in listing(p.strip('_')):
      nn=norm(name.rsplit('.',1)[0]).replace('icon','')
      r=difflib.SequenceMatcher(None,nn,target).ratio()
      if r>best[0]: best=(r,dict(file='File:'+name,url=url,w=w,match=round(r,3)))
  if best[0]>=0.9: F['res'][s]=best[1];n+=1;continue
  # shared-icon fallbacks (same in-game icon family)
  fb=None
  mm=re.match(r'^(Large|Huge) (.+ Egg)$',en)
  if mm and slug(mm.group(2)) in F['res']: fb=slug(mm.group(2))
  elif en!=base and slug(base) in F['res']: fb=slug(base)
  elif m and best[0]>=0.6: F['res'][s]=dict(best[1],note='skill-fruit element icon');n+=1;continue
  if fb: F['res'][s]=dict(F['res'][fb],shared_icon_of=fb);shared[s]=fb
json.dump(F,open('src/items_found.json','w'),indent=1)
print('fuzzy',n,'shared',len(shared),'total',len(F['res']),'of',len(D))
print('still missing',[i['en'] for i in D if slug(i['en']) not in F['res']][:80])
