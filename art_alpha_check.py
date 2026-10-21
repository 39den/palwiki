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
# 21.10 (Денис): pal pages show the trading card again (art inside = art_final render). Every pal page must have it.
import re as _re
_pp=[f for f in glob.glob(D+'/4_spravochniki/paly/*.md') if 'class="pal-hero' in open(f).read()]
_bad=[f for f in _pp if 'class="pal-card tcard26"' not in open(f).read()]
print('pal pages w/o trading card:',len(_bad),'of',len(_pp),_bad[:5])
if _bad:sys.exit(1)
