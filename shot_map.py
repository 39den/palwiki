import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    for n,(w,h,sc) in {'desktop':(1366,900,1),'mobile':(390,844,2)}.items():
      pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=sc);pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto(U+'/map/',wait_until='networkidle');await pg.wait_for_timeout(1500);await pg.screenshot(path=f'shots/map_{n}.png')
      if n=='desktop':
        for q,f in [('Rayne','tower'),('Анубис','alpha')]:
          await pg.fill('#mapq','');await pg.fill('#mapq',q);await pg.wait_for_timeout(2500);await pg.screenshot(path=f'shots/map_zoom_{f}.png')
    print('errors',errs[:3]);await b.close()
asyncio.run(main())
