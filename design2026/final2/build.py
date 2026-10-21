import json,html,os,collections
from icons import ic
D=json.load(open('../../docs/assets/search_data.json'));P={x['en']:x for x in D['pals']};RU={x['ru']:x for x in D['pals']};ID={x['id']:x for x in D['pals']}
M=json.load(open('img/manifest.json'));A={a['id']:a for a in json.load(open('anim/anim.json'))}
EA=json.load(open('engine_answers.json'));PS={x['name']:x for x in D['passives']}
F=json.load(open('/workspace/palwiki/data/food.json'));LOC=json.load(open('/workspace/palwiki/data/locations.json'))
PIN=json.load(open('img/map/pins.json'))
R='../../docs/'
EK={'Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon','Нейтральный':'neutral'}
def fmt(v): return f'{v:,}'.replace(',','\u202f')
def el(e): k=EK[e];return f'<span class="el" style="--e:var(--{k})">{ic(k,16)}{e}</span>'
def ev(p): return f'var(--{EK[p["el"][0]]})'
def srcset(base): return ', '.join(f'{f} {w}w' for f,w in M[base]['files'])
def cap(base,cls=''): return f'<figcaption class="cap {cls}">{M[base]["src"]}</figcaption>'
def pimg(p,sizes='(max-width:600px) 60vw, 320px',alt=''):
  b=f'img/pal/{p["id"]}'
  if b not in M: return f'<figure class="fig"><img src="{R}{p["thumb"]}" alt="{alt}" width="320" height="320"><figcaption class="cap">© Pocketpair · palworld.wiki.gg</figcaption></figure>'
  return f'<figure class="fig"><img src="{M[b]["files"][-1][0]}" srcset="{srcset(b)}" sizes="{sizes}" alt="{alt}" width="640" height="640" decoding="async">{cap(b)}</figure>'
def stage(p,cls='',alt='',sizes='(max-width:600px) 60vw, 320px',animate=False):
  if animate and p['id'] in A:
    a=p['id'];b=f'img/pal/{a}'
    return f'<div class="stage anim-wrap {cls}" data-id="{a}" style="--e:{ev(p)}"><figure class="fig"><img class="anim" src="anim/{a}-still.webp" data-still="anim/{a}-still.webp" data-anim="anim/{a}.webp" alt="{alt}" width="300" height="300">{cap(b)}</figure><span class="play"><i></i>Анимация</span></div>'
  return f'<div class="stage {cls}" style="--e:{ev(p)}">{pimg(p,sizes,alt)}</div>'
def thumb(p): b=f'img/pal/{p["id"]}';return M[b]['files'][0][0] if b in M else R+p['thumb']
N=dict(pals=len(D['pals']),passives=len(D['passives']),bosses=len(D['bosses']),faq=len(D['faq']),map=len(D['map']))
def page(t,body,on=0):
  return f'''<!doctype html><html lang="ru" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><title>{t}</title>
<link rel="preload" href="fonts/Unbounded-600-cyrillic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="fonts/Manrope-400-cyrillic.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="style.css"></head><body>{header(on)}<main class="wrap">{body}{FOOT}</main>{bnav(on)}{SO}<script src="fx.js"></script></body></html>'''
NAV=[('Палы','pal.html'),('Сравнение','compare.html'),('Боссы','boss.html'),('Места','places.html'),('Еда','dishes.html'),('Карта','map.html')]
def header(on=0):
  n=''.join(f'<a class="{"on" if i==on-1 else ""}" href="{u}">{x}</a>' for i,(x,u) in enumerate(NAV))
  return f'<header class="hd"><div class="wrap"><a class="brand" href="home.html"><span class="ball"></span>Палпедия</a><nav class="nav">{n}</nav><button class="sp" data-open-search>{ic("search",18)}<span class="full">Найти или спросить</span><span class="short">Поиск</span><kbd>Ctrl K</kbd></button><button class="tg" aria-label="Сменить тему"><span class="sun">{ic("sun",18)}</span><span class="moon">{ic("moon",18)}</span></button></div></header>'
