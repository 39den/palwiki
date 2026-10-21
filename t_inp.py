import asyncio,sys
sys.path.insert(0,'/workspace/audit2026/deep');sys.argv=sys.argv[:1]
import deep_audit as A
from playwright.async_api import async_playwright
async def main():
  iss=A.Issues('/tmp/t_inp');store={}
  async with async_playwright() as p:
    br={}
    for prof in ('ios','desk'):
      for u in ('2_mehaniki/rabota/','my/'):
        ctx=await A.make_ctx(p,prof,br);ctx._aud_links=set();await A.input_page(ctx,'http://localhost:8933/palwiki/',u,prof,iss,store);await ctx.close()
  for i in iss.items:
    if i.get('sev') in ('P0','P1'):print(i.get('sev'),i.get('key'),i.get('profile'),i.get('page'),i.get('detail','')[:120])
asyncio.run(main())
