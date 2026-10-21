#!/usr/bin/env python3
"""Theme persistence test: system=light, user picks dark in ⚙️, walk 12 pages + back; must stay dark,
and the html element must carry the scheme before first paint (no flash). Usage: theme_nav_test.py BASE_URL"""
import sys,json
from playwright.sync_api import sync_playwright
B=(sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8931/palwiki/').rstrip('/')+'/'
P=['','4_spravochniki/paly/katress_ignis/','4_spravochniki/predmety/сферы/','guide/05_lovlya/','map/','9_faq/faq/','my/',
   '4_spravochniki/bossy/','boss/alpha_jetragon/','2_mehaniki/passivki/','passivki/pal_attack_up_lv_1/','5_lut_i_farm/gde_vzyat/']
ST="(()=>[document.body.getAttribute('data-md-color-scheme'),document.documentElement.getAttribute('data-md-color-scheme')])()"
fails=[]
with sync_playwright() as p:
  for name,bt,opt in [('webkit390',p.webkit,dict(**p.devices['iPhone 13'])),('chromium1440',p.chromium,dict(viewport={'width':1440,'height':900}))]:
    b=bt.launch();c=b.new_context(**opt,color_scheme='light');pg=c.new_page()
    # record scheme at first possible moment (DOMContentLoaded-independent): html attr at script-end of head
    c.add_init_script("document.addEventListener('readystatechange',()=>{if(!window.__f)window.__f=document.documentElement.getAttribute('data-md-color-scheme')})")
    pg.goto(B,wait_until='load')
    s=pg.evaluate(ST)
    if s[0]!='default':fails.append(f'{name}: default with system light = {s}')
    pg.evaluate('window.PW_settings()');pg.click('.setp .seg[data-k=th] button[data-v=dark]');pg.click('.setp [data-x]')
    for u in P+['__back__','__reload__']:
      if u=='__back__':pg.go_back(wait_until='load')
      elif u=='__reload__':pg.reload(wait_until='load')
      else:pg.goto(B+u,wait_until='load')
      s=pg.evaluate(ST);f=pg.evaluate('window.__f')
      ok=s==['slate','slate'] and f=='slate'
      print(name,'OK ' if ok else 'BAD',u or '/',s,'early=',f)
      if not ok:fails.append(f'{name} {u}: {s} early={f}')
    # system dark default
    c2=b.new_context(**opt,color_scheme='dark');q=c2.new_page();q.goto(B+'map/');s=q.evaluate(ST)
    if s[0]!='slate':fails.append(f'{name}: default with system dark = {s}')
    b.close()
print('FAIL' if fails else 'PASS',json.dumps(fails,ensure_ascii=False))
sys.exit(1 if fails else 0)