def bnav(on=0):
  it=[('home','Главная','home.html'),('sphere','Палы','pal.html'),('search','Поиск','#'),('map','Карта','map.html'),('list','Ещё','places.html')]
  return '<nav class="bn">'+''.join(f'<a class="{"on" if (i==0 and on==0) or (i==1 and on in(1,2)) or (i==3 and on==6) else ""}" {"data-open-search" if a=="search" else ""} href="{u}">{ic(a,22)}{b}</a>' for i,(a,b,u) in enumerate(it))+'</nav>'
FOOT='''<footer><b>Палпедия — фанатская некоммерческая энциклопедия по Palworld 1.0.5.</b><span>Не является официальным продуктом и не связана с Pocketpair, Inc. Palworld, имена и изображения палов © Pocketpair, Inc.; используются по <a href="https://www.pocketpair.jp/en/guidelines-derivativework-en/">Guidelines for Derivative Works</a>.</span><span>Рендеры палов и иконки блюд: palworld.wiki.gg · карта: palworld.wiki.gg (CC BY-SA) · скриншоты: страница Palworld в Steam · фон главной и анимации нарисованы нами.</span></footer>'''
an=P['Anubis'];jt=P['Jetragon']
bw=[b for b in D['bosses'] if 'Земля' in b['weak']];bwn=sorted({b['pal'] for b in bw})
bt=EA['как вывести анубиса'].split('\n')
SO=f'''<div class="so" id="so" role="dialog" aria-label="Поиск"><div class="scrim" data-close></div><div class="box">
<div class="inp">{ic("search",22)}<span class="t">ануб</span><kbd>Esc</kbd></div>
<div class="aia"><div class="h">{ic("spark",16)} Ответ из базы</div><p><b>{bt[0].replace("🥚 ","")}</b></p><ul><li>{bt[1].replace("• ","")}</li><li>Простые пары: {", ".join(l.replace("• ","") for l in bt[3:6])}</li></ul><a class="chipb" href="#">Все пары {ic("arrow",14)}</a><a class="chipb" href="compare.html">Сравнить с Джетрагоном {ic("compare",14)}</a></div>
<div class="gr eb">Палы</div><a class="rs sel" href="pal.html"><span class="th"><img src="{thumb(an)}" alt=""></span><div><b><mark>Ануб</mark>ис</b><span>№{an["no"]} · Земля · Ручная работа {an["work"][0][1]}, Добыча {an["work"][1][1]}</span></div>{ic("arrow",18)}</a>
<div class="gr eb">Боссы</div><a class="rs" href="boss.html"><span class="th">{ic("boss",20)}</span><div><b>Боссы, слабые к Земле: {len(bw)}</b><span>{", ".join(bwn[:4])}…</span></div></a>
<div class="gr eb">Недавние</div><a class="rs" href="dishes.html"><span class="th">{ic("clock",20)}</span><div><b>Где найти железо</b><span>{EA["где найти железо"].split(chr(10))[0].replace("🎒 ","")} · рудник на базе, горы</span></div></a>
<div class="ft"><span><kbd>↑↓</kbd> выбор</span><span><kbd>Enter</kbd> открыть</span><span><kbd>Esc</kbd> закрыть</span></div></div></div>'''
MC=collections.Counter(m['t'] for m in D['map'])
PCOL={'travel':'#2f8fff','alpha':'#ffd400','tower':'#ff6a2b','sealed':'#d94fc0'};PNAME={'travel':'Телепорты','alpha':'Альфы','tower':'Башни','sealed':'Запечатанные'}
def mapfig(cls='',sizes='100vw',pins=True,sel=None):
  b='img/map/world';pz=''.join(f'<span class="pin {m["t"]} {"sel" if sel==m["name"] else ""}" title="{html.escape(m["name"])}" style="left:{m["x"]*100:.2f}%;top:{m["y"]*100:.2f}%;background:{PCOL[m["t"]]}"></span>' for m in PIN['pts']) if pins else ''
  return f'<figure class="fig {cls}"><img src="{M[b]["files"][1][0]}" srcset="{srcset(b)}" sizes="{sizes}" alt="Карта Палпагоса" width="{M[b]["w"]}" height="{M[b]["h"]}">{pz}{cap(b,"on-dark")}</figure>'
