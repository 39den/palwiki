import asyncio,os,json,sys
from playwright.async_api import async_playwright
PAGES=sys.argv[1].split(',') if len(sys.argv)>1 else ['home','pal','compare','places','dishes','boss','map','search','cards']
async def run(p,eng,bt,name,kw,res):
  b=await bt.launch();c=await b.new_context(**kw);pg=await c.new_page();errs=[]
  pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
  for n in PAGES:
    errs.clear()
    await pg.goto('file://'+os.path.abspath(n+'.html')+'?static=1',wait_until='load');await pg.wait_for_timeout(700)
    await pg.evaluate('async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)}');await pg.wait_for_timeout(500)
    info=await pg.evaluate('''()=>{const W=innerWidth;const off=[...document.querySelectorAll('main *,header *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>W+1&&!e.closest('.rail,.filters,.tabs,.sugg,.ghost,.scene,.cast,.hero')}).slice(0,5).map(e=>e.className.baseVal!==undefined?'svg':(e.className||e.tagName));
      const caps=[...document.querySelectorAll('figure img')].filter(i=>!i.parentElement.querySelector('.cap')).length;const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop());
      return {sw:document.documentElement.scrollWidth,W,off,nocap:caps,broken}}''')
    await pg.add_style_tag(content='.bn{display:none!important}')
    os.makedirs('shots',exist_ok=True);f=f'shots/{n}_{name}.png'
    await pg.screenshot(path=f,full_page=True)
    res[f'{n}_{name}']=dict(overflow=info['sw']>info['W'],off=info['off'],nocap=info['nocap'],broken=info['broken'],errors=list(errs))
  await b.close()
async def main():
  res={}
  async with async_playwright() as p:
    jobs=[]
    for eng,bt in [('chromium',p.chromium),('webkit',p.webkit),('firefox',p.firefox)]:
      for name,kw in [('1440',dict(viewport={'width':1440,'height':900})),('820',dict(viewport={'width':820,'height':1180},has_touch=eng!='firefox',device_scale_factor=1)),
                      ('390',dict(**p.devices['iPhone 13']) if eng=='webkit' else dict(viewport={'width':390,'height':844},device_scale_factor=2,**({'is_mobile':True,'has_touch':True} if eng=='chromium' else {})))]:
        jobs.append(run(p,eng,bt,f'{eng}_{name}',kw,res))
    await asyncio.gather(*jobs)
  old=json.load(open('shots/matrix.json')) if os.path.exists('shots/matrix.json') else {}
  old.update(res);json.dump(old,open('shots/matrix.json','w'),indent=1,ensure_ascii=False)
  bad={k:v for k,v in res.items() if v['overflow'] or v['off'] or v['nocap'] or v['broken'] or v['errors']}
  print(len(res),'checked; issues:',json.dumps(bad,ensure_ascii=False,indent=0)[:3000])
asyncio.run(main())
