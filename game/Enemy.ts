
class Enemy extends ex.Actor {

   public rays: ex.Ray[] = [];
   public forward: ex.Vector;

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
         // calculate the forward vector of enemy
         this.forward = this.vel.normalize();

         var forwardAngle = this.vel.toAngle();
         var angleStep = Config.enemyRayCastAngle / Config.enemyRayCount;
         var angleStart = forwardAngle - (Config.enemyRayCastAngle / 2);

         for (var i = 0; i < Config.enemyRayCount; i++) {
            this.rays[i] = new ex.Ray(ex.Vector.Zero.clone(), ex.Vector.fromAngle(angleStart + angleStep * i).scale(Config.enemyRayLength));
         }
      });

      // set this to postdebugdraw on production
      this.on('postdraw', (evt: ex.PostDrawEvent) => {
         for (var ray of this.rays) {
            // Re-calc distance for debug only
            ex.Util.DrawUtil.vector(evt.ctx, ex.Color.Red, ex.Vector.Zero.clone(), ray.dir, Config.enemyRayLength);
         }                  
      });
   }

   public rayCastForPlayer(player: Player) {
      
   }

}