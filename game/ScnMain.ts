
class ScnMain extends ex.Scene {
   /**
    * The main scene for the game
    */
   constructor(engine: ex.Engine) {
      super(engine);
      var player = new Player(Config.playerStart.x, Config.playerStart.y);
      this.add(player)

      var food = new Food(100, 100, "test");
      this.add(food);
      var foodArr = new Array<Food>();
      foodArr.push(food);
      var shoppingList = new ShoppingList(foodArr);

   }

   public onInitialize(engine: ex.Engine) {
      
   }
}