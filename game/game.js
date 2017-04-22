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
var Resources = {
    playerSheet: new ex.Texture('img/player.png'),
    foodSheet: new ex.Texture('img/food.png')
};
var Config = {
    gameWidth: 800,
    gameHeight: 600,
    playerStart: new ex.Vector(0, 0),
    playerWidth: 50,
    playerHeight: 50,
    playerVel: 100,
    foodWidth: 100,
    foodHeight: 100
};
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
/// <reference path="../lib/excalibur-dist/excalibur.d.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />
var Player = (function (_super) {
    __extends(Player, _super);
    /**
     * Build the player for the game
     */
    function Player(x, y) {
        var _this = _super.call(this, x, y, Config.playerWidth, Config.playerHeight) || this;
        _this.addDrawing(Resources.playerSheet);
        return _this;
    }
    Player.prototype.onInitialize = function (engine) {
        var _this = this;
        game.input.keyboard.on('hold', function (keyHeld) {
            switch (keyHeld.key) {
                case ex.Input.Keys.Up:
                case ex.Input.Keys.W:
                    _this.vel.setTo(0, -Config.playerVel);
                    break;
                case ex.Input.Keys.Down:
                case ex.Input.Keys.S:
                    _this.vel.setTo(0, Config.playerVel);
                    break;
                case ex.Input.Keys.Left:
                case ex.Input.Keys.A:
                    _this.vel.setTo(-Config.playerVel, 0);
                    break;
                case ex.Input.Keys.Right:
                case ex.Input.Keys.D:
                    _this.vel.setTo(Config.playerVel, 0);
                    break;
            }
        });
        this.on('postupdate', function (evt) {
            _this.vel.setTo(0, 0);
        });
    };
    return Player;
}(ex.Actor));
/// <reference path="../lib/excalibur-dist/excalibur.d.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />
var Food = (function (_super) {
    __extends(Food, _super);
    /**
     *
     */
    function Food(x, y) {
        var _this = _super.call(this, x, y, Config.foodWidth, Config.foodHeight) || this;
        _this.addDrawing(Resources.foodSheet);
        return _this;
    }
    return Food;
}(ex.Actor));
/// <reference path="./Player.ts" />
/// <reference path="./Food.ts" />
var ScnMain = (function (_super) {
    __extends(ScnMain, _super);
    /**
     * The main scene for the game
     */
    function ScnMain() {
        var _this = _super.call(this) || this;
        var player = new Player(Config.playerStart.x, Config.playerStart.y);
        _this.add(player);
        var food = new Food(100, 100);
        _this.add(food);
        return _this;
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
