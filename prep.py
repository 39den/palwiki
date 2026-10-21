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
import os as _o2
if _o2.path.exists('/workspace/ux50/out/assets/ux50_data.json'):shutil.copy('/workspace/ux50/out/assets/ux50_data.json',A+'/ux50_data.json')
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
arts.update({os.path.basename(f)[:-4]:f for f in glob.glob('/workspace/palsite/art_fix/*.png')})  # background-removed fixes (rembg) for opaque source art
os.makedirs(D+'/img',exist_ok=True);os.makedirs(D+'/art',exist_ok=True)
pals=json.load(open(W+'/data/pals.json'))
for _p in pals:
  _sv=_p.get('strong_vs') or []
  if isinstance(_sv,str):_sv=[_sv]
  _p['strong_vs']=[y.strip() for x in _sv for y in re.split(r'[,;/]\s*|\s+и\s+',str(x)) if y.strip()]
def slug(s):return re.sub(r'[^a-z0-9]+','_',s.lower()).strip('_')
EL={'Нейтральный':'neutral','Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon'}
WI={'Разжигание огня':'🔥','Полив':'💧','Посев семян':'🌱','Генерация энергии':'⚡','Ручная работа':'🖐️','Сбор':'🌾','Рубка деревьев':'🪓','Добыча':'⛏️','Фармацевтика':'💊','Охлаждение':'❄️','Транспортировка':'📦','Фермерство':'🐑'}
ACT={'party':'🎒 Работает из команды','summoned':'🐾 Когда пал выпущен','mounted':'🐎 Верхом','active':'🔘 Включается кнопкой','base':'🏠 На базе'}
def chip(e):return f'<span class="el el-{EL.get(e,"neutral")}">{e}</span>'
from elmx import mult as _mxm
from elmx import matchup as _mx
for _p in pals:_p['weak_to']=[a for a,_ in _mx(_p['elements'])['w']];_p['_res']=_mx(_p['elements'])['r'];_p['_wm']=_mx(_p['elements'])['w']
_fm=lambda v:('×'+('%.2f'%v).rstrip('0').rstrip('.')).replace('.',',')
SP=[];n=0
_sp0=__import__('subprocess');_sp0.run(['python3','/workspace/palsite/work_page.py'],check=True)
AFD='/workspace/palsite/design2026/art_final';AF={x['id']:x for x in json.load(open(AFD+'/manifest.json'))['pals']}
os.makedirs(D+'/pp/art',exist_ok=True)
import subprocess as _sp,shutil as _sh
_sp.run(['python3','/workspace/palsite/habitat_build.py'],check=True);_sp.run(['python3','/workspace/palsite/tree_build.py'],check=True)
HAB=json.load(open('/workspace/palsite/hab_summary.json'))
for _d,_t in (('/workspace/palsite/hab',D+'/hab'),('/workspace/palsite/wtree',D+'/assets/wtree')):
  _sh.rmtree(_t,ignore_errors=True);_sh.copytree(_d,_t)
WSJ=json.load(open('/workspace/palwiki/data/work_suitability.json'))['work_types'];WSI={w['ru']:w for w in WSJ}
def _WTIP(p):
  els=p['elements'];base='Множители перемножаются по обеим стихиям: ×1,5 за стихию, которую атака бьёт, ×0,65 за ту, что её держит.'
  if len(els)<2:return base
  ex=[f'{e}: '+' × '.join(('1,5' if _mxm(e,[x])>1.05 else '0,65' if _mxm(e,[x])<0.95 else '1') for x in els)+f' = ×{_fm(_mxm(e,els))[1:]}' for e,v in p['_wm']]
  return base+(' '+'; '.join(ex)+'.' if ex else '')
def work_bars(lines,R):
  out=''
  for nm,lv in re.findall(r'- (.+?) — ур\. (\d+)',lines):
    w=WSI.get(nm.strip());lv=int(lv)
    href=f'{R}2_mehaniki/rabota/?w={w["id"]}&lv={lv}' if w else f'{R}2_mehaniki/rabota/'
    out+=f'<a class="wbar" href="{href}"><span>{w["emoji"] if w else "🛠"} {nm.strip()}</span><i style="--v:{min(lv,10)*10}%"></i><b>{lv}</b></a>'
  return f'<div class="wbars" markdown="0">{out}<a class="wb-more" href="{R}2_mehaniki/rabota/">Что значат уровни работы →</a></div>' if out else lines
