import json,html
from icons import ic
D=json.load(open('../../docs/assets/search_data.json'));P={x['en']:x for x in D['pals']}
R='../../docs/';PS={x['name']:x for x in D['passives']}
EK={'Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon','Нейтральный':'neutral'}
def el(e): k=EK[e];return f'<span class="el" style="--e:var(--{k})">{ic(k,16)}{e}</span>'
def ev(e): return f'var(--{EK[e]})'
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap&subset=cyrillic" rel="stylesheet">'
def page(t,body,cls=''): return f'<!doctype html><html lang="ru" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><title>{t}</title>{FONTS}<link rel="stylesheet" href="style.css"></head><body class="{cls}">{body}<script src="fx.js"></script></body></html>'
def header(on=0):
  n=''.join(f'<a class="{"on" if i==on else ""}">{x}</a>' for i,x in enumerate(['Палы','Боссы','Пассивки','Разведение','Карта']))
  return f'<header class="hd"><div class="wrap"><a class="brand"><span class="ball"></span>Палпедия</a><nav class="nav">{n}</nav><a class="sp">{ic("search",18)}<span>Найти или спросить</span><kbd>Ctrl K</kbd></a><button class="tg" aria-label="Тема">{ic("sun",18)}</button></div></header>'
def bnav(on=0):
  it=[('home','Главная'),('sphere','Палы'),('search','Поиск'),('heart','Мои'),('list','Ещё')]
  return '<nav class="bn">'+''.join(f'<a class="{"on" if i==on else ""}">{ic(a,22)}{b}</a>' for i,(a,b) in enumerate(it))+'</nav>'
def card(p):
  e=p['el'][0];return f'<a class="pc rv" data-tilt style="--e:{ev(e)}"><span class="no mono">№{p["no"]}</span><img src="{R}{p["art"]}" alt="" loading="lazy"><h4>{p["ru"]}</h4>{"".join(el(x) for x in p["el"])}</a>'
