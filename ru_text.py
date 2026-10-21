"""Russian text helpers for templated game descriptions: never inflect names, wrap them with a generic noun in the right case."""
import re,json
GEN_AFTER=['оседлать','переработав','удерживать','изображением','силу','могущественного','образе','при сжигании','создания','изготовления','количества','получения','переработки','сжигания','помощью','основе']
CASES={'для':'g','из':'g','от':'g','у':'g','без':'g','после':'g','до':'g','к':'d','в':'a','на':'a','с':'i'}
NOUN={'pal':{'g':'пала','i':'палом','a':'пала','d':'палу','p':'пале','gp':'палов','ip':'палами','ap':'палов','dp':'палам','pp':'палах'},
 'weapon':{'g':'оружия','i':'оружием','a':'оружие','d':'оружию','p':'оружии','gp':'оружия','ip':'оружием','ap':'оружие','dp':'оружию','pp':'оружии'},
 'station':{'g':'станции','i':'станцией','a':'станцию','d':'станции','p':'станции','gp':'станций','ip':'станциями','ap':'станции','dp':'станциям','pp':'станциях'},
 'ingr':{'g':'ингредиента','i':'ингредиентом','a':'ингредиент','d':'ингредиенту','p':'ингредиенте','gp':'ингредиентов','ip':'ингредиентами','ap':'ингредиенты','dp':'ингредиентам','pp':'ингредиентах'},
 'item':{'g':'материала','i':'материалом','a':'материал','d':'материалу','p':'материале','gp':'материалов','ip':'материалами','ap':'материалы','dp':'материалам','pp':'материалах'}}
FROM_VERB=re.compile(r'(выпав\w*|упав\w*|сняты\w*|добыва\w*|получ\w*)\s*$')
PREP_LOC=re.compile(r'(верхом|находясь|стоя)\s*$')
class Fixer:
  def __init__(s,items,pals,stations=()):
    s.kind={}
    for i in items:
      t=i.get('type');s.kind[i['ru']]='weapon' if t=='Оружие' else 'ingr' if t=='Ингредиент' else 'item'
    for p in pals:s.kind[p]='pal'
    for st in stations:s.kind[st]='station'
    names=sorted(s.kind,key=len,reverse=True)
    s.N=r'(?:'+'|'.join(re.escape(n) for n in names if len(n)>2)+r')(?![\w-])'
    s.rx=re.compile(r'(?<![\w«])((?i:'+'|'.join(list(CASES)+GEN_AFTER)+r'))(\s+)('+s.N+r'(?:\s*(?:,|и)\s*'+s.N+r')*)')
    s.nrx=re.compile(s.N)
    s.multi=[n for n in s.kind if re.search(r' (?:'+'|'.join(CASES)+r') ',n)]
  def _rep(s,m,text):
    pre,sp,grp=m.group(1),m.group(2),m.group(3);c=CASES.get(pre.lower(),'g')
    c={'оседлать':'a','переработав':'a','удерживать':'a'}.get(pre.lower(),c)
    before=text[max(0,m.start()-25):m.start()]
    if pre.lower()=='с' and FROM_VERB.search(before):c='g'
    if pre.lower()=='на' and PREP_LOC.search(before):c='p'
    for n in s.multi:
      j=text.find(n,max(0,m.start()-len(n)),m.end()+len(n))
      if j>=0 and j<=m.start()<j+len(n):return m.group(0)
    ns=s.nrx.findall(grp)
    if not ns:return m.group(0)
    kinds={s.kind[n] for n in ns};k=kinds.pop() if len(kinds)==1 else 'item'
    if len(ns)>1:
      q=', '.join(f'«{n}»' for n in ns[:-1])+f' и «{ns[-1]}»';return f'{pre} {NOUN[k][c+"p"]} {q}'
    return f'{pre} {NOUN[k][c]} «{ns[0]}»'
  def fix(s,t):
    if not t:return t
    t=t.replace('（','(').replace('\u3000',' ')
    t=re.sub(r'\s*Создаётся (?:на|в) [^.]*\.(?:\.)?','',t)          # station is shown as chips
    t=re.sub(r'\|([^|\n]{1,40})\|',r'\1',t)
    t=re.sub(r'\b((?:Патрон|Боеприпас|Стрела|Снаряд)\w*) для\s+('+s.N+r'(?:\s*,\s*'+s.N+r')*)\s+и аналогичного оружия\.',lambda m:f'{m.group(1)} для оружия: {m.group(2).strip()} — и похожего.',t)
    t=re.sub(r'Открывает рецепт\s+(?=[А-ЯЁ])','Открывает рецепт: ',t)
    t=re.sub(r'урон\s+(Огонь|Вода|Трава|Молния|Лёд|Земля|Тьма|Дракон)\b',lambda m:'урон стихии «'+m.group(1)+'»',t)
    t=s.rx.sub(lambda m:s._rep(m,t),t)
    t=re.sub(r'([а-яё»)])\.([А-ЯЁ])',r'\1. \2',t)                      # «Сви.Сокращение» → «Сви. Сокращение»
    t=re.sub(r'[ \t]{2,}',' ',t);t=re.sub(r' +([.,;:])',r'\1',t);t=re.sub(r'\.\.+','.',t)
    return t.strip()
def fix_names(fx,t):
  parts=re.split(r'(<[^>]+>|\]\([^)]*\)|`[^`]*`)',t)
  return ''.join(p if (i%2) else fx.rx.sub(lambda m:fx._rep(m,p),p) for i,p in enumerate(parts))
def lint_text(fx,t):
  """return ungrammatical 'prep + bare Name' hits (names not wrapped by a generic noun or quotes)"""
  t=t or ''
  return [m.group(0) for m in fx.rx.finditer(t) if fx._rep(m,t)!=m.group(0)]
def num(v):
  """0.025 → 0,025 ; 60 → 60"""
  s=str(v)
  if re.fullmatch(r'-?\d+\.\d+',s):s=s.rstrip('0').rstrip('.') if '.' in s else s;return s.replace('.',',')
  return s
