var Config = {

   gameWidth: 1200,
   gameHeight: 720,

   playerStart: new ex.Vector(24 * 24, 13 * 24),
   playerWidth: 25,
   playerHeight: 40,

   playerVel: 100,

   enemyStart: new ex.Vector(384, 720),
   enemyWidth: 50,
   enemyHeight: 50,
   enemyRayCastAngle: Math.PI / 4,
   enemyRayLength: 200,
   enemyRayCount: 5,
   enemySpeed: 80,
   enemyChaseSpeed: 90,

   foodWidth: 48,
   foodHeight: 48,
   foodSheetCols: 9,
   foodSheetRows: 1,
   foodSpawnCount: 5,
   soundVolume: 0.15,
   backgroundVolume: 0.1,

   groceryListTime: 1000,
   spawnFoodTime: 2000,
   spawnFirstEnemyTime: 7000
}