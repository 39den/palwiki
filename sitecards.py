import sys,os,re,json
sys.path.insert(0,'/workspace/palcards');import make_card as M
from PIL import Image
def clean(s):
  s=re.split(r'\s*Lv\.\s*Skill',s)[0]
  s=re.sub(r'\((ToTrainer|ToSelf|ToOtomo|ToEnemy)\)','',s);s=re.sub(r'\bElement[A-Z]\w*(\s+[\d.]+)?','',s)
  s=re.sub(r'(?<![\w/.-])[A-Z][A-Za-z0-9]*_[A-Za-z0-9_]+','',s);s=re.sub(r'\s+',' ',s).strip()
  return s.replace(' .','.').replace(' ,',',')
_orig=M.short_partner;M.short_partner=lambda s:clean(_orig(s))
_art=M.art
AFD='/workspace/palsite/design2026/art_final'
import inspect
_src=inspect.getsource(M.card)
for a,b in (("full = os.path.exists(os.path.join(B, 'art', p['id'] + '.png'))","full = True"),
            ("s = min(420/a.width, 420/a.height); a = a.resize((int(a.width*s), int(a.height*s)), Image.LANCZOS)","pass"),
            ("sc = min(mw/a.width, mh/a.height)","sc = min(mw/a.width, mh/a.height, 1.0)")):
  assert a in _src,a;_src=_src.replace(a,b)
exec(_src,M.__dict__)
def art(p):
  # 21.10: new sharp full-body render (art_final, kind render, background removed) inside the unchanged card frame; never upscaled
  r=f"{AFD}/pal/{p['id']}-768.webp"
  if os.path.exists(r):
    im=Image.open(r).convert('RGBA');bb=im.getbbox();return im.crop(bb) if bb else im
  return _old_art(p)
def _old_art(p):
  fx=f"/workspace/palsite/art_fix/{p['id']}.png"
  if os.path.exists(fx):return Image.open(fx).convert('RGBA')
  if os.path.exists(f"/workspace/palcards/art/{p['id']}.png"):return _art(p)
  ic=f"/workspace/palcards/art/icons/{p['id']}.png"
  return Image.open(ic).convert('RGBA') if os.path.exists(ic) else _art(p)
M.art=art
os.makedirs('/workspace/palsite/.cards',exist_ok=True)
pals=json.load(open('/workspace/palwiki/data/pals.json'))
sys.path.insert(0,'/workspace/palsite');from elmx import matchup
for p in pals:p['weak_to']=[a for a,_ in matchup(p['elements'])['w']]
src=os.path.getmtime('/workspace/palwiki/data/pals.json')
for p in pals:
  fn=f"/workspace/palsite/.cards/{p['no']}_{p['id']}.png"
  if os.path.exists(fn) and os.path.getmtime(fn)>src and os.path.getmtime(fn)>os.path.getmtime(__file__) and os.path.getmtime(fn)>os.path.getmtime('/workspace/palsite/elmx.py'):continue
  M.card(p).save(fn)
print('cards ok',len(os.listdir('/workspace/palsite/.cards')))
