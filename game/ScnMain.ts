
class ScnMain extends ex.Scene {
   /**
    * The main scene for the game
    */
   constructor(engine: ex.Engine) {
      super(engine);            
   }

   public onInitialize(engine: ex.Engine) {
      var map = Resources.map.getTileMap();
      this.add(map);
      
      var food = new Food(100, 100, "test");
      this.add(food);
      var foodArr = new Array<Food>();
      foodArr.push(food);
      var shoppingList = new ShoppingList(foodArr);

      var player = new Player(Config.playerStart.x, Config.playerStart.y, shoppingList);
      this.add(player)

      var enemy = new Enemy(300, 300);
      this.add(enemy);
   }
}