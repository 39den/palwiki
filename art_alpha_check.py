# fails if any pal/boss art or icon has an opaque/solid background
import glob,sys,json
from PIL import Image
D='/workspace/palsite/docs';bad=[]
import os
fix={os.path.basename(f) for f in glob.glob('/workspace/palsite/art_fix/*.png')}
src=[f for f in glob.glob('/workspace/palcards/art/*.png') if os.path.basename(f) not in fix]+glob.glob('/workspace/palsite/art_fix/*.png')
files=src+glob.glob(D+'/art/*.webp')+glob.glob(D+'/icon/*.webp')+glob.glob(D+'/pp/img/pal/*.webp')+glob.glob(D+'/boss/img/*.webp')+glob.glob(D+'/pp/art/*.webp')+glob.glob(D+'/food/*-96.webp')
for f in files:
  im=Image.open(f)
  if im.mode!='RGBA':im=im.convert('RGBA')
  w,h=im.size;a=im.getchannel('A')
  corners=[a.getpixel((x,y)) for x,y in [(1,1),(w-2,1),(1,h-2),(w-2,h-2)]]
  hist=a.histogram();opaque=sum(hist[250:])/(w*h)
  if max(corners)>40 or opaque>0.92:bad.append((f.replace(D+'/',''),corners,round(opaque,2)))
json.dump(bad,open('/workspace/palsite/art_alpha.json','w'),indent=0)
print('art-alpha: checked',len(files),'bad',len(bad),[b[0] for b in bad[:20]])
if bad:sys.exit(1)
# P01: pal pages must show transparent art_final in the hero, never the baked PNG card (its dark box can't be seen by corner checks)
import re as _re
_bad=[f for f in glob.glob(D+'/4_spravochniki/paly/*.md') if _re.search(r'class="pal-card(?![^"]*pal-art)[^"]*" src="[^"]*img/',open(f).read())]
print('card-in-hero:',len(_bad),_bad[:5])
if _bad:sys.exit(1)
