var Resources = {
   map: new Extensions.Tiled.TiledResource('assets/map.json'),
   playerSheet: new ex.Texture('img/player-sprite.png'),
   foodSheet: new ex.Texture('img/food.png'),
   enemySheet: new ex.Texture('img/enemy.png'),
   music: new ex.Sound('assets/snd/bossa_nova.mp3'),
   playerSpottedSound: new ex.Sound('assets/snd/playerSpotted.mp3', 'assets/snd/playerSpotted.wav'),
   spawnEnemySound: new ex.Sound('assets/snd/spawnEnemy.mp3', 'assets/snd/spawnEnemy.wav')
};