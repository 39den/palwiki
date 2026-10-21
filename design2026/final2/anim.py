# Subtle idle loop from a static render: breathing (anchored to feet), gentle sway, head-area tilt via strip mesh warp. 24 fps, seamless (integer cycles).
from PIL import Image
import math,os,sys,json,subprocess
FPS=24;N=48   # 2.0 s loop
def ease(t): return math.sin(2*math.pi*t)            # pure sine -> seamless, C-inf smooth
def frame(src,t,amp):
  W,H=src.size;ax,ay=W/2,H*.93                          # anchor: feet baseline
  b=ease(t);s=ease(t+.25);hd=ease(t+.12)
  # 1) head-area warp: horizontal shift weighted toward top 45% (smoothstep), plus tiny lift
  strips=[];n=40
  def dx(y):
    u=max(0,min(1,(H*.58-y)/(H*.58)));w=u*u*(3-2*u);return amp['head']*W*hd*w
  for i in range(n):
    y0=H*i/n;y1=H*(i+1)/n
    strips.append(((0,int(y0),W,int(math.ceil(y1))),(0-dx(y0),y0,0-dx(y1),y1,W-dx(y1),y1,W-dx(y0),y0)))
  im=src.transform(src.size,Image.MESH,strips,Image.BICUBIC)
  # 2) breathing + sway: inverse affine about anchor
  sy=1+amp['breath']*b;sx=1-amp['breath']*.45*b;a=math.radians(amp['sway']*s)
  c,sn=math.cos(a),math.sin(a)
  # forward: p' = A + R*S*(p-A); inverse: p = A + S^-1 R^-1 (p'-A)
  ia=c/sx;ib=sn/sx;ic_=-sn/sy;id_=c/sy
  coef=(ia,ib,ax-ia*ax-ib*ay, ic_,id_,ay-ic_*ax-id_*ay)
  return im.transform(src.size,Image.AFFINE,coef,Image.BICUBIC)
AMP={'default':dict(breath=.016,sway=.9,head=.006),'flyer':dict(breath=.012,sway=1.6,head=.004),'big':dict(breath=.012,sway=.5,head=.004),'small':dict(breath=.022,sway=1.2,head=.008)}
def make(pid,kind,size=300):
  src=Image.open(f'img/pal/{pid}-640.webp').convert('RGBA').resize((size,size),Image.LANCZOS)
  fr=[frame(src,i/N,AMP[kind]) for i in range(N)]
  os.makedirs('anim/frames/'+pid,exist_ok=True)
  for i,f in enumerate(fr): f.save(f'anim/frames/{pid}/{i:03d}.png')
  fr[0].save(f'anim/{pid}-still.webp','WEBP',quality=90,method=6)
  for q in (78,70,62,55,48):
    fn=f'anim/{pid}.webp';fr[0].save(fn,'WEBP',save_all=True,append_images=fr[1:],duration=round(1000/FPS),loop=0,quality=q,method=4,alpha_quality=50,minimize_size=True,kmax=12)
    kb=os.path.getsize(fn)/1024
    if kb<=480: break
  return dict(id=pid,kind=kind,q=q,kb=round(kb),frames=N,fps=FPS,size=size)
if __name__=='__main__':
 L=[('Anubis','default'),('JetDragon','flyer'),('LilyQueen','default'),('SheepBall','small'),('PinkCat','small'),('ElecPanda','big'),('IceHorse','big'),('Kitsunebi','small')]
 R=[make(p,k) for p,k in L];json.dump(R,open('anim/anim.json','w'),indent=1);print(json.dumps(R))
