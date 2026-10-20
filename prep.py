import json,os,re,shutil,glob,datetime,random
from PIL import Image
import pymdownx.slugs as S
SL=S.slugify(case='lower')
W='/workspace/palwiki';D='/workspace/palsite/docs';A=D+'/assets'
shutil.rmtree(D,ignore_errors=True);os.makedirs(D)
SKIP={'raw','raw_new','backups','data','gdocs','__pycache__','reports'}
for d in os.listdir(W):
  p=os.path.join(W,d)
  if os.path.isdir(p) and d not in SKIP: shutil.copytree(p,os.path.join(D,d),ignore=shutil.ignore_patterns('*.py','__pycache__'))
shutil.copytree('/workspace/palsite/static',A)
# ---------- images -> webp (cached)
C='/workspace/palsite/.imgcache';os.makedirs(C+'/card',exist_ok=True);os.makedirs(C+'/art',exist_ok=True)
def webp(src,dst,w):
  if not os.path.exists(dst) or os.path.getmtime(dst)<os.path.getmtime(src):
    im=Image.open(src).convert('RGBA');
    if im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    im.save(dst,'WEBP',quality=80,method=5)
cards={os.path.basename(f).split('_',1)[1][:-4]:f for f in glob.glob('/workspace/palcards/out/*.png')}
arts={os.path.basename(f)[:-4]:f for f in glob.glob('/workspace/palcards/art/*.png')}
os.makedirs(D+'/img',exist_ok=True);os.makedirs(D+'/art',exist_ok=True)
pals=json.load(open(W+'/data/pals.json'))
def slug(s):return re.sub(r'[^a-z0-9]+','_',s.lower()).strip('_')
EL={'Нейтральный':'neutral','Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon'}
WI={'Разжигание огня':'🔥','Полив':'💧','Посев семян':'🌱','Генерация энергии':'⚡','Ручная работа':'🖐️','Сбор':'🌾','Рубка деревьев':'🪓','Добыча':'⛏️','Фармацевтика':'💊','Охлаждение':'❄️','Транспортировка':'📦','Фермерство':'🐑'}
ACT={'party':'🎒 из команды','summoned':'🐾 выпущен','mounted':'🐎 верхом','active':'🔘 кнопкой','base':'🏠 на базе'}
def chip(e):return f'<span class="el el-{EL.get(e,"neutral")}">{e}</span>'
SP=[];n=0
for p in pals:
  md=None
  for c in (slug(p['en']),slug(p['en']).replace('_','')):
    if os.path.exists(f"{D}/4_spravochniki/paly/{c}.md"):md=c;break
  f=cards.get(p['id']);img=thumb=''
  if f:
    b=os.path.basename(f)[:-4];webp(f,f'{C}/card/{b}.webp',520);shutil.copy(f'{C}/card/{b}.webp',D+'/img/');img='img/'+b+'.webp'
  a=arts.get(p['id'])
  if a: webp(a,f'{C}/art/{p["id"]}.webp',256);shutil.copy(f'{C}/art/{p["id"]}.webp',D+'/art/');thumb='art/'+p['id']+'.webp'
  ps=p.get('partner_skill') or {};acts=ps.get('activations') or []
  desc=(p.get('partner') or {}).get('desc','')
  mount='fly' if re.search('по воздуху|летат|полёт|полет',desc) else ('ride' if 'оседлать' in desc else '')
  url=f'4_spravochniki/paly/{md}/' if md else ''
  if md:
    path=f"{D}/4_spravochniki/paly/{md}.md";L=open(path).read().split('\n',1)
    works=''.join(f'<span class="work" title="{w["work"]} {w["level"]}">{WI.get(w["work"],"•")} {w["work"]} <b>{w["level"]}</b></span>' for w in p['work'])
    head=f'''<div class="pal-hero" markdown="0">
<img class="pal-card" src="../../../{img}" alt="{p['ru']}" loading="lazy" width="360">
<div class="pal-info"><div class="pal-no">#{p['no']} · {p['en']}</div>
<div class="chips">{''.join(chip(e) for e in p['elements'])}</div>
<div class="weak">Слабость: {''.join(chip(e) for e in p['weak_to'])}</div>
<div class="works">{works}</div>
<div class="partner"><b>{ps.get('name',(p.get('partner') or {}).get('name',''))}</b> {' '.join(ACT.get(x,'') for x in acts)}</div>
<div class="stats">❤️ {p['stats']['hp']} · ⚔️ {p['stats']['attack']} · 🛡 {p['stats']['defense']}</div></div></div>
'''
    rest=L[1] if len(L)>1 else ''
    open(path,'w').write(L[0]+'\n\n'+head+'\n'+rest);n+=1
  SP.append({'no':p['no'],'id':p['id'],'ru':p['ru'],'en':p['en'],'el':p['elements'],'weak':p['weak_to'],'work':[[w['work'],w['level']] for w in p['work']],
    'act':acts,'mount':mount,'sprint':int(re.sub(r'\D','',str(p['stats'].get('mount_sprint') or 0)) or 0),'hp':p['stats']['hp'],'atk':p['stats']['attack'],'def':p['stats']['defense'],
    'rarity':int(p['rarity'] or 0),'url':url,'img':img,'thumb':thumb or img,'bp':p.get('best_passives',{}),'rank':int(p['breeding'].get('combi_rank') or 0),
    'up':p['breeding'].get('unique_parents'),'psk':ps.get('name',''),'egg':(p.get('habitat') or {}).get('egg','')})
