# FAIL on internal links/images that 404 in the built site
import glob,re,sys,os,urllib.parse
S='/workspace/palsite/site';bad={};n=0
for f in glob.glob(S+'/**/*.html',recursive=True):
  d=os.path.dirname(f);s=open(f).read()
  for u in re.findall(r'(?:href|src)="([^"#?]+)',s):
    if re.match(r'^(https?:|mailto:|tg:|data:|javascript:|//)',u) or '${' in u:continue
    n+=1;u2=urllib.parse.unquote(u)
    p=os.path.normpath(S+u2[len('/palwiki'):] if u2.startswith('/palwiki/') else (S+u2 if u2.startswith('/') else os.path.join(d,u2)))
    if os.path.isdir(p):p=os.path.join(p,'index.html')
    if not os.path.exists(p):bad.setdefault(f[len(S)+1:],[]).append(u)
tot=sum(len(v) for v in bad.values())
print('link-check: checked',n,'broken',tot,'on',len(bad),'pages',list(bad.items())[:5])
sys.exit(1 if tot else 0)
