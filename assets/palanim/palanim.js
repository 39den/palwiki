/* Палпедия · живые палы v2 (FIX_AUDIT 22.10): автостарт в экране (ПК и телефон), пауза вне экрана,
   до MAX одновременно, ленивые ассеты, prefers-reduced-motion. Карточка: card.webp в окне арта; плитки: thumb.webp поверх арта.
   Markup: img.pal-card | img[data-palanim] | img[src*="pp/art/<Id>-256"]. API: PalAnim.init(root?) PalAnim.stop() */
(function(){
  var S=document.currentScript;
  var BASE=(S&&S.getAttribute('data-base'))||window.PALANIM_BASE||'palanim/assets/';
  if(BASE.slice(-1)!=='/')BASE+='/';
  var IDS=new Set(["SheepBall","PinkCat","ChickenPal","Carbunclo","BluePlatypus","BluePlatypus_Fire","CuteFox","FlyingManta","FlyingManta_Thunder","WoolFox","KendoFrog","KendoFrog_Dark","LeafMomonga","Ganesha","PlantSlime","SamuraiDog","CloverFairy","Hedgehog","Hedgehog_Ice","NegativeKoala","Penguin","Penguin_Electric","CaptainPenguin","CaptainPenguin_Black","WizardOwl","Alpaca","KingAlpaca","KingAlpaca_Ice","DreamDemon","Monkey","Monkey_Fire","NightFox","LavaGirl","FlameBambi","Bastet","Bastet_Ice","Boar","Kitsunebi","Kitsunebi_Ice","NegativeOctopus","NegativeOctopus_Neutral","CuteMole","Deer","Deer_Ground","Garm","BerryGoat","BerryGoat_Dark","MopBaby","MopKing","TentacleTurtle","TentacleTurtle_Ground","WindChimes","WindChimes_Ice","SweetsSheep","SweetsSheep_Ground","CowPal","BlueDragon","BlueDragon_Ice","ElecCat","Kelpie","Kelpie_Fire","PinkRabbit","PinkRabbit_Grass","JellyfishFairy","JellyfishGhost","ClioneTwins","OctopusGirl","OctopusGirl_Neutral","Eagle","GhostBlackCat","HawkBird","CatBat","ColorfulBird","Kirin","Kirin_Ice","SharkKid","SharkKid_Fire","Werewolf","Werewolf_Ice","DarkCrow","FlameBuffalo","FluffyBird","LittleBriarRose","CuteButterfly","ElecPomeranian","FairyDragon","FairyDragon_Water","BirdDragon","BirdDragon_Ice","CatVampire","VioletFairy","SoldierBee","QueenBee","PinkLizard","NaughtyCat","PurpleSpider","IceSeal","IceSeal_Ground","LizardMan","LizardMan_Fire","Gorilla","Gorilla_Ground","Serpent","Serpent_Ground","RobinHood","RobinHood_Ground","FlowerRabbit","FoxMage","FoxMage_Dark","CatMage","CatMage_Fire","HadesBird","HadesBird_Electric","GrassMinotaur","GrassMinotaur_Ice","Mutant","FengyunDeeper","FengyunDeeper_Electric","FlowerDinosaur","FlowerDinosaur_Electric","Ronin","Ronin_Dark","IceCrocodile","GrassMammoth","GrassMammoth_Ice","StuffedShark","StuffedShark_Fire","FlowerDoll","FlowerDoll_Fire","PandaGirl","Baphomet","Baphomet_Dark","RaijinDaughter","RaijinDaughter_Water","FireKirin","FireKirin_Dark","LazyDragon","LazyDragon_Electric","IceFox","ThunderBird","ThunderBird_Ice","GhostAnglerfish","GhostAnglerfish_Fire","ThunderDog","ThunderDog_Ice","DarkScorpion","DarkScorpion_Ground","CactusDoll","CactusDoll_Dark","IceDeer","GrassPanda","GrassPanda_Electric","WeaselDragon","WeaselDragon_Fire","RedArmorBird","VolcanoDragon","VolcanoDragon_Ice","TropicalOstrich","DrillGame","SakuraSaurus","SakuraSaurus_Water","LazyCatfish","LazyCatfish_Gold","Plesiosaur","AmaterasuWolf","AmaterasuWolf_Dark","Manticore","Manticore_Dark","HerculesBeetle","HerculesBeetle_Ground","SnowPeafowl","DarkFlameFox","WhiteMoth","WhiteMoth_Neutral","GhostBeast","MushroomDragon","MushroomDragon_Dark","IceWitch","MummyPal","Umihebi","Umihebi_Fire","Suzaku","Suzaku_Water","FeatherOstrich","SkyDragon","SkyDragon_Grass","LeafPrincess","SmallArmadillo","GuardianDog","SwordCutlassfish","SwordCutlassfish_Fire","VolcanicMonster","VolcanicMonster_Ice","NightBlueHorse","NightBlueHorse_Neutral","RockBeast","RockBeast_Ice","WhiteTiger","WhiteTiger_Ground","SmallYeti","Yeti","Yeti_Grass","CandleGhost","VenusFlytrap","KingBahamut","KingBahamut_Dragon","GrassGolem","GrassGolem_Dark","Anubis","Sekhmet","ScorpionMan","ScorpionMan_Electric","CubeTurtle","CubeTurtle_Neutral","BadCatgirl","MimicDog","DarkAlien","WhiteAlienDragon","BlueberryFairy","GhostRabbit","GhostRabbit_Grass","BlackPuppy","BlackPuppy_Ice","MysteryMask","IceNarwhal","IceNarwhal_Fire","GrassRabbitMan","GrimGirl","GoldenHorse","SifuDog","SumoDog","WhiteDeer","WhiteDeer_Dark","BlackMetalDragon","WingGolem","WingGolem_Fire","WhiteShieldDragon","BlueThunderHorse","LongCat","ElecSnail","ElecSnail_Ground","DandelionGirl","BrownRabbit","HoodGhost","ElecLizard","OniGhostGirl","KingSunfish","KingSunfish_Thunder","SleeveRabbit","GhostDragon","GhostDragon_Fire","ThunderFluffyBird","RedFlowerBird","FoxExorcist","LotusDragon","ClownRabbit","ThiefBird","SnakeGirl","MushroomLady","LanternButler","MoonChild","MonochromeQueen","KabukiMan","DomeArmorDragon","ElecPanda","LilyQueen","LilyQueen_Dark","ThunderDragonMan","Horus","Horus_Water","BlackGriffon","MoonQueen","SnowTigerBeastman","BlueSkyDragon","Mothman","FlowerPrince","NightLady","NightLady_Dark","DarkMechaDragon","LegendDeer","SaintCentaur","BlackCentaur","IceHorse","IceHorse_Dark","PoseidonOrca","JetDragon","KingWhale","WorldTreeDragon","Blue_Slime","Cave_Bat","Demon_Eye","Enchanted_Sword","Eye_of_Cthulhu","Green_Slime","Illuminant_Bat","Illuminant_Slime","Purple_Slime","Rainbow_Slime","Red_Slime"]);
  var RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  var WIN={x:44/750,y:124/1050,w:662/750,h:437/1050};
  var MAX=innerWidth<700?4:8, playing=new Set(), vis=new Map(), io=null, blobs={};
  function idOf(img){
    var d=img.getAttribute('data-palanim');if(d)return IDS.has(d)?d:null;
    var s=img.getAttribute('src')||'';
    if(img.classList.contains('pal-card')){var b=s.split('/').pop().replace(/@\d+/,'').replace(/\.(webp|png|jpg)$/,'');var i=b.indexOf('_');b=i>=0?b.slice(i+1):b;return IDS.has(b)?b:null}
    var m=s.match(/pp\/art\/([A-Za-z0-9_]+)-256\.webp/);if(m&&IDS.has(m[1]))return m[1];
    return null}
  function typeOf(img){return img.getAttribute('data-palanim-type')||(img.classList.contains('pal-card')?'card':'thumb')}
  function get(u){if(!blobs[u])blobs[u]=fetch(u).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){return URL.createObjectURL(b)});return blobs[u]}
  function url(img){return BASE+img._pa.id+'/'+(img._pa.type==='card'?'card.webp?v=fit1':'thumb.webp')}
  function place(img,box){
    var op=box.offsetParent||document.body,o=op.getBoundingClientRect(),r=img.getBoundingClientRect();
    var l=r.left-o.left-op.clientLeft+op.scrollLeft,t=r.top-o.top-op.clientTop+op.scrollTop,w=r.width,h=r.height;
    if(img._pa.type==='card'){l+=w*WIN.x;t+=h*WIN.y;w*=WIN.w;h*=WIN.h}
    else{var s=Math.min(w,h),op2=(getComputedStyle(img).objectPosition||'50% 50%').split(' '),fx=parseFloat(op2[0]),fy=parseFloat(op2[1]==null?op2[0]:op2[1]);if(isNaN(fx))fx=50;if(isNaN(fy))fy=50;l+=(w-s)*fx/100;t+=(h-s)*fy/100;w=h=s}
    box.style.cssText='left:'+l+'px;top:'+t+'px;width:'+w+'px;height:'+h+'px'}
  function stop(img){
    if(!img){playing.forEach(function(x){stop(x)});return}
    if(!playing.has(img))return;playing.delete(img);var box=img._pa.box;img._pa.box=null;img.classList.remove('palanim-hid');
    if(box){box.classList.remove('on');setTimeout(function(){if(box.parentNode)box.parentNode.removeChild(box)},220)}}
  var READY=document.readyState==='complete';function setReady(){if(READY)return;READY=true;vis.forEach(function(r,img){if(r>0)play(img)})}if(!READY){addEventListener('load',function(){setTimeout(setReady,300)},{once:true});setTimeout(setReady,1500)}
  function play(img){
    if(!READY)return;
    if(RM.matches||playing.has(img)||!img.isConnected)return;
    if(playing.size>=MAX){var far=null,fr=-1;playing.forEach(function(x){var r=vis.get(x)||0;if(far===null||r<fr){far=x;fr=r}});if(far&&(vis.get(far)||0)<(vis.get(img)||1))stop(far);else return}
    playing.add(img);
    get(url(img)).then(function(u){
      if(!playing.has(img))return;
      var box=document.createElement('span');box.className='palanim-live pa-'+img._pa.type;box.setAttribute('aria-hidden','true');
      var a=new Image();a.alt='';a.decoding='async';
      a.onload=function(){if(!playing.has(img))return;place(img,box);box.classList.add('on');if(img._pa.type!=='card')img.classList.add('palanim-hid')};
      box.appendChild(a);var par=img.parentNode;
      par.insertBefore(box,img.nextSibling);img._pa.box=box;place(img,box);a.src=u;
    },function(){playing.delete(img)})}
  function onIO(es){es.forEach(function(x){var img=x.target;vis.set(img,x.intersectionRatio);
    var th=img._pa.type==='card'?0.01:0.5;if(x.isIntersecting&&x.intersectionRatio>=th){clearTimeout(img._pa.t);img._pa.t=setTimeout(function(){if((vis.get(img)||0)>=th)play(img)},img._pa.type==='card'?150:350)}
    else{clearTimeout(img._pa.t);stop(img)}})}
  function bind(img){
    if(img._pa)return;var id=idOf(img);if(!id)return;
    if(img._pa===undefined&&!img.classList.contains('pal-card')&&!img.hasAttribute('data-palanim')&&img.getAttribute('width')&&+img.getAttribute('width')<90)return;
    img._pa={id:id,type:typeOf(img),box:null,t:0};img.classList.add('palanim-ready');
    img.addEventListener('pointerenter',function(){play(img)});
    if(io)io.observe(img)}
  function init(root){
    root=root||document;
    if(!io&&'IntersectionObserver'in window)io=new IntersectionObserver(onIO,{threshold:[0,0.01,0.5,1]});
    root.querySelectorAll('img[data-palanim],img.pal-card,img[src*="pp/art/"]').forEach(bind)}
  var mo,pend=0;function watch(){if(mo||!window.MutationObserver)return;mo=new MutationObserver(function(){if(pend)return;pend=setTimeout(function(){pend=0;init()},120)});mo.observe(document.body,{childList:true,subtree:true})}
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else{init();resume()}});
  (function loop(){if(!document.hidden)playing.forEach(function(x){if(x._pa.box)place(x,x._pa.box)});requestAnimationFrame(loop)})();
  window.addEventListener('scroll',function(){playing.forEach(function(x){if(x._pa.box)place(x,x._pa.box)})},{passive:true});
  window.addEventListener('resize',function(){playing.forEach(function(x){if(x._pa.box)place(x,x._pa.box)})});
  if(RM.addEventListener)RM.addEventListener('change',function(){if(RM.matches)stop()});
  function resume(){vis.forEach(function(r,img){if(!img.isConnected){vis.delete(img);return}if(r>=(img._pa.type==='card'?0.01:0.5))play(img)})}
  setInterval(function(){if(!document.hidden)resume()},2000);
  (function(){var st=document.createElement('style');st.textContent='img.palanim-hid{opacity:0!important;transition:opacity .18s}img.pal-card.palanim-ready:has(+ .palanim-live.on),img.pal-card.palanim-ready{opacity:1!important}';(document.head||document.documentElement).appendChild(st)})();
  window.PalAnim={init:init,stop:function(){stop()}};
  function go(){init();watch()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
  if(window.document$&&window.document$.subscribe)window.document$.subscribe(function(){stop();init();setTimeout(resume,200)});
})();
