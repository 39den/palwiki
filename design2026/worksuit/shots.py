import asyncio,os,json
from playwright.async_api import async_playwright
H=os.path.abspath('index.html')
CHK='''()=>{const W=innerWidth;const off=[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>W+1&&!e.closest('.wchips,.ghost')}).slice(0,6).map(e=>e.className&&e.className.baseVal===undefined?e.className:e.tagName);
const cv=document.createElement('canvas').getContext('2d');const ins=[...document.querySelectorAll('.inp input')].map(i=>{const cs=getComputedStyle(i);cv.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;const w=cv.measureText(i.placeholder).width;
 const pl=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight);return {ph:i.placeholder,fits:w<=i.clientWidth-pl,phw:Math.round(w),box:i.clientWidth,font:cs.fontFamily.split(',')[0],size:cs.fontSize,manrope:document.fonts.check('800 20px Manrope','Работа')}});
const lv=[...document.querySelectorAll('.lv b')].filter(b=>b.scrollWidth>b.clientWidth+1).length;
return {sw:document.documentElement.scrollWidth,W,off,inputs:ins,lvOverflow:lv}}'''
async def run(p,eng,bt,w,res):
  b=await bt.launch()
  kw=dict(viewport={'width':1440,'height':900}) if w==1440 else (dict(**p.devices['iPhone 13']) if eng=='webkit' else dict(viewport={'width':390,'height':844},device_scale_factor=2,**({'is_mobile':True,'has_touch':True} if eng=='chromium' else {})))
  c=await b.new_context(**kw);pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
  for tag,qs in [('',''),('_tip','&tip=t1')] if (w==390) else [('','')]:
    await pg.goto('http://127.0.0.1:8947/worksuit/index.html?static=1'+qs,wait_until='load');await pg.evaluate('document.fonts.ready');await pg.wait_for_timeout(500)
    if not tag:
      info=await pg.evaluate(CHK);res[f'{eng}_{w}']=dict(info,errors=list(errs))
    await pg.add_style_tag(content='.bn{display:none!important}')
    f=f'shots/worksuit_{eng}_{w}{tag}.png'
    if tag: await pg.screenshot(path=f,clip={'x':0,'y':0,'width':390,'height':844},full_page=True) if False else await pg.locator('section.blk').first.screenshot(path=f)
    else: await pg.screenshot(path=f,full_page=True)
  if w==1440 and eng=='chromium':
    await pg.goto('http://127.0.0.1:8947/worksuit/index.html?static=1&w=mining',wait_until='load');await pg.wait_for_timeout(400)
    await pg.fill('#ps','2600');await pg.fill('#wl','30000');await pg.add_style_tag(content='.bn{display:none!important}')
    await pg.locator('section.blk').nth(1).screenshot(path='shots/worksuit_chromium_1440_calc2600.png')
    await pg.locator('section.blk').nth(0).screenshot(path='shots/worksuit_chromium_1440_mining.png')
    await pg.evaluate("document.querySelectorAll('details.ac').forEach(d=>d.open=true)");await pg.locator('section.blk').nth(2).screenshot(path='shots/worksuit_chromium_1440_accordion_open.png')
  await b.close()
async def main():
  os.makedirs('shots',exist_ok=True);res={}
  async with async_playwright() as p:
    await asyncio.gather(*[run(p,eng,bt,w,res) for eng,bt in [('chromium',p.chromium),('webkit',p.webkit),('firefox',p.firefox)] for w in (390,1440)])
  json.dump(res,open('shots/check.json','w'),ensure_ascii=False,indent=1)
  for k,v in sorted(res.items()): print(k,'overflow' if v['sw']>v['W'] else 'ok',v['off'],'lvOv',v['lvOverflow'],[(i['ph'],i['fits'],i['phw'],i['box'],i['font'],i['size'],i['manrope']) for i in v['inputs']],v['errors'])
asyncio.run(main())