def hab_block(p,R):
  import html as _h;esc_h=lambda x:_h.escape(str(x),quote=True)
  h=HAB.get(p['id']) or {};hb=p.get('habitat') or {}
  has=h.get('d') or h.get('n') or h.get('t') or h.get('a')
  chips_r=''.join(f'<span class="rgc">{esc_h(r)}</span>' for r in h.get('rg',[]))
  lv=f"ур. {h['lv'][0]}–{h['lv'][1]}" if h.get('lv') else ''
  dg=''.join(f'<div class="dgc"><span class="ish">🕳 Подземелье</span><b>{esc_h(x)}</b></div>' for x in h.get('dg',[]))
  eg=f'<div class="dgc"><span class="ish">🥚 Яйцо</span><b>{esc_h(h["egg"])}</b></div>' if h.get('egg') else ''
  mer='<div class="dgc"><span class="ish">🛒 Торговец</span><b>Продаётся у торговца палами</b></div>' if h.get('mer') else ''
  if has:
    top=f'<div class="habmap" data-pal="{p["id"]}" data-d="{h.get("d",0)}" data-n="{h.get("n",0)}" data-t="{h.get("t",0)}" data-a="{h.get("a",0)}"><div class="hm-bar"><div class="seg hm-tod"><button data-k="d" class="on">☀️ День</button><button data-k="n">🌙 Ночь</button></div>{"<div class=\"seg hm-w\"><button data-w=p class=on>Палпагос</button><button data-w=t>Мировое древо</button></div>" if h.get("t") and (h.get("d") or h.get("n")) else ""}</div><div class="hm-box"><img class="hm-img" alt="Карта обитания" loading="lazy" decoding="async" width="1024" height="1024" src="{R}assets/wtree/mini_{"palpagos" if (h.get("d") or h.get("n") or not h.get("t")) else "tree"}.webp"><div class="hm-dots"></div></div><div class="hm-foot"><span class="hm-c"></span>{f"<span class=lvc>{lv}</span>" if lv else ""}<a class="btn hm-full" href="{R}map/?pal={p["id"]}">Показать на большой карте</a></div></div>'
  else:
    top='<div class="nowild"><b>В дикой природе не встречается</b><span>Точек появления на открытой карте в данных игры нет'+(' — ищи в подземельях, яйцах или выводи разведением.' if (dg or eg) else ' — выводи разведением.')+'</span></div>'
  return f'<div class="hab" markdown="0">{top}{"<div class=rgcs>"+chips_r+"</div>" if chips_r else ""}{"<div class=dgcs>"+dg+eg+mer+"</div>" if (dg or eg or mer) else ""}</div>'

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
  _af=AF.get(p['id'])
  if _af:
    _k='-p' if _af['kind']!='render' else ''
    for _w in (256,384,512,768):
      _src=f'{AFD}/pal/{p["id"]}-{_w}.webp'
      if os.path.exists(_src):shutil.copy(_src,f'{D}/pp/art/{p["id"]}{_k}-{_w}.webp')
    icon=f'pp/art/{p["id"]}{_k}-256.webp';thumb=f'pp/art/{p["id"]}{_k}-512.webp'
    _set=lambda R:', '.join(f'{R}pp/art/{p["id"]}{_k}-{w}.webp {w}w' for w in (384,512,768))
  else:_set=None;_k=''
  ps=p.get('partner_skill') or {};acts=ps.get('activations') or []
  desc=(p.get('partner') or {}).get('desc','')
  mount='fly' if re.search('по воздуху|летат|полёт|полет',desc) else ('ride' if 'оседлать' in desc else '')
  if 'rideable' in p:mount=(mount or 'ride') if p['rideable'] else ''
  url=f'4_spravochniki/paly/{md}/' if md else ''
  if md:
    path=f"{D}/4_spravochniki/paly/{md}.md";L=open(path).read().split('\n',1)
    works=''.join(f'<span class="work" title="{w["work"]} {w["level"]}">{WI.get(w["work"],"•")} {w["work"]} <b>{w["level"]}</b></span>' for w in p['work'])
    head=f'''<div class="pal-hero" markdown="0" data-el="{EL.get((p['elements'] or ['Нейтральный'])[0],'neutral')}" style="--pc:var(--{EL.get((p['elements'] or ['Нейтральный'])[0],'neutral')})"><canvas id="fx"></canvas>
{(f'<img class="pal-card pal-art{" portrait" if _k else ""}" src="../../../{thumb}" srcset="{_set("../../../")}" sizes="(max-width:700px) 60vw, 420px" alt="{p['ru']}" width="512" height="512" fetchpriority="high" decoding="async">') if _set else f'<img class="pal-card" src="../../../{img}" alt="{p["ru"]}" loading="lazy" width="360">'}
<div class="pal-info"><div class="pal-no"><span class="nochip">№ {p["no"]}</span></div>
<div class="chips">{''.join(chip(e) for e in p['elements'])}</div>
{'' if not p['elements'] else '<div class="weak">Слабость: '+(''.join(chip(e).replace('</span>',' <b class="mx">'+_fm(v)+'</b></span>') for e,v in p['_wm']) or 'нет')+' <button class="hlp" data-tip="'+_WTIP(p)+'">?</button></div>'}
{('<div class="weak res">Устойчив: '+''.join(chip(e).replace('</span>',' <b class="mx">'+_fm(v)+'</b></span>') for e,v in p['_res'])+'</div>') if p['_res'] else ''}
<div class="works">{works}</div>
{(lambda _n:f'<div class="partner"><b>{_n}</b> '+''.join(f'<span class="actc">{ACT[x]}</span>' for x in acts if x in ACT)+'</div>' if _n.strip(' -—') else '')(ps.get('name',(p.get('partner') or {}).get('name','')) or '')}
<div class="stats">❤️ {p['stats']['hp']} · ⚔️ {p['stats']['attack']} · 🛡 {p['stats']['defense']}</div></div></div>
'''
    rest=L[1] if len(L)>1 else ''
    dsc=(p.get('partner') or {}).get('desc','');lv=re.findall(r'(?:^|\s)([1-5]) ([^()]+?) \((?:ToTrainer|ToSelf|ToOtomo)\)',dsc.split('Lv. Skill',1)[1]) if 'Lv. Skill' in dsc else []
    seen={};[seen.setdefault(a,b.strip()) for a,b in lv]
    if seen: rest=re.sub(r'(?m)^(## Партнёрский навык.*\n(?:.*\n)?)',lambda m:m.group(1)+'\n**По уровням навыка:** '+' · '.join(f'{k}★ {v}' for k,v in seen.items())+'\n',rest,1)
    _R='../../../'
    def _pro(p=p):
      w=max(p['work'],key=lambda w:w['level'],default=None)
      if w and w['level']>=3:return f'✅ хорош в работе: {w["work"]} (ур. {w["level"]})'
      if mount:return '✅ '+('летает — можно летать верхом' if mount=='fly' else 'можно ездить верхом')
      st=p['stats'];k=max(('attack','defense','hp'),key=lambda k:st.get(k) or 0)
      return '✅ '+{'attack':f'хорошая атака ({st["attack"]})','defense':f'крепкая защита ({st["defense"]})','hp':f'много здоровья ({st["hp"]})'}[k]
    rest=re.sub(r'(?m)^(\s*)- ✅\s*$',lambda m:m.group(1)+'- '+_pro(),rest)
    rest=re.sub(r'(?m)^(#{2,4}) (Работа на базе[^\n]*)\n\n?((?:- .*\n)+)',lambda m:m.group(1)+' '+m.group(2)+'\n\n'+work_bars(m.group(3),_R)+'\n',rest)
    rest,_k=re.subn(r'(?m)^(#{2,4}) (Где водится[^\n]*)\n\n?(?:- .*\n)+',lambda m:m.group(1)+' '+m.group(2)+'\n\n'+hab_block(p,_R)+'\n',rest)
    if not _k:rest+='\n## Где водится\n\n'+hab_block(p,_R)+'\n'
    open(path,'w').write('# '+p['ru']+'\n\n'+head+'\n'+rest);n+=1
  SP.append({'j':len(SP),'i':len(SP),'no':p['no'],'id':p['id'],'ru':p['ru'],'en':p['en'],'el':p['elements'],'weak':p['weak_to'],'res':[a for a,_ in p['_res']],'work':[[w['work'],w['level']] for w in p['work']],
    'act':acts,'mount':mount,'sprint':int(re.sub(r'\D','',str(p['stats'].get('mount_sprint') or 0)) or 0),'hp':p['stats']['hp'],'atk':p['stats']['attack'],'def':p['stats']['defense'],
    'rarity':int(p['rarity'] or 0),'url':url,'img':img,'thumb':icon,'art':thumb,'bp':{k:v for k,v in (p.get('best_passives') or {}).items() if k!='ездовой' or p.get('rideable',True)},'rank':int(p['breeding'].get('combi_rank') or 0),
    'up':p['breeding'].get('unique_parents'),'collab':bool(p.get('collab')),'psk':ps.get('name',''),'egg':(p.get('habitat') or {}).get('egg',''),'hab':HAB.get(p['id'])})
print('pal headers',n)

