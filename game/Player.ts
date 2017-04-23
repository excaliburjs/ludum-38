class Player extends ex.Actor {
   /**
    * Build the player for the game
    */
   constructor(x, y) {
      super(x, y, Config.playerWidth, Config.playerHeight);
   }

   public shoppingList : ShoppingList;

   public onInitialize(engine: ex.Engine) {
      var playerSheet = new ex.SpriteSheet(Resources.playerSheet, 4, 1, 45, 45);
      this.addDrawing('down', playerSheet.getSprite(0));
      this.addDrawing('up', playerSheet.getSprite(1));
      this.addDrawing('left', playerSheet.getSprite(2));
      this.addDrawing('right', playerSheet.getSprite(3));
      
      this.setDrawing('down');

      this.collisionType = ex.CollisionType.Active;
      
      game.input.keyboard.on('hold', (keyHeld?: ex.Input.KeyEvent) => {
         if (!State.gameOver) {
            switch(keyHeld.key) {
               case ex.Input.Keys.Up :
               case ex.Input.Keys.W :
                  this.vel.setTo(this.vel.x, -Config.playerVel);
                  player.setDrawing('up');
                  break;
               case ex.Input.Keys.Down :
               case ex.Input.Keys.S :
                  this.vel.setTo(this.vel.x, Config.playerVel);
                  player.setDrawing('down');
                  break;
               case ex.Input.Keys.Left :
               case ex.Input.Keys.A :
                  this.vel.setTo(-Config.playerVel, this.vel.y);
                  player.setDrawing('left');
                  break;
               case ex.Input.Keys.Right :
               case ex.Input.Keys.D :
                  this.vel.setTo(Config.playerVel, this.vel.y);
                  player.setDrawing('right');
                  break;
            }
         }
      });

      this.on('collision', (e?: ex.CollisionEvent) => {
         if (!State.gameOver) {
            if (e.other instanceof Enemy) {
                  ex.Logger.getInstance().info('game over');
                  State.gameOver = true;
            } else if (e.other instanceof Food) {
               player.shoppingList.removeItem(e.other.ShoppingListId);
               e.other.kill();
               e.other.collisionType = ex.CollisionType.PreventCollision;
               console.log('spwan enemy for', e.other.id);
               scnMain.spawnEnemy();
            }
         }
      });

      this.on('postupdate', (evt: ex.PostUpdateEvent) => {
         this.vel.setTo(0, 0);
      });
   }


   public raycast(ray: ex.Ray, clip: number): boolean {
      return this.getBounds().rayCast(ray, clip);
   }
  
}