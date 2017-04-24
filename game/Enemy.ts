const ENEMY_FOOD_MODE = 'Food';
const ENEMY_PLAYER_MODE = 'Player';
const ENEMY_RANDOM_MODE = 'Random';
const ENEMY_CHECKOUT_MODE = 'Checkout';

type EnemyMode = 
   | typeof ENEMY_FOOD_MODE
   | typeof ENEMY_RANDOM_MODE
   | typeof ENEMY_CHECKOUT_MODE
   | typeof ENEMY_PLAYER_MODE;
class Enemy extends ex.Actor {

   public rays: ex.Ray[] = [];
   public forward: ex.Vector;

   public attack = false;
   public isAttacking = false;
   public lastKnownPlayerPos: ex.Vector;

   private _grid: WaypointGrid;
   private _surpriseSprite: ex.Sprite;

   // todo need reference to the waypoint grid

   constructor(grid: WaypointGrid, public mode: EnemyMode = ENEMY_RANDOM_MODE) {      
      super(Config.enemyStart.x, Config.enemyStart.y, Config.enemyWidth, Config.enemyHeight);

      this._surpriseSprite = Resources.surpriseSheet.asSprite();

      this._grid = grid;

      var start = this._grid.findClosestNode(Config.enemyStart.x, Config.enemyStart.y);
      this._wander(start);

      this.rays = new Array<ex.Ray>(Config.enemyRayCount);
      
   }

