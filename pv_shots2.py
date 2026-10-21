# stage-1 shots, deployed preview, light+dark, WebKit iPhone 13 + Chromium 1440
import asyncio,sys,time,os
from playwright.async_api import async_playwright
U='https://39den.github.io/palwiki-preview/';O='/workspace/palsite/shots/s1b/';os.makedirs(O,exist_ok=True)
P=[('home',''),('pal_list','gallery/'),('pal','4_spravochniki/paly/starryon/'),('pal2','4_spravochniki/paly/fuack_ignis/'),('boss','boss/alpha_anubis/'),('map','map/'),('items','4_spravochniki/predmety/боеприпасы/'),('food','guide/eda/')]
async def main():
  async with async_playwright() as p:
    for br,dev,tag in (('webkit','iPhone 13','webkit_390'),('chromium',None,'chromium_1440')):
      b=await getattr(p,br).launch()
      for sch,idx in (('light',1),('dark',0)):
        c=await b.new_context(**(p.devices[dev] if dev else {'viewport':{'width':1440,'height':900}}))
        await c.add_init_script("try{localStorage.setItem('/palwiki-preview/.__palette',JSON.stringify({index:%d,color:{media:'',scheme:'%s',primary:'indigo',accent:'indigo'}}));localStorage.setItem('pp26th','1');localStorage.setItem('pw_inst_x','1')}catch(e){}"%(idx,'default' if idx==1 else 'slate'))
        for nm,path in P:
          pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:90]))
          await pg.goto(U+path+'?t=%d'%time.time(),wait_until='load');await pg.wait_for_timeout(3000)
          if nm=='food':await pg.evaluate("document.querySelector('.fgrid')&&(document.querySelector('.fgrid').scrollIntoView({block:'start'}),scrollBy(0,-90))");await pg.wait_for_timeout(700)
          s=await pg.evaluate("document.body.getAttribute('data-md-color-scheme')")
          await pg.screenshot(path=f'{O}{nm}_{tag}_{sch}.png');print(nm,tag,sch,s,errs[:1],flush=True);await pg.close()
        await c.close()
      await b.close()
asyncio.run(main())
