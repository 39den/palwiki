"""Тест калькулятора «Работа»: данные vs wiki-дамп, формула в браузере (webkit 390, chromium 1440). python3 workcalc_test.py [url]"""
import json,re,sys,math
from playwright.sync_api import sync_playwright
import subprocess,time,atexit
if len(sys.argv)>1:URL=sys.argv[1]
else:
    _srv=subprocess.Popen(['python3','-m','http.server','8947','-d','/workspace/palsite/design2026'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);atexit.register(_srv.kill);time.sleep(1)
    URL='http://127.0.0.1:8947/worksuit/index.html'
P=json.load(open('/workspace/palwiki/raw/wikigg/pages.json'));WS=json.load(open('/workspace/palwiki/data/work_suitability.json'))
PALS={p['ru']:p for p in json.load(open('/workspace/palwiki/data/pals.json'))}
fails=[];ok=lambda c,m:(None if c else fails.append(m))
# 1. levels table == wiki
for wid,page in (('handiwork','Handiwork'),):  # Фармацевтика: в дампе нет таблицы уровней (Medicine Production) — шкала из work_suitability.json
    L=next(w['levels'] for w in WS['work_types'] if w['id']==wid)
    c=P[page]['content'];tab=[int(x) for x in re.findall(r'\|\s*\d+\s*\|\|\s*(\d+)',c[c.find('==Values=='):])][:10]
    ok(tab==L,f'{wid}: levels {L} != wiki {tab}')
HW=next(w['levels'] for w in WS['work_types'] if w['id']=='handiwork')
# 2. control pals: site level vs wiki infobox
CTRL=[('Ламболл','Lamball'),('Анубис','Anubis'),('Пенкинг','Penking'),('Лилин','Lyleen')]
for ru,en in CTRL:
    lv=next((x['level'] for x in PALS[ru]['work'] if x['work']=='Ручная работа'),0)
    m=re.search(r'\|\s*handiwork\s*=\s*(\d+)',P.get(en,{}).get('content',''),re.I)
    if m: ok(int(m.group(1))==lv,f'{ru}: site {lv} wiki {m.group(1)}')
def dur(s):
    s=math.ceil(s)
    if s<60:return f'{s} с'
    if s<3600:m,r=divmod(s,60);return f'{m} мин'+(f' {r} с' if r else '')
    h=s//3600;m=round(s%3600/60);return f'{h} ч'+(f' {m} мин' if m else '')
# cases: (pal, recipe option text, qty, pts, pp, food, bld) -> expected
CASES=[('Анубис','Металлическая кирка',10,0,0,0,False),('Ламболл','Пал-сфера',20,10,0,50,True),('Лилин','Медикаменты',5,0,75,30,False),('Пенкинг','Печатная плата',3,20,245,50,True)]
res={}
with sync_playwright() as pw:
  for bn,vw in (('webkit',390),('chromium',1440)):
    b=getattr(pw,bn).launch();pg=b.new_page(viewport={'width':vw,'height':900});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(URL);pg.wait_for_selector('#rc')
    REC={r['n']:r for r in pg.evaluate('WD.rec')}
    for pal,rn,q,pts,pp,fd,bl in CASES:
      pg.select_option('#rc',label=rn);pg.fill('#qty',str(q));pg.fill('#pts',str(pts))
      pg.fill('#pn',pal);pg.dispatch_event('#pn','change')
      pg.click(f'.seg2[data-g=pp] button[data-v="{pp}"]');pg.click(f'.seg2[data-g=food] button[data-v="{fd}"]')
      if (pg.get_attribute('#bld','aria-pressed')=='true')!=bl:pg.click('#bld')
      r=REC[rn];wk='Ручная работа' if r['w']=='handiwork' else 'Фармацевтика'
      lv=next(x['level'] for x in PALS[pal]['work'] if x['work']==wk)
      L=next(w['levels'] for w in WS['work_types'] if w['id']==r['w'])
      ok(pg.input_value('#pl')==str(lv),f'{bn} {pal}: slider {pg.input_value("#pl")} != {lv}')
      P_=L[lv-1]*(1+pp/100)*(1+fd/100)*(1.2 if bl else 1);S=100+50*pts
      eY,eP=dur(q*r['a']/(S/100)),dur(q*r['a']/(P_/100))
      gY,gP=pg.text_content('#r3'),pg.text_content('#r4')
      ok((gY,gP)==(eY,eP),f'{bn} {pal}/{rn}: got {gY},{gP} want {eY},{eP}')
      res[f'{bn} {pal} {q}×{rn}']=f'ты {gY} / пал (ур.{lv}) {gP}'
    # custom workload
    pg.select_option('#rc',value='c');ok(pg.is_visible('#wl'),'custom field hidden')
    pg.fill('#wl','600');pg.fill('#qty','1');pg.fill('#pts','0');ok(pg.text_content('#r3')=='10 мин',f'custom: {pg.text_content("#r3")}')
    # layout
    m=pg.evaluate('''()=>{const W=document.documentElement.clientWidth;const bad=[...document.querySelectorAll('.calc *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>W+1}).map(e=>e.id||e.className).slice(0,5);
      const ph=[...document.querySelectorAll('.calc input[placeholder]')].filter(i=>{const c=document.createElement('canvas').getContext('2d');const s=getComputedStyle(i);c.font=s.font;return c.measureText(i.placeholder).width>i.clientWidth}).map(i=>i.id);
      const lat=((document.querySelector('.ws')||document.querySelector('main')).innerText.match(/[A-Za-z]{2,}/g)||[]);
      const fonts=[...document.querySelectorAll('.calc input,.calc select')].map(i=>getComputedStyle(i).fontFamily.split(',')[0]);return{W,bad,ph,lat,fonts:[...new Set(fonts)]}}''')
    ok(not m['bad'],f'{bn}{vw} overflow {m["bad"]}');ok(not m['ph'],f'{bn} placeholder cut {m["ph"]}');ok(not m['lat'],f'{bn} latin {m["lat"]}')
    ok(not errs,f'{bn} js errors {errs}');res[f'{bn} layout']=m
    pg.locator('#calc').screenshot(path=f'/workspace/workcalc/calc_{bn}_{vw}.png');b.close()
json.dump(res,open('/workspace/workcalc/test_out.json','w'),ensure_ascii=False,indent=1)
print('FAIL' if fails else 'OK',len(fails));[print(' -',f) for f in fails]
