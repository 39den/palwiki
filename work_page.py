# Port of the approved mockup design2026/worksuit -> docs/2_mehaniki/rabota.md (+ assets/ws.css, ws.js), on live site tokens
import re,subprocess,os
S='/workspace/palsite';M=S+'/design2026/worksuit';D=S+'/docs'
subprocess.run(['python3','build.py'],cwd=M,check=True,stdout=subprocess.DEVNULL)
h=open(M+'/index.html').read()
main=h[h.index('<main class="wrap">')+len('<main class="wrap">'):h.index('</main>')]
wd=re.search(r'<script>(const WD=.*?)</script>',h,re.S).group(1)
main=re.sub(r'\s*class="(blk) rv"',r' class="\1"',main).replace(' rv"','"')
main=re.sub(r'>\s+<','><',main)  # no blank lines -> markdown never touches it
def scope(css,pre='.ws '):
  out=[];i=0
  while i<len(css):
    j=css.find('{',i)
    if j<0:out.append(css[i:]);break
    sel=css[i:j].strip()
    if sel.startswith('@media') or sel.startswith('@supports'):
      depth=1;k=j+1
      while depth:
        depth+=css[k]=='{';depth-=css[k]=='}';k+=1
      out.append(sel+'{'+scope(css[j+1:k-1],pre)+'}');i=k;continue
    k=css.find('}',j);body=css[j:k+1]
    if sel.startswith('@'):out.append(sel+body)
    else:
      ss=[]
      for x in sel.split(','):
        x=x.strip()
        if x.startswith('[data-theme=dark]'):ss.append('[data-md-color-scheme=slate] '+pre+x[len('[data-theme=dark]'):].strip())
        else:ss.append(pre+x)
      out.append(','.join(ss)+body)
    i=k+1
  return ''.join(out)
css=open(M+'/ws.css').read();css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
TOK='''.ws{--s1:8px;--s2:16px;--s3:24px;--s4:32px;--s8:64px;--r:24px;--rs:16px;--ease:cubic-bezier(.2,.8,.2,1);
--bg:var(--md-default-bg-color);--bg2:var(--surf2);--card:var(--surf);--ink:var(--txt);--mu:var(--muted);--line2:var(--line);
--red:#d42b22;--redink:#b3231b;--sun:#ffd400;--grass:#3fb950;--glass:color-mix(in srgb,var(--surf) 74%,transparent);
--sh1:0 1px 2px rgba(0,0,0,.08),0 8px 24px -12px rgba(0,0,0,.3);--sh2:0 2px 4px rgba(0,0,0,.08),0 24px 48px -20px rgba(0,0,0,.45);font-family:Manrope,system-ui,sans-serif;color:var(--ink)}
[data-md-color-scheme=slate] .ws{--redink:#ff7a6e}
.ws .d{font-family:Unbounded,Manrope,sans-serif;font-weight:800;letter-spacing:-.025em;line-height:.95}
.ws .eb{font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--mu);display:flex;align-items:center;gap:var(--s1)}
.ws button{font:inherit;color:inherit;cursor:pointer}.ws .i{flex:none}
.ws h1,.ws h2{color:var(--ink)}.ws h2{margin:0}
.ws .inp input{font:500 20px/1.2 Manrope,system-ui,sans-serif!important}
.ws .wsh{margin-top:0}
'''
open(D+'/assets/ws.css','w').write(TOK+scope(css))
js=open(M+'/ws.js').read()
open(D+'/assets/ws.js','w').write('document.addEventListener("DOMContentLoaded",()=>{if(!document.querySelector(".ws"))return;\n'+wd+'\n'+js+'''\nconst q=new URLSearchParams(location.search);if(q.get('w')){const b=document.querySelector('.ws .wc[data-w="'+q.get('w')+'"]');if(b){b.click();b.scrollIntoView({block:'nearest',inline:'center'})}}\nconst pl=document.getElementById('pl');if(q.get('lv')&&pl){pl.value=q.get('lv');pl.dispatchEvent(new Event('input',{bubbles:true}));pl.dispatchEvent(new Event('change',{bubbles:true}))}\n});''')
md='''---
title: Работа палов
hide: [toc]
search:
  boost: 3
---

<link rel="stylesheet" href="../../assets/ws.css">
<div class="ws" markdown="0">'''+main+'''</div>
<script src="../../assets/ws.js"></script>

<div class="ws-kw" hidden>скорость работы, ручная работа, уровень работы, как апнуть работу, пригодность к работе, work suitability</div>
'''
open(D+'/2_mehaniki/rabota.md','w').write(md)
print('work page: ok',len(main)//1024,'KB')
