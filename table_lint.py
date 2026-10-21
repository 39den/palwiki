# FAIL the build on any raw <table> inside reader page content, unless whitelisted
import glob,re,sys
S='/workspace/palsite/site';WHITE={'tools_ws/'}
bad=[]
for f in glob.glob(S+'/**/index.html',recursive=True):
  rel=f[len(S)+1:-10]
  if any(rel.startswith(w) for w in WHITE):continue
  m=re.search(r'<article.*?</article>',open(f).read(),re.S)
  if m and re.search(r'<table\b',m.group(0)):bad.append(rel)
print('table-lint: pages with raw <table>:',len(bad),bad[:20])
sys.exit(1 if bad else 0)
