# ---- stage 1: home ----
import collections,random
PIN=json.load(open(F2+'/img/map/pins.json'))
MC=collections.Counter(m['t'] for m in DATA['map'])
PCOL={'travel':'#2f8fff','alpha':'#ffd400','tower':'#ff6a2b','sealed':'#d94fc0'};PNAME={'travel':'Телепорты','alpha':'Альфы','tower':'Башни','sealed':'Запечатанные'}
def mapfig(R,sizes='100vw'):
  b='img/map/world';f=M[b]['files'];ss=', '.join(f'{R}pp/{x} {w}w' for x,w in f)
  pz=''.join(f'<span class="pin {m["t"]}" title="{html.escape(m["name"])}" style="left:{m["x"]*100:.2f}%;top:{m["y"]*100:.2f}%;background:{PCOL[m["t"]]}"></span>' for m in PIN['pts'])
  return f'<figure class="fig"><img src="{R}pp/{f[1][0]}" srcset="{ss}" sizes="{sizes}" alt="Карта Палпагоса" width="{M[b]["w"]}" height="{M[b]["h"]}" loading="lazy" decoding="async">{pz}<figcaption class="cap on-dark">{M[b]["src"]}</figcaption></figure>'
def home():
  R='';N=dict(pals=len(PALS),passives=len(DATA['passives']),bosses=len(DATA['bosses']),faq=len(DATA['faq']),map=len(DATA['map']))
  g=lambda i:ID.get(i)
  cast=''.join(f'<img class="{c}" data-par="{pr}" src="pp/{M["img/pal/"+i]["files"][-1][0]}" srcset="{", ".join(f"pp/{x} {w}w" for x,w in M["img/pal/"+i]["files"])}" sizes="(max-width:899px) 50vw, 34vw" alt="" decoding="async" {"fetchpriority=high" if c=="ly" else ""}>' for c,pr,i in [('jt',.35,'JetDragon'),('ly',.12,'LilyQueen'),('lb',.25,'SheepBall'),('ct',.2,'PinkCat')] if 'img/pal/'+i in M)
  withart=[p for p in PALS if 'img/pal/'+p['id'] in M]
  pod=withart[datetime.date.today().toordinal()%len(withart)]
  an=ID['Anubis'];jt=ID['JetDragon']
  bz=next((b for b in DATA['bosses'] if b['pal']=='Блазамут Рю'),DATA['bosses'][0]);bzp=RU.get(bz['pal'],an)
  PS={x['name']:x for x in DATA['passives']}
  pch=''.join(f'<a class="pchip {"r4" if PS[n]["rank"]>=4 else ""}" href="{PS[n]["url"]}">{n}<small>{html.escape(PS[n]["desc"].split(";")[0])}</small></a>' for n in (an['bp'].get('рабочий') or [])[:2] if n in PS)
  vst=lambda n,a,b:f'<div class="st">{n} <b class="{"w" if a>b else ""}">{a}</b></div>'
  w2=pod['work'][:2]
  kv=''.join(f'<div><b>{l}</b><span>{html.escape(n)}</span></div>' for n,l in w2)+f'<div><b>{pod["atk"]}</b><span>Атака</span></div>'
  food=sum(1 for l in open(D+'/guide/eda.md').read().split('class="fcard"'))-1 if os.path.exists(D+'/guide/eda.md') else 0
  bento=f'''<a class="b b-pod rv press" data-tilt href="{pod["url"]}"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("star",14)} Пал дня</div><div class="d nm">{pod["ru"]}</div>{"".join(el(x) for x in pod["el"])}<div class="kv">{kv}</div>{stage(pod,R,animate=True,alt=pod["ru"])}</a>
<a class="b b-map rv press" href="map/" style="padding:0">{mapfig(R,"(max-width:1100px) 100vw, 320px")}<div class="ov"><div class="eb">{ic("map",14)} Карта</div><h3>{N["map"]} точек</h3><div class="lg">{"".join(f'<span><i style="background:{PCOL[k]}"></i>{PNAME[k]} {MC[k]}</span>' for k in ["travel","alpha","sealed","tower"])}</div></div></a>
<a class="b b-breed rv press" href="breed/"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("egg",14)} Разведение</div><h3>Калькулятор пар</h3><p style="margin-top:8px;font-size:14px">Два родителя → детёныш, и наоборот: от кого вывести нужного пала.</p></a>
<a class="b b-boss rv press" href="{bz["url"]}">{stage(bzp,R,alt=bzp["ru"])}<div><div class="eb">{ic("raid",14)} Боссы</div><h3>{bzp["ru"]}</h3><p>ур. {bz["level"]} · {format(bz["hp"],",").replace(","," ")} HP</p></div></a>
<a class="b b-ai rv press" href="9_faq/faq/"><div class="eb">{ic("spark",14)} Ответ из базы</div><div class="q">Кого поставить на ферму ягод?</div><div class="a">Палов с высоким «Сбором» — и пассивки рабочим.<small>Дьявольские руки, Виртуоз, Мастеровитый</small></div><span class="fu">{N["faq"]} ответов {ic("arrow",14)}</span></a>
<a class="b b-vs rv press" href="compare/?a={an["ru"]}&b={jt["ru"]}"><div class="hd2"><div class="eb">{ic("compare",14)} Сравнение</div><span class="go" style="position:static">{ic("arrow",18)}</span></div><div class="side">{stage(an,R)}<div class="nm">{an["ru"]}</div>{vst("Атака",an["atk"],jt["atk"])}{vst("Защита",an["def"],jt["def"])}</div><div class="vs"><span>VS</span></div><div class="side">{stage(jt,R,"flip")}<div class="nm">{jt["ru"]}</div>{vst("Атака",jt["atk"],an["atk"])}{vst("Защита",jt["def"],an["def"])}</div></a>
<a class="b b-pass rv press" href="passivki/"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("spark",14)} Пассивки</div><h3>{N["passives"]} навыков</h3><div class="chips">{pch}</div></a>
<a class="b b-faq rv press" href="guide/eda/" style="background:linear-gradient(135deg,color-mix(in srgb,var(--sun) 30%,var(--card)),var(--card))"><span class="go">{ic("arrow",18)}</span><div class="eb">{ic("list",14)} Еда и баффы</div><h3>{food} блюд</h3><p>Скорость работы, атака, защита — что приготовить.</p></a>'''
  QL=[('sphere','Все палы','gallery/'),('boss','Боссы','boss/'),('spark','Пассивки','passivki/'),('egg','Разведение','breed/'),('compare','Сравнить','compare/'),('work','Сборка','4_spravochniki/paly/anubis/#bld'),('star','Мои списки','my/'),('list','Прохождение','guide/03_prohozhdenie_1_80/'),('pin','Секреты','guide/sekrety/'),('list','Предметы','4_spravochniki/predmety/'),('spark','Бот @PalGuideBot','https://t.me/PalGuideBot')]
  ql=''.join(f'<a class="ql press" href="{u}">{ic(i,20)}<b>{t}</b></a>' for i,t,u in QL)
  rail=''.join(f'<div style="scroll-snap-align:start">{pcard(ID[k],R)}</div>' for k in ['JetDragon','LilyQueen','Anubis','IceHorse','ElecPanda','PinkCat','SheepBall','Kitsunebi'] if k in ID)
  HINTS=['Кто лучше копает?','Где найти Анубиса?','Чем бить Зои?','Где взять серу?','Как вывести Джетрагона?']
  sugg=''.join(f'<button type="button" data-q="{q}">{q}</button>' for q in ['Где найти железо','Как вывести Анубиса','Сравнить Анубис и Джетрагон'])
  body=f'''<section class="hero">{open(F2+"/build.py").read().split("def scene():")[1].split("return \'\'\'")[1].split("\'\'\'")[0]}<div class="cast">{cast}</div><span class="cap" style="z-index:3;color:#fff;opacity:.7">Палы © Pocketpair · palworld.wiki.gg · фон: Палпедия</span>
<div class="hin"><span class="tag eb" style="color:#fff">{ic("sphere",14)} Palworld 1.0.5</span><h1 class="d">Весь Палпагос в <em>одном</em> поиске</h1><p>Палы, боссы, пассивки и разведение. Спроси как другу — ответ без рекламы и регистрации.</p>
<button type="button" class="ask" data-open-search data-hints="{"|".join(HINTS)}">{ic("spark",20)}<span class="ask-t">{HINTS[0]}</span><b>{ic("arrow",18)}</b></button>
<div class="sugg">{sugg}</div>
<div class="nums"><div><b>{N["pals"]}</b><span>палов</span></div><div><b>{N["passives"]}</b><span>пассивок</span></div><div><b>{N["bosses"]}</b><span>боссов и рейдов</span></div><div><b>{N["faq"]}</b><span>ответов</span></div></div></div></section>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Сегодня на острове</h2></div><section class="bento">{bento}</section>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Разделы</h2></div><nav class="qls">{ql}</nav>
<div class="band"><i></i></div><div class="shd"><h2 class="d">Популярные палы</h2><a href="gallery/">Все {N["pals"]} {ic("arrow",16)}</a></div><p class="note" style="margin-top:0">{ic("spark",14)} Наведи или нажми на пала со значком — он оживёт. Двигается только один.</p><div class="rail" style="grid-auto-columns:minmax(260px,78%)">{rail}</div>
<div class="shd"><h2 class="d">Недавние</h2></div><div id="recent" class="mini-row"><small>Открой пару палов — они появятся здесь.</small></div>
{FOOT}'''
  open(D+'/index.md','w').write('---\nhide: [navigation, toc]\ntitle: Палпедия — энциклопедия Palworld\n---\n<div class="pp pp-home" markdown="0">'+body.replace('\n','')+'</div>\n')
home()
print('palpedia: home ok, art', 'final' if os.path.exists(AF+'/manifest.json') else 'final2', len(M))
