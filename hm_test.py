# mini-map gestures + header search + map popups/tiles. usage: python3 hm_test.py URL [shotdir] [tag]
import sys,json,statistics,urllib.request,urllib.parse
from playwright.sync_api import sync_playwright
U=sys.argv[1];O=sys.argv[2] if len(sys.argv)>2 else '/workspace/palsite/shots/r9/';TAG=sys.argv[3] if len(sys.argv)>3 else 'after'
R={};FT="window.__ft=[];window.__fc=[];window.__raf=[];window.PW_hmFrame=(t,c)=>{__ft.push(t);__fc.push(c)};(function L(t){__raf.push(t);if(__raf.length<4000)requestAnimationFrame(L)})(performance.now())"
def stats(ft):
  ft=[t for t in ft if isinstance(t,(int,float))];d=[b-a for a,b in zip(ft,ft[1:]) if b-a<500]
  if len(d)<3:return None
  d.sort();return {'frames':len(d),'median':round(statistics.median(d),1),'p95':round(d[int(len(d)*.95)-1],1)}
def cost(pg):
  c=sorted(x for x in pg.evaluate('__fc') if isinstance(x,(int,float)))
  r=pg.evaluate('__raf');r=[b-a for a,b in zip(r,r[1:])][-120:];r.sort()
  return {'draw_ms_p95':round(c[int(len(c)*.95)-1],2) if c else None,'draw_ms_max':round(c[-1],2) if c else None,'raf_interval_p95':round(r[int(len(r)*.95)-1],1) if r else None,'raf_median':round(statistics.median(r),1) if r else None}
def hm(pg):
  return pg.evaluate("(()=>{const e=document.querySelector('.habmap');return e&&e._hm?{s:e._hm.s,fit:e._hm.fit,pts:e._hm.pts,badges:e._hm.badges}:null})()")
