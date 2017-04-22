/// <reference path="../lib/excalibur-dist/excalibur.d.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />

class Player extends ex.Actor {
   /**
    * Build the player for the game
    */
   constructor(x, y) {
      super(x, y, Config.playerWidth, Config.playerHeight);
      this.addDrawing(Resources.playerSheet);
   }

   public onInitialize(engine: ex.Engine) {
       game.input.keyboard.on('hold', (keyHeld?: ex.Input.KeyEvent) => {
            
            switch(keyHeld.key) {
               case ex.Input.Keys.Up :
               case ex.Input.Keys.W :
                  this.vel.setTo(0, -Config.playerVel)
                  break;
               case ex.Input.Keys.Down :
               case ex.Input.Keys.S :
                  this.vel.setTo(0, Config.playerVel)
                  break;
               case ex.Input.Keys.Left :
               case ex.Input.Keys.A :
                  this.vel.setTo(-Config.playerVel, 0)
                  break;
               case ex.Input.Keys.Right :
               case ex.Input.Keys.D :
                  this.vel.setTo(Config.playerVel, 0)
                  break;
               // default :
               //     ex.Logger.getInstance().info('unknown key pressed');
            }
            
        });

      this.on('postupdate', (evt: ex.PostUpdateEvent) => {
         this.vel.setTo(0, 0);
      });
   }

   

   
}