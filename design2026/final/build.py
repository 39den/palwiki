import json,html,os
from icons import ic
D=json.load(open('../../docs/assets/search_data.json'));P={x['en']:x for x in D['pals']};RU={x['ru']:x for x in D['pals']}
EA=json.load(open('engine_answers.json'));PS={x['name']:x for x in D['passives']};BR=json.load(open('../../docs/assets/breeding.json'))
R='../../docs/'
EK={'Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon','Нейтральный':'neutral'}
def el(e): k=EK[e];return f'<span class="el" style="--e:var(--{k})">{ic(k,16)}{e}</span>'
def ev(p): return f'var(--{EK[p["el"][0]]})'
def art(p): f=f'art/{p["id"]}.webp';return f if os.path.exists(f) else R+p['art']
def thumb(p): return R+p['thumb']
def stage(p,cls='',alt=''): return f'<div class="stage {cls}" style="--e:{ev(p)}"><img src="{art(p)}" alt="{alt}"></div>'
def fmt(v): return f'{v:,}'.replace(',','\u202f')
N=dict(pals=len(D['pals']),passives=len(D['passives']),bosses=len(D['bosses']),faq=len(D['faq']),map=len(D['map']))
def page(t,body):
  return f'''<!doctype html><html lang="ru" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><title>{t}</title>
<link rel="preload" href="fonts/Unbounded-600-cyrillic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="fonts/Manrope-400-cyrillic.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="style.css"></head><body>{body}{SO}<script src="fx.js"></script></body></html>'''
def header(on=0):
  n=''.join(f'<a class="{"on" if i==on else ""}" href="#">{x}</a>' for i,x in enumerate(['Палы','Боссы','Пассивки','Разведение','Карта']))
  return f'<header class="hd"><div class="wrap"><a class="brand" href="home.html"><span class="ball"></span>Палпедия</a><nav class="nav">{n}</nav><button class="sp" data-open-search>{ic("search",18)}<span class="full">Найти или спросить</span><span class="short">Поиск</span><kbd>Ctrl K</kbd></button><button class="tg" aria-label="Сменить тему"><span class="sun">{ic("sun",18)}</span><span class="moon">{ic("moon",18)}</span></button></div></header>'
def bnav(on=0):
  it=[('home','Главная'),('sphere','Палы'),('search','Поиск'),('heart','Мои'),('list','Ещё')]
  return '<nav class="bn">'+''.join(f'<a class="{"on" if i==on else ""}" {"data-open-search" if a=="search" else ""} href="#">{ic(a,22)}{b}</a>' for i,(a,b) in enumerate(it))+'</nav>'
FOOT=f'''<footer><b>Палпедия — фанатская некоммерческая энциклопедия по Palworld 1.0.5.</b><span>Не является официальным продуктом и не связана с Pocketpair, Inc. Palworld, имена и изображения палов © Pocketpair, Inc.; используются по <a href="https://www.pocketpair.jp/en/guidelines-derivativework-en/">Guidelines for Derivative Works</a>.</span><span>Сцена на главной собрана из наших рендеров палов; фон нарисован нами.</span></footer>'''
an=P['Anubis']
# real search content
bw=[b for b in D['bosses'] if 'Земля' in b['weak']];bwn=sorted({b['pal'] for b in bw})
breed_txt=EA['как вывести анубиса'].split('\n')
SO=f'''<div class="so" id="so" role="dialog" aria-label="Поиск"><div class="scrim" data-close></div><div class="box">
<div class="inp">{ic("search",22)}<span class="t">ануб</span><kbd>Esc</kbd></div>
<div class="aia"><div class="h">{ic("spark",16)} Ответ из базы</div><p><b>{breed_txt[0].replace("🥚 ","")}</b></p><ul><li>{breed_txt[1].replace("• ","")}</li><li>Простые пары: {", ".join(l.replace("• ","") for l in breed_txt[3:6])}</li></ul><a class="chipb" href="#">Все пары {ic("arrow",14)}</a><a class="chipb" href="#">Сравнить с Джетрагоном {ic("compare",14)}</a></div>
<div class="gr eb">Палы</div>
<a class="rs sel" href="pal.html"><span class="th"><img src="{thumb(an)}" alt=""></span><div><b><mark>Ануб</mark>ис</b><span>№{an["no"]} · Земля · Ручная работа {an["work"][0][1]}, Добыча {an["work"][1][1]}</span></div>{ic("arrow",18)}</a>
<div class="gr eb">Боссы</div>
<a class="rs" href="boss.html"><span class="th">{ic("boss",20)}</span><div><b>Боссы, слабые к Земле: {len(bw)}</b><span>{", ".join(bwn[:4])}…</span></div></a>
<div class="gr eb">Недавние</div>
<a class="rs" href="#"><span class="th">{ic("clock",20)}</span><div><b>Где найти железо</b><span>{EA["где найти железо"].split(chr(10))[0].replace("🎒 ","")} · рудник на базе, горы</span></div></a>
<div class="ft"><span><kbd>↑↓</kbd> выбор</span><span><kbd>Enter</kbd> открыть</span><span><kbd>Esc</kbd> закрыть</span></div></div></div>'''
def mapsvg():
  xs=[m['x'] for m in D['map']];ys=[m['y'] for m in D['map']];x0,x1,y0,y1=min(xs),max(xs),min(ys),max(ys)
  C={'travel':'#5cc8ef','alpha':'#ffd400','tower':'#ff6a2b','sealed':'#d94fc0'}
  dots=''.join(f'<circle cx="{8+84*(m["x"]-x0)/(x1-x0):.1f}" cy="{6+70*(1-(m["y"]-y0)/(y1-y0)):.1f}" r="{1.6 if m["t"]=="tower" else .9}" fill="{C[m["t"]]}" opacity=".9"/>' for m in D['map'])
  return f'<svg class="m" viewBox="0 0 100 100" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><defs><pattern id="g" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="rgba(255,255,255,.05)" stroke-width=".3"/></pattern></defs><rect width="100" height="100" fill="url(#g)"/>{dots}</svg>'
