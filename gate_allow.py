# explicit allowlist (Денис 17:47): only these two known map P0s may pass
import json,sys
d=json.load(open(sys.argv[1]));I=d['issues'];I=I if isinstance(I,list) else list(I.values());bad=[]
for i in I:
  if i['sev']!='P0':continue
  ex=i.get('examples',[])
  if i['key']=='map_black' and all(e['page']=='map/' and 'мир p' in e['detail'] for e in ex):continue
  if i['key']=='hab_black' and all('Мировое древо' in e['detail'] for e in ex):continue
  bad.append(i['key'])
print('GATE ALLOWLIST:', 'PASS' if not bad else 'FAIL '+','.join(bad));sys.exit(1 if bad else 0)
