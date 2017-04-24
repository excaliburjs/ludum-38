class Food extends ex.Actor {

   static foodSheet: ex.SpriteSheet = null;
   static bwFoodSheet: ex.SpriteSheet = null;

   public spriteIndex: number;

   constructor(x, y, public shoppingListId, public foodZone: FoodZone) {
      super(x, y, Config.foodWidth, Config.foodHeight);
      // get zone index
      var zoneIdx = FoodTypes.indexOf(this.foodZone);

      // init sprite sheet
      if (Food.foodSheet === null) {
         Food.foodSheet = new ex.SpriteSheet(
            Resources.foodSheet, 
            Config.foodSheetCols, 
            Config.foodSheetRows, 
            Config.foodWidth, 
            Config.foodHeight);
      }

      //bw init sprite sheet
      if (Food.bwFoodSheet === null) {
         Food.bwFoodSheet = new ex.SpriteSheet(
            Resources.bwFoodSheet, 
            Config.foodSheetCols, 
            Config.foodSheetRows, 
            Config.foodWidth, 
            Config.foodHeight);
      }   

      // get rand food from zone (each column in sheet indexed by zone)
      // each row in sheet is another type of food in that zone
      var foodIdx = gameRandom.integer(0, Config.foodSheetRows - 1);
      this.spriteIndex = zoneIdx + foodIdx * Food.foodSheet.columns 
   }

   public onInitialize(engine: ex.Engine) {
      this.collisionType = ex.CollisionType.Passive;
           
      var foodSprite = Food.foodSheet.getSprite(this.spriteIndex);

      this.addDrawing(foodSprite);

      var delay = gameRandom.integer(0, 700);
      
      this.actions
         .delay(delay)
         .easeTo(this.x, this.y - 5, 750)
         .easeTo(this.x, this.y, 750)
         .repeatForever();

      ex.Logger.getInstance().info('New food. Zone:', this.foodZone, 'anim delay:', delay);
   }

}