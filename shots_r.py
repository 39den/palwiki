import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1].rstrip('/')
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark');pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)[:100]))
    await pg.goto(U+'/',wait_until='networkidle');await pg.wait_for_timeout(1200);await pg.screenshot(path='shots/r_home_mobile.png')
    await pg.screenshot(path='shots/r_home_mobile_full.png',full_page=True)
    await pg.click('label.md-header__button[for=__drawer]');await pg.wait_for_timeout(700);await pg.screenshot(path='shots/r_drawer_mobile.png')
    await pg.goto(U+'/4_spravochniki/paly/anubis/',wait_until='networkidle');await pg.wait_for_timeout(1200);await pg.screenshot(path='shots/r_anubis_mobile.png')
    await pg.click('.tabbed-labels label:has-text("Пассивки")');await pg.wait_for_timeout(400);el=await pg.query_selector('.psets');await el.scroll_into_view_if_needed();await pg.screenshot(path='shots/r_anubis_passives.png')
    await pg.click('.psets a.psv');await pg.wait_for_timeout(900);await pg.screenshot(path='shots/r_anubis_sheet.png')
    await pg.goto(U+'/gallery/',wait_until='networkidle');await pg.wait_for_timeout(1200);await pg.screenshot(path='shots/r_gallery_mobile.png')
    d=await b.new_page(viewport={'width':1366,'height':900});await d.goto(U+'/',wait_until='networkidle');await d.wait_for_timeout(1000);await d.screenshot(path='shots/r_home_desktop.png')
    await d.goto(U+'/4_spravochniki/paly/anubis/',wait_until='networkidle');await d.wait_for_timeout(800);await d.screenshot(path='shots/r_anubis_desktop.png')
    print('errors',errs);await b.close()
asyncio.run(main())
