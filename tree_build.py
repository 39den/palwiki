# World Tree map assets: tiles (paldb.cc treemap, game map texture, cached in wt_tiles) + markers from paldb treemap_data (cached .tmd.js)
import json,re,os,shutil
from PIL import Image
S='/workspace/palsite';W=S+'/wt_tiles';O=S+'/wtree';os.makedirs(O+'/tiles',exist_ok=True)
for f in os.listdir(W):
  if f.endswith('.webp'):shutil.copy(W+'/'+f,O+'/tiles/'+f)
blank=Image.new('RGB',(512,512),(11,16,22));blank.save(O+'/tiles/blank.webp','WEBP',quality=60)
for z in range(4):
  for x in range(2**z):
    for y in range(2**z):
      f=f'{O}/tiles/z{z}x{x}y{y}.webp'
      if not os.path.exists(f):shutil.copy(O+'/tiles/blank.webp',f)
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
out=[]
for f in fd:
  t=TY.get(f['type'])
  if not t or not f.get('pos'):continue
  p=f['pos'];fx=(p['Y']-mn['Y'])/(mx['Y']-mn['Y']);fy=1-(p['X']-mn['X'])/(mx['X']-mn['X'])
  nm=re.sub('<[^>]+>','',f.get('item','')).strip();out.append({'t':t,'n':nm,'c':f.get('comment') or '','lv':f.get('lv'),'x':round(fx,4),'y':round(fy,4)})
json.dump({'src':'paldb.cc (данные игры Palworld 1.0.5)','pts':out},open(O+'/markers.json','w'),ensure_ascii=False,separators=(',',':'))
print('tree: tiles',len(os.listdir(O+'/tiles')),'markers',len(out))
