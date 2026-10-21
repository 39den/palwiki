# Post-process AI-upscaled art: alpha clean, sharpen, grade, re-crop, checks, WebP+srcset, manifest.
import os,json,glob,math
import numpy as np
from PIL import Image,ImageFilter,ImageEnhance,ImageStat
from scipy import ndimage as nd
B='/workspace/palsite/design2026/art_final'
P={x['id']:x for x in json.load(open('/workspace/palsite/docs/assets/search_data.json'))['pals']}
ICONSRC=json.load(open(B+'/src/icons_src.json'))
REMBG={'BluePlatypus_Fire','Ganesha','WoolFox'}
C=768;FLOOR=.93;BOXH=.84;BOXW=.86
def grade(rgb,alpha,target=.52):
  m=ImageStat.Stat(rgb.convert('L'),mask=alpha).mean[0]/255
  k=max(.88,min(1.14,target/max(m,.05)))
  rgb=ImageEnhance.Brightness(rgb).enhance(k);rgb=ImageEnhance.Contrast(rgb).enhance(1.05);rgb=ImageEnhance.Color(rgb).enhance(1.06)
  r,g,b=rgb.split();r=r.point(lambda v:min(255,int(v*1.012)));b=b.point(lambda v:int(v*.988))
  return Image.merge('RGB',(r,g,b)),round(k,3)
def clean_alpha(im,erode=False):
  a=np.asarray(im.getchannel('A')).astype(np.float32)
  a=np.clip((a-14)*255/(240-14),0,255)                       # crush haze, solidify core
  lab,n=nd.label(a>40)
  if n>1:
    sz=nd.sum(np.ones_like(a),lab,range(1,n+1));keep=np.zeros(n+1,bool);keep[1:]=sz>=max(24,sz.max()*.004)
    mask=keep[lab]; mask=nd.binary_dilation(mask,iterations=3); a=a*mask   # drop specks, keep soft edges of kept parts
  if erode: a=nd.grey_erosion(a,size=(3,3))
  A=Image.fromarray(a.astype(np.uint8))
  if erode: A=A.filter(ImageFilter.GaussianBlur(.7))
  # edge decontamination: replace RGB of semi-transparent px with nearest opaque colour (kills dark/white fringes)
  rgb=np.asarray(im.convert('RGB')).astype(np.uint8).copy();an=np.asarray(A)
  solid=an>=235
  if solid.any():
    idx=nd.distance_transform_edt(~solid,return_distances=False,return_indices=True)
    edge=(an>0)&(an<235);near=rgb[idx[0],idx[1]]
    rgb[edge]=near[edge]
  return Image.fromarray(rgb),A
def sides_touch(a,thr=128,frac=.004):
  a=np.asarray(a);h,w=a.shape;r={}
  for s,v in (('top',a[0]),('bottom',a[-1]),('left',a[:,0]),('right',a[:,-1])):
    c=int((v>thr).sum())
    if c>=3 and c>=frac*len(v): r[s]=c
  return r
def save_set(im,base,widths,q=88):
  out=[]
  for w in widths:
    x=im if w==im.width else im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    if w<im.width*.8: x=x.filter(ImageFilter.UnsharpMask(1,35,2))
    fn=f'{base}-{w}.webp';x.save(B+'/'+fn,'WEBP',quality=q,method=6,alpha_quality=95);out.append(dict(w=w,src=fn,kb=round(os.path.getsize(B+'/'+fn)/1024,1)))
  return out
