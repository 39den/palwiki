import json,os,hashlib,re,datetime,zoneinfo
import process as P
from PIL import Image,ImageFilter
B=P.B;R=json.load(open('src/items_found.json'))['res'];D={re.sub(r'[^a-z0-9]+','-',i['en'].lower()).strip('-'):i for i in json.load(open('/workspace/palwiki/data/items.json'))}
os.makedirs('item',exist_ok=True);os.makedirs('work/items_png',exist_ok=True)
M=json.load(open('manifest.json'));items={x['id']:x for x in M.get('items',[])}
def save():
  M['items']=list(items.values());json.dump(M,open('manifest.json.tmp','w'),ensure_ascii=False,indent=1);os.replace('manifest.json.tmp','manifest.json')
  t=datetime.datetime.now(zoneinfo.ZoneInfo('Europe/Kaliningrad')).strftime('%Y-%m-%d %H:%M');open('PROGRESS.txt','a').write(f'{t} (Калининград) · иконки предметов: {len(items)}/{len(D)}\n')
n=0;fail=[]
for s,v in R.items():
  if s in items: continue
  f='src/items/'+hashlib.md5(v['url'].encode()).hexdigest()[:12]+'.png'
  if not os.path.exists(f): continue
  try: im=Image.open(f).convert('RGBA')
  except Exception: fail.append(s);continue
  a=im.getchannel('A')
  if a.getextrema()[0]>200: fail.append(s+':opaque');continue
  rgb,A=P.clean_alpha(im);rgb=rgb.filter(ImageFilter.UnsharpMask(1.0,35,2));rgb,k=P.grade(rgb,A,.55);rgb.putalpha(A)
  bb=A.point(lambda x:255 if x>24 else 0).getbbox()
  if not bb: fail.append(s+':empty');continue
  c=rgb.crop(bb);w,h=c.size;sc=min(.88*192/w,.88*192/h);nw,nh=max(1,round(w*sc)),max(1,round(h*sc))
  cv=Image.new('RGBA',(192,192),(0,0,0,0));cv.alpha_composite(c.resize((nw,nh),Image.LANCZOS),((192-nw)//2,(192-nh)//2))
  cv.save(f'work/items_png/{s}.png')
  items[s]=dict(id=s,en=D[s]['en'],ru=D[s]['ru'],type=D[s]['type'],files=P.save_set(cv,f'item/{s}',[64,96,128,192]),source_px=list(im.size),
     upscale=round(max(nw,nh)/max(w,h),2),source_url='https://palworld.fandom.com/wiki/'+v['file'].replace(' ','_'),credit='© Pocketpair · palworld.fandom.com (CC BY-SA)',shared_icon_of=v.get('shared_icon_of'),fuzzy_match=v.get('match'),note=v.get('note'))
  n+=1
  if n%100==0: save()
save();print('items',len(items),'fail',fail)
