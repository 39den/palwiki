import sys,asyncio
from playwright.async_api import async_playwright
U=sys.argv[1].rstrip('/');pages=[('home','/'),('gallery','/gallery/'),('pal','/4_spravochniki/paly/anubis/'),('map','/map/'),('compare','/compare/')]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for vw,(w,h) in {'desktop':(1366,900),'mobile':(390,844)}.items():
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=1 if vw=='desktop' else 2);pg=await ctx.new_page();errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)))
      for n,path in pages:
        await pg.goto(U+path,wait_until='networkidle');await pg.wait_for_timeout(1200)
        if n=='home':
          await pg.fill('#home-q','чем бить зои');await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'shots/{n}_{vw}.png')
      print(vw,'errors:',errs[:3])
    await b.close()
asyncio.run(main())
