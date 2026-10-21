"""21.10: калькулятор работы выключен. Заглушка-редирект, чистка sitemap/search, проверка ссылок."""
import sys,os,re,json,glob
O=sys.argv[1];P='2_mehaniki/rabota/'
os.makedirs(f'{O}/{P}',exist_ok=True)
open(f'{O}/{P}index.html','w').write('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Палпедия</title><meta http-equiv="refresh" content="0;url=/palwiki/"><link rel="canonical" href="/palwiki/"><p>Раздел временно недоступен. <a href="/palwiki/">На главную</a></p>')
sm=f'{O}/sitemap.xml';s=open(sm).read();s=re.sub(r'<url>(?:(?!</url>).)*?2_mehaniki/rabota/(?:(?!</url>).)*?</url>\s*','',s,flags=re.S);open(sm,'w').write(s)
for f in glob.glob(f'{O}/sitemap.xml.gz'):os.remove(f)
si=f'{O}/search/search_index.json'
if os.path.exists(si):
  j=json.load(open(si));j['docs']=[d for d in j['docs'] if not d['location'].startswith(P)];json.dump(j,open(si,'w'),ensure_ascii=False)
# JS слои ux50: убрать ссылки/плитку/precache калькулятора
for f in glob.glob(f'{O}/assets/ux50*.js'):
  t=open(f).read();t0=t
  t=re.sub(r'\s*<a class="ux-more" href="\$\{B\}2_mehaniki/rabota/">.*?</a>','',t,flags=re.S)
  t=re.sub(r"\['[^'\]]*','[^'\]]*','2_mehaniki/rabota/','[^'\]]*'\],?",'',t)
  t=re.sub(r'\[\s*"[^"\]]*",\s*"[^"\]]*",\s*"2_mehaniki/rabota/",\s*"[^"\]]*"\s*\],?\s*','',t)
  t=t.replace("'2_mehaniki/rabota/',",'').replace('"2_mehaniki/rabota/", ','')
  if t!=t0:open(f,'w').write(t)
bad=[]
for f in glob.glob(f'{O}/**/*.html',recursive=True):
  if f.endswith(P+'index.html'):continue
  t=open(f,errors='ignore').read()
  if re.search(r'href="[^"]*2_mehaniki/rabota/',t):bad.append(f)
for f in glob.glob(f'{O}/**/*.js',recursive=True):
  t=open(f,errors='ignore').read()
  if '2_mehaniki/rabota/' in t and not f.endswith('/ui2.js'):bad.append(f)
print('workcalc_off: links left',len(bad),bad[:5]);sys.exit(1 if bad else 0)
