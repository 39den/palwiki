# no allowlist since 18:33 (maps fixed in 8566425a): any P0 fails
import json,sys
d=json.load(open(sys.argv[1]));I=d['issues'];I=I if isinstance(I,list) else list(I.values());bad=[]
for i in I:
  if i['sev']!='P0':continue
  ex=i.get('examples',[])
  bad.append(i['key'])
print('GATE ALLOWLIST:', 'PASS' if not bad else 'FAIL '+','.join(bad));sys.exit(1 if bad else 0)
