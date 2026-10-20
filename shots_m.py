import sys,asyncio
from playwright.async_api import async_playwright
U=sys.argv[1].rstrip('/')
P=[('home','/'),('gallery','/gallery/'),('pal','/4_spravochniki/paly/anubis/'),('bygroup','/4_spravochniki/paly_po_stihiyam_i_rabote/'),('items','/4_spravochniki/predmety/материалы/'),('bosses','/4_spravochniki/bossy/'),('passives','/2_mehaniki/passivki/'),('walkthrough','/guide/03_prohozhdenie_1_80/'),('food','/guide/eda/'),('coords','/guide/koordinaty/'),('secrets','/guide/sekrety/'),('map','/map/'),('compare','/compare/')]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    for vw,(w,h,sc) in {'mobile':(390,844,2),'desktop':(1366,900,1)}.items():
      if vw=='desktop' and len(sys.argv)<3: continue
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=sc);pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
      for n,u in P:
        await pg.goto(U+u,wait_until='load',timeout=30000);await pg.wait_for_timeout(900)
        await pg.screenshot(path=f'shots/{n}_{vw}.png')
    print('errors',errs[:3]);await b.close()
asyncio.run(main())
