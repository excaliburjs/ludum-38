const LAYER_IMPASSABLE = 'Impassable'

class ScnMain extends ex.Scene {

   private _grid: WaypointGrid;
   private _floorTiles;

   constructor(engine: ex.Engine) {
      super(engine);            
   }


   public enemies: Enemy[] = [];

   public onInitialize(engine: ex.Engine) {
      var map = Resources.map.getTileMap();
      this.add(map);
      
      Resources.map.data.layers.filter(l => l.name === LAYER_IMPASSABLE).forEach(l => {
         if (typeof l.data == 'string') return;
         if (!l.data) return;

         for (let i = 0; i < l.data.length; i++) {
            if (l.data[i] !== 0) {
               map.data[i].solid = true;
            }
         }
      });


      // get all tiles where placing food should be allowed 
      this._floorTiles = new Array<ex.Cell>();
      Resources.map.data.layers.filter(l => l.name !== LAYER_IMPASSABLE).forEach( l => {
         if (typeof l.data == 'string') return;
         if (!l.data) return;
         
         for (let i = 0; i < l.data.length; i++) {
            if (l.data[i] !== 0) {
               if (! map.data[i].solid){
                  this._floorTiles.push(map.data[i]);
               }
            }
         }
      })

      // Build waypoint grid for pathfinding based on 
      this._grid = new WaypointGrid(this._floorTiles);
      
      // player is added to scene global context
      var foodArr = new Array<Food>();
      var rand = new ex.Random();

      for(var i = 0; i < Config.foodSpawnCount; i++){
         var randomCell = this._floorTiles[rand.integer(0, this._floorTiles.length - 1)];
         var food = new Food(randomCell.getCenter().x, randomCell.getCenter().y, i);
         this.add(food);
         foodArr.push(food);
      }
      var shoppingList = new ShoppingList(foodArr);
      player.shoppingList = shoppingList;

      this.spawnEnemy();
   }

   //TODO if we don't create a new WaypointGrid, the enemies spawn in at the current location of the existing enemies
   // the WaypointGrid is being modified in an unexpected fashion
   spawnEnemy() {
      var enemy = new Enemy(this._grid);// new WaypointGrid(this._floorTiles));
      this.enemies.push(enemy);
      this.add(enemy);
      SoundManager.playSpawnEnemy();
   }
}