
class ShoppingList {
    constructor(public items: Array<Food>) {

    }

    public removeItem(id: string) {
       if(this.items && this.items.length){
         var idxsToRemove = this.items.map(function(obj, index) {
            if(obj.ShoppingListId == id) {
               return index;
            }
         });

         if(idxsToRemove && idxsToRemove.length){
               this.items.splice(idxsToRemove[0], 1)
         }
       }

    }  
}
