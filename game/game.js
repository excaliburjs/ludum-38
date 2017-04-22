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
var Player = (function (_super) {
    __extends(Player, _super);
    /**
     * Build the player for the game
     */
    function Player(x, y, shoppingList) {
        var _this = _super.call(this, x, y, Config.playerWidth, Config.playerHeight) || this;
        _this.shoppingList = shoppingList;
        _this.addDrawing(Resources.playerSheet);
        return _this;
    }
    Player.prototype.onInitialize = function (engine) {
        var _this = this;
        game.input.keyboard.on('hold', function (keyHeld) {
            switch (keyHeld.key) {
                case ex.Input.Keys.Up:
                case ex.Input.Keys.W:
                    _this.vel.setTo(_this.vel.x, -Config.playerVel);
                    break;
                case ex.Input.Keys.Down:
                case ex.Input.Keys.S:
                    _this.vel.setTo(_this.vel.x, Config.playerVel);
                    break;
                case ex.Input.Keys.Left:
                case ex.Input.Keys.A:
                    _this.vel.setTo(-Config.playerVel, _this.vel.y);
                    break;
                case ex.Input.Keys.Right:
                case ex.Input.Keys.D:
                    _this.vel.setTo(Config.playerVel, _this.vel.y);
                    break;
            }
            _this.collisionType = ex.CollisionType.Passive;
            _this.on('collision', function (e) {
                if (e.other instanceof Enemy) {
                    ex.Logger.getInstance().info('game over');
                }
            });
        });
        this.on('postupdate', function (evt) {
            _this.vel.setTo(0, 0);
        });
    };
    Player.prototype.raycast = function (ray) {
    };
    return Player;
}(ex.Actor));
var Resources = {
    map: new Extensions.Tiled.TiledResource('assets/map.json'),
    playerSheet: new ex.Texture('img/player.png'),
    foodSheet: new ex.Texture('img/food.png'),
    enemySheet: new ex.Texture('img/enemy.png')
};
var Config = {
    gameWidth: 720,
    gameHeight: 720,
    playerStart: new ex.Vector(0, 0),
    playerWidth: 50,
    playerHeight: 50,
    playerVel: 100,
    enemyWidth: 50,
    enemyHeight: 50,
    enemyRayCastAngle: Math.PI / 4,
    enemyRayLength: 200,
    enemyRayCount: 5,
    foodWidth: 100,
    foodHeight: 100
};
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
var Food = (function (_super) {
    __extends(Food, _super);
    function Food(x, y, shoppingListId) {
        var _this = _super.call(this, x, y, Config.foodWidth, Config.foodHeight) || this;
        _this.ShoppingListId = shoppingListId;
        _this.addDrawing(Resources.foodSheet);
        return _this;
    }
    return Food;
}(ex.Actor));
/// <reference path="../lib/excalibur-dist/excalibur.d.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    // todo need reference to the waypoint grid
    function Enemy(x, y) {
        var _this = _super.call(this, x, y, Config.enemyWidth, Config.enemyHeight) || this;
        _this.rays = [];
        _this.addDrawing(Resources.enemySheet);
        _this.actions.moveTo(x + 300, y, 20)
            .moveTo(x + 300, y - 100, 20)
            .moveTo(x, y - 100, 20)
            .moveTo(x, y, 20).repeatForever();
        _this.rays = new Array(Config.enemyRayCount);
        return _this;
    }
    Enemy.prototype.onInitialize = function (engine) {
        var _this = this;
        this.collisionType = ex.CollisionType.Passive;
        this.on('postupdate', function (evt) {
            // calculate the forward vector of enemy
            _this.forward = _this.vel.normalize();
            var forwardAngle = _this.vel.toAngle();
            var angleStep = Config.enemyRayCastAngle / Config.enemyRayCount;
            var angleStart = forwardAngle - (Config.enemyRayCastAngle / 2);
            for (var i = 0; i < Config.enemyRayCount; i++) {
                _this.rays[i] = new ex.Ray(ex.Vector.Zero.clone(), ex.Vector.fromAngle(angleStart + angleStep * i).scale(Config.enemyRayLength));
            }
        });
        // set this to postdebugdraw on production
        this.on('postdraw', function (evt) {
            for (var _i = 0, _a = _this.rays; _i < _a.length; _i++) {
                var ray = _a[_i];
                // Re-calc distance for debug only
                ex.Util.DrawUtil.vector(evt.ctx, ex.Color.Red, ex.Vector.Zero.clone(), ray.dir, Config.enemyRayLength);
            }
        });
    };
    Enemy.prototype.rayCastForPlayer = function (player) {
    };
    return Enemy;
}(ex.Actor));
/// <reference path="./Player.ts" />
/// <reference path="./Food.ts" />
/// <reference path="./Enemy.ts" />
var ScnMain = (function (_super) {
    __extends(ScnMain, _super);
    /**
     * The main scene for the game
     */
    function ScnMain(engine) {
        return _super.call(this, engine) || this;
    }
    ScnMain.prototype.onInitialize = function (engine) {
        var map = Resources.map.getTileMap();
        this.add(map);
        var food = new Food(100, 100, "test");
        this.add(food);
        var foodArr = new Array();
        foodArr.push(food);
        var shoppingList = new ShoppingList(foodArr);
        var player = new Player(Config.playerStart.x, Config.playerStart.y, shoppingList);
        this.add(player);
        var enemy = new Enemy(300, 300);
        this.add(enemy);
    };
    return ScnMain;
}(ex.Scene));
var ShoppingList = (function () {
    function ShoppingList(items) {
        this.items = items;
    }
    ShoppingList.prototype.removeItem = function (id) {
        if (this.items && this.items.length) {
            var idxsToRemove = this.items.map(function (obj, index) {
                if (obj.ShoppingListId == id) {
                    return index;
                }
            });
            if (idxsToRemove && idxsToRemove.length) {
                this.items.splice(idxsToRemove[0], 1);
            }
        }
    };
    return ShoppingList;
}());
/// <reference path="../lib/excalibur-tiled/dist/excalibur-tiled.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />
/// <reference path="Stats.ts" />
/// <reference path="ScnMain.ts" />
/// <reference path="Food.ts" />
/// <reference path="ShoppingList.ts" />
var game = new ex.Engine({
    width: Config.gameWidth,
    height: Config.gameHeight,
    canvasElementId: "game",
});
// turn off anti-aliasing
game.setAntialiasing(false);
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