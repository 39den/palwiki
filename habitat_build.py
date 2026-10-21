# Habitat points per pal. Sources: paldb.cc /paldex/<id>.json (spawn points with level, from game data) with
# DT_PaldexDistributionData fallback; cached locally (.paldex, .pdd_raw.json); fetched politely once (1 req/s).
import json,os,glob,collections
S='/workspace/palsite';OUT=S+'/hab';os.makedirs(OUT,exist_ok=True)
TMIN=(347351.5,-818197);TMAX=(689148.5,-476400)
def conv(p):
  if TMIN[0]<=p['X']<=TMAX[0] and TMIN[1]<=p['Y']<=TMAX[1]:
    return 't',[round((p['Y']-TMIN[1])/(TMAX[1]-TMIN[1]),4),round(1-(p['X']-TMIN[0])/(TMAX[0]-TMIN[0]),4)]
  return 'p',[round((p['Y']+301000)/459-1000),round((p['X']+582888)/459-1000)]
pals=json.load(open('/workspace/palwiki/data/pals.json'))
DT=json.load(open(S+'/.pdd_raw.json'))[0]['Rows']
L=json.load(open('/workspace/palwiki/data/locations.json'))
FT=[(f['xy'],f.get('region_ru') or f.get('region')) for f in L['fast_travel'] if f.get('xy')]
def region(x,y):
  b=min(FT,key=lambda f:(f[0][0]-x)**2+(f[0][1]-y)**2);return b[1]
def pts(src):
  o={}
  for t,key in (('dayTimeLocations','d'),('nightTimeLocations','n')):
    for p in ((src or {}).get(t) or {}).get('Locations',[]):
      w,xy=conv(p);g=4 if w=='p' else .003
      kk=(key,round(xy[0]/g),round(xy[1]/g))
      o.setdefault(w,{}).setdefault(key,{}).setdefault(kk,xy+([p['lv']] if p.get('lv') else []))
  return {w:{k:list(v.values()) for k,v in d.items()} for w,d in o.items()}
SUM={};miss=[]
for p in pals:
  i=p['id'];f=f"{S}/.paldex/{i.lower()}.json"
  src=json.load(open(f)) if os.path.exists(f) and os.path.getsize(f)>20 else DT.get(i)
  H=pts(src)
  bo=pts(DT.get('BOSS_'+i)) if DT.get('BOSS_'+i) else {}
  for w,d in bo.items():H.setdefault(w,{})['a']=[x for k in d.values() for x in k][:12]
  hb=p.get('habitat') or {}
  lv=[x[2] for w in H.values() for k in ('d','n') for x in w.get(k,[]) if len(x)>2]
  rg=collections.Counter(region(x[0],x[1]) for x in H.get('p',{}).get('d',[])+H.get('p',{}).get('n',[]))
  s={'d':len(H.get('p',{}).get('d',[])),'n':len(H.get('p',{}).get('n',[])),'t':sum(len(v) for v in H.get('t',{}).values()),'a':sum(len(v.get('a',[])) for v in H.values()),
     'lv':[min(lv),max(lv)] if lv else None,'rg':[r for r,_ in rg.most_common(4) if r],'dg':hb.get('dungeons') or [],'egg':hb.get('egg') or '','mer':bool(hb.get('merchant')),'wild':bool(hb.get('wild'))}
  if H:json.dump(H,open(f'{OUT}/{i}.json','w'),separators=(',',':'))
  SUM[i]=s
  if s['wild'] and not (s['d'] or s['n'] or s['t'] or s['a']) :miss.append(i)
json.dump(SUM,open(S+'/hab_summary.json','w'),ensure_ascii=False)
print('habitat: files',len(os.listdir(OUT)),'wild w/o points',len(miss),miss)
