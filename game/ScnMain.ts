const LAYER_IMPASSABLE = 'Impassable';
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
   | typeof ZONE_MEAT 
   | typeof ZONE_FREEZER
   | typeof ZONE_SNACKS
   | typeof ZONE_PANTRY
   | typeof ZONE_CEREAL
   | typeof ZONE_TOILETRIES
   | typeof ZONE_BAKERY
   | typeof ZONE_FRUIT
   | typeof ZONE_VEGETABLES;

interface IFoodSpawnPoint {
   x: number,
   y: number,
   type: FoodZone
}

const FoodTypes: Array<FoodZone> = [
    ZONE_MEAT, 
    ZONE_FREEZER,
    ZONE_SNACKS,
    ZONE_PANTRY,
    ZONE_CEREAL,
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

   constructor(engine: ex.Engine) {
      super(engine);            
   }

   public map: ex.TileMap;
   public enemies: Enemy[] = [];

   public onInitialize(engine: ex.Engine) {
      this.map = Resources.map.getTileMap();
      this.add(this.map);
      
      Resources.map.data.layers.forEach(layer => {
         this.collectWayPoints(layer);
         this.collectSolidTiles(layer);
         this.collectFloorTiles(layer); 
         this.collectFoodZones(layer);     
      });

      // Build waypoint grid for pathfinding based on 
      this._grid = new WaypointGrid(this._nodes, this._wallTiles);
      
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

   getCellsInFoodZone(foodZone: string): IFoodSpawnPoint[] {
      var validCells = this._foodSpawnPoints.filter((itm, idx) => {
         return itm.type === foodZone;
      });

      return validCells;
   }

   //TODO if we don't create a new WaypointGrid, the enemies spawn in at the current location of the existing enemies
   // the WaypointGrid is being modified in an unexpected fashion
   spawnEnemy() {
      var enemy = new Enemy(this._grid);// new WaypointGrid(this._floorTiles));
      this.enemies.push(enemy);
      this.add(enemy);
      SoundManager.playSpawnEnemy();
   }

   spawnFood(){
      // player is added to scene global context
      var foodArr = new Array<Food>();
      var rand = new ex.Random();

         var chosenFoodZones = rand.pickSet(FoodTypes, Config.foodSpawnCount);

         for (var i = 0; i < chosenFoodZones.length; i++){
            var chosenFoodZone = chosenFoodZones[i];
            var validTiles = this.getCellsInFoodZone(chosenFoodZone);
            var chosenCell = validTiles[rand.integer(0, validTiles.length - 1)];
            //make a dummy cell so we can easily get the center
            var cell = new ex.Cell(chosenCell.x, chosenCell.y, 24, 24, 0);
            var food = new Food(cell.getCenter().x, cell.getCenter().y, i);
            this.add(food);
            foodArr.push(food);
         }

      var shoppingList = new ShoppingList(foodArr);
      player.shoppingList = shoppingList;
   }
}