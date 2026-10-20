import asyncio,os,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();os.makedirs('shots',exist_ok=True)
    for th in ['light','dark']:
      for w,h,t in [(390,844,'m'),(1440,900,'d')]:
        c=await b.new_context(viewport={'width':w,'height':h},is_mobile=(t=='m'),has_touch=(t=='m'));pg=await c.new_page()
        for n in ['home','pal','search','boss']:
          await pg.goto('file://'+os.path.abspath(n+'.html')+f'?theme={th}&static=1');await pg.wait_for_timeout(1500)
          await pg.screenshot(path=f'shots/{n}_{t}_{th}.png')
          if n=='home' and th=='light':
            await pg.add_style_tag(content='.bn{display:none}');await pg.screenshot(path=f'shots/full_{t}.png',full_page=True)
        await c.close()
    await b.close()
asyncio.run(main())
