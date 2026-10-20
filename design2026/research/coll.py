from PIL import Image,ImageDraw,ImageFont
import os
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') else ImageFont.load_default()
def coll(names,suf,out,cols,tw):
  ims=[(n,Image.open(f'modern/{n}_{suf}.png').convert('RGB')) for n in names if os.path.exists(f'modern/{n}_{suf}.png')]
  th=int(tw*(ims[0][1].height/ims[0][1].width)) if suf!='m' else int(tw*844/390)
  rows=(len(ims)+cols-1)//cols;C=Image.new('RGB',(cols*(tw+16)+16,rows*(th+50)+16),'#111');d=ImageDraw.Draw(C)
  for i,(n,im) in enumerate(ims):
    x=16+(i%cols)*(tw+16);y=16+(i//cols)*(th+50)
    im=im.resize((tw,int(im.height*tw/im.width))).crop((0,0,tw,th));C.paste(im,(x,y+34));d.text((x,y+4),n,fill='#fff',font=F)
  C.save(out);print(out,C.size)
G=['genshin','zzz','hsr','mihoyo_hi3','valorant','league','endfield','wuwa','arcraiders','bungie','hades2','supercell','pokemon','pokemonlegends','nintendo','palworld']
P=['linear','vercel','raycast','apple','stripe','perplexity','spotify','duolingo','mobbin','framer','lusion','nothing']
coll(G,'d','ref_games_desktop.png',4,640)
coll(P,'d','ref_products_desktop.png',4,640)
coll(G+P,'m','ref_mobile.png',7,300)
coll(G[:8]+P[:4],'d2','ref_scroll.png',4,640)