   onInitialize(engine: ex.Engine) {
      this._setupDrawing();
      this.collisionType = ex.CollisionType.Passive;

      //make enemies leave the store after a certain amount of time
      var checkoutTimer = new ex.Timer(() => {
         this.mode = ENEMY_CHECKOUT_MODE;
      }, Config.enemyCheckoutTime);

      scnMain.add(checkoutTimer);

      this.on('postupdate', (evt: ex.PostUpdateEvent) => {
         this.attack = false;
         // calculate the forward vector of enemy
         this.forward = this.vel.normalize();

         var forwardAngle = this.vel.toAngle();
         var angleStep = Config.enemyRayCastAngle / Config.enemyRayCount;
         var angleStart = forwardAngle - (Config.enemyRayCastAngle / 2);

         for (var i = 0; i < Config.enemyRayCount; i++) {
            this.rays[i] = new ex.Ray(this.pos.clone(), ex.Vector.fromAngle(angleStart + angleStep * i).scale(Config.enemyRayLength));
         }

         this.attack = this.checkForPlayer();

         SoundManager.updateDynamicEnemyPlayerMusic();

         if (this.attack) {
            // find the vector to the player
            var vectorToPlayer  = player.pos.sub(this.pos);

            // drop current actions
            this.actions.clearActions();

            // Chase only in orthogonal directions
            var max = Math.max(Math.abs(vectorToPlayer.x), Math.abs(vectorToPlayer.y));
            
            this.vel = vectorToPlayer.normalize().scale(Config.enemyChaseSpeed);            
         } else {
            if((<any>this.actions)._queues[0]._actions.length === 0){

               var start = this._grid.findClosestNode(this.pos.x, this.pos.y);
               this._wander(start);
            }
         }
      });

      // set this to postdebugdraw on production
      this.on('postdraw', (evt: ex.PostDrawEvent) => {
         if (this.attack) {
            
            this._surpriseSprite.draw(evt.ctx, -this._surpriseSprite.naturalWidth / 2, -this._surpriseSprite.naturalHeight / 2 - 50);
         }

         if(gameDebug) {
            for (var ray of this.rays) {
               // Re-calc distance for debug only
               ex.Util.DrawUtil.vector(evt.ctx, this.attack ? ex.Color.Red : ex.Color.Green, ex.Vector.Zero.clone(), ray.dir, Config.enemyRayLength);
            }
         }
      });
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
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
         case left :
            this.setDrawing('walkLeft');
            break;
         case right : 
            this.setDrawing('walkRight');
            break;
         case up :
            this.setDrawing('walkUp');
            break;
         case down : 
            this.setDrawing('walkDown');
            break;
      }
   }

   private _wander(startNode: WaypointNode) {
      var start = startNode;

      var end: WaypointNode = null;
      if(this.lastKnownPlayerPos) {
         end = this._grid.findClosestNode(this.lastKnownPlayerPos.x, this.lastKnownPlayerPos.y);
         this.lastKnownPlayerPos = null;
      } else {
         switch(this.mode){
            case ENEMY_FOOD_MODE:
               var foodList = player.shoppingList.getFoodLeft();
               var food = gameRandom.pickOne<Food>(foodList);
               //the player has picked up all or most of the food. Fall back to random mode
               //to prevent enemies from clumping on food
               if(food == null || foodList.length < 3){
                  this.mode = ENEMY_RANDOM_MODE;
               }else{
                  end = this._grid.findClosestNode(food.pos.x, food.pos.y);
                  break;
               }
            case ENEMY_RANDOM_MODE:
               end = gameRandom.pickOne<WaypointNode>(this._grid.nodes);
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
      var checkoutX = 0;      
      for(var i = 0; i < path.length; i++){
         this.actions.moveTo(path[i].pos.x, path[i].pos.y, Config.enemySpeed);
         checkoutX = path[i].pos.x;
      }

      //if the enemy is checking out, after they get to the waypoint near the checkout,
      //manually have them exit the store
      if(this.mode == ENEMY_CHECKOUT_MODE){
         this.actions.moveTo(checkoutX, Config.gameHeight - 90, Config.enemySpeed);
         this.actions.moveTo(1250, Config.gameHeight - 90, Config.enemySpeed);
         this.actions.callMethod(()=>{
            ex.Util.removeItemToArray(this, scnMain.enemies);
            Director.enemiesSpawned -= 1;
            console.log(Director.enemiesSpawned);
         });
         this.actions.die();
      }

   }

   public checkForPlayer(): boolean {
      
      var result = false;
      for(var ray of this.rays){
         var playerTime = player.raycastTime(ray, Config.enemyRayLength);
         if(playerTime !== -1) {
            var wallTime = this._grid.rayCastTime(ray, Config.enemyRayLength);
            if(wallTime === -1){
               wallTime = 99999999;
            }
            if(playerTime !== -1 && playerTime < wallTime){
               result = true;
               this.lastKnownPlayerPos = ray.getPoint(playerTime);

               if(!this.isAttacking && result){
                  this.isAttacking = true;
                  SoundManager.playPlayerSpotted();
               }
               break;
            }
         }
      }
      return result;
   }

   private _setupDrawing() {
      var enemySheet = new ex.SpriteSheet(director.getCharSprite(), 10, 1, 45, 45);
      this.addDrawing('down', enemySheet.getSprite(0));
      this.addDrawing('up', enemySheet.getSprite(3));
      this.addDrawing('left', enemySheet.getSprite(7));
      this.addDrawing('right', enemySheet.getSprite(9));

      var walkDownAnim = enemySheet.getAnimationByIndices(game, [0, 1, 0, 2], 180)
      walkDownAnim.loop = true;
      this.addDrawing('walkDown', walkDownAnim);

      var walkUpAnim = enemySheet.getAnimationByIndices(game, [3, 4, 3, 5], 180);
      walkUpAnim.loop = true;
      this.addDrawing('walkUp', walkUpAnim);

      var walkLeftAnim = enemySheet.getAnimationByIndices(game, [7,6], 200);
      walkLeftAnim.loop = true;
      this.addDrawing('walkLeft', walkLeftAnim);

      var walkRightAnim = enemySheet.getAnimationByIndices(game, [9,8], 200);
      walkRightAnim.loop = true;
      this.addDrawing('walkRight', walkRightAnim);
      
      this.setDrawing('up');
   }
}