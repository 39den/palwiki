# insert fallback declarations before any declaration that uses color-mix() (iOS 15–16.1 ignore it)
import re,sys
p=sys.argv[1];s=open(p).read()
def rgba(h,a):
  h=h.lstrip('#');h=''.join(c*2 for c in h) if len(h)==3 else h[:6];r,g,b=(int(h[i:i+2],16) for i in (0,2,4));return f'rgba({r},{g},{b},{a})'
def fb(v):
  def one(m):
    a,pct,b=m.group(1).strip(),float(m.group(2))/100,m.group(3).strip()
    if b=='transparent' and a.startswith('#'):return rgba(a,round(pct,2))
    return a
  return re.sub(r'color-mix\(in srgb,\s*([^,()]+(?:\([^()]*\))?)\s+(\d+)%\s*,\s*([^()]+?(?:\([^()]*\))?)\)',one,v)
n=0
def dec(m):
  global n
  prop,val=m.group(1),m.group(2)
  if 'color-mix' not in val:return m.group(0)
  f=fb(val)
  if 'color-mix' in f:return m.group(0)
  n+=1;return f'{prop}:{f};{prop}:{val}'
s=re.sub(r'(?<=[{;])\s*([a-z-]+)\s*:\s*([^;{}]*color-mix[^;{}]*)',dec,s)
open(p,'w').write(s);print('color-mix fallbacks',n)
