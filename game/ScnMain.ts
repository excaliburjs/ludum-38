/// <reference path="./Player.ts" />
/// <reference path="./Food.ts" />
/// <reference path="./Enemy.ts" />



class ScnMain extends ex.Scene {
   /**
    * The main scene for the game
    */
   constructor(engine: ex.Engine) {
      super(engine);
      var player = new Player(Config.playerStart.x, Config.playerStart.y);
      this.add(player)

      var food = new Food(100, 100);
      this.add(food);

      var enemy = new Enemy(300, 300);
      this.add(enemy);
   }

   public onInitialize(engine: ex.Engine) {
      
   }
}