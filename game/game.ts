/// <reference path="../lib/excalibur-dist/excalibur-tiled.d.ts" />
/// <reference path="../node_modules/@types/zepto/index.d.ts" />
/// <reference path="../node_modules/@types/classnames/index.d.ts" />

/// <reference path="Player.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />
/// <reference path="State.ts" />
/// <reference path="Preferences.ts" />
/// <reference path="Stats.ts" />
/// <reference path="ScnMain.ts" />
/// <reference path="Food.ts" />
/// <reference path="Enemy.ts" />
/// <reference path="ShoppingList.ts" />
/// <reference path="WaypointGrid.ts" />
/// <reference path="WaypointNode.ts" />
/// <reference path="SoundManager.ts" />
/// <reference path="Director.ts" />
/// <reference path="Cashier.ts" />
/// <reference path="Analytics.ts" />
/// <reference path="Stats.ts" />



var game = new ex.Engine({
    width: Config.gameWidth,
    height: Config.gameHeight,
    canvasElementId: "game",
});

// initialize sound
loadPreferences();
SoundManager.init();

var gameDebug = false;

var gameRandom = new ex.Random(Date.now());

ex.Logger.getInstance().info(`Game seed ${gameRandom.seed}`);

var charSheets = [];

// create an asset loader
var loader = new ex.Loader();
for (var r in Resources) {
    loader.addResource(Resources[r]);

    if (r.search('charSheet') != -1) {
       charSheets.push(r);
    }
}

// randomize order of character sprites used
// var randCharSheets = gameRandom.pickSet(charSheets, charSheets.length, false); //TODO does not shuffle the order
var randCharSheets = gameRandom.shuffle(charSheets);
var randCharSheetIndex = 0;

var scnMain = new ScnMain(game);
game.addScene('main', scnMain);

// create the player in global context
var player = new Player(Config.playerStart.x, Config.playerStart.y);
scnMain.add(player);

var director = new Director();
scnMain.add(director);

var stats = new Stats();

//TODO Remove debug mode
var gamePaused = false;
game.input.keyboard.on('down', (keyDown?: ex.Input.KeyEvent) => {
    switch(keyDown.key) {
        case ex.Input.Keys.P : 
            if (gamePaused) {
                game.start();
                ex.Logger.getInstance().info('game resumed');
            } else {
                game.stop();
                ex.Logger.getInstance().info('game paused');
            }
            gamePaused = !gamePaused;
            break;
        case ex.Input.Keys.Semicolon :
            game.isDebug = !game.isDebug;
            break;
        case ex.Input.Keys.O : 
            gameDebug = !gameDebug
            break;
    }
});
// --------------------------------------- //

game.start(loader).then(() => {
   // turn off anti-aliasing
   game.setAntialiasing(false);
   game.goToScene('main');
   stats.startStats();

   SoundManager.startBackgroundMusic();
});