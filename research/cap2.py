import asyncio
from playwright.async_api import async_playwright
B='https://39den.github.io/palwiki/'
S={'ours_pal':B+'4_spravochniki/paly/anubis/','ours_map':B+'map/','ours_breed':B+'breed/','ours_gallery':B+'gallery/','ours_passiv':B+'passivki/','ours_boss':B+'boss/alpha_anubis/',
'wikigg_search':'https://palworld.wiki.gg/wiki/Anubis','opgg_search':'https://op.gg/lol/champions/ahri/build','ours_search':B}
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch()
    for k,u in S.items():
      for vn,vp in (('m',dict(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)),('d',dict(viewport={'width':1366,'height':860}))):
        c=await b.new_context(user_agent=UA,color_scheme='dark',**vp); pg=await c.new_page()
        try:
          await pg.goto(u,timeout=30000,wait_until='domcontentloaded'); await pg.wait_for_timeout(3000)
          if k.endswith('_search'):
            sel='input[type=search], input[name=search], input[placeholder*="earch"], input[placeholder*="оиск"], input[type=text]'
            try:
              for t in ['label[for=__search]','button[aria-label*="earch"]','[class*=search] button']:
                if await pg.locator(t).count(): 
                  try: await pg.locator(t).first.click(timeout=2000); break
                  except: pass
              i=pg.locator(sel).first; await i.click(timeout=4000); await pg.wait_for_timeout(1200)
              await pg.screenshot(path=f'shots/{k}_empty_{vn}.png')
              await i.type('anu' if 'ours' not in k else 'ану',delay=120); await pg.wait_for_timeout(2000)
            except Exception as e: print(k,'nosearch',str(e)[:60])
          await pg.screenshot(path=f'shots/{k}_{vn}.png'); print(k,vn,'ok')
          if k=='ours_pal' and vn=='m': await pg.screenshot(path=f'shots/{k}_full_m.png',full_page=True)
        except Exception as e: print(k,vn,'ERR',str(e)[:80])
        await c.close(); await asyncio.sleep(1.5)
    await b.close()
asyncio.run(main())