def pal(pid,up,orig,kind,erode):
  im=Image.open(up).convert('RGBA');o=Image.open(orig).convert('RGBA')
  src_touch=sides_touch(o.getchannel('A'))
  rgb,A=clean_alpha(im,erode)
  rgb=rgb.filter(ImageFilter.UnsharpMask(1.4,55,2))
  rgb,k=grade(rgb,A);rgb.putalpha(A);im=rgb
  bb=A.point(lambda v:255 if v>24 else 0).getbbox();im=im.crop(bb);w,h=im.size
  a=np.asarray(im.getchannel('A'))>24
  if kind=='render':
    s=min(BOXH*C/h,BOXW*C/w);nw,nh=round(w*s),round(h*s);x0=round((C-nw)/2);y0=round(FLOOR*C-nh)
  else:   # icon portrait: source is cropped at bottom/sides -> bottom-aligned bust, edges on purpose
    s=min(C/w*.94,C/h*.97);nw,nh=round(w*s),round(h*s);x0=round((C-nw)/2);y0=C-nh
    if 'bottom' not in src_touch: y0=round(FLOOR*C-nh)
  cv=Image.new('RGBA',(C,C),(0,0,0,0));cv.alpha_composite(im.resize((nw,nh),Image.LANCZOS),(x0,y0))
  # head focal: alpha centroid of the top 30% of the figure
  top=a[:max(1,int(h*.3))];ys,xs=np.nonzero(top)
  fx=(x0+(xs.mean() if len(xs) else w/2)*s)/C;fy=(y0+(ys.mean() if len(ys) else h*.15)*s)/C
  out_touch=sides_touch(cv.getchannel('A'),24,0)
  ok=not out_touch if kind=='render' else set(out_touch)<=set(src_touch)|{'bottom'}
  net=s*im.width/ (o.width*(o.width and im.width/ (bb[2]-bb[0]) or 1))  # not used
  files=save_set(cv,f'pal/{pid}',[256,384,512,768])
  cv.save(f'{B}/work/final_png/{pid}.png')
  eff=round(nw/((bb[2]-bb[0])*o.width/Image.open(up).width),2)   # total scale vs original source pixels
  return dict(id=pid,en=P[pid]['en'],ru=P[pid]['ru'],kind=kind,files=files,focal=dict(x=round(fx,3),y=round(fy,3)),
    floor=FLOOR if (kind=='render' or 'bottom' not in src_touch) else 1.0,source_px=list(o.size),source_scale=eff,
    upscaler='Real-ESRGAN realesr-animevideov3',bg_removed='rembg u2net' if pid in REMBG else None,exposure=k,
    clipped_in_source=sorted(src_touch),edge_touch_out=sorted(out_touch),check='ok' if ok else 'REVIEW',
    credit='© Pocketpair · palworld.wiki.gg',source_url=ICONSRC.get(pid,{}).get('url') or f'palworld.wiki.gg File:{P[pid]["en"]}.png')
def food(slug,up,orig):
  im=Image.open(up).convert('RGBA');rgb,A=clean_alpha(im);rgb=rgb.filter(ImageFilter.UnsharpMask(1.2,45,2));rgb,k=grade(rgb,A,.55);rgb.putalpha(A)
  bb=A.point(lambda v:255 if v>24 else 0).getbbox();im=rgb.crop(bb);w,h=im.size;s=min(.88*256/w,.88*256/h)
  cv=Image.new('RGBA',(256,256),(0,0,0,0));nw,nh=round(w*s),round(h*s);cv.alpha_composite(im.resize((nw,nh),Image.LANCZOS),((256-nw)//2,(256-nh)//2))
  cv.save(f'{B}/work/final_png/food_{slug}.png')
  return dict(id=slug,kind='dish',files=save_set(cv,f'food/{slug}',[96,128,192,256]),source_px=list(Image.open(orig).size),
    upscaler='Real-ESRGAN realesr-animevideov3 x3',edge_touch_out=sorted(sides_touch(cv.getchannel('A'),24,0)),credit='© Pocketpair · palworld.wiki.gg')
if __name__=='__main__':
  for d in ('pal','food','work/final_png'): os.makedirs(B+'/'+d,exist_ok=True)
  M=dict(generated='2026-10-21',canvas=dict(pal=C,dish=256),floor=FLOOR,box=dict(h=BOXH,w=BOXW),webp_q=88,grade='exposure→.52 mean L (clamp .88–1.14), contrast 1.05, sat 1.06, warm R+1.2%/B−1.2%',
         notes='kind=render: full-body art, feet on floor line 93%, transparent. kind=icon-portrait: wiki.gg only has 128px bust icons; bottom-aligned bust.',pals=[],dishes=[])
  for pid in P:
    if os.path.exists(f'{B}/work/up_pal/{pid}.png'):
      orig=f'{B}/src/rembg/{pid}.png' if pid in REMBG else f'/workspace/palcards/art/{pid}.png'
      M['pals'].append(pal(pid,f'{B}/work/up_pal/{pid}.png',orig,'render',pid in REMBG))
    elif os.path.exists(f'{B}/work/up_icon/{pid}.png'):
      M['pals'].append(pal(pid,f'{B}/work/up_icon/{pid}.png',f'{B}/src/icons/{pid}.png','icon-portrait',False))
    else: print('MISSING',pid)
  for f in sorted(glob.glob(B+'/work/up_food/*.png')):
    s=os.path.basename(f)[:-4];M['dishes'].append(food(s,f,f'{B}/work/in_food/{s}.png'))
  json.dump(M,open(B+'/manifest.json','w'),ensure_ascii=False,indent=1)
  r=[p for p in M['pals'] if p['check']!='ok'];print('pals',len(M['pals']),'dishes',len(M['dishes']),'review',[(p['id'],p['edge_touch_out'],p['clipped_in_source']) for p in r])
  print('src-clipped renders',[(p['id'],p['clipped_in_source']) for p in M['pals'] if p['kind']=='render' and p['clipped_in_source']])
