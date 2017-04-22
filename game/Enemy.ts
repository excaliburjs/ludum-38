/// <reference path="../lib/excalibur-dist/excalibur.d.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />

class Enemy extends ex.Actor {

   public rays: ex.Ray[] = [];
   public originalRays: ex.Ray[] = [];
   public forward: ex.Vector;

   // todo need reference to the waypoint grid

   constructor(x, y) {
      super(x, y, Config.enemyWidth, Config.enemyHeight);
      this.addDrawing(Resources.enemySheet);
      
   }

   onInitialize(engine: ex.Engine) {
      this.on('postupdate', (evt: ex.PostUpdateEvent) => {
         // calculate the forward vector of enemy
      });
   }

}