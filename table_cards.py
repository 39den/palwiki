# Converts raw Markdown tables on reader pages into Palpedia cards (kv tiles for 2 columns, cards for 3+).
import re,glob,html,markdown,sys
D='/workspace/palsite/docs'
WHITE=set()  # pages allowed to keep a raw table (none for now)
MD=markdown.Markdown(extensions=['attr_list'])
IDX=[False]
def _href(m):
  u=m.group(1)
  if re.match(r'^(https?:|#|/)',u):return m.group(0)
  u=re.sub(r'(?:/README|/index)?\.md(#|$)',r'/\1',u)
  return 'href="'+(u if IDX[0] else '../'+u)+'"'
def inl(t):
  t=t.strip()
  if not t or t in ('—','-'):return ''
  h=MD.reset().convert(t);h=re.sub(r'href="([^"]+)"',_href,h);return re.sub(r'^<p>|</p>$','',h.strip())
def cells(l):
  l=l.strip()
  if l.startswith('|'):l=l[1:]
  if l.endswith('|') and not l.endswith('\\|'):l=l[:-1]
  return [c.strip() for c in re.split(r'(?<!\\)\|',l)]
def render(rows,ind):
  hd,body=rows[0],rows[1:]
  n=len(hd)
  if n==2:
    tiles=''.join(f'<div class="kv"><span class="kv-l">{inl(r[0])}</span><span class="kv-v">{inl(r[1]) if len(r)>1 else ""}</span></div>' for r in body if any(x.strip() for x in r))
    return ind+f'<div class="kvs" markdown="0">{tiles}</div>\n'
  cs=[]
  for r in body:
    r=(r+['']*n)[:n]
    if not any(x.strip() for x in r):continue
    t=inl(r[0]);items=''.join(f'<div class="tc-i"><span class="kv-l">{inl(hd[i])}</span><span class="kv-v">{v}</span></div>' for i in range(1,n) for v in [inl(r[i])] if v)
    cs.append(f'<div class="tcard"><div class="tc-t">{t}</div><div class="tc-b">{items}</div></div>')
  return ind+f'<div class="tcards{" dense" if n<=3 else ""}" markdown="0">{"".join(cs)}</div>\n'
def convert(s,index=False):
  IDX[0]=index
  L=s.split('\n');out=[];i=0;k=0
  while i<len(L):
    m=re.match(r'^(\s*)\|',L[i])
    if m and i+1<len(L) and re.match(r'^\s*\|?\s*:?-{2,}',L[i+1]):
      ind=m.group(1);rows=[cells(L[i])];j=i+2
      while j<len(L) and re.match(r'^\s*\|',L[j]):rows.append(cells(L[j]));j+=1
      if out and out[-1].strip():out.append('')
      out.append(render(rows,ind));i=j;k+=1;continue
    out.append(L[i]);i+=1
  return '\n'.join(out),k
if __name__=='__main__':
  tot=0;pages=[]
  for f in glob.glob(D+'/**/*.md',recursive=True):
    rel=f[len(D)+1:]
    if rel in WHITE:continue
    s=open(f).read()
    if '|' not in s:continue
    t,k=convert(s)
    if k:open(f,'w').write(t);tot+=k;pages.append((rel,k))
  print('tables -> cards',tot,'on',len(pages),'pages')
