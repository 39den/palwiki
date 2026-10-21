# World Tree map assets: tiles (paldb.cc treemap, game map texture, cached in wt_tiles) + markers from paldb treemap_data (cached .tmd.js)
import json,re,os,shutil
from PIL import Image
S='/workspace/palsite';W=S+'/wt_tiles';O=S+'/wtree';os.makedirs(O+'/tiles',exist_ok=True)
for f in os.listdir(W):
  if f.endswith('.webp'):shutil.copy(W+'/'+f,O+'/tiles/'+f)
# fill tiles the source lacks: compose from children, else upscale the parent's quarter (no black holes / seams)
def _have(z,x,y):return os.path.exists(f'{W}/z{z}x{x}y{y}.webp')
from functools import lru_cache
@lru_cache(None)
def _tile(z,x,y,down=True):
  if _have(z,x,y):return Image.open(f'{W}/z{z}x{x}y{y}.webp').convert('RGB')
  if down and z<3:
    kids=[[_tile(z+1,2*x+i,2*y+j,True) for j in (0,1)] for i in (0,1)]
    if all(k is not None for r in kids for k in r):
      im=Image.new('RGB',(1024,1024))
      for i in (0,1):
        for j in (0,1):im.paste(kids[i][j],(i*512,j*512))
      return im.resize((512,512),Image.LANCZOS)
  if z>0:
    p=_tile(z-1,x//2,y//2,False) if True else None
    if p is None:p=_tile(z-1,x//2,y//2,True)
    if p is not None:
      i,j=x%2,y%2;return p.crop((i*256,j*256,i*256+256,j*256+256)).resize((512,512),Image.BICUBIC)
  return None
SEA=Image.open(f'{W}/z0x0y0.webp').convert('RGB').getpixel((2,2))
blank=Image.new('RGB',(512,512),SEA);blank.save(O+'/tiles/blank.webp','WEBP',quality=60)
filled=0
for z in range(4):
  for x in range(2**z):
    for y in range(2**z):
      f=f'{O}/tiles/z{z}x{x}y{y}.webp'
      if _have(z,x,y):continue
      t=_tile(z,x,y,True) or _tile(z,x,y,False) or blank;t.save(f,'WEBP',quality=80);filled+=1
json.dump({'sea':'#%02x%02x%02x'%SEA[:3]},open(O+'/sea.json','w'))
print('tree: filled tiles',filled,'sea',SEA)
z2=Image.new('RGB',(2048,2048),(11,16,22))
for x in range(4):
  for y in range(4):
    f=f'{W}/z2x{x}y{y}.webp'
    if os.path.exists(f):z2.paste(Image.open(f).convert('RGB'),(x*512,y*512))
z2.resize((1024,1024),Image.LANCZOS).save(O+'/mini_tree.webp','WEBP',quality=78)
# palpagos mini from our wiki.gg tiles z2 (256px tiles)
T=S+'/docs/assets/tiles/2' if os.path.exists(S+'/docs/assets/tiles/2') else None
if T:
  m=Image.new('RGB',(1024,1024),(11,16,22))
  for x in range(4):
    for y in range(4):
      f=f'{T}/{x}/{y}.webp'
      if os.path.exists(f):m.paste(Image.open(f).convert('RGB'),(x*256,y*256))
  m.save(O+'/mini_palpagos.webp','WEBP',quality=78)
s=open(S+'/.tmd.js').read();i=s.find('var fixedDungeon');fd=json.loads(s[i+len('var fixedDungeon = '):s.rfind(']',i,s.find('var regionData'))+1])
c=s[s.find('var config = ')+13:s.find(';var fixedDungeon')];cf=json.loads(c);mn=cf['landScapeRealPositionMin'];mx=cf['landScapeRealPositionMax']
TY={'Alpha Pal':'alpha','Fast Travel':'travel','Tower':'tower','Watchtower':'watch','NPC':'npc','Chest':'chest','Fruit Tree':'fruit','Teafant Spring':'spring','Fishing Spot':'fish','Rare Fishing Spot':'fish'}
LR=json.load(open('/workspace/palwiki/data/loc_ru.json'))
PR={p['en']:p['ru'] for p in json.load(open('/workspace/palwiki/data/pals.json'))}
TWR={'Zenara':'Зенара и Астралим','Dandilord':'Дандилорд','Silvance':'Сильванс','Grizzbolt':'Гризболт'}
def ru(n,t):
  n=re.sub(r'\s*\((?:WIP|\?+)\)|\?\?\?','',n).strip()
  if not n:return ''
  if n in LR:return LR[n]['ru']
  if n in PR:return PR[n]
  for k,v in TWR.items():
    if k in n:return v
  if n.endswith(' Watchtower') and n[:-11] in LR:return 'Вышка: '+LR[n[:-11]]['ru']
  return '' if re.search('[A-Za-z]',n) else n
out=[]
for f in fd:
  t=TY.get(f['type'])
  if not t or not f.get('pos'):continue
  p=f['pos'];fx=(p['Y']-mn['Y'])/(mx['Y']-mn['Y']);fy=1-(p['X']-mn['X'])/(mx['X']-mn['X'])
  nm=re.sub('<[^>]+>','',f.get('item','')).strip();out.append({'t':t,'n':ru(nm,t),'c':f.get('comment') or '','lv':f.get('lv'),'x':round(fx,4),'y':round(fy,4)})
json.dump({'src':'paldb.cc (данные игры Palworld 1.0.5)','pts':out},open(O+'/markers.json','w'),ensure_ascii=False,separators=(',',':'))
print('tree: tiles',len(os.listdir(O+'/tiles')),'markers',len(out))