print('pal headers',n)

# ---------- clean reader-facing text
UNV='<span class="unv" title="Ещё перепроверяется">ⓘ</span>'
def strip_src(t):
  out='';i=0;low=t.lower()
  while True:
    m=re.search(r'\s*[(（]\s*(источник|источники|source|по данным|ист\.)',low[i:])
    if not m: out+=t[i:];break
    st=i+m.start();out+=t[i:st];d=0;j=st
    while j<len(t):
      if t[j]=='(':d+=1
      elif t[j]==')':
        d-=1
        if d==0:break
      j+=1
    i=j+1
  return out
def clean(t,html=True):
  t=strip_src(t)
  t=re.sub(r'(?ms)^#{2,3} (Источники|Источник|Sources)\s*$.*?(?=^#{1,3} |\Z)','',t)
  t=re.sub(r'(?im)^\s*[_*]*(источник|источники|source)[_*]*\s*:.*$\n?','',t)
  t=re.sub(r'\s*\[(проверить|патч|проверь)[^\]]*\]',UNV if html else '',t)
  t=re.sub(r'(?m)^(#{1,4} .*?)\s*\(\d+\)\s*$',r'\1',t)
  t=re.sub(r'\s*—?\s*\[?проверить\]? — пока один источник\.?','',t)
  t=t.replace(UNV+' — пока один источник.','').replace(' Источник указан у каждой строки.','')
  t=re.sub(r'(?m) +$','',t)
  return t
def secrets(t):
  def card(m):
    body=m.group(1);sp='🙈 ' in body;body=body.replace('🙈 ','')
    if ' — ' in body: a,b=body.split(' — ',1)
    else: a,b=body,''
    return f'<div class="secret{" spoiler" if sp else ""}" markdown="1"><b>{a.strip()}</b>{"<span class=sp>спойлер</span>" if sp else ""}<br>{b.strip()}</div>'
  return re.sub(r'(?m)^- (.+)$',card,t)
for f in glob.glob(D+'/**/*.md',recursive=True):
  s0=open(f).read();s1=clean(s0)
  if f.endswith('sekrety.md'): s1=secrets(s1.replace('🙈 = спойлер (сюжет/эндгейм).','🙈 — спойлер.'))
  if s1!=s0:open(f,'w').write(s1)
def cj(o):
  if isinstance(o,str):return clean(o,False).strip()
  if isinstance(o,list):return [cj(x) for x in o]
  if isinstance(o,dict):return {k:cj(v) for k,v in o.items()}
  return o
# ---------- heading index for anchors
HI={}
for f in glob.glob(D+'/**/*.md',recursive=True):
  rel=os.path.relpath(f,D);u=rel[:-3]+'/'
  u=u.replace('README/','').replace('index/','')
  for l in open(f):
    m=re.match(r'#{2,3} (.+)',l)
    if m:
      t=m.group(1).strip();k=re.sub(r'\s*\(.*?\)','',t).lower().replace('ё','е').strip()
      HI.setdefault(k,u+'#'+SL(t,'-'))
def link(name):return HI.get(re.sub(r'\s*\(.*?\)','',name).lower().replace('ё','е').strip(),'')
items=json.load(open(W+'/data/items.json'));SI=[]
for i in items:
  src=[]
  for s in (i.get('sources') or [])[:4]: src.append(f"{s.get('source')} ({s.get('qty','')})")
  for s in (i.get('from_pals') or [])[:5]: src.append(f"с пала {s['pal']} {s.get('chance','')}")
  for s in (i.get('from_npc') or [])[:2]: src.append(f"с NPC {s['who']}")
  if i.get('merchant'): src.append('у торговцев')
  if i.get('recipe'): src.append('крафт: '+', '.join(f"{r['item']}×{r['qty']}" for r in i['recipe'][:4])+(f" ({i['station']})" if i.get('station') else ''))
  SI.append({'ru':i['ru'],'en':i['en'],'type':i.get('type',''),'src':src,'url':link(i['ru']),'desc':(i.get('desc') or '')[:160]})
