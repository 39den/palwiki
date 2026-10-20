import json,os,re,shutil,glob,datetime,random
from PIL import Image
import pymdownx.slugs as S
SL=S.slugify(case='lower')
W='/workspace/palwiki';D='/workspace/palsite/docs';A=D+'/assets'
shutil.rmtree(D,ignore_errors=True);os.makedirs(D)
SKIP={'raw','raw_new','backups','data','gdocs','__pycache__','reports','ref'}
for d in os.listdir(W):
  p=os.path.join(W,d)
  if os.path.isdir(p) and d not in SKIP: shutil.copytree(p,os.path.join(D,d),ignore=shutil.ignore_patterns('*.py','__pycache__'))
shutil.copytree('/workspace/palsite/static',A)
shutil.rmtree(D+'/4_spravochniki/syrye_dannye',ignore_errors=True)
# ---------- images -> webp (cached)
C='/workspace/palsite/.imgcache';os.makedirs(C+'/card',exist_ok=True);os.makedirs(C+'/art',exist_ok=True)
def webp(src,dst,w):
  if not os.path.exists(dst) or os.path.getmtime(dst)<os.path.getmtime(src):
    im=Image.open(src).convert('RGBA');
    if im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    im.save(dst,'WEBP',quality=80,method=5)
cards={os.path.basename(f).split('_',1)[1][:-4]:f for f in glob.glob('/workspace/palcards/out/*.png')}
cards.update({os.path.basename(f).split('_',1)[1][:-4]:f for f in glob.glob('/workspace/palsite/.cards/*.png')})
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
  ic='/workspace/palcards/art/icons/'+p['id']+'.png';icon=''
  if os.path.exists(ic):
    dst=f'{C}/icon_{p["id"]}.webp'
    if not os.path.exists(dst) or os.path.getmtime(dst)<os.path.getmtime(ic):
      im=Image.open(ic).convert('RGBA');bb=im.getbbox();im=im.crop(bb) if bb else im;im.thumbnail((168,168),Image.LANCZOS)
      cv=Image.new('RGBA',(192,192),(0,0,0,0));cv.paste(im,((192-im.width)//2,(192-im.height)//2),im);cv.save(dst,'WEBP',quality=82,method=5)
    os.makedirs(D+'/icon',exist_ok=True);shutil.copy(dst,D+'/icon/'+p['id']+'.webp');icon='icon/'+p['id']+'.webp'
  else: print('NO ICON',p['id'],p['en'])
  ps=p.get('partner_skill') or {};acts=ps.get('activations') or []
  desc=(p.get('partner') or {}).get('desc','')
  mount='fly' if re.search('по воздуху|летат|полёт|полет',desc) else ('ride' if 'оседлать' in desc else '')
  url=f'4_spravochniki/paly/{md}/' if md else ''
  if md:
    path=f"{D}/4_spravochniki/paly/{md}.md";L=open(path).read().split('\n',1)
    works=''.join(f'<span class="work" title="{w["work"]} {w["level"]}">{WI.get(w["work"],"•")} {w["work"]} <b>{w["level"]}</b></span>' for w in p['work'])
    head=f'''<div class="pal-hero" markdown="0" data-el="{EL.get((p['elements'] or ['Нейтральный'])[0],'neutral')}" style="--pc:var(--{EL.get((p['elements'] or ['Нейтральный'])[0],'neutral')})"><canvas id="fx"></canvas>
<img class="pal-card" src="../../../{img}" alt="{p['ru']}" loading="lazy" width="360">
<div class="pal-info"><div class="pal-no">№ {p["no"]} · {p["en"]}</div>
<div class="chips">{''.join(chip(e) for e in p['elements'])}</div>
<div class="weak">Слабость: {''.join(chip(e) for e in p['weak_to'])}</div>
<div class="works">{works}</div>
<div class="partner"><b>{ps.get('name',(p.get('partner') or {}).get('name',''))}</b> {' '.join(ACT.get(x,'') for x in acts)}</div>
<div class="stats">❤️ {p['stats']['hp']} · ⚔️ {p['stats']['attack']} · 🛡 {p['stats']['defense']}</div></div></div>
'''
    rest=L[1] if len(L)>1 else ''
    dsc=(p.get('partner') or {}).get('desc','');lv=re.findall(r'(?:^|\s)([1-5]) ([^()]+?) \((?:ToTrainer|ToSelf|ToOtomo)\)',dsc.split('Lv. Skill',1)[1]) if 'Lv. Skill' in dsc else []
    seen={};[seen.setdefault(a,b.strip()) for a,b in lv]
    if seen: rest=re.sub(r'(?m)^(## Партнёрский навык.*\n(?:.*\n)?)',lambda m:m.group(1)+'\n**По уровням навыка:** '+' · '.join(f'{k}★ {v}' for k,v in seen.items())+'\n',rest,1)
    open(path,'w').write('# '+p['ru']+'\n\n'+head+'\n'+rest);n+=1
  SP.append({'i':len(SP),'no':p['no'],'id':p['id'],'ru':p['ru'],'en':p['en'],'el':p['elements'],'weak':p['weak_to'],'work':[[w['work'],w['level']] for w in p['work']],
    'act':acts,'mount':mount,'sprint':int(re.sub(r'\D','',str(p['stats'].get('mount_sprint') or 0)) or 0),'hp':p['stats']['hp'],'atk':p['stats']['attack'],'def':p['stats']['defense'],
    'rarity':int(p['rarity'] or 0),'url':url,'img':img,'thumb':icon,'art':thumb,'bp':p.get('best_passives',{}),'rank':int(p['breeding'].get('combi_rank') or 0),
    'up':p['breeding'].get('unique_parents'),'collab':bool(p.get('collab')),'psk':ps.get('name',''),'egg':(p.get('habitat') or {}).get('egg','')})
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
  t=re.sub(r'\s*Lv\. Skill.*$','',t,flags=re.M)
  t=re.sub(r'\s*\((ToSelf|ToOtomo|ToTrainer|ToEnemy)\)','',t)
  t=re.sub(r'\bElement[A-Z]\w*(\s+[\d.]+)?','',t)
  t=re.sub(r'\{([A-Z][A-Za-z_]+)\}',r'\1',t)
  t=re.sub(r'\s*\([^()\n]*(paldb|wiki\.gg|v1\.0\.5|сверка|\.json)[^()\n]*\)','',t,flags=re.I)
  t=re.sub(r'[^.\n|]*(paldb|wiki\.gg|v1\.0\.5)[^.\n|]*\.?','',t,flags=re.I)
  t=re.sub(r'(?m)^\s*[-*]\s*$\n?','',t)
  t=re.sub(r'\s*\([^()\n]*ToSelf[^()\n]*\)','',t)
  t=re.sub(r'(?m)^\*\*Что такое ToSelf.*\n.*\n?','',t)
  t=re.sub(r'(?m)^.*ToSelf.*\n?','',t)
  t=re.sub(r'\{(TargetItem|ItemName)\}','нужный предмет',t);t=re.sub(r'\{(PalName|TargetPal)\}','пал',t);t=re.sub(r'\{(Num|Count|Value)\}','N',t)
  t=re.sub(r'\{[A-Za-z_ ]+\}','',t)
  t=re.sub(r'\b(?:CharacterSpawnItem|EnemyCamp_)\w*','',t)
  t=re.sub(r'DamageUpIfEquipped_Yakushima(Melee|Magic|Ranged|Summon)Weapon',lambda m:'Урон с оружием Якусимы ('+{'Melee':'ближний бой','Magic':'магия','Ranged':'дальний бой','Summon':'призыв'}[m.group(1)]+')',t)
  t=re.sub(r'(?<![\w/.-])[A-Z][A-Za-z0-9]*_[A-Za-z0-9_]+(?![\w/.-])','',t)
  t=re.sub(r'(?<![\w-])(None|nan|null)(?![\w-])','—',t)
  t=re.sub(r'(?<![/\w])\w+\.(json|py)\b','',t)
  t=re.sub(r'\(\s*[,;·]?\s*\)','',t);t=re.sub(r'(,\s*){2,}',', ',t);t=re.sub(r'[ \t]*·[ \t]*(?=·)','',t)
  t=re.sub(r'(?m) +$','',t)
  def _hc(m):
    h=re.sub(r'\s*\((?:по внутренн[^)]*|\d+(?:\.\d+)*|v?\d[\d.]*\+?|[A-Za-z][A-Za-z0-9 \x27\u2019:&/.,-]*)\)','',m.group(2))
    return m.group(1)+h.rstrip()
  t=re.sub(r'(?m)^(#{1,6} )(.+)$',_hc,t)
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
PSRC={x['ru']:x for x in json.load(open(W+'/data/passive_sources.json'))}
IEN={i['en']:i['ru'] for i in items}
os.makedirs(D+'/passivki',exist_ok=True)
def pslug(en):return slug(en.replace('’','').replace("'",''))
def rcls(r):
  r=int(r or 0);return 'r-neg' if r<0 else f'r-{min(r,5)}'
SPS=[];PSU={}
for x in pas:
  sr=PSRC.get(x['name'],{});u='passivki/'+pslug(x.get('en') or x['name'])+'/';PSU[x['name']]=u
  sg=sr.get('surgery') or {}
  SPS.append({'i':len(SPS),'de':x.get('desc_en',''),'name':x['name'],'en':x.get('en',''),'rank':x.get('rank'),'desc':x.get('desc',''),'url':u,
   'nat':[n['pal'] for n in sr.get('natural',[])],'breed':bool(sr.get('breeding',True)),'how':sg.get('how'),'gold':sg.get('gold'),
   'drops':[[IEN.get(d['from'],d['from']),d['rate']] for d in sg.get('drops',[])]})
def plink(name,R):
  u=PSU.get(name);return f'<a class="psv {rcls(next((q["rank"] for q in SPS if q["name"]==name),1))}" data-psv="{name}" href="{R}{u}">{name}</a>' if u else f'<span class="psv">{name}</span>'
RANKTXT={5:'легендарная ⭐',4:'очень редкая',3:'редкая',2:'хорошая',1:'обычная',-1:'плохая',-2:'плохая',-3:'очень плохая'}
for q in SPS:
  sp=f"{D}/{q['url'].rstrip('/')}.md";R='../../'
  nat=''.join(f'<a class="tag" href="{R}{PU0[n]}">{n}</a>' if n in PU0 else f'<span class="tag">{n}</span>' for n in q['nat']) if (PU0:={x['ru']:x['url'] for x in SP if x['url']}) else ''
  gets=[]
  if q['nat']:gets.append('🐣 **С рождения** бывает у палов ниже — их и разводи.')
  if q['breed']:gets.append('🧬 **Разведение:** передаётся от родителей детям (шанс выше, если пассивка у обоих).')
  if q['how']=='gold':gets.append(f"🏥 **Операционный стол:** ставится за {q['gold']:,} золота".replace(',',' ')+' (открывается после победы на арене).')
  if q['how']=='disposable':gets.append('💉 **Имплант** (одноразовый): падает из Древних реликвий — '+', '.join(f'{a} {b}' for a,b in q['drops'])+'.')
  rk=int(q['rank'] or 0)
  plain='Это **плохая** пассивка — лучше от неё избавиться при разведении.' if rk<0 else ('Одна из **лучших** пассивок в игре.' if rk>=4 else 'Полезная пассивка.')
  open(sp,'w').write(f'''# {q['name']}

<div class="psv-hero" markdown="0"><span class="psv {rcls(rk)} big">{q['name']}</span> <span class="rk">Ранг {rk} · {RANKTXT.get(rk,'')}</span><div class="en">{q['en']}</div></div>

**Что даёт:** {q['desc'] or '—'}

{plain} Одинаковые пассивки на одном пале не складываются.

## Где взять

{chr(10).join('- '+g for g in gets) or '- Только у палов с рождения.'}

''' +(f'''## У каких палов есть с рождения

<div class="tags" markdown="0">{nat}</div>
''' if q['nat'] else ''))
open(D+'/passivki/index.md','w').write('# Все пассивки\n\n'+''.join(f"\n## {RANKTXT.get(r,'Ранг '+str(r)).capitalize()}\n\n<div class=\"tags\" markdown=\"0\">"+''.join(plink(q['name'],'../') for q in SPS if int(q['rank'] or 0)==r)+'</div>\n' for r in (5,4,3,2,1,-1,-2,-3)))
faq=[]
for fn in ['faq_extra.json','faq.json']:
  for q in json.load(open(W+'/data/'+fn)): faq.append({'q':q['q'],'a':q['a']})
syn=json.load(open(W+'/data/synonyms.json'))
syn={k:v for k,v in syn.items() if isinstance(v,str)}
L=json.load(open(W+'/data/locations.json'));MP=[]
PU={x['ru']:x['url'] for x in SP if x['url']}
def wt(x,y):return y>735 and -220<x<130
for a in L.get('alphas',[]):
  if a.get('xy') and not wt(*a['xy']):MP.append({'t':'alpha','name':a['pal'],'x':a['xy'][0],'y':a['xy'][1],'lvl':a.get('level',''),'info':'Альфа','url':PU.get(a['pal'],'')})
for a in L.get('fast_travel',[]):
  if a.get('xy') and a.get('region')!='WIP' and not wt(*a['xy']):MP.append({'t':'travel','name':a['name_en'],'x':a['xy'][0],'y':a['xy'][1],'info':'Телепорт','url':''})
for a in L.get('towers',[]):
  if a.get('x') is not None:
    bu=next((b['url'] for b in SB if b['place']==a['name'] and b['url']),'')
    bl=next((b['level'] for b in SB if b['place']==a['name']),'')
    MP.append({'t':'tower','name':a['name'],'x':a['x'],'y':a['y'],'lvl':bl,'info':'Башня','url':bu})
for a in L.get('sealed_realms',[]):
  if a.get('xy') and not wt(*a['xy']):MP.append({'t':'sealed','name':a['name_en'],'x':a['xy'][0],'y':a['xy'][1],'lvl':a.get('level',''),'info':'Запечатанные земли · '+a.get('pal',''),'url':PU.get(a.get('pal',''),'')})
NATP={}
for q in SPS:
  for n in q['nat']: NATP.setdefault(n,[]).append([q['name'],int(q['rank'] or 0)])
for x in SP: x['natp']=NATP.get(x['ru'],[])
POP={}
try:
  for l in open('/workspace/palbot/bot.log',encoding='utf-8',errors='ignore'):
    m=re.search(r"text='(.*)'$",l)
    if not m:continue
    t=m.group(1).lower()
    for x in SP:
      if len(x['ru'])>3 and x['ru'].lower() in t: POP[x['id']]=POP.get(x['id'],0)+1
except Exception as e: print('popular skip',e)
POPL=sorted(POP.items(),key=lambda z:-z[1])[:12]
SI=cj(SI);SB=cj(SB);SPS=cj(SPS);faq=cj(faq);MP=cj(MP)
_fz=W.replace('palwiki','palsite')+'/build_index.json'
try:_F=json.load(open(_fz))
except Exception:_F={'pals':[],'passives':[]}
for _k,_arr,_key in (('pals',SP,'id'),('passives',SPS,'name')):
  for _x in _arr:
    if _x[_key] not in _F[_k]:_F[_k].append(_x[_key])
  _ix={v:i for i,v in enumerate(_F[_k])}
  for _x in _arr:_x['i']=_ix[_x[_key]]
json.dump(_F,open(_fz,'w'),ensure_ascii=False,indent=0)
json.dump({'popular':POPL,'map':MP,'pals':SP,'items':SI,'bosses':SB,'passives':SPS,'faq':faq,'syn':syn,'built':datetime.date.today().isoformat()},open(A+'/search_data.json','w'),ensure_ascii=False,separators=(',',':'))
shutil.move(A+'/manifest.webmanifest',D+'/manifest.webmanifest');open(D+'/sw.js','w').write(open(A+'/sw.js').read().replace('__BUILD__',datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d%H%M')));os.remove(A+'/sw.js')
print('map points',len(MP));print('search_data KB',os.path.getsize(A+'/search_data.json')//1024)
TABMAP=[('Обзор',('Работа','Партнёрск','Чем хорош')),('Атаки',('Атаки',)),('Где живёт',('Где водится',)),('Дроп',('Дроп',)),('Разведение',('Разведение',)),('Пассивки',('Лучшие пассивки','Пассивк'))]
order=sorted([x for x in SP if x['url']],key=lambda x:(float(re.match(r'\d+',x['no']).group()) if re.match(r'\d+',x['no']) else 999,x['no']))
for i,x in enumerate(order):
  path=D+'/'+x['url'].rstrip('/')+'.md';t=open(path).read()
  m=re.search(r'(?m)^## ',t)
  if m:
    head,body=t[:m.start()],t[m.start():]
    secs=re.split(r'(?m)^## ',body)[1:];tabs={}
    ROLEI={'боец':('⚔️ Боец','максимум урона и живучести в бою'),'рабочий':('🛠 Рабочий','работает быстрее и меньше устаёт на базе'),'ездовой':('🐎 Ездовой','быстрее бегает или летает с тобой верхом')}
    for sc in secs:
      ttl,_,txt=sc.partition('\n');name='Обзор'
      if ttl.startswith('Лучшие пассивки'):
        txt='\n<div class="psets" markdown="0">'+''.join(f'<div class="pset"><div class="pset-h">{ROLEI.get(r,(r,""))[0]}</div><div class="pset-w">{ROLEI.get(r,("",""))[1]}</div><div class="tags">'+''.join(plink(n,"../../../") for n in v[:4])+'</div></div>' for r,v in x['bp'].items())+'</div>\n\n<small>Нажми на пассивку, чтобы узнать, что она даёт и где её взять.</small>\n'
      for tn,keys in TABMAP:
        if any(ttl.startswith(k) for k in keys):name=tn;break
      tabs.setdefault(name,[]).append('#### '+ttl.strip()+'\n'+txt)
    out=head
    for tn,_ in TABMAP:
      if tn in tabs: out+=f'=== "{tn}"\n\n'+'\n'.join('    '+l if l.strip() else '' for l in '\n'.join(tabs[tn]).split('\n'))+'\n\n'
    t=out
  pv,nx=order[i-1] if i else None,order[i+1] if i+1<len(order) else None
  nav='<div class="pn" markdown="0">'+(f'<a class="card-link" href="../{pv["url"].split("/")[-2]}/">← {pv["ru"]}</a>' if pv else '<span></span>')+(f'<a class="card-link" href="../{nx["url"].split("/")[-2]}/">{nx["ru"]} →</a>' if nx else '')+'</div>'
  t=t.replace('<div class="pal-info">',f'<div class="pal-info" data-pal="{x["id"]}">',1)+'\n'+nav+'\n'
  open(path,'w').write(t)
# ---------- grouped pal page
open(D+'/4_spravochniki/paly_po_stihiyam_i_rabote.md','w').write('---\nhide: [toc]\n---\n# Палы по стихиям и по работе\n<div id="bygroup" markdown="0"></div>\n')
# ---------- walls of comma lists -> chips
PN={p['ru'].lower():p for p in SP if p['url']}
def chips(line):
  m=re.match(r'^(\s*(?:[-*]\s+)?(?:\*\*[^*]+\*\*|[^:|]{1,60}):\s*)(.+)$',line)
  if not m or '|' in line:return line
  parts=[x.strip() for x in re.split(r',\s*',m.group(2)) if x.strip()]
  if len(parts)<=10 or any(len(x)>60 for x in parts):return line
  def one(x):
    base=re.sub(r'\s*\(.*?\)|\s*[—–-]\s*ур.*$','',x).strip().rstrip('.').lower()
    pp=PN.get(base)
    return f'<a class="tag" href="{{R}}{pp["url"]}">{x.rstrip(".")}</a>' if pp else f'<span class="tag">{x.rstrip(".")}</span>'
  return m.group(1).rstrip()+'\n\n<div class="tags" markdown="0">'+''.join(one(x) for x in parts)+'</div>\n'
NW=0
for f in glob.glob(D+'/**/*.md',recursive=True):
  t=open(f).read();R='../'*(os.path.relpath(f,D).count('/')+ (0 if f.endswith(('index.md','README.md')) else 1))
  out=[]
  for l in t.split('\n'):
    c=chips(l)
    if '/passivki/' not in f: c=re.sub(r'«([^»]{3,30})»|\*\*([^*]{3,30})\*\*',lambda m:plink(m.group(1) or m.group(2),'{R}') if (m.group(1) or m.group(2)) in PSU else m.group(0),c)
    if c!=l:NW+=1
    out.append(c.replace('{R}',R))
  open(f,'w').write('\n'.join(out))
print('comma walls -> chips',NW)
# ---------- dedupe: keep guide/ version when same H1 exists elsewhere
def h1(f):
  for l in open(f):
    if l.startswith('# '):return l[2:].strip()
  return ''
GT={h1(f):f for f in glob.glob(D+'/guide/*.md')}
DUP={}
for f in glob.glob(D+'/*/*.md'):
  if '/guide/' in f:continue
  if h1(f) in GT: DUP[os.path.normpath(f)]=GT[h1(f)];os.remove(f)
print('duplicates merged',len(DUP))
# ---------- fix links
bad=0
for f in glob.glob(D+'/**/*.md',recursive=True):
  s=open(f).read()
  def fx(m):
    global bad
    t=m.group(2);u=t.split('#')[0]
    if not u or re.match(r'\w+:',t) or re.search(r'\.(png|webp)$',u):return m.group(0)
    tgt=os.path.normpath(os.path.join(os.path.dirname(f),u))
    if os.path.exists(tgt):return m.group(0)
    if tgt in DUP:return '['+m.group(1)+']('+os.path.relpath(DUP[tgt],os.path.dirname(f))+(('#'+t.split('#',1)[1]) if '#' in t else '')+')'
    bad+=1;return m.group(1)
  open(f,'w').write(re.sub(r'(?<!!)\[([^\]]*)\]\(([^)\s]+)\)',fx,s))
print('broken links removed',bad)
# ---------- pages
hero=''.join(f'<img src="art/{p["id"]}.webp" alt="" loading="lazy">' for p in random.Random(7).sample([p for p in SP if p['art']],14))
T=lambda u,i,t,d:f'<a class="tile card-link" href="{u}"><span class="ti">{i}</span><b>{t}</b><small>{d}</small></a>'
open(D+'/index.md','w').write(f'''---
hide: [navigation, toc]
---
<div class="hero" markdown="0"><span class="hero-credit">Карта: palworld.wiki.gg</span><div class="hero-in">
<h1>Энциклопедия Palworld</h1><p>Всё о Palworld на русском: уровни 0–80, {len(SP)} палов, {len(SI)} предметов, боссы, пассивки, разведение и секреты.</p>
<div class="smart-box"><input id="home-q" type="search" placeholder="Спроси что угодно: «кто лучше копает», «чем бить Зои», «где взять серу»…" autocomplete="off"></div>
<div id="home-answer" class="smart-out"></div></div></div>
<div class="tiles bento" markdown="0">
{T('gallery/','🐾','Палы','галерея с фильтрами')}{T('4_spravochniki/bossy/','👑','Боссы','башни, рейды, альфы')}{T('guide/03_prohozhdenie_1_80/','🗺️','Прохождение','с 1 до 80 уровня')}{T('2_mehaniki/passivki/','✨','Пассивки','лучшие наборы')}{T('guide/sekrety/','🤫','Секреты','пасхалки и тайники')}{T('map/','📍','Карта','альфы, башни, телепорты')}{T('4_spravochniki/predmety/','🎒','Предметы','где взять и крафт')}{T('breed/','🧬','Разведение','калькулятор пар')}{T('my/','⭐','Мои списки','команда и фарм')}{T('https://t.me/PalGuideBot','🤖','Бот @PalGuideBot','спроси в Telegram')}
</div>
<div class="bento2" markdown="0"><div class="potd-wrap"><h2>⭐ Пал дня</h2><div id="potd"><div class="skel" style="height:170px"></div></div></div><div><h2>🕘 Недавние</h2><div id="recent" class="mini-row"><small>Открой пару палов — они появятся здесь.</small></div><h2>⭐ Избранное</h2><div id="favs" class="mini-row"><small>Нажми ☆ на странице пала.</small></div></div></div>
''')
open(D+'/gallery.md','w').write('''---
hide: [toc]
---
# 🐾 Галерея палов
<div id="gal-filters" class="gal-filters" markdown="0"></div>
<div id="gallery" class="gallery" markdown="0"><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div><div class="skel pcs"></div></div>
''')
open(D+'/compare.md','w').write('---\nhide: [toc]\n---\n# ⚔️ Сравнение двух палов\n<div id="cmp" markdown="0"></div>\n')
open(D+'/map.md','w').write('---\nhide: [toc]\nleaflet: true\n---\n# 📍 Карта Палпагоса\n<div class="gal-filters" markdown="0"><input id="mapq" type="search" placeholder="Найти: Анубис, башня, телепорт…"></div>\n<div id="pwmap" markdown="0"></div>\n<p class="map-note">Статуэтки Лифмунка и входы в подземелья меняют место, поэтому их нет на карте. Мировое Древо — отдельная карта.</p>\n')
open(D+'/breed.md','w').write('---\nhide: [toc]\n---\n# 🧬 Калькулятор разведения\n<div id="breed" markdown="0"></div>\n')
open(D+'/my.md','w').write('---\nhide: [toc]\n---\n# ⭐ Мои списки\nСписки хранятся только в этом браузере.\n\n<div id="mylists" markdown="0"></div>\n')
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
  t=h1(f) or os.path.basename(f)[:-3]
  t=re.sub(r'^#\d+\w*\s+','',t);t=re.sub(r'\s*\([^)]*\)\s*$','',t);t=re.sub(r'^Предметы:\s*','',t)
  t=re.split(r' — | - |: ',t)[0].strip()
  return t.replace('"','')
used=set()
def sec(d):
  fs=sorted(f for f in glob.glob(f'{D}/{d}/*.md') if f not in used);used.update(fs)
  fs.sort(key=lambda f:(not f.endswith('README.md'),int(m.group(1)) if (m:=re.match(r'(\d+)_',os.path.basename(f))) else 99,title(f)))
  return [{title(f):os.path.relpath(f,D)} for f in fs]
G=lambda *xs:[{n:sec(d)} for d,n in xs if glob.glob(f'{D}/{d}/*.md')]
mir=[{title(D+'/guide/'+x):'guide/'+x} for x in ('11_mir.md','koordinaty.md','sekrety.md')];used.update(D+'/guide/'+x for x in ('11_mir.md','koordinaty.md','sekrety.md'))
pal_pages=sec('4_spravochniki/paly')
spr=G(('4_spravochniki/predmety','Предметы'))+sec('4_spravochniki')
nav=[{'🏠 Главная':'index.md'},
 {'🐾 Палы':[{'Галерея и фильтры':'gallery.md'},{'По стихиям и работе':'4_spravochniki/paly_po_stihiyam_i_rabote.md'},{'Сравнить двух':'compare.md'},{'Калькулятор разведения':'breed.md'},{'Мои списки':'my.md'}]},
 {'🧭 Гайд':sec('guide')+sec('0_nachni_zdes')+sec('1_prohozhdenie')},
 {'📚 Справочник':[{'Все пассивки':'passivki/index.md'}]+spr+sec('2_mehaniki')+sec('3_bazy')+sec('5_lut_i_farm')},
 {'🗺️ Мир и карта':[{'Интерактивная карта':'map.md'}]+mir+sec('6_mir')+sec('7_server')},
 {'❓ FAQ':sec('9_faq')+sec('8_slovar')+sec('10_bagi')},
 {'🤖 Бот':'bot.md'}]
keep=used|{D+'/passivki/'+os.path.basename(f) for f in glob.glob(D+'/passivki/*.md')}|{D+'/index.md',D+'/gallery.md',D+'/bot.md',D+'/compare.md',D+'/map.md',D+'/breed.md',D+'/my.md'}
for f in glob.glob(D+'/**/*.md',recursive=True):
  if f not in keep: os.remove(f)
import yaml
y=yaml.safe_dump({'nav':nav},allow_unicode=True,sort_keys=False)
import time as _t;_v=str(int(_t.time()));open('/workspace/palsite/mkdocs.yml','w').write(re.sub(r'assets/(\w+)\.(js|css)',lambda m:"'"+m.group(0)+'?v='+_v+"'",open('/workspace/palsite/mkdocs.base.yml').read())+y)
