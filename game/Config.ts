var Config = {

   analyticsEndpoint: 'https://ludum38stats.azurewebsites.net/api/HttpTriggerJS1?code=Fj7bATyuqPp3qLCEFIDfJHNtGLm7UAQVBzBckN36ulpNs5Src/v4FQ==',

   playerSample: 5000,
   enemySample: 5000,

   gameWidth: 1200,
   gameHeight: 720,

   enterDoorX: 13 * 24,
   enterDoorY: 29 * 24,
   enterDoorWidth: 120,
   enterDoorHeight: 24,

   playerStart: new ex.Vector(24 * 24, 13 * 24),
   playerWidth: 25,
   playerHeight: 25,

   playerVel: 100,

   enemyStart: new ex.Vector(384, 720),
   enemyWidth: 50,
   enemyHeight: 50,
   enemyRayCastAngle: Math.PI / 4,
   enemyRayLength: 200,
   enemyRayCount: 5,
   enemySpeed: 80,
   enemyChaseSpeed: 90,

   enemyVignetteRadius: 150,
   enemyChaseMusicRadius: 400,

   enemySpawnMinTime: 3000,
   enemySpawnMaxTime: 6000,

   enemySpawnMaximum: 12,
   enemyCheckoutTime: 25000,


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
   spawnTimedEnemyTime: 5000,

   convoEnemyDelay: 1000,
   convoEnemySpeed: 50,
   convoPlayerSpeed: 100,

   gameOverFoodAnimInterval: 400  
}

var GameOverEnemyPrompts = [
   'Fancy seeing you here! What a small world!',
   'Oh, you shop here? Small world!',
   'I can\'t believe I ran into you, what a small world!',
   'Long time no see! Small world, huh?'
];

var NpcNames = [
   'Your ex',
   'Your high school gym teacher',
   'Your loud neighbor',
   'The Mayor',
   'That person you owe money',
   'Gas station attendant',
   'Chief of police',
   'That person who\'s name you can\'t remember',
]

// Index matches row major index of food.png
const FoodNameMatrix = [
   'Tomato', 'Chips', 'Cereal', 'Pizza', 'Steak', 'Toilet Paper', 'Bread', 'Banana', 'Carrot' // Row 0
]

// Types of recipe suffixes
const RecipeNames = [
   'Soup', 'Cake', 'Hot Dish', 'Casserole', 'Mash',
   'Pasta', 'Salad', 'Pudding', 'Stew', 'Pie', 'Sandwiches', 'Smoothies'
]