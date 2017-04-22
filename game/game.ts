/// <reference path="../lib/excalibur-dist/excalibur.d.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />
/// <reference path="Stats.ts" />
/// <reference path="ScnMain.ts" />

var game = new ex.Engine({
    width: Config.gameWidth,
    height: Config.gameHeight,
    canvasElementId: "game",
});

// create an asset loader
var loader = new ex.Loader();
for (var r in Resources) {
    loader.addResource(Resources[r]);
}

var scnMain = new ScnMain(game);
game.addScene('main', scnMain);

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
    }
});
// --------------------------------------- //

game.start(loader).then(() => {
    game.goToScene('main');
});