
class Enemy extends ex.Actor {

   public rays: ex.Ray[] = [];
   public forward: ex.Vector;

   public attack = false;
   public isAttacking = false;
   public lastKnownPlayerPos: ex.Vector;

   private _grid: WaypointGrid;

   // todo need reference to the waypoint grid

   constructor(grid: WaypointGrid) {      
      super(Config.enemyStart.x, Config.enemyStart.y, Config.enemyWidth, Config.enemyHeight);
      this.addDrawing(Resources.enemySheet);

      this._grid = grid;

      var start = this._grid.findClosestNode(Config.enemyStart.x, Config.enemyStart.y);
      this._wander(start);

      this.rays = new Array<ex.Ray>(Config.enemyRayCount);
      
   }

   onInitialize(engine: ex.Engine) {
      this.collisionType = ex.CollisionType.Passive;
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
               this.isAttacking = false;
            }
         }
      });

      // set this to postdebugdraw on production
      this.on('postdraw', (evt: ex.PostDrawEvent) => {
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
   }

   private _wander(startNode: WaypointNode) {
      var start = startNode;

      var end: WaypointNode = null;
      if(this.lastKnownPlayerPos) {
         end = this._grid.findClosestNode(this.lastKnownPlayerPos.x, this.lastKnownPlayerPos.y);
         this.lastKnownPlayerPos = null;
      } else {
         end = gameRandom.pickOne<WaypointNode>(this._grid.nodes);
      }

      var path = this._grid.findPath(start, end);
            
      for(var node of path){
         this.actions.moveTo(node.pos.x, node.pos.y, Config.enemySpeed);
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
}