class Player extends ex.Actor {
   /**
    * Build the player for the game
    */
   constructor(x, y) {
      super(x, y, Config.playerWidth, Config.playerHeight);
   }

   public shoppingList : ShoppingList;
   public disableMovement: boolean = false;

   public _leftDrawing: ex.Sprite;
   private _selectSprite: ex.Sprite;

   public onInitialize(engine: ex.Engine) {
      this._setupDrawing();

      this.collisionType = ex.CollisionType.Active;

      this._selectSprite = Resources.playerSelect.asSprite();
      
      game.input.keyboard.on('hold', (keyHeld?: ex.Input.KeyEvent) => {
         if (!State.gameOver) {
            if (player.disableMovement) return;

            switch(keyHeld.key) {
               case ex.Input.Keys.Up :
               case ex.Input.Keys.W :
                  this.vel.setTo(this.vel.x, -Config.playerVel);
                  player.setDrawing('walkUp');
                  break;
               case ex.Input.Keys.Down :
               case ex.Input.Keys.S :
                  this.vel.setTo(this.vel.x, Config.playerVel);
                  player.setDrawing('walkDown');
                  break;
               case ex.Input.Keys.Left :
               case ex.Input.Keys.A :
                  this.vel.setTo(-Config.playerVel, this.vel.y);
                  player.setDrawing('walkLeft');
                  break;
               case ex.Input.Keys.Right :
               case ex.Input.Keys.D :
                  this.vel.setTo(Config.playerVel, this.vel.y);
                  player.setDrawing('walkRight');
                  break;
            }
         }
      });

      game.input.keyboard.on('up', (keyUp?: ex.Input.KeyEvent) => {
         if (!State.gameOver) {
            switch(keyUp.key) {
               case ex.Input.Keys.Up :
               case ex.Input.Keys.W :
                  player.setDrawing('up');
                  break;
               case ex.Input.Keys.Down :
               case ex.Input.Keys.S :
                  this.vel.setTo(this.vel.x, Config.playerVel);
                  player.setDrawing('down');
                  break;
               case ex.Input.Keys.Left :
               case ex.Input.Keys.A :
                  player.setDrawing('left');
                  break;
               case ex.Input.Keys.Right :
               case ex.Input.Keys.D :
                  player.setDrawing('right');
                  break;
            }
         }
      });

      this.on('collision', (e?: ex.CollisionEvent) => {
         if (!State.gameOver) {
            if (e.other instanceof Enemy) {
               director.gameOver(e.other);
            } else if (e.other instanceof Food) {
               player.shoppingList.removeItem(e.other.shoppingListId);
               e.other.kill();
               e.other.collisionType = ex.CollisionType.PreventCollision;
               Resources.pickupSound.play();
            }
         }
      });

      this.on('postupdate', (evt: ex.PostUpdateEvent) => {
         this.vel.setTo(0, 0);
      });

      this.on('postdraw', (evt: ex.PostDrawEvent) => {
         this._selectSprite.draw(evt.ctx, -this._selectSprite.naturalWidth / 2, this._selectSprite.naturalHeight / 2);
      });
   }

   public raycast(ray: ex.Ray, clip: number): boolean {
      return this.getBounds().rayCast(ray, clip);
   }

   private _setupDrawing() {
      var playerSheet = new ex.SpriteSheet(director.getCharSprite(), 10, 1, 45, 45);
      var downSprite = playerSheet.getSprite(0);
      var upSprite = playerSheet.getSprite(3);
      var leftSprite = playerSheet.getSprite(7);
      var righSprite = playerSheet.getSprite(9);

      downSprite.anchor.setTo(0, 0.2);
      upSprite.anchor.setTo(0, 0.2);
      leftSprite.anchor.setTo(0, 0.2);
      righSprite.anchor.setTo(0, 0.2);

      this.addDrawing('down', downSprite);
      this.addDrawing('up', upSprite);
      this.addDrawing('left', leftSprite);
      this.addDrawing('right', righSprite);

      this._leftDrawing = playerSheet.getSprite(9); //for game over screen

      // var walkDownAnim = playerSheet.getAnimationBetween(game, 0, 4, 180);
      var walkDownAnim = playerSheet.getAnimationByIndices(game, [0, 1, 0, 2], 180)
      walkDownAnim.loop = true;
      walkDownAnim.anchor.setTo(0, 0.2);
      this.addDrawing('walkDown', walkDownAnim);

      // var walkUpAnim = playerSheet.getAnimationBetween(game, 4,8, 180);
      var walkUpAnim = playerSheet.getAnimationByIndices(game, [3, 4, 3, 5], 180);
      walkUpAnim.loop = true;
      walkUpAnim.anchor.setTo(0, 0.2);
      this.addDrawing('walkUp', walkUpAnim);

      var walkLeftAnim = playerSheet.getAnimationByIndices(game, [7,6], 200);
      walkLeftAnim.loop = true;
      walkLeftAnim.anchor.setTo(0, 0.2);
      this.addDrawing('walkLeft', walkLeftAnim);

      var walkRightAnim = playerSheet.getAnimationByIndices(game, [9,8], 200);
      walkRightAnim.loop = true;
      walkRightAnim.anchor.setTo(0, 0.2);
      this.addDrawing('walkRight', walkRightAnim);
      
      this.setDrawing('down');
   }
  

   public raycastTime(ray: ex.Ray, clip: number): number {
      return this.getBounds().rayCastTime(ray, clip);
   }
  
}