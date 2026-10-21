"""Макет «Работа палов» из palwiki/data/work_suitability.json. Только макет, не деплоить."""
import json,re,html
D=json.load(open('/workspace/palwiki/data/work_suitability.json'))
F='../final2/'
pal=open(F+'pal.html').read()
hdr=pal[pal.index('<header'):pal.index('</header>')+9]
hdr=re.sub(r'href="(\w+)\.html"',lambda m:f'href="{F}{m.group(1)}.html"',hdr).replace('class="on" ','class="" ')
bn=pal[pal.index('<nav class="bn"'):pal.index('</nav>',pal.index('<nav class="bn"'))+6]
bn=re.sub(r'href="(\w+)\.html"',lambda m:f'href="{F}{m.group(1)}.html"',bn).replace('class="on"','class=""')
CH='<svg class="i chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
def qm(id_,text): return f'<button class="qm" type="button" aria-label="Подсказка" aria-expanded="false" aria-controls="{id_}">?</button><div class="tip" id="{id_}" role="tooltip">{text}</div>'
e=html.escape
chips=''.join(f'<button class="wc" type="button" data-w="{w["id"]}" aria-pressed="{"true" if i==0 else "false"}"><span class="em">{w["emoji"]}</span>{e(w["short"])}</button>' for i,w in enumerate(D['work_types']))
R=D['raise_methods']
def acc(r,open_=False,extra=''):
    return f'<details class="ac"{" open" if open_ else ""}><summary><span class="ic">{r["emoji"]}</span><b>{e(r["title"])}</b><span class="plus">{e(r["plus"])}</span>{CH}</summary><div class="bd">{extra}</div></details>'
cond=next(r for r in R if r['id']=='condense'); book=next(r for r in R if r['id']=='book'); aura=next(r for r in R if r['id']=='aura'); farm=next(r for r in R if r['id']=='farm_passive')
stars=''.join(f'<div><b>★{i+1}</b><span>{c} копий</span></div>' for i,c in enumerate(cond['copies']))
acc_html=(acc(cond,True,f'<p>★1–★3: +1 к трём лучшим работам. ★4: +1 ко всем.</p><div class="stars">{stars}</div>')
 +acc(dict(book,title='Книги'),False,'<p>Навсегда +1 к одной работе. Работа у пала уже должна быть.</p><p>Сначала звёзды, потом книга — так ничего не пропадёт.</p><div class="aur" id="books"></div>')
 +acc(aura,False,'<p>Даёт +1 всем остальным палам на базе. Два одинаковых не складываются.</p><div class="aur">'+''.join(f'<span class="pill">{w["emoji"]} {e(w["aura"]["pal"])}</span>' for w in D['work_types'])+'</div>')
 +acc(farm,False,'<p>«Ребёнок фермы» +1, «Хозяин фермы» +2. Только для фермы.</p>')
 +acc(dict(emoji='🔝',title='Выше 10 нельзя',plus='10'),False,'<p>Лишний +1 на 10-м уровне пропадает. Дальше разгоняй скорость — смотри ниже.</p>'))
B={b['id']:b for b in D['bonuses']}
tiles=[('passives','🧬','+245%','Пассивки','4 лучших вместе'),('food','🍔','+50%','Еда','Гамбургер с Моззариной'),('souls','👻','+60%','Души','20 шагов по +3%'),
       ('buildings','🏛️','+20%','Постройки','все ускорители базы'),('station','⚙️','×1,5–4','Станок','электропечь ×3')]
boost=''.join(f'<div class="bt"><span class="em">{em}</span><b>{v}</b><h3>{t}</h3><p>{p}</p></div>' for _,em,v,t,p in tiles)
data=json.dumps(dict(w=[dict(id=w['id'],ru=w['ru'],short=w['short'],em=w['emoji'],L=w['levels'],what=w['what'],note=w.get('note'),unit=w.get('unit'),kind=w['kind'],
     aura=w['aura']['pal'],book=w['book'],extra=w.get('extra'),hide=bool(w.get('values_status'))) for w in D['work_types']]),ensure_ascii=False)