def pcard(p,animate=True,demo=False):
  w=''.join(f'<span>{n} {l}</span>' for n,l in p['work'][:3])
  return f'''<a class="pcard rv press" {"data-hover-demo" if demo else ""} data-tilt href="pal.html" style="--e:{ev(p)}"><div class="top"><span class="eb">№{p["no"]}</span>{'<span class="badge-anim" title="Есть анимация">'+ic("spark",14)+'</span>' if animate and p['id'] in A else ''}</div>{stage(p,animate=animate,alt=p["ru"])}<h3>{p["ru"]}</h3><div class="els">{"".join(el(x) for x in p["el"])}</div><div class="wk">{w}</div><div class="kv3"><div><b>{p["hp"]}</b><span>Здоровье</span></div><div><b>{p["atk"]}</b><span>Атака</span></div><div><b>{p["def"]}</b><span>Защита</span></div></div></a>'''
def scene():
  return '''<div class="scene"><div class="sun"></div><span class="cl" style="width:120px;left:8%;top:14%"></span><span class="cl" style="width:80px;left:70%;top:24%;animation-duration:55s"></span>
<svg viewBox="0 0 1440 400" preserveAspectRatio="none" style="bottom:22%;height:30%"><path d="M0 260 C180 170 300 210 420 150 C560 80 640 200 760 170 C900 130 980 60 1120 120 C1260 180 1350 140 1440 160 V400 H0Z" fill="#7bb7a4" opacity=".55"/></svg>
<svg viewBox="0 0 1440 400" preserveAspectRatio="none" style="bottom:8%;height:30%"><path d="M0 220 C200 150 340 260 520 200 C700 140 820 250 1000 210 C1160 175 1300 240 1440 200 V400 H0Z" fill="#4d9a6a"/></svg>
<svg viewBox="0 0 1440 400" preserveAspectRatio="none" style="bottom:0;height:22%"><path d="M0 200 C240 120 420 220 640 170 C860 120 1080 230 1440 150 V400 H0Z" fill="#2f7a4a"/></svg></div>'''
def home():
  ly=P['Lyleen'];lb=P['Lamball'];ct=P['Cattiva']
  cast=''.join(f'<img class="{c}" data-par="{pr}" src="{M["img/pal/"+p["id"]]["files"][-1][0]}" srcset="{srcset("img/pal/"+p["id"])}" sizes="(max-width:899px) 50vw, 34vw" alt="">' for c,pr,p in [('jt',.35,jt),('ly',.12,ly),('lb',.25,lb),('ct',.2,ct)])
  rail=''.join(f'<div style="scroll-snap-align:start">{pcard(P[k])}</div>' for k in ['Jetragon','Lyleen','Grizzbolt','Frostallion','Foxparks','Cattiva','Lamball','Anubis'])
  farm=EA['кого поставить на ферму ягод'].split('\n')[1].replace('• ','')
  bz=[b for b in D['bosses'] if b['pal']=='Блазамут Рю'][0];bzp=RU['Блазамут Рю']
  def vst(n,a,b): return f'<div class="st">{n} <b class="{"w" if a>b else ""}">{a}</b></div>'
  passes=[n for n in an['bp']['рабочий'] if n in PS][:2]
  pchips=''.join(f'<span class="pchip {"r4" if PS[n]["rank"]>=4 else ""}">{n}<small>{html.escape(PS[n]["desc"].split(";")[0])}</small></span>' for n in passes)
  bl=RU['Блазамут']
  b=f'''
<a class="b b-pod rv press" data-tilt href="pal.html"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("star",14)} Пал дня</div><div class="d nm">{an["ru"]}</div>{el("Земля")}
<div class="kv"><div><b>{an["work"][0][1]}</b><span>{an["work"][0][0]}</span></div><div><b>{an["work"][1][1]}</b><span>{an["work"][1][0]}</span></div><div><b>{an["atk"]}</b><span>Атака</span></div></div>{stage(an,animate=True,alt="Анубис")}</a>
<a class="b b-map rv press" href="map.html" style="padding:0">{mapfig(sizes="(max-width:1100px) 100vw, 320px",pins=True)}<div class="ov"><div class="eb">{ic("map",14)} Карта</div><h3>{N["map"]} точек</h3><div class="lg">{"".join(f'<span><i style="background:{PCOL[k]}"></i>{PNAME[k]} {MC[k]}</span>' for k in ["travel","alpha","sealed","tower"])}</div></div></a>
<a class="b b-breed rv press" href="#"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("egg",14)} Разведение</div><h3>Как вывести Анубиса</h3><div class="eq"><img src="{thumb(bl)}" alt="Блазамут">+<img src="{R}{RU["Дупин"]["thumb"]}" alt="Дупин">=<img class="res" src="{thumb(an)}" alt="Анубис"></div><p style="margin-top:8px;font-size:13px">Блазамут + Дупин</p></a>
<a class="b b-boss rv press" href="boss.html">{stage(bzp)}<div><div class="eb">{ic("raid",14)} Рейд</div><h3>{bzp["ru"]}</h3><p>ур. {bz["level"]} · {fmt(bz["hp"])} HP</p></div></a>
<a class="b b-ai rv press" href="#"><div class="eb">{ic("spark",14)} Ответ из базы</div><div class="q">Кого поставить на ферму ягод?</div><div class="a">{farm}<small>Пассивки рабочим: Дьявольские руки, Виртуоз, Мастеровитый</small></div><span class="fu">Где их поймать {ic("arrow",14)}</span><span class="fu">Еда на скорость {ic("arrow",14)}</span>{stage(ly)}</a>
<a class="b b-vs rv press" href="compare.html"><div class="hd2"><div class="eb">{ic("compare",14)} Сравнение</div><span class="go" style="position:static">{ic("arrow",18)}</span></div>
<div class="side">{stage(an)}<div class="nm">{an["ru"]}</div>{vst("Атака",an["atk"],jt["atk"])}{vst("Защита",an["def"],jt["def"])}</div><div class="vs"><span>VS</span></div>
<div class="side">{stage(jt,"flip")}<div class="nm">{jt["ru"]}</div>{vst("Атака",jt["atk"],an["atk"])}{vst("Защита",jt["def"],an["def"])}</div></a>
<a class="b b-pass rv press" href="#"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("spark",14)} Пассивки</div><h3>{N["passives"]} навыков</h3><div class="chips">{pchips}</div></a>
<a class="b b-faq rv press" href="dishes.html" style="background:linear-gradient(135deg,color-mix(in srgb,var(--sun) 30%,var(--card)),var(--card))"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("list",14)} Еда и баффы</div><h3>{len([x for x in F if x["buffs"]])} блюд с баффами</h3><p>Скорость работы, атака, защита — что приготовить.</p></a>'''
  body=f'''<section class="hero">{scene()}<div class="cast">{cast}</div><span class="cap" style="z-index:3;color:#fff;opacity:.55">Палы © Pocketpair · palworld.wiki.gg · фон: Палпедия</span>
<div class="hin"><span class="tag eb" style="color:#fff">{ic("sphere",14)} Palworld 1.0.5</span><h1 class="d">Весь Палпагос в <em>одном</em> поиске</h1><p>Палы, боссы, пассивки и разведение. Спроси как другу — ответ без рекламы и регистрации.</p>
<button class="ask" data-open-search style="border:0;width:100%;text-align:left">{ic("spark",20)}<span>Кого поставить на ферму ягод?</span><b>{ic("arrow",18)}</b></button>
<div class="sugg"><a href="#">Где найти железо</a><a href="#">Как вывести Анубиса</a><a href="compare.html">Сравнить Анубис и Джетрагон</a></div>
<div class="nums"><div><b>{N["pals"]}</b><span>палов</span></div><div><b>{N["passives"]}</b><span>пассивок</span></div><div><b>{N["bosses"]}</b><span>боссов и рейдов</span></div><div><b>{N["faq"]}</b><span>ответа</span></div></div></div></section>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Сегодня на острове</h2></div><section class="bento">{b}</section>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Популярные палы</h2><a href="pal.html">Все {N["pals"]} {ic("arrow",16)}</a></div><p class="note" style="margin-top:0">{ic("spark",14)} Наведи или нажми на пала со значком — он оживёт. Двигается только один, остальные стоят.</p><div class="rail" style="grid-auto-columns:minmax(260px,78%)">{rail}</div>'''
  return page('Палпедия',body,0)
