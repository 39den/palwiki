import json,os,html
D=json.load(open('../docs/assets/search_data.json'))
P={x['en']:x for x in D['pals']}
pick=['Anubis','Jetragon','Grizzbolt','Frostallion','Cattiva','Lamball']
pals=[P[k] for k in pick]
an=P['Anubis']
pas=[x for x in D['passives'] if x['name'] in an.get('bp',{}).get('боец',[])] or D['passives'][:4]
boss=D['bosses'][:3]
R='../../docs/'
EL={'Нейтральный':'#c9b79c','Огонь':'#ff7a3d','Вода':'#3da9ff','Трава':'#5cc85a','Молния':'#ffd23d','Лёд':'#7fe3ff','Земля':'#c08a4a','Тьма':'#a46cff','Дракон':'#e05fd0'}
def ec(e): return EL.get(e,'#aaa')
def chips(lst,cls='chip'): return ''.join(f'<span class="{cls}" style="--e:{ec(e)}">{html.escape(e)}</span>' for e in lst)
def work(p): return ''.join(f'<span class="wk">{html.escape(w)} <b>{l}</b></span>' for w,l in p['work'])
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&family=Nunito:wght@400;700;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">'
def page(css,body,title): return f'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">{FONTS}<title>{title}</title><style>{css}</style></head><body>{body}</body></html>'
def stat(n,v,mx=150): return f'<div class="st"><span>{n}</span><i><s style="width:{min(100,v*100//mx)}%"></s></i><b>{v}</b></div>'
def palcard(p): return f'<a class="pc" style="--e:{ec(p["el"][0])}"><img src="{R}{p["art"]}" loading="lazy"><em>№{p["no"]}</em><strong>{p["ru"]}</strong><span class="els">{chips(p["el"])}</span></a>'
def home(c):
  return f'''<header class="top"><div class="logo">PAL<span>WIKI</span></div><button class="sbtn">⌕ Найти пала, предмет, босса <kbd>Ctrl K</kbd></button></header>
<section class="hero"><div class="ask"><small>{c['askl']}</small><h1>{c['h1']}</h1><div class="q">Кого поставить на ферму ягод?</div>
<div class="ans"><b>Короткий ответ:</b> Лифмунк или Танзи — Фермерство и Посадка 1–2 уровня. <span class="fu">Где поймать?</span><span class="fu">Сравнить</span><span class="fu">Лучшие пассивки</span></div></div></section>
<h2 class="sec">Популярно сейчас</h2><div class="grid">{''.join(palcard(p) for p in pals)}</div>
<h2 class="sec">Разделы</h2><div class="tiles">{''.join(f'<a class="tile"><i>{i}</i>{t}</a>' for i,t in [('◉','Палы'),('⚔','Боссы'),('✦','Пассивки'),('❤','Разведение'),('⌖','Карта'),('⚖','Сравнение')])}</div>
<h2 class="sec">Боссы башен</h2><div class="bl">{''.join(f'<div class="bc" style="--e:{ec(b["el"][0])}"><b>{b["name"]}</b><span>ур. {b["level"]} · HP {b["hp"]:,}</span><span class="els">слабость {chips(b["weak"])}</span></div>' for b in boss)}</div>'''
def palp(c):
  p=an
  return f'''<header class="top"><div class="logo">PAL<span>WIKI</span></div><button class="sbtn">⌕</button></header>
<section class="phead" style="--e:{ec(p['el'][0])}"><img src="{R}{p['art']}"><div><em>№{p['no']}</em><h1>{p['ru']}</h1><span class="els">{chips(p['el'])}</span></div></section>
<div class="facts"><div><small>Слабость</small>{chips(p['weak'])}</div><div><small>Навык</small><b>{p['psk']}</b></div><div><small>Яйцо</small><b>{p['egg']}</b></div><div><small>Редкость</small><b>{'★'*min(5,p['rarity']//2+1)}</b></div></div>
<nav class="tabs"><a class="on">Обзор</a><a>Сборка</a><a>Где найти</a><a>Разведение</a></nav>
<h2 class="sec">Статы</h2><div class="stats">{stat('HP',p['hp'])}{stat('Атака',p['atk'])}{stat('Защита',p['def'])}</div>
<h2 class="sec">Работа</h2><div class="wks">{work(p)}</div>
<h2 class="sec">Лучшие пассивки · боец</h2><div class="pas">{''.join(f'<div class="pa"><b>{x["name"]}</b><span>{html.escape(x["desc"].split(";")[0])}</span></div>' for x in pas)}</div>
<div class="bar"><a>◉ Палы</a><a>⌕ Поиск</a><a>✦ Мои</a><a>☰</a></div>'''
def search(c):
  hits=[P['Anubis'],P['Anubis'] if 0 else P['Jetragon']]
  return f'''<div class="ov"><div class="sbox"><span>⌕</span><input value="ануб"><kbd>Esc</kbd></div>
<div class="ai"><small>{c['askl']}</small><b>Анубис</b> — Земля, лучший ранний ручной труд 4. Ловится у Пустынных дюн, вылупляется из Огромного яйца Земли. <span class="fu">Как вывести?</span><span class="fu">Сравнить с Джетрагоном</span></div>
<div class="grp">Палы</div>{''.join(f'<div class="hit"><img src="{R}{p["thumb"]}"><div><b><mark>Ануб</mark>{p["ru"][4:]}</b><span>Пал · №{p["no"]}</span></div><span class="els">{chips(p["el"])}</span></div>' for p in [an])}
<div class="hit"><span class="ic">✦</span><div><b>Сборка <mark>Ануб</mark>иса на ручной труд</b><span>Гайд</span></div></div>
<div class="hit"><span class="ic">⚔</span><div><b>Слабые к Земле боссы</b><span>Боссы · 7</span></div></div>
<div class="grp">Недавние</div><div class="rec"><span class="fu">Джетрагон</span><span class="fu">сравнить Анубис и Лиф</span><span class="fu">Железо</span></div></div>'''
C={}
C['a']=dict(askl='ДНЕВНИК ПАЛОВ · ИИ',h1='Спроси о мире Палпагоса',css='''
:root{--bg:#0b1a2e;--pn:rgba(18,40,68,.86);--ln:#3fd0ff;--tx:#eaf6ff;--mu:#a9c4dc;--ac:#ffd84a}
@media(prefers-color-scheme:light){}
*{box-sizing:border-box}body{margin:0;font:15px/1.45 Rubik,sans-serif;color:var(--tx);background:radial-gradient(1200px 600px at 70% -10%,#1b4c7a,transparent),repeating-linear-gradient(0deg,rgba(63,208,255,.04) 0 1px,transparent 1px 4px),var(--bg);min-height:100vh;padding:0 16px 90px}
.top{display:flex;gap:12px;align-items:center;padding:14px 0;position:sticky;top:0;background:linear-gradient(var(--bg),transparent);z-index:2}.logo{font:800 22px Rubik;letter-spacing:2px;transform:skewX(-10deg)}.logo span{color:var(--ac)}
.sbtn{flex:1;max-width:520px;margin-left:auto;background:var(--pn);color:var(--mu);border:1px solid var(--ln);padding:11px 14px;text-align:left;font:inherit;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}kbd{float:right;font:12px 'JetBrains Mono';color:var(--ln)}
.hero,.ov,.phead,.facts>div,.pa,.bc,.pc,.tile,.st{background:var(--pn);border:1px solid rgba(63,208,255,.45);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
.hero{padding:22px;margin:8px 0}.ask small,.ai small{font:700 11px 'JetBrains Mono';color:var(--ln);letter-spacing:3px}h1{font:800 clamp(24px,5vw,40px)/1.1 Rubik;margin:6px 0 14px;text-transform:uppercase;font-style:italic}
.q{background:#08243e;border-left:4px solid var(--ac);padding:10px 12px;margin-bottom:10px}.ans{color:var(--mu)}.ans b{color:var(--tx)}
.fu{display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1px solid var(--ln);color:var(--ln);font-size:13px;transform:skewX(-12deg)}
.sec{font:700 13px 'JetBrains Mono';letter-spacing:3px;color:var(--ac);text-transform:uppercase;margin:22px 0 10px}.sec:before{content:"▶ "}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.pc{display:block;padding:10px;position:relative}.pc img{width:100%;aspect-ratio:1;object-fit:contain;background:radial-gradient(circle,color-mix(in srgb,var(--e) 40%,transparent),transparent 70%)}.pc em{position:absolute;top:8px;left:12px;font:700 12px 'JetBrains Mono';color:var(--ln);font-style:normal}.pc strong{display:block;font-weight:600}
.chip{display:inline-block;font-size:12px;padding:2px 8px;margin:2px 4px 0 0;background:color-mix(in srgb,var(--e) 25%,#0b1a2e);border:1px solid var(--e);color:#fff;transform:skewX(-12deg)}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px}.tile{padding:14px;text-align:center;font-weight:600}.tile i{display:block;font-size:24px;color:var(--ln);font-style:normal}
.bl{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}.bc{padding:12px;border-left:5px solid var(--e)}.bc b,.bc span{display:block}.bc span{color:var(--mu);font-size:13px}
.phead{display:flex;gap:12px;align-items:center;padding:12px;background:linear-gradient(110deg,color-mix(in srgb,var(--e) 35%,#0b1a2e),var(--pn))}.phead img{width:120px;height:120px;object-fit:contain}.phead em{font:700 13px 'JetBrains Mono';color:var(--ln);font-style:normal}.phead h1{margin:0 0 4px}
.facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.facts>div{padding:8px 12px}.facts small{display:block;color:var(--mu);font-size:11px;letter-spacing:1px;text-transform:uppercase}
.tabs{display:flex;gap:4px;margin:14px 0 0;position:sticky;top:60px;overflow:auto}.tabs a{padding:8px 14px;background:var(--pn);transform:skewX(-12deg);color:var(--mu);white-space:nowrap}.tabs a.on{background:var(--ln);color:#04203a;font-weight:700}
.stats{display:grid;gap:6px}.st{display:grid;grid-template-columns:70px 1fr 40px;align-items:center;gap:8px;padding:8px 12px}.st i{height:8px;background:#06223a}.st s{display:block;height:100%;background:linear-gradient(90deg,var(--ln),var(--ac))}.st b{font-family:'JetBrains Mono'}
.wks{display:flex;flex-wrap:wrap;gap:6px}.wk{padding:6px 10px;border:1px solid var(--ln);transform:skewX(-12deg)}.wk b{color:var(--ac)}
.pas{display:grid;gap:6px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}.pa{padding:10px 12px}.pa b{display:block;color:var(--ac)}.pa span{color:var(--mu);font-size:13px}
.bar{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:space-around;padding:12px;background:rgba(6,20,36,.95);border-top:2px solid var(--ln)}
.ov{padding:16px;margin-top:16px;max-width:720px;margin-inline:auto}.sbox{display:flex;gap:8px;align-items:center;border-bottom:2px solid var(--ln);padding:6px 0}.sbox input{flex:1;background:none;border:0;color:#fff;font:600 22px Rubik}
.ai{margin:12px 0;padding:12px;background:#08243e;border-left:4px solid var(--ac)}.grp{font:700 11px 'JetBrains Mono';letter-spacing:3px;color:var(--mu);margin:14px 0 6px}
.hit{display:flex;gap:12px;align-items:center;padding:10px;border-bottom:1px solid rgba(63,208,255,.2)}.hit img,.ic{width:44px;height:44px;display:grid;place-items:center;color:var(--ln)}.hit div{flex:1}.hit b,.hit span{display:block}.hit div span{color:var(--mu);font-size:12px}mark{background:none;color:var(--ac);text-decoration:underline}
''')
C['b']=dict(askl='СПРОСИ ОСТРОВ',h1='Что ищем сегодня, тренер?',css='''
:root{--bg:#eaf7e4;--sky:#bfe8ff;--pn:#fffdf6;--ink:#1f2b1c;--mu:#4c5d47;--ac:#ffb21f;--gr:#2f8f3a}
*{box-sizing:border-box}body{margin:0;font:16px/1.45 Nunito,sans-serif;color:var(--ink);background:linear-gradient(180deg,var(--sky) 0,#dff4ff 220px,var(--bg) 420px);min-height:100vh;padding:0 16px 96px}
.top{display:flex;gap:12px;align-items:center;padding:14px 0}.logo{font:900 24px Nunito;color:var(--gr);-webkit-text-stroke:0;text-shadow:2px 2px 0 #fff,3px 3px 0 var(--ink)}.logo span{color:var(--ac)}
.sbtn{flex:1;max-width:520px;margin-left:auto;background:#fff;border:3px solid var(--ink);border-radius:999px;padding:11px 16px;text-align:left;font:700 15px Nunito;color:var(--mu);box-shadow:0 4px 0 var(--ink)}kbd{float:right;font:12px 'JetBrains Mono';background:#ffe9a8;border-radius:6px;padding:1px 6px}
.hero,.ov{background:var(--pn);border:3px solid var(--ink);border-radius:28px;box-shadow:0 6px 0 var(--ink);padding:20px;margin:8px 0}
.ask small,.ai small{font:900 12px Nunito;color:var(--gr);letter-spacing:2px}h1{font:900 clamp(26px,5vw,42px)/1.05 Nunito;margin:4px 0 14px}
.q{display:inline-block;background:#dff4ff;border:2px solid var(--ink);border-radius:20px 20px 20px 4px;padding:8px 14px;margin-bottom:10px;font-weight:700}.ans{background:#fff6d6;border:2px solid var(--ink);border-radius:20px 20px 4px 20px;padding:10px 14px}
.fu{display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:2px solid var(--ink);border-radius:999px;background:#fff;font-weight:700;font-size:14px}
.sec{font:900 20px Nunito;margin:24px 0 10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}.pc{display:block;background:#fff;border:3px solid var(--ink);border-radius:24px;padding:10px;position:relative;box-shadow:0 5px 0 var(--ink);transform:rotate(var(--r,0deg))}.pc:nth-child(odd){--r:-1deg}.pc:nth-child(even){--r:1deg}
.pc img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:18px;background:color-mix(in srgb,var(--e) 30%,#fff)}.pc em{position:absolute;top:14px;left:16px;font:900 12px Nunito;background:#fff;border:2px solid var(--ink);border-radius:99px;padding:0 6px;font-style:normal}.pc strong{display:block;font-weight:900;margin-top:6px}
.chip{display:inline-block;font:800 12px Nunito;padding:2px 9px;margin:2px 4px 0 0;background:color-mix(in srgb,var(--e) 45%,#fff);border:2px solid var(--ink);border-radius:99px}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px}.tile{background:#fff;border:3px solid var(--ink);border-radius:22px;padding:14px;text-align:center;font-weight:900;box-shadow:0 4px 0 var(--ink)}.tile i{display:block;font-size:26px;font-style:normal;color:var(--gr)}
.bl{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}.bc{background:#fff;border:3px solid var(--ink);border-radius:22px;padding:12px 14px;box-shadow:0 4px 0 var(--e)}.bc b,.bc span{display:block}.bc span{color:var(--mu);font-size:14px}
.phead{display:flex;gap:12px;align-items:center;background:color-mix(in srgb,var(--e) 35%,#fff);border:3px solid var(--ink);border-radius:30px;padding:12px;box-shadow:0 6px 0 var(--ink)}.phead img{width:124px;height:124px;object-fit:contain;filter:drop-shadow(3px 4px 0 rgba(0,0,0,.25))}.phead em{font:900 13px Nunito;font-style:normal}.phead h1{margin:0 0 4px}
.facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.facts>div{background:#fff;border:2px solid var(--ink);border-radius:18px;padding:8px 12px}.facts small{display:block;color:var(--mu);font-weight:800;font-size:12px}
.tabs{display:flex;gap:6px;margin:16px 0 0;overflow:auto;position:sticky;top:8px}.tabs a{padding:8px 14px;border:2px solid var(--ink);border-radius:99px;background:#fff;font-weight:800;white-space:nowrap}.tabs a.on{background:var(--ac)}
.stats{display:grid;gap:8px}.st{display:grid;grid-template-columns:70px 1fr 40px;align-items:center;gap:8px;font-weight:800}.st i{height:14px;border:2px solid var(--ink);border-radius:99px;background:#fff;overflow:hidden}.st s{display:block;height:100%;background:var(--gr)}
.wks{display:flex;flex-wrap:wrap;gap:8px}.wk{background:#fff;border:2px solid var(--ink);border-radius:14px;padding:6px 10px;font-weight:700}.wk b{background:var(--ac);border-radius:99px;padding:0 6px}
.pas{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}.pa{background:#fff;border:2px solid var(--ink);border-radius:18px;padding:10px 12px}.pa b{display:block}.pa span{color:var(--mu);font-size:14px}
.bar{position:fixed;left:12px;right:12px;bottom:12px;display:flex;justify-content:space-around;padding:12px;background:#fff;border:3px solid var(--ink);border-radius:999px;font-weight:900;box-shadow:0 4px 0 var(--ink)}
.ov{max-width:720px;margin:16px auto}.sbox{display:flex;gap:8px;align-items:center;border:3px solid var(--ink);border-radius:99px;padding:6px 14px;background:#fff}.sbox input{flex:1;border:0;font:900 22px Nunito;background:none}
.ai{margin:12px 0;padding:12px 14px;background:#fff6d6;border:2px solid var(--ink);border-radius:20px}.grp{font:900 14px Nunito;margin:14px 0 6px;color:var(--gr)}
.hit{display:flex;gap:12px;align-items:center;padding:8px 10px;border-radius:18px;margin-bottom:6px;background:#f6fbef;border:2px solid transparent}.hit:first-of-type{border-color:var(--ink)}.hit img,.ic{width:46px;height:46px;border-radius:50%;background:#dff4ff;display:grid;place-items:center;font-size:20px}.hit div{flex:1}.hit b,.hit span{display:block}.hit div span{color:var(--mu);font-size:13px}mark{background:#ffe066;border-radius:4px}
''')
C['c']=dict(askl='ИИ-ПОМОЩНИК',h1='Мир палов. Ответ за секунду.',css='''
:root{--bg:#0e0f1a;--pn:rgba(255,255,255,.06);--ln:rgba(255,255,255,.14);--tx:#f4f3ff;--mu:#b9b7d0;--ac:#ff5a4e;--ac2:#4ee0c1}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 Rubik,sans-serif;color:var(--tx);background:radial-gradient(900px 500px at 10% -10%,rgba(255,90,78,.35),transparent 60%),radial-gradient(800px 500px at 100% 10%,rgba(78,224,193,.25),transparent 60%),radial-gradient(700px 600px at 50% 120%,rgba(120,90,255,.3),transparent 60%),var(--bg);background-attachment:fixed;min-height:100vh;padding:0 16px 96px}
.top{display:flex;gap:12px;align-items:center;padding:14px 0}.logo{font:800 20px Rubik;display:flex;align-items:center;gap:8px}.logo:before{content:"";width:22px;height:22px;border-radius:50%;background:linear-gradient(var(--ac) 0 46%,#222 46% 54%,#fff 54%);box-shadow:0 0 12px var(--ac)}.logo span{color:var(--ac2)}
.sbtn{flex:1;max-width:520px;margin-left:auto;background:var(--pn);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--ln);border-radius:16px;padding:12px 16px;text-align:left;color:var(--mu);font:inherit}kbd{float:right;font:12px 'JetBrains Mono';border:1px solid var(--ln);border-radius:6px;padding:0 6px}
.hero,.ov,.pc,.tile,.bc,.facts>div,.pa,.st,.phead{background:var(--pn);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--ln);border-radius:22px}
.hero{padding:22px;margin:8px 0;position:relative;overflow:hidden}.hero:after{content:"";position:absolute;inset:-1px;border-radius:22px;padding:1px;background:conic-gradient(from 90deg,var(--ac),var(--ac2),#7a5aff,var(--ac));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.ask small,.ai small{font:600 12px Rubik;color:var(--ac2);letter-spacing:1px}.ask small:before,.ai small:before{content:"✦ "}h1{font:800 clamp(26px,5vw,44px)/1.05 Rubik;margin:6px 0 14px;letter-spacing:-.5px}
.q{color:var(--mu);margin-bottom:8px}.ans{font-size:16px}.fu{display:inline-block;margin:10px 6px 0 0;padding:7px 13px;border-radius:99px;background:rgba(78,224,193,.12);border:1px solid rgba(78,224,193,.4);color:var(--ac2);font-size:13px}
.sec{font:700 18px Rubik;margin:26px 0 10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}.pc{display:block;padding:12px;position:relative;overflow:hidden}.pc:before{content:"";position:absolute;width:140%;aspect-ratio:1;left:-20%;top:-60%;background:radial-gradient(circle,color-mix(in srgb,var(--e) 55%,transparent),transparent 60%)}.pc img{position:relative;width:100%;aspect-ratio:1;object-fit:contain}.pc em{position:absolute;top:10px;right:12px;font:500 12px 'JetBrains Mono';color:var(--mu);font-style:normal}.pc strong{display:block;font-weight:600}
.chip{display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:2px 9px;margin:2px 4px 0 0;border-radius:99px;background:color-mix(in srgb,var(--e) 22%,transparent);color:#fff}.chip:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--e);box-shadow:0 0 8px var(--e)}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px}.tile{padding:16px;text-align:center}.tile i{display:block;font-size:24px;font-style:normal;color:var(--ac)}
.bl{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}.bc{padding:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--e) 20%,transparent),var(--pn))}.bc b,.bc span{display:block}.bc span{color:var(--mu);font-size:13px}
.phead{display:flex;gap:12px;align-items:center;padding:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--e) 35%,transparent),var(--pn))}.phead img{width:120px;height:120px;object-fit:contain;filter:drop-shadow(0 8px 20px var(--e))}.phead em{font:500 13px 'JetBrains Mono';color:var(--mu);font-style:normal}.phead h1{margin:0 0 4px}
.facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.facts>div{padding:10px 12px;border-radius:16px}.facts small{display:block;color:var(--mu);font-size:12px}
.tabs{display:flex;gap:4px;margin:16px 0 0;padding:4px;border-radius:99px;background:var(--pn);border:1px solid var(--ln);overflow:auto;position:sticky;top:8px;backdrop-filter:blur(16px)}.tabs a{padding:8px 14px;border-radius:99px;color:var(--mu);white-space:nowrap}.tabs a.on{background:var(--tx);color:var(--bg);font-weight:600}
.stats{display:grid;gap:8px}.st{display:grid;grid-template-columns:70px 1fr 40px;align-items:center;gap:8px;padding:10px 14px;border-radius:16px}.st i{height:6px;border-radius:9px;background:rgba(255,255,255,.08)}.st s{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--ac),var(--ac2))}.st b{font-family:'JetBrains Mono'}
.wks{display:flex;flex-wrap:wrap;gap:6px}.wk{padding:7px 12px;border-radius:12px;background:var(--pn);border:1px solid var(--ln)}.wk b{color:var(--ac2)}
.pas{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}.pa{padding:12px}.pa b{display:block}.pa span{color:var(--mu);font-size:13px}
.bar{position:fixed;left:16px;right:16px;bottom:14px;display:flex;justify-content:space-around;padding:12px;border-radius:22px;background:rgba(20,20,34,.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--ln)}
.ov{max-width:720px;margin:16px auto;padding:16px}.sbox{display:flex;gap:10px;align-items:center;padding:6px 4px 12px;border-bottom:1px solid var(--ln)}.sbox input{flex:1;background:none;border:0;color:#fff;font:500 22px Rubik}
.ai{margin:12px 0;padding:14px;border-radius:18px;background:linear-gradient(135deg,rgba(255,90,78,.14),rgba(78,224,193,.12));border:1px solid var(--ln)}.grp{font-size:12px;color:var(--mu);margin:14px 0 6px}
.hit{display:flex;gap:12px;align-items:center;padding:10px;border-radius:14px}.hit:first-of-type{background:rgba(255,255,255,.07)}.hit img,.ic{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.06);display:grid;place-items:center}.hit div{flex:1}.hit b,.hit span{display:block}.hit div span{color:var(--mu);font-size:12px}mark{background:none;color:var(--ac2);font-weight:700}
''')
for k,c in C.items():
  os.makedirs(f'concept_{k}',exist_ok=True)
  for n,f in [('home',home),('pal',palp),('search',search)]:
    open(f'concept_{k}/{n}.html','w').write(page(c['css'],f(c),n))
