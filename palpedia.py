# Палпедия: port of design2026/final2 into the MkDocs site. Run after prep.py.
import json,os,re,shutil,html,datetime,sys
sys.path.insert(0,'/workspace/palsite/design2026/final2')
from icons import ic
S='/workspace/palsite';F2=S+'/design2026/final2';AF=S+'/design2026/art_final';D=S+'/docs';PP=D+'/pp'
DATA=json.load(open(D+'/assets/search_data.json'));PALS=[p for p in DATA['pals'] if p.get('url')]
ID={p['id']:p for p in PALS};RU={p['ru']:p for p in PALS}
# ---- assets: art_final (when ready) overrides final2 ----
shutil.rmtree(PP,ignore_errors=True);os.makedirs(PP)
for d in ('fonts','anim','img'):shutil.copytree(F2+'/'+d,PP+'/'+d)
M=json.load(open(F2+'/img/manifest.json'))
if os.path.exists(AF+'/manifest.json'):
  for k,v in json.load(open(AF+'/manifest.json')).items():
    for f,w in v.get('files',[]):
      os.makedirs(os.path.dirname(PP+'/'+f),exist_ok=True);shutil.copy(AF+'/'+f,PP+'/'+f)
    M[k]=v
A={a['id'] for a in json.load(open(F2+'/anim/anim.json'))}
json.dump({k:{'src':v['src'],'files':v['files']} for k,v in M.items()},open(PP+'/manifest.json','w'),ensure_ascii=False)
# ---- CSS: fonts + tokens global, components scoped under .pp ----
def split(css):
  out=[];i=0;n=len(css)
  while i<n:
    j=css.find('{',i)
    if j<0:break
    sel=css[i:j].strip();d=1;k=j+1
    while d and k<n:
      d+= {'{':1,'}':-1}.get(css[k],0);k+=1
    out.append((sel,css[j+1:k-1]));i=k
  return out
DROP=re.compile(r'^(\*|html|body|a|img|button|:focus-visible|body:after|\[data-theme=dark\] body:after)$')
def scope(sel):
  ps=[]
  for s in sel.split(','):
    s=s.strip()
    if not s or DROP.match(s):continue
    if s.startswith(':root'):ps.append(s);continue
    s=s.replace('[data-theme=dark]','[data-md-color-scheme=slate]')
    if s.startswith('[data-md-color-scheme=slate]'):
      rest=s[len('[data-md-color-scheme=slate]'):].strip()
      ps.append('[data-md-color-scheme=slate]'+(' .pp '+rest if rest else ''))
    else:ps.append('.pp '+s)
  return ','.join(ps)
def walk(css):
  o=''
  for sel,body in split(css):
    if sel.startswith('@keyframes') or sel.startswith('@font-face'):o+=sel+'{'+body+'}'
    elif sel.startswith('@'):o+=sel+'{'+walk(body)+'}'
    else:
      s=scope(sel)
      if s:o+=s+'{'+body+'}'
  return o
raw=re.sub(r'/\*.*?\*/','',open(F2+'/style.css').read(),flags=re.S)
fonts=open(F2+'/fonts.css').read().replace('url(fonts/','url(../pp/fonts/')
THEME=open(S+'/pp_theme.css').read()
open(D+'/assets/palpedia.css','w').write(fonts+walk(raw)+THEME)
# ---- helpers ----
EK={'Огонь':'fire','Вода':'water','Трава':'grass','Молния':'electric','Лёд':'ice','Земля':'ground','Тьма':'dark','Дракон':'dragon','Нейтральный':'neutral'}
def el(e):k=EK.get(e,'neutral');return f'<span class="el" style="--e:var(--{k})">{ic(k,16)}{e}</span>'
def ev(p):return f'var(--{EK.get((p["el"] or ["Нейтральный"])[0],"neutral")})'
def art(p,R,sizes='(max-width:600px) 60vw, 320px',alt='',eager=False):
  b=f'img/pal/{p["id"]}';la='fetchpriority="high"' if eager else 'loading="lazy"'
  if b in M:
    f=M[b]['files'];ss=', '.join(f'{R}pp/{x} {w}w' for x,w in f)
    return f'<figure class="fig"><img src="{R}pp/{f[-1][0]}" srcset="{ss}" sizes="{sizes}" alt="{alt}" width="640" height="640" decoding="async" {la}><figcaption class="cap">{M[b]["src"]}</figcaption></figure>'
  return f'<figure class="fig"><img src="{R}{p.get("art") or p["thumb"]}" alt="{alt}" width="320" height="320" decoding="async" {la}><figcaption class="cap">© Pocketpair · palworld.wiki.gg</figcaption></figure>'
def stage(p,R,cls='',alt='',sizes='(max-width:600px) 60vw, 320px',animate=False,eager=False):
  if animate and p['id'] in A:
    a=p['id']
    return f'<div class="stage anim-wrap {cls}" data-id="{a}" style="--e:{ev(p)}"><figure class="fig"><img class="anim" src="{R}pp/anim/{a}-still.webp" data-still="{R}pp/anim/{a}-still.webp" data-anim="{R}pp/anim/{a}.webp" alt="{alt}" width="300" height="300" decoding="async"><figcaption class="cap">© Pocketpair · palworld.wiki.gg</figcaption></figure><span class="play"><i></i>Анимация</span></div>'
  return f'<div class="stage {cls}" style="--e:{ev(p)}">{art(p,R,sizes,alt,eager)}</div>'
def pcard(p,R):
  w=''.join(f'<span>{html.escape(n)} {l}</span>' for n,l in p['work'][:3])
  return f'''<a class="pcard rv press" data-tilt href="{R}{p["url"]}" style="--e:{ev(p)}"><div class="top"><span class="eb">№{p["no"]}</span>{'<span class="badge-anim" title="Есть анимация">'+ic("spark",14)+'</span>' if p['id'] in A else ''}</div>{stage(p,R,animate=True,alt=p["ru"])}<h3>{p["ru"]}</h3><div class="els">{"".join(el(x) for x in p["el"])}</div><div class="wk">{w}</div><div class="kv3"><div><b>{p["hp"]}</b><span>Здоровье</span></div><div><b>{p["atk"]}</b><span>Атака</span></div><div><b>{p["def"]}</b><span>Защита</span></div></div></a>'''
FOOT='<footer class="ppfoot"><b>Палпедия — фанатская некоммерческая энциклопедия по Palworld 1.0.5.</b><span>Не является официальным продуктом и не связана с Pocketpair, Inc. Palworld, имена и изображения палов © Pocketpair, Inc.; используются по <a href="https://www.pocketpair.jp/en/guidelines-derivativework-en/">Guidelines for Derivative Works</a>.</span><span>Рендеры палов и иконки блюд: palworld.wiki.gg · карта: palworld.wiki.gg (CC BY-SA) · скриншоты: страница Palworld в Steam · фон главной и анимации нарисованы нами.</span></footer>'
json.dump({'foot':FOOT},open(PP+'/foot.json','w'),ensure_ascii=False)
exec(open(S+'/pp_pages.py').read())
