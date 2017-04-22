class Player extends ex.Actor {
   /**
    * Build the player for the game
    */
   constructor(x, y, public shoppingList: ShoppingList) {
      super(x, y, Config.playerWidth, Config.playerHeight);
      this.addDrawing(Resources.playerSheet);
   }

   public onInitialize(engine: ex.Engine) {
      this.collisionType = ex.CollisionType.Active;
      
      game.input.keyboard.on('hold', (keyHeld?: ex.Input.KeyEvent) => {

         switch(keyHeld.key) {
            case ex.Input.Keys.Up :
            case ex.Input.Keys.W :
               this.vel.setTo(this.vel.x, -Config.playerVel);
               break;
            case ex.Input.Keys.Down :
            case ex.Input.Keys.S :
               this.vel.setTo(this.vel.x, Config.playerVel);
               break;
            case ex.Input.Keys.Left :
            case ex.Input.Keys.A :
               this.vel.setTo(-Config.playerVel, this.vel.y);
               break;
            case ex.Input.Keys.Right :
            case ex.Input.Keys.D :
               this.vel.setTo(Config.playerVel, this.vel.y);
               break;
         }
         
         this.on('collision', (e?: ex.CollisionEvent) => {
            if (e.other instanceof Enemy) {
               ex.Logger.getInstance().info('game over');
            }
         });

      });

      this.on('postupdate', (evt: ex.PostUpdateEvent) => {
         this.vel.setTo(0, 0);
      });
   }


   public raycast(ray: ex.Ray) {

   }

   

   
}