bosses=json.load(open(W+'/data/bosses.json'));SB=[]
for b in bosses:
  team=[t['pal'] for t in ((b.get('recommended_team') or {}).get('main') or [])][:4] or b.get('team',[])[:4]
  SB.append({'name':b['name'],'kind':b['kind'],'pal':b.get('pal',''),'place':b.get('place',''),'level':b.get('level'),'hp':b.get('hp'),'el':b.get('elements',[]),'weak':b.get('weak_to',[]),'team':team,'tactics':b.get('tactics',''),'url':link(b['name'])})
pas=json.load(open(W+'/data/passives.json'))
SPS=[{'name':x['name'],'en':x.get('en',''),'rank':x.get('rank'),'desc':x.get('desc',''),'url':link(x['name'])} for x in pas]
faq=[]
for fn in ['faq_extra.json','faq.json']:
  for q in json.load(open(W+'/data/'+fn)): faq.append({'q':q['q'],'a':q['a']})
syn=json.load(open(W+'/data/synonyms.json'))
syn={k:v for k,v in syn.items() if isinstance(v,str)}
L=json.load(open(W+'/data/locations.json'));MP=[]
for a in L.get('alphas',[]):
  if a.get('xy'):MP.append({'t':'alpha','name':a['pal']+' (альфа)','x':a['xy'][0],'y':a['xy'][1],'info':'ур. '+str(a.get('level',''))+(' · '+a['title'] if a.get('title') else '')})
for a in L.get('fast_travel',[]):
  if a.get('xy'):MP.append({'t':'travel','name':a['name_en'],'x':a['xy'][0],'y':a['xy'][1],'info':a.get('region','')})
for a in L.get('towers',[]):
  if a.get('x') is not None:MP.append({'t':'tower','name':a['name'],'x':a['x'],'y':a['y'],'info':a.get('en','')})
for a in L.get('sealed_realms',[]):
  if a.get('xy'):MP.append({'t':'sealed','name':a['name_en'],'x':a['xy'][0],'y':a['xy'][1],'info':a.get('pal','')+' ур. '+str(a.get('level',''))})
