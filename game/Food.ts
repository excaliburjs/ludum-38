/// <reference path="../lib/excalibur-dist/excalibur.d.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />

class Food extends ex.Actor {
   /**
    *
    */
   constructor(x, y) {
      super(x, y, Config.foodWidth, Config.foodHeight);
      this.addDrawing(Resources.foodSheet);
   }

}