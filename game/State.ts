var State = {
   gameOver: false   
}
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