def palp():
  p=an;nx=jt;pv=P['Cattiva']
  st=''.join(f'<div class="stat"><span>{n}</span><i><s style="width:{v*100//mx}%"></s></i><b>{v}</b></div>' for n,v,mx in [('Здоровье',p['hp'],160),('Атака',p['atk'],160),('Защита',p['def'],160),('Спринт',p['sprint'],1600)])
  wi={'Ручная работа':'work','Добыча':'ground','Транспортировка':'arrow'}
  wk=''.join(f'<div class="wt">{ic(wi.get(w,"work"),22)}<b>{l}</b><span>{w}</span></div>' for w,l in p['work'])
  pl=''.join(f'<div class="pi {"g" if PS[n]["rank"]>=4 else ""}"><span class="rk">{PS[n]["rank"]}</span><div><b>{n}</b><span>{html.escape(PS[n]["desc"].split(";")[0])}</span></div></div>' for n in p['bp']['рабочий'] if n in PS)
  body=f'''<section class="ph"><span class="ghost">ANUBIS</span><div><div class="crumb">Палы {ic("arrow",12)} Земля</div><div class="eb" style="margin-top:16px">№{p["no"]} · Редкость {p["rarity"]}</div><h1 class="d">{p["ru"]}</h1>{el("Земля")}
<p class="lede">Лучший ранний рабочий: ручная работа и добыча {p["work"][0][1]} уровня.</p>
<div class="qf"><div><small>{ic("shield",14)}Слабость</small><b>{", ".join(p["weak"])}</b></div><div><small>{ic("work",14)}Работа</small><b>Ручная {p["work"][0][1]} · Добыча {p["work"][1][1]}</b></div><div><small>{ic("egg",14)}Яйцо</small><b>{p["egg"]}</b></div><div><small>{ic("spark",14)}Навык партнёра</small><b>{p["psk"]}</b></div></div></div>
{stage(p,alt=p["ru"],sizes="(max-width:899px) 80vw, 520px")}</section>
<nav class="tabs"><a class="on" href="#">Обзор</a><a href="#">Сборка</a><a href="#">Где найти</a><a href="#">Разведение</a><a href="#">Против боссов</a></nav>
<div class="grid2"><section class="sec rv" style="--e:var(--ground)"><div class="eb">01 · Характеристики</div><h2>Сильнее всего в атаке</h2>{st}</section><section class="sec rv"><div class="eb">02 · База</div><h2>Работа</h2><div class="works">{wk}</div></section></div>
<section class="sec rv" style="margin-top:16px"><div class="row"><div><div class="eb">03 · Сборка</div><h2>Лучшие пассивки</h2></div><span class="seg"><a class="on" href="#">Рабочий</a><a href="#">Боец</a></span></div><div class="pl">{pl}</div></section>
<section class="sec rv" style="margin-top:16px"><div class="eb">04 · Разведение</div><h2>Как вывести</h2><div class="pl"><div class="pi"><span class="rk">1</span><div><b>{bt[1].replace("• Проще всего: ","")}</b><span>Самый простой путь</span></div></div><div class="pi"><span class="rk">2</span><div><b>{bt[3].replace("• ","")}</b><span>Ранняя пара</span></div></div></div></section>
<section class="sec rv" style="margin-top:16px"><div class="eb">05 · Похожие</div><h2>Тоже Земля или ручной труд</h2><div class="cards">{pcard(P["Grizzbolt"])}{pcard(P["Lyleen"])}{pcard(P["Foxparks"],animate=True)}</div></section>
<div class="swp"><a href="#"><img src="{thumb(pv)}" alt="">{pv["ru"]}</a><a href="compare.html">{nx["ru"]}<img src="{thumb(nx)}" alt=""></a></div>'''
  return page('Анубис — Палпедия',body,1)
