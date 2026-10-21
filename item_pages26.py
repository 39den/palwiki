# Preview-only (ITEMS26=1) item section pages built from /workspace/items_content (content by the items worker; layout here).
import json,os,shutil,html,collections
IC='/workspace/items_content'
esc=lambda s:html.escape(str(s),quote=True)
EM={'Постройки':'🏗','Боеприпасы':'🎯','Оружие':'⚔️','Ингредиент':'🍲','Сферы':'🔴','Модуль для сферы':'🧩','Снаряжение':'🛡','Аксессуары':'💍','Материалы':'🪵','Расходник':'🧪','Ключевые предметы':'🔑','Чертёж':'📜','Глайдеры':'🪂','Обломки плит':'🪨','Прочее':'📦'}
def build(D):
  if not os.path.exists(IC+'/items.json'):return 0
  items=json.load(open(IC+'/items.json'));R='../../../'
  ST=[]
  if os.path.exists(IC+'/structures.json'):
    ST=json.load(open(IC+'/structures.json'))
    for x in ST:x['page']='4_spravochniki/predmety/постройки/#'+x['anchor']
  SL={x['ru']:'4_spravochniki/predmety/постройки/#'+x['anchor'] for x in ST}
  for i in items+ST:
    for c in i.get('craft') or []:
      for st in c.get('stations') or []:
        if st.get('ru') in SL:st['link']=SL[st['ru']]
  items=items+ST
  os.makedirs(D+'/pp/ic',exist_ok=True)
  used=set()
  def ic(path,sz,cls='iic',alt='',g='📦'):
    if not path or not os.path.exists(IC+'/'+path):return f'<span class="{cls} e" role="img" aria-label="{esc(alt)}" style="width:{sz}px;height:{sz}px;font-size:{int(sz*.5)}px">{g}</span>'
    fn=os.path.basename(path);src=IC+'/'+path
    if fn not in used and os.path.exists(src):shutil.copy(src,D+'/pp/ic/'+fn);used.add(fn)
    big=path.replace('-96.','-192.').replace('-64.','-128.')
    fb=os.path.basename(big)
    if fb!=fn and fb not in used and os.path.exists(IC+'/'+big):shutil.copy(IC+'/'+big,D+'/pp/ic/'+fb);used.add(fb)
    ss=f' srcset="{R}pp/ic/{fn} 1x, {R}pp/ic/{fb} 2x"' if fb!=fn and os.path.exists(IC+'/'+big) else ''
    return f'<img class="{cls}" src="{R}pp/ic/{fn}"{ss} width="{sz}" height="{sz}" alt="{esc(alt)}" loading="lazy" decoding="async">'
  def ref(r,extra=''):
    inner=f'{ic(r.get("icon"),28,"rim",r["ru"])}<span>{esc(r["ru"])}</span>{extra}'
    return f'<a class="ich" href="{R}{r["link"]}">{inner}</a>' if r.get('link') else f'<span class="ich">{inner}</span>'
  by=collections.defaultdict(list)
  for i in items:by[i['page'].split('/')[2]].append(i)
  n=0
  for page,L in by.items():
    fn=f'{D}/4_spravochniki/predmety/{page}.md'
    ty=L[0]['type'];subs=[s for s,_ in collections.Counter(i.get('sub') for i in L if i.get('sub')).most_common()]
    L.sort(key=lambda i:(i.get('sub') or '',i['rarity'],i['ru']))
    cards=[]
    for i in L:
      r=i['rarity'];w=next((s['value'] for s in i['stats'] if s['key']=='weight'),None)
      key=next((s for s in i['stats'] if s['key'] in('attack','defense','capture_power','hp','shield')),None)
      small=f'{key["icon"]} {esc(key["value"])}' if key else (f'⚖️ {esc(w)}' if w else esc(i.get('sub') or ''))
      if i.get('food'):small=esc(i['food']['fullness_time']['text'])
      body=[f'<div class="ihead">{ic((i.get("icon") or {}).get("96"),96,"ibig",i["ru"],EM.get(i["type"],"📦"))}<div><h3>{esc(i["ru"])}</h3><span class="rch r{r}">{esc(i["rarity_ru"])}</span>{"<small class=inote>"+esc(i["icon_note"])+"</small>" if i.get("icon_note") else ""}<p class="idesc">{esc(i["desc"])}</p></div></div>']
      if i.get('effects'):body.append('<div class="ichips">'+''.join(f'<span class="ieff">✨ {esc(e)}</span>' for e in i['effects'])+'</div>')
      if i['stats']:body.append('<div class="istats">'+''.join(f'<div class="ist"><span>{s["icon"]}</span><small>{esc(s["label"])}</small><b>{esc(s["value"])}</b></div>' for s in i['stats'])+'</div>')
      if i.get('food'):
        f=i['food'];ex=''.join(f'<span class="ieff">{esc(e.get("chip") or e.get("text"))}</span>' for e in f.get('effects') or [])
        if ex:body.append('<div class="ichips">'+ex+'</div>')
      if i.get('by_rarity'):
        ks=[k for k in ('attack','defense','hp','shield','durability','magazine') if any(k in x for x in i['by_rarity'])];LB={'attack':'⚔️','defense':'🛡','hp':'❤️','shield':'🔰','durability':'🔧','magazine':'🔫'}
        body.append('<div class="isec"><h4>По качеству</h4><div class="ibr">'+''.join(f'<div class="ibx r{x["rarity"]}"><span class="rch r{x["rarity"]}">{esc(x["rarity_ru"])}</span>'+''.join(f'<span>{LB[k]} <b>{x[k]}</b></span>' for k in ks if k in x)+'</div>' for x in i['by_rarity'])+'</div></div>')
      if i.get('ammo_for'):body.append('<div class="isec"><h4>Подходит к оружию</h4><div class="ichips">'+''.join(ref(x) for x in i['ammo_for'])+'</div></div>')
      if i.get('ammo'):body.append('<div class="isec"><h4>Патроны</h4><div class="ichips">'+''.join(ref(x) for x in i['ammo'])+'</div></div>')
      for c in i.get('craft') or []:
        ing=''.join(ref(x,f'<b>×{esc(x["qty"])}</b>') for x in c.get('ingredients') or [])
        st=''.join(ref(x) for x in c.get('stations') or [])
        body.append('<div class="isec"><h4>🔨 Крафт'+(f' <small>×{esc(c["yield"])} за раз</small>' if c.get('yield') and str(c['yield'])!='1' else '')+'</h4>'+(f'<div class="ichips">{ing}</div>' if ing else '')+(f'<h5>Где сделать</h5><div class="ichips st">{st}</div>' if st else '')+'</div>')
      if i.get('unlocks'):u=i['unlocks'];u=u if isinstance(u,list) else [u];body.append('<div class="isec"><h4>Открывает</h4><div class="ichips">'+''.join(ref(x,f'<span class="rch">{esc(x.get("rarity_ru",""))}</span>') for x in u)+'</div></div>')
      if i.get('get'):
        def gt(g):
          t=f'<span class="gi">{g.get("icon","•")}</span><span class="gl">{esc(g["label"])}</span>'+''.join(f'<small>{v}</small>' for v in [f'×{esc(g["qty"])}' if g.get('qty') else '',esc(g['chance']) if g.get('chance') else '',f'💰 {esc(g["price"])}' if g.get('price') else ''] if v)
          return f'<a class="igt" href="{R}{g["link"]}">{t}</a>' if g.get('link') else f'<div class="igt">{t}</div>'
        body.append('<div class="isec"><h4>📍 Где взять</h4><div class="igets">'+''.join(gt(g) for g in i['get'])+'</div></div>')
      if i.get('used_in'):
        U=i['used_in'];more=len(U)-12
        body.append('<div class="isec"><h4>Где используется</h4><div class="ichips">'+''.join(ref(x) for x in U[:12])+(f'<span class="ich more">+{more}</span>' if more>0 else '')+'</div></div>')
      if i.get('game_text') and i['game_text'].strip()!=i['desc'].strip():body.append(f'<details class="igame"><summary>Из игры</summary><p>{esc(i["game_text"])}</p></details>')
      cards.append(f'<details class="itm r{r}" id="{esc(i["anchor"])}" data-n="{esc(i["ru"].lower())}" data-sub="{esc(i.get("sub") or "")}"><summary class="itl">{ic((i.get("icon") or {}).get("96"),56,"iic",i["ru"],EM.get(i["type"],"📦"))}<span class="itn">{esc(i["ru"])}</span><small>{small}</small></summary><div class="ibody">{"".join(body)}</div></details>')
    chips=('<div class="isubs">'+'<button type="button" class="on" data-sub="">Все</button>'+''.join(f'<button type="button" data-sub="{esc(s)}">{esc(s)}</button>' for s in subs)+'</div>') if len(subs)>1 else ''
    md=f'---\nhide: [toc]\n---\n# {EM.get(ty,"📦")} {esc(ty)}\n\n<div class="pfl ifl" markdown="0"><input type="search" class="pfq" name="pp-items-q" placeholder="Найти: {esc(ty.lower())}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"><span class="gcount pfn">найдено {len(L)}</span></div>\n\n<div class="items26" markdown="0">{chips}<div class="igrid">{"".join(cards)}</div></div>\n'
    open(fn,'w').write(md);n+=len(L)
  # section index as an icon tile grid (+ new Постройки section)
  ORD=sorted(by.items(),key=lambda kv:-len(kv[1]))
  tiles=''
  for page,L in ORD:
    rep=max(L,key=lambda i:(i['rarity'],bool(i.get('craft')),-len(i['ru'])))
    tiles+=f'<a class="isec-t" href="{page}/">{ic((rep.get("icon") or {}).get("96"),56,"iic",rep["ru"]).replace(R,"../../")}<b>{esc(L[0]["type"])}</b><small>{len(L)}</small></a>'
  open(D+'/4_spravochniki/predmety/README.md','w').write(f'---\nhide: [toc]\n---\n# 📦 Предметы и постройки\n\n<div class="isecs" markdown="0">{tiles}</div>\n')
  return n
