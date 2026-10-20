import re,glob,sys,html
PAT=[(r'CharacterSpawnItem\w*|EnemyCamp_\w+|[A-Z][a-z]+_[A-Z]\w+','raw_id'),(r'\{[a-zA-Z_ ]+\}','placeholder'),(r'\bNone\b|\bnan\b|\bnull\b','none'),(r'\[проверить[^\]]*\]|\[патч[^\]]*\]','unverified_mark'),(r'ToSelf|Lv\. Skill','raw_skill'),(r'\w+\.(?:json|py)\b','filename')]
bad={}
for f in glob.glob('site/**/*.html',recursive=True):
  t=open(f,encoding='utf-8').read()
  t=re.sub(r'(?s)<(script|style|nav|header|footer)\b.*?</\1>','',t);t=re.sub(r'(?s)<[^>]+>',' ',t);t=html.unescape(t)
  for p,n in PAT:
    m=re.findall(p,t)
    if m:bad.setdefault(f,[]).append(f"{n}:{','.join(sorted(set(m))[:4])}")
for f,v in list(bad.items())[:15]:print('LEAK',f,'; '.join(v))
print('leak pages',len(bad));sys.exit(1 if bad else 0)