import collections
MC=collections.Counter(m['t'] for m in D['map'])
def scene():
  return '''<div class="scene"><div class="sun"></div><span class="cl" style="width:120px;left:8%;top:14%"></span><span class="cl" style="width:80px;left:70%;top:24%;animation-duration:55s"></span>
<svg viewBox="0 0 1440 400" preserveAspectRatio="none" style="bottom:22%;height:30%"><path d="M0 260 C180 170 300 210 420 150 C560 80 640 200 760 170 C900 130 980 60 1120 120 C1260 180 1350 140 1440 160 V400 H0Z" fill="#7bb7a4" opacity=".55"/></svg>
<svg viewBox="0 0 1440 400" preserveAspectRatio="none" style="bottom:8%;height:30%"><path d="M0 220 C200 150 340 260 520 200 C700 140 820 250 1000 210 C1160 175 1300 240 1440 200 V400 H0Z" fill="#4d9a6a"/></svg>
<svg viewBox="0 0 1440 400" preserveAspectRatio="none" style="bottom:0;height:22%"><path d="M0 200 C240 120 420 220 640 170 C860 120 1080 230 1440 150 V400 H0Z" fill="#2f7a4a"/></svg></div>'''
def home():
  ly=P['Lyleen'];jt=P['Jetragon'];lb=P['Lamball'];ct=P['Cattiva']
  rail=''.join(f'<a class="pc rv press" data-tilt href="pal.html" style="--e:{ev(p)}"><span class="no eb">№{p["no"]}</span>{stage(p)}<h4>{p["ru"]}</h4>{"".join(el(x) for x in p["el"])}</a>' for p in [P[k] for k in ['Jetragon','Frostallion','Grizzbolt','Lyleen','Cattiva','Lamball']])
  passes=[n for n in an['bp']['рабочий'] if n in PS][:2]
  pchips=''.join(f'<span class="pchip {"r4" if PS[n]["rank"]>=4 else ""}">{n}<small>{html.escape(PS[n]["desc"].split(";")[0])}</small></span>' for n in passes)
  farm=EA['кого поставить на ферму ягод'].split('\n')[1].replace('• ','')
  bl=RU['Блазамут'];du=RU.get('Дупин')
  vsA,vsB=an,jt
  def vst(n,a,b): return f'<div class="st">{n} <b class="{"w" if a>b else ""}">{a}</b></div>'
  bz=[b for b in D['bosses'] if b['name']=='Манифестация Вечного пламени Блазамут Рю'][0];bzp=RU['Блазамут Рю']
  b=f'''
<a class="b b-pod rv press" data-tilt href="pal.html"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("star",14)} Пал дня</div><div class="d nm">{an["ru"]}</div>{el("Земля")}
<div class="kv"><div><b>{an["work"][0][1]}</b><span>{an["work"][0][0]}</span></div><div><b>{an["work"][1][1]}</b><span>{an["work"][1][0]}</span></div><div><b>{an["atk"]}</b><span>Атака</span></div></div>{stage(an)}</a>
<a class="b b-map rv press" href="#">{mapsvg()}<span class="go" style="background:rgba(255,255,255,.12)">{ic("arrow",18)}</span><div class="ov"><div class="eb">{ic("map",14)} Карта</div><h3>{N["map"]} точек</h3><div class="lg"><span><i style="background:#5cc8ef"></i>Телепорты {MC["travel"]}</span><span><i style="background:#ffd400"></i>Альфы {MC["alpha"]}</span><span><i style="background:#d94fc0"></i>Запечатанные {MC["sealed"]}</span><span><i style="background:#ff6a2b"></i>Башни {MC["tower"]}</span></div></div></a>
<a class="b b-breed rv press" href="#"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("egg",14)} Разведение</div><h3>Как вывести Анубиса</h3><div class="eq"><img src="{thumb(bl)}" alt="{bl["ru"]}">+<img src="{thumb(du) if du and du.get("thumb") else thumb(bl)}" alt="Дупин">=<img class="res" src="{thumb(an)}" alt="Анубис"></div><p style="margin-top:8px;font-size:13px">Блазамут + Дупин</p></a>
<a class="b b-boss rv press" href="boss.html">{stage(bzp)}<div><div class="eb">{ic("raid",14)} Рейд</div><h3>{bzp["ru"]}</h3><p>ур. {bz["level"]} · {fmt(bz["hp"])} HP</p></div></a>
<a class="b b-ai rv press" href="#"><div class="eb">{ic("spark",14)} Ответ из базы — без ИИ-лимита</div><div class="q">Кого поставить на ферму ягод?</div><div class="a">{farm}<small>Пассивки рабочим: Дьявольские руки, Виртуоз, Мастеровитый</small></div><span class="fu">Где их поймать {ic("arrow",14)}</span><span class="fu">Еда на скорость {ic("arrow",14)}</span>{stage(ly)}</a>
<a class="b b-vs rv press" href="#"><div class="hd2"><div class="eb">{ic("compare",14)} Сравнение</div><span class="go" style="position:static">{ic("arrow",18)}</span></div>
<div class="side">{stage(vsA)}<div class="nm">{vsA["ru"]}</div>{vst("Атака",vsA["atk"],vsB["atk"])}{vst("Защита",vsA["def"],vsB["def"])}</div><div class="vs"><span>VS</span></div>
<div class="side">{stage(vsB,"flip")}<div class="nm">{vsB["ru"]}</div>{vst("Атака",vsB["atk"],vsA["atk"])}{vst("Защита",vsB["def"],vsA["def"])}</div></a>
<a class="b b-pass rv press" href="#"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("spark",14)} Пассивки</div><h3>{N["passives"]} навыков</h3><div class="chips">{pchips}</div></a>
<a class="b b-faq rv press" href="#" style="background:linear-gradient(135deg,color-mix(in srgb,var(--sun) 30%,var(--card)),var(--card))"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("list",14)} Частые вопросы</div><h3>{N["faq"]} ответа</h3><p>Яйца, база, сервер, ловля — коротко и без воды.</p></a>'''
  body=f'''{header()}<main class="wrap">
<section class="hero">{scene()}<div class="cast"><img class="jt" data-par=".35" src="{art(jt)}" alt=""><img class="ly" data-par=".12" src="{art(ly)}" alt=""><img class="lb" data-par=".25" src="{art(lb)}" alt=""><img class="ct" data-par=".2" src="{art(ct)}" alt=""></div>
<div class="hin"><span class="tag eb" style="color:#fff">{ic("sphere",14)} Palworld 1.0.5</span>
<h1 class="d">Весь Палпагос в <em>одном</em> поиске</h1><p>Палы, боссы, пассивки и разведение. Спроси как другу — ответ без рекламы и регистрации.</p>
<button class="ask" data-open-search style="border:0;width:100%;text-align:left">{ic("spark",20)}<span>Кого поставить на ферму ягод?</span><b>{ic("arrow",18)}</b></button>
<div class="sugg"><a href="#">Где найти железо</a><a href="#">Как вывести Анубиса</a><a href="#">Сравнить Анубис и Джетрагон</a></div>
<div class="nums"><div><b>{N["pals"]}</b><span>палов</span></div><div><b>{N["passives"]}</b><span>пассивок</span></div><div><b>{N["bosses"]}</b><span>боссов и рейдов</span></div><div><b>{N["faq"]}</b><span>ответа</span></div></div></div></section>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Сегодня на острове</h2></div><section class="bento">{b}</section>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Популярные палы</h2><a href="#">Все {N["pals"]} {ic("arrow",16)}</a></div><div class="rail">{rail}</div>
{FOOT}</main>{bnav(0)}'''
  return page('Палпедия',body)
