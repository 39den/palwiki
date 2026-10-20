import json
_jl=json.load
def _unhide(d):
  if isinstance(d,list):return [_unhide(x) for x in d if not (isinstance(x,dict) and x.get('hide'))]
  if isinstance(d,dict):return {k:_unhide(v) for k,v in d.items()}
  return d
import os,re,shutil,glob,datetime,random
json.load=lambda f,*a,**k:_unhide(_jl(f,*a,**k))
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
shutil.copy(W+'/data/breeding.json',A+'/breeding.json')
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
  if 'rideable' in p:mount=(mount or 'ride') if p['rideable'] else ''
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
  SP.append({'j':len(SP),'i':len(SP),'no':p['no'],'id':p['id'],'ru':p['ru'],'en':p['en'],'el':p['elements'],'weak':p['weak_to'],'work':[[w['work'],w['level']] for w in p['work']],
    'act':acts,'mount':mount,'sprint':int(re.sub(r'\D','',str(p['stats'].get('mount_sprint') or 0)) or 0),'hp':p['stats']['hp'],'atk':p['stats']['attack'],'def':p['stats']['defense'],
    'rarity':int(p['rarity'] or 0),'url':url,'img':img,'thumb':icon,'art':thumb,'bp':{k:v for k,v in (p.get('best_passives') or {}).items() if k!='ездовой' or p.get('rideable',True)},'rank':int(p['breeding'].get('combi_rank') or 0),
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
_PO=sorted(SPS,key=lambda q:(-int(q['rank'] or 0),q['name']))
for _i,_q in enumerate(_PO):
  _pv=_PO[_i-1] if _i>0 else None;_nx=_PO[_i+1] if _i+1<len(_PO) else None
  with open(f"{D}/{_q['url'].rstrip('/')}.md",'a') as _fh:_fh.write('\n<div class="pn" markdown="0">'+(f'<a class="card-link" href="../../{_pv["url"]}">← {_pv["name"]}</a>' if _pv else '<span></span>')+(f'<a class="card-link" href="../../{_nx["url"]}">{_nx["name"]} →</a>' if _nx else '')+'</div>\n')
# ---- passive cards ----
def _norm_num(t):
  t=re.sub(r'([+\-−])\s+(\d)',r'\1\2',t);t=re.sub(r'(\d)\s+%',r'\1%',t);t=re.sub(r'(\d+)\.0(?=%|\b)',r'\1',t);return t
def _effects(desc):
  out=[]
  for part in re.split(r';\s*',_norm_num(desc or '')):
    part=part.strip()
    if not part:continue
    if re.search('Мирового Древа|Мировое Древо',part):out.append(('wt','🌳 не исчезает у Мирового древа',part));continue
    m=re.search(r'([+\-−])\d',part)
    if not m:out.append(('n',part,part));continue
    neg=m.group(1) in '-−'
    bad_up=re.search(r'(Рассуд|Голод|сытост|расход|получаем)',part,re.I) and re.search('быстрее|\\+',part)
    if re.search(r'(Рассуд|Голод|сытост|расход|получаем)',part,re.I):good=neg
    else:good=not neg
    out.append(('up' if good else 'dn',part,part))
  return out
def _cats(desc):
  c=[]
  if re.search('атак|урон|защит|здоров|HP|крит',desc,re.I):c.append('бой')
  if re.search('работ',desc,re.I):c.append('работа')
  if re.search('передвиж|скорость (ходьбы|бега|движ)|выносл|полёт|прыж',desc,re.I):c.append('езда')
  if re.search('рассуд|голод|сытост|база',desc,re.I):c.append('база')
  return c or ['прочее']
_PTH={x['ru']:x for x in SP if x['url']}
_RL={5:'Радужная',4:'Золотая',3:'Редкая',2:'Хорошая',1:'Обычная',-1:'Плохая',-2:'Плохая',-3:'Очень плохая'}
def _rarity_cls(n):
  return {'Glistening':'r5','Glowing':'r4','Gorgeous':'r3','Dormant':'r2','Decayed':'r1'}.get(n.split()[0],'r1')
def pcard(q,R,detail=False):
  rk=int(q['rank'] or 0);eff=_effects(q['desc']);cats=_cats(q['desc'])
  ch=''.join(f'<span class="ef {k}">{esc_h(t)}</span>' if k!='wt' else f'<span class="ef wt" title="{esc_h(full)}">🌳</span>' for k,t,full in eff if k!='n')
  notes=''.join(f'<small class="efn">{esc_h(t)}</small>' for k,t,_ in eff if k=='n')
  nat=[n for n in q['nat'] if n in _PTH]
  av=''.join(f'<img src="{R}{_PTH[n]["thumb"]}" width="28" height="28" alt="{esc_h(n)}" title="{esc_h(n)}" loading="lazy">' for n in nat[:4])+(f'<span class="more">+{len(nat)-4}</span>' if len(nat)>4 else '')
  how=[]
  if q['nat']:how.append(('nat','🐣','с рождения',f'Есть у {len(q["nat"])} палов: '+', '.join(q['nat'][:8])+('…' if len(q['nat'])>8 else '')))
  if q['breed']:how.append(('br','🧬','разведение','Передаётся детёнышу от родителя с этой пассивкой.'))
  if q['how']=='gold':how.append(('op','🏥','операционный стол',f"Стоимость: {q['gold']:,} золота".replace(',',' ')))
  if q['how']=='disposable':
    rows=''.join(f'<tr class="{_rarity_cls(a_en)}"><td>{esc_h(a)}</td><td>{round(float(str(r).rstrip("%")),2)}%</td></tr>' for (a,r),a_en in zip(q['drops'][:3],[d.get('from','') for d in (PSRC.get(q['name'],{}).get('surgery') or {}).get('drops',[])][:3]))
    how.append(('im','💉','имплант · расходуется',f'Падает из Древних реликвий:<table class="dch">{rows}</table>'))
  badges=''.join((f'<details class="hw {k}"><summary>{i} {t}</summary><div>{d}</div></details>' if detail else f'<span class="hw {k}" title="{esc_h(re.sub("<[^>]+>"," ",d))}">{i} {t}</span>') for k,i,t,d in how)
  cls=f'pcard r-{"neg" if rk<0 else min(rk,5)}';attrs=f'data-rk="{rk}" data-cat="{" ".join(cats)}" data-n="{esc_h((q["name"]+" "+q["en"]).lower())}"'
  head=f'<div class="pch"><span class="rkb">{_RL.get(rk,"")}</span><b>{esc_h(q["name"])}</b></div><div class="efs">{ch}</div>{notes}'
  if detail:return f'<div class="{cls}" {attrs}>{head}<div class="hws">{badges}</div>{f"<div class=pav>{av}</div>" if av else ""}<a class="pmore" href="{R}{q["url"]}">Подробнее →</a></div>'
  return f'<a class="{cls}" href="{R}{q["url"]}" data-psv="{esc_h(q["name"])}" {attrs}>{head}<div class="hws">{badges}</div>{f"<div class=pav>{av}</div>" if av else ""}</a>'
def pfilters(withcat=True):
  rk=''.join(f'<button type="button" data-rk="{v}">{t}</button>' for v,t in (('5','🌈 Радужные'),('4','🥇 Золотые'),('3','Редкие'),('1-2','Обычные'),('neg','🔻 Отрицательные')))
  ct=''.join(f'<button type="button" data-cat="{c}">{t}</button>' for c,t in (('бой','⚔️ Бой'),('работа','🛠 Работа'),('езда','🐎 Езда'),('база','🏠 База')))
  return f'<div class="pfl" markdown="0"><input type="search" class="pfq" placeholder="Найти пассивку…" autocomplete="off"><div class="pfc">{rk}</div>'+(f'<div class="pfc">{ct}</div>' if withcat else '')+'<span class="gcount pfn"></span></div>'
def esc_h(t):return str(t).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')

open(D+'/passivki/index.md','w').write('---\nhide: [toc]\n---\n# ✨ Все пассивки\n\n'+pfilters()+'\n<div class="pgrid" markdown="0">'+''.join(pcard(q,'../') for q in sorted(SPS,key=lambda q:(-int(q['rank'] or 0),q['name'])))+'</div>\n')
_how=f'''---
hide: [toc]
---
# Где взять пассивку и как её перенести

<div class="howt" markdown="0"><div class="ht"><span>🧬</span><b>Разведение</b><p>Детёныш наследует пассивки родителей. Чем больше у родителей нужных пассивок, тем выше шанс.</p></div><div class="ht"><span>🏥</span><b>Операционный стол</b><p>Ставит пассивку за золото. Открывается технологией после победы на арене.</p></div><div class="ht"><span>💉</span><b>Имплант</b><p>Одноразовый предмет из Древних реликвий — расходуется при установке.</p></div></div>

'''+pfilters(False)+'\n<div class="pgrid" markdown="0">'+''.join(pcard(q,'../../',True) for q in sorted(SPS,key=lambda q:(-int(q['rank'] or 0),q['name'])))+'</div>\n'
if os.path.exists(D+'/2_mehaniki/passivki_gde_vzyat.md'):open(D+'/2_mehaniki/passivki_gde_vzyat.md','w').write(_how)
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
_pj=W+'/data/popular.json'
if os.path.exists(_pj):
  try:
    _pd=json.load(open(_pj));_it=_pd.get('pals',_pd) if isinstance(_pd,dict) else _pd
    _ru={x['ru']:x['id'] for x in SP};POP={}
    for _e in (_it.items() if isinstance(_it,dict) else _it):
      n,c=(_e if isinstance(_e,(list,tuple)) else (_e.get('ru') or _e.get('name'),_e.get('count',1)))
      if n in _ru:POP[_ru[n]]=c
      elif n in {x['id'] for x in SP}:POP[n]=c
  except Exception as e:print('popular.json skip',e)
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
{T('gallery/','🐾','Палы','галерея с фильтрами')}{T('compare/','⚖️','Сравнить','двух палов рядом')}{T('boss/','👑','Все боссы','карточки и кем бить')}{T('4_spravochniki/bossy/','👑','Боссы','башни, рейды, альфы')}{T('guide/03_prohozhdenie_1_80/','🗺️','Прохождение','с 1 до 80 уровня')}{T('2_mehaniki/passivki/','✨','Пассивки','лучшие наборы')}{T('guide/sekrety/','🤫','Секреты','пасхалки и тайники')}{T('map/','📍','Карта','альфы, башни, телепорты')}{T('4_spravochniki/predmety/','🎒','Предметы','где взять и крафт')}{T('breed/','🧬','Разведение','калькулятор пар')}{T('my/','⭐','Мои списки','команда и фарм')}{T('https://t.me/PalGuideBot','🤖','Бот @PalGuideBot','спроси в Telegram')}
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
open(D+'/map.md','w').write('---\nhide: [toc]\nleaflet: true\n---\n# 📍 Карта\n<div class="mapsw seg" markdown="0"><button class="on" data-w="p">Палпагос</button><button data-w="t">Мировое древо</button></div>\n<div class="msq" markdown="0"><input id="mapq" type="search" placeholder="Анубис, босс огня, телепорт рядом с…" autocomplete="off" enterkeyhint="search"><button class="msx" aria-label="Очистить" hidden>×</button><span class="mcnt" hidden></span><div class="msd" hidden></div></div>\n<div id="wtree" hidden markdown="0"></div>\n<div id="pwmap" markdown="0"></div>\n<p class="map-note">Статуэтки Лифмунка и входы в подземелья меняют место, поэтому их нет на карте. Мировое Древо — отдельная карта.</p>\n')
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
# ---- boss cards ----
os.makedirs(D+'/boss',exist_ok=True)
PBR={x['ru']:x for x in SP}
def _mode(n):
  m=re.search(r'\((обычный|сложный|ультра)\)',n)
  if m:return m.group(1)
  if n.startswith('[Мастер]'):return 'мастер'
  return 'обычный'
def _base(n):return re.sub(r'\s+',' ',re.sub(r'\((обычный|сложный|ультра)\)|\[Мастер\]','',n)).strip()
BG={};BORD=[]
for b in bosses:
  if b['kind']=='подземелье' or not b.get('pal'):continue
  k=b['pal'] if b['kind']=='рейд' else _base(b['name'])
  if k not in BG:BG[k]={'name':_base(b['name']),'kind':b['kind'],'pal':b['pal'],'place':b.get('place') or '','coords':b.get('coords'),'el':b.get('elements',[]),'weak':b.get('weak_to',[]),'team':[t['pal'] for t in ((b.get('recommended_team') or {}).get('main') or [])],'tactics':b.get('tactics') or '','modes':[]};BORD.append(k)
  BG[k]['modes'].append({'m':_mode(b['name']),'lvl':b.get('level'),'hp':b.get('hp'),'loot':b.get('loot') or ''})
for a in L.get('alphas',[]):
  if a['pal'] in BG:continue
  p=PBR.get(a['pal'])
  if not p:continue
  BG[a['pal']]={'name':a['pal'],'kind':'альфа','pal':a['pal'],'place':'','coords':a.get('xy') and f"{a['xy'][0]}, {a['xy'][1]}",'el':p['el'],'weak':p['weak'],'team':[],'tactics':'','modes':[{'m':'альфа','lvl':a.get('level'),'hp':None,'loot':''}]};BORD.append(a['pal'])
KT={'башня':'🏯 Башня','рейд':'⚔️ Рейд','босс':'🌊 Мировой босс','мини-босс Мирового Древа':'🌳 Мировое древо','альфа':'👑 Альфа'}
def _cl(t):
  t=clean(str(t)) if t else '';t=re.sub(r'\[[^\]]*(провер|патч)[^\]]*\]','',t).strip(' ;,.')
  return t
BJS=[]
for k in BORD:
  g=BG[k];sl=slug(PBR[g['pal']]['en'] if g['pal'] in PBR else g['name']) or ('boss_'+str(len(BJS)));
  if g['kind']=='альфа':sl='alpha_'+sl
  g['url']='boss/'+sl+'/';p=PBR.get(g['pal']);R='../../'
  img=f'<img class="bimg" src="{R}{p["art"] if p and p.get("art") else (p["thumb"] if p else "")}" alt="" width="260" height="260">' if p else ''
  ctr=[x for x in SP if x['url'] and set(x['el'])&set(g['weak'])];ctr.sort(key=lambda x:-x['atk']);ctr=([PBR[t] for t in g['team'] if t in PBR and set(PBR[t]['el'])&set(g['weak'])]+[c for c in ctr if c['ru'] not in g['team']])[:8]
  q=g['place'] or g['pal'];maplink=f'<a class="md-button" href="{R}map/?q={q}">📍 На карте</a>' if g['coords'] else ''
  tabs=''
  for m in g['modes']:
    rows=[('Уровень',m['lvl']),('Здоровье',f"{m['hp']:,}".replace(',',' ') if isinstance(m['hp'],int) else None)]
    lt=_cl(m['loot'])
    body=''.join(f'<div><span>{a}</span><b>{v}</b></div>' for a,v in rows if v not in (None,'',0))
    tabs+=f'=== "{m["m"].capitalize()}"\n\n    <div class="bstats" markdown="0">{body}</div>\n\n'+(f'    **Награда:** {lt}\n\n' if lt else '')
  cn=''.join(f'<a class="mc card-link" href="{R}{c["url"]}#bld"><img src="{R}{c["thumb"]}" width="56" height="56" alt="" loading="lazy"><span>{c["ru"]}</span></a>' for c in ctr)
  tac=_cl(g['tactics'])
  md=f'''---
hide: [toc]
---
# {g['name']}

<div class="boss-hero" data-el="{EL.get((g['el'] or ['Нейтральный'])[0],'neutral')}" markdown="0">{img}<div class="bi"><span class="kind">{KT.get(g['kind'],g['kind'])} <button class="hlp" data-h="boss">?</button></span><h2>{g['pal']}</h2><div>{''.join(chip(e) for e in g['el'])}</div><div class="wk">Слабость: {''.join(chip(e) for e in g['weak']) or '—'}</div>{f'<div class="pl">📍 {g["place"]}</div>' if g['place'] else ''}<div class="bb">{maplink}{f'<a class="md-button" href="{R}{p["url"]}">Страница пала</a>' if p and p['url'] else ''}</div></div></div>

{tabs}
'''+(f'''## 💥 Кем бить <button class="hlp" data-h="counter">?</button>

Палы, которые бьют по слабости босса. Нажми — откроется сборка пала, там видно, как он против этого босса.

<div class="mini-row" markdown="0">{cn}</div>
''' if cn else '')+(('\n## 🧠 Тактика\n\n<div class="tips" markdown="0">'+''.join(f'<div class="tip"><span>💡</span>{esc_h(x.strip())}</div>' for x in re.split(r'(?<=[.!?])\s+',tac) if len(x.strip())>3)[:8000]+'</div>\n') if tac else '')
  open(D+'/boss/'+sl+'.md','w').write(md)
  BJS.append({'n':g['name'],'k':g['kind'],'pal':g['pal'],'el':g['el'],'w':g['weak'],'lv':[m['lvl'] for m in g['modes']],'u':g['url'],'t':(p or {}).get('thumb','')})
for _i,_b in enumerate(BJS):
  _pv=BJS[_i-1] if _i>0 else None;_nx=BJS[_i+1] if _i+1<len(BJS) else None
  with open(D+'/'+_b['u'].rstrip('/')+'.md','a') as _fh:_fh.write('\n<div class="pn" markdown="0">'+(f'<a class="card-link" href="../../{_pv["u"]}">← {_pv["n"]}</a>' if _pv else '<span></span>')+(f'<a class="card-link" href="../../{_nx["u"]}">{_nx["n"]} →</a>' if _nx else '')+'</div>\n')
def _lv(x):
  try:return int(str(x).split('–')[0])
  except:return 0
open(D+'/boss/index.md','w').write('''---
hide: [toc]
---
# 👑 Боссы

<div class="gal-filters" id="bfl" markdown="0"><input id="bq2" type="search" placeholder="Найти босса…"><select id="bk"><option value="">Все типы</option>'''+''.join(f'<option value="{k}">{v}</option>' for k,v in KT.items())+'''</select><select id="be"><option value="">Стихия</option>'''+''.join(f'<option>{e}</option>' for e in EL)+'''</select><select id="bl"><option value="">Уровень</option><option value="0-30">до 30</option><option value="31-60">31–60</option><option value="61-200">61+</option></select><span id="bcnt" class="mcnt"></span></div>
<div class="bgal" markdown="0">'''+''.join(f'<a class="pc bc" href="../{b["u"]}" data-k="{b["k"]}" data-el="{" ".join(b["el"])}" data-lv="{max(_lv(x) for x in b["lv"])}" data-n="{b["n"].lower()} {b["pal"].lower()}"><img src="../{b["t"]}" width="96" height="96" alt="" loading="lazy"><b>{b["n"]}</b><small>{KT.get(b["k"],"")} · ур. {" / ".join(str(x) for x in b["lv"] if x)}</small><span>{"".join(chip(e) for e in b["el"])}</span></a>' for b in BJS)+'</div>\n')
for x in SB:
  g=BG.get(x['pal'] if x['kind']=='рейд' else _base(x['name']))
  if g:x['url']=g['url']
_sd=json.load(open(A+'/search_data.json'));_sd['bosses']=SB;_sd['bcards']=BJS;json.dump(_sd,open(A+'/search_data.json','w'),ensure_ascii=False,separators=(',',':'))

nav=[{'🏠 Главная':'index.md'},
 {'🐾 Палы':[{'Галерея и фильтры':'gallery.md'},{'По стихиям и работе':'4_spravochniki/paly_po_stihiyam_i_rabote.md'},{'Сравнить двух':'compare.md'},{'Калькулятор разведения':'breed.md'},{'Мои списки':'my.md'}]},
 {'🧭 Гайд':sec('guide')+sec('0_nachni_zdes')+sec('1_prohozhdenie')},
 {'📚 Справочник':[{'Все пассивки':'passivki/index.md'}]+spr+sec('2_mehaniki')+sec('3_bazy')+sec('5_lut_i_farm')},
 {'👑 Боссы':'boss/index.md'},
 {'🗺️ Мир и карта':[{'Интерактивная карта':'map.md'},{'Мировое древо':'https://39den.github.io/palwiki/map/#tree'}]+mir+sec('6_mir')+sec('7_server')},
 {'❓ FAQ':sec('9_faq')+sec('8_slovar')+sec('10_bagi')},
 {'🤖 Бот':'bot.md'}]
keep=used|{D+'/passivki/'+os.path.basename(f) for f in glob.glob(D+'/passivki/*.md')}|{D+'/boss/'+os.path.basename(f) for f in glob.glob(D+'/boss/*.md')}|{D+'/index.md',D+'/gallery.md',D+'/bot.md',D+'/compare.md',D+'/map.md',D+'/breed.md',D+'/my.md'}
for f in glob.glob(D+'/**/*.md',recursive=True):
  if f not in keep: os.remove(f)
import yaml
y=yaml.safe_dump({'nav':nav},allow_unicode=True,sort_keys=False)

# ---- FAQ assistant page ----
_fq=D+'/9_faq/faq.md'
if os.path.exists(_fq):
  _t=open(_fq).read();_lv=None;_Q=[]
  for blk in re.split(r'\n(?=## |\*\*)',_t):
    m=re.match(r'## (.+)',blk)
    if m:_lv=m.group(1).strip();continue
    m=re.match(r'\*\*(.+?)\*\*\s*\n(.*)',blk,re.S)
    if m and _lv:_Q.append((_lv,m.group(1).strip(),m.group(2).strip()))
  _CT=[('upr','🎮 Управление','клавиш|кнопк|нажм|открыть|управлен'),('lov','🎯 Ловля','пойма|ловл|сфер'),('baz','🏠 База','баз|постро|строит|верстак|ферм'),('boi','⚔️ Бой','бой|босс|башн|урон|атак|убить'),('bre','🧬 Разведение','развед|яйц|скрест|вывест'),('pas','✨ Пассивки','пассив'),('mir','🗺️ Мир','карт|найти|где|остров|регион')]
  _KEYS=r'\b(Tab|Esc|Shift|Ctrl|Alt|Пробел|ЛКМ|ПКМ|F\d{1,2}|[A-Z]|\d)\b'
  def _kb(a):return re.sub(r'(Клавиш[аиу]|Нажми|клавиш[аиу]|кнопк[аиу])\s+([A-Za-zА-Я0-9]+(?:\s+и\s+[A-Za-z0-9]+)?)',lambda m:m.group(1)+' '+re.sub(r'([A-Za-z0-9]+|Пробел)',r'<kbd>\1</kbd>',m.group(2)),a).replace('Пробел.','<kbd>Пробел</kbd>.') if True else a
  def _cat(q,a):
    for k,_,r in _CT:
      if re.search(r,q,re.I):return k
    return 'misc'
  _LVS=[];[_LVS.append(l) for l,_,_ in _Q if l not in _LVS]
  _md=lambda t:re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',t)
  acc=''.join(f'<details class="fq" data-lv="{_LVS.index(l)}" data-cat="{_cat(q,a)}"><summary>{esc_h(q)}</summary><div class="fa">{_kb(_md(esc_h(a)).replace(chr(10),"<br>"))}</div></details>' for l,q,a in _Q)
  top=[x for x in _Q if x[0]==_LVS[0]][:10]
  open(_fq,'w').write('---\nhide: [toc]\n---\n# 🤖 Спроси про Palworld\n\n<div class="ask" id="ask" markdown="0"><div class="ask-box"><input id="askq" type="search" autocomplete="off" enterkeyhint="send" placeholder="Спроси про Palworld…"><button type="button" id="asks" aria-label="Спросить">➤</button></div><div class="ask-chips">'+''.join(f'<button type="button" data-q="{q}">{q}</button>' for q in ['как поймать пала','где взять серу','как вывести анубиса','чем бить зои','лучшие пассивки для работы','как открыть карту'])+'</div><div id="asko" aria-live="polite"></div></div>\n\n## 🔥 Топ-10 для старта\n\n<div class="fqs" markdown="0">'+''.join(f'<details class="fq"><summary>{esc_h(q)}</summary><div class="fa">{_kb(_md(esc_h(a)))}</div></details>' for _,q,a in top)+'</div>\n\n## 📚 Все вопросы\n\n<div class="fqf" markdown="0"><div class="seg fqlv"><button type="button" class="on" data-lv="">Все</button>'+''.join(f'<button type="button" data-lv="{i}">{esc_h(l.replace("Совсем ",""))}</button>' for i,l in enumerate(_LVS))+'</div><div class="pfc fqc">'+''.join(f'<button type="button" data-cat="{k}">{t}</button>' for k,t,_ in _CT)+'</div></div>\n<div class="fqs" id="fqall" markdown="0">'+acc+'</div>\n')
import glob as _g

_TI={'Редкость':('💎','Основное','Чем выше число, тем реже встречается пал. 1–4 — обычные, 5–7 — редкие, 8+ — легендарные.'),'Размер':('📏','Основное',''),'Цена продажи':('💰','Основное','Сколько золота даст торговец за пала.'),'Коллаборация':('🤝','Основное',''),
 'Множитель поимки':('🎯','Бой','Насколько легче или труднее поймать: ×1 — обычно, меньше — сложнее.'),'Скорость рывка верхом':('🐎','Бой','Скорость, если сесть на пала и бежать рывком.'),
 'Сколько ест':('🍖','Ферма и еда','Сколько сытости пал тратит — чем больше, тем больше еды нужно на базе.')}
_SKIP={'Стихия','Слабость (кто бьёт сильнее)','HP / Атака / Защита (база вида)','Поле'}
_PBU={D+'/'+x['url'].rstrip('/')+'.md':x for x in SP if x['url']}
def _tiles(m,f):
  rows=[[c.strip() for c in l.strip().strip('|').split('|')] for l in m.group(0).strip().split('\n')[2:]]
  G={}
  for r in rows:
    if len(r)<2 or r[0] in _SKIP or r[1] in ('','—'):continue
    ic,g,h=_TI.get(r[0],('ℹ️','Основное',''));G.setdefault(g,[]).append((ic,r[0],r[1],h))
  px=_PBU.get(f)
  if px and px.get('rank'):G.setdefault('Разведение',[]).append(('🧬','Сила разведения',str(px['rank']),'Скрытое число игры: у детёныша оно примерно среднее от родителей. Чем меньше — тем «сильнее» пал.'))
  if px and px.get('up'):G.setdefault('Разведение',[]).append(('💞','Особая пара',' + '.join(px['up']),'Этого пала можно вывести только от этой пары.'))
  out=''
  for g in ('Основное','Бой','Ферма и еда','Разведение'):
    if g not in G:continue
    out+=f'<div class="itg"><div class="itg-h">{g}</div><div class="itiles">'+''.join(f'<div class="it"><span class="ii">{ic}</span><span class="il">{lb}{f" <button class=\"hlp\" data-tip=\"{h}\">?</button>" if h else ""}</span><b>{v}</b></div>' for ic,lb,v,h in G[g])+'</div></div>'
  return '\n<div class="infotiles" markdown="0">'+out+'</div>\n'
_TB=re.compile(r'(?m)^\| Поле \| Значение \|\n\|---\|---\|\n(?:\|.*\|\n?)+')
_HR=re.compile(r'\s*\((?:по внутренн[^)]*|\d+(?:\.\d+)*|v?\d[\d.]*\+?|(?=[^)А-Яа-яЁё]*[A-Za-z])[^)А-Яа-яЁё]+)\)')
for _f in _g.glob(D+'/**/*.md',recursive=True):
  _t0=open(_f).read();_t0b=_TB.sub(lambda m,_f=_f:_tiles(m,_f),_t0);_t1=re.sub(r'(?m)^(#{1,6} )(.+)$',lambda m:m.group(1)+_HR.sub('',m.group(2)).rstrip(),_t0b)
  if _t1!=_t0:open(_f,'w').write(_t1)
import time as _t;_v=str(int(_t.time()));open('/workspace/palsite/mkdocs.yml','w').write(re.sub(r'assets/(\w+)\.(js|css)',lambda m:"'"+m.group(0)+'?v='+_v+"'",open('/workspace/palsite/mkdocs.base.yml').read())+y)
