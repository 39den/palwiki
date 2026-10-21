import json,os,process as P
from PIL import Image
B=P.B;E=json.load(open('src/hunt/fandom_exact.json'))
RB={f[:-4] for f in os.listdir('src/fandom') if Image.open('src/fandom/'+f).mode!='RGBA'}
M=json.load(open('manifest.json'));idx={p['id']:i for i,p in enumerate(M['pals'])}
def save(n):
  json.dump(M,open('manifest.json.tmp','w'),ensure_ascii=False,indent=1);os.replace('manifest.json.tmp','manifest.json')
  import datetime,zoneinfo;t=datetime.datetime.now(zoneinfo.ZoneInfo('Europe/Kaliningrad')).strftime('%Y-%m-%d %H:%M')
  done=sum(1 for p in M['pals'] if p['kind']=='render');open('PROGRESS.txt','a').write(f'{t} (Калининград) · бюсты→рендеры: обработано {n}/{len(E)} · всего рендеров {done}/299\n')
n=0
for pid,(fn,w,h,url) in E.items():
  i=idx[pid]
  if M['pals'][i]['kind']=='render' and M['pals'][i].get('source_site')=='fandom': n+=1;continue
  old=M['pals'][i]
  r=P.pal(pid,f'{B}/work/up_fandom/{pid}.png',f'{B}/src/fandom_cut/{pid}.png','render',pid in RB)
  r.update(source_site='fandom',source_url=f'https://palworld.fandom.com/wiki/File:{fn}',source_file_url=url,credit='© Pocketpair · palworld.fandom.com',
           bg_removed='rembg birefnet-general-lite (source had screenshot bg)' if pid in RB else None,bust_backup=dict(source_url=old.get('source_url')))
  M['pals'][i]=r;n+=1
  if n%10==0: save(n)
save(n)
print('done',n,'review',[(p['id'],p['edge_touch_out']) for p in M['pals'] if p['check']!='ok'])
