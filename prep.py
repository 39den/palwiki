import json,os,re,shutil,glob
W='/workspace/palwiki';D='/workspace/palsite/docs'
shutil.rmtree(D,ignore_errors=True);os.makedirs(D)
SKIP={'raw','raw_new','backups','data','gdocs','__pycache__','reports'}
SEC=[('guide','Прохождение (гайд)'),('0_nachni_zdes','Начни здесь'),('1_prohozhdenie','Прохождение'),('4_spravochniki/paly','Палы'),('4_spravochniki/predmety','Предметы'),('4_spravochniki','Справочники и боссы'),('2_mehaniki','Механики'),('3_bazy','Базы'),('5_lut_i_farm','Лут и фарм'),('6_mir','Мир и секреты'),('7_server','Сервер'),('9_faq','FAQ'),('8_slovar','Глоссарий'),('10_bagi','Баги'),('ref','Сырые таблицы')]
for d in os.listdir(W):
  p=os.path.join(W,d)
  if os.path.isdir(p) and d not in SKIP: shutil.copytree(p,os.path.join(D,d),ignore=shutil.ignore_patterns('*.py','__pycache__'))
# pal cards
pals=json.load(open(W+'/data/pals.json'));os.makedirs(D+'/img',exist_ok=True)
cards={os.path.basename(f).split('_',1)[1][:-4]:f for f in glob.glob('/workspace/palcards/out/*.png')}
def slug(s):return re.sub(r'[^a-z0-9]+','_',s.lower()).strip('_')
n=0
for p in pals:
  f=cards.get(p['id'])
  md=None
  for c in (slug(p['en']),slug(p['en']).replace('_','')):
    t=f"{D}/4_spravochniki/paly/{c}.md"
    if os.path.exists(t):md=t;break
  if f and md:
    shutil.copy(f,D+'/img/'+os.path.basename(f));L=open(md).read().split('\n',1)
    open(md,'w').write(L[0]+f"\n\n![{p['ru']}](../../img/{os.path.basename(f)}){{ width=360 }}\n"+(L[1] if len(L)>1 else ''));n+=1
print('cards embedded',n)
# fix links
bad=0
for f in glob.glob(D+'/**/*.md',recursive=True):
  s=open(f).read()
  def fx(m):
    global bad
    t=m.group(2);u=t.split('#')[0]
    if not u or re.match(r'\w+:',t) or u.endswith('.png'):return m.group(0)
    if os.path.exists(os.path.normpath(os.path.join(os.path.dirname(f),u))):return m.group(0)
    bad+=1;return m.group(1)
  s=re.sub(r'\[([^\]]*)\]\(([^)\s]+)\)',fx,s)
  s=re.sub(r'\{([A-Z][A-Za-z_]+)\}',r'\1',s) if False else s
  open(f,'w').write(s)
print('broken links removed',bad)
def title(f):
  for l in open(f):
    if l.startswith('# '):return l[2:].strip().replace(':',' -').replace('"','')
  return os.path.basename(f)[:-3]
nav=[]
used=set()
for d,name in SEC:
  fs=sorted(f for f in glob.glob(f'{D}/{d}/*.md'))
  fs=[f for f in fs if f not in used];used|=set(fs)
  if fs:
    fs.sort(key=lambda f:(not f.endswith('README.md'),title(f)))
    nav.append({name:[{title(f):os.path.relpath(f,D)} for f in fs]})
for f in glob.glob(D+'/**/*.md',recursive=True):
  if f not in used: os.remove(f)
open(D+'/index.md','w').write("""# Энциклопедия Palworld 🐾

Полный справочник по Palworld v1.0.5 на русском: уровни 0–80, все палы с карточками, предметы, боссы, механики, разведение, секреты и FAQ.

- 🧭 [С чего начать](0_nachni_zdes/nachni_zdes.md)
- 🐾 [Все палы](4_spravochniki/paly/README.md)
- 🎒 [Предметы](4_spravochniki/predmety/README.md)
- 👑 [Боссы](4_spravochniki/bossy.md)
- 🗺 [Прохождение 1–80](guide/03_prohozhdenie_1_80.md)
- 🤫 [Секреты](guide/sekrety.md)

Используй 🔍 поиск сверху — он понимает русский.

🤖 Есть вопрос? Спроси Telegram-бота **[@PalGuideBot](https://t.me/PalGuideBot)**.
""")
import yaml
cfg={'site_name':'Энциклопедия Palworld','site_url':'https://39den.github.io/palwiki/','docs_dir':'docs','theme':{'name':'material','language':'ru','features':['navigation.tabs','navigation.sections','navigation.top','search.suggest','search.highlight','navigation.instant'],
'palette':[{'scheme':'default','primary':'teal','toggle':{'icon':'material/weather-night','name':'Тёмная тема'}},{'scheme':'slate','primary':'teal','toggle':{'icon':'material/weather-sunny','name':'Светлая тема'}}]},
'plugins':[{'search':{'lang':['ru','en']}}],'markdown_extensions':['tables','attr_list','admonition','toc'],'nav':[{'Главная':'index.md'}]+nav}
for f in glob.glob(D+'/**/*.md',recursive=True):
  for l in []:pass
yaml.safe_dump(cfg,open('/workspace/palsite/mkdocs.yml','w'),allow_unicode=True,sort_keys=False)
