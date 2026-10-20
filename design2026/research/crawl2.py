import asyncio,json,urllib.robotparser as rp,urllib.parse as up,time
from playwright.async_api import async_playwright
S=[('godly','https://godly.website/'),('framer','https://www.framer.com/'),('lusion','https://lusion.co/'),('nothing','https://nothing.tech/'),('mihoyo_hi3','https://honkaiimpact3.hoyoverse.com/global/en-us')]
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
def allowed(u):
  p=up.urlparse(u);r=rp.RobotFileParser(f'{p.scheme}://{p.netloc}/robots.txt')
  try: r.read()
  except Exception as e: return True,'robots unreadable'
  return r.can_fetch('*',u),'ok'
async def one(b,n,u,log):
  ok,why=allowed(u)
  if not ok: log.append(dict(site=n,url=u,status='skipped: robots.txt disallow'));return
  ent=dict(site=n,url=u,robots=why)
  for w,h,t,mob in [(1440,900,'d',False),(390,844,'m',True)]:
    c=await b.new_context(viewport={'width':w,'height':h},user_agent=UA if not mob else None,is_mobile=mob,has_touch=mob,device_scale_factor=1)
    pg=await c.new_page()
    try:
      await pg.goto(u,timeout=35000,wait_until='commit');await pg.wait_for_timeout(5000)
      await pg.screenshot(path=f'modern/{n}_{t}.png')
      if t=='d':
        await pg.mouse.wheel(0,1400);await pg.wait_for_timeout(2500);await pg.screenshot(path=f'modern/{n}_d2.png')
        ent['title']=await pg.title()
        ent['fonts']=await pg.evaluate("()=>[...new Set([...document.querySelectorAll('h1,h2,p,a')].slice(0,80).map(e=>getComputedStyle(e).fontFamily.split(',')[0]))].slice(0,5)")
        ent['h1px']=await pg.evaluate("()=>{const e=document.querySelector('h1,h2');return e?getComputedStyle(e).fontSize:null}")
        ent['video']=await pg.evaluate("()=>document.querySelectorAll('video').length")
        ent['canvas']=await pg.evaluate("()=>document.querySelectorAll('canvas').length")
      ent['status_'+t]='ok'
    except Exception as e: ent['status_'+t]='err '+str(e)[:80]
    await c.close()
  log.append(ent)
async def main():
  log=[]
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for i in range(0,len(S),4):
      await asyncio.gather(*[one(b,n,u,log) for n,u in S[i:i+4]])
    await b.close()
  json.dump(log,open('modern/log2.json','w'),indent=1,ensure_ascii=False)
asyncio.run(main())