def palp():
  p=an;nx=P['Jetragon'];pv=P['Cattiva']
  st=''.join(f'<div class="stat"><span>{n}</span><i><s style="width:{v*100//mx}%"></s></i><b>{v}</b></div>' for n,v,mx in [('Здоровье',p['hp'],160),('Атака',p['atk'],160),('Защита',p['def'],160),('Спринт',p['sprint'],1600)])
  wi={'Ручная работа':'work','Добыча':'ground','Транспортировка':'arrow'}
  wk=''.join(f'<div class="wt">{ic(wi.get(w,"work"),22)}<b>{l}</b><span>{w}</span></div>' for w,l in p['work'])
  def pl(k): return ''.join(f'<div class="pi {"g" if PS[n]["rank"]>=4 else ""}"><span class="rk">{PS[n]["rank"]}</span><div><b>{n}</b><span>{html.escape(PS[n]["desc"].split(";")[0])}</span></div></div>' for n in p['bp'][k] if n in PS)
  bt=EA['как вывести анубиса'].split('\n')
  body=f'''{header(0)}<main class="wrap">
<section class="ph"><span class="ghost">ANUBIS</span><div><div class="crumb">Палы {ic("arrow",12)} Земля</div><div class="eb" style="margin-top:16px">№{p["no"]} · Редкость {p["rarity"]}</div><h1 class="d">{p["ru"]}</h1>{el("Земля")}
<p class="lede">Лучший ранний рабочий: ручная работа и добыча {p["work"][0][1]} уровня.</p>
<div class="qf"><div><small>{ic("shield",14)}Слабость</small><b>{", ".join(p["weak"])}</b></div><div><small>{ic("work",14)}Работа</small><b>Ручная {p["work"][0][1]} · Добыча {p["work"][1][1]}</b></div><div><small>{ic("egg",14)}Яйцо</small><b>{p["egg"]}</b></div><div><small>{ic("spark",14)}Навык партнёра</small><b>{p["psk"]}</b></div></div></div>
{stage(p,alt=p["ru"])}</section>
<nav class="tabs"><a class="on" href="#">Обзор</a><a href="#">Сборка</a><a href="#">Где найти</a><a href="#">Разведение</a><a href="#">Против боссов</a></nav>
<div class="grid2"><section class="sec rv" style="--e:var(--ground)"><div class="eb">01 · Характеристики</div><h2>Сильнее всего в атаке</h2>{st}</section>
<section class="sec rv"><div class="eb">02 · База</div><h2>Работа</h2><div class="works">{wk}</div></section></div>
<section class="sec rv" style="margin-top:16px"><div class="row"><div><div class="eb">03 · Сборка</div><h2>Лучшие пассивки</h2></div><span class="seg"><a class="on" href="#">Рабочий</a><a href="#">Боец</a></span></div><div class="pl">{pl("рабочий")}</div></section>
<section class="sec rv" style="margin-top:16px"><div class="eb">04 · Разведение</div><h2>Как вывести</h2><div class="pl"><div class="pi"><span class="rk">1</span><div><b>{bt[1].replace("• Проще всего: ","")}</b><span>Самый простой путь</span></div></div><div class="pi"><span class="rk">2</span><div><b>{bt[3].replace("• ","")}</b><span>Ранняя пара</span></div></div></div></section>
<div class="swp"><a href="#"><img src="{thumb(pv)}" alt="">{pv["ru"]}</a><a href="#">{nx["ru"]}<img src="{thumb(nx)}" alt=""></a></div>
{FOOT}</main>{bnav(1)}'''
  return page('Анубис — Палпедия',body)
