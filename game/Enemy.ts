
class Enemy extends ex.Actor {

   public rays: ex.Ray[] = [];
   public forward: ex.Vector;

   public attack = false;
   public isAttacking = false;

   private _random: ex.Random;

   private _grid: WaypointGrid;

   // todo need reference to the waypoint grid

   constructor(grid: WaypointGrid) {      
      super(0, 0, Config.enemyWidth, Config.enemyHeight);
      this.addDrawing(Resources.enemySheet);

      this._random = new ex.Random(12);
      this._grid = grid;

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

            if(max === Math.abs(vectorToPlayer.x)){
               max = vectorToPlayer.x;
            }

            if(max === Math.abs(vectorToPlayer.y)){
               max = vectorToPlayer.y;
            }

            var newVel = new ex.Vector(max === vectorToPlayer.x ? vectorToPlayer.x : 0, max === vectorToPlayer.y ? vectorToPlayer.y : 0);
            this.vel = newVel;
         } else {
            if((<any>this.actions)._queues[0]._actions.length === 0){

               var start = this._grid.findNode(this.pos.x, this.pos.y);
               this._wander(start);
            }
         }
      });

      // set this to postdebugdraw on production
      this.on('postdraw', (evt: ex.PostDrawEvent) => {
         for (var ray of this.rays) {
            // Re-calc distance for debug only
            ex.Util.DrawUtil.vector(evt.ctx, this.attack ? ex.Color.Red : ex.Color.Green, ex.Vector.Zero.clone(), ray.dir, Config.enemyRayLength);
         }
      });
   }

   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      if (State.gameOver) {
         this.actionQueue.clearActions();
      }
   }

   private _wander(startNode?: WaypointNode) {
      var start = startNode || this._random.pickOne<WaypointNode>(this._grid.nodes);

      this.pos = start.pos;

      var end = this._random.pickOne<WaypointNode>(this._grid.nodes);
      
      var path = this._grid.findPath(start, end);
      
      for(var node of path){
         this.actions.moveTo(node.pos.x, node.pos.y, Config.enemySpeed);
      }

   }

   public checkForPlayer(): boolean {
      var result = false;
      for(var ray of this.rays){
         result = result || player.raycast(ray, Config.enemyRayLength);
         if(!this.isAttacking && result){
            this.isAttacking = true;
            SoundManager.playPlayerSpotted();
         }
      }
      return result;
   }
}