const Core=require('/workspace/palsite/static/smart.js');const D=require('/workspace/palsite/docs/assets/search_data.json');const c=Core(D);
const T=[['fyu,bc','pal','Анубис'],['кто лучше всех копает','work','Добыча'],['чем бить зои','weak','Зои'],['где взять серу','item','Сера'],['пассивки фросталион боец','passives','Фросталлион'],
['анубс','pal','Анубис'],['джетрагн','pal','Джетрагон'],['l;tnlhfujy','pal','Джетрагон'],['лучший лесоруб','work','Рубка'],['кто лучше рубит деревья','work','Рубка'],
['где найти палладий','item','Палладий'],['где взять древние детали','item','древн'],['как вывести анубиса','breed','Анубис'],['как получить фросталлиона','breed','Фросталлион'],
['слабость джетрагона','weak','Джетрагон'],['чем бить лили','weak','Лили'],['башня зои','boss','Зои'],['легенда','passive','Легенда'],['демон бог','passive','Демон-бог'],
['jetragon','pal','Джетрагон'],['anubis','pal','Анубис'],['пассивки для анубиса рабочий','passives','Анубис'],['лучший электрик','work','Генерация'],['кто лучше поливает','work','Полив'],
['где взять уголь','item','Уголь'],['как открыть инвентарь','faq','инвентарь'],['где взять чипы для технологий','faq','технолог'],['сколько времени инкубация яйца','faq','яйц'],
['самый быстрый летающий маунт','mount',''],['ламбол','pal','Ламболл'],['gfccbdrb lkz fye,bcf','passives','Анубис']];
let ok=0;for(const[q,t,s]of T){const a=c.answer(q);const txt=JSON.stringify(a);const pass=a&&a.type==t&&txt.toLowerCase().includes(s.toLowerCase());ok+=pass;if(!pass)console.log('FAIL',q,'→',a&&a.type,txt.slice(0,160));}
console.log(`PASS ${ok}/${T.length}`);
