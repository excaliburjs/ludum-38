class Food extends ex.Actor {

   static foodSheet: ex.SpriteSheet = null;

   constructor(x, y, public shoppingListId, public foodZone: FoodZone) {
      super(x, y, Config.foodWidth, Config.foodHeight);
   }

   public onInitialize(engine: ex.Engine) {
      this.collisionType = ex.CollisionType.Passive;

      // init sprite sheet
      if (Food.foodSheet === null) {
         Food.foodSheet = new ex.SpriteSheet(
            Resources.foodSheet, 
            Config.foodSheetCols, 
            Config.foodSheetRows, 
            Config.foodWidth, 
            Config.foodHeight);
      }      
      
      // get zone index
      var zoneIdx = FoodTypes.indexOf(this.foodZone);

      // get rand food from zone (each column in sheet indexed by zone)
      // each row in sheet is another type of food in that zone
      var foodIdx = gameRandom.integer(0, Config.foodSheetRows - 1);      
      var foodSprite = Food.foodSheet.getSprite(zoneIdx + foodIdx * Food.foodSheet.columns);

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