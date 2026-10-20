import asyncio,os,sys,json
from playwright.async_api import async_playwright
PAGES=['home','pal','search','boss']
async def main():
  res={}
  async with async_playwright() as p:
    os.makedirs('shots',exist_ok=True)
    cfg=[('chromium',p.chromium,dict(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2),'m'),
         ('chromium',p.chromium,dict(viewport={'width':1440,'height':900}),'d'),
         ('webkit',p.webkit,dict(**p.devices['iPhone 13']),'m'),
         ('webkit',p.webkit,dict(viewport={'width':1440,'height':900}),'d'),
         ('firefox',p.firefox,dict(viewport={'width':390,'height':844},device_scale_factor=2),'m'),
         ('firefox',p.firefox,dict(viewport={'width':1440,'height':900}),'d')]
    for eng,bt,kw,t in cfg:
      b=await bt.launch()
      for th in (['light','dark'] if eng=='chromium' else ['light']):
        c=await b.new_context(**kw);pg=await c.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        for n in PAGES:
          await pg.goto('file://'+os.path.abspath(n+'.html')+f'?theme={th}&static=1');await pg.wait_for_timeout(1200);await pg.evaluate('()=>document.querySelectorAll("img[loading=lazy]").forEach(i=>i.loading="eager")');await pg.wait_for_timeout(400)
          ov=await pg.evaluate("()=>document.documentElement.scrollWidth>innerWidth+1")
          fonts=await pg.evaluate("async()=>{await document.fonts.ready;return [...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)==i)}")
          tag=f'{n}_{t}_{th}' if eng=='chromium' else f'{eng}_{n}_{t}'
          await pg.screenshot(path=f'shots/{tag}.png')
          res[tag]=dict(overflow=ov,fonts=fonts,errors=list(errs))
          if eng=='chromium' and n=='home' and th=='light':
            await pg.evaluate('async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0)}');await pg.wait_for_timeout(600);await pg.add_style_tag(content='.bn{display:none}');await pg.screenshot(path=f'home_full_{"mobile" if t=="m" else "desktop"}.png',full_page=True)
        await c.close()
      await b.close()
  json.dump(res,open('shots/report.json','w'),indent=1,ensure_ascii=False)
  bad={k:v for k,v in res.items() if v['overflow'] or v['errors']};print('issues',bad);print('fonts sample',res.get('webkit_home_m'))
asyncio.run(main())
