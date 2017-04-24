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
        _this.disableMovement = false;
        return _this;
    }
    Player.prototype.onInitialize = function (engine) {
        var _this = this;
        this._setupDrawing();
        this.collisionType = ex.CollisionType.Active;
        this._selectSprite = Resources.playerSelect.asSprite();
        game.input.keyboard.on('hold', function (keyHeld) {
            if (!State.gameOver) {
                if (player.disableMovement)
                    return;
                switch (keyHeld.key) {
                    case ex.Input.Keys.Up:
                    case ex.Input.Keys.W:
                        _this.vel.setTo(_this.vel.x, -Config.playerVel);
                        player.setDrawing('walkUp');
                        break;
                    case ex.Input.Keys.Down:
                    case ex.Input.Keys.S:
                        _this.vel.setTo(_this.vel.x, Config.playerVel);
                        player.setDrawing('walkDown');
                        break;
                    case ex.Input.Keys.Left:
                    case ex.Input.Keys.A:
                        _this.vel.setTo(-Config.playerVel, _this.vel.y);
                        player.setDrawing('walkLeft');
                        break;
                    case ex.Input.Keys.Right:
                    case ex.Input.Keys.D:
                        _this.vel.setTo(Config.playerVel, _this.vel.y);
                        player.setDrawing('walkRight');
                        break;
                }
            }
        });
        game.input.keyboard.on('up', function (keyUp) {
            if (!State.gameOver) {
                switch (keyUp.key) {
                    case ex.Input.Keys.Up:
                    case ex.Input.Keys.W:
                        player.setDrawing('up');
                        break;
                    case ex.Input.Keys.Down:
                    case ex.Input.Keys.S:
                        _this.vel.setTo(_this.vel.x, Config.playerVel);
                        player.setDrawing('down');
                        break;
                    case ex.Input.Keys.Left:
                    case ex.Input.Keys.A:
                        player.setDrawing('left');
                        break;
                    case ex.Input.Keys.Right:
                    case ex.Input.Keys.D:
                        player.setDrawing('right');
                        break;
                }
            }
        });
        this.on('collision', function (e) {
            if (!State.gameOver) {
                if (e.other instanceof Enemy) {
                    director.gameOver(e.other);
                }
                else if (e.other instanceof Food) {
                    player.shoppingList.removeItem(e.other.shoppingListId);
                    e.other.kill();
                    e.other.collisionType = ex.CollisionType.PreventCollision;
                    Resources.pickupSound.play();
                }
            }
        });
        this.on('postupdate', function (evt) {
            _this.vel.setTo(0, 0);
        });
        this.on('postdraw', function (evt) {
            _this._selectSprite.draw(evt.ctx, -_this._selectSprite.naturalWidth / 2, _this._selectSprite.naturalHeight / 2 + 10);
        });
    };
    Player.prototype.raycast = function (ray, clip) {
        return this.getBounds().rayCast(ray, clip);
    };
    Player.prototype._setupDrawing = function () {
        var playerSheet = new ex.SpriteSheet(director.getCharSprite(), 10, 1, 45, 45);
        this.addDrawing('down', playerSheet.getSprite(0));
        this.addDrawing('up', playerSheet.getSprite(3));
        this.addDrawing('left', playerSheet.getSprite(7));
        this.addDrawing('right', playerSheet.getSprite(9));
        this._leftDrawing = playerSheet.getSprite(9); //for game over screen
        // var walkDownAnim = playerSheet.getAnimationBetween(game, 0, 4, 180);
        var walkDownAnim = playerSheet.getAnimationByIndices(game, [0, 1, 0, 2], 180);
        walkDownAnim.loop = true;
        this.addDrawing('walkDown', walkDownAnim);
        // var walkUpAnim = playerSheet.getAnimationBetween(game, 4,8, 180);
        var walkUpAnim = playerSheet.getAnimationByIndices(game, [3, 4, 3, 5], 180);
        walkUpAnim.loop = true;
        this.addDrawing('walkUp', walkUpAnim);
        var walkLeftAnim = playerSheet.getAnimationByIndices(game, [7, 6], 200);
        walkLeftAnim.loop = true;
        this.addDrawing('walkLeft', walkLeftAnim);
        var walkRightAnim = playerSheet.getAnimationByIndices(game, [9, 8], 200);
        walkRightAnim.loop = true;
        this.addDrawing('walkRight', walkRightAnim);
        this.setDrawing('down');
    };
    Player.prototype.raycastTime = function (ray, clip) {
        return this.getBounds().rayCastTime(ray, clip);
    };
    return Player;
}(ex.Actor));
var Resources = {
    map: new Extensions.Tiled.TiledResource('assets/map.json'),
    playerSheet: new ex.Texture('img/player.png'),
    playerSelect: new ex.Texture('img/player-select.png'),
    foodSheet: new ex.Texture('img/food.png'),
    bwFoodSheet: new ex.Texture('img/foodbw.png'),
    charSheet1: new ex.Texture('img/char-sprites/player-1.png'),
    charSheet2: new ex.Texture('img/char-sprites/player-2.png'),
    charSheet3: new ex.Texture('img/char-sprites/player-3.png'),
    charSheet4: new ex.Texture('img/char-sprites/player-4.png'),
    charSheet5: new ex.Texture('img/char-sprites/player-1-long.png'),
    charSheet6: new ex.Texture('img/char-sprites/player-2-long.png'),
    charSheet7: new ex.Texture('img/char-sprites/player-3-long.png'),
    charSheet8: new ex.Texture('img/char-sprites/player-4-long.png'),
    surpriseSheet: new ex.Texture('img/surprise.png'),
    vignette0: new ex.Texture('img/vignette-stretched-light.png'),
    vignette1: new ex.Texture('img/vignette-stretched-dark.png'),
    vignette2: new ex.Texture('img/vignette-stretched-darker.png'),
    vignette3: new ex.Texture('img/vignette-stretched-darkest.png'),
    music: new ex.Sound('assets/snd/bossa_nova.mp3'),
    ominousMusic: new ex.Sound('assets/snd/ominous.mp3', 'assets/snd/ominous.wav'),
    playerSpottedSound: new ex.Sound('assets/snd/playerSpotted.mp3', 'assets/snd/playerSpotted.wav'),
    spawnEnemySound: new ex.Sound('assets/snd/spawnEnemy.mp3', 'assets/snd/spawnEnemy.wav'),
    spawnFoodSound: new ex.Sound('assets/snd/placeFood.mp3', 'assets/snd/placeFood.wav'),
    checkoutSound: new ex.Sound('assets/snd/checkout.mp3', 'assets/snd/checkout.wav'),
    registerSound: new ex.Sound('assets/snd/register.mp3', 'assets/snd/register.wav'),
    pickupSound: new ex.Sound('assets/snd/pickup.mp3', 'assets/snd/pickup.wav'),
    doorSlideSound: new ex.Sound('assets/snd/doorslide.mp3', 'assets/snd/doorslide.wav'),
    doorSlideCloseSound: new ex.Sound('assets/snd/doorslideclose.mp3', 'assets/snd/doorslideclose.wav'),
    diagIntro: new ex.Texture('img/diag-intro.png'),
    doorSheet: new ex.Texture('img/door.png')
};
var Config = {
    gameWidth: 1200,
    gameHeight: 720,
    enterDoorX: 13 * 24,
    enterDoorY: 29 * 24,
    enterDoorWidth: 120,
    enterDoorHeight: 24,
    playerStart: new ex.Vector(24 * 24, 13 * 24),
    playerWidth: 25,
    playerHeight: 40,
    playerVel: 100,
    enemyStart: new ex.Vector(384, 720),
    enemyWidth: 50,
    enemyHeight: 50,
    enemyRayCastAngle: Math.PI / 4,
    enemyRayLength: 200,
    enemyRayCount: 5,
    enemySpeed: 80,
    enemyChaseSpeed: 90,
    enemyVignetteRadius: 150,
    enemyChaseMusicRadius: 400,
    enemySpawnMinTime: 5000,
    enemySpawnMaxTime: 12000,
    enemySpawnMaximum: 10,
    enemyCheckoutTime: 30000,
    foodWidth: 48,
    foodHeight: 48,
    foodSheetCols: 9,
    foodSheetRows: 1,
    foodSpawnCount: 5,
    soundVolume: 1,
    backgroundVolume: 0.3,
    groceryListTime: 4000,
    spawnFoodTime: 4000,
    spawnFoodTimeInterval: 400,
    spawnFirstEnemyTime: 7000,
    spawnTimedEnemyTime: 5000
};
var State = {
    gameOver: false,
    gameOverCheckout: false,
    gameOverEnemy: false,
    uncollectedFood: [],
    collectedFood: []
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
var LAYER_GAMEOVER = 'GameOver';
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
var FoodTypes = [
    ZONE_PANTRY,
    ZONE_SNACKS,
    ZONE_CEREAL,
    ZONE_FREEZER,
    ZONE_MEAT,
    ZONE_TOILETRIES,
    ZONE_BAKERY,
    ZONE_FRUIT,
    ZONE_VEGETABLES
];
var ScnMain = (function (_super) {
    __extends(ScnMain, _super);
    function ScnMain(engine) {
        var _this = _super.call(this, engine) || this;
        _this._wallTiles = [];
        _this._floorTiles = [];
        _this._foodSpawnPoints = [];
        _this._gameOverZone = [];
        _this.enemies = [];
        return _this;
    }
    ScnMain.prototype.onInitialize = function (engine) {
        var _this = this;
        this.map = Resources.map.getTileMap();
        this.add(this.map);
        // vignette.addDrawing('vignette0', Resources.vignette0.asSprite());
        // vignette.addDrawing('vignette1', Resources.vignette1.asSprite());
        // vignette.addDrawing('vignette2', Resources.vignette2.asSprite());
        // vignette.addDrawing('vignette3', Resources.vignette3.asSprite());
        Resources.map.data.layers.forEach(function (layer) {
            _this.collectWayPoints(layer);
            _this.collectSolidTiles(layer);
            _this.collectFloorTiles(layer);
            _this.collectFoodZones(layer);
            _this.collectGameOverZones(layer);
        });
        // Build game over triggers
        for (var _i = 0, _a = this._gameOverZone; _i < _a.length; _i++) {
            var go = _a[_i];
            var goc = go.getCenter();
            var checkoutTrigger = new ex.Trigger(goc.x, goc.y, this.map.cellWidth, this.map.cellHeight, this.handleCheckoutTrigger, -1);
            this.add(checkoutTrigger);
        }
        // Build waypoint grid for pathfinding based on 
        this._grid = new WaypointGrid(this._nodes, this._wallTiles);
        // Entrance door
        this.door = new ex.Actor(Config.enterDoorX, Config.enterDoorY, Config.enterDoorWidth, Config.enterDoorHeight);
        this.door.anchor.setTo(0, 0);
        var doorSheet = new ex.SpriteSheet(Resources.doorSheet, 13, 1, Config.enterDoorWidth, Config.enterDoorHeight);
        var spriteIndices = doorSheet.sprites.map(function (s, idx) { return idx; });
        this.door.addDrawing('idle', doorSheet.getSprite(0));
        this.door.addDrawing('open', doorSheet.getAnimationForAll(game, 50));
        this.door.addDrawing('close', doorSheet.getAnimationByIndices(game, spriteIndices.reverse(), 50));
        this.door.setDrawing('idle');
        this.add(this.door);
        this.door.setZIndex(2);
        // cashier
        this.cashier = new Cashier(1126, 450, Config.playerWidth, Config.playerHeight, ex.Color.Red);
        this.add(this.cashier);
        director.setup();
        this.on('postdraw', function (evt) {
            if (gameDebug) {
                _this._grid.draw(evt.ctx);
            }
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
            this._foodSpawnPoints.push({
                x: o.x,
                y: o.y,
                type: o.type
            });
        }
    };
    ScnMain.prototype.collectGameOverZones = function (layer) {
        if (layer.name !== LAYER_GAMEOVER)
            return;
        for (var i = 0; i < layer.data.length; i++) {
            if (layer.data[i] > 0) {
                this._gameOverZone.push(this.map.data[i]);
            }
        }
    };
    ScnMain.prototype.handleCheckoutTrigger = function () {
        var _this = this;
        if (player.collides(this)) {
            SoundManager.playPlayerCheckout();
            director.checkout();
        }
        else if (scnMain.enemies.filter(function (en) { return en.collides(_this); }).length > 0) {
            // play enemy checkout sounds
            SoundManager.playEnemyCheckout();
        }
    };
    ScnMain.prototype.getCellsInFoodZone = function (foodZone) {
        var validCells = this._foodSpawnPoints.filter(function (itm, idx) {
            return itm.type === foodZone;
        });
        return validCells;
    };
    //TODO if we don't create a new WaypointGrid, the enemies spawn in at the current location of the existing enemies
    // the WaypointGrid is being modified in an unexpected fashion
    ScnMain.prototype.spawnEnemy = function (mode) {
        var _this = this;
        if (mode === void 0) { mode = ENEMY_RANDOM_MODE; }
        // open door
        Resources.doorSlideSound.play();
        this.door.setDrawing('open');
        this.door.actions
            .delay(50 * 13)
            .callMethod(function () {
            var enemy = new Enemy(_this._grid, mode);
            _this.enemies.push(enemy);
            _this.add(enemy);
            enemy.setZIndex(1);
            SoundManager.playSpawnEnemy();
        })
            .delay(600)
            .callMethod(function () {
            _this.door.setDrawing('close');
            Resources.doorSlideCloseSound.play();
        });
    };
    ScnMain.prototype.spawnFood = function () {
        var _this = this;
        // player is added to scene global context
        var foodArr = new Array();
        var chosenFoodZones = gameRandom.pickSet(FoodTypes, Config.foodSpawnCount);
        for (var i = 0; i < chosenFoodZones.length; i++) {
            var chosenFoodZone = chosenFoodZones[i];
            var validTiles = this.getCellsInFoodZone(chosenFoodZone);
            var chosenCell = validTiles[gameRandom.integer(0, validTiles.length - 1)];
            var food = new Food(chosenCell.x, chosenCell.y, i, chosenFoodZone);
            foodArr.push(food);
        }
        var currIdx = 0;
        this._foodSpawnAnimTimer = new ex.Timer(function () {
            if (currIdx === foodArr.length) {
                scnMain.cancelTimer(_this._foodSpawnAnimTimer);
                return;
            }
            scnMain.add(foodArr[currIdx]);
            SoundManager.playSpawnFood();
            currIdx++;
        }, Config.spawnFoodTimeInterval, true);
        // WORKAROUND timers cannot be added within another timer's callback fn
        setTimeout(function () { return scnMain.add(_this._foodSpawnAnimTimer); }, 1);
        var shoppingList = new ShoppingList(foodArr);
        player.shoppingList = shoppingList;
        shoppingList.updateUI();
    };
    return ScnMain;
}(ex.Scene));
var Food = (function (_super) {
    __extends(Food, _super);
    function Food(x, y, shoppingListId, foodZone) {
        var _this = _super.call(this, x, y, Config.foodWidth, Config.foodHeight) || this;
        _this.shoppingListId = shoppingListId;
        _this.foodZone = foodZone;
        // get zone index
        var zoneIdx = FoodTypes.indexOf(_this.foodZone);
        // init sprite sheet
        if (Food.foodSheet === null) {
            Food.foodSheet = new ex.SpriteSheet(Resources.foodSheet, Config.foodSheetCols, Config.foodSheetRows, Config.foodWidth, Config.foodHeight);
        }
        //bw init sprite sheet
        if (Food.bwFoodSheet === null) {
            Food.bwFoodSheet = new ex.SpriteSheet(Resources.bwFoodSheet, Config.foodSheetCols, Config.foodSheetRows, Config.foodWidth, Config.foodHeight);
        }
        // get rand food from zone (each column in sheet indexed by zone)
        // each row in sheet is another type of food in that zone
        var foodIdx = gameRandom.integer(0, Config.foodSheetRows - 1);
        _this.spriteIndex = zoneIdx + foodIdx * Food.foodSheet.columns;
        return _this;
    }
    Food.prototype.onInitialize = function (engine) {
        this.collisionType = ex.CollisionType.Passive;
        var foodSprite = Food.foodSheet.getSprite(this.spriteIndex);
        this.addDrawing(foodSprite);
        var delay = gameRandom.integer(0, 700);
        this.actions
            .delay(delay)
            .easeTo(this.x, this.y - 5, 750)
            .easeTo(this.x, this.y, 750)
            .repeatForever();
        ex.Logger.getInstance().info('New food. Zone:', this.foodZone, 'anim delay:', delay);
    };
    return Food;
}(ex.Actor));
Food.foodSheet = null;
Food.bwFoodSheet = null;
var ENEMY_FOOD_MODE = 'Food';
var ENEMY_PLAYER_MODE = 'Player';
var ENEMY_RANDOM_MODE = 'Random';
var ENEMY_CHECKOUT_MODE = 'Checkout';
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    // todo need reference to the waypoint grid
    function Enemy(grid, mode) {
        if (mode === void 0) { mode = ENEMY_RANDOM_MODE; }
        var _this = _super.call(this, Config.enemyStart.x, Config.enemyStart.y, Config.enemyWidth, Config.enemyHeight) || this;
        _this.mode = mode;
        _this.rays = [];
        _this.attack = false;
        _this.isAttacking = false;
        _this._surpriseSprite = Resources.surpriseSheet.asSprite();
        _this._grid = grid;
        var start = _this._grid.findClosestNode(Config.enemyStart.x, Config.enemyStart.y);
        _this._wander(start);
        _this.rays = new Array(Config.enemyRayCount);
        return _this;
    }
    Enemy.prototype.onInitialize = function (engine) {
        var _this = this;
        this._setupDrawing();
        this.collisionType = ex.CollisionType.Passive;
        //make enemies leave the store after a certain amount of time
        var checkoutTimer = new ex.Timer(function () {
            _this.mode = ENEMY_CHECKOUT_MODE;
        }, Config.enemyCheckoutTime);
        scnMain.add(checkoutTimer);
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
            SoundManager.updateDynamicEnemyPlayerMusic();
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
                    _this.lastKnownPlayerPos = null;
                    _this._wander(start);
                }
            }
        });
        // set this to postdebugdraw on production
        this.on('postdraw', function (evt) {
            if (_this.attack) {
                _this._surpriseSprite.draw(evt.ctx, -_this._surpriseSprite.naturalWidth / 2, -_this._surpriseSprite.naturalHeight / 2 - 50);
            }
            if (gameDebug) {
                for (var _i = 0, _a = _this.rays; _i < _a.length; _i++) {
                    var ray = _a[_i];
                    // Re-calc distance for debug only
                    ex.Util.DrawUtil.vector(evt.ctx, _this.attack ? ex.Color.Red : ex.Color.Green, ex.Vector.Zero.clone(), ray.dir, Config.enemyRayLength);
                }
            }
        });
    };
    Enemy.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (State.gameOver) {
            this.actionQueue.clearActions();
        }
        // determine direction of the sprite animations
        var left = ex.Vector.Left.dot(this.vel);
        var right = ex.Vector.Right.dot(this.vel);
        var up = ex.Vector.Up.dot(this.vel);
        var down = ex.Vector.Down.dot(this.vel);
        var direction = Math.max(left, right, up, down);
        switch (direction) {
            case left:
                this.setDrawing('walkLeft');
                break;
            case right:
                this.setDrawing('walkRight');
                break;
            case up:
                this.setDrawing('walkUp');
                break;
            case down:
                this.setDrawing('walkDown');
                break;
        }
    };
    Enemy.prototype._wander = function (startNode) {
        var _this = this;
        var start = startNode;
        var end = null;
        if (this.lastKnownPlayerPos) {
            end = this._grid.findClosestNode(this.lastKnownPlayerPos.x, this.lastKnownPlayerPos.y);
            //this.lastKnownPlayerPos = null;
        }
        else {
            switch (this.mode) {
                case ENEMY_FOOD_MODE:
                    var foodList = player.shoppingList.getFoodLeft();
                    var food = gameRandom.pickOne(foodList);
                    //the player has picked up all or most of the food. Fall back to random mode
                    //to prevent enemies from clumping on food
                    if (food == null || foodList.length < 3) {
                        this.mode = ENEMY_RANDOM_MODE;
                    }
                    else {
                        end = this._grid.findClosestNode(food.pos.x, food.pos.y);
                        break;
                    }
                case ENEMY_RANDOM_MODE:
                    end = gameRandom.pickOne(this._grid.nodes);
                    break;
                case ENEMY_PLAYER_MODE:
                    end = this._grid.findClosestNode(player.pos.x, player.pos.y);
                    break;
                case ENEMY_CHECKOUT_MODE:
                    //get the waypoint closest to the checkout
                    end = this._grid.findClosestNode(1100, 370);
                    break;
            }
        }
        var path = this._grid.findPath(start, end);
        for (var i = 0; i < path.length; i++) {
            this.actions.moveTo(path[i].pos.x, path[i].pos.y, Config.enemySpeed);
        }
        //if the enemy is checking out, after they get to the waypoint near the checkout,
        //manually have them exit the store
        if (this.mode === ENEMY_CHECKOUT_MODE) {
            this.actions.moveTo(end.pos.x, Config.gameHeight - 90, Config.enemySpeed);
            this.actions.moveTo(1250, Config.gameHeight - 90, Config.enemySpeed);
            this.actions.callMethod(function () {
                ex.Util.removeItemToArray(_this, scnMain.enemies);
                Director.enemiesSpawned -= 1;
            });
            this.actions.die();
        }
    };
    Enemy.prototype.checkForPlayer = function () {
        var result = false;
        for (var _i = 0, _a = this.rays; _i < _a.length; _i++) {
            var ray = _a[_i];
            var playerTime = player.raycastTime(ray, Config.enemyRayLength);
            if (playerTime !== -1) {
                var wallTime = this._grid.rayCastTime(ray, Config.enemyRayLength);
                if (wallTime === -1) {
                    wallTime = 99999999;
                }
                if (playerTime !== -1 && playerTime < wallTime) {
                    result = true;
                    this.lastKnownPlayerPos = ray.getPoint(playerTime);
                    if (!this.isAttacking && result) {
                        this.isAttacking = true;
                        SoundManager.playPlayerSpotted();
                    }
                    break;
                }
            }
        }
        return result;
    };
    Enemy.prototype._setupDrawing = function () {
        var enemySheet = new ex.SpriteSheet(director.getCharSprite(), 10, 1, 45, 45);
        this.addDrawing('down', enemySheet.getSprite(0));
        this.addDrawing('up', enemySheet.getSprite(3));
        this.addDrawing('left', enemySheet.getSprite(7));
        this.addDrawing('right', enemySheet.getSprite(9));
        this._rightDrawing = enemySheet.getSprite(7);
        var walkDownAnim = enemySheet.getAnimationByIndices(game, [0, 1, 0, 2], 180);
        walkDownAnim.loop = true;
        this.addDrawing('walkDown', walkDownAnim);
        var walkUpAnim = enemySheet.getAnimationByIndices(game, [3, 4, 3, 5], 180);
        walkUpAnim.loop = true;
        this.addDrawing('walkUp', walkUpAnim);
        var walkLeftAnim = enemySheet.getAnimationByIndices(game, [7, 6], 200);
        walkLeftAnim.loop = true;
        this.addDrawing('walkLeft', walkLeftAnim);
        var walkRightAnim = enemySheet.getAnimationByIndices(game, [9, 8], 200);
        walkRightAnim.loop = true;
        this.addDrawing('walkRight', walkRightAnim);
        this.setDrawing('up');
    };
    return Enemy;
}(ex.Actor));
var SHOPPING_TEXT_GET_FOOD = 'Need to get:';
var SHOPPING_TEXT_CHECKOUT = 'Time to checkout!';
var ShoppingList = (function () {
    function ShoppingList(items) {
        State.uncollectedFood = items;
        State.collectedFood = new Array(items.length);
    }
    Object.defineProperty(ShoppingList.prototype, "isEmpty", {
        get: function () {
            return State.uncollectedFood.filter(function (i) { return i === undefined; }).length === Config.foodSpawnCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShoppingList.prototype, "collectedFood", {
        get: function () {
            return State.collectedFood.filter(function (f) { return f !== undefined; });
        },
        enumerable: true,
        configurable: true
    });
    ShoppingList.prototype.removeItem = function (id) {
        if (State.uncollectedFood && State.uncollectedFood.length) {
            var idxsToRemove = State.uncollectedFood.map(function (obj, index) {
                if (obj && obj.shoppingListId == id) {
                    return index;
                }
            }).filter(function (i) { return i !== undefined; });
            if (idxsToRemove && idxsToRemove.length) {
                var idx = idxsToRemove[0];
                var removedFood = State.uncollectedFood[idx];
                State.uncollectedFood[idx] = undefined;
                State.collectedFood[idx] = removedFood;
                this.updateUI();
            }
        }
    };
    ShoppingList.prototype.getFoodLeft = function () {
        return State.uncollectedFood.filter(function (f) {
            return !!f;
        });
    };
    ShoppingList.typewriter = function (text, target, speed) {
        var progress = '';
        var len = text.length;
        var pos = 0;
        var typer;
        if ($(target).text() === text)
            return;
        var type = function () {
            if (progress === text) {
                return clearInterval(typer);
            }
            ;
            progress = progress + text[pos];
            $(target).text(progress);
            pos++;
        };
        typer = setInterval(type, speed);
    };
    ShoppingList.prototype.updateUI = function () {
        if (this.collectedFood.length !== Config.foodSpawnCount) {
            ShoppingList.typewriter(SHOPPING_TEXT_GET_FOOD, '#shop-message', 90);
        }
        else {
            ShoppingList.typewriter(SHOPPING_TEXT_CHECKOUT, '#shop-message', 90);
        }
        for (var i = 0; i < State.collectedFood.length; i++) {
            if (!State.collectedFood[i]) {
                var bwSprite = Food.bwFoodSheet.getSprite(State.uncollectedFood[i].spriteIndex);
                var bwSpriteCanvas = bwSprite._spriteCanvas.toDataURL();
                $('#item' + (i + 1)).css("background-image", "url('" + bwSpriteCanvas + "'");
            }
            else {
                var colSprite = Food.foodSheet.getSprite(State.collectedFood[i].spriteIndex);
                var colSpriteCanvas = colSprite._spriteCanvas.toDataURL();
                $('#item' + (i + 1)).css("background-image", "url('" + colSpriteCanvas + "'");
            }
        }
    };
    ShoppingList.prototype.handleGameOver = function () {
        // move shopping list to game over dialog (hacky!)
        $('#game-over-shopping-list').append($('#shopping-list'));
        for (var i = 0; i < State.collectedFood.length; i++) {
            var foodArr = State.collectedFood[i] ? State.collectedFood : State.uncollectedFood;
            var bwSprite = Food.bwFoodSheet.getSprite(foodArr[i].spriteIndex);
            var bwSpriteCanvas = bwSprite._spriteCanvas.toDataURL();
            $('#item' + (i + 1)).css("background-image", "url('" + bwSpriteCanvas + "'");
        }
        var collectedFood = this.collectedFood;
        var currIdx = 0;
        var timer = setInterval(function () {
            if (currIdx === collectedFood.length) {
                clearInterval(timer);
                // play register sound if player collected all food
                if (collectedFood.length > 0) {
                    setTimeout(function () { return Resources.registerSound.play(); }, 350);
                }
                return;
            }
            var food = collectedFood[currIdx];
            var colSprite = Food.foodSheet.getSprite(food.spriteIndex);
            var colSpriteCanvas = colSprite._spriteCanvas.toDataURL();
            $('#item' + (State.collectedFood.indexOf(food) + 1)).css("background-image", "url('" + colSpriteCanvas + "'");
            Resources.checkoutSound.play();
            currIdx++;
        }, 700);
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
    WaypointGrid.prototype._sameSign = function (num1, num2) {
        if (num1 < 0 && num2 < 0) {
            return true;
        }
        if (num1 > 0 && num2 > 0) {
            return true;
        }
        return false;
    };
    WaypointGrid.prototype._findMinimum = function (nodes, valueFunc) {
        var minNode = null;
        var minValue = Infinity;
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var val = valueFunc(node);
            if (val < minValue) {
                minValue = val;
                minNode = node;
            }
        }
        return minNode;
    };
    WaypointGrid.prototype.findOrthogonalNeighbors = function (node) {
        var x = node.pos.x;
        var y = node.pos.y;
        var sameX = this.nodes.filter(function (n) {
            return n.pos.x === x && n != node;
        });
        var sameXPos = sameX.filter(function (n) {
            return (n.pos.y - node.pos.y) > 0;
        });
        var sameXNeg = sameX.filter(function (n) {
            return (n.pos.y - node.pos.y) < 0;
        });
        var sameY = this.nodes.filter(function (n) {
            return n.pos.y === y && n != node;
        });
        var sameYPos = sameY.filter(function (n) {
            return (n.pos.x - node.pos.x) > 0;
        });
        var sameYNeg = sameY.filter(function (n) {
            return (n.pos.x - node.pos.x) < 0;
        });
        var distanceFcn = function (n) {
            return n.pos.distance(node.pos);
        };
        var posX = this._findMinimum(sameXPos, distanceFcn);
        var negX = this._findMinimum(sameXNeg, distanceFcn);
        var posY = this._findMinimum(sameYPos, distanceFcn);
        var negY = this._findMinimum(sameYNeg, distanceFcn);
        var potentialNeighbors = [posX, negX, posY, negY].filter(function (n) { return n != null; });
        var result = [];
        for (var _i = 0, potentialNeighbors_1 = potentialNeighbors; _i < potentialNeighbors_1.length; _i++) {
            var n = potentialNeighbors_1[_i];
            var tempRay = new ex.Ray(node.pos.clone(), n.pos.sub(node.pos));
            if (tempRay.dir.x === 0) {
                tempRay.dir.x = .0001;
            }
            if (tempRay.dir.y === 0) {
                tempRay.dir.y = .0001;
            }
            if (this.rayCast(tempRay, node.pos.distance(n.pos))) {
                console.log("invalid neighbor");
            }
            else {
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
        var result = false;
        for (var i = 0; i < this._wallBounds.length; i++) {
            result = result || this._wallBounds[i].rayCast(ray, distance);
        }
        return result;
    };
    WaypointGrid.prototype.rayCastTime = function (ray, distance) {
        var minTime = Infinity;
        for (var i = 0; i < this._wallBounds.length; i++) {
            var time = this._wallBounds[i].rayCastTime(ray, distance);
            if (time !== -1) {
                if (time < minTime) {
                    minTime = time;
                }
            }
        }
        if (minTime === Infinity) {
            minTime = -1;
        }
        return minTime;
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
            var neighbors = current.neighbors.filter(function (n) { return !ex.Util.contains(closedNodes, n); });
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
                var point = node.pos.sub(neighbor.pos).normalize().scale(10);
                var finalPoint = neighbor.pos.add(point);
                ex.Util.DrawUtil.point(ctx, ex.Color.Red, finalPoint);
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
        if (Preferences.muteBackgroundMusic) {
            SoundManager.muteBackgroundMusic();
        }
        if (Preferences.muteAll) {
            SoundManager.muteAll();
        }
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
        Resources.ominousMusic.setVolume(0);
        Resources.ominousMusic.setLoop(true);
        Resources.ominousMusic.play();
    };
    SoundManager.stopBackgroundMusic = function () {
        // stop bg music
        Resources.music.setLoop(false);
        Resources.music.stop();
        Resources.ominousMusic.setLoop(false);
        Resources.ominousMusic.stop();
    };
    SoundManager.muteBackgroundMusic = function () {
        Preferences.muteBackgroundMusic = true;
        // mute bg music
        Resources.music.setVolume(0);
        Resources.ominousMusic.setVolume(0);
        SoundManager._updateMusicButton();
    };
    SoundManager.unmuteBackgroundMusic = function () {
        Preferences.muteBackgroundMusic = false;
        // unmute bg music
        Resources.music.setVolume(Config.backgroundVolume);
        Resources.ominousMusic.setVolume(0);
        SoundManager._updateMusicButton();
    };
    SoundManager.playPlayerSpotted = function () {
        Resources.playerSpottedSound.play();
    };
    SoundManager.playSpawnEnemy = function () {
        Resources.spawnEnemySound.play();
    };
    SoundManager.playSpawnFood = function () {
        Resources.spawnFoodSound.play();
    };
    SoundManager.playEnemyCheckout = function () {
        if (SoundManager._playingEnemyCheckoutSequence)
            return;
        SoundManager._playingEnemyCheckoutSequence = true;
        var times = gameRandom.integer(1, Config.foodSpawnCount);
        var wait = 200;
        // temporarily dampen sounds
        // TODO player checkout should restore values
        SoundManager.dampenCheckoutSounds();
        for (var i = 0; i < times; i++) {
            setTimeout(function () { return !State.gameOver && Resources.checkoutSound.play(); }, i * wait);
        }
        setTimeout(function () {
            if (State.gameOver) {
                SoundManager._afterEnemyCheckout();
                return;
            }
            Resources.registerSound.play().then(SoundManager._afterEnemyCheckout);
        }, wait * times + 300);
    };
    SoundManager._afterEnemyCheckout = function () {
        SoundManager._playingEnemyCheckoutSequence = false;
        SoundManager.restoreCheckoutSounds();
    };
    SoundManager.playPlayerCheckout = function () {
        // restore checkout sounds in case enemy just checked out
        SoundManager.restoreCheckoutSounds();
    };
    SoundManager.updateDynamicEnemyPlayerMusic = function () {
        if (Preferences.muteBackgroundMusic || State.gameOver)
            return;
        // Find all enemies currently chasing player
        var chasingEnemies = scnMain.enemies.filter(function (e) { return e.isAttacking; });
        var thresholdDistance = Config.enemyChaseMusicRadius;
        var closestDistance = thresholdDistance;
        for (var _i = 0, chasingEnemies_1 = chasingEnemies; _i < chasingEnemies_1.length; _i++) {
            var e = chasingEnemies_1[_i];
            var playerVector = player.pos.sub(e.pos);
            if (closestDistance && playerVector.magnitude() < closestDistance) {
                closestDistance = playerVector.magnitude();
            }
            else if (!closestDistance) {
                closestDistance = playerVector.magnitude();
            }
        }
        // Clamp to threshold
        closestDistance = Math.min(closestDistance, thresholdDistance);
        // Use closest vector as scale variable for music volume
        var closeFactor = (closestDistance / thresholdDistance) * Config.backgroundVolume;
        // set volume to scale
        Resources.music.setVolume(closeFactor);
        Resources.ominousMusic.setVolume(Config.backgroundVolume - closeFactor);
    };
    SoundManager.dampenCheckoutSounds = function () {
        if (!Preferences.muteAll) {
            Resources.checkoutSound.setVolume(Config.soundVolume * 0.6);
            Resources.registerSound.setVolume(Config.soundVolume * 0.6);
        }
    };
    SoundManager.restoreCheckoutSounds = function () {
        if (!Preferences.muteAll) {
            Resources.checkoutSound.setVolume(Config.soundVolume);
            Resources.registerSound.setVolume(Config.soundVolume);
        }
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
SoundManager._playingEnemyCheckoutSequence = false;
var Director = (function (_super) {
    __extends(Director, _super);
    function Director() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Director.prototype.onInitialize = function () {
        this.on('postupdate', this._update);
    };
    Director.prototype.setup = function () {
        var _this = this;
        ex.Logger.getInstance().info('director setup');
        this._diagIntro = new ex.Actor(player.getRight() + 10, player.y + 5, 175, 48);
        this._diagIntro.anchor.setTo(0, 1);
        this._diagIntro.addDrawing(Resources.diagIntro);
        scnMain.add(this._diagIntro);
        this._zoomOut().then(function () {
            _this._diagIntro.kill();
            _this._showGroceryListTimer = new ex.Timer(function () {
                _this._showGroceryList();
            }, Config.groceryListTime);
            scnMain.add(_this._showGroceryListTimer);
            _this._spawnFoodTimer = new ex.Timer(function () {
                _this._spawnFood();
            }, Config.spawnFoodTime);
            scnMain.add(_this._spawnFoodTimer);
            _this._spawnFirstEnemyTimer = new ex.Timer(function () {
                _this._spawnFirstEnemy();
            }, Config.spawnFirstEnemyTime);
            scnMain.add(_this._spawnFirstEnemyTimer);
            _this.actions.delay(Config.spawnTimedEnemyTime).callMethod(function () {
                _this._spawnTimedEnemy();
            });
        });
    };
    Director.prototype._findMinimum = function (nodes, valueFunc) {
        var minNode = null;
        var minValue = Infinity;
        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
            var node = nodes_2[_i];
            var val = valueFunc(node);
            if (val < minValue) {
                minValue = val;
                minNode = node;
            }
        }
        return minNode;
    };
    Director.prototype._update = function (evt) {
        if (scnMain.enemies && scnMain.enemies.length) {
            var closest = this._findMinimum(scnMain.enemies, function (enemy) {
                return player.pos.distance(enemy.pos);
            });
            // var distanceToPlayer = player.pos.distance(closest.pos);
            // if(distanceToPlayer < Config.enemyVignetteRadius) {
            //    vignette.visible = true;
            //    var segment = Config.enemyVignetteRadius / 4;
            //    var index = (3 -Math.floor(distanceToPlayer / segment)).toFixed(0);
            //    vignette.setDrawing('vignette' + index);
            // } else {
            //    vignette.visible = false;
            // }
        }
    };
    //1. start zoomed in on player, zoom out
    Director.prototype._zoomOut = function () {
        player.disableMovement = true;
        scnMain.camera.zoom(3.5);
        return this.actions.delay(2000).asPromise().then(function () {
            return scnMain.camera.zoom(1, 3000);
        });
    };
    //2. display grocery list
    Director.prototype._showGroceryList = function () {
        console.log('show grocery list');
        $('.playerShoppingList').show();
        player.disableMovement = false;
        //TODO
    };
    //3. spawn in food
    Director.prototype._spawnFood = function () {
        scnMain.spawnFood();
    };
    //4. the first antagonist arrives
    Director.prototype._spawnFirstEnemy = function () {
        Director.enemiesSpawned++;
        scnMain.spawnEnemy(ENEMY_PLAYER_MODE);
    };
    //4b. add more antagonists
    Director.prototype._spawnTimedEnemy = function () {
        var _this = this;
        var spawnTime = gameRandom.integer(Config.enemySpawnMinTime, Config.enemySpawnMaxTime);
        this.actions.delay(spawnTime).callMethod(function () {
            if (State.gameOver || (Director.enemiesSpawned > Config.enemySpawnMaximum))
                return;
            Director.enemiesSpawned++;
            scnMain.spawnEnemy(ENEMY_FOOD_MODE);
            _this._spawnTimedEnemy();
        });
    };
    //5. checkout - game ends
    Director.prototype.checkout = function () {
        // already called (could be triggered multiple times)
        if (State.gameOver)
            return;
        State.gameOverCheckout = true;
        this._handleGameOver();
    };
    Director.prototype.gameOver = function (enemy) {
        // already called (could be triggered multiple times)
        if (State.gameOver)
            return;
        State.gameOverEnemy = true;
        // TODO handle enemy (show on dialog? orchestrate cut scene?)
        this._handleGameOver(enemy);
    };
    Director.prototype.getCharSprite = function () {
        var result = Resources[randCharSheets[randCharSheetIndex]];
        if (randCharSheetIndex == randCharSheets.length - 1) {
            randCharSheetIndex = 0;
        }
        else {
            randCharSheetIndex++;
        }
        return result;
    };
    Director.prototype._handleGameOver = function (enemy) {
        ex.Logger.getInstance().info('game over');
        State.gameOver = true;
        game.stop();
        // reset bg music, in case player was being chased
        if (!Preferences.muteBackgroundMusic) {
            SoundManager.unmuteBackgroundMusic();
        }
        player.shoppingList.handleGameOver();
        $('#game-over-dialog').show();
        $('#game-over-summary-collect').toggleClass('done', player.shoppingList.isEmpty);
        $('#game-over-summary-avoid').toggleClass('done', !State.gameOverEnemy);
        $('#game-over-summary-checkout').toggleClass('done', State.gameOverCheckout);
        var playerSprite = player._leftDrawing;
        var playerCanvas = playerSprite._spriteCanvas.toDataURL();
        $('#player').css("background-image", "url('" + playerCanvas + "'");
        var enemySprite;
        if (State.gameOverEnemy) {
            enemySprite = enemy._rightDrawing;
        }
        else if (State.gameOverCheckout) {
            enemySprite = scnMain.cashier._rightDrawing;
        }
        var enemyCanvas = enemySprite._spriteCanvas.toDataURL();
        $('#enemy').css("background-image", "url('" + enemyCanvas + "'");
    };
    return Director;
}(ex.Actor));
Director.enemiesSpawned = 0;
var Cashier = (function (_super) {
    __extends(Cashier, _super);
    function Cashier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cashier.prototype.onInitialize = function (engine) {
        this._setupDrawing();
    };
    Cashier.prototype._setupDrawing = function () {
        var number = gameRandom.integer(1, 8).toString();
        var sprite = 'charSheet' + number;
        var playerSheet = new ex.SpriteSheet(director.getCharSprite(), 10, 1, 45, 45);
        this.addDrawing('down', playerSheet.getSprite(0));
        this.addDrawing('up', playerSheet.getSprite(3));
        this.addDrawing('left', playerSheet.getSprite(7));
        this.addDrawing('right', playerSheet.getSprite(9));
        this._rightDrawing = playerSheet.getSprite(7);
        // // var walkDownAnim = playerSheet.getAnimationBetween(game, 0, 4, 180);
        // var walkDownAnim = playerSheet.getAnimationByIndices(game, [0, 1, 0, 2], 180)
        // walkDownAnim.loop = true;
        // this.addDrawing('walkDown', walkDownAnim);
        // // var walkUpAnim = playerSheet.getAnimationBetween(game, 4,8, 180);
        // var walkUpAnim = playerSheet.getAnimationByIndices(game, [3, 4, 3, 5], 180);
        // walkUpAnim.loop = true;
        // this.addDrawing('walkUp', walkUpAnim);
        // var walkLeftAnim = playerSheet.getAnimationByIndices(game, [7,6], 200);
        // walkLeftAnim.loop = true;
        // this.addDrawing('walkLeft', walkLeftAnim);
        // var walkRightAnim = playerSheet.getAnimationByIndices(game, [9,8], 200);
        // walkRightAnim.loop = true;
        // this.addDrawing('walkRight', walkRightAnim);
        this.setDrawing('left');
    };
    return Cashier;
}(ex.Actor));
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
console.log("Game seed " + gameRandom.seed);
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
// add the vignette
var vignette = new ex.UIActor(0, 0, game.getDrawWidth(), game.getDrawHeight());
vignette.visible = false;
scnMain.add(vignette);
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
        case ex.Input.Keys.O:
            gameDebug = !gameDebug;
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