# ---------- clean reader-facing text
UNV=''  # no reader-facing 'unverified' markers
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
  t=re.sub(r'[^.;!?\n]*\[(?:проверить|проверь) точн[^\]]*\][.;]?[ \t]*','',t)  # label whose value is unknown -> drop whole phrase
  t=re.sub(r'\s*\[(проверить|патч|проверь)[^\]]*\]','',t)
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
for _b in bosses:
  _e=_b.get('elements') or []
  if any('Нет стихии' in str(x) for x in _e):_b['elements']=[];_b['no_el']=True
  _b['weak_to']=[x for x in (_b.get('weak_to') or []) if not str(x).startswith('—')]
for b in bosses:
  team=[t['pal'] for t in ((b.get('recommended_team') or {}).get('main') or [])][:4] or b.get('team',[])[:4]
  SB.append({'name':b['name'],'kind':b['kind'],'pal':b.get('pal',''),'place':b.get('place',''),'level':b.get('level'),'hp':b.get('hp'),'el':b.get('elements',[]),'weak':[a for a,_ in _mx(b.get('elements') or [])['w']] if b.get('elements') else b.get('weak_to',[]),'team':team,'tactics':b.get('tactics',''),'url':link(b['name'])})
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

<div class="psv-hero" markdown="0"><span class="psv {rcls(rk)} big">{q['name']}</span> <span class="rk">Ранг {rk} · {RANKTXT.get(rk,'')} <button class="hlp" data-tip="Ранг — насколько сильна пассивка: от −3 (вредная) до 4 (легендарная). Чем выше, тем реже встречается.">?</button></span></div>

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
    rows=''.join(f'<div class="dr {_rarity_cls(a_en)}"><span>{esc_h(a)}</span><b>{str(round(float(str(r).rstrip("%")),2)).replace(".",",")}%</b></div>' for (a,r),a_en in zip(q['drops'][:3],[d.get('from','') for d in (PSRC.get(q['name'],{}).get('surgery') or {}).get('drops',[])][:3]))
    how.append(('im','💉','имплант · расходуется',f'Падает из Древних реликвий:<div class="dch">{rows}</div>'))
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
  if a.get('xy') and a.get('region')!='WIP' and not wt(*a['xy']):MP.append({'t':'travel','name':a.get('name_ru') or a['name_en'],'x':a['xy'][0],'y':a['xy'][1],'info':'Телепорт','url':''})
for a in L.get('towers',[]):
  if a.get('x') is not None:
    bu=next((b['url'] for b in SB if b['place']==a['name'] and b['url']),'')
    bl=next((b['level'] for b in SB if b['place']==a['name']),'')
    MP.append({'t':'tower','name':a['name'],'x':a['x'],'y':a['y'],'lvl':bl,'info':'Башня','url':bu})
for a in L.get('sealed_realms',[]):
  if a.get('xy') and not wt(*a['xy']):MP.append({'t':'sealed','name':a.get('name_ru') or a['name_en'],'x':a['xy'][0],'y':a['xy'][1],'lvl':a.get('level',''),'info':'Запечатанные земли · '+a.get('pal',''),'url':PU.get(a.get('pal',''),'')})
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
  m=re.match(r'^(\s*(?:[-*]\s+)?[^:|*]{0,12}(?:\*\*[^*]+?:\*\*|\*\*[^*]+\*\*:|[^:|*]{1,60}:)\s*)(.+)$',line)
  if not m or '|' in line:return line
  parts=[re.sub(r'\(([A-Za-z][A-Za-z \'-]*)(?:,\s*|\s*/\s*|\))',lambda mm:'(' if not mm.group(0).endswith(')') else '',x.strip()).replace('()','').strip() for x in re.split(r',\s*(?![^()]*\))',m.group(2)) if x.strip()]
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
<div class="hero" markdown="0"><div class="hero-in">
<h1>Энциклопедия Palworld</h1><p>Всё о Palworld на русском: уровни 0–80, {len(SP)} палов, {len(SI)} предметов, боссы, пассивки, разведение и секреты.</p>
<div class="smart-box"><input id="home-q" type="search" placeholder="Кто лучше копает?" autocomplete="off"></div>
<div id="home-answer" class="smart-out"></div></div></div>
<div class="tiles bento" markdown="0">
{T('gallery/','🐾','Палы','галерея с фильтрами')}{T('compare/','⚖️','Сравнить','двух палов рядом')}{T('boss/','👑','Боссы','башни, рейды, альфы')}{T('guide/03_prohozhdenie_1_80/','🗺️','Прохождение','с 1 до 80 уровня')}{T('2_mehaniki/passivki/','✨','Пассивки','лучшие наборы')}{T('guide/sekrety/','🤫','Секреты','пасхалки и тайники')}{T('map/','📍','Карта','альфы, башни, телепорты')}{T('4_spravochniki/predmety/','🎒','Предметы','где взять и крафт')}{T('breed/','🧬','Разведение','калькулятор пар')}{T('guide/eda/','🍲','Еда и баффы','блюда, баффы, кухни')}{T('my/','⭐','Мои списки','команда и фарм')}{T('https://t.me/PalGuideBot','🤖','Бот @PalGuideBot','спроси в Telegram')}
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
open(D+'/map.md','w').write('---\nhide: [toc]\nleaflet: true\n---\n# 📍 Карта\n<div class="mapsw seg" markdown="0"><button class="on" data-w="p">Палпагос</button><button data-w="t">Мировое древо</button></div>\n<div class="msq" markdown="0"><input id="mapq" name="palmap-q" type="search" placeholder="Пал, босс, телепорт" autocorrect="off" autocapitalize="off" spellcheck="false" autocomplete="off" enterkeyhint="search"><button class="msx" aria-label="Очистить" hidden>×</button><span class="mcnt" hidden></span><div class="msd" hidden></div></div>\n<div id="wtree" hidden markdown="0"></div>\n<div id="pwmap" markdown="0"></div>\n<p class="map-note">Статуэтки Лифмунка и входы в подземелья меняют место, поэтому их нет на карте. Мировое Древо — отдельная карта.</p>\n')
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
def _drop(L,f):
  out=[]
  for x in L:
    if isinstance(x,dict):
      k,v=next(iter(x.items()))
      if isinstance(v,list):out.append({k:_drop(v,f)})
      elif v!=f:out.append(x)
    elif x!=f:out.append(x)
  return out
spr=_drop(spr,'4_spravochniki/bossy.md')
open(D+'/4_spravochniki/bossy.md','w').write('---\nhide: [toc, navigation]\nsearch:\n  exclude: true\n---\n# Боссы\n\n<meta http-equiv="refresh" content="0; url=../../boss/">\n<script>location.replace("../../boss/")</script>\n\n<a class="md-button md-button--primary" href="../../boss/">Открыть карточки боссов →</a>\n')
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
  if k not in BG:BG[k]={'no_el':b.get('no_el',False),'name':_base(b['name']),'kind':b['kind'],'pal':b['pal'],'place':b.get('place') or '','coords':b.get('coords'),'el':b.get('elements',[]),'weak':[a for a,_ in _mx(b.get('elements') or [])['w']] if b.get('elements') else b.get('weak_to',[]),'team':[t['pal'] for t in ((b.get('recommended_team') or {}).get('main') or [])],'tactics':b.get('tactics') or '','modes':[]};BORD.append(k)
  BG[k]['modes'].append({'m':_mode(b['name']),'lvl':b.get('level'),'hp':b.get('hp'),'loot':b.get('loot') or ''})