def compare():
  a,b=an,jt
  rows=[('Здоровье','hp'),('Атака','atk'),('Защита','def'),('Спринт','sprint'),('Редкость','rarity')]
  def row(n,k):
    x,y=a[k],b[k];mx=max(x,y) or 1
    return f'<div class="drow"><div class="l {"win" if x>y else ""}"><b>{x}</b><i><s style="width:{x*100//mx}%"></s></i></div><div class="lab">{n}</div><div class="r {"win" if y>x else ""}"><b>{y}</b><i><s style="width:{y*100//mx}%"></s></i></div></div>'
  wa={w:l for w,l in a['work']};wb={w:l for w,l in b['work']}
  wrows=''.join(row2(w,wa.get(w,0),wb.get(w,0)) for w in sorted(set(wa)|set(wb)))
  side=lambda p,fl:f'<div class="pcard" style="--e:{ev(p)}"><div class="top"><span class="eb">№{p["no"]}</span><span class="badge-anim">{ic("spark",14)}</span></div>{stage(p,cls=fl,animate=True,alt=p["ru"])}<h3>{p["ru"]}</h3><div class="els">{"".join(el(x) for x in p["el"])}</div><div class="wk"><span>Слабость: {", ".join(p["weak"])}</span><span>{p["psk"]}</span></div></div>'
  body=f'''<div class="phd"><div class="eb">{ic("compare",14)} Сравнение</div><h1 class="d">{a["ru"]} или {b["ru"]}?</h1><p>Победитель по каждой цифре подсвечен. Наведи на пала, чтобы он ожил: двигается только один.</p></div>
<section class="cmp">{side(a,"")}<div class="vsx"><div class="vs"><span>VS</span></div></div>{side(b,"flip")}</section>
<section class="sec rv" style="margin-top:16px"><div class="eb">01 · Цифры</div><h2>Характеристики</h2><div class="duel">{"".join(row(n,k) for n,k in rows)}</div></section>
<section class="sec rv" style="margin-top:16px"><div class="eb">02 · База</div><h2>Работа</h2><div class="duel">{wrows}</div></section>
<section class="sec rv" style="margin-top:16px"><div class="eb">03 · Итог</div><h2>Кого брать</h2><div class="pl"><div class="pi g"><span class="rk">{ic("work",18)}</span><div><b>На базу — {a["ru"]}</b><span>Ручная работа {wa.get("Ручная работа",0)} и добыча {wa.get("Добыча",0)} против {wb.get("Ручная работа",0)}/{wb.get("Добыча",0)}</span></div></div><div class="pi"><span class="rk">{ic("boss",18)}</span><div><b>В бой и полёт — {b["ru"]}</b><span>Атака {b["atk"]} против {a["atk"]}, спринт {b["sprint"]} против {a["sprint"]}</span></div></div></div></section>'''
  return page('Сравнение — Палпедия',body,2)
