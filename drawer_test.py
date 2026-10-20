import sys
from playwright.sync_api import sync_playwright
U=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8899/';S='/workspace/palsite/shots/'
ok=True
with sync_playwright() as p:
  dev=p.devices['iPhone 13'];b=p.webkit.launch();c=b.new_context(**dev,color_scheme='dark');pg=c.new_page()
  pg.goto(U+'4_spravochniki/paly/anubis/',wait_until='networkidle');pg.wait_for_timeout(1200)
  pg.evaluate("scrollTo(0,300)");y0=pg.evaluate('scrollY')
  pg.locator('.md-header label[for=__drawer]').first.tap();pg.wait_for_timeout(700)
  # open deepest long submenu: Справочник
  lab=pg.locator('.md-sidebar--primary .md-nav__container',has_text='Справочник').locator('label').first
  if lab.count():lab.tap();pg.wait_for_timeout(700)
  pg.screenshot(path=S+'drawer_top.png')
  sc=pg.evaluate("""()=>{const all=[...document.querySelectorAll('.md-sidebar--primary .md-nav__list')].filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.left>=-1&&n.scrollHeight>n.clientHeight+5});return all.length?all[all.length-1].className:null}""")
  before=pg.evaluate("""()=>[...document.querySelectorAll('.md-sidebar--primary .md-nav__list')].map(n=>n.scrollTop).reduce((a,b)=>a+b,0)""")
  for _ in range(6):pg.mouse.move(120,500);pg.mouse.wheel(0,500);pg.wait_for_timeout(150)
  after=pg.evaluate("""()=>[...document.querySelectorAll('.md-sidebar--primary .md-nav__list')].map(n=>n.scrollTop).reduce((a,b)=>a+b,0)""")
  y1=pg.evaluate('scrollY');tb=pg.evaluate("getComputedStyle(document.querySelector('.tabbar')||document.body).display")
  pg.screenshot(path=S+'drawer_bottom.png')
  print('scroller',sc,'drawer scroll',before,'->',after,'body',y0,'->',y1,'tabbar',tb)
  ok=after>before and abs(y1-y0)<2 and tb=='none'
print('DRAWER', 'PASS' if ok else 'FAIL');sys.exit(0 if ok else 1)
