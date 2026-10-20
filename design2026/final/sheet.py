import sys
from PIL import Image
out=sys.argv[1];fs=sys.argv[2:];ims=[Image.open(f).convert('RGB') for f in fs];h=900
ims=[i.resize((int(i.width*h/i.height),h)) for i in ims];C=Image.new('RGB',(sum(i.width for i in ims)+10*len(ims),h),'#333');x=0
for i in ims:C.paste(i,(x,0));x+=i.width+10
C.save(out)
