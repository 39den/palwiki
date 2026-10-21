"""Item section pages: compact tile grid; tap a tile to expand the full card (big icon, short description, stat tiles, recipe chips, station chips, where-to-get tiles)."""
import re,json,os,shutil,html
from pymdownx.slugs import slugify
import ru_text
SLUG=slugify(case='lower')
RAR=['Обычный','Необычный','Редкий','Эпический','Легендарный']
TYPE_EM={'Чертёж':'📜','Ключевые предметы':'🗝️','Расходник':'🧪','Материалы':'🪵','Оружие':'⚔️','Снаряжение':'🛡️','Ингредиент':'🥕','Аксессуары':'💍','Боеприпасы':'🎯','Сферы':'🔴','Модуль для сферы':'⚙️','Глайдеры':'🪂','Обломки плит':'🧩','Прочее':'📦'}
STATIONS=['Верстак снаряж-я для Палов','Конвейерная фабрика оружия II','Конвейерная фабрика оружия','Конвейерная фабрика сфер II','Конвейерная фабрика сфер','Конвейерная фабрика II','Конвейерная фабрика','Сборочная линия оружия разв. цив.','Сборочная линия сфер разв. цив.','Сборочная линия золотых монет','Мастерская развитой цивилизации','Средневековый стол фармацевта','Электрический стол фармацевта','Замораживающий измельчитель','Качественный верстак','Примитивный верстак','Древний верстак','Оружейная мастерская','Сферическая Мастерская','Чертёжный стол','Электрическая кухня','Большая кухня','Древняя кухня','Примитивная печь','Улучшенная печь','Электрическая печь','Древняя печь','Дробилка','Мельница','Котелок','Костер']
ST_EN={'Верстак снаряж-я для Палов':'Pal Gear Workbench','Конвейерная фабрика оружия II':'Weapon Assembly Line II','Конвейерная фабрика оружия':'Weapon Assembly Line','Конвейерная фабрика сфер II':'Sphere Assembly Line II','Конвейерная фабрика сфер':'Sphere Assembly Line','Конвейерная фабрика II':'Production Assembly Line II','Конвейерная фабрика':'Production Assembly Line','Сборочная линия оружия разв. цив.':'Advanced Weapon Assembly Line','Сборочная линия сфер разв. цив.':'Advanced Sphere Assembly Line','Мастерская развитой цивилизации':'Advanced Workshop','Средневековый стол фармацевта':'Medieval Medicine Workbench','Электрический стол фармацевта':'Electric Medicine Workbench','Замораживающий измельчитель':'Cryogenic Crusher','Качественный верстак':'High Quality Workbench','Примитивный верстак':'Primitive Workbench','Древний верстак':'Ancient Workbench','Оружейная мастерская':'Weapon Workbench','Сферическая Мастерская':'Sphere Workbench','Чертёжный стол':'Drafting Table','Электрическая кухня':'Electric Kitchen','Древняя кухня':'Ancient Kitchen','Примитивная печь':'Primitive Furnace','Улучшенная печь':'Improved Furnace','Электрическая печь':'Electric Furnace','Древняя печь':'Ancient Furnace','Дробилка':'Crusher','Мельница':'Mill','Котелок':'Cooking Pot','Костер':'Campfire'}
def st_icon(n):
  n=n.lower()
  for k,e in (('кухн','🍳'),('котел','🍲'),('костер','🔥'),('печь','🔥'),('фармацевт','💊'),('чертёж','📐'),('сфер','🔴'),('оруж','🔫'),('фабрик','🏭'),('линия','🏭'),('мастерская','🏭'),('дробилка','⚙️'),('измельч','❄️'),('мельниц','🌾'),('верстак','🔨')):
    if k in n:return e
  return '🔨'
def split_st(s):
  out=[];s=' '+(s or '')+' '
  while s.strip():
    s=s.lstrip()
    for n in STATIONS:
      if s.startswith(n+' ') or s==n:out.append(n);s=s[len(n):];break
    else:
      w=s.split(' ',1);out.append(w[0]);s=w[1] if len(w)>1 else ''
  seen=[];[seen.append(x) for x in out if x and x not in seen];return seen