SI=cj(SI);SB=cj(SB);SPS=cj(SPS);faq=cj(faq);MP=cj(MP)
json.dump({'map':MP,'pals':SP,'items':SI,'bosses':SB,'passives':SPS,'faq':faq,'syn':syn,'built':datetime.date.today().isoformat()},open(A+'/search_data.json','w'),ensure_ascii=False,separators=(',',':'))
shutil.move(A+'/manifest.webmanifest',D+'/manifest.webmanifest');open(D+'/sw.js','w').write(open(A+'/sw.js').read().replace('__BUILD__',datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d%H%M')));os.remove(A+'/sw.js')
print('map points',len(MP));print('search_data KB',os.path.getsize(A+'/search_data.json')//1024)
# ---------- fix links
bad=0
for f in glob.glob(D+'/**/*.md',recursive=True):
  s=open(f).read()
  def fx(m):
    global bad
    t=m.group(2);u=t.split('#')[0]
    if not u or re.match(r'\w+:',t) or re.search(r'\.(png|webp)$',u):return m.group(0)
    if os.path.exists(os.path.normpath(os.path.join(os.path.dirname(f),u))):return m.group(0)
    bad+=1;return m.group(1)
  open(f,'w').write(re.sub(r'(?<!!)\[([^\]]*)\]\(([^)\s]+)\)',fx,s))
print('broken links removed',bad)
# ---------- pages
hero=''.join(f'<img src="art/{p["id"]}.webp" alt="" loading="lazy">' for p in random.Random(7).sample([p for p in SP if p['thumb'].startswith('art')],14))
T=lambda u,i,t,d:f'<a class="tile" href="{u}"><span class="ti">{i}</span><b>{t}</b><small>{d}</small></a>'
open(D+'/index.md','w').write(f'''---
hide: [navigation, toc]
---
<div class="hero" markdown="0"><div class="hero-art">{hero}</div><div class="hero-in">
<h1>Энциклопедия Palworld</h1><p>Всё о Palworld v1.0.5 на русском: уровни 0–80, {len(SP)} палов, {len(SI)} предметов, боссы, пассивки, разведение и секреты.</p>
<div class="smart-box"><input id="home-q" type="search" placeholder="Спроси что угодно: «кто лучше копает», «чем бить Зои», «где взять серу»…" autocomplete="off"></div>
<div id="home-answer" class="smart-out"></div></div></div>
<div class="tiles" markdown="0">
{T('gallery/','🐾','Палы','галерея с фильтрами')}{T('4_spravochniki/bossy/','👑','Боссы','башни, рейды, альфы')}{T('guide/03_prohozhdenie_1_80/','🗺️','Прохождение','с 1 до 80 уровня')}{T('2_mehaniki/passivki/','✨','Пассивки','лучшие наборы')}{T('guide/sekrety/','🤫','Секреты','пасхалки и тайники')}{T('map/','📍','Карта','альфы, башни, телепорты')}{T('4_spravochniki/predmety/','🎒','Предметы','где взять и крафт')}{T('compare/','⚔️','Сравнить','два пала рядом')}{T('https://t.me/PalGuideBot','🤖','Бот @PalGuideBot','спроси в Telegram')}
</div>
<div class="potd-wrap" markdown="0"><h2>⭐ Пал дня</h2><div id="potd"></div></div>
''')
open(D+'/gallery.md','w').write('''---
hide: [toc]
---
# 🐾 Галерея палов
<div id="gal-filters" class="gal-filters" markdown="0"></div>
<div id="gallery" class="gallery" markdown="0"></div>
''')
open(D+'/compare.md','w').write('---\nhide: [toc]\n---\n# ⚔️ Сравнение двух палов\n<div id="cmp" markdown="0"></div>\n')
open(D+'/map.md','w').write('---\nhide: [toc]\nleaflet: true\n---\n# 📍 Интерактивная карта\nСетка в игровых координатах (X, Y как на карте в игре). Включай и выключай слои справа, ищи по названию.\n\n<div class="gal-filters" markdown="0"><input id="mapq" type="search" placeholder="Найти точку: Анубис, Rayne, ..."></div>\n<div id="pwmap" markdown="0"></div>\n\n!!! note "Нет на карте"\n    Статуэтки Лифмунка и входы в подземелья не отмечены: у них нет постоянных координат в открытых текстовых источниках [проверить]. Для них смотри paldb.cc/en/Map.\n')
open(D+'/bot.md','w').write('''---
hide: [toc]
---
# 🤖 Telegram-бот @PalGuideBot
<div class="bot-card" markdown="0"><img src="../assets/logo.png" alt="" width="96"><div>
<p>Бот отвечает на вопросы по Palworld прямо в Telegram — в личке и в группах (по упоминанию). Понимает опечатки и неправильную раскладку.</p>
<a class="md-button md-button--primary" href="https://t.me/PalGuideBot">Открыть @PalGuideBot</a></div></div>

Что умеет: карточки палов, лучшие пассивки по ролям, слабости боссов, где взять предметы, разведение, советы по уровню, секреты (`/sekret`), сравнение палов (`/sravni`).
''')
def title(f):
  for l in open(f):
    if l.startswith('# '):return l[2:].strip().replace(':',' -').replace('"','')
  return os.path.basename(f)[:-3]
used=set()
def sec(d):
  fs=sorted(f for f in glob.glob(f'{D}/{d}/*.md') if f not in used);used.update(fs)
  fs.sort(key=lambda f:(not f.endswith('README.md'),title(f)))
  return [{title(f):os.path.relpath(f,D)} for f in fs]
G=lambda *xs:[{n:sec(d)} for d,n in xs if glob.glob(f'{D}/{d}/*.md')]
nav=[{'Главная':'index.md'},{'Галерея':'gallery.md'},{'Карта':'map.md'},{'Сравнить':'compare.md'},
 {'Гайд':G(('0_nachni_zdes','Начни здесь'),('guide','Гайд по темам'),('1_prohozhdenie','Прохождение'))},
 {'Палы':sec('4_spravochniki/paly')},
 {'Справочники':G(('4_spravochniki/predmety','Предметы'),('4_spravochniki','Боссы и таблицы'),('ref','Сырые таблицы'))},
 {'Механики':G(('2_mehaniki','Механики'),('3_bazy','Базы'),('5_lut_i_farm','Лут и фарм'))},
 {'Мир':G(('6_mir','Мир и секреты'),('7_server','Сервер'))},
 {'FAQ':G(('9_faq','FAQ'),('8_slovar','Глоссарий'),('10_bagi','Баги'))},
 {'Бот':'bot.md'}]
keep=used|{D+'/index.md',D+'/gallery.md',D+'/bot.md',D+'/compare.md',D+'/map.md'}
for f in glob.glob(D+'/**/*.md',recursive=True):
  if f not in keep: os.remove(f)
import yaml
y=yaml.safe_dump({'nav':nav},allow_unicode=True,sort_keys=False)
open('/workspace/palsite/mkdocs.yml','w').write(open('/workspace/palsite/mkdocs.base.yml').read()+y)
