class Director extends ex.Actor {

   private _showGroceryListTimer: ex.Timer;
   private _spawnFoodTimer: ex.Timer;
   private _spawnFirstEnemyTimer: ex.Timer;
   private _diagIntro: ex.Actor;
   private _enemiesSpawned: number = 0;

   public onInitialize(){
      this.on('postupdate', this._update)
   }

   public setup() {
      ex.Logger.getInstance().info('director setup');

      this._diagIntro = new ex.Actor(player.getRight() + 10, player.y + 5, 175, 48);
      this._diagIntro.anchor.setTo(0, 1);
      this._diagIntro.addDrawing(Resources.diagIntro);
      scnMain.add(this._diagIntro);

      this._zoomOut().then(() => {
         this._diagIntro.kill();

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

         this.actions.delay(Config.spawnTimedEnemyTime).callMethod(() => {
            this._spawnTimedEnemy();
         })

      })
   }

   private _findMinimum<T>(nodes: T[], valueFunc: (node: T) => number): T {
      var minNode: T = null;
      var minValue: number = Infinity;
      for(var node of nodes){
         var val = valueFunc(node);
         if(val < minValue){
            minValue = val;
            minNode = node;
         }
      }
      return minNode;
   }

   private _update(evt: ex.PostUpdateEvent){
      if(scnMain.enemies && scnMain.enemies.length) {
         var closest = this._findMinimum(scnMain.enemies, (enemy) => {
            return player.pos.distance(enemy.pos);
         });

         var distanceToPlayer = player.pos.distance(closest.pos);
         if(distanceToPlayer < Config.enemyVignetteRadius) {
            vignette.visible = true;
            var segment = Config.enemyVignetteRadius / 4;
            var index = (3 -Math.floor(distanceToPlayer / segment)).toFixed(0);
            
            vignette.setDrawing('vignette' + index);

         } else {
            vignette.visible = false;
         }
      }
   }
   
   //1. start zoomed in on player, zoom out
   public _zoomOut() {
      player.disableMovement = true;
      scnMain.camera.zoom(3.5);
      
      return this.actions.delay(2000).asPromise().then(() => {
         return scnMain.camera.zoom(1, 3000);
      });
   }

   //2. display grocery list
   private _showGroceryList() {
      console.log('show grocery list');
      $('.playerShoppingList').show();
      player.disableMovement = false;
      //TODO
   }


   //3. spawn in food
   private _spawnFood() {
      scnMain.spawnFood();
   }

   //4. the first antagonist arrives
   private _spawnFirstEnemy() {
      this._enemiesSpawned++;
      scnMain.spawnEnemy(ENEMY_CHECKOUT_MODE);
   }

   //4b. add more antagonists
   private _spawnTimedEnemy() {
      
      var spawnTime = gameRandom.integer(Config.enemySpawnMinTime, Config.enemySpawnMaxTime);
      this.actions.delay(spawnTime).callMethod(() =>{
         if(State.gameOver || (this._enemiesSpawned > Config.enemySpawnMaximum)) return;
         this._enemiesSpawned++;
         scnMain.spawnEnemy(ENEMY_FOOD_MODE);
         this._spawnTimedEnemy();
      });
   }

   //5. checkout - game ends
   public checkout() {
      // already called (could be triggered multiple times)
      if (State.gameOver) return; 

      State.gameOverCheckout = true;

      this._handleGameOver();
   }

   public gameOver(enemy: Enemy) {
      // already called (could be triggered multiple times)
      if (State.gameOver) return;      

      State.gameOverEnemy = true;

      // TODO handle enemy (show on dialog? orchestrate cut scene?)
      this._handleGameOver();
   }
   
   private _handleGameOver() {
      ex.Logger.getInstance().info('game over');
      State.gameOver = true;

      player.shoppingList.handleGameOver();

      $('#game-over-dialog').show();

      $('#game-over-summary-collect').toggleClass('done', player.shoppingList.isEmpty);
      $('#game-over-summary-avoid').toggleClass('done', !State.gameOverEnemy);
      $('#game-over-summary-checkout').toggleClass('done', State.gameOverCheckout);
   }
}