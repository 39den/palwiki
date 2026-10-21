"""Собирает search_data с правками content/faq_cg.json (та же логика, что в prep.py) — для теста поиска без полной сборки."""
import json,sys,os
src,dst=sys.argv[1],sys.argv[2]
D=json.load(open(src));CG=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'faq_cg.json')))
faq=[{'q':f['q'],'a':CG['fix'][f['q']]['a'] if f['q'] in CG['fix'] else f['a']} for f in D['faq'] if f.get('q','').strip() and f.get('a','').strip()]
qs={f['q'] for f in faq};faq+=[{'q':x['q'],'a':x['a']} for x in CG['add'] if x['q'] not in qs]
D['faq']=faq;D['syn'].update(CG['syn']);D['pin']=CG['pin'];json.dump(D,open(dst,'w'),ensure_ascii=False)
print('faq',len(faq))
