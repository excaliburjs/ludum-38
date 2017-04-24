const SHOPPING_TEXT_GET_FOOD = 'Need to get:'
const SHOPPING_TEXT_CHECKOUT = 'Time to checkout!'

class ShoppingList {
    constructor(items: Food[]) {
      State.uncollectedFood = items;
      State.collectedFood = new Array<Food>(items.length);
    }

    public get isEmpty() {
       return State.uncollectedFood.filter(
          i => i === undefined).length === Config.foodSpawnCount;
    }

    public get collectedFood() {
       return State.collectedFood.filter(f => f !== undefined);
    }

    public removeItem(id: string) {
       if(State.uncollectedFood && State.uncollectedFood.length){
         var idxsToRemove = State.uncollectedFood.map(function(obj, index) {
            if(obj && obj.shoppingListId == id) {
               return index;
            }
         }).filter(i => i !== undefined);

         if(idxsToRemove && idxsToRemove.length) {
            var idx = idxsToRemove[0];
            var removedFood = State.uncollectedFood[idx];
            State.uncollectedFood[idx] = undefined;
            State.collectedFood[idx] = removedFood;
            this.updateUI();
         }
       }
    }  

    public getFoodLeft() : Food[] {
       return State.uncollectedFood.filter(f => {
          return !!f;
       });
    }

    static typewriter(text: string, target: string, speed: number) {
      var progress: string = '';
      var len = text.length;
      var pos = 0;
      var typer: number;

      if ($(target).text() === text) return;

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

      if (this.collectedFood.length !== Config.foodSpawnCount) {
         ShoppingList.typewriter(SHOPPING_TEXT_GET_FOOD, '#shop-message', 90);
      } else {
         ShoppingList.typewriter(SHOPPING_TEXT_CHECKOUT, '#shop-message', 90);         
      }

       for (let i = 0; i < State.collectedFood.length; i++) {
          if (!State.collectedFood[i]) {
            var bwSprite = <any>Food.bwFoodSheet.getSprite(State.uncollectedFood[i].spriteIndex);
            var bwSpriteCanvas = bwSprite._spriteCanvas.toDataURL();

            $('#item' + (i + 1)).css("background-image", "url('" + bwSpriteCanvas + "'");

          } else {

            var colSprite = <any>Food.foodSheet.getSprite(State.collectedFood[i].spriteIndex);
            var colSpriteCanvas = colSprite._spriteCanvas.toDataURL();

            $('#item' + (i + 1)).css("background-image", "url('" + colSpriteCanvas + "'");
          }
       }
    }

    public handleGameOver() {

       // move shopping list to game over dialog (hacky!)
       $('#game-over-shopping-list').append($('#shopping-list'))

       for (let i = 0; i < State.collectedFood.length; i++) {
         let foodArr = State.collectedFood[i] ? State.collectedFood : State.uncollectedFood;          
         var bwSprite = <any>Food.bwFoodSheet.getSprite(foodArr[i].spriteIndex);
         var bwSpriteCanvas = bwSprite._spriteCanvas.toDataURL();

         $('#item' + (i + 1)).css("background-image", "url('" + bwSpriteCanvas + "'");
       }

       var collectedFood = this.collectedFood;
       var currIdx = 0;

       var timer = setInterval(function () {
          if (currIdx === collectedFood.length) {
             clearInterval(timer);

             // play register sound if player collected all food
             if (collectedFood.length > 0) {
                setTimeout(() => Resources.registerSound.play(), 350);
             }
             return;
          }

          var food = collectedFood[currIdx];
          var colSprite = <any>Food.foodSheet.getSprite(food.spriteIndex);
          var colSpriteCanvas = colSprite._spriteCanvas.toDataURL();

          $('#item' + (State.collectedFood.indexOf(food) + 1)).css("background-image", "url('" + colSpriteCanvas + "'");
          
          Resources.checkoutSound.play();          
          
          currIdx++;
       }, 700);
         
       
    }
}
