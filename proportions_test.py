# PROPORTIONS: measure H1/H2, chips, search, first-screen offset, overflow, small targets. usage: BASE OUT.json [shotdir]
import sys,json,os
from playwright.sync_api import sync_playwright
U=sys.argv[1];OUT=sys.argv[2];SH=sys.argv[3] if len(sys.argv)>3 else None
P=['','4_spravochniki/paly/silvegis/','guide/11_mir/','4_spravochniki/bossy/','map/']
JS="""(()=>{const q=s=>document.querySelector(s),R=e=>e?e.getBoundingClientRect():null,F=e=>e?parseFloat(getComputedStyle(e).fontSize):null;
const h1=q('article h1,.md-content h1');const h2=q('article h2');const chips=[...document.querySelectorAll('.seg button,.fc,.ux-chip,.chip,.mapsw button,.gal-filters button')].filter(e=>e.offsetParent);
const si=q('.md-search__input')||q('.msq input');const hc=q('.habchip');const map=[...document.querySelectorAll('#pwmap,#wtmap')].find(e=>e.offsetHeight);
const art=q('article');let ov=0,cut=0,small=0;const vw=innerWidth;
document.querySelectorAll('article *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&r.right>vw+1&&getComputedStyle(e).position!='fixed'&&!e.closest('.leaflet-container,pre,.md-typeset__scrollwrap,table'))ov++;
 if(e.children.length==0&&e.textContent.trim()&&e.scrollWidth>e.clientWidth+2&&['hidden','clip'].includes(getComputedStyle(e).overflowX)&&getComputedStyle(e).textOverflow!='ellipsis')cut++});
document.querySelectorAll('article a,article button,article input,article select').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&r.height&&r.height<32&&!e.closest('p,li,td,.leaflet-container')&&getComputedStyle(e).display!='inline')small++});
const c=R(chips[0]);
return {h1:F(h1),h1h:h1&&Math.round(R(h1).height),h2:F(h2),chipH:c&&Math.round(c.height),chipF:F(chips[0]),searchH:si&&Math.round(R(si).height),searchF:F(si),habchipH:hc&&Math.round(R(hc).height),contentTop:art&&Math.round(R(h1||art).top),mapTop:map&&Math.round(R(map).top),mapH:map&&Math.round(R(map).height),overflow:ov,cut,smallTargets:small}})()"""
res={}
with sync_playwright() as p:
  for name,mk in [('chromium1440',lambda:p.chromium.launch().new_context(viewport={'width':1440,'height':800})),('webkit390',lambda:p.webkit.launch().new_context(**{**p.devices['iPhone 13'],'viewport':{'width':390,'height':844}}))]:
    c=mk();pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:120]))
    for u in P:
      pg.goto(U+u+('?pal=WhiteShieldDragon' if u=='map/' else ''),wait_until='networkidle');pg.wait_for_timeout(1200)
      res[name+':'+(u or 'home')]=pg.evaluate(JS)
      if SH:os.makedirs(SH,exist_ok=True);pg.screenshot(path=f"{SH}/{name}_{(u or 'home').strip('/').replace('/','_')}.png")
    res[name+':errors']=E;c.close()
json.dump(res,open(OUT,'w'),ensure_ascii=False,indent=0)
for k,v in res.items():print(k,v)
