class Stats implements IPayload {
   date: string = "" 
   seed: number = 0; // seeded value
   started: number; // time
   timePlayed: number = 0; // amount of time played
   won: boolean = false; // won or lost
   enemiesOnScreen: number = 0; 
   foodCollected: string[] = [];
   playerPositions: IPosition[] = [];
   enemyPositions: IPosition[] = [];

   private _playerSample: number = 0;
   private _enemySample: number = 0;
   
   public captureEndGameAndPublish(){
      this.seed = gameRandom.seed;
      this.foodCollected = State.collectedFood.map(f => {
         return f.foodZone
      });

      this.enemiesOnScreen = scnMain.enemies.length;

      this.won = State.gameOverCheckout && player.shoppingList.hasCollectedAllFood;

      Analytics.publish(this);

   }

   public samplePlayer(delta: number){
      this._playerSample += delta;
      if(this._playerSample > Config.playerSample){
         this._playerSample = 0;
         this.playerPositions.push({x: player.pos.x, y: player.pos.y});
      }
   }

   public sampleEnemy(delta: number) {
      this._enemySample += delta;
      if(this._enemySample > Config.enemySample){
         this._enemySample = 0;  
         scnMain.enemies.forEach(e => {
            this.enemyPositions.push({x: e.pos.x, y: e.pos.y});
         });

      }
   }





}