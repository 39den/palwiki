# map: popups link to existing pages, all World Tree tiles load, compact sheet. usage: python3 map_test.py URL shotdir tag
import sys,json
from playwright.sync_api import sync_playwright
U=sys.argv[1];O=sys.argv[2];TAG=sys.argv[3];R={}
with sync_playwright() as p:
  b=p.webkit.launch();c=b.new_context(**p.devices['iPhone 13'],color_scheme='dark');pg=c.new_page();E=[];bad=[]
  pg.on('pageerror',lambda e:E.append(str(e)[:120]));pg.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 else None)
  pg.goto(U+'map/',wait_until='networkidle');pg.wait_for_timeout(1500)
  R['sheet']=pg.evaluate("(()=>{const s=document.querySelector('.msheet');if(!s)return null;const r=s.getBoundingClientRect();return {h:Math.round(r.height),frac:+(r.height/innerHeight).toFixed(2),filtersHidden:getComputedStyle(document.querySelector('.msheet .mleg')).display=='none',placeholderFits:(()=>{const i=document.getElementById('mapq');const c=document.createElement('canvas').getContext('2d');const cs=getComputedStyle(i);c.font=cs.fontSize+' '+cs.fontFamily;return c.measureText(i.placeholder).width<=i.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)})(),ph:document.getElementById('mapq').placeholder}})()")
  pg.screenshot(path=O+f'map_{TAG}_m_sheet.png')
  if pg.locator('.mflt').count():
    pg.locator('.mflt').tap();pg.wait_for_timeout(300);R['filters_open']=pg.evaluate("getComputedStyle(document.querySelector('.msheet .mleg')).display!='none'");pg.screenshot(path=O+f'map_{TAG}_m_filters.png');pg.locator('.mflt').tap()
  # every popup (logic used by the markers) -> link -> 200
  R['popups']=pg.evaluate("""async()=>{const D=window.PW_D;const T=await (await fetch(PW_BASE+'assets/wtree/markers.json')).json();const TT={alpha:'👑 Альфы',tower:'🏯 Башни',travel:'🗿 Телепорты',watch:'🗼 Вышки',npc:'🧑 Персонажи',chest:'🎁 Сундуки',fruit:'🌳 Деревья',spring:'💧 Источники',fish:'🎣 Рыбалка'};
     const all=[...D.map.map(p=>({w:'p',o:{t:p.t,name:p.name,lvl:p.lvl,info:p.info,url:p.url}})),...T.pts.filter(p=>TT[p.t]).map(p=>({w:'t',o:{t:p.t,name:p.n,lvl:p.lv}}))];
     let nolink=[],urls=new Map();const div=document.createElement('div');
     for(const x of all){div.innerHTML=PW_pop(x.o);const a=div.querySelector('a.mpcard');if(!a){nolink.push(x.w+':'+x.o.t+':'+x.o.name);continue}urls.set(a.getAttribute('href').split('#')[0],x.o.name)}
     const dead=[];for(const [u,n] of urls){const r=await fetch(u);if(r.status!=200)dead.push(r.status+' '+u+' ('+n+')')}
     return {total:all.length,nolink:nolink.slice(0,10),nolinkN:nolink.length,targets:urls.size,dead}}""")
  # real popup on Palpagos
  pg.evaluate("(()=>{const h=PW_map.all.find(([p])=>p.t=='alpha');const g=Object.values(PW_map.groups).find(g=>g.hasLayer(h[1]));g.zoomToShowLayer?g.zoomToShowLayer(h[1],()=>h[1].openPopup()):h[1].openPopup()})()");pg.wait_for_timeout(1500)
  R['palpagos_popup']=pg.evaluate("(()=>{const a=document.querySelector('.leaflet-popup a.mpcard');return a?{href:a.getAttribute('href'),img:!!a.querySelector('img'),chips:a.querySelectorAll('.mpe span').length,weak:!!a.querySelector('.mpw'),h:a.getBoundingClientRect().height}:null})()")
  pg.screenshot(path=O+f'map_{TAG}_m_popup.png')
  # World Tree
  bad.clear();pg.locator('.mapsw [data-w=t]').tap();pg.wait_for_timeout(3500)
  R['tree_tile_errors']=[x for x in bad if 'tiles' in x[1]]
  R['tree_tiles_all200']=pg.evaluate("""async()=>{const bad=[];for(let z=0;z<4;z++)for(let x=0;x<2**z;x++)for(let y=0;y<2**z;y++){const r=await fetch(PW_BASE+`assets/wtree/tiles/z${z}x${x}y${y}.webp`);if(r.status!=200)bad.push(z+'/'+x+'/'+y)}return bad}""")
  pg.screenshot(path=O+f'map_{TAG}_m_tree.png')
  pg.evaluate("(()=>{const m=document.querySelector('#wtmap .pmk-alpha');m&&m.dispatchEvent(new MouseEvent('click',{bubbles:true}))})()");pg.wait_for_timeout(800)
  R['tree_popup']=pg.evaluate("(()=>{const a=document.querySelector('#wtmap .leaflet-popup a.mpcard');return a?{href:a.getAttribute('href'),img:!!a.querySelector('img'),chips:a.querySelectorAll('.mpe span').length}:null})()")
  pg.screenshot(path=O+f'map_{TAG}_m_tree_popup.png')
  R['errors']=E;R['http_errors']=bad[:10]
  b.close()
print(json.dumps(R,ensure_ascii=False,indent=1))
F=[]
if R['popups']['nolinkN'] or R['popups']['dead']:F.append('popup-links')
if not R['palpagos_popup'] or not R['tree_popup']:F.append('popup-open')
if R['tree_tile_errors'] or R['tree_tiles_all200']:F.append('tiles')
if R['sheet'] and (R['sheet']['frac']>0.3 or not R['sheet']['filtersHidden'] or not R['filters_open']):F.append('sheet')
if R['sheet'] and not R['sheet']['placeholderFits']:F.append('placeholder')
if R['errors']:F.append('js-errors')
print('MAP-TEST','OK' if not F else 'FAIL '+','.join(F));sys.exit(1 if F else 0)