def row2(n,x,y):
  mx=max(x,y,1)
  return f'<div class="drow"><div class="l {"win" if x>y else ""}"><b>{x or "—"}</b><i><s style="width:{x*100//mx}%"></s></i></div><div class="lab">{n}</div><div class="r {"win" if y>x else ""}"><b>{y or "—"}</b><i><s style="width:{y*100//mx}%"></s></i></div></div>'
def places():
  IMG={'Grass':'meadow','Forest':'forest','Desert':'desert_town','Snow':'snow','Sakurajima':'sakura','DarkIsland':'night_base','SkyIsland':'islands','WorldTree':'lyleen_ruins'}
  EC={'Volcano':'fire','Yakushima':'water'}
  dz=collections.Counter(d['region'] for d in LOC['dungeons'])
  order=['WorldTree','Grass','Forest','Volcano','Desert','Snow','Sakurajima','DarkIsland','SkyIsland','Yakushima']
  Rg={r['code']:r for r in LOC['regions']}
  out=''
  for c in order:
    r=Rg[c];lv=r['levels'] if '[' not in r['levels'] else ''
    meta=(f'<span>≈ ур. {lv}</span>' if lv else '')+(f'<span>Подземелий: {dz[c]}</span>' if dz[c] else '')
    if c in IMG:
      b=f'img/scene/{IMG[c]}';fig=f'<figure class="fig"><img src="{M[b]["files"][1][0]}" srcset="{srcset(b)}" sizes="(max-width:1100px) 100vw, 50vw" alt="" loading="eager">{cap(b)}</figure>'
      out+=f'<a class="place rv press" href="map.html">{fig}<div class="in"><div class="eb" style="color:#e8eef2">{ic("pin",14)} Регион</div><h3>{r["ru"]}</h3><div class="meta">{meta}</div></div></a>'
    else:
      out+=f'<a class="place noimg rv press" href="map.html" style="--e:var(--{EC.get(c,"neutral")})"><div class="in"><div class="eb" style="color:#e8eef2">{ic("pin",14)} Регион · фото скоро</div><h3>{r["ru"]}</h3><div class="meta">{meta}</div></div></a>'
  body=f'''<div class="phd"><div class="eb">{ic("pin",14)} Места</div><h1 class="d">Регионы Палпагоса</h1><p>{len(LOC["regions"])} регионов, {len(LOC["dungeons"])} подземелий, {len(LOC["towers"])} башен и {len(LOC["fast_travel"])} точек быстрого перемещения. Уровни — ориентир по экспедициям и подземельям.</p></div>
<div class="filters"><a class="fch on">Все <small>{len(LOC["regions"])}</small></a><a class="fch">С подземельями <small>{len(dz)}</small></a><a class="fch">До 30 уровня</a><a class="fch">Конец игры</a></div>
<section class="cards places" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))">{out}</section>'''
  return page('Места — Палпедия',body,4)
