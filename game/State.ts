var State = {
   gameOver: false,
   gameOverCheckout: false,
   gameOverEnemy: false,
   uncollectedFood: <Food[]>[],
   collectedFood: <Food[]>[]
};

var _origState = { ...State };

function resetState() {
   State = { ..._origState };   
}

function saveState() {
   store.set('game', State);
}

function loadState() {
   State = $.extend({}, State, store.get('game'));
}