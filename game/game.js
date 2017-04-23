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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
                    e.other.collisionType = ex.CollisionType.PreventCollision;
                    console.log('spwan enemy for', e.other.id);
                    scnMain.spawnEnemy();
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
    enemySheet: new ex.Texture('img/enemy.png'),
    music: new ex.Sound('assets/snd/bossa_nova.mp3'),
    playerSpottedSound: new ex.Sound('assets/snd/playerSpotted.mp3', 'assets/snd/playerSpotted.wav'),
    spawnEnemySound: new ex.Sound('assets/snd/spawnEnemy.mp3', 'assets/snd/spawnEnemy.wav')
};
var Config = {
    gameWidth: 1200,
    gameHeight: 720,
    playerStart: new ex.Vector(24 * 24, 13 * 24),
    playerWidth: 45,
    playerHeight: 45,
    playerVel: 100,
    enemyStart: new ex.Vector(384, 720),
    enemyWidth: 50,
    enemyHeight: 50,
    enemyRayCastAngle: Math.PI / 4,
    enemyRayLength: 200,
    enemyRayCount: 5,
    enemySpeed: 20,
    enemyChaseSpeed: 100,
    foodWidth: 48,
    foodHeight: 48,
    foodSpawnCount: 5,
    soundVolume: 0.15,
    backgroundVolume: 0.1,
    groceryListTime: 1000,
    spawnFoodTime: 2000,
    spawnFirstEnemyTime: 7000
};
var State = {
    gameOver: false
};
var _origState = __assign({}, State);
function resetState() {
    State = __assign({}, _origState);
}
function saveState() {
    store.set('game', State);
}
function loadState() {
    State = $.extend({}, State, store.get('game'));
}
var Preferences = {
    muteBackgroundMusic: false,
    muteAll: false
};
var _origPreferences = __assign({}, Preferences);
function resetPreferences() {
    Preferences = __assign({}, _origPreferences);
}
function savePreferences() {
    store.set('pref', Preferences);
}
function loadPreferences() {
    // overwrite but allow new properties
    Preferences = $.extend({}, Preferences, store.get('pref'));
}
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
var LAYER_IMPASSABLE = 'Impassable';
var LAYER_WAYPOINTS = 'Waypoints';
var LAYER_FLOOR = 'Floor';
var LAYER_ZONES = 'Zones';
var ZONE_MEAT = 'Meat';
var ZONE_FREEZER = 'Freezer';
var ZONE_SNACKS = 'Snacks';
var ZONE_PANTRY = 'Pantry';
var ZONE_CEREAL = 'Cereal';
var ZONE_TOILETRIES = 'Toiletries';
var ZONE_BAKERY = 'Bakery';
var ZONE_FRUIT = 'Fruit';
var ZONE_VEGETABLES = 'Vegetables';
var ScnMain = (function (_super) {
    __extends(ScnMain, _super);
    function ScnMain(engine) {
        var _this = _super.call(this, engine) || this;
        _this._wallTiles = [];
        _this._floorTiles = [];
        _this._zones = [];
        _this.enemies = [];
        return _this;
    }
    ScnMain.prototype.onInitialize = function (engine) {
        var _this = this;
        this.map = Resources.map.getTileMap();
        this.add(this.map);
        Resources.map.data.layers.forEach(function (layer) {
            _this.collectWayPoints(layer);
            _this.collectSolidTiles(layer);
            _this.collectFloorTiles(layer);
            _this.collectFoodZones(layer);
        });
        // Build waypoint grid for pathfinding based on 
        this._grid = new WaypointGrid(this._nodes, this._wallTiles);
        // player is added to scene global context
        var foodArr = new Array();
        var rand = new ex.Random();
        var chosenFoodZones = rand.pickSet(this._zones, Config.foodSpawnCount);
        for (var i = 0; i < chosenFoodZones.length; i++) {
            var chosenFoodZone = chosenFoodZones[i];
            var validTiles = this.getCellsInFoodZone(chosenFoodZone.type);
            var chosenCell = validTiles[rand.integer(0, validTiles.length - 1)];
            //make a dummy cell so we can easily get the center
            var cell = new ex.Cell(chosenCell.x, chosenCell.y, 24, 24, 0);
            var food = new Food(cell.getCenter().x, cell.getCenter().y, i);
            this.add(food);
            foodArr.push(food);
        }
        var shoppingList = new ShoppingList(foodArr);
        player.shoppingList = shoppingList;
        director.setup();
        this.on('postdraw', function (evt) {
            _this._grid.draw(evt.ctx);
        });
    };
    ScnMain.prototype.collectWayPoints = function (layer) {
        if (layer.name !== LAYER_WAYPOINTS ||
            !layer.objects)
            return;
        var nodes = [];
        for (var _i = 0, _a = layer.objects; _i < _a.length; _i++) {
            var o = _a[_i];
            nodes.push(new WaypointNode(o.x, o.y));
        }
        this._nodes = nodes;
    };
    ScnMain.prototype.collectSolidTiles = function (layer) {
        if (layer.name !== LAYER_IMPASSABLE ||
            typeof layer.data == 'string' ||
            !layer.data)
            return;
        for (var i = 0; i < layer.data.length; i++) {
            if (layer.data[i] !== 0) {
                this.map.data[i].solid = true;
                this._wallTiles.push(this.map.data[i]);
            }
        }
    };
    ScnMain.prototype.collectFloorTiles = function (layer) {
        if (layer.name !== LAYER_FLOOR ||
            typeof layer.data == 'string' ||
            !layer.data)
            return;
        for (var i = 0; i < layer.data.length; i++) {
            if (layer.data[i] !== 0) {
                if (!this.map.data[i].solid) {
                    this._floorTiles.push(this.map.data[i]);
                }
            }
        }
    };
    ScnMain.prototype.collectFoodZones = function (layer) {
        if (layer.name !== LAYER_ZONES ||
            !layer.objects)
            return;
        for (var _i = 0, _a = layer.objects; _i < _a.length; _i++) {
            var o = _a[_i];
            this._zones.push({
                x: o.x,
                y: o.y,
                type: o.type
            });
        }
    };
    ScnMain.prototype.getCellsInFoodZone = function (foodZone) {
        var validCells = this._zones.filter(function (itm, idx) {
            return itm.type === foodZone;
        });
        return validCells;
    };
    //TODO if we don't create a new WaypointGrid, the enemies spawn in at the current location of the existing enemies
    // the WaypointGrid is being modified in an unexpected fashion
    ScnMain.prototype.spawnEnemy = function () {
        var enemy = new Enemy(this._grid); // new WaypointGrid(this._floorTiles));
        this.enemies.push(enemy);
        this.add(enemy);
        SoundManager.playSpawnEnemy();
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
    function Enemy(grid) {
        var _this = _super.call(this, Config.enemyStart.x, Config.enemyStart.y, Config.enemyWidth, Config.enemyHeight) || this;
        _this.rays = [];
        _this.attack = false;
        _this.isAttacking = false;
        _this.addDrawing(Resources.enemySheet);
        _this._random = new ex.Random();
        _this._grid = grid;
        var start = _this._grid.findClosestNode(Config.enemyStart.x, Config.enemyStart.y);
        _this._wander(start);
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
                _this.vel = vectorToPlayer.normalize().scale(Config.enemyChaseSpeed);
            }
            else {
                if (_this.actions._queues[0]._actions.length === 0) {
                    var start = _this._grid.findClosestNode(_this.pos.x, _this.pos.y);
                    _this._wander(start);
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
    Enemy.prototype._wander = function (startNode) {
        var start = startNode;
        this.pos = start.pos.clone();
        var end = this._random.pickOne(this._grid.nodes);
        var path = this._grid.findPath(start, end);
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var node = path_1[_i];
            this.actions.moveTo(node.pos.x, node.pos.y, Config.enemySpeed);
        }
    };
    Enemy.prototype.checkForPlayer = function () {
        var result = false;
        for (var _i = 0, _a = this.rays; _i < _a.length; _i++) {
            var ray = _a[_i];
            result = result || player.raycast(ray, Config.enemyRayLength);
            if (!this.isAttacking && result) {
                this.isAttacking = true;
                SoundManager.playPlayerSpotted();
            }
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
    function WaypointGrid(nodes, impassableCells) {
        this.nodes = [];
        this._cellWidth = 0;
        this._cellHeight = 0;
        this._wallBounds = [];
        this.nodes = nodes;
        for (var _i = 0, impassableCells_1 = impassableCells; _i < impassableCells_1.length; _i++) {
            var wall = impassableCells_1[_i];
            this._wallBounds.push(wall.getBounds());
        }
        this._processNeighbors();
    }
    WaypointGrid.prototype._processNeighbors = function () {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.neighbors = this.findNeighbors(node);
        }
    };
    WaypointGrid.prototype.findNode = function (x, y) {
        return this.nodes.filter(function (n) {
            return n.pos.x === x && n.pos.y === y;
        })[0] || null;
    };
    WaypointGrid.prototype.findClosestNode = function (x, y) {
        var minNode;
        var oldMinNode;
        var minDistance = Infinity;
        var point = new ex.Vector(x, y);
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.pos.distance(point) <= minDistance) {
                oldMinNode = minNode;
                minNode = n;
                minDistance = n.pos.distance(point);
            }
        }
        return minNode;
    };
    WaypointGrid.prototype.findNeighbors = function (node) {
        var nodes = this.findOrthogonalNeighbors(node); /*[this.findNode(node.pos.x, node.pos.y - this._cellHeight),
                     this.findNode(node.pos.x - this._cellWidth, node.pos.y),
                     this.findNode(node.pos.x, node.pos.y + this._cellHeight),
                     this.findNode(node.pos.x + this._cellWidth, node.pos.y)].filter(n => {return !!n}); */
        return nodes;
    };
    WaypointGrid.prototype.findOrthogonalNeighbors = function (node) {
        var x = node.pos.x;
        var y = node.pos.y;
        var sameX = this.nodes.filter(function (n) {
            return n.pos.x === x && n != node;
        });
        var sameY = this.nodes.filter(function (n) {
            return n.pos.y === y && n != node;
        });
        var minX = Infinity;
        var minXNode;
        var oldMinXNode;
        for (var i = 0; i < sameX.length; i++) {
            var distanceX = sameX[i].pos.distance(node.pos);
            if (distanceX < minX) {
                minX = distanceX;
                oldMinXNode = minXNode;
                minXNode = sameX[i];
            }
        }
        var minY = Infinity;
        var minYNode;
        var oldMinYNode;
        for (var j = 0; j < sameY.length; j++) {
            var distanceY = sameY[j].pos.distance(node.pos);
            if (distanceY < minY) {
                minY = distanceY;
                oldMinYNode = minYNode;
                minYNode = sameY[j];
            }
        }
        var potentialNeighbors = [minXNode, oldMinXNode, minYNode, oldMinYNode].filter(function (n) { return n != null; });
        var result = [];
        for (var _i = 0, potentialNeighbors_1 = potentialNeighbors; _i < potentialNeighbors_1.length; _i++) {
            var n = potentialNeighbors_1[_i];
            var tempRay = new ex.Ray(node.pos.clone(), n.pos.sub(node.pos));
            if (!this.rayCast(tempRay, n.pos.sub(node.pos).magnitude())) {
                result.push(n);
            }
        }
        return result;
    };
    // by default admissible heuristic of manhattan distance
    WaypointGrid.prototype.heuristicFcn = function (start, end) {
        return (Math.abs(start.pos.x - end.pos.x) + Math.abs(start.pos.y - end.pos.y));
    };
    WaypointGrid.prototype._buildPath = function (node) {
        var path = [];
        while (node._previousNode) {
            path.unshift(node);
            node = node._previousNode;
        }
        path.unshift(node);
        this.nodes.forEach(function (n) { return n.reset(); });
        return path;
    };
    WaypointGrid.prototype.rayCast = function (ray, distance) {
        for (var i = 0; i < this._wallBounds.length; i++) {
            return this._wallBounds[i].rayCast(ray, distance);
        }
    };
    WaypointGrid.prototype.findPath = function (start, end) {
        var _this = this;
        // reset each node
        this.nodes.forEach(function (n) { return n.reset(); });
        var startingNode = start;
        var endingNode = end;
        startingNode._gscore = 0;
        startingNode._hscore = startingNode._gscore + this.heuristicFcn(startingNode, endingNode);
        var openNodes = [startingNode];
        var closedNodes = [];
        while (openNodes.length > 0) {
            // Find the lowest heuristic node in the open nodes list
            var current = openNodes.sort(function (a, b) {
                return a._hscore - b._hscore;
            })[0];
            // Done
            if (current == endingNode) {
                return this._buildPath(current);
            }
            // Remove current node from open
            ex.Util.removeItemToArray(current, openNodes);
            closedNodes.push(current);
            // Find neighbors we haven't explored
            var neighbors = this.findNeighbors(current).filter(function (n) { return !ex.Util.contains(closedNodes, n); });
            // Calculate neighbor heuristics
            neighbors.forEach(function (n) {
                if (!ex.Util.contains(openNodes, n)) {
                    n._previousNode = current;
                    n._gscore = n._weight + current._gscore;
                    n._hscore = n._gscore + _this.heuristicFcn(n, endingNode);
                    openNodes.push(n);
                }
            });
        }
        // no path found
        return [];
    };
    WaypointGrid.prototype.draw = function (ctx) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            ex.Util.DrawUtil.point(ctx, ex.Color.Green, node.pos);
            for (var _b = 0, _c = node.neighbors; _b < _c.length; _b++) {
                var neighbor = _c[_b];
                ex.Util.DrawUtil.line(ctx, ex.Color.Green, node.pos.x, node.pos.y, neighbor.pos.x, neighbor.pos.y);
            }
        }
    };
    return WaypointGrid;
}());
var WaypointNode = (function () {
    function WaypointNode(x, y) {
        this._hscore = 0;
        this._gscore = 0;
        this._weight = 1;
        this._previousNode = null;
        this.pos = new ex.Vector(x, y);
    }
    WaypointNode.prototype.reset = function () {
        this._hscore = 0;
        this._gscore = 0;
        this._weight = 1;
        this._previousNode = null;
    };
    WaypointNode.prototype.distance = function (node) {
        var xdiff = node.pos.x - this.pos.x;
        var ydiff = node.pos.y - this.pos.y;
        return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    };
    return WaypointNode;
}());
var SoundManager = (function () {
    function SoundManager() {
    }
    SoundManager.init = function () {
        SoundManager._updateMusicButton();
        SoundManager._updateMuteAllButton();
        $('#mute-music').on('click', function () {
            if (Preferences.muteBackgroundMusic) {
                SoundManager.unmuteBackgroundMusic();
            }
            else {
                SoundManager.muteBackgroundMusic();
            }
            savePreferences();
            return false;
        });
        $('#mute-all').on('click', function () {
            if (Preferences.muteAll) {
                SoundManager.unmuteAll();
            }
            else {
                SoundManager.muteAll();
            }
            savePreferences();
            return false;
        });
    };
    SoundManager.muteAll = function () {
        Preferences.muteAll = true;
        Preferences.muteBackgroundMusic = true;
        for (var r in Resources) {
            var snd = Resources[r];
            if (snd instanceof ex.Sound) {
                snd.setVolume(0);
            }
        }
        SoundManager.muteBackgroundMusic();
        SoundManager._updateMuteAllButton();
    };
    SoundManager.unmuteAll = function () {
        Preferences.muteAll = false;
        Preferences.muteBackgroundMusic = false;
        for (var r in Resources) {
            var snd = Resources[r];
            if (snd instanceof ex.Sound) {
                snd.setVolume(Config.soundVolume);
            }
        }
        SoundManager.unmuteBackgroundMusic();
        SoundManager._updateMuteAllButton();
    };
    SoundManager.startBackgroundMusic = function () {
        // start bg music
        Resources.music.setVolume(Preferences.muteBackgroundMusic ? 0 : Config.backgroundVolume);
        Resources.music.setLoop(true);
        Resources.music.play();
    };
    SoundManager.stopBackgroundMusic = function () {
        // stop bg music
        Resources.music.setLoop(false);
        Resources.music.stop();
    };
    SoundManager.muteBackgroundMusic = function () {
        Preferences.muteBackgroundMusic = true;
        // mute bg music
        Resources.music.setVolume(0);
        SoundManager._updateMusicButton();
    };
    SoundManager.unmuteBackgroundMusic = function () {
        Preferences.muteBackgroundMusic = false;
        // unmute bg music
        Resources.music.setVolume(Config.backgroundVolume);
        SoundManager._updateMusicButton();
    };
    SoundManager.playPlayerSpotted = function () {
        Resources.playerSpottedSound.setVolume(Config.soundVolume);
        Resources.playerSpottedSound.play();
    };
    SoundManager.playSpawnEnemy = function () {
        Resources.spawnEnemySound.setVolume(Config.soundVolume);
        Resources.spawnEnemySound.play();
    };
    SoundManager._updateMusicButton = function () {
        $('#mute-music i').get(0).className = classNames('fa', {
            'fa-music': !Preferences.muteBackgroundMusic,
            'fa-play': Preferences.muteBackgroundMusic
        });
    };
    SoundManager._updateMuteAllButton = function () {
        $('#mute-all i').get(0).className = classNames('fa', {
            'fa-volume-up': !Preferences.muteAll,
            'fa-volume-off': Preferences.muteAll
        });
    };
    return SoundManager;
}());
var Director = (function (_super) {
    __extends(Director, _super);
    function Director() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Director.prototype.setup = function () {
        var _this = this;
        ex.Logger.getInstance().info('director setup');
        this._showGroceryListTimer = new ex.Timer(function () {
            _this._showGroceryList();
        }, Config.groceryListTime);
        scnMain.add(this._showGroceryListTimer);
        this._spawnFoodTimer = new ex.Timer(function () {
            _this._spawnFood();
        }, Config.spawnFoodTime);
        scnMain.add(this._spawnFoodTimer);
        this._spawnFirstEnemyTimer = new ex.Timer(function () {
            _this._spawnFirstEnemy();
        }, Config.spawnFirstEnemyTime);
        scnMain.add(this._spawnFirstEnemyTimer);
    };
    //1. start zoomed in on player, zoom out
    // public zoomOut() {
    // zooming is broken
    // }
    //2. display grocery list
    Director.prototype._showGroceryList = function () {
        console.log('show grocery list');
        //TODO
    };
    //3. spawn in food
    Director.prototype._spawnFood = function () {
        console.log('spawn food');
        //TODO
    };
    //4. the first antagonist arrives
    Director.prototype._spawnFirstEnemy = function () {
        scnMain.spawnEnemy();
    };
    return Director;
}(ex.Actor));
/// <reference path="../lib/excalibur-tiled/dist/excalibur-tiled.d.ts" />
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
var game = new ex.Engine({
    width: Config.gameWidth,
    height: Config.gameHeight,
    canvasElementId: "game",
});
// initialize sound
loadPreferences();
SoundManager.init();
// create an asset loader
var loader = new ex.Loader();
for (var r in Resources) {
    loader.addResource(Resources[r]);
}
var director = new Director();
game.add(director);
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
    // turn off anti-aliasing
    game.setAntialiasing(false);
    game.goToScene('main');
    SoundManager.startBackgroundMusic();
});
//# sourceMappingURL=game.js.map