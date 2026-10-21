# stage-1 shots from the deployed preview: WebKit iPhone 13 (390) + Chromium 1440; also gallery CLS (cold)
import asyncio,sys,time,json
from playwright.async_api import async_playwright
U='https://39den.github.io/palwiki-preview/';O='/workspace/palsite/shots/s1/';import os;os.makedirs(O,exist_ok=True)
P=[('home',''),('gallery','gallery/'),('pal','4_spravochniki/paly/anubis/'),('boss',sys.argv[1]),('map','map/'),('items','4_spravochniki/predmety/боеприпасы/'),('item_open','4_spravochniki/predmety/боеприпасы/#'+sys.argv[2]),('food','guide/eda/')]
CLS="""window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})"""
async def main():
  async with async_playwright() as p:
    for br,dev,tag in (('webkit','iPhone 13','webkit_390'),('chromium',None,'chromium_1440')):
      b=await getattr(p,br).launch()
      for nm,path in P:
        c=await b.new_context(**(p.devices[dev] if dev else {'viewport':{'width':1440,'height':900}}));pg=await c.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:100]))
        if br=='chromium':await pg.add_init_script(CLS)
        await pg.goto(U+path.replace('#','?t=%d#'%time.time()) if '#' in path else U+path+'?t=%d'%time.time(),wait_until='load');await pg.wait_for_timeout(3500)
        if nm=='food':await pg.evaluate("document.querySelector('.fgrid')&&(document.querySelector('.fgrid').scrollIntoView({block:'start'}),scrollBy(0,-80))");await pg.wait_for_timeout(800)
        cls=await pg.evaluate('window.__cls') if br=='chromium' else None
        pp=await pg.evaluate("document.documentElement.classList.contains('pp26')")
        await pg.screenshot(path=f'{O}{nm}_{tag}.png');print(nm,tag,'pp26',pp,'cls',cls and round(cls,3),'errs',errs[:2],flush=True);await c.close()
      await b.close()
asyncio.run(main())
