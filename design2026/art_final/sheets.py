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
os.makedirs(B+'/sheets',exist_ok=True)
R=[p for p in M['pals'] if p['kind']=='render'];I=[p for p in M['pals'] if p['kind']!='render']
def before(p):
  pid=p['id']
  return f'/workspace/palcards/art/{pid}.png' if p['kind']=='render' else f'{B}/src/icons/{pid}.png'
out=[]
for grp,name in ((R,'renders'),(I,'icons')):
  out.append(sheet([(p['id'],before(p),False) for p in grp],f'{name}_before.png',title=f'BEFORE · {name} · {len(grp)} · source as-is (checker = transparency)'))
  out.append(sheet([(p['id'],f"{B}/work/final_png/{p['id']}.png",p['check']!='ok' or bool(p['clipped_in_source'] and p['kind']=='render')) for p in grp],f'{name}_after.png',title=f'AFTER · {name} · {len(grp)} · 768 canvas, floor 93% (red = review)'))
  out.append(sheet([(p['id'],f"{B}/work/final_png/{p['id']}.png",False) for p in grp],f'{name}_after_dark.png',bg=(24,26,32,255),title=f'AFTER on dark · {name} (fringe/box check)'))
D=M['dishes']
out.append(sheet([(p['id'],f"{B}/work/in_food/{p['id']}.png",False) for p in D],'dishes_before.png',cell=120,cols=16,title='BEFORE dishes 96px'))
out.append(sheet([(p['id'],f"{B}/work/final_png/food_{p['id']}.png",bool(p['edge_touch_out'])) for p in D],'dishes_after.png',cell=120,cols=16,title='AFTER dishes 256px'))
# zoom pairs: original vs new at 2x display for a few
Z=['BluePlatypus_Fire','Ganesha','WoolFox','PinkCat','SheepBall','Anubis','LeafMomonga','FlowerPrince']
cv=Image.new('RGBA',(len(Z)*300,620),(245,240,232,255));d=ImageDraw.Draw(cv)
for i,pid in enumerate(Z):
  p=next(x for x in M['pals'] if x['id']==pid)
  a=Image.open(before(p)).convert('RGBA');a=a.resize((290,round(a.height*290/a.width)) if a.width>=a.height else (round(a.width*290/a.height),290),Image.NEAREST)
  b=Image.open(f"{B}/work/final_png/{pid}.png").resize((290,290),Image.LANCZOS)
  cv.alpha_composite(a,(i*300+5,5));cv.alpha_composite(b,(i*300+5,315));d.text((i*300+8,300),pid+' before↑ after↓',fill=(40,40,40),font=F)
cv.convert('RGB').save(B+'/sheets/zoom_before_after.png');out.append('zoom_before_after.png')
print(out)
