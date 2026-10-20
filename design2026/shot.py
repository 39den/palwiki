import asyncio,os
from playwright.async_api import async_playwright
from PIL import Image
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    import sys
    for k in sys.argv[1]:
      os.makedirs(f'concept_{k}/shots',exist_ok=True)
      for w,h,tag in [(390,844,'m'),(1366,860,'d')]:
        pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
        for n in ['home','pal','search']:
          await pg.goto('file://'+os.path.abspath(f'concept_{k}/{n}.html'));await pg.wait_for_timeout(1200)
          await pg.screenshot(path=f'concept_{k}/shots/{n}_{tag}.png')
        await pg.close()
      ims=[Image.open(f'concept_{k}/shots/{n}_m.png') for n in ['home','pal','search']]
      d=Image.open(f'concept_{k}/shots/home_d.png').resize((1366*844//860,844))
      W=sum(i.width for i in ims)+d.width+5*20;C=Image.new('RGB',(W,884),'#222')
      x=20
      for i in ims+[d]: C.paste(i,(x,20));x+=i.width+20
      C.save(f'concept_{k}.png')
    await b.close()
asyncio.run(main())
