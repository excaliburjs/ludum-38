var Config = {

   gameWidth: 1200,
   gameHeight: 720,

   enterDoorX: 13 * 24,
   enterDoorY: 29 * 24,
   enterDoorWidth: 120,
   enterDoorHeight: 24,

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

   enemyVignetteRadius: 300,

   enemySpawnMinTime: 5000,
   enemySpawnMaxTime: 12000,

   enemySpawnMaximum: 10,


   foodWidth: 48,
   foodHeight: 48,
   foodSheetCols: 9,
   foodSheetRows: 1,
   foodSpawnCount: 5,
   soundVolume: 1,
   backgroundVolume: 0.3,

   groceryListTime: 4000,
   spawnFoodTime: 4000,
   spawnFoodTimeInterval: 400,
   spawnFirstEnemyTime: 7000,
   spawnTimedEnemyTime: 5000
}