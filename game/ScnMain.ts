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
      
      // player is added to scene global context
      Resources.map.data.layers.filter(l => l.name === LAYER_IMPASSABLE).forEach(l => {
         if (typeof l.data == 'string') return;

         for (let i = 0; i < l.data.length; i++) {
            if (l.data[i] !== 0) {
               map.data[i].solid = true;
            }
         }
      })
      
      // player is added to scene global context
      var foodArr = new Array<Food>();
      var rand = new ex.Random();

      for(var i = 0; i < Config.foodSpawnCount; i++){
         var food = new Food(rand.integer(0, game.canvasWidth), rand.integer(0, game.canvasHeight), i);
         this.add(food);
         foodArr.push(food);
      }
      var shoppingList = new ShoppingList(foodArr);
      player.shoppingList = shoppingList;

      var enemy = new Enemy(300, 300);
      this.enemies.push(enemy);
      this.add(enemy);
   }
}