import sys
from playwright.sync_api import sync_playwright
U=sys.argv[1];O=sys.argv[2];sch=sys.argv[3] if len(sys.argv)>3 else 'light'
PG=[('home',''),('gallery','gallery/'),('pal','4_spravochniki/paly/anubis/'),('boss','boss/grizzbolt/'),('map','map/'),('items','4_spravochniki/predmety/боеприпасы/')]
only=sys.argv[4].split(',') if len(sys.argv)>4 else None
with sync_playwright() as p:
  for br,dev,tag in (('webkit','iPhone 13','m390'),('chromium',None,'d1440')):
    b=getattr(p,br).launch();opt=p.devices[dev] if dev else {'viewport':{'width':1440,'height':900}}
    c=b.new_context(**opt,color_scheme=sch);pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:100]))
    pg.goto(U+'?pp26=1',wait_until='networkidle')
    pg.evaluate("s=>localStorage.setItem('/.__palette',JSON.stringify({index:s=='light'?1:0,color:{media:'',scheme:s=='light'?'default':'slate',primary:'custom',accent:'custom'}}))",sch)
    for n,u in PG:
      if only and n not in only:continue
      pg.goto(U+u,wait_until='networkidle')
      if not pg.evaluate("!!document.querySelector('script[src*=pp26]')"):pg.add_script_tag(url=U+'assets/pp26.js')
      pg.wait_for_timeout(1500)
      ok=pg.evaluate("document.documentElement.classList.contains('pp26')")
      pg.screenshot(path=f'{O}/pp26_{n}_{tag}_{sch}.png',full_page=False)
      if n in('home','pal'):pg.screenshot(path=f'{O}/pp26_{n}_{tag}_{sch}_full.png',full_page=True)
      print(tag,n,'pp26' if ok else 'NO-SKIN')
    print('errors',E);b.close()
