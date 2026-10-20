from PIL import Image,ImageDraw,ImageFont
B='/usr/share/fonts/truetype/dejavu/';FB=ImageFont.truetype(B+'DejaVuSans-Bold.ttf',56);FM=ImageFont.truetype(B+'DejaVuSans-Bold.ttf',30);FL=ImageFont.truetype(B+'DejaVuSans.ttf',20)
W,H=3200,2900;C=Image.new('RGB',(W,H),'#f6f2e9');d=ImageDraw.Draw(C)
d.text((80,50),'Палпедия · v1 → v2',font=FB,fill='#13202a')
def rr(s,r=24):m=Image.new('L',s,0);ImageDraw.Draw(m).rounded_rectangle((0,0,*s),r,fill=255);return m
def put(p,x,y,w,lab):
  im=Image.open(p).convert('RGB');im=im.resize((w,int(im.height*w/im.width)));C.paste(im,(x,y),rr(im.size));d.text((x,y+im.height+8),lab,font=FL,fill='#4a5560')
for col,(src,title,x0) in enumerate([('shots_v1','ДО (v1)',80),('shots','ПОСЛЕ (v2)',1640)]):
  d.text((x0,150),title,font=FM,fill='#b3231b' if col else '#4a5560');put(f'{src}/home_d_light.png',x0,200,1480,'Главная · 1440')
  for i,n in enumerate(['home','pal','search','boss']): put(f'{src}/{n}_m_light.png',x0+i*372,1200,350,f'{n} · 390')
d.text((80,2000),'v2 в WebKit (iPhone 13) и Firefox · тёмная тема',font=FM,fill='#13202a')
for i,(f,l) in enumerate([('webkit_home_m','WebKit iPhone 13 · главная'),('webkit_pal_m','WebKit · пал'),('firefox_home_m','Firefox 390 · главная'),('firefox_boss_m','Firefox · босс'),('home_m_dark','Тёмная · главная'),('pal_m_dark','Тёмная · пал'),('search_m_dark','Тёмная · поиск'),('boss_m_dark','Тёмная · босс')]):
  im=Image.open(f'shots/{f}.png').convert('RGB');k=340/im.width;im=im.resize((340,int(im.height*k)));im=im.crop((0,0,340,min(im.height,780)));x=80+i*385;C.paste(im,(x,2060),rr(im.size));d.text((x,2850),l,font=FL,fill='#4a5560')
C.save('concept_v2.png')
