import sys,asyncio,subprocess,time
from playwright.sync_api import sync_playwright
U=sys.argv[1];O='/workspace/palsite/shots/r9/'
with sync_playwright() as p:
  b=p.webkit.launch();ip=p.devices['iPhone 13']
  c=b.new_context(**ip,color_scheme='dark');pg=c.new_page();errs=[]
  pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
  def go(u,name,act=None,full=False):
    pg.goto(U+u,wait_until='networkidle');pg.wait_for_timeout(900)
    if act:act()
    pg.screenshot(path=O+name,full_page=full)
  go('2_mehaniki/aktivki/','skills_m.png')
  def ex():
    pg.evaluate("(()=>{const d=document.querySelector('.skc:not([hidden])');d.open=true;d.scrollIntoView({block:'start'});scrollBy(0,-90)})()");pg.wait_for_timeout(300)
  go('2_mehaniki/aktivki/?ef=Яд','skills_poison_m.png',ex)
  go('boss/shaolong/','boss_shaolong_m.png',full=True)
  def hab():
    pg.locator('.hab').first.scroll_into_view_if_needed();pg.wait_for_timeout(1500)
  go('4_spravochniki/paly/cremis/','cremis_hab_m.png',lambda:(pg.locator('.tabbed-labels label:has-text("Где живёт")').first.click() if pg.locator('.tabbed-labels label:has-text("Где живёт")').count() else None,hab()))
  def srch():
    pg.locator('#hsq').click();pg.keyboard.type('где найти кремис',delay=25);pg.wait_for_timeout(2000)
  go('','search_where_m.png',srch)
  go('map/?pal=SheepBall','map_hab_m.png',lambda:pg.wait_for_timeout(2000))
  go('map/?w=tree','map_tree_m.png',lambda:pg.wait_for_timeout(2500))
  d=b.new_context(viewport={'width':1440,'height':900},color_scheme='dark');pd=d.new_page()
  pd.goto(U+'boss/shaolong/',wait_until='networkidle');pd.wait_for_timeout(900);pd.screenshot(path=O+'boss_shaolong_d.png')
  pd.goto(U+'2_mehaniki/aktivki/',wait_until='networkidle');pd.wait_for_timeout(600);pd.screenshot(path=O+'skills_d.png')
  print('errors',errs)