def pct(c):
  m=re.fullmatch(r'\s*([\d.]+)\s*%\s*',str(c or ''))
  if not m:return str(c or '')
  v=float(m.group(1));t=f'{v:.1f}'.rstrip('0').rstrip('.') if v<10 else f'{v:.0f}'
  return t.replace('.',',')+' %'
def build(items,pals_th,out_dir,docs,AF_items,stations_link,R='../../../',AF_struct=None):
  esc=lambda x:html.escape(str(x),quote=True)
  pal_names=[p for p in pals_th]
  fx=ru_text.Fixer(items,pal_names,STATIONS)
  by={};[by.setdefault(i.get('type') or 'Прочее',[]).append(i) for i in items]
  ico={};os.makedirs(docs+'/pp/items',exist_ok=True)
  for a in AF_items or []:
    fs={f['w']:f['src'] for f in a.get('files',[])}
    if 96 not in fs or not os.path.exists('/workspace/palsite/design2026/art_final/'+fs[96]):continue
    for w,src in fs.items():
      p='/workspace/palsite/design2026/art_final/'+src
      if os.path.exists(p):shutil.copy(p,f"{docs}/pp/items/{a['id']}-{w}.webp")
    ico[a['ru']]=a['id']
  sic={};os.makedirs(docs+'/pp/struct',exist_ok=True);byen={a['en']:a for a in (AF_struct or [])}
  for ru,en in ST_EN.items():
    a=byen.get(en)
    if not a:continue
    ok=False
    for f in a.get('files',[]):
      p='/workspace/palsite/design2026/art_final/'+f['src']
      if os.path.exists(p) and f['w'] in (64,96):shutil.copy(p,f"{docs}/pp/struct/{a['id']}-{f['w']}.webp");ok=True
    if ok:sic[ru]=a['id']
  def sticon(n):
    k=sic.get(n)
    return f'<img class="ici" src="{R}pp/struct/{k}-64.webp" srcset="{R}pp/struct/{k}-64.webp 64w,{R}pp/struct/{k}-96.webp 96w" sizes="28px" width="28" height="28" alt="" loading="lazy">' if k else f'<span class="ici e" aria-hidden="true">{st_icon(n)}</span>'
  loc={};[loc.__setitem__(i['ru'],(i.get('type') or 'Прочее').lower().replace(' ','_')+'/#'+SLUG(i['ru'],'-')) for i in items]
  def icon(n,sz,cls='iic'):
    k=ico.get(n)
    if not k:return ''
    return f'<img class="{cls}" src="{R}pp/items/{k}-{96 if sz<=64 else 192}.webp" srcset="{R}pp/items/{k}-96.webp 96w,{R}pp/items/{k}-192.webp 192w" sizes="{sz}px" width="{sz}" height="{sz}" alt="" loading="lazy" decoding="async">'
  pages={};lint=[]
  for ty,lst in by.items():
    fn=out_dir+ty.lower().replace(' ','_')+'.md'
    if not os.path.exists(fn):continue
    em=TYPE_EM.get(ty,'📦')
    cards=[]
    for i in sorted(lst,key=lambda z:z['ru']):
      r=min(int(i.get('rarity') or 0),4);sid=SLUG(i['ru'],'-')
      desc=fx.fix((i.get('desc') or '').replace('\n',' '));lint+= [(i['ru'],h) for h in ru_text.lint_text(fx,desc)]
      st=[('💎','Редкость',f'<span class="rch r{r}">{RAR[r]}</span>',True),('⚖️','Вес',ru_text.num(i.get('weight')),i.get('weight') not in (None,'','0')),('💰','Цена',esc(i.get('price')),i.get('price') not in (None,'','0')),('📘','Технология',f"ур. {esc(i.get('tech_level'))}",bool(i.get('tech_level')))]
      tl=''.join(f'<div class="ist"><span class="ii" aria-hidden="true">{a}</span><span class="il">{b}</span><b>{c}</b></div>' for a,b,c,ok in st if ok)
      rec=''
      for x in (i.get('recipe') or []):
        n=x['item'];u=loc.get(n);ic=icon(n,24,'ici') or '<span class="ici e" aria-hidden="true">'+TYPE_EM.get(next((z.get('type') for z in items if z['ru']==n),''),'📦')+'</span>'
        body=f'{ic}<span>{esc(n)}</span><b>×{esc(x["qty"])}</b>'
        rec+=f'<a class="ich" href="../{u}">{body}</a>' if u else f'<span class="ich">{body}</span>'
      sts=''.join(f'<a class="ich stn" href="{R}{stations_link}">{sticon(s)}<span>{esc(s)}</span></a>' for s in split_st(i.get('station')))
      src=[];seen=set()
      for x in (i.get('sources') or []):
        l=x.get('label') or x.get('source') or '';k=(l,x.get('qty'))
        if not l or k in seen or re.search(r'[A-Za-z]{3,}_',l):continue
        seen.add(k);ic={'chest':'🎁'}.get(x.get('kind'),'📍')
        src.append((float(re.sub(r'[^\d.]','',str(x.get('chance') or '0')) or 0),f'<div class="iso"><span class="ii" aria-hidden="true">{ic}</span><span class="isl">{esc(l)}</span><span class="isn">{("×"+esc(x["qty"])) if x.get("qty") else ""}</span><b class="isp">{pct(x.get("chance"))}</b></div>'))
      for x in (i.get('from_npc') or []):
        if x['who'] in seen:continue
        seen.add(x['who']);src.append((float(re.sub(r'[^\d.]','',str(x.get('chance') or '0')) or 0),f'<div class="iso"><span class="ii" aria-hidden="true">👤</span><span class="isl">{esc(x["who"])}</span><span class="isn"></span><b class="isp">{pct(x.get("chance"))}</b></div>'))
      for x in (i.get('from_pals') or [])[:16]:
        n=x.get('pal') if isinstance(x,dict) else x;pp=pals_th.get(n);ch=pct(x.get('chance')) if isinstance(x,dict) else ''
        img=f'<img src="{R}{pp["thumb"]}" width="32" height="32" alt="" loading="lazy">' if pp and pp.get('thumb') else '<span class="ii">🐾</span>'
        cell=f'{img}<span class="isl">{esc(n)}</span><span class="isn">с пала</span><b class="isp">{ch}</b>'
        src.append((101,f'<a class="iso pal" href="{R}{pp["url"]}">{cell}</a>' if pp else f'<div class="iso pal">{cell}</div>'))
      if i.get('merchant'):src.append((0,'<div class="iso"><span class="ii" aria-hidden="true">🛒</span><span class="isl">Продаётся у торговцев</span><span class="isn"></span><b class="isp"></b></div>'))
      src.sort(key=lambda z:-z[0])
      big=icon(i['ru'],128,'ibig') or f'<span class="ibig e" aria-hidden="true">{em}</span>'
      sm=icon(i['ru'],56) or f'<span class="iic e" aria-hidden="true">{em}</span>'
      sub=' · '.join(x for x in [RAR[r] if r else '',('вес '+ru_text.num(i.get('weight'))) if i.get('weight') not in (None,'','0') else ''] if x)
      cards.append(f'<details class="itm r{r}" id="{sid}" data-n="{esc((i["ru"]+" "+i.get("en","")).lower())}"><summary class="itl">{sm}<span class="itn">{esc(i["ru"])}</span><small>{esc(sub)}</small></summary>'
        f'<div class="ibd"><div class="ihd">{big}<div><h3>{esc(i["ru"])}</h3>'+(f'<p class="idesc">{esc(desc)}</p>' if desc else '')+'</div></div>'
        f'<div class="ists">{tl}</div>'
        +(f'<div class="isec"><span class="ish">🔨 Из чего сделать</span><div class="ichs">{rec}</div></div>' if rec else '')
        +(f'<div class="isec"><span class="ish">🏭 Где сделать</span><div class="ichs">{sts}</div></div>' if sts else '')
        +(f'<div class="isec"><span class="ish">📍 Где взять</span><div class="isos">{"".join(s for _,s in src[:24])}</div></div>' if src else '')
        +'</div></details>')
    md=f'---\nhide: [toc]\n---\n# {em} {ty}\n\n<div class="pfl ifl" markdown="0"><input type="search" class="pfq" name="pp-items-q" placeholder="Найти: {esc(ty.lower())}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"><span class="gcount pfn"></span></div>\n\n<div class="igrid" markdown="0">'+''.join(cards)+'</div>\n'
    open(fn,'w').write(md);pages[ty]=len(cards)
  print('station icons',len(sic),'of',len(ST_EN))
  return pages,lint,fx,ico
