# text-only redesign audit of preview pages (RULES_ECONOMY): writes pv_audit.json + short summary
import asyncio,sys,time,json
from playwright.async_api import async_playwright
U='https://39den.github.io/palwiki-preview/'
P=sys.argv[1].split(',')
JS=r"""(()=>{const out={};out.ov=document.documentElement.scrollWidth-innerWidth;
const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0};
const lum=c=>{const m=c.match(/[\d.]+/g);if(!m)return null;const a=m.slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return {l:.2126*a[0]+.7152*a[1]+.0722*a[2],a:m[3]===undefined?1:+m[3]}};
const bgOf=e=>{while(e){const c=getComputedStyle(e).backgroundColor;const L=lum(c);if(L&&L.a>.5)return L.l;e=e.parentElement}return 1};
const low=[];document.querySelectorAll('.md-content p,.md-content li,.md-content small,.md-content b,.md-content span,.md-content a,.md-content h1,.md-content h2,.md-content h3,.md-content td,.md-content label').forEach(e=>{if(!vis(e)||!e.childNodes.length||![...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim()))return;const f=lum(getComputedStyle(e).color);if(!f)return;const b=bgOf(e);const hi=Math.max(f.l,b),lo=Math.min(f.l,b);const cr=(hi+.05)/(lo+.05);if(cr<3.2)low.push((e.className||e.tagName).toString().slice(0,24)+':'+cr.toFixed(1)+':'+e.textContent.trim().slice(0,20))});out.lowContrast=low.length;out.lowEx=low.slice(0,5);
const fonts={};document.querySelectorAll('.md-content *').forEach(e=>{if(!vis(e))return;const f=getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,'');fonts[f]=(fonts[f]||0)+1});out.fonts=fonts;
out.red=[...document.querySelectorAll('body *')].filter(e=>{const c=getComputedStyle(e);if(parseFloat(c.borderTopWidth)<1)return false;const m=c.borderTopColor.match(/\d+/g);return m&&+m[0]>180&&+m[1]<80&&+m[2]<80&&vis(e)}).length;
out.dbl=[...document.querySelectorAll('input[type=search],input[type=text],input:not([type])')].filter(i=>{if(!vis(i))return false;const p=i.parentElement;const cs=getComputedStyle(p);return parseFloat(cs.borderTopWidth)>0&&parseFloat(getComputedStyle(i).borderTopWidth)>0&&p.getBoundingClientRect().height<i.getBoundingClientRect().height+30}).map(i=>i.id||i.className).slice(0,4);
out.tiny=[...document.querySelectorAll('.md-content a,.md-content button')].filter(e=>{const r=e.getBoundingClientRect();return vis(e)&&r.height<28&&getComputedStyle(e).display!='inline'}).length;
out.tables=document.querySelectorAll('.md-content table').length;
out.mdLeak=(document.querySelector('.md-content')||document.body).innerText.split('\n').filter(l=>/^\s*(\*\*|- |#)/.test(l)).length;
return out})()"""
async def main():
  res={}
  async with async_playwright() as p:
    for br,dev,tag in (('webkit','iPhone 13','w390'),('chromium',None,'c1440')):
      b=await getattr(p,br).launch()
      for sch,idx in (('light',1),('dark',0)):
        c=await b.new_context(**(p.devices[dev] if dev else {'viewport':{'width':1440,'height':900}}))
        await c.add_init_script("try{localStorage.setItem('/palwiki-preview/.__palette',JSON.stringify({index:%d,color:{media:'',scheme:'%s',primary:'indigo',accent:'indigo'}}));localStorage.setItem('pp26th','1');localStorage.setItem('pw_inst_x','1')}catch(e){}"%(idx,'default' if idx==1 else 'slate'))
        for path in P:
          pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:80]))
          await pg.goto(U+path+'?t=%d'%time.time(),wait_until='load');await pg.wait_for_timeout(2500)
          r=await pg.evaluate(JS);r['errs']=errs[:2]
          if len(sys.argv)>2:await pg.screenshot(path=f'{sys.argv[2]}/{path.strip("/").replace("/","_") or "home"}_{tag}_{sch}.png')
          res[f'{path}|{tag}|{sch}']=r;await pg.close()
        await c.close()
      await b.close()
  json.dump(res,open('/workspace/palsite/pv_audit.json','w'),ensure_ascii=False,indent=0)
  for k,r in res.items():
    bad={x:r[x] for x in ('ov','red','tables','mdLeak','lowContrast') if r[x]}
    if r['dbl']:bad['dbl']=r['dbl']
    if r['errs']:bad['errs']=r['errs']
    if bad:print(k,bad)
asyncio.run(main())
