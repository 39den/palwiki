# element matchup: multipliers multiply across defender's elements (game: weak 1.5, resist 0.65; double resist 0.4225 measured)
BEATS={'Огонь':['Трава','Лёд'],'Вода':['Огонь'],'Трава':['Земля'],'Молния':['Вода'],'Лёд':['Дракон'],'Земля':['Молния'],'Тьма':['Нейтральный'],'Дракон':['Тьма']}
ALL=['Нейтральный','Огонь','Вода','Трава','Молния','Лёд','Земля','Тьма','Дракон']
W,RS=1.5,0.65
def mult(atk,defs):
  m=1.0
  for d in defs:
    if d in BEATS.get(atk,[]):m*=W
    elif atk in BEATS.get(d,[]):m*=RS
  return round(m,4)
def matchup(defs):
  r={a:mult(a,defs) for a in ALL}
  return {'w':sorted([[a,v] for a,v in r.items() if v>1.05],key=lambda x:-x[1]),'r':sorted([[a,v] for a,v in r.items() if v<0.95],key=lambda x:x[1])}
