# MAPICONS test: overlaps per zoom, clickability, popup fit, legend icons, no JS errors, habitat for all pals.
# usage: python3 mapicons_test.py BASE_URL OUTDIR [--hab]
import sys,json,os
from playwright.sync_api import sync_playwright
U=sys.argv[1];O=sys.argv[2];os.makedirs(O,exist_ok=True);HAB='--hab' in sys.argv;R={}
JS_OV="""(()=>{const r=[...document.querySelectorAll('.gmk>i')].map(i=>i.getBoundingClientRect()).filter(b=>b.width);let o=0;
for(let a=0;a<r.length;a++)for(let b=a+1;b<r.length;b++){const A=r[a],B=r[b];if(A.left<B.right-1&&B.left<A.right-1&&A.top<B.bottom-1&&B.top<A.bottom-1)o++}
const mr=document.querySelector(MAPSEL).getBoundingClientRect();let cl=0,vis=0;
[...document.querySelectorAll('.gmk')].forEach(e=>{const b=e.firstChild.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;if(x<Math.max(mr.left,0)+2||y<Math.max(mr.top,0)+2||x>Math.min(mr.right,innerWidth)-2||y>Math.min(mr.bottom,innerHeight)-2)return;const h=document.elementFromPoint(x,y);if(!h)return;const g=h.closest('.gmk');if(!g&&!h.closest('.leaflet-pane'))return;vis++;if(g===e)cl++});
return {icons:r.length,overlaps:o,visible:vis,clickable:cl,clusters:document.querySelectorAll('.marker-cluster').length,emoji_pmk:document.querySelectorAll('.pmk').length}})()"""
def zooms(pg,mapsel,M,tag,shot):
  out={};zs=pg.evaluate(f"[{M}.m.getMinZoom(),{M}.m.getMaxZoom()]")
  z=zs[0]
  while z<=zs[1]:
    pg.evaluate(f"{M}.m.setZoom({z},{{animate:false}});{M}.dc&&{M}.dc.run()");pg.wait_for_timeout(500)
    out[str(z)]=pg.evaluate(JS_OV.replace('MAPSEL',json.dumps(mapsel)))
    if shot and z in (zs[0],3):pg.screenshot(path=f'{O}/{tag}_z{z}.png')
    z+=1
  return out
def popup(pg,mapsel,M,z=3):
  # open the marker nearest the top edge
  pg.evaluate(f"{M}.m.setZoom({z},{{animate:false}});{M}.dc.run()");pg.wait_for_timeout(400)
  ok=pg.evaluate("""(sel)=>{const mr=document.querySelector(sel).getBoundingClientRect();const e=[...document.querySelectorAll('.gmk')].map(e=>[e,e.firstChild.getBoundingClientRect()]).filter(([e,b])=>b.top>mr.top+5&&b.bottom<mr.bottom).sort((a,b)=>a[1].top-b[1].top)[0];if(!e)return null;const b=e[1];return [b.left+b.width/2,b.top+b.height/2]}""",mapsel)
  if not ok:return {'err':'no marker'}
  pg.mouse.click(*ok);pg.wait_for_timeout(700)
  return pg.evaluate("""(sel)=>{const p=document.querySelector('.leaflet-popup');if(!p)return {open:false};const r=p.getBoundingClientRect(),mr=document.querySelector(sel).getBoundingClientRect();
   return {open:true,inside:r.top>=mr.top-1&&r.left>=mr.left-1&&r.right<=mr.right+1&&r.bottom<=mr.bottom+1,link:!!p.querySelector('a[href]'),usersel:getComputedStyle(p).userSelect||getComputedStyle(p).webkitUserSelect}}""",mapsel)
def legend(pg):
  return pg.evaluate("(()=>{const l=[...document.querySelectorAll('.mleg label')];return {rows:l.length,withIcon:l.filter(x=>x.querySelector('.gmk-l img')).length}})()")
with sync_playwright() as p:
  for name,mk in [('chromium1440',lambda:p.chromium.launch().new_context(viewport={'width':1440,'height':900})),('webkit390',lambda:p.webkit.launch().new_context(**{**p.devices['iPhone 13'],'viewport':{'width':390,'height':844}}))]:
    c=mk();pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:160]))
    pg.goto(U+'map/',wait_until='networkidle');pg.wait_for_timeout(1500)
    r={'palpagos':zooms(pg,'#pwmap','PW_map',name+'_palpagos',True),'legend':legend(pg),'popup':popup(pg,'#pwmap','PW_map')}
    pg.screenshot(path=f'{O}/{name}_palpagos_popup.png')
    pg.goto(U+'map/?w=tree',wait_until='networkidle');pg.wait_for_timeout(2500)
    tm=pg.evaluate("!!document.getElementById('wtmap')")
    if tm:
      r['tree']=zooms(pg,'#wtmap','PW_tmap',name+'_tree',True);r['tree_legend']=legend(pg);r['tree_popup']=popup(pg,'#wtmap','PW_tmap',1);pg.screenshot(path=f'{O}/{name}_tree_popup.png')
    r['tree_present']=tm
    r['errors']=E;R[name]=r;c.close()
  if HAB:
    c=p.chromium.launch().new_context(viewport={'width':1440,'height':900});pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:160]))
    pg.goto(U+'map/',wait_until='networkidle');ids=pg.evaluate("PW_data().then(D=>D.pals.map(p=>p.id))")
    H={}
    only=os.environ.get('ONLY');ids=[i for i in ids if not only or i in only.split(',')]
    for i in ids:
      pg.goto(U+'map/?pal='+i,wait_until='domcontentloaded')
      try:pg.wait_for_selector('.habchip',timeout=8000)
      except Exception:pass
      pg.wait_for_timeout(300)
      H[i]=pg.evaluate("(()=>{const c=document.querySelector('.habchip');return {chip:c?c.innerText.replace(/\\s+/g,' '):null,hab:document.querySelectorAll('.gmk-hab,.gmk-alpha').length,popup:!!document.querySelector('.leaflet-popup'),tree:!!document.getElementById('wtmap')}})()")
    bad={k:v for k,v in H.items() if not v['chip'] or ' 0 точ' in v['chip'] or v['popup'] or (v['hab']==0 and 'точек нет' not in (v['chip'] or ''))}
    R['habitat']={'pals':len(H),'bad':len(bad),'bad_list':bad,'errors':E[:10]}
    json.dump(H,open(O+'/habitat_all.json','w'),ensure_ascii=False,indent=0)
json.dump(R,open(O+'/report.json','w'),ensure_ascii=False,indent=1)
print(json.dumps({k:(v if k!='habitat' else {'pals':v['pals'],'bad':v['bad']}) for k,v in R.items()},ensure_ascii=False)[:3000])
