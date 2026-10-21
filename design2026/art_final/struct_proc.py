import json,os,re,datetime,zoneinfo
import process as P
from PIL import Image,ImageFilter
S=json.load(open('src/structures_found.json'))
os.makedirs('structure',exist_ok=True);os.makedirs('work/struct_png',exist_ok=True)
M=json.load(open('manifest.json'));st={x['id']:x for x in M.get('structures',[])};fail=[]
for t,v in S.items():
  s=re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-');f=f'src/structures/{s}.png'
  if s in st or not os.path.exists(f): continue
  try: im=Image.open(f).convert('RGBA')
  except Exception: fail.append(s);continue
  if im.getchannel('A').getextrema()[0]>200: fail.append(s+':opaque-bg');continue
  rgb,A=P.clean_alpha(im);rgb=rgb.filter(ImageFilter.UnsharpMask(1.0,35,2));rgb,k=P.grade(rgb,A,.55);rgb.putalpha(A)
  bb=A.point(lambda x:255 if x>24 else 0).getbbox();c=rgb.crop(bb);w,h=c.size;sc=min(.88*192/w,.88*192/h);nw,nh=round(w*sc),round(h*sc)
  cv=Image.new('RGBA',(192,192),(0,0,0,0));cv.alpha_composite(c.resize((nw,nh),Image.LANCZOS),((192-nw)//2,(192-nh)//2));cv.save(f'work/struct_png/{s}.png')
  st[s]=dict(id=s,en=t,files=P.save_set(cv,f'structure/{s}',[64,96,128,192]),source_px=list(im.size),source_url='https://palworld.fandom.com/wiki/File:'+(v['file'] or ''),credit='© Pocketpair · palworld.fandom.com (CC BY-SA)')
M['structures']=list(st.values());json.dump(M,open('manifest.json.tmp','w'),ensure_ascii=False,indent=1);os.replace('manifest.json.tmp','manifest.json')
t=datetime.datetime.now(zoneinfo.ZoneInfo('Europe/Kaliningrad')).strftime('%Y-%m-%d %H:%M');open('PROGRESS.txt','a').write(f'{t} (Калининград) · постройки/станции: {len(st)}/{len(S)}\n')
print('structures',len(st),'fail',fail)
