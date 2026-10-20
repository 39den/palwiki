def h(c):c=c.lstrip('#');return [int(c[i:i+2],16)/255 for i in (0,2,4)]
def L(c):return sum(w*((x/12.92) if x<=.03928 else ((x+.055)/1.055)**2.4) for w,x in zip((.2126,.7152,.0722),c))
def mix(fg,a,bg):return [f*a+b*(1-a) for f,b in zip(h(fg),h(bg))]
def cr(a,b):A,B=sorted([L(a),L(b)],reverse=True);return (A+.05)/(B+.05)
# (concept, panel rgba over darkest/lightest bg sample, text, muted, accent-on-panel)
T={'D':(('#09325a',.55,'#040b20'),'#f2f7ff','#b5cbe3','#fee707'),
'E':(('#ffffff',.62,'#d6eff9'),'#152238','#3d4d63','#c2362b'),
'F':(('#07161a',1,'#020a0c'),'#dcfff4','#8fc9b8','#4dffc3'),
'G':(('#2f241e',.62,'#f0a35e'),'#fff6e6','#f0d8b8','#ffd27a'),
'H':(('#f6ecd9',1,'#5c3625'),'#2b1a10','#5c3d2a','#8a2f17')}
for k,(p,t,m,a) in T.items():
  bg=mix(*p);print(k,'text %.1f'%cr(h(t),bg),'muted %.1f'%cr(h(m),bg),'accent %.1f'%cr(h(a),bg))