def open_hab(pg):
  pg.goto(U+'4_spravochniki/paly/anubis/',wait_until='networkidle')
  pg.evaluate("(()=>{const b=document.querySelector('.habmap').closest('.tabbed-block');const set=b.closest('.tabbed-set');const i=[...b.parentElement.children].indexOf(b);set.querySelectorAll(':scope>.tabbed-labels>label')[i].click()})()");pg.wait_for_timeout(1200)
  pg.evaluate("document.querySelector('.habmap .hm-box').scrollIntoView({block:'center'})");pg.wait_for_timeout(500)
  return pg.evaluate("(()=>{const r=document.querySelector('.habmap .hm-box').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
with sync_playwright() as p:
  # ---- Chromium Pixel 7: real multi-touch through CDP
  b=p.chromium.launch();c=b.new_context(**p.devices['Pixel 7'],color_scheme='dark');pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:120]))
  x,y,w,h=open_hab(pg);cdp=c.new_cdp_session(pg);cx,cy=x+w/2,y+h/2
  st0=hm(pg);sy0=pg.evaluate('scrollY')
  T=lambda typ,pts:cdp.send('Input.dispatchTouchEvent',{'type':typ,'touchPoints':[{'x':a,'y':b_,'id':i} for i,(a,b_) in enumerate(pts)]})
  # one-finger vertical swipe (not zoomed) must scroll the page
  pg.wait_for_timeout(800);T('touchStart',[(cx,cy+60)])
  for k in range(1,13):T('touchMove',[(cx,cy+60-k*10)]);pg.wait_for_timeout(16)
  T('touchEnd',[]);pg.wait_for_timeout(600);sy1=pg.evaluate('scrollY');R['chromium_swipe_scrolls_page']={'ok':sy1>sy0+40,'dy':sy1-sy0,'at':[cx,cy+60],'box':[x,y,w,h]}
  x,y,w,h=open_hab(pg);cx,cy=x+w/2,y+h/2;pg.screenshot(path=O+f'hm_{TAG}_m_fit.png')
  pg.evaluate(FT);st0=hm(pg)
  T('touchStart',[(cx-20,cy),(cx+20,cy)])
  for k in range(1,31):T('touchMove',[(cx-20-k*3,cy),(cx+20+k*3,cy)]);pg.wait_for_timeout(16)
  T('touchEnd',[]);pg.wait_for_timeout(400)
  st1=hm(pg);vv=pg.evaluate('visualViewport.scale');R['chromium_pinch']={'s_before':round(st0['s'],2),'s_after':round(st1['s'],2),'page_scale':vv,'cost':cost(pg)}
  pg.screenshot(path=O+f'hm_{TAG}_m_pinched.png')
  # zoomed: one-finger drag pans the map, page does not scroll
  sy0=pg.evaluate('scrollY');T('touchStart',[(cx,cy)])
  for k in range(1,11):T('touchMove',[(cx-k*6,cy-k*6)]);pg.wait_for_timeout(16)
  T('touchEnd',[]);pg.wait_for_timeout(300);R['chromium_zoomed_pan_no_scroll']=abs(pg.evaluate('scrollY')-sy0)<3
  # buttons
  s1=hm(pg)['s'];pg.locator('.hm-zc [data-z="-1"]').tap();pg.wait_for_timeout(450);s2=hm(pg)['s'];pg.locator('.hm-zc [data-z="1"]').tap();pg.wait_for_timeout(450);s3=hm(pg)['s']
  pg.locator('.hm-zc [data-z="0"]').tap();pg.wait_for_timeout(450);R['buttons']={'minus':s2<s1,'plus':s3>s2,'reset':abs(hm(pg)['s']-hm(pg)['fit'])<.01}
  R['full_link']=pg.evaluate("document.querySelector('.habmap .hm-full').getAttribute('href')")
  # double tap zooms
  T('touchStart',[(cx+5,cy+5)]);T('touchEnd',[]);pg.wait_for_timeout(90);T('touchStart',[(cx+5,cy+5)]);T('touchEnd',[]);pg.wait_for_timeout(500)
  R['double_tap']={'s':round(hm(pg)['s'],2),'page_scale':pg.evaluate('visualViewport.scale')}
  R['clusters_at_fit']=hm(pg)
  R['chromium_errors']=E;b.close()
  # ---- WebKit iPhone 13: synthetic multi-touch TouchEvents
  b=p.webkit.launch();c=b.new_context(**p.devices['iPhone 13'],color_scheme='dark');pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)[:120]))
  x,y,w,h=open_hab(pg);cx,cy=x+w/2,y+h/2;pg.evaluate(FT);st0=hm(pg)
  res=pg.evaluate("""async([cx,cy])=>{const bx=document.querySelector('.habmap .hm-box');const mk=(id,x,y)=>{try{return new Touch({identifier:id,target:bx,clientX:x,clientY:y,pageX:x,pageY:y+scrollY})}catch(e){return {identifier:id,target:bx,clientX:x,clientY:y,pageX:x,pageY:y+scrollY}}};
    const fire=(type,ts)=>{let ev;const all=type=='touchend'?[]:ts;try{ev=new TouchEvent(type,{touches:all,targetTouches:all,changedTouches:ts,bubbles:true,cancelable:true});if(ev.touches.length!=all.length)throw 0}catch(e){ev=new Event(type,{bubbles:true,cancelable:true});Object.defineProperty(ev,'touches',{value:all});Object.defineProperty(ev,'targetTouches',{value:all});Object.defineProperty(ev,'changedTouches',{value:ts})}bx.dispatchEvent(ev);return ev.defaultPrevented};
    let pv=fire('touchstart',[mk(0,cx-20,cy),mk(1,cx+20,cy)]);let pm=true;
    for(let k=1;k<=30;k++){await new Promise(r=>requestAnimationFrame(r));pm=fire('touchmove',[mk(0,cx-20-k*3,cy),mk(1,cx+20+k*3,cy)])&&pm}
    fire('touchend',[mk(0,cx-110,cy),mk(1,cx+110,cy)]);
    const ge=new Event('gesturestart',{cancelable:true});bx.dispatchEvent(ge);
    return {startPrevented:pv,movePrevented:pm,gesturePrevented:ge.defaultPrevented,ta:getComputedStyle(bx).touchAction}}""",[cx,cy])
  pg.wait_for_timeout(300);st1=hm(pg)
  R['webkit_pinch']={**res,'s_before':round(st0['s'],2),'s_after':round(st1['s'],2),'page_scale':pg.evaluate('visualViewport.scale'),'cost':cost(pg)}
  pg.screenshot(path=O+f'hm_{TAG}_wk_pinched.png')
  # header search: single frame + one ×
  pg.locator('#hsq').tap();pg.keyboard.type('где найти Анубис',delay=25);pg.wait_for_timeout(1500)
  R['hsq']=pg.evaluate("""(()=>{const i=document.getElementById('hsq'),cs=getComputedStyle(i);const xs=[...document.querySelectorAll('.sx-clr,.sx-x')].filter(b=>{const r=b.getBoundingClientRect();return r.width&&getComputedStyle(b).display!='none'&&!b.hidden});
     return {border:cs.borderTopWidth,shadow:cs.boxShadow,bg:cs.backgroundColor,closeButtons:xs.length,panelMap:!!document.querySelector('#sxp .habmap, .sx-inline .habmap')}})()""")
  pg.screenshot(path=O+f'hm_{TAG}_wk_search.png')
  R['webkit_errors']=E;b.close()
print(json.dumps(R,ensure_ascii=False,indent=1))
F=[]
if not R['chromium_swipe_scrolls_page']['ok']:F.append('swipe-not-scrolling')
for k in ('chromium_pinch','webkit_pinch'):
  if not(R[k]['s_after']>R[k]['s_before'] and R[k]['page_scale']==1):F.append(k)
  if (R[k]['cost']['draw_ms_p95'] or 99)>8:F.append(k+'-slow')
if not R['webkit_pinch']['movePrevented'] or not R['webkit_pinch']['gesturePrevented']:F.append('wk-not-prevented')
if not R['chromium_zoomed_pan_no_scroll']:F.append('zoomed-pan-scrolls')
if not all(R['buttons'].values()):F.append('buttons')
if 'map/?pal=' not in (R['full_link'] or ''):F.append('full-link')
if R['double_tap']['page_scale']!=1:F.append('dbl-page-zoom')
if R['hsq']['border']!='0px' or R['hsq']['shadow']!='none' or R['hsq']['closeButtons']!=1:F.append('hsq-frame')
if R['chromium_errors'] or R['webkit_errors']:F.append('js-errors')
print('HM-TEST', 'OK' if not F else 'FAIL '+','.join(F));sys.exit(1 if F else 0)
