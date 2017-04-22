var Preferences = {
   muteBackgroundMusic: false,
   muteAll: false
}
var _origPreferences = { ...Preferences };

function resetPreferences() {
   Preferences = { ..._origPreferences };
}

function savePreferences() {
   store.set('pref', Preferences);
}

function loadPreferences() {

   // overwrite but allow new properties
   Preferences = $.extend({}, Preferences, store.get('pref'));
}