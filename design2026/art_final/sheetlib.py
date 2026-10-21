import json,os,math
from PIL import Image,ImageDraw,ImageFont
B='/workspace/palsite/design2026/art_final';M=json.load(open(B+'/manifest.json'))
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',11) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf') else ImageFont.load_default()
REMBG={'BluePlatypus_Fire','Ganesha','WoolFox'}
def checker(w,h,c1=(205,205,205),c2=(235,235,235),s=10):
  im=Image.new('RGB',(w,h),c1);d=ImageDraw.Draw(im)
  for y in range(0,h,s):
    for x in range((y//s%2)*s,w,2*s): d.rectangle([x,y,x+s-1,y+s-1],fill=c2)
  return im.convert('RGBA')
def sheet(items,fn,cell=150,cols=16,bg='checker',title=''):
  rows=math.ceil(len(items)/cols);W,H=cols*cell,rows*(cell+16)+30
  cv=checker(W,H) if bg=='checker' else Image.new('RGBA',(W,H),bg)
  d=ImageDraw.Draw(cv);d.text((8,8),title,fill=(20,20,20) if bg=='checker' else (230,230,230),font=F)
  for i,(lab,path,flag) in enumerate(items):
    x,y=(i%cols)*cell,(i//cols)*(cell+16)+30
    im=Image.open(path).convert('RGBA');im.thumbnail((cell-8,cell-8),Image.LANCZOS)
    cv.alpha_composite(im,(x+(cell-im.width)//2,y+(cell-im.height)//2))
    d.rectangle([x,y,x+cell-1,y+cell-1],outline=(255,90,60) if flag else (150,150,150))
    d.text((x+3,y+cell+1),lab[:22],fill=(200,40,20) if flag else ((20,20,20) if bg=='checker' else (220,220,220)),font=F)
  cv.convert('RGB').save(B+'/sheets/'+fn,optimize=True);return fn
