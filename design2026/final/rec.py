import asyncio,os,glob,json
from playwright.async_api import async_playwright
U=lambda n,q='':'file://'+os.path.abspath(n+'.html')+q
FT="""()=>new Promise(r=>{const t=[];let l=performance.now();function f(n){t.push(n-l);l=n;if(t.length<240)requestAnimationFrame(f);else r(t)}requestAnimationFrame(f)})"""
async def rec(b,name,kw,fn):
  d=f'video/tmp_{name}';os.makedirs(d,exist_ok=True)
  c=await b.new_context(record_video_dir=d,record_video_size=kw['viewport'],**kw);pg=await c.new_page()
  out=await fn(pg);await c.close()
  v=glob.glob(d+'/*.webm')[0];os.replace(v,f'video/{name}.webm');os.rmdir(d);return out
async def scroll(pg):
  await pg.goto(U('home'));await pg.wait_for_timeout(1200)
  ft=pg.evaluate(FT)
  for i in range(30): await pg.mouse.wheel(0,90);await pg.wait_for_timeout(50)
  t=await ft;await pg.wait_for_timeout(800);return t
async def tilt(pg):
  await pg.goto(U('home'));await pg.wait_for_timeout(800);await pg.evaluate("scrollTo(0,1000)");await pg.wait_for_timeout(1200)
  box=await pg.locator('.b-pod').bounding_box();ft=pg.evaluate(FT)
  for i in range(40): await pg.mouse.move(box['x']+box['width']*(0.1+0.8*i/40),box['y']+box['height']*(0.2+0.6*((i%20)/20)));await pg.wait_for_timeout(30)
  await pg.mouse.move(5,5);t=await ft;await pg.wait_for_timeout(700)
  for sel in ['.b-map','.b-vs','.pc']: await pg.hover(sel);await pg.wait_for_timeout(500)
  return t
async def search(pg):
  await pg.goto(U('home'));await pg.wait_for_timeout(1200);ft=pg.evaluate(FT)
  await pg.keyboard.press('Control+k');await pg.wait_for_timeout(1500);await pg.keyboard.press('Escape');await pg.wait_for_timeout(800)
  await pg.click('.sp');await pg.wait_for_timeout(1000);t=await ft;return t
async def theme(pg):
  await pg.goto(U('pal','?theme=light'));await pg.wait_for_timeout(1200);ft=pg.evaluate(FT)
  await pg.click('.tg');await pg.wait_for_timeout(1500);await pg.click('.tg');await pg.wait_for_timeout(1500);t=await ft;return t
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();R={}
    D=dict(viewport={'width':1440,'height':900});M=dict(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    import sys
    L=[('scroll_reveal_mobile',M,scroll),('scroll_reveal_desktop',D,scroll),('hover_tilt_desktop',D,tilt),('search_open_desktop',D,search),('theme_switch_mobile',M,theme),('search_open_mobile',M,search)]
    for n,kw,f in [x for x in L if len(sys.argv)<2 or x[0] in sys.argv[1:]]:
      t=await rec(b,n,kw,f);t=t[1:];R[n]=dict(frames=len(t),avg=round(sum(t)/len(t),1),max=round(max(t),1),over33=sum(x>33.4 for x in t),over50=sum(x>50 for x in t))
    await b.close()
  old=json.load(open('video/frametimes.json')) if os.path.exists('video/frametimes.json') else {};old.update(R);json.dump(old,open('video/frametimes.json','w'),indent=1);print(json.dumps(R,indent=1))
asyncio.run(main())