for a in L.get('alphas',[]):
  if a['pal'] in BG:continue
  p=PBR.get(a['pal'])
  if not p:continue
  BG[a['pal']]={'name':a['pal'],'kind':'альфа','pal':a['pal'],'place':'','coords':a.get('xy') and f"{a['xy'][0]}, {a['xy'][1]}",'el':p['el'],'weak':p['weak'],'team':[],'tactics':'','modes':[{'m':'альфа','lvl':a.get('level'),'hp':None,'loot':''}]};BORD.append(a['pal'])
KT={'башня':'🏯 Башня','рейд':'⚔️ Рейд','босс':'🌊 Мировой босс','мини-босс Мирового Древа':'🌳 Мировое древо','альфа':'👑 Альфа'}
_KEYS=[(r'кувырок \(Ctrl\)','уклоняйся кувырком (на ПК <kbd>Ctrl</kbd>)'),(r'средняя кнопка мыши — приказ атаковать','отдавай палу приказ атаковать цель (на ПК <kbd>СКМ</kbd>)')]
def _cl(t):
  t=clean(str(t)) if t else '';t=re.sub(r'\[[^\]]*(провер|патч)[^\]]*\]','',t).strip(' ;,.')
  return t
def _keys(t):
  for a,b in _KEYS:t=re.sub(a,b,t)
  return t
BJS=[]
for k in BORD:
  g=BG[k];sl=slug(PBR[g['pal']]['en'] if g['pal'] in PBR else g['name']) or ('boss_'+str(len(BJS)));
  if g['kind']=='альфа':sl='alpha_'+sl
  g['url']='boss/'+sl+'/';p=PBR.get(g['pal']);R='../../'
  img=(f'<img class="bimg" src="{R}{p["art"]}" srcset="{R}{p["art"].replace("-512.","-384.")} 384w, {R}{p["art"]} 512w, {R}{p["art"].replace("-512.","-768.")} 768w" sizes="(max-width:700px) 70vw, 360px" alt="{p["ru"]}" width="512" height="512" decoding="async" fetchpriority="high">' if p.get("art","").startswith("pp/art/") else f'<img class="bimg" src="{R}{p.get("art") or p["thumb"]}" alt="" width="260" height="260">') if p else f'<div class="bimg bph" aria-hidden="true">{KT.get(g["kind"],"👑")[:2]}</div>'
  from elmx import mult as _mult
  _em=lambda c:max([_mult(e,g['el']) for e in c['el']] or [1])
  ctr=[x for x in SP if x['url'] and _em(x)>1.05];ctr.sort(key=lambda x:(-_em(x),-(x['ru'] in g['team']),-x['atk']));ctr=ctr[:8]
  q=g['place'] or g['pal'];maplink=f'<a class="md-button" href="{R}map/?q={q}">📍 На карте</a>' if g['coords'] else ''
  MN={'обычный':'Обычный','сложный':'Сложный','ультра':'Ультра','мастер':'Мастер','альфа':'Альфа'}
  seg='';pan=''
  for mi,m in enumerate(g['modes']):
    rows=[('⭐','Уровень',m['lvl']),('❤️','Здоровье',f"{m['hp']:,}".replace(',',' ') if isinstance(m['hp'],int) else None)]
    lt=_cl(m['loot'])
    tl=''.join(f'<div class="it"><span class="ii">{a}</span><span class="il">{b}</span><b>{v}</b></div>' for a,b,v in rows if v not in (None,'',0))
    rid=f'bm{mi}'
    seg+=f'<input type="radio" name="bmode" id="{rid}" {"checked" if mi==0 else ""}><label for="{rid}">{MN.get(m["m"],m["m"].capitalize())}</label>'
    pan+=f'<div class="bmp">{"<div class=itiles>"+tl+"</div>" if tl else ""}'+(f'<div class="brw"><span class="ish">🎁 Награда</span> {esc_h(lt)}</div>' if lt else '')+'</div>'
  tabs=f'<div class="bmodes n{len(g["modes"])}">{seg}{pan}</div>' if g['modes'] else ''
  leader=''
  if g['kind']=='башня' and ' и ' in g['name']:
    ld=g['name'].split(' и ')[0].strip()
    if ld and ld!=g['pal']:leader=f'<span class="leader" title="Лидер башни">🎖 {esc_h(ld)} <small>лидер башни</small></span>'
  cn=''.join(f'<a class="ctr card-link" href="{R}{c["url"]}#bld"><img src="{R}{c["thumb"]}" width="96" height="96" alt="" loading="lazy" decoding="async"><b>{c["ru"]}</b><span class="ctr-el">{"".join(chip(e) for e in c["el"])}</span><span class="ctr-x">{_fm(_em(c))}</span></a>' for c in ctr)
  tac=_cl(g['tactics'])
  md=f'''---
hide: [toc]
---
# {g['name']}

<div class="boss-hero" data-el="{EL.get((g['el'] or ['Нейтральный'])[0],'neutral')}" markdown="0">{img}<div class="bi"><span class="kind">{KT.get(g['kind'],g['kind'])} <button class="hlp" data-h="boss">?</button></span><h2>{g['pal']}</h2>{leader}{(f'<div class="bel"><span class="il">Стихия</span>'+''.join(chip(e) for e in g['el'])+'</div><div class="wk"><span class="il">Слабость</span>'+(''.join(chip(e).replace('</span>',' <b class="mx">'+_fm(v)+'</b></span>') for e,v in _mx(g['el'])['w']) or 'нет')+'</div>') if g['el'] else ('<div class="bel"><span class="el el-neutral">Без стихии</span> <span class="il">бей чем угодно — все стихии одинаково</span></div>' if g.get('no_el') else '')}{f'<div class="pl">📍 {g["place"]}'+(f' <small>({g["coords"]})</small>' if g.get('coords') else '')+'</div>' if g['place'] else ''}{tabs}<div class="bb">{maplink}{f'<a class="md-button" href="{R}{p["url"]}">Страница пала</a>' if p and p['url'] else ''}</div></div></div>

'''+(f'''## 💥 Кем бить <button class="hlp" data-tip="Палы, которые бьют по слабости босса, — сверху самые эффективные (×1,5 и выше). Нажми на пала — откроется его сборка: там видно, сколько ударов нужно против этого босса.">?</button>

<div class="ctrs" markdown="0">{cn}</div>
''' if cn else '')+(('\n## 🧠 Тактика\n\n<div class="tips" markdown="0">'+''.join(f'<div class="tip"><span>💡</span>{_keys(esc_h(x.strip()))}</div>' for x in re.split(r'(?<=[.!?])\s+',tac) if len(x.strip())>3)[:8000]+'</div>\n') if tac else '')
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

