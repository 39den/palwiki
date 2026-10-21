import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.firefox.launch();n=0
    for k in range(8):
      c=await b.new_context();pg=await c.new_page();e=[]
      pg.on('console',lambda m:e.append(m.text[:140]) if m.type=='error' else None)
      await pg.goto(sys.argv[1]+'4_spravochniki/paly/',wait_until='load');await pg.wait_for_timeout(3000)
      print(k,[x for x in e if 'font' in x][:2]);await c.close()
    await b.close()
asyncio.run(main())