def dishes():
  CC={'Скорость работы':'#3fb950','Атака':'#ff6a2b','Защита':'#2f8fff','Медленнее голод':'#f2c200','Рассудок падает медленнее':'#8b5cf6'}
  L=[x for x in F if x['buffs'] and f'img/food/{x["slug"]}' in M];L.sort(key=lambda x:(-sum(b['pct'] for b in x['buffs']),-x['nutrition']))
  cnt=collections.Counter(b['stat'] for x in L for b in x['buffs'])
  def card(x):
    b=f'img/food/{x["slug"]}';bf=''.join(f'<span class="bfc" style="--c:{CC.get(y["stat"],"#a8957a")}">{y["stat"]} +{y["pct"]}%</span>' for y in x['buffs'])
    return f'<a class="dish rv press" href="#"><figure class="fig"><img src="{M[b]["files"][0][0]}" srcset="{srcset(b)}" sizes="96px" alt="" width="96" height="96">{cap(b)}</figure><div><h3>{x["ru"]}</h3><div class="bf">{bf}</div><small>Сытость {x["nutrition"]} · {x["duration_s"]//60} мин · {x["station"][0]}</small></div></a>'
  body=f'''<div class="phd"><div class="eb">{ic("spark",14)} Еда и баффы</div><h1 class="d">Что приготовить</h1><p>{len(L)} блюд с баффами. Бафф действует указанное время после еды; на базе палы едят сами из ящика.</p></div>
<div class="filters"><a class="fch on">Все <small>{len(L)}</small></a>{"".join(f'<a class="fch">{k} <small>{v}</small></a>' for k,v in cnt.most_common())}</div>
<section class="cards" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))">{"".join(card(x) for x in L[:18])}</section>'''
  return page('Еда — Палпедия',body,5)
