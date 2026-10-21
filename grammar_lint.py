# grammar lint: «для Пулемёт Гатлинга», «на Конвейерная фабрика» — preposition + bare entity name in nominative. Fails on templated pages.
import json,glob,re,sys,html
sys.path.insert(0,'/workspace/palsite')
import ru_text,item_pages
items=json.load(open('/workspace/palwiki/data/items.json'))
sd=json.load(open('/workspace/palsite/docs/assets/search_data.json'))
fx=ru_text.Fixer(items,[p['ru'] for p in sd['pals']],item_pages.STATIONS)
# also generic templated phrases
EXTRA=re.compile(r'Создаётся (?:на|в) [А-ЯЁ]|\d\.\d+ ?%|\bдля\s+для\b')
hits={}
for f in glob.glob('/workspace/palsite/docs/**/*.md',recursive=True):
  t=open(f).read();t=re.sub(r'<[^>]+>',' ',t);t=html.unescape(t)
  t=re.sub(r'\(([^()]*)\)\[[^\]]*\]|\]\([^)]*\)',' ',t)
  h=ru_text.lint_text(fx,t)+EXTRA.findall(t)
  if h:hits[f.split('/docs/')[1]]=h
for x in sd['items']:
  h=ru_text.lint_text(fx,x.get('desc',''))
  if h:hits.setdefault('search_data:items',[]).extend(h)
TEMPLATED=lambda k:k.startswith('4_spravochniki/predmety/') or k.startswith('search_data') or k.startswith('boss/') or k.startswith('4_spravochniki/paly/') or k.startswith('passivki/')
fail={k:v for k,v in hits.items() if TEMPLATED(k)}
print('grammar-lint: pages with hits',len(hits),'templated fails',len(fail),sorted(fail.items())[:5])
json.dump(hits,open('/workspace/palsite/grammar_lint.json','w'),ensure_ascii=False,indent=0)
sys.exit(1 if fail else 0)
