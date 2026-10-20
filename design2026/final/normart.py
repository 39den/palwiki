# auto-crop to alpha bbox, fit into 900x900, consistent baseline (bottom 6%) and max-height 86% / max-width 92%
from PIL import Image
import json,os,sys
D=json.load(open('../../docs/assets/search_data.json'))
names=sys.argv[1:]
R={p['en']:p for p in D['pals']}
S=600
for en in names:
  p=R[en];src='../../docs/'+p['art']
  im=Image.open(src).convert('RGBA');a=im.split()[3].point(lambda v:255 if v>24 else 0);bb=a.getbbox();im=im.crop(bb)
  w,h=im.size;k=min(S*.86/h,S*.92/w);im=im.resize((max(1,int(w*k)),max(1,int(h*k))),Image.LANCZOS)
  C=Image.new('RGBA',(S,S),(0,0,0,0));C.paste(im,((S-im.width)//2,int(S*.94)-im.height),im)
  C.save(f'art/{p["id"]}.webp',quality=88);print(en,bb,im.size)
