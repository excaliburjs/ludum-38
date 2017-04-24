const SHOPPING_TEXT_GET_FOOD = 'Need to get:'
const SHOPPING_TEXT_CHECKOUT = 'Time to checkout!'

class ShoppingList {
   private _collectedFood: Food[] = [];

    constructor(public items: Food[]) {
      this._collectedFood = new Array<Food>(items.length);
    }

    public removeItem(id: string) {
       if(this.items && this.items.length){
         var idxsToRemove = this.items.map(function(obj, index) {
            if(obj && obj.shoppingListId == id) {
               return index;
            }
         }).filter(i => i !== undefined);

         if(idxsToRemove && idxsToRemove.length) {
            var idx = idxsToRemove[0];
            var removedFood = this.items[idx];
            this.items[idx] = undefined;
            this._collectedFood[idx] = removedFood;
            this.updateUI();
         }
       }
    }  

    public getFoodLeft() : Food[] {
       return this.items.filter(f => {
          return !!f;
       });
    }

    static typewriter(text: string, target: string, speed: number) {
      var progress: string = '';
      var len = text.length;
      var pos = 0;
      var typer: number;

      var type = function () {
         if (progress === text) {
            return clearInterval(typer);            
         };

         progress = progress + text[pos];
         $(target).text(progress);
         pos++;
      };

      typer = setInterval(type, speed);
    }

    public updateUI() {

      var collectedFood = this._collectedFood.filter(f => f !== undefined);

      if (collectedFood.length !== Config.foodSpawnCount) {
         ShoppingList.typewriter(SHOPPING_TEXT_GET_FOOD, '#shop-message', 90);
      } else {
         ShoppingList.typewriter(SHOPPING_TEXT_CHECKOUT, '#shop-message', 90);         
      }

       for (let i = 0; i < this._collectedFood.length; i++) {
          if (!this._collectedFood[i]) {
            var bwSprite = <any>Food.bwFoodSheet.getSprite(this.items[i].spriteIndex);
            var bwSpriteCanvas = bwSprite._spriteCanvas.toDataURL();

            $('#item' + (i + 1)).css("background-image", "url('" + bwSpriteCanvas + "'");

          } else {

            var colSprite = <any>Food.foodSheet.getSprite(this._collectedFood[i].spriteIndex);
            var colSpriteCanvas = colSprite._spriteCanvas.toDataURL();

            $('#item' + (i + 1)).css("background-image", "url('" + colSpriteCanvas + "'");
          }
       }
    }
}
