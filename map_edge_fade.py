# 21.10 live hotfix + mapfix: the Palpagos world texture is cut by straight lines (left x=0.0099, right x=0.9701,
# bottom y=0.9848 of the world square; top = square edge). Those cuts read as straight black holes / vertical lines.
# Fade a band inside each cut into the sea colour; everything outside the cut becomes plain sea.
# Idempotent: originals kept in mapsrc/tiles_orig (and mapsrc/mini_palpagos_orig.webp), output to static/tiles + wtree/.
import os,shutil,glob
import numpy as np
from PIL import Image
P='/workspace/palsite';S=P+'/static/tiles';O=P+'/mapsrc/tiles_orig'
if not os.path.exists(O):shutil.copytree(S,O)
SEA=np.array([12,22,30],float)
CUT=dict(l=0.0099,r=0.9701,t=0.0,b=0.9848);M0,BAND=0.003,0.028   # sea up to M0 inside the cut, smooth to art over BAND
def fade(a,gx,gy):
  d=np.minimum(np.minimum(gx-CUT['l'],CUT['r']-gx)[None,:],np.minimum(gy-CUT['t'],CUT['b']-gy)[:,None])
  t=np.clip((d-M0)/BAND,0,1);t=t*t*(3-2*t)
  return a*t[...,None]+SEA*(1-t[...,None])
lim=M0+BAND;n=0
for f in glob.glob(O+'/*/*/*.webp'):
  z,x,y=[int(v) for v in f[len(O)+1:-5].split('/')];N=2**z
  dst=f.replace(O,S)
  if x/N>CUT['l']+lim and (x+1)/N<CUT['r']-lim and y/N>CUT['t']+lim and (y+1)/N<CUT['b']-lim:
    continue
  im=Image.open(f).convert('RGB');w,h=im.size;a=np.asarray(im).astype(float)
  out=fade(a,(x+(np.arange(w)+.5)/w)/N,(y+(np.arange(h)+.5)/h)/N)
  Image.fromarray(out.round().astype(np.uint8)).save(dst,'WEBP',quality=90);n+=1
# habitat mini-map picture uses the same world frame
mo=P+'/mapsrc/mini_palpagos_orig.webp';mp=P+'/wtree/mini_palpagos.webp'
if not os.path.exists(mo):shutil.copy(mp,mo)
a=np.asarray(Image.open(mo).convert('RGB')).astype(float);h,w,_=a.shape
Image.fromarray(fade(a,(np.arange(w)+.5)/w,(np.arange(h)+.5)/h).round().astype(np.uint8)).save(mp,'WEBP',quality=90)
print('map edge fade: tiles',n,'+ mini_palpagos')
