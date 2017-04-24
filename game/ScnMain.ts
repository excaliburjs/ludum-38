const LAYER_IMPASSABLE = 'Impassable';
const LAYER_GAMEOVER = 'GameOver';
const LAYER_WAYPOINTS = 'Waypoints';
const LAYER_FLOOR = 'Floor';
const LAYER_ZONES = 'Zones';
const ZONE_MEAT = 'Meat';
const ZONE_FREEZER = 'Freezer';
const ZONE_SNACKS = 'Snacks';
const ZONE_PANTRY = 'Pantry';
const ZONE_CEREAL = 'Cereal';
const ZONE_TOILETRIES = 'Toiletries';
const ZONE_BAKERY = 'Bakery';
const ZONE_FRUIT = 'Fruit';
const ZONE_VEGETABLES = 'Vegetables';

type FoodZone = 
   | typeof ZONE_PANTRY
   | typeof ZONE_SNACKS   
   | typeof ZONE_CEREAL
   | typeof ZONE_FREEZER  
   | typeof ZONE_MEAT        
   | typeof ZONE_TOILETRIES
   | typeof ZONE_BAKERY
   | typeof ZONE_FRUIT
   | typeof ZONE_VEGETABLES;

interface IFoodSpawnPoint {
   x: number,
   y: number,
   type: FoodZone
}

const FoodTypes: FoodZone[] = [
    ZONE_PANTRY,
    ZONE_SNACKS,   
    ZONE_CEREAL,
    ZONE_FREEZER, 
    ZONE_MEAT,             
    ZONE_TOILETRIES,
    ZONE_BAKERY,
    ZONE_FRUIT,
    ZONE_VEGETABLES
];

class ScnMain extends ex.Scene {

   private _grid: WaypointGrid;
   private _nodes: WaypointNode[];
   private _wallTiles: ex.Cell[] = [];
   private _floorTiles: ex.Cell[] = [];
   private _foodSpawnPoints: IFoodSpawnPoint[] = [];
   private _gameOverZone: ex.Cell[] = [];
   
   constructor(engine: ex.Engine) {
      super(engine);            
   }

   public door: ex.Actor;
   public map: ex.TileMap;
   public enemies: Enemy[] = [];
   public cashier: Cashier;

   public onInitialize(engine: ex.Engine) {
      this.map = Resources.map.getTileMap();
      this.add(this.map);


      // vignette.addDrawing('vignette0', Resources.vignette0.asSprite());
      // vignette.addDrawing('vignette1', Resources.vignette1.asSprite());
      // vignette.addDrawing('vignette2', Resources.vignette2.asSprite());
      // vignette.addDrawing('vignette3', Resources.vignette3.asSprite());
      
      Resources.map.data.layers.forEach(layer => {
         this.collectWayPoints(layer);
         this.collectSolidTiles(layer);
         this.collectFloorTiles(layer); 
         this.collectFoodZones(layer);    
         this.collectGameOverZones(layer); 
      });

      // Build game over triggers
      for (var go of this._gameOverZone) {
         let goc = go.getCenter();
         var checkoutTrigger = new ex.Trigger(goc.x, goc.y, this.map.cellWidth, this.map.cellHeight,
            this.handleCheckoutTrigger, -1);
         
         this.add(checkoutTrigger);
      }

      // Build waypoint grid for pathfinding based on 
      this._grid = new WaypointGrid(this._nodes, this._wallTiles);

      // Entrance door
      this.door = new ex.Actor(Config.enterDoorX, Config.enterDoorY, Config.enterDoorWidth, Config.enterDoorHeight);
      this.door.anchor.setTo(0, 0);
      
      var doorSheet = new ex.SpriteSheet(Resources.doorSheet, 13, 1, Config.enterDoorWidth, Config.enterDoorHeight);
      var spriteIndices = doorSheet.sprites.map((s, idx) => idx);
      this.door.addDrawing('idle', doorSheet.getSprite(0));
      this.door.addDrawing('open', doorSheet.getAnimationForAll(game, 50));
      this.door.addDrawing('close', doorSheet.getAnimationByIndices(game, spriteIndices.reverse(), 50));
      this.door.setDrawing('idle');
      this.add(this.door);
      this.door.setZIndex(2);

      // cashier
      this.cashier = new Cashier(1126, 450, Config.playerWidth, Config.playerHeight, ex.Color.Red);
      this.add(this.cashier);

      director.setup();

      this.on('postdraw', (evt: ex.PostDrawEvent) => {
         if(gameDebug){
            this._grid.draw(evt.ctx);
         }
      });
   }

