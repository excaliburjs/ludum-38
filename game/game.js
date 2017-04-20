var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Resources = {};
var Config = {
    gameWidth: 800,
    gameHeight: 600
};
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
var ScnMain = (function (_super) {
    __extends(ScnMain, _super);
    function ScnMain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScnMain.prototype.onInitialize = function (engine) {
    };
    return ScnMain;
}(ex.Scene));
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
game.input.keyboard.on('down', function (keyDown) {
    switch (keyDown.key) {
        case ex.Input.Keys.P:
            if (gamePaused) {
                game.start();
                ex.Logger.getInstance().info('game resumed');
            }
            else {
                game.stop();
                ex.Logger.getInstance().info('game paused');
            }
            gamePaused = !gamePaused;
            break;
        case ex.Input.Keys.Semicolon:
            game.isDebug = !game.isDebug;
            break;
    }
});
// --------------------------------------- //
game.start(loader).then(function () {
    game.goToScene('main');
});
