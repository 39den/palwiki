# list text elements that are too light on the light skin (pp26). usage: URL
import sys,json
from playwright.sync_api import sync_playwright
U=sys.argv[1];PG=sys.argv[2].split(',') if len(sys.argv)>2 else ['','gallery/','4_spravochniki/paly/anubis/','boss/grizzbolt/','map/','4_spravochniki/predmety/боеприпасы/']
JS="""()=>{const L=c=>{const m=c.match(/[\\d.]+/g);if(!m)return 0;const [r,g,b]=m.map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
 const bgOf=e=>{while(e){const c=getComputedStyle(e).backgroundColor;const a=c.match(/[\\d.]+/g);if(a&&(a.length<4||+a[3]>.5)&&!/rgba\\(0, 0, 0, 0\\)/.test(c))return c;if(getComputedStyle(e).backgroundImage!='none')return null;e=e.parentElement}return 'rgb(246,242,233)'};
 const out={};document.querySelectorAll('article *,.md-header *,.msheet *').forEach(e=>{if(!e.childNodes.length||![...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim().length>1))return;const r=e.getBoundingClientRect();if(!r.width||r.bottom<0)return;const cs=getComputedStyle(e);if(cs.visibility=='hidden'||+cs.opacity<.3)return;
  const bg=bgOf(e);if(!bg)return;const l1=L(cs.color),l2=L(bg);const cr=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);if(cr<3){const k=e.tagName.toLowerCase()+'.'+[...e.classList].join('.')+' < '+(e.parentElement.className||e.parentElement.tagName).toString().slice(0,40);out[k]=(out[k]||0)+1}});return out}"""
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context(viewport={'width':1440,'height':900},color_scheme='light');pg=c.new_page()
  pg.goto(U+'?pp26=1');pg.evaluate("localStorage.setItem('/.__palette',JSON.stringify({index:1,color:{media:'',scheme:'default',primary:'custom',accent:'custom'}}))")
  for u in PG:
    pg.goto(U+u,wait_until='networkidle');pg.wait_for_timeout(1000);r=pg.evaluate(JS);print('==',u or 'home',len(r));[print('  ',k,v) for k,v in sorted(r.items(),key=lambda z:-z[1])[:14]]
