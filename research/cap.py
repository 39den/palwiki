import asyncio, urllib.robotparser as rp, urllib.parse as up
from playwright.async_api import async_playwright
S={
'paldb':'https://paldb.cc/en/Anubis','game8':'https://game8.co/games/Palworld','palworldgg':'https://palworld.gg/pal/anubis',
'wikigg':'https://palworld.wiki.gg/wiki/Anubis','fandom':'https://palworld.fandom.com/wiki/Anubis',
'pokemondb':'https://pokemondb.net/pokedex/pikachu','serebii':'https://www.serebii.net/pokedex-sv/pikachu/',
'bulbapedia':'https://bulbapedia.bulbagarden.net/wiki/Pikachu_(Pok%C3%A9mon)','maxroll':'https://maxroll.gg/d4',
'mobalytics':'https://mobalytics.gg/lol/champions/ahri/build','ugg':'https://u.gg/lol/champions/ahri/build',
'blitz':'https://blitz.gg/lol/champions/Ahri','opgg':'https://op.gg/lol/champions/ahri/build',
'linear':'https://linear.app/docs','raycast':'https://manual.raycast.com/','perplexity':'https://www.perplexity.ai/',
'paldb_map':'https://paldb.cc/en/Map','palworldgg_breed':'https://palworld.gg/breeding-calculator','pokemondb_list':'https://pokemondb.net/pokedex/all',
'ours':'https://39den.github.io/palwiki/','ours_pal':'https://39den.github.io/palwiki/pals/anubis/','ours_compare':'https://39den.github.io/palwiki/compare/',
}
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
def ok(u):
  p=up.urlparse(u); r=rp.RobotFileParser(f'{p.scheme}://{p.netloc}/robots.txt')
  try: r.read(); return r.can_fetch('*',u)
  except: return True
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch()
    for k,u in S.items():
      if not ok(u): print(k,'ROBOTS-DISALLOW'); continue
      for vn,vp in (('m',dict(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)),('d',dict(viewport={'width':1366,'height':860}))):
        c=await b.new_context(user_agent=UA,color_scheme='dark',**vp); pg=await c.new_page()
        try:
          r=await pg.goto(u,timeout=30000,wait_until='domcontentloaded'); await pg.wait_for_timeout(3500)
          t=await pg.title(); await pg.screenshot(path=f'shots/{k}_{vn}.png')
          print(k,vn,r.status if r else '-',t[:60])
        except Exception as e: print(k,vn,'ERR',str(e)[:80])
        await c.close(); await asyncio.sleep(1.5)
    await b.close()
asyncio.run(main())
