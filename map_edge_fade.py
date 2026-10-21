# 21.10 live hotfix: the Palpagos world texture is cut by its frame (land ends in a straight line at the left/top border),
# which reads as a black straight-edged hole on the map/mini-map. Fade the outer band of the world into the sea colour.
# Idempotent: originals kept in /workspace/palsite/mapsrc/tiles_orig, output written to static/tiles.
import os,shutil,glob
import numpy as np
from PIL import Image
S='/workspace/palsite/static/tiles';O='/workspace/palsite/mapsrc/tiles_orig'
if not os.path.exists(O):shutil.copytree(S,O)
SEA=np.array([12,22,30],float);A0,A1=0.004,0.03   # band (fraction of world): fully sea below A0, untouched above A1
n=0
for f in glob.glob(O+'/*/*/*.webp'):
  z,x,y=[int(v) for v in f[len(O)+1:-5].split('/')];N=2**z;T=256
  # tile covers world fraction [x/N,(x+1)/N]; skip tiles fully inside the untouched area
  if x/N>A1 and (x+1)/N<1-A1 and y/N>A1 and (y+1)/N<1-A1:continue
  im=Image.open(f).convert('RGB');w,h=im.size;a=np.asarray(im).astype(float)
  gx=(x+(np.arange(w)+.5)/w)/N;gy=(y+(np.arange(h)+.5)/h)/N
  dx=np.minimum(gx,1-gx)[None,:];dy=np.minimum(gy,1-gy)[:,None];d=np.minimum(dx,dy)
  t=np.clip((d-A0)/(A1-A0),0,1);t=t*t*(3-2*t)
  out=a*t[...,None]+SEA*(1-t[...,None])
  dst=f.replace(O,S);Image.fromarray(out.round().astype(np.uint8)).save(dst,'WEBP',quality=82);n+=1
print('map edge fade: tiles',n)
