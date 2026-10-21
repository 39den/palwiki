# ITEMS26: rich partner-skills guide page (cards + search + chips)
import json,re,os,html
TY={'урон':('⚔️','r'),'защита':('🛡','b'),'вес':('🎒','y'),'добыча':('⛏','o'),'дроп':('🎁','p'),'передвижение':('💨','c'),'лечение':('💚','g'),'работа':('🔨','o'),'усиление стихии':('✨','p'),'поимка':('🎯','r'),'опыт':('⭐','y'),'разведка/скрытность':('👁','c'),'прочее':('•','n')}
def build(D):
  P={p['en']:p for p in json.load(open('/workspace/palwiki/data/pals.json'))}
  src=open('/workspace/palwiki/guide/partnerskie_navyki.md').read().split('\n')
  grp=None;G=[];cards=[];used=set()
  for l in src:
    h=re.match(r'^## (\S+) (.+?)(?: \(\d+\))?$',l)
    if h:grp=h.group(2);G.append((h.group(1),grp));continue
    m=re.match(r'^- (.+?) \((.+?)\) — (.+?): (.+)$',l)
    if not m or not grp:continue
    ru,en,sk,ts=m.groups();p=P.get(en)
    if not p:continue
    slug=en.lower().replace(' ','_');ts=[t.strip() for t in ts.split(',')];used|=set(ts)
    art=f'pp/art/{p["id"]}-256.webp';im=f'<img src="../../{art}" alt="" loading="lazy" width="56" height="56">' if os.path.exists(D+'/'+art) else '<span class="pk-ph">🐾</span>'
    chips=''.join(f'<span class="pk-t t-{TY.get(t,("","n"))[1]}">{TY.get(t,("•",""))[0]} {html.escape(t)}</span>' for t in ts)
    cards.append(f'<a class="pk" href="../../4_spravochniki/paly/{slug}/" data-g="{html.escape(grp)}" data-t="{html.escape("|".join(ts))}" data-q="{html.escape((ru+" "+en+" "+sk).lower())}">{im}<span class="pk-b"><b>{html.escape(ru)}</b><span class="pk-s">{html.escape(sk)}</span><span class="pk-ts">{chips}</span></span></a>')
  gch=''.join(f'<button type="button" class="pk-c" data-g="{html.escape(g)}">{e} {html.escape(g)}</button>' for e,g in G)
  tch=''.join(f'<button type="button" class="pk-c" data-t="{html.escape(t)}">{TY[t][0]} {html.escape(t)}</button>' for t in TY if t in used)
  out=('---\nhide: [toc]\n---\n# Партнёрские навыки\n\n<p class="pk-lead">У каждого пала есть партнёрский навык. Он включается по-разному: из команды, когда пал выпущен, верхом, по кнопке или на базе. Нажмите на карточку, чтобы открыть страницу пала.</p>\n\n'
    f'<div class="pkw" markdown="0"><input type="search" class="pk-q" placeholder="Пал или навык…" autocomplete="off" aria-label="Поиск по палу или навыку">'
    f'<div class="pk-f" role="group" aria-label="Как включается"><button type="button" class="pk-c on" data-g="">Все</button>{gch}</div>'
    f'<div class="pk-f" role="group" aria-label="Тип эффекта">{tch}</div><p class="pk-n" aria-live="polite"></p>'
    f'<div class="pk-grid">{"".join(cards)}</div><p class="pk-empty" hidden>Ничего не найдено. Попробуйте другое имя или снимите фильтр.</p></div>\n')
  open(D+'/guide/partnerskie_navyki.md','w').write(out);print('partner26',len(cards))