an=P['Anubis']
def home():
  rail=''.join(card(P[k]) for k in ['Jetragon','Frostallion','Grizzbolt','Cattiva','Lamball','Anubis','Lyleen' if 'Lyleen' in P else 'Lamball'][:6])
  pchips=''.join(f'<span class="pchip {"r5" if PS[n]["rank"]>=4 else ""}">{n}<small>{html.escape(PS[n]["desc"].split(";")[0])}</small></span>' for n in an['bp']['рабочий'][:3]+an['bp']['боец'][:1] if n in PS)
  b=f'''
<a class="b b-pod rv" data-tilt><div class="k mono">{ic("star",16)} Пал дня</div><div class="d nm">{an["ru"]}</div>{el("Земля")}
<div class="mini"><div><b>6</b><span>Ручная работа</span></div><div><b>6</b><span>Добыча</span></div><div><b>130</b><span>Атака</span></div></div><img src="{R}{an["art"]}" alt=""></a>
<a class="b b-map rv"><img src="{R}assets/hero_map.webp" alt=""><span class="pinm" style="left:38%;top:34%"></span><span class="pinm" style="left:62%;top:52%;animation-delay:.8s"></span><div class="ov"><div class="k mono" style="color:#dfe6ea">{ic("map",16)} Карта</div><h3>232 точки на острове</h3><p>Альфы, башни, торговцы — тап по точке.</p></div></a>
<a class="b b-breed rv"><div class="k mono">{ic("egg",16)} Разведение</div><h3>Кого скрестить?</h3><div class="eq"><img src="{R}{P["Cattiva"]["thumb"]}" alt="">+<img src="{R}{P["Lamball"]["thumb"]}" alt="">=<img class="res" src="{R}{P["Jetragon"]["thumb"]}" alt=""></div></a>
<a class="b b-boss rv"><img src="{R}{P["Grizzbolt"]["art"]}" alt=""><div class="k mono" style="color:#ffd400">{ic("boss",16)} Башня</div><h3>Зои и Гриззболт</h3><p>ур. 10 · слабость — Земля</p></a>
<a class="b b-ai rv"><div class="k mono" style="color:#ffd400">{ic("spark",16)} Ответ за секунду</div><div class="q">Кого поставить на ферму ягод?</div><div class="a">Лифмунк или Танзи: Посадка 1–2 уровня, дёшево ловятся в начале.</div><span class="fu">Где поймать? {ic("arrow",14)}</span><span class="fu">Лучшие пассивки {ic("arrow",14)}</span></a>
<a class="b b-pass rv"><div class="k mono">{ic("spark",16)} Пассивки</div><h3>411 навыков</h3><div class="chips">{pchips}</div></a>
<a class="b rv"><div class="k mono">{ic("compare",16)} Сравнение</div><h3>Анубис или Джетрагон?</h3><p>Два пала рядом, победитель по каждой цифре подсвечен.</p></a>'''
  body=f'''{header()}<main class="wrap">
<section class="hero"><img src="../ref/steam_14.jpg" alt=""><div class="hin"><span class="tag mono">{ic("sphere",16)} Palworld 1.0.5<span class="x"> · обновлено сегодня</span></span>
<h1 class="d">Весь Палпагос<br>в <em>одном</em> поиске</h1><p>Палы, боссы, пассивки и разведение. Спроси как другу — ответ без рекламы и регистрации.</p>
<a class="ask">{ic("spark",20)}<span>Кого поставить на ферму ягод?</span><b>{ic("arrow",18)}</b></a>
<div class="sugg"><a>Где железо</a><a>Сравнить Анубис и Лифмунк</a><a>Как вывести Джетрагона</a></div>
<div class="nums"><div><b>299</b><span>палов</span></div><div><b>411</b><span>пассивок</span></div><div><b>91</b><span>босс</span></div><div><b>503</b><span>ответа</span></div></div></div></section>
<div class="band"><i></i></div><div class="sh"><h2 class="d">Сегодня на острове</h2></div><section class="bento">{b}</section>
<div class="band"><i></i></div><div class="sh"><h2 class="d">Популярные палы</h2><a>Все 299 {ic("arrow",16)}</a></div><div class="rail">{rail}</div>
<footer>Палпедия — фанатская энциклопедия. Palworld © Pocketpair, Inc.</footer></main>{bnav(0)}'''
  return page('Палпедия',body)
