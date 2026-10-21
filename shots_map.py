import sys
from playwright.sync_api import sync_playwright
U=sys.argv[1];O='/workspace/palsite/shots/r9/'
with sync_playwright() as p:
  b=p.webkit.launch();c=b.new_context(**p.devices['iPhone 13'],color_scheme='dark');pg=c.new_page();E=[]
  pg.on('pageerror',lambda e:E.append(str(e)[:120]))
  pg.goto(U+'map/',wait_until='networkidle');pg.wait_for_timeout(1500)
  pg.screenshot(path=O+'map_m_idle.png')
  pg.locator('#mapq').tap();pg.keyboard.type('Ка',delay=60);pg.wait_for_timeout(900)
  r=pg.evaluate("""(()=>{const d=document.querySelector('.msd'),s=document.querySelector('.msheet');const r=d.getBoundingClientRect();const top=document.elementFromPoint(r.left+30,r.top+20);
   return {vis:!d.hidden&&r.height>40,n:d.querySelectorAll('button').length,first:(d.querySelector('button .t')||{}).textContent,ontop:d.contains(top),kb:s&&s.classList.contains('kb'),
   attrs:['autocomplete','autocorrect','autocapitalize','spellcheck','name','type','enterkeyhint'].map(a=>document.getElementById('mapq').getAttribute(a)).join(',')}})()""")
  print('mobile',r);pg.screenshot(path=O+'map_m_typing.png')
  pg.locator('.msd button').first.tap();pg.wait_for_timeout(2500);print('after pick',pg.url);pg.screenshot(path=O+'map_m_picked.png')
  pg.goto(U+'map/',wait_until='networkidle');pg.wait_for_timeout(1000);pg.locator('#mapq').tap();pg.keyboard.type('rfvjyjcrt',delay=30);pg.wait_for_timeout(800)
  print('layout', pg.evaluate("(document.querySelector('.msd button .t')||{}).textContent"))
  d=b.new_context(viewport={'width':1440,'height':900},color_scheme='dark');pd=d.new_page()
  pd.goto(U+'map/',wait_until='networkidle');pd.wait_for_timeout(1200);pd.locator('#mapq').click();pd.keyboard.type('Ка',delay=40);pd.wait_for_timeout(800);pd.screenshot(path=O+'map_d_typing.png')
  print('desktop n',pd.evaluate("document.querySelectorAll('.msd button').length"),'errors',E)
