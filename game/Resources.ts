var Resources = {
   map: new Extensions.Tiled.TiledResource('assets/map.json'),
   playerSheet: new ex.Texture('img/player.png'),
   playerSelect: new ex.Texture('img/player-select.png'),
   foodSheet: new ex.Texture('img/food.png'),
   bwFoodSheet: new ex.Texture('img/foodbw.png'),
   charSheet1: new ex.Texture('img/char-sprites/player-1.png'),
   charSheet2: new ex.Texture('img/char-sprites/player-2.png'),
   charSheet3: new ex.Texture('img/char-sprites/player-3.png'),
   charSheet4: new ex.Texture('img/char-sprites/player-4.png'),
   charSheet5: new ex.Texture('img/char-sprites/player-1-long.png'),
   charSheet6: new ex.Texture('img/char-sprites/player-2-long.png'),
   charSheet7: new ex.Texture('img/char-sprites/player-3-long.png'),
   charSheet8: new ex.Texture('img/char-sprites/player-4-long.png'),
   surpriseSheet: new ex.Texture('img/surprise.png'),
   //vignette0: new ex.Texture('img/vignette-stretched-light.png'),
   // vignette1: new ex.Texture('img/vignette-stretched-dark.png'),
   // vignette2: new ex.Texture('img/vignette-stretched-darker.png'),
   // vignette3: new ex.Texture('img/vignette-stretched-darkest.png'),
   music: new ex.Sound('assets/snd/bossa_nova.mp3'),
   ominousMusic: new ex.Sound('assets/snd/ominous.mp3', 'assets/snd/ominous.wav'),
   playerSpottedSound: new ex.Sound('assets/snd/playerSpotted.mp3', 'assets/snd/playerSpotted.wav'),
   spawnEnemySound: new ex.Sound('assets/snd/spawnEnemy.mp3', 'assets/snd/spawnEnemy.wav'),
   spawnFoodSound: new ex.Sound('assets/snd/placeFood.mp3', 'assets/snd/placeFood.wav'),
   checkoutSound: new ex.Sound('assets/snd/checkout.mp3', 'assets/snd/checkout.wav'),
   registerSound: new ex.Sound('assets/snd/register.mp3', 'assets/snd/register.wav'),
   pickupSound: new ex.Sound('assets/snd/pickup.mp3', 'assets/snd/pickup.wav'),
   doorSlideSound: new ex.Sound('assets/snd/doorslide.mp3', 'assets/snd/doorslide.wav'),
   doorSlideCloseSound: new ex.Sound('assets/snd/doorslideclose.mp3', 'assets/snd/doorslideclose.wav'),
   diagIntro: new ex.Texture('img/diag-intro.png'),
   doorSheet: new ex.Texture('img/door.png')

};