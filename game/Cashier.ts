class Cashier extends ex.Actor {
   
   public onInitialize(engine: ex.Engine) {
      this._setupDrawing();
   }

   private _setupDrawing() {
      var number = gameRandom.integer(1, 8).toString();
      var sprite = 'charSheet' + number;
      
      var playerSheet = new ex.SpriteSheet(Resources[sprite], 10, 1, 45, 45);
      this.addDrawing('down', playerSheet.getSprite(0));
      this.addDrawing('up', playerSheet.getSprite(3));
      this.addDrawing('left', playerSheet.getSprite(7));
      this.addDrawing('right', playerSheet.getSprite(9));

      // // var walkDownAnim = playerSheet.getAnimationBetween(game, 0, 4, 180);
      // var walkDownAnim = playerSheet.getAnimationByIndices(game, [0, 1, 0, 2], 180)
      // walkDownAnim.loop = true;
      // this.addDrawing('walkDown', walkDownAnim);

      // // var walkUpAnim = playerSheet.getAnimationBetween(game, 4,8, 180);
      // var walkUpAnim = playerSheet.getAnimationByIndices(game, [3, 4, 3, 5], 180);
      // walkUpAnim.loop = true;
      // this.addDrawing('walkUp', walkUpAnim);

      // var walkLeftAnim = playerSheet.getAnimationByIndices(game, [7,6], 200);
      // walkLeftAnim.loop = true;
      // this.addDrawing('walkLeft', walkLeftAnim);

      // var walkRightAnim = playerSheet.getAnimationByIndices(game, [9,8], 200);
      // walkRightAnim.loop = true;
      // this.addDrawing('walkRight', walkRightAnim);
      
      this.setDrawing('left');
   }
}