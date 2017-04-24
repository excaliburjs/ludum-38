var Resources = {
   map: new Extensions.Tiled.TiledResource('assets/map.json'),
   playerSheet: new ex.Texture('img/player.png'),
   foodSheet: new ex.Texture('img/food.png'),
   bwFoodSheet: new ex.Texture('img/foodbw.png'),
   enemySheet: new ex.Texture('img/enemy.png'),
   surpriseSheet: new ex.Texture('img/surprise.png'),
   vignette0: new ex.Texture('img/vignette-stretched-light.png'),
   vignette1: new ex.Texture('img/vignette-stretched-dark.png'),
   vignette2: new ex.Texture('img/vignette-stretched-darker.png'),
   vignette3: new ex.Texture('img/vignette-stretched-darkest.png'),
   music: new ex.Sound('assets/snd/bossa_nova.mp3'),
   playerSpottedSound: new ex.Sound('assets/snd/playerSpotted.mp3', 'assets/snd/playerSpotted.wav'),
   spawnEnemySound: new ex.Sound('assets/snd/spawnEnemy.mp3', 'assets/snd/spawnEnemy.wav'),
   spawnFoodSound: new ex.Sound('assets/snd/placeFood.mp3', 'assets/snd/placeFood.wav'),
   diagIntro: new ex.Texture('img/diag-intro.png')
};