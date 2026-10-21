# FAIL on source credits / verification notes in reader text (allowed: /about/, map attribution control, image captions .cap)
import glob,re,sys,html
S='/workspace/palsite/site';bad=[]
PAT=re.compile(r'wiki\.gg|paldb|CC BY|подтверждено (?:paldb|данными)|мы не нашли точного подтверждения|Ещё перепроверяется|ⓘ',re.I)
for f in glob.glob(S+'/**/index.html',recursive=True):
  rel=f[len(S)+1:-10]
  if rel.startswith('about/'):continue
  s=open(f).read();m=re.search(r'<article.*?</article>',s,re.S)
  if not m:continue
  a=re.sub(r'<(script|style)[^>]*>.*?</\1>','',m.group(0),flags=re.S)
  a=re.sub(r'<(figcaption|small) class="cap[^"]*".*?</\1>','',a,flags=re.S)
  t=html.unescape(re.sub(r'<[^>]+>',' ',a))
  hit=PAT.search(t)
  if hit:bad.append((rel,t[max(0,hit.start()-40):hit.end()+20].strip()))
print('credits-lint:',len(bad),bad[:10]);sys.exit(1 if bad else 0)
