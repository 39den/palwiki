import glob,re,sys,json
D='/workspace/palsite/docs';R=[];FAIL=[]
DATA=('passivki/','boss/','2_mehaniki/passivki_gde_vzyat','9_faq/faq')
for f in sorted(glob.glob(D+'/**/*.md',recursive=True)):
  t='\n'.join(l for l in open(f).read().split('\n') if not l.lstrip().startswith('<'));t=re.sub(r'<[^>]+>','',t);rel=f[len(D)+1:]
  run=mx=0;longp=0
  for l in t.split('\n'):
    if re.match(r'\s*([-*]|\d+\.)\s',l):run+=1;mx=max(mx,run)
    elif l.strip():run=0
    if not re.match(r'\s*([-*#|]|\d+\.)',l) and len(l.strip())>400:longp+=1
  if mx>8 or longp:
    R.append((rel,mx,longp))
    if rel.startswith(DATA):FAIL.append(rel)
import html as _h
SITE='/workspace/palsite/site'
for f in sorted(glob.glob(SITE+'/**/index.html',recursive=True)):
  rel=f[len(SITE)+1:]
  if not rel.startswith(DATA+('4_spravochniki/','2_mehaniki/','5_lut_i_farm/','6_mir/','guide/')):continue
  t=open(f).read();a=t.find('<article');b=t.find('</article>');t=t[a:b]
  ps=[_h.unescape(re.sub(r'<[^>]+>','',m)) for m in re.findall(r'<p>(.*?)</p>',t,re.S)]
  lp=[x for x in ps if len(x.strip())>400]
  lv=re.findall(r'(?:Тип|Уровень|HP|Редкость|Вес|Цена): [^<·]{1,30} · [^<]{0,40}: ',t)
  if lp:R.append((rel,'html-long-p',len(lp)))
  if lv:R.append((rel,'label-value',len(lv)))
  if (lp or lv) and (rel.startswith(DATA+('4_spravochniki/',)) ):FAIL.append(rel)
json.dump(R,open('/workspace/palsite/wall_lint.json','w'),ensure_ascii=False,indent=0)
print('wall-lint: flagged',len(R),'pages; data-page fails',len(FAIL),FAIL[:5]);sys.exit(1 if FAIL else 0)
