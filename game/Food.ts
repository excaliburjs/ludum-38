class Food extends ex.Actor {
   /**
    *
    */
   constructor(x, y) {
      super(x, y, Config.foodWidth, Config.foodHeight);
      this.addDrawing(Resources.foodSheet);
   }

}