def palp():
  p=an;nx=P['Jetragon'];pv=P['Cattiva']
  st=''.join(f'<div class="stat"><span>{n}</span><i><s style="width:{v*100//160}%"></s></i><b>{v}</b></div>' for n,v in [('Здоровье',p['hp']),('Атака',p['atk']),('Защита',p['def']),('Скорость',p['sprint']//10)])
  wi={'Ручная работа':'work','Добыча':'ground','Транспортировка':'arrow'}
  wk=''.join(f'<div class="wt">{ic(wi.get(w,"work"),22)}<b>{l}</b><span>{w}</span></div>' for w,l in p['work'])
  pl=''.join(f'<div class="pi {"g" if PS[n]["rank"]>=4 else ""}"><span class="rk">{PS[n]["rank"]}</span><div><b>{n}</b><span>{html.escape(PS[n]["desc"].split(";")[0])}</span></div></div>' for n in p['bp']['рабочий'] if n in PS)
  body=f'''{header(0)}<main class="wrap">
<section class="ph"><span class="ghost">ANUBIS</span><div><div class="top"><span class="mono">№{p["no"]} · Редкость {p["rarity"]}</span></div><h1 class="d">{p["ru"]}</h1>{el("Земля")}
<div class="qf"><div><small>{ic("shield",14)}Слабость</small><b>Трава</b></div><div><small>{ic("work",14)}Лучшая работа</small><b>Ручная 6 · Добыча 6</b></div><div><small>{ic("egg",14)}Яйцо</small><b>Огромное земли</b></div><div><small>{ic("spark",14)}Навык</small><b>{p["psk"]}</b></div></div></div>
<img class="art" src="{R}{p["art"]}" alt="{p["ru"]}"></section>
<nav class="tabs"><a class="on">Обзор</a><a>Сборка</a><a>Где найти</a><a>Разведение</a><a>Боссы</a></nav>
<div class="grid2"><section class="b rv" style="--e:var(--ground)"><div class="k mono">Характеристики</div>{st}</section>
<section class="b rv"><div class="k mono">Работа на базе</div><div class="works" style="margin-top:12px">{wk}</div></section></div>
<section class="b rv" style="margin-top:12px"><div class="k mono" style="justify-content:space-between">Лучшие пассивки<span class="seg" style="margin:0"><a class="on">Рабочий</a><a>Боец</a></span></div><div class="pl" style="margin-top:10px">{pl}</div></section>
<div class="swp"><a><img src="{R}{pv["thumb"]}" alt="">← {pv["ru"]}</a><a>{nx["ru"]} →<img src="{R}{nx["thumb"]}" alt=""></a></div>
<footer></footer></main>{bnav(1)}'''
  return page('Анубис',body)
def search():
  body=f'''<div class="scrim"></div><div class="scrim2"></div><div class="pal"><div class="box">
<div class="inp">{ic("search",22)}<span class="t">ануб</span><kbd>Esc</kbd></div>
<div class="aia"><div class="h">{ic("spark",16)} Быстрый ответ</div><p><b>Анубис</b> — пал Земли, ручная работа и добыча 6 уровня. Ловится в Пустынных дюнах, вылупляется из Огромного яйца земли.</p><span class="chipb">Как вывести {ic("arrow",14)}</span><span class="chipb">Сравнить с Джетрагоном {ic("compare",14)}</span></div>
<div class="gr mono">Палы</div>
<div class="rs sel"><span class="th"><img src="{R}{an["thumb"]}" alt=""></span><div><b><mark>Ануб</mark>ис</b><span>№139 · Земля · Ручная 6</span></div>{ic("arrow",18)}</div>
<div class="gr mono">Гайды и боссы</div>
<div class="rs"><span class="th">{ic("work",20)}</span><div><b>Сборка <mark>Ануб</mark>иса на ручной труд</b><span>4 пассивки · план на 20 минут</span></div></div>
<div class="rs"><span class="th">{ic("boss",20)}</span><div><b>Боссы, слабые к Земле</b><span>7 боссов · Гриззболт, Орсерк…</span></div></div>
<div class="gr mono">Недавние</div>
<div class="rs"><span class="th">{ic("clock",20)}</span><div><b>Где железо</b><span>Металлическая руда</span></div></div>
<div class="ft"><span><kbd>↑↓</kbd> выбор</span><span><kbd>Enter</kbd> открыть</span><span><kbd>Tab</kbd> спросить</span></div></div></div>'''
  return page('Поиск',body)
def boss():
  g=P['Grizzbolt'];team=''.join(f'<div><img src="{R}{P[e]["thumb"]}" alt="">{P[e]["ru"]}</div>' for e in ['Anubis','Lamball','Cattiva'])
  body=f'''{header(1)}<main class="wrap"><section class="bossc"><div class="bg"></div><img class="art rv" src="{R}{g["art"]}" alt="">
<div class="in"><span class="mono" style="color:#ffd400">Башня · Отряд браконьеров Рейн</span><h1 class="d">Зои и Гриззболт</h1>
<div class="segd"><a class="on">Обычный</a><a>Сложный</a></div>
<div class="hp"><div class="l"><span>HP</span><span>12 900</span></div><div class="bar"><s></s></div></div>
<div class="bk"><div><small>Уровень</small><b>10</b></div><div><small>Стихия</small>{el("Молния")}</div><div><small>Слабость</small>{el("Земля")}</div></div>
<div class="k mono" style="margin-top:18px;color:#aab4bd">Кем бить</div><div class="team">{team}</div>
<div class="k mono" style="margin-top:18px;color:#aab4bd">Тактика</div><div class="steps"><div>Держись за своим палом — Гриззболт бьёт вперёд.</div><div>Кувырок от больших атак, следи за таймером.</div><div>Средней кнопкой мыши приказывай атаковать.</div></div>
</div></section><footer></footer></main>{bnav(1)}'''
  return page('Босс',body)
for n,f in [('home',home),('pal',palp),('search',search),('boss',boss)]: open(n+'.html','w').write(f())
