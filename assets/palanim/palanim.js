/* Палпедия · живые палы (hover on desktop, tap on phone, one at a time).
   Markup: <img data-palanim="JetDragon" data-palanim-type="card|thumb" ...>  (img.pal-card is picked up automatically).
   API: PalAnim.init(root?)  PalAnim.stop() */
(function(){
  var S=document.currentScript;
  var BASE=(S&&S.getAttribute('data-base'))||window.PALANIM_BASE||'palanim/assets/';
  if(BASE.slice(-1)!=='/')BASE+='/';
  var IDS=new Set(["SheepBall","PinkCat","ChickenPal","Carbunclo","BluePlatypus","BluePlatypus_Fire","CuteFox","FlyingManta","FlyingManta_Thunder","WoolFox","KendoFrog","KendoFrog_Dark","LeafMomonga","Ganesha","PlantSlime","SamuraiDog","CloverFairy","Hedgehog","Hedgehog_Ice","NegativeKoala","Penguin","Penguin_Electric","CaptainPenguin","CaptainPenguin_Black","WizardOwl","Alpaca","KingAlpaca","KingAlpaca_Ice","DreamDemon","Monkey","Monkey_Fire","NightFox","LavaGirl","FlameBambi","Bastet","Bastet_Ice","Boar","Kitsunebi","Kitsunebi_Ice","NegativeOctopus","NegativeOctopus_Neutral","CuteMole","Deer","Deer_Ground","Garm","BerryGoat","BerryGoat_Dark","MopBaby","MopKing","TentacleTurtle","TentacleTurtle_Ground","WindChimes","WindChimes_Ice","SweetsSheep","SweetsSheep_Ground","CowPal","BlueDragon","BlueDragon_Ice","ElecCat","Kelpie","Kelpie_Fire","PinkRabbit","PinkRabbit_Grass","JellyfishFairy","JellyfishGhost","ClioneTwins","OctopusGirl","OctopusGirl_Neutral","Eagle","GhostBlackCat","HawkBird","CatBat","ColorfulBird","Kirin","Kirin_Ice","SharkKid","SharkKid_Fire","Werewolf","Werewolf_Ice","DarkCrow","FlameBuffalo","FluffyBird","LittleBriarRose","CuteButterfly","ElecPomeranian","FairyDragon","FairyDragon_Water","BirdDragon","BirdDragon_Ice","CatVampire","VioletFairy","SoldierBee","QueenBee","PinkLizard","NaughtyCat","PurpleSpider","IceSeal","IceSeal_Ground","LizardMan","LizardMan_Fire","Gorilla","Gorilla_Ground","Serpent","Serpent_Ground","RobinHood","RobinHood_Ground","FlowerRabbit","FoxMage","FoxMage_Dark","CatMage","CatMage_Fire","HadesBird","HadesBird_Electric","GrassMinotaur","GrassMinotaur_Ice","Mutant","FengyunDeeper","FengyunDeeper_Electric","FlowerDinosaur","FlowerDinosaur_Electric","Ronin","Ronin_Dark","IceCrocodile","GrassMammoth","GrassMammoth_Ice","StuffedShark","StuffedShark_Fire","FlowerDoll","FlowerDoll_Fire","PandaGirl","Baphomet","Baphomet_Dark","RaijinDaughter","RaijinDaughter_Water","FireKirin","FireKirin_Dark","LazyDragon","LazyDragon_Electric","IceFox","ThunderBird","ThunderBird_Ice","GhostAnglerfish","GhostAnglerfish_Fire","ThunderDog","ThunderDog_Ice","DarkScorpion","DarkScorpion_Ground","CactusDoll","CactusDoll_Dark","IceDeer","GrassPanda","GrassPanda_Electric","WeaselDragon","WeaselDragon_Fire","RedArmorBird","VolcanoDragon","VolcanoDragon_Ice","TropicalOstrich","DrillGame","SakuraSaurus","SakuraSaurus_Water","LazyCatfish","LazyCatfish_Gold","Plesiosaur","AmaterasuWolf","AmaterasuWolf_Dark","Manticore","Manticore_Dark","HerculesBeetle","HerculesBeetle_Ground","SnowPeafowl","DarkFlameFox","WhiteMoth","WhiteMoth_Neutral","GhostBeast","MushroomDragon","MushroomDragon_Dark","IceWitch","MummyPal","Umihebi","Umihebi_Fire","Suzaku","Suzaku_Water","FeatherOstrich","SkyDragon","SkyDragon_Grass","LeafPrincess","SmallArmadillo","GuardianDog","SwordCutlassfish","SwordCutlassfish_Fire","VolcanicMonster","VolcanicMonster_Ice","NightBlueHorse","NightBlueHorse_Neutral","RockBeast","RockBeast_Ice","WhiteTiger","WhiteTiger_Ground","SmallYeti","Yeti","Yeti_Grass","CandleGhost","VenusFlytrap","KingBahamut","KingBahamut_Dragon","GrassGolem","GrassGolem_Dark","Anubis","Sekhmet","ScorpionMan","ScorpionMan_Electric","CubeTurtle","CubeTurtle_Neutral","BadCatgirl","MimicDog","DarkAlien","WhiteAlienDragon","BlueberryFairy","GhostRabbit","GhostRabbit_Grass","BlackPuppy","BlackPuppy_Ice","MysteryMask","IceNarwhal","IceNarwhal_Fire","GrassRabbitMan","GrimGirl","GoldenHorse","SifuDog","SumoDog","WhiteDeer","WhiteDeer_Dark","BlackMetalDragon","WingGolem","WingGolem_Fire","WhiteShieldDragon","BlueThunderHorse","LongCat","ElecSnail","ElecSnail_Ground","DandelionGirl","BrownRabbit","HoodGhost","ElecLizard","OniGhostGirl","KingSunfish","KingSunfish_Thunder","SleeveRabbit","GhostDragon","GhostDragon_Fire","ThunderFluffyBird","RedFlowerBird","FoxExorcist","LotusDragon","ClownRabbit","ThiefBird","SnakeGirl","MushroomLady","LanternButler","MoonChild","MonochromeQueen","KabukiMan","DomeArmorDragon","ElecPanda","LilyQueen","LilyQueen_Dark","ThunderDragonMan","Horus","Horus_Water","BlackGriffon","MoonQueen","SnowTigerBeastman","BlueSkyDragon","Mothman","FlowerPrince","NightLady","NightLady_Dark","DarkMechaDragon","LegendDeer","SaintCentaur","BlackCentaur","IceHorse","IceHorse_Dark","PoseidonOrca","JetDragon","KingWhale","WorldTreeDragon","Blue_Slime","Cave_Bat","Demon_Eye","Enchanted_Sword","Eye_of_Cthulhu","Green_Slime","Illuminant_Bat","Illuminant_Slime","Purple_Slime","Rainbow_Slime","Red_Slime"]);
  var RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  var HOVER=window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches;
  var WIN={x:44/750,y:124/1050,w:662/750,h:437/1050};       // card art window
  var blobs={},cur=null,timer=0,io=null;
  function idOf(img){
    var d=img.getAttribute('data-palanim');if(d)return IDS.has(d)?d:null;
    if(img.classList.contains('pal-card')){                  // img/<no>_<Id>.webp
      var b=(img.getAttribute('src')||'').split('/').pop().replace(/@\d+/,'').replace(/\.(webp|png|jpg)$/,'');
      var i=b.indexOf('_');b=i>=0?b.slice(i+1):b;return IDS.has(b)?b:null}
    return null}
  function typeOf(img){return img.getAttribute('data-palanim-type')||(img.classList.contains('pal-card')?'card':'thumb')}
  function get(url){if(!blobs[url])blobs[url]=fetch(url).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){return URL.createObjectURL(b)});return blobs[url]}
  function url(img){return BASE+img._pa.id+'/'+(img._pa.type==='card'?'card':'thumb')+'.webp'}
  function place(img,box){
    var w=img.offsetWidth,h=img.offsetHeight,l=img.offsetLeft,t=img.offsetTop;
    if(img._pa.type==='card'){l+=w*WIN.x;t+=h*WIN.y;w*=WIN.w;h*=WIN.h}
    else{var s=Math.min(w,h);l+=(w-s)/2;t+=(h-s)/2;w=h=s}   // square render, object-fit: contain
    box.style.cssText='left:'+l+'px;top:'+t+'px;width:'+w+'px;height:'+h+'px'}
  function stop(){
    if(!cur)return;var img=cur,box=img._pa.box;cur=null;clearTimeout(timer);
    if(box){box.classList.remove('on');setTimeout(function(){if(cur!==img&&box.parentNode)box.parentNode.removeChild(box)},220)}
    img._pa.box=null}
  function play(img){
    if(RM.matches||cur===img)return;stop();cur=img;
    get(url(img)).then(function(u){
      if(cur!==img)return;
      var box=document.createElement('span');box.className='palanim-live';box.setAttribute('aria-hidden','true');
      var a=new Image();a.alt='';a.decoding='async';                     // new <img> each time -> starts on the static pose
      a.onload=function(){if(cur!==img)return;place(img,box);box.classList.add('on')};
      box.appendChild(a);img.parentNode.insertBefore(box,img.nextSibling);img._pa.box=box;place(img,box);a.src=u;
      if(!HOVER)timer=setTimeout(function(){if(cur===img)stop()},8000);  // phone: stops by itself
    },function(){if(cur===img)cur=null})}
  function toggle(img){cur===img?stop():play(img)}
  function bind(img){
    if(img._pa)return;var id=idOf(img);if(!id)return;
    img._pa={id:id,type:typeOf(img),box:null};img.classList.add('palanim-ready');
    var link=img.closest('a[href]');
    if(HOVER){
      img.addEventListener('pointerenter',function(){play(img)});
      img.addEventListener('pointerleave',function(){if(cur===img)stop()});
    }else if(!link||img.getAttribute('data-palanim-tap')==='intercept'){
      img.addEventListener('click',function(e){if(link)e.preventDefault();toggle(img)});
    }
    if(!link&&img._pa.type==='card'){
      if(!img.hasAttribute('tabindex'))img.tabIndex=0;
      img.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(img)}});
      img.addEventListener('blur',function(){if(cur===img)stop()});
    }
    if(io)io.observe(img)}
  function init(root){
    root=root||document;
    if(!io&&'IntersectionObserver'in window)io=new IntersectionObserver(function(es){es.forEach(function(x){if(!x.isIntersecting&&x.target===cur)stop()})});
    root.querySelectorAll('img[data-palanim],img.pal-card').forEach(bind)}
  document.addEventListener('click',function(e){if(cur&&e.target!==cur)stop()},true);
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop()});
  window.addEventListener('resize',function(){if(cur&&cur._pa.box)place(cur,cur._pa.box)});
  if(RM.addEventListener)RM.addEventListener('change',function(){if(RM.matches)stop()});
  window.PalAnim={init:init,stop:stop};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){init()});else init();
  if(window.document$&&window.document$.subscribe)window.document$.subscribe(function(){stop();init()}); // MkDocs Material instant nav
})();