def boss():
  n,u=[b for b in D['bosses'] if b['pal']=='Блазамут Рю'];bp=RU['Блазамут Рю']
  def team(b): return ''.join(f'<a href="#"><img src="{thumb(RU[t]) if "img/pal/"+RU[t]["id"] in M else R+RU[t]["thumb"]}" alt="">{t}<small>{RU[t]["el"][0]}</small></a>' for t in b['team'] if t in RU)
  tac=[s.strip() for s in n['tactics'].replace('На ультра','.На ультра').split('.') if s.strip()]
  body=f'''<section class="bossc rv"><div class="bg"></div>{stage(bp,alt=bp["ru"],sizes="(max-width:899px) 92vw, 620px")}
<div class="in"><div class="eb">{ic("raid",14)} Рейд · Манифестация Вечного пламени</div><h1 class="d">{bp["ru"]}</h1><p class="sub">Рейд-босс без тренера: только пал и его ярость.</p>
<div class="segd"><a class="on" href="#">Обычный · ур. {n["level"]}</a><a href="#">Ультра · ур. {u["level"]}</a></div>
<div class="hp"><div class="l"><span>HP</span><span>{fmt(n["hp"])}</span></div><div class="bar"><s></s></div></div>
<div class="bk"><div><small>Уровень</small><b>{n["level"]}</b></div><div><small>Стихии</small>{el(n["el"][1])}</div><div><small>Слабость</small>{el(n["weak"][0])}</div></div>
<div class="bh">Рекомендуемая команда</div><div class="team">{team(n)}</div><div class="bh">Тактика</div><div class="steps">{"".join(f"<div>{t}.</div>" for t in tac)}</div></div></section>'''
  return page('Блазамут Рю — Палпедия',body,3)
def mapp():
  tw=[m for m in PIN['pts'] if m['t']=='tower']
  sel=tw[0]
  body=f'''<div class="phd"><div class="eb">{ic("map",14)} Карта</div><h1 class="d">Палпагос на ладони</h1><p>Все {N["map"]} точек из нашей базы: телепорты, альфы, башни и запечатанные царства.</p></div>
<div class="filters">{"".join(f'<a class="fch on"><i style="width:10px;height:10px;border-radius:50%;background:{PCOL[k]};display:inline-block"></i>{PNAME[k]} <small>{MC[k]}</small></a>' for k in ["travel","alpha","tower","sealed"])}</div>
<div class="mapbox">{mapfig(sizes="(max-width:1300px) 100vw, 1280px",sel=sel["name"])}<div class="mapcard"><div class="eb">{ic("boss",14)} Башня</div><b>{html.escape(sel["name"])}</b><span>Нажми на точку, чтобы открыть карточку. Ближайший телепорт — у входа.</span></div></div>
<section class="sec rv" style="margin-top:16px"><div class="eb">Башни</div><h2>{len(tw)} башен</h2><div class="pl">{"".join(f'<div class="pi"><span class="rk">{ic("boss",18)}</span><div><b>{html.escape(t["name"])}</b><span>{t.get("info") or "Башня"}</span></div></div>' for t in tw)}</div></section>'''
  return page('Карта — Палпедия',body,6)
def search(): return home().replace('class="so"','class="so open"')
def cards():
  ex=[P[k] for k in ['Anubis','Jetragon','Lyleen','Lamball','Cattiva','Grizzbolt','Frostallion','Foxparks']]
  body=f'''<div class="phd"><div class="eb">{ic("sphere",14)} Карточка пала</div><h1 class="d">Финальная карточка</h1><p>Одинаковая обрезка и линия пола у всех палов, подсветка цветом стихии, подпись источника в углу. Анимация — только по наведению или нажатию, одна за раз.</p></div>
<section class="show"><div><div class="lbl">В покое</div><div style="max-width:340px">{pcard(an,animate=True)}</div></div><div><div class="lbl">При наведении (подъём, тень, анимация)</div><div style="max-width:340px">{pcard(an,animate=True,demo=True).replace('data-id="Anubis"','data-id="Anubis-h"')}</div></div></section>
<div class="band"><i></i></div><div class="shd"><h2 class="d">8 палов с анимацией</h2></div><div class="cards">{"".join(pcard(p) for p in ex)}</div>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Без анимации</h2></div><div class="cards">{"".join(pcard(P[k],animate=False) for k in ["Blazamut","Relaxaurus","Pengullet","Depresso"])}</div>'''
  return page('Карточка пала — Палпедия',body,1)
PAGES=dict(home=home,pal=palp,compare=compare,places=places,dishes=dishes,boss=boss,map=mapp,search=search,cards=cards)
for k,f in PAGES.items(): open(k+'.html','w').write(f())
print('ok',list(PAGES))