page=f'''<!doctype html><html lang="ru" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><title>Работа палов — Палпедия</title>
<link rel="preload" href="{F}fonts/Unbounded-600-cyrillic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="{F}fonts/Manrope-400-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{F}fonts.css"><link rel="stylesheet" href="{F}style.css"><link rel="stylesheet" href="ws.css"></head><body>{hdr}
<main class="wrap">
<section class="wsh"><span class="ghost">×10</span><div class="eb">Механика · база</div><h1 class="d">Работа палов</h1><p class="lede">Сравни себя с палом и разгони базу.</p>
<div class="facts"><div><b>10</b><span>потолок уровня</span></div><div><b>+50</b><span>за очко героя</span></div><div><b>×9,9</b><span>с бонусами</span></div></div></section>

<section class="blk rv"><div class="hrow"><h2>Сила по уровням</h2>{qm('t1','Сила — сколько работы пал делает за секунду. Герой без очков = 100. Шкала у героя и пала одна.')}</div>
<div class="wchips" role="toolbar" aria-label="Вид работы">{chips}</div>
<div class="lvls" id="lvls"></div><p class="wnote" id="wnote"></p></section>

<section class="blk rv"><div class="hrow"><h2>Калькулятор</h2>{qm('t2','Герой работает руками только за станком, поэтому сравниваем ручную работу. Время = нагрузка ÷ (скорость ÷ 100).')}</div>
<div class="calc">
<div class="side"><div class="eb">🧑 Ты</div>
<div class="two"><label class="fld"><span>Скорость работы</span><div class="inp"><input id="ps" inputmode="numeric" type="number" min="0" placeholder="1000" aria-label="Твоя скорость работы"></div></label>
<label class="fld"><span>Нагрузка</span><div class="inp"><input id="wl" inputmode="numeric" type="number" min="0" placeholder="3000" aria-label="Нагрузка рецепта"></div></label></div>
<div class="tog"><button class="tc" type="button" data-p="20" aria-pressed="false">📿 Амулет +20%</button><button class="tc" type="button" data-p="25" aria-pressed="false">📣 Мотиватор +25%</button></div>
<div class="eb" style="margin-top:20px">🐾 Пал <span style="margin-left:auto">{qm('t3','Бонусы пала: пассивки, еда, души и постройки. Перемножаются.')}</span></div>
<label class="fld"><span>Уровень работы</span></label><div class="rng"><input id="pl" type="range" min="1" max="10" value="7" aria-label="Уровень работы пала"><b id="plv">7</b></div>
<label class="fld"><span>Пассивки</span></label><div class="rng"><input id="pp" type="range" min="0" max="245" step="5" value="50" aria-label="Пассивки пала, проценты"><b id="ppv">+50%</b></div>
<label class="fld"><span>Души</span></label><div class="rng"><input id="pso" type="range" min="0" max="20" value="0" aria-label="Шаги душ"><b id="psov">+0%</b></div>
<label class="fld"><span>Еда</span></label><div class="seg2" data-g="food"><button type="button" data-v="0" aria-pressed="false">нет</button><button type="button" data-v="30" aria-pressed="false">+30%</button><button type="button" data-v="40" aria-pressed="false">+40%</button><button type="button" data-v="50" aria-pressed="true">+50%</button></div>
<div class="tog"><button class="tc" type="button" id="bld" aria-pressed="true">🏛️ Постройки +20%</button></div>
</div>
<div class="res" aria-live="polite"><div class="eb">Результат · <span id="rw"></span></div>
<div class="big" id="r1"></div><p class="sub" id="r2"></p>
<div class="rgrid"><div><small>🧑 Ты сделаешь за</small><b id="r3"></b></div><div><small>🐾 Пал сделает за</small><b id="r4"></b></div>
<div class="wide"><small id="r5l">Пал быстрее тебя</small><b id="r5"></b></div></div><div class="mult" id="r6"></div></div>
</div></section>

<section class="blk rv"><div class="hrow"><h2>Как поднять до 10</h2>{qm('t4','От природы у палов до 8 уровня. Эти способы добивают до 10.')}</div><div class="acc">{acc_html}</div></section>

<section class="blk rv"><div class="hrow"><h2>Ускорители</h2>{qm('t5','После 10 уровень не растёт, а скорость — растёт. Все бонусы перемножаются.')}</div>
<div class="boost">{boost}</div>
<div class="eq"><span>×3,45</span>×<span>×1,5</span>×<span>×1,6</span>×<span>×1,2</span>=<span class="r">×9,9</span><small>пассивки · еда · души · постройки</small></div></section>
<footer><b>Палпедия</b><span>Данные игры версии 1.0.5</span></footer>
</main>{bn}
<script>const WD={data};</script><script src="ws.js"></script><script src="{F}fx.js"></script></body></html>'''
open('index.html','w').write(page); print('ok',len(page))
