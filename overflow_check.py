import sys
from playwright.sync_api import sync_playwright
U=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8899/'
P=['','gallery/','4_spravochniki/paly/anubis/','4_spravochniki/paly/frostallion/','map/','breed/','my/','compare/','passivki/','boss/','bot/']
bad=0
with sync_playwright() as p:
  b=p.chromium.launch()
  for w in (360,390):
    pg=b.new_context(viewport={'width':w,'height':800},is_mobile=True,has_touch=True).new_page()
    for u in P:
      pg.goto(U+u,wait_until='networkidle');pg.wait_for_timeout(700)
      r=pg.evaluate("""w=>{const o=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||getComputedStyle(e).position=='fixed'||e.closest('.md-sidebar,.md-search,.pk,.sheet,.gsheet'))return;let x=e.parentElement,clip=false;while(x&&x!=document.body){const s=getComputedStyle(x);if(['hidden','auto','scroll','clip'].includes(s.overflowX)){clip=true;break;}x=x.parentElement;}if(!clip&&(r.right>w+1||r.left<-1))o.push((e.id?'#'+e.id:'')+'.'+(e.className&&e.className.baseVal===undefined?String(e.className).split(' ')[0]:e.tagName)+' '+Math.round(r.left)+'..'+Math.round(r.right));});return [document.documentElement.scrollWidth,o.slice(0,6)]}""",w)
      if r[0]>w or r[1]:bad+=1;print(w,u or 'home',r)
print('OVERFLOW pages',bad);sys.exit(1 if bad else 0)
