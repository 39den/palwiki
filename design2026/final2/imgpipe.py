# Uniform image pipeline: crop/normalise, light colour grade, WebP + srcset widths. Writes img/manifest.json with true source per file.
from PIL import Image,ImageEnhance,ImageStat,ImageFilter
import json,os,glob
D=json.load(open('../../docs/assets/search_data.json'));P={p['en']:p for p in D['pals']}
MAN={}
SRC_PAL='© Pocketpair · palworld.wiki.gg'
SRC_FOOD='© Pocketpair · palworld.wiki.gg'
SRC_STEAM='Скриншот из Steam'
SRC_MAP='Карта: palworld.wiki.gg, CC BY-SA · © Pocketpair'
def grade(im,target=.52,alpha=None):
  rgb=im.convert('RGB');m=ImageStat.Stat(rgb.convert('L'),mask=alpha).mean[0]/255
  k=max(.88,min(1.14,target/max(m,.05)))   # gentle exposure normalisation
  rgb=ImageEnhance.Brightness(rgb).enhance(k);rgb=ImageEnhance.Contrast(rgb).enhance(1.05);rgb=ImageEnhance.Color(rgb).enhance(1.06)
  # warm split-tone: lift shadows slightly toward #13202a? keep subtle warm highlight
  r,g,b=rgb.split();r=r.point(lambda v:min(255,int(v*1.012)));b=b.point(lambda v:int(v*.988));rgb=Image.merge('RGB',(r,g,b))
  if alpha is not None: rgb.putalpha(alpha)
  return rgb
def save(im,base,widths,q,src,kind):
  out=[]
  for w in widths:
    h=round(im.height*w/im.width);x=im.resize((w,h),Image.LANCZOS)
    if w<im.width*0.8: x=x.filter(ImageFilter.UnsharpMask(1,40,2))
    fn=f'{base}-{w}.webp';x.save(fn,'WEBP',quality=q,method=6,alpha_quality=100 if x.mode=='RGBA' else None) if x.mode=='RGBA' else x.save(fn,'WEBP',quality=q,method=6);out.append((fn,w))
  MAN[base]=dict(src=src,kind=kind,files=out,w=im.width,h=im.height);return out
def pal(en,S=640):
  p=P[en];f=f'/workspace/palcards/art/{p["id"]}.png'
  im=Image.open(f).convert('RGBA');a=im.split()[3];bb=a.point(lambda v:255 if v>24 else 0).getbbox();im=im.crop(bb)
  w,h=im.size;k=min(S*.86/h,S*.90/w);im=im.resize((round(w*k),round(h*k)),Image.LANCZOS)
  C=Image.new('RGBA',(S,S),(0,0,0,0));C.paste(im,((S-im.width)//2,round(S*.93)-im.height),im)
  C=grade(C,.50,C.split()[3])
  upscale=k>1.05
  save(C,f'img/pal/{p["id"]}',[320,640],90,SRC_PAL,'pal');MAN[f'img/pal/{p["id"]}']['upscaled']=round(k,2);return C
def food(slug):
  im=Image.open(f'../../docs/food/{slug}.webp').convert('RGBA');a=im.split()[3];bb=a.getbbox();im=im.crop(bb)
  S=192;w,h=im.size;k=min(S*.84/w,S*.84/h);im=im.resize((round(w*k),round(h*k)),Image.LANCZOS)
  C=Image.new('RGBA',(S,S),(0,0,0,0));C.paste(im,((S-im.width)//2,(S-im.height)//2),im);C=grade(C,.55,C.split()[3])
  save(C,f'img/food/{slug}',[96,192],90,SRC_FOOD,'food');MAN[f'img/food/{slug}']['upscaled']=round(k,2)
def steam(n,name):
  im=Image.open(f'../ref/steam_{n:02d}.jpg').convert('RGB');im=grade(im,.48)
  save(im,f'img/scene/{name}',[640,1280,1920],84,SRC_STEAM,'steam')
def worldmap():
  im=Image.open('/workspace/palsite/mapsrc/World_Map.webp').convert('RGB')
  X0,Y0,X1,Y1=-1923.225927,1032.79857101,1234.833276624702,-2125.2606328;S=8192
  pts=[((m['x']-X0)/(X1-X0)*S,(Y0-m['y'])/(Y0-Y1)*S,m) for m in D['map']]
  xs=[p[0] for p in pts];ys=[p[1] for p in pts];pad=260
  box=(int(max(0,min(xs)-pad)),int(max(0,min(ys)-pad)),int(min(S,max(xs)+pad)),int(min(S,max(ys)+pad)))
  cr=grade(im.crop(box),.45);save(cr,'img/map/world',[800,1600,2400],86,SRC_MAP,'map')
  json.dump(dict(box=box,pts=[dict(x=(px-box[0])/(box[2]-box[0]),y=(py-box[1])/(box[3]-box[1]),t=m['t'],name=m['name'],lvl=m.get('lvl'),url=m.get('url')) for px,py,m in pts]),open('img/map/pins.json','w'),ensure_ascii=False)
PALS=['Anubis','Jetragon','Frostallion','Grizzbolt','Cattiva','Lamball','Lyleen','Blazamut','Blazamut Ryu','Relaxaurus','Gumoss','Dupin','Foxparks','Pengullet','Depresso','Chillet','Kitsun','Direhowl','Lifmunk','Daedream','Cinnamoth','Relaxaurus Lux','Jormuntide Ignis','Pyrin','Penking','Tanzee','Dandilord','Ophydia']
for en in PALS:
  if en in P and os.path.exists(f'/workspace/palcards/art/{P[en]["id"]}.png'): pal(en)
  else: print('no art',en)
F=json.load(open('/workspace/palwiki/data/food.json'))
for x in F:
  if x['buffs'] and os.path.exists(f'../../docs/food/{x["slug"]}.webp'): food(x['slug'])
for n,name in [(14,'lyleen_ruins'),(2,'islands'),(10,'snow'),(9,'sakura'),(6,'desert_town'),(4,'forest'),(16,'night_base'),(12,'coast'),(11,'meadow'),(13,'grass')]: steam(n,name)
worldmap()
json.dump(MAN,open('img/manifest.json','w'),ensure_ascii=False,indent=0);print(len(MAN))
