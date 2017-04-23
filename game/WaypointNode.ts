class WaypointNode {

   public pos: ex.Vector;
   public neighbors: WaypointNode[];
   public _hscore: number = 0;
   public _gscore: number = 0;
   public _weight: number = 1;
   public _previousNode: WaypointNode = null;

   constructor(x: number, y: number) {
      this.pos = new ex.Vector(x, y);
   }

   public reset() {
      this._hscore = 0;
      this._gscore = 0;
      this._weight = 1;      
      this._previousNode = null;
   }

   public distance(node: WaypointNode){
      var xdiff = node.pos.x - this.pos.x;
      var ydiff = node.pos.y - this.pos.y;
      return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
   }

}