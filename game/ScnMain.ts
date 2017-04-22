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
      })
      
      // player is added to scene global context
      var food = new Food(100, 100, "test");
      this.add(food);
      var foodArr = new Array<Food>();
      foodArr.push(food);
      var shoppingList = new ShoppingList(foodArr);

      var player = new Player(Config.playerStart.x, Config.playerStart.y, shoppingList);
      this.add(player)

      var enemy = new Enemy(300, 300);
      this.enemies.push(enemy);
      this.add(enemy);
   }
}