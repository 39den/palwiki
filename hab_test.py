# every pal page shows habitat (points or explicit 'not in the wild'); World Tree tiles + markers present
import glob,re,sys,json,os
S='/workspace/palsite/site';bad=[]
for f in glob.glob(S+'/4_spravochniki/paly/*/index.html'):
  s=open(f).read()
  if 'class="habmap"' not in s and 'class="nowild"' not in s:bad.append(f.split('/')[-2])
T=S+'/assets/wtree';tiles=glob.glob(T+'/tiles/z*.webp')
ok_t=os.path.exists(T+'/tiles/z0x0y0.webp') and len(tiles)>=60 and len(json.load(open(T+'/markers.json'))['pts'])>50
hab=glob.glob(S+'/hab/*.json')
print('hab-test: pal pages without habitat',len(bad),bad[:10],'| tree tiles',len(tiles),'ok' if ok_t else 'MISSING','| hab files',len(hab))
sys.exit(1 if bad or not ok_t or len(hab)<250 else 0)
