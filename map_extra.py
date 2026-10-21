#!/usr/bin/env python3
"""Map layers: Lifmunk effigies, chests, ore, dungeon entrances.
Source: paldb.cc/en/Map + /ru/Map data (js/map_data_{en,ru}.js, game data 1.0.5), fetched 2026-10-21, UA PalpediaBot/1.0.
Snapshot: research/map_extra/paldb_points.json (filtered). World->map: X=(wY-158000)/459, Y=(wX+123888)/459
(verified on fast-travel points vs locations.json). Output: static/map_extra.json."""
import json,os,re,sys,collections
H=os.path.dirname(os.path.abspath(__file__));SNAP=H+'/research/map_extra/paldb_points.json'
ORE={'Ore':'Металлическая руда','Coal':'Уголь','Sulfur':'Сера','Pure Quartz':'Чистый кварц','Chromite':'Хромаит','Hexolite Quartz':'Гексокварц','Soralite':'Соллайт'}
OREU={'Ore':'металлическая-руда','Coal':'уголь','Sulfur':'сера','Pure Quartz':'чистый-кварц','Chromite':'хромаит','Hexolite Quartz':'гексокварц','Soralite':'соллайт'}
def load(p):
  s=open(p).read();d=json.JSONDecoder();o={}
  for m in re.finditer(r'var (\w+)\s*=\s*',s):o[m.group(1)],_=d.raw_decode(s,m.end())
  return o['fixedDungeon']
if len(sys.argv)>2:  # refresh snapshot: map_extra.py en.js ru.js
  en,ru=load(sys.argv[1]),load(sys.argv[2]);assert len(en)==len(ru)
  keep=set(ORE)|{k+' Cluster' for k in ORE}|{'Chest','Chest Element','Dungeon','Lifmunk Effigy'}
  pts=[{'type':a['type'],'en':a.get('item',''),'ru':b.get('item',''),'lv':a.get('lv'),'cd':a.get('cooldown'),'X':a['pos']['X'],'Y':a['pos']['Y']} for a,b in zip(en,ru) if a['type'] in keep and a['pos']==b['pos']]
  os.makedirs(os.path.dirname(SNAP),exist_ok=True)
  json.dump({'source':'https://paldb.cc/en/Map (js/map_data_en.js, map_data_ru.js), game data 1.0.5','fetched':'2026-10-21','points':pts},open(SNAP,'w'),ensure_ascii=False,indent=0)
S=json.load(open(SNAP))
def wt(x,y):return y>735 and -220<x<130
X0,Y0,X1,Y1=-1923.2,1032.8,1234.8,-2125.3
out=collections.defaultdict(list);seen=set()
for p in S['points']:
  x=round((p['Y']-158000)/459);y=round((p['X']+123888)/459)
  if wt(x,y) or not(X0<x<X1 and Y1<y<Y0):continue
  t=p['type']
  if t=='Lifmunk Effigy':r=['effigy',x,y]
  elif t in('Chest','Chest Element'):r=['chest',x,y,1 if t=='Chest Element' else 0]
  elif t=='Dungeon':
    if p['en']=='???':continue
    r=['dungeon',x,y,p['ru'] or '',p['lv'] or 0]
  else:
    b=t.replace(' Cluster','');r=['ore',x,y,list(ORE).index(b),1 if t.endswith('Cluster') else 0]
  k=tuple(r)
  if k in seen:continue
  seen.add(k);out[r[0]].append(r[1:])
J={'src':'paldb.cc (данные игры 1.0.5)','oreN':[[ORE[k],'4_spravochniki/predmety/материалы/#'+OREU[k]] for k in ORE],**out}
json.dump(J,open(H+'/static/map_extra.json','w'),ensure_ascii=False,separators=(',',':'))
print({k:len(v) for k,v in out.items()},os.path.getsize(H+'/static/map_extra.json'))
