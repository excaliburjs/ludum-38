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
    function Player(x, y) {
        var _this = _super.call(this, x, y, Config.playerWidth, Config.playerHeight) || this;
        _this.addDrawing(Resources.playerSheet);
        return _this;
    }
    Player.prototype.onInitialize = function (engine) {
        var _this = this;
        this.collisionType = ex.CollisionType.Active;
        game.input.keyboard.on('hold', function (keyHeld) {
            if (!State.gameOver) {
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
            }
        });
        this.on('collision', function (e) {
            if (!State.gameOver) {
                if (e.other instanceof Enemy) {
                    ex.Logger.getInstance().info('game over');
                    State.gameOver = true;
                }
                else if (e.other instanceof Food) {
                    player.shoppingList.removeItem(e.other.ShoppingListId);
                    e.other.kill();
                }
            }
        });
        this.on('postupdate', function (evt) {
            _this.vel.setTo(0, 0);
        });
    };
    Player.prototype.raycast = function (ray, clip) {
        return this.getBounds().rayCast(ray, clip);
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
    playerStart: new ex.Vector(3 * 24, 27 * 24),
    playerWidth: 45,
    playerHeight: 45,
    playerVel: 100,
    enemyWidth: 50,
    enemyHeight: 50,
    enemyRayCastAngle: Math.PI / 4,
    enemyRayLength: 200,
    enemyRayCount: 5,
    foodWidth: 100,
    foodHeight: 100,
    foodSpawnCount: 4
};
var State = {
    gameOver: false
};
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
var LAYER_IMPASSABLE = 'Impassable';
var ScnMain = (function (_super) {
    __extends(ScnMain, _super);
    /**
     * The main scene for the game
     */
    function ScnMain(engine) {
        var _this = _super.call(this, engine) || this;
        _this.enemies = [];
        return _this;
    }
    ScnMain.prototype.onInitialize = function (engine) {
        var map = Resources.map.getTileMap();
        this.add(map);
        Resources.map.data.layers.filter(function (l) { return l.name === LAYER_IMPASSABLE; }).forEach(function (l) {
            if (typeof l.data == 'string')
                return;
            for (var i_1 = 0; i_1 < l.data.length; i_1++) {
                if (l.data[i_1] !== 0) {
                    map.data[i_1].solid = true;
                }
            }
        });
        var floorTiles = new Array();
        //get all tiles where placing food should be allowed 
        Resources.map.data.layers.filter(function (l) { return l.name !== LAYER_IMPASSABLE; }).forEach(function (l) {
            if (typeof l.data == 'string')
                return;
            for (var i_2 = 0; i_2 < l.data.length; i_2++) {
                if (l.data[i_2] !== 0) {
                    if (!map.data[i_2].solid) {
                        floorTiles.push(map.data[i_2]);
                    }
                }
            }
        });
        // player is added to scene global context
        var foodArr = new Array();
        var rand = new ex.Random();
        for (var i = 0; i < Config.foodSpawnCount; i++) {
            var randomCell = floorTiles[rand.integer(0, floorTiles.length - 1)];
            var food = new Food(randomCell.getCenter().x, randomCell.getCenter().y, i);
            this.add(food);
            foodArr.push(food);
        }
        var shoppingList = new ShoppingList(foodArr);
        player.shoppingList = shoppingList;
        var enemy = new Enemy(300, 300);
        this.enemies.push(enemy);
        this.add(enemy);
    };
    return ScnMain;
}(ex.Scene));
var Food = (function (_super) {
    __extends(Food, _super);
    function Food(x, y, shoppingListId) {
        var _this = _super.call(this, x, y, Config.foodWidth, Config.foodHeight) || this;
        _this.ShoppingListId = shoppingListId;
        _this.addDrawing(Resources.foodSheet);
        return _this;
    }
    Food.prototype.onInitialize = function (engine) {
        this.collisionType = ex.CollisionType.Passive;
    };
    return Food;
}(ex.Actor));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    // todo need reference to the waypoint grid
    function Enemy(x, y) {
        var _this = _super.call(this, x, y, Config.enemyWidth, Config.enemyHeight) || this;
        _this.rays = [];
        _this.attack = false;
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
            _this.attack = false;
            // calculate the forward vector of enemy
            _this.forward = _this.vel.normalize();
            var forwardAngle = _this.vel.toAngle();
            var angleStep = Config.enemyRayCastAngle / Config.enemyRayCount;
            var angleStart = forwardAngle - (Config.enemyRayCastAngle / 2);
            for (var i = 0; i < Config.enemyRayCount; i++) {
                _this.rays[i] = new ex.Ray(_this.pos.clone(), ex.Vector.fromAngle(angleStart + angleStep * i).scale(Config.enemyRayLength));
            }
            _this.attack = _this.checkForPlayer();
            if (_this.attack) {
                // find the vector to the player
                var vectorToPlayer = player.pos.sub(_this.pos);
                // drop current actions
                _this.actions.clearActions();
                // Chase only in orthogonal directions
                var max = Math.max(Math.abs(vectorToPlayer.x), Math.abs(vectorToPlayer.y));
                if (max === Math.abs(vectorToPlayer.x)) {
                    max = vectorToPlayer.x;
                }
                if (max === Math.abs(vectorToPlayer.y)) {
                    max = vectorToPlayer.y;
                }
                var newVel = new ex.Vector(max === vectorToPlayer.x ? vectorToPlayer.x : 0, max === vectorToPlayer.y ? vectorToPlayer.y : 0);
                _this.vel = newVel;
            }
            else {
                // return to patrol, this will be different later on
                if (_this.actions._queues[0]._actions.length === 0) {
                    _this.actions.moveTo(_this.pos.x + 300, _this.pos.y, 20)
                        .moveTo(_this.pos.x + 300, _this.pos.y - 100, 20)
                        .moveTo(_this.pos.x, _this.pos.y - 100, 20)
                        .moveTo(_this.pos.x, _this.pos.y, 20).repeatForever();
                }
            }
        });
        // set this to postdebugdraw on production
        this.on('postdraw', function (evt) {
            for (var _i = 0, _a = _this.rays; _i < _a.length; _i++) {
                var ray = _a[_i];
                // Re-calc distance for debug only
                ex.Util.DrawUtil.vector(evt.ctx, _this.attack ? ex.Color.Red : ex.Color.Green, ex.Vector.Zero.clone(), ray.dir, Config.enemyRayLength);
            }
        });
    };
    Enemy.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (State.gameOver) {
            this.actionQueue.clearActions();
        }
    };
    Enemy.prototype.checkForPlayer = function () {
        var result = false;
        for (var _i = 0, _a = this.rays; _i < _a.length; _i++) {
            var ray = _a[_i];
            result = result || player.raycast(ray, Config.enemyRayLength);
        }
        return result;
    };
    return Enemy;
}(ex.Actor));
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
var WaypointGrid = (function () {
    function WaypointGrid() {
    }
    WaypointGrid.prototype.findPath = function (start, end) {
    };
    return WaypointGrid;
}());
var WaypointNode = (function () {
    function WaypointNode() {
    }
    return WaypointNode;
}());
/// <reference path="../lib/excalibur-tiled/dist/excalibur-tiled.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="Resources.ts" />
/// <reference path="Config.ts" />
/// <reference path="State.ts" />
/// <reference path="Stats.ts" />
/// <reference path="ScnMain.ts" />
/// <reference path="Food.ts" />
/// <reference path="Enemy.ts" />
/// <reference path="ShoppingList.ts" />
/// <reference path="WaypointGrid.ts" />
/// <reference path="WaypointNode.ts" />
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
// create the player in global context
var player = new Player(Config.playerStart.x, Config.playerStart.y);
scnMain.add(player);
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
