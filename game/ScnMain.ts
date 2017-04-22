const LAYER_IMPASSABLE = 'Impassable'

class ScnMain extends ex.Scene {
   /**
    * The main scene for the game
    */
   constructor(engine: ex.Engine) {
      super(engine);            
   }


   public enemies: Enemy[] = [];

   public onInitialize(engine: ex.Engine) {
      var map = Resources.map.getTileMap();
      this.add(map);
      
      Resources.map.data.layers.filter(l => l.name === LAYER_IMPASSABLE).forEach(l => {
         if (typeof l.data == 'string') return;

         for (let i = 0; i < l.data.length; i++) {
            if (l.data[i] !== 0) {
               map.data[i].solid = true;
            }
         }
      });


      // get all tiles where placing food should be allowed 
      var floorTiles = new Array<ex.Cell>();
      Resources.map.data.layers.filter(l => l.name !== LAYER_IMPASSABLE).forEach( l => {
         if (typeof l.data == 'string') return;

         for (let i = 0; i < l.data.length; i++) {
            if (l.data[i] !== 0) {
               if (! map.data[i].solid){
                  floorTiles.push(map.data[i]);
               }
            }
         }
      })

      // Build waypoint grid for pathfinding based on 
      var grid = new WaypointGrid(floorTiles);
      
      // player is added to scene global context
      var foodArr = new Array<Food>();
      var rand = new ex.Random();

      for(var i = 0; i < Config.foodSpawnCount; i++){
         var randomCell = floorTiles[rand.integer(0, floorTiles.length - 1)];
         var food = new Food(randomCell.getCenter().x, randomCell.getCenter().y, i);
         this.add(food);
         foodArr.push(food);
      }
      var shoppingList = new ShoppingList(foodArr);
      player.shoppingList = shoppingList;

      var enemy = new Enemy(grid);
      this.enemies.push(enemy);
      this.add(enemy);
   }
}