class Director extends ex.Actor {

   private _showGroceryListTimer: ex.Timer;
   private _spawnFoodTimer: ex.Timer;
   private _spawnFirstEnemyTimer: ex.Timer;

   public setup() {
      ex.Logger.getInstance().info('director setup');

      this._showGroceryListTimer = new ex.Timer(() => {
         this._showGroceryList();
      }, Config.groceryListTime);
      scnMain.add(this._showGroceryListTimer);

      this._spawnFoodTimer = new ex.Timer(() => {
         this._spawnFood();
      }, Config.spawnFoodTime);
      scnMain.add(this._spawnFoodTimer);

      this._spawnFirstEnemyTimer = new ex.Timer(() => {
         this._spawnFirstEnemy();
      }, Config.spawnFirstEnemyTime);
      scnMain.add(this._spawnFirstEnemyTimer);
   }

   //1. start zoomed in on player, zoom out
   // public zoomOut() {
      // zooming is broken
   // }

   //2. display grocery list
   private _showGroceryList() {
      console.log('show grocery list');
      //TODO
   }


   //3. spawn in food
   private _spawnFood() {
      scnMain.spawnFood();
   }

   //4. the first antagonist arrives
   private _spawnFirstEnemy() {
      scnMain.spawnEnemy();
   }

   //4b. add more antagonists

   //5. checkout - game ends
   public gameOver() {
      // already called (could be triggered multiple times)
      if (State.gameOver) return;

      ex.Logger.getInstance().info('game over');
      State.gameOver = true;
   }
   
}