def search(): return home().replace('class="so"','class="so open"')
def boss():
  bz=[b for b in D['bosses'] if b['pal']=='Блазамут Рю'];n,u=bz
  bp=RU['Блазамут Рю']
  def team(b): return ''.join(f'<a href="#"><img src="{thumb(RU[t])}" alt="">{t}<small>{RU[t]["el"][0]}</small></a>' for t in b['team'] if t in RU)
  tac=[s.strip() for s in n['tactics'].replace('На ультра','.На ультра').split('.') if s.strip()]
  body=f'''{header(1)}<main class="wrap"><section class="bossc rv"><div class="bg"></div>{stage(bp,alt=bp["ru"])}
<div class="in"><div class="eb">{ic("raid",14)} Рейд · Манифестация Вечного пламени</div><h1 class="d">{bp["ru"]}</h1><p class="sub">Рейд-босс без тренера: только пал и его ярость.</p>
<div class="segd"><a class="on" href="#">Обычный · ур. {n["level"]}</a><a href="#">Ультра · ур. {u["level"]}</a></div>
<div class="hp"><div class="l"><span>HP</span><span>{fmt(n["hp"])}</span></div><div class="bar"><s></s></div></div>
<div class="bk"><div><small>Уровень</small><b>{n["level"]}</b></div><div><small>Стихии</small>{el(n["el"][1])}</div><div><small>Слабость</small>{el(n["weak"][0])}</div></div>
<div class="bh">Рекомендуемая команда</div><div class="team">{team(n)}</div>
<div class="bh">Тактика</div><div class="steps">{"".join(f"<div>{t}.</div>" for t in tac)}</div>
</div></section>{FOOT}</main>{bnav(1)}'''
  return page('Блазамут Рю — Палпедия',body)
for nm,f in [('home',home),('pal',palp),('search',search),('boss',boss)]: open(nm+'.html','w').write(f())