   collectWayPoints(layer: Extensions.Tiled.ITiledMapLayer) {
      if (layer.name !== LAYER_WAYPOINTS ||
          !layer.objects) return;

      var nodes: WaypointNode[] = [];
      for(var o of layer.objects){
         nodes.push(new WaypointNode(o.x, o.y));
      }
      this._nodes = nodes;
   }

   collectSolidTiles(layer: Extensions.Tiled.ITiledMapLayer) {
      if (layer.name !== LAYER_IMPASSABLE ||
          typeof layer.data == 'string' ||
          !layer.data) return;

      for (let i = 0; i < layer.data.length; i++) {
         if (layer.data[i] !== 0) {
            this.map.data[i].solid = true;
            this._wallTiles.push(this.map.data[i]);
         }
      }
   }

   collectFloorTiles(layer: Extensions.Tiled.ITiledMapLayer) {
      if (layer.name !== LAYER_FLOOR ||
          typeof layer.data == 'string' ||
          !layer.data) return;
      
      for (let i = 0; i < layer.data.length; i++) {
         if (layer.data[i] !== 0) {
            if (!this.map.data[i].solid){
               this._floorTiles.push(this.map.data[i]);
            }
         }
      }
   }

   collectFoodZones(layer: Extensions.Tiled.ITiledMapLayer) {
      if (layer.name !== LAYER_ZONES ||
          !layer.objects) return;

      for (var o of layer.objects) {
         this._foodSpawnPoints.push({
            x: o.x,
            y: o.y,
            type: <FoodZone>o.type
         });
      }
   }

   collectGameOverZones(layer: Extensions.Tiled.ITiledMapLayer) {
      if (layer.name !== LAYER_GAMEOVER) return;

      for (let i = 0; i < layer.data.length; i++) {
         if (layer.data[i] > 0) {
            this._gameOverZone.push(this.map.data[i]);
         }
      }
   }

   handleCheckoutTrigger(this: ex.Trigger) {

      if (player.collides(this)) {
         SoundManager.playPlayerCheckout();
         director.checkout();
      } else if (scnMain.enemies.filter(en => en.collides(this)).length > 0) {
         // play enemy checkout sounds
         SoundManager.playEnemyCheckout();
      }
   }

   getCellsInFoodZone(foodZone: string): IFoodSpawnPoint[] {
      var validCells = this._foodSpawnPoints.filter((itm, idx) => {
         return itm.type === foodZone;
      });

      return validCells;
   }

   //TODO if we don't create a new WaypointGrid, the enemies spawn in at the current location of the existing enemies
   // the WaypointGrid is being modified in an unexpected fashion
   spawnEnemy(mode: EnemyMode = ENEMY_RANDOM_MODE) {

      // open door
      Resources.doorSlideSound.play();
      this.door.setDrawing('open');
      this.door.actions
         .delay(50 * 13)
         .callMethod(() => {
            var enemy = new Enemy(this._grid, mode);            
            this.enemies.push(enemy);
            this.add(enemy);
            enemy.setZIndex(1);
            SoundManager.playSpawnEnemy();
         })
         .delay(600)
         .callMethod(() => {
            this.door.setDrawing('close');
            Resources.doorSlideCloseSound.play();
         });
   }

   private _foodSpawnAnimTimer: ex.Timer;

   spawnFood(){
      // player is added to scene global context
      var foodArr = new Array<Food>();      
      var chosenFoodZones = gameRandom.pickSet(FoodTypes, Config.foodSpawnCount);

      for (var i = 0; i < chosenFoodZones.length; i++){
         var chosenFoodZone: FoodZone = chosenFoodZones[i];
         var validTiles = this.getCellsInFoodZone(chosenFoodZone);
         var chosenCell = validTiles[gameRandom.integer(0, validTiles.length - 1)];
                     
         var food = new Food(chosenCell.x, chosenCell.y, i, chosenFoodZone);
                              
         foodArr.push(food);
      }

      var currIdx = 0;
      this._foodSpawnAnimTimer = new ex.Timer(() => {
         if (currIdx === foodArr.length) {
            scnMain.cancelTimer(this._foodSpawnAnimTimer);
            return;
         }

         scnMain.add(foodArr[currIdx]);
         SoundManager.playSpawnFood();

         currIdx++;
      }, Config.spawnFoodTimeInterval, true);

      // WORKAROUND timers cannot be added within another timer's callback fn
      setTimeout(() => scnMain.add(this._foodSpawnAnimTimer), 1);      
      
      var shoppingList = new ShoppingList(foodArr);
      player.shoppingList = shoppingList;
      shoppingList.updateUI();
   }
}