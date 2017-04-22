class Food extends ex.Actor {
   /**
    *
    */
   public ShoppingListId : string;

   constructor(x, y, shoppingListId){
      super(x, y, Config.foodWidth, Config.foodHeight);
      this.ShoppingListId = shoppingListId;
      this.addDrawing(Resources.foodSheet);
   }

}