<div class="gal-filters" id="bfl" markdown="0"><input id="bq2" type="text" placeholder="Найти босса…"><select id="bk" hidden><option value="">Все типы</option>'''+''.join(f'<option value="{k}">{v}</option>' for k,v in KT.items())+'''</select><select id="be" hidden><option value="">Стихия</option>'''+''.join(f'<option>{e}</option>' for e in EL)+'''</select><select id="bl" hidden><option value="">Уровень</option><option value="0-30">до 30</option><option value="31-60">31–60</option><option value="61-200">61+</option></select><div class="fcs" data-s="bk"><span class="il">Тип</span><button type="button" class="fc on" data-v="">Все</button>'''+''.join(f'<button type="button" class="fc" data-v="{k}">{v}</button>' for k,v in KT.items())+'''</div><div class="fcs" data-s="be"><span class="il">Стихия</span><button type="button" class="fc on" data-v="">Любая</button>'''+''.join(f'<button type="button" class="fc" data-v="{e}">{chip(e)}</button>' for e in EL)+'''</div><div class="fcs" data-s="bl"><span class="il">Уровень</span><button type="button" class="fc on" data-v="">Любой</button><button type="button" class="fc" data-v="0-30">до 30</button><button type="button" class="fc" data-v="31-60">31–60</button><button type="button" class="fc" data-v="61-200">61+</button></div><span id="bcnt" class="bcnt"></span></div>
<div class="bgal" markdown="0">'''+''.join(f'<a class="pc bc" href="../{b["u"]}" data-k="{b["k"]}" data-el="{" ".join(b["el"])}" data-lv="{max(_lv(x) for x in b["lv"])}" data-n="{b["n"].lower()} {b["pal"].lower()}">{f'<img src="../{b["t"]}" width="96" height="96" alt="" loading="lazy" decoding="async">' if b["t"] else '<span class="bph" aria-hidden="true">'+KT.get(b["k"],"👑")[:2]+'</span>'}<b>{b["n"]}</b><small>{KT.get(b["k"],"")} · ур. {" / ".join(str(x) for x in b["lv"] if x)}</small><span>{"".join(chip(e) for e in b["el"]) or '<span class="el el-neutral">Без стихии</span>'}</span></a>' for b in BJS)+'</div>\n')
for x in SB:
  g=BG.get(x['pal'] if x['kind']=='рейд' else _base(x['name']))
  if g:x['url']=g['url']
import skills_page as _skp
_md,_sks=_skp.build(None,SP,SI,chip,R='../../');open(D+'/2_mehaniki/aktivki.md','w').write(_md)
_sd=json.load(open(A+'/search_data.json'));_sd['bosses']=SB;_sd['bcards']=BJS;_sd['items']=_sd['items']+_sks;json.dump(_sd,open(A+'/search_data.json','w'),ensure_ascii=False,separators=(',',':'))

# ---- item pages: tile grid + expandable cards (item_pages.py) ----
import item_pages as _ipg
_IPAGES,_ILINT,_IFX,_IICO=_ipg.build(items,_PTH,D+'/4_spravochniki/predmety/',D,json.load(open(AFD+'/manifest.json')).get('items'),'guide/09_baza/',AF_struct=json.load(open(AFD+'/manifest.json')).get('structures'))
if os.environ.get('ITEMS26')!='1':
  from ru_text import num as _ru_num
  # ---- item pages as cards ----
  _RAR=['Обычный','Необычный','Редкий','Эпический','Легендарный']
  _items_by={}
  for _i in items:_items_by.setdefault(_i.get('type') or 'Прочее',[]).append(_i)
  _PDIR=D+'/4_spravochniki/predmety/'
  _ILINK={x['ru']:x for x in items}
  for _ty,_lst in _items_by.items():
    _fn=_PDIR+_ty.lower().replace(' ','_')+'.md'
    if not os.path.exists(_fn):continue
    out=[f'---\nhide: [toc]\n---\n# {_ty}\n\n<div class="pfl ifl" markdown="0"><input type="search" class="pfq" placeholder="Найти в разделе «{esc_h(_ty)}»…" autocomplete="off"><span class="gcount pfn"></span></div>\n']
    for i in sorted(_lst,key=lambda z:z['ru']):
      r=int(i.get('rarity') or 0);tiles=[('💎','Редкость',_RAR[min(r,4)]),('⚖️','Вес',_ru_num(i.get('weight'))),('💰','Цена',i.get('price'))]
      if i.get('tech_level'):tiles.append(('📘','Технология',f"ур. {i['tech_level']}"))
      tl=''.join(f'<div class="it"><span class="ii">{a}</span><span class="il">{b}</span><b>{esc_h(c)}</b></div>' for a,b,c in tiles if c not in (None,'','0'))
      rec=''.join(f'<span class="ichip">{esc_h(x["item"])} <b>×{esc_h(x["qty"])}</b></span>' for x in (i.get('recipe') or []))
      src=[];seen=set()
      for x in (i.get('sources') or []):
        l=x.get('label') or x.get('source') or '';k=(l,x.get('qty'))
        if not l or k in seen or re.search(r'[A-Za-z]{3,}_',l):continue
        seen.add(k);src.append(f'<span class="ichip src">📦 {esc_h(l)} <small>{esc_h(x.get("qty",""))} · {esc_h(x.get("chance",""))}</small></span>')
      seen=set()
      for x in (i.get('from_npc') or []):
        if x['who'] in seen:continue
        seen.add(x['who']);src.append(f'<span class="ichip src">👤 {esc_h(x["who"])} <small>{esc_h(x.get("chance",""))}</small></span>')
      for x in (i.get('from_pals') or [])[:12]:
        n=x.get('pal') if isinstance(x,dict) else x;pp=_PTH.get(n)
        src.append(f'<a class="ichip src" href="../../../{pp["url"]}"><img src="../../../{pp["thumb"]}" width="20" height="20" alt="">{esc_h(n)}</a>' if pp else f'<span class="ichip src">🐾 {esc_h(n)}</span>')
      if i.get('merchant'):src.append('<span class="ichip src">🛒 торговец</span>')
      desc=esc_h(_IFX.fix((i.get('desc') or '').replace('\n',' ')))
      out.append(f'## {i["ru"]}\n\n<div class="icard r{min(r,4)}" data-n="{esc_h((i["ru"]+" "+i.get("en","")).lower())}" markdown="0"><p class="idesc">{desc}</p><div class="itiles">{tl}</div>'+(f'<div class="isec"><span class="ish">🔨 Крафт</span><div class="ichips">{rec}</div>'+(f'<small class="ist">{esc_h(i["station"])}</small>' if i.get('station') else '')+'</div>' if rec else '')+(f'<div class="isec"><span class="ish">📍 Где взять</span><div class="ichips">{"".join(src[:24])}</div></div>' if src else '')+'</div>\n')
    open(_fn,'w').write('\n'.join(out))
print('item pages',sum(_IPAGES.values()),'icons',len(_IICO),'grammar hits',len(_ILINT))
json.dump(_ILINT,open('/workspace/palsite/grammar_hits.json','w'),ensure_ascii=False)
_sd=json.load(open(A+'/search_data.json'))
for _x in _sd['items']:
  if _x.get('desc'):_x['desc']=_IFX.fix(_x['desc'].replace('\n',' '))
  if _x.get('ru') in _IICO:_x['icon']='pp/items/'+_IICO[_x['ru']]+'-96.webp'
json.dump(_sd,open(A+'/search_data.json','w'),ensure_ascii=False,separators=(',',':'))

# ---- food page as dish cards ----
_ef=D+'/guide/eda.md'
if os.path.exists(_ef):
  _src=open(_ef).read();_dishes=[]
  _EFX=[('особое',r'взрыв|отбрас|иммун|устойчив','💥'),('атака',r'Атака','⚔️'),('защита',r'Защита','🛡'),('работа',r'Скорость работы','🛠'),('опыт',r'Опыт','✨'),('голод',r'голод','🍖'),('рассудок',r'Рассудок','🧠')]
  _KIT=['Костер','Костёр','Котелок','Электрическая кухня','Большая кухня','Древняя кухня']
  for m in re.finditer(r'(?m)^- \*\*(.+?)\*\*: (.+)$',_src):
    nm,rest=m.groups();parts=[x.strip() for x in rest.split(';')]
    buffs=[];full=dur='';kit=[]
    for x in parts:
      if x.startswith('сытость'):full=x.split()[-1]
      elif re.match(r'^\d+\s*(мин|сек|ч)',x):dur=x
      elif x.startswith('где готовить'):kit=[k.strip() for k in x.split(':',1)[1].split(',') if k.strip() not in ('','—','-')]
      else:
        for b in x.split(','):
          b=b.strip();mm=re.search(r'([+-]+)\s*(\d+)\s*%',b)
          if not mm:continue
          v=int(mm.group(2));neg='-' in mm.group(1)
          ef=next((e for e,rx,_ in _EFX if re.search(rx,b,re.I)),'прочее')
          if ef=='голод':lab='Голод быстрее' if neg else 'Голод медленнее'
          elif ef=='рассудок':lab='Рассудок падает быстрее' if neg else 'Рассудок падает медленнее'
          else:lab=re.sub(r'\s*[+-]+\s*\d+\s*%','',b)
          buffs.append((ef,lab,v,neg))
    _dishes.append(dict(n=nm,b=buffs,f=int(full or 0),d=dur,k=kit))
  _KI={k:i for i,k in enumerate(_KIT)}
  os.makedirs(D+'/food',exist_ok=True);_FIMG={}
  for _f in json.load(open(W+'/data/food.json')) if os.path.exists(W+'/data/food.json') else []:
    _sp='/workspace/palsite/foodimg/'+_f['slug']+'.webp'
    _af=f'/workspace/palsite/design2026/art_final/food/{_f["slug"]}-96.webp'
    if os.path.exists(_af):
      _sn=re.sub(r'[^A-Za-z0-9_]','_',_f['slug'])
      for _w in (96,128,192):shutil.copy(f'/workspace/palsite/design2026/art_final/food/{_f["slug"]}-{_w}.webp',f'{D}/food/{_sn}-{_w}.webp')
      _FIMG[_f['ru']]=_sn+'-96.webp'
    elif os.path.exists(_sp):_sn=re.sub(r'[^A-Za-z0-9_]','_',_f['slug'])+'.webp';shutil.copy(_sp,D+'/food/'+_sn);_FIMG[_f['ru']]=_sn
  def _card(d):
    low=min((_KI.get(k,9) for k in d['k']),default=9)
    bc=''.join(f'<span class="fb fb-{"neg" if ng else ef}">{"🔻" if ng else next((i for e,_,i in _EFX if e==ef),"•")} {esc_h(lb)}{"" if ef=="особое" and v<=1 else f' <b>{"" if ng else "+"}{v}%</b>'}</span>' for ef,lb,v,ng in d['b'])
    kc=''.join(f'<span class="fk{" low" if _KI.get(k,9)==low else ""}">{esc_h(k)}</span>' for k in d['k']) or '<span class="fk none">не готовится — только найти</span>'
    st=sum(v*(-1 if ng else 1) for ef,_,v,ng in d['b'] if ef!='особое')
    efs=' '.join(sorted({ef for ef,_,_,ng in d['b'] if not ng}))
    ic=next((i for e,_,i in _EFX if d['b'] and e==d['b'][0][0]),'🍽')
    return f'<div class="fcard" data-n="{esc_h(d["n"].lower())}" data-e="{efs}" data-s="{st}" data-f="{d["f"]}"><div class="fh">{f'<img class="fimg" src="../../food/{_FIMG[d["n"]]}"{f' srcset="../../food/{_FIMG[d["n"]]} 1x, ../../food/{_FIMG[d["n"]].replace("-96.","-192.")} 2x"' if _FIMG[d["n"]].endswith("-96.webp") else ""} width="48" height="48" alt="" loading="lazy" decoding="async">' if d["n"] in _FIMG else f'<span class="fic">{ic}</span>'}<b>{esc_h(d["n"])}</b></div><div class="fbs">{bc or "<span class=fk>без баффа</span>"}</div><div class="itiles"><div class="it"><span class="ii">🍖</span><span class="il">Сытость</span><b>{d["f"]}</b></div><div class="it"><span class="ii">⏱</span><span class="il">Длительность</span><b>{esc_h(d["d"] or "—")}</b></div></div><div class="fks">{kc}</div></div>'
  _IREC={x['ru']:x for x in items}
  _KEN={'Костер':'campfire','Костёр':'campfire','Котелок':'cooking-pot','Электрическая кухня':'electric-kitchen','Древняя кухня':'ancient-kitchen'}
  for _k,_sid in _KEN.items():
    for _w in (64,96):
      _sp=f'{AFD}/structure/{_sid}-{_w}.webp'
      if os.path.exists(_sp):os.makedirs(D+'/pp/struct',exist_ok=True);shutil.copy(_sp,f'{D}/pp/struct/{_sid}-{_w}.webp')
  def _card2(d):
    ks=sorted(d['k'],key=lambda k:_KI.get(k,9));kc=''
    if ks:
      k0=ks[0];sid=_KEN.get(k0);ki=f'<img src="../../pp/struct/{sid}-64.webp" width="24" height="24" alt="" loading="lazy">' if sid and os.path.exists(f'{D}/pp/struct/{sid}-64.webp') else '<span class="fki" aria-hidden="true">🍳</span>'
      kc=f'<span class="fk1">{ki}<span>{esc_h(k0)}{" и выше" if len(ks)>1 else ""}</span></span>'
    else:kc='<span class="fk1 none"><span class="fki" aria-hidden="true">🔎</span><span>Не готовится — только найти</span></span>'
    bc=''.join(f'<span class="fb fb-{"neg" if ng else ef}">{"🔻" if ng else next((i for e,_,i in _EFX if e==ef),"•")} {esc_h(lb)}{"" if ef=="особое" and v<=1 else f' <b>{"" if ng else "+"}{v}%</b>'}</span>' for ef,lb,v,ng in d['b'])
    st=sum(v*(-1 if ng else 1) for ef,_,v,ng in d['b'] if ef!='особое')
    efs=' '.join(sorted({ef for ef,_,_,ng in d['b'] if not ng}))
    ic=next((i for e,_,i in _EFX if d['b'] and e==d['b'][0][0]),'🍽')
    fi=_FIMG.get(d['n'])
    img=(f'<img class="fimg" src="../../food/{fi.replace("-96.","-192.")}" srcset="../../food/{fi} 96w, ../../food/{fi.replace("-96.","-192.")} 192w" sizes="72px" width="72" height="72" alt="" loading="lazy" decoding="async">' if fi and fi.endswith('-96.webp') else f'<img class="fimg" src="../../food/{fi}" width="72" height="72" alt="" loading="lazy">' if fi else f'<span class="fic">{ic}</span>')
    rec=(_IREC.get(d['n']) or {}).get('recipe') or []
    ing=''
    for n,x in enumerate(rec):
      nm=x['item'];it=_IREC.get(nm);ico=_IICO.get(nm)
      im=f'<img src="../../pp/items/{ico}-96.webp" width="30" height="30" alt="" loading="lazy">' if ico else '<span class="fgi" aria-hidden="true">🥕</span>'
      body=f'{im}<b>×{esc_h(x["qty"])}</b>'
      href=f'../../4_spravochniki/predmety/{(it.get("type") or "Прочее").lower().replace(" ","_")}/#{_ipg.SLUG(nm,"-")}' if it else ''
      ing+=(f'<a class="fg" href="{href}" title="{esc_h(nm)}" aria-label="{esc_h(nm)} ×{esc_h(x["qty"])}"{" data-more=1" if n>=4 else ""}>{body}</a>' if href else f'<span class="fg" title="{esc_h(nm)}"{" data-more=1" if n>=4 else ""}>{body}</span>')
    if len(rec)>4:ing+=f'<span class="fg more">+{len(rec)-4}</span>'
    t1=f'<div class="ft1"><div><span class="ii">🍖</span><span class="il">Сытость</span><b>{d["f"]}</b></div><div><span class="ii">⏱</span><span class="il">Действует</span><b>{esc_h(d["d"] or "—")}</b></div></div>'
    t2=f'<div class="ft2"><span class="il">Из чего</span><div class="fgs">{ing}</div></div>' if ing else '<div class="ft2"><span class="il">Из чего</span><span class="fnone">рецепта нет</span></div>'
    return f'<div class="fcard f2" data-n="{esc_h(d["n"].lower())}" data-e="{efs}" data-s="{st}" data-f="{d["f"]}"><div class="fh">{img}<b>{esc_h(d["n"])}</b></div><div class="fbs">{bc or "<span class=fk>без баффа</span>"}</div><div class="ftl">{t1}{t2}</div><div class="fks">{kc}</div></div>'
  if os.environ.get('ITEMS26')=='1':_card=_card2
  def _best(pred,key):
    c=[d for d in _dishes if pred(d)];c.sort(key=key,reverse=True);return c[:3]
  _cmb=lambda d:sum(v for ef,_,v,ng in d['b'] if ef in('атака','защита') and not ng)
  _bas=lambda d:sum(v for ef,_,v,ng in d['b'] if ef in('работа','рассудок','голод') and not ng)
  _top=[('⚔️ Лучшее для боя',_best(lambda d:_cmb(d)>0,_cmb)),('🏠 Для базы',_best(lambda d:_bas(d)>0,lambda d:(_bas(d),d['f']))),('🍲 На старте (Котелок)',_best(lambda d:'Котелок' in d['k'] and d['b'],lambda d:(sum(v for ef,_,v,ng in d['b'] if not ng and ef!='особое'),d['f'])))]
  tb='<div class="ftop">'+''.join(f'<div class="ftb"><div class="itg-h">{t}</div>'+''.join(f'<div class="ftr"><b>{esc_h(d["n"])}</b><small>{esc_h(", ".join(lb if ef=="особое" and v<=1 else ("−" if ng else "+")+str(v)+"% "+lb for ef,lb,v,ng in d["b"]))}</small></div>' for d in L)+'</div>' for t,L in _top)+'</div>'
  fl='<div class="ffl"><input type="search" class="ffq" placeholder="Найти блюдо…" autocomplete="off"><select class="ffs" aria-label="Сортировка"><option value="s">По силе баффа</option><option value="f">По сытости</option><option value="n">По названию</option></select></div><div class="ffc">'+'<button type="button" class="fc on" data-e="">Все</button>'+''.join(f'<button type="button" class="fc" data-e="{e}">{i} { {"работа":"Скорость работы","особое":"Особые"}.get(e,e.capitalize())}</button>' for e,_,i in _EFX)+'<span class="gcount ffn"></span></div>'
  rest=_src[_src.find('\n## ',_src.find('- **')):] if '\n## ' in _src[_src.find('- **'):] else ''
  open(_ef,'w').write('---\nhide: [toc]\n---\n# Еда и баффы\n\n<div class="food" markdown="0"><p class="fnote">ℹ️ Бафф держится указанное время после еды. Сытость — сколько голода закрывает блюдо.</p>'+tb+fl+'<div class="fgrid">'+''.join(_card(d) for d in _dishes)+'</div></div>\n')

# ---- long 'label: value' bullet runs on guide pages -> card grid ----
_LVL=re.compile(r'^\s*[-*]\s+(?:\*\*([^*]{1,60})\*\*|([^:*]{1,40})):\s*(\S.*)$')
_md=lambda s:re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',re.sub(r'\[([^\]]+)\]\(([^)]+)\)',lambda m:f'<a href="{m.group(2).replace(".md","/") if not m.group(2).startswith("http") else m.group(2)}">{m.group(1)}</a>',esc_h(s).replace('&quot;','"')))
def _lvgrid():
  for _gf in glob.glob(D+'/guide/*.md'):
    L=open(_gf).read().split('\n');out=[];i=0;ch=False
    while i<len(L):
      j=i
      while j<len(L) and _LVL.match(L[j]):j+=1
      if j-i>8:
        cards=''.join(f'<div class="lvc"><b>{esc_h((m.group(1) or m.group(2)).strip())}</b><span>{_md(m.group(3))}</span></div>' for m in map(_LVL.match,L[i:j]))
        out.append('<div class="lvgrid" markdown="0">'+cards+'</div>');i=j;ch=True
      else:out.append(L[i]);i+=1
    if ch:open(_gf,'w').write('\n'.join(out))
  
_lvgrid()

nav=[{'🏠 Главная':'index.md'},
 {'🐾 Палы':[{'Галерея и фильтры':'gallery.md'},{'По стихиям и работе':'4_spravochniki/paly_po_stihiyam_i_rabote.md'},{'Сравнить двух':'compare.md'},{'Калькулятор разведения':'breed.md'},{'Мои списки':'my.md'}]},
 {'🧭 Гайд':sec('guide')+sec('0_nachni_zdes')+sec('1_prohozhdenie')},
 {'📚 Справочник':[{'Все пассивки':'passivki/index.md'}]+spr+sec('2_mehaniki')+sec('3_bazy')+sec('5_lut_i_farm')},
 {'👑 Боссы':'boss/index.md'},
 {'🗺️ Мир и карта':[{'Интерактивная карта':'map.md'},{'Мировое древо':'https://39den.github.io/palwiki/map/#tree'}]+mir+sec('6_mir')+sec('7_server')},
 {'❓ FAQ':sec('9_faq')+sec('8_slovar')+sec('10_bagi')},
 {'🤖 Бот':'bot.md'}]
nav=_drop(nav,'guide/10_bossy.md')
open(D+'/guide/10_bossy.md','w').write('---\nhide: [toc, navigation]\nsearch:\n  exclude: true\n---\n# Боссы\n\n<meta http-equiv="refresh" content="0; url=../../boss/">\n<script>location.replace("../../boss/")</script>\n\n<a class="md-button" href="../../boss/">Все боссы →</a>\n')
_seen=set()
def _dedup(L):
  out=[]
  for x in L:
    k,v=next(iter(x.items())) if isinstance(x,dict) else (None,x)
    if isinstance(v,list):
      v=_dedup(v)
      if v:out.append({k:v})
    elif v not in _seen:_seen.add(v);out.append(x)
  return out
nav=_dedup(nav)
def _ren(L):
  for i,x in enumerate(L):
    if isinstance(x,dict):
      k,v=next(iter(x.items()))
      if isinstance(v,list):_ren(v)
      elif v=='2_mehaniki/passivki.md':L[i]={'Лучшие наборы пассивок':v}
_ren(nav)
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
# pal list index -> gallery (one place for all pals)
for _f in (D+'/4_spravochniki/paly/README.md',):
  if os.path.exists(_f):open(_f,'w').write('---\nhide: [toc, navigation]\nsearch:\n  exclude: true\n---\n# Все палы\n\n<meta http-equiv="refresh" content="0; url=../../gallery/">\n<script>location.replace("../../gallery/"+location.search)</script>\n\n[Открыть галерею палов](../../gallery/)\n')
import table_cards as _tc
_tt=0
for _f in glob.glob(D+'/**/*.md',recursive=True):
  _r=_f[len(D)+1:]
  if _r in _tc.WHITE:continue
  _s=open(_f).read()
  if '|' not in _s:continue
  _t,_k=_tc.convert(_s,index=os.path.basename(_f) in ('README.md','index.md'))
  if _k:open(_f,'w').write(_t);_tt+=_k
print('tables -> cards',_tt)

# sources page (all credits live here, not in reader text)
open(D+'/about.md','w').write("""---
hide: [toc]
search:
  exclude: true
---
# Об источниках

Палпедия — фан-энциклопедия, не официальный продукт. Palworld и все изображения палов © Pocketpair, Inc.

<div class="kvs" markdown="0">
<div class="kv"><span class="kv-l">Данные игры</span><span class="kv-v">таблицы игры Palworld 1.0.5 через <a href="https://paldb.cc" rel="noopener">paldb.cc</a>, сверка с <a href="https://palworld.wiki.gg" rel="noopener">palworld.wiki.gg</a></span></div>
<div class="kv"><span class="kv-l">Карта Палпагоса</span><span class="kv-v"><a href="https://palworld.wiki.gg/wiki/File:World_Map.webp" rel="noopener">palworld.wiki.gg</a>, CC BY-SA</span></div>
<div class="kv"><span class="kv-l">Карта Мирового древа и точки обитания</span><span class="kv-v"><a href="https://paldb.cc/ru/Map_Tree" rel="noopener">paldb.cc</a></span></div>
<div class="kv"><span class="kv-l">Арты и иконки палов, иконки еды</span><span class="kv-v"><a href="https://palworld.wiki.gg" rel="noopener">palworld.wiki.gg</a>, CC BY-NC-SA; © Pocketpair</span></div>
<div class="kv"><span class="kv-l">Иконки предметов</span><span class="kv-v"><a href="https://palworld.fandom.com" rel="noopener">palworld.fandom.com</a>, CC BY-SA; © Pocketpair</span></div>
<div class="kv"><span class="kv-l">Шрифты</span><span class="kv-v">Manrope, Unbounded, JetBrains Mono — SIL Open Font License</span></div>
</div>
""")
# drop service sentences about verification from reader text
import ru_text as _ru
for _f in glob.glob(D+'/**/*.md',recursive=True):
  if _f.endswith('/about.md'):continue
  _s=open(_f).read()
  _t=re.sub(r'(?ms)^#{2,4} Что исправлено[^\n]*\n.*?(?=^#{1,4} |\Z)','',_s)  # service changelog sections
  _t=re.sub(r'(?m)^.*Пришли скрины[^\n]*\n','',_t)
  _t=re.sub(r'[^.\n\[\]()]*(?:мы не нашли точного подтверждения|название не подтверждено)[^.\n\[\]()]*\.?[ \t]*','',_t)
  _t=re.sub(r'\s*—\s*подтверждено данными игры','',_t)
  _t=re.sub(r'\s*\((?:подтверждено|по данным|источник[иа]?:)[^)]*(?:paldb|wiki\.gg)[^)]*\)','',_t)
  _t=re.sub(r'(\d)\.0(?=\s*%)',r'\1',_t)
  _t=re.sub(r'(?<=[А-Яа-яЁё»)]) \((?=[^)]*[a-z])(?:[A-Z][A-Za-z\'’-]*)(?: [A-Za-z\'’-]+){0,5}\)','',_t)  # English names in parentheses
  _t=re.sub(r'\s*(?:и\s+)?\?\?\?(?=[\s.,)]|$)','',_t)
  _t=re.sub(r'(?m)^(\s*[-*] [^\n]*?(?:\*\*)?[^\n:]{2,60}:(?:\*\*)?)[ \t]*\n(?=\s*\n\s*(?:#|[-*] |$))','',_t)  # label with nothing after it
  _t=re.sub(r'(?<![:\w.\-])(\d+)\.(\d+)(?=\s*%)',r'\1,\2',_t)  # 0.813% → 0,813%
  if re.search(r'/(4_spravochniki/paly|passivki|boss|guide|2_mehaniki|5_lut_i_farm)/',_f):_t=_ru.fix_names(_IFX,_t);_t=re.sub(r'(?<=[»A-Za-zА-Яа-яЁё]) +([.,!?;])(?=\s|$)',r'\1',_t)
  if _t!=_s:open(_f,'w').write(_t)

_lvgrid()  # again, after the final text cleanup
