# Active skills: Palpedia card gallery (docs/2_mehaniki/aktivki.md) + search entries
import json,re,html
W='/workspace/palwiki/data'
EL={'Нейтральный':'neutral','Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon'}
ST={'Возгорание':('🔥','поджигает'),'Промокание':('💧','намокание'),'Электризация':('⚡','электризует'),'Обледенение':('❄️','замораживает'),'Слепота':('🌑','ослепляет'),'Путы':('🌿','опутывает'),'Грязь':('🟤','пачкает грязью'),'Яд':('☠️','отравляет'),'Оглушение':('💫','оглушает')}
def slug(s):
  t=str.maketrans({'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'})
  return re.sub(r'[^a-z0-9]+','-',s.lower().translate(t)).strip('-')
def effects(e):
  out=[]
  for nm,v in re.findall(r'([А-Яа-яё ]+?)\s+(\d+)',e or ''):
    nm=nm.strip();v=min(int(v),100);ic,_=ST.get(nm,('✳️',''))
    out.append((nm,v,ic))
  return out
def build(D,SP,SI,chip,R='../../'):
  A=json.load(open(W+'/actives.json'))
  learners={}
  for p in json.load(open(W+'/pals.json')):
    for a in p.get('actives') or []:learners.setdefault(a['name'],[]).append((p['ru'],a.get('level')))
  byru={x['ru']:x for x in SP}
  fruit={}
  for i in SI:
    m=re.match(r'Плод мастерства:\s*(.+)',i['ru'])
    if m:fruit[m.group(1).strip()]=i
  cards=[];search=[];effset=set()
  for a in A:
    if not re.search('[А-Яа-яЁё]',a['name']):continue  # internal-only entries
    a=dict(a);a['desc']=re.sub(r'\s+',' ',re.sub(r'\b[A-Z][A-Za-z0-9]*_[A-Za-z0-9_]+\s*:\s*\d+\s*Мощность:\s*\d+','',a['desc'])).strip()
    pw=int(re.sub(r'\D','',a['power']) or 0);ct=int(re.sub(r'\D','',a['ct']) or 0)
    ef=effects(a['effect']);[effset.add(n) for n,_,_ in ef]
    uq=[u.strip() for u in re.split(r'[,;]',a.get('unique') or '') if u.strip()]
    ln=learners.get(a['name'],[]);ln.sort(key=lambda x:x[1] or 99)
    fr=fruit.get(a['name'])
    el=EL.get(a['el'],'neutral');sid=slug(a['name'])
    av=''.join(f'<a class="lav" href="{R}{byru[n]["url"]}" title="{html.escape(n)}{f" · ур. {l}" if l else ""}"><img src="{R}{byru[n].get("thumb")}" width="32" height="32" alt="{html.escape(n)}" loading="lazy" decoding="async"></a>' for n,l in ln[:8] if n in byru and byru[n].get('url'))
    more=f'<span class="lmore">+{len(ln)-8}</span>' if len(ln)>8 else ''
    ech=''.join(f'<span class="efc"><span>{ic}</span>{html.escape(n)} {v}%</span>' for n,v,ic in ef)
    cat={'Боссовый':'<span class="sk-b">босс</span>','Нераскрытый':'<span class="sk-b">особый</span>'}.get(a['cat'],'')
    det=f'<p>{html.escape(a["desc"])}</p>'+(f'<div class="skd"><span class="il">Учат</span>'+', '.join(f'<a href="{R}{byru[n]["url"]}">{html.escape(n)}</a>{f" <small>ур. {l}</small>" if l else ""}' if n in byru and byru[n].get('url') else html.escape(n) for n,l in ln)+'</div>' if ln else '')+(f'<div class="skd"><span class="il">Плод мастерства</span><a href="{R}{fr["url"]}">{html.escape(fr["ru"])}</a></div>' if fr and fr.get('url') else ('<div class="skd"><span class="il">Плод мастерства</span>есть</div>' if fr else ''))
    cards.append(f'''<details class="skc" id="{sid}" data-n="{html.escape(a["name"].lower())} {html.escape(a["desc"].lower())}" data-el="{html.escape(a["el"])}" data-pw="{pw}" data-ct="{ct}" data-ef="{html.escape(" ".join(n for n,_,_ in ef) or "нет")}" data-u="{1 if uq else 0}" data-f="{1 if fr else 0}" style="--ec:var(--el-{el},#8a94a6)"><summary><div class="sk-h"><b>{html.escape(a["name"])}</b>{chip(a["el"])}{cat}{'<span class="sk-u" title="Есть только у этого пала">уникальный</span>' if uq else ''}</div><div class="sk-n"><div><b>{pw}</b><span>сила</span></div><div><b>{ct}</b><span>перезарядка, с</span></div></div>{f'<div class="sk-e">{ech}</div>' if ech else ''}<div class="sk-l">{av}{more}{'<span class="sk-fr" title="Можно выучить плодом мастерства">🍎 плод</span>' if fr else ''}</div></summary><div class="sk-d">{det}</div></details>''')
    search.append({'ru':a['name'],'en':'','type':'Активный навык · '+a['el'],'src':[],'url':f'2_mehaniki/aktivki/#{sid}','desc':a['desc'][:160]})
  els=sorted({a['el'] for a in A},key=lambda e:list(EL).index(e) if e in EL else 99)
  fc=lambda grp,v,lab:f'<button type="button" class="fc" data-g="{grp}" data-v="{html.escape(v)}">{lab}</button>'
  bar=('<div class="skf" markdown="0"><div class="skq"><input class="sk-q" type="search" placeholder="Название или эффект" autocomplete="off" enterkeyhint="search"><select class="sk-s" aria-label="Сортировка"><option value="pw">По силе</option><option value="ct">По перезарядке</option><option value="n">По названию</option></select></div>'
    '<div class="fcs"><span class="il">Стихия</span>'+fc('el','','Все')+''.join(fc('el',e,chip(e)) for e in els)+'</div>'
    '<div class="fcs"><span class="il">Сила</span>'+fc('pw','','Любая')+fc('pw','0-60','до 60')+fc('pw','61-120','61–120')+fc('pw','121-200','121–200')+fc('pw','201-9999','200+')+'</div>'
    '<div class="fcs"><span class="il">Перезарядка</span>'+fc('ct','','Любая')+fc('ct','0-4','до 4 с')+fc('ct','5-15','5–15 с')+fc('ct','16-999','16+ с')+'</div>'
    '<div class="fcs"><span class="il">Эффект</span>'+fc('ef','','Любой')+''.join(fc('ef',e,ST.get(e,('',''))[0]+' '+e) for e in sorted(effset))+fc('ef','нет','без эффекта')+'</div>'
    '<div class="fcs"><span class="il">Ещё</span>'+fc('u','1','⭐ уникальные')+fc('f','1','🍎 есть плод')+'</div><div class="skn"></div></div>')
  md=f'''---
hide: [toc]
---
# Все активные навыки

<p class="lead">Атаки палов: сила, перезарядка и эффекты. Нажми на карточку — откроется описание и все палы, которые учат навык.</p>

{bar}
<div class="skg" markdown="0">{''.join(cards)}</div>
'''
  return md,search
