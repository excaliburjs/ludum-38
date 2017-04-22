
class Enemy extends ex.Actor {

   public rays: ex.Ray[] = [];
   public forward: ex.Vector;

   public attack = false;

   // todo need reference to the waypoint grid

   constructor(x, y) {
      super(x, y, Config.enemyWidth, Config.enemyHeight);
      this.addDrawing(Resources.enemySheet);

      this.actions.moveTo(x + 300, y, 20)
                  .moveTo(x + 300, y - 100, 20)
                  .moveTo(x, y - 100, 20)
                  .moveTo(x, y, 20).repeatForever();
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
      });

      // set this to postdebugdraw on production
      this.on('postdraw', (evt: ex.PostDrawEvent) => {
         for (var ray of this.rays) {
            // Re-calc distance for debug only
            ex.Util.DrawUtil.vector(evt.ctx, this.attack ? ex.Color.Red : ex.Color.Green, ex.Vector.Zero.clone(), ray.dir, Config.enemyRayLength);
         }
      });
   }

   public checkForPlayer(): boolean {
      var result = false;
      for(var ray of this.rays){
         result = result || player.raycast(ray, Config.enemyRayLength);
      }
      return result;
   }
}