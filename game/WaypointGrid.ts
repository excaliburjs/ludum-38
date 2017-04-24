class WaypointGrid {
   public nodes: WaypointNode[] = [];
   private _cellWidth: number = 0;
   private _cellHeight: number = 0;
   private _wallBounds: ex.BoundingBox[] = [];

   constructor(nodes: WaypointNode[], impassableCells: ex.Cell[]) {
      this.nodes = nodes;  
      
      for(var wall of impassableCells){
         this._wallBounds.push(wall.getBounds());
      }

      this._processNeighbors();
   }

   private _processNeighbors(){
      for(var node of this.nodes){
         node.neighbors = this.findNeighbors(node);
      }
   }

   public findNode(x, y): WaypointNode {
      return this.nodes.filter(n => {
         return n.pos.x === x && n.pos.y === y;
      })[0] || null;
   }

   public findClosestNode(x: number, y: number): WaypointNode {
      var minNode: WaypointNode;
      var oldMinNode: WaypointNode;
      var minDistance: number = Infinity;
      var point = new ex.Vector(x, y);
      for(var n of this.nodes){
         if(n.pos.distance(point) <= minDistance){
            oldMinNode = minNode;
            minNode = n;
            minDistance = n.pos.distance(point);
         }
      }
      return minNode;
   }

   public findNeighbors(node: WaypointNode): WaypointNode[] {
      var nodes = this.findOrthogonalNeighbors(node);/*[this.findNode(node.pos.x, node.pos.y - this._cellHeight),
                   this.findNode(node.pos.x - this._cellWidth, node.pos.y),
                   this.findNode(node.pos.x, node.pos.y + this._cellHeight),
                   this.findNode(node.pos.x + this._cellWidth, node.pos.y)].filter(n => {return !!n}); */
                   

      return nodes;      
   }

   private _sameSign(num1: number, num2: number){
      if(num1 < 0 && num2 < 0){
         return true;
      }

      if(num1 > 0 && num2 > 0){
         return true;
      }
      return false;
   }

   private _findMinimum<T>(nodes: T[], valueFunc: (node: T) => number): T {
      var minNode: T = null;
      var minValue: number = Infinity;
      for(var node of nodes){
         var val = valueFunc(node);
         if(val < minValue){
            minValue = val;
            minNode = node;
         }
      }
      return minNode;
   }

   public findOrthogonalNeighbors(node: WaypointNode): WaypointNode[] {
      var x = node.pos.x;
      var y = node.pos.y;
      
      var sameX = this.nodes.filter(n => {
         return n.pos.x === x && n != node;
      });

      var sameXPos = sameX.filter(n => {
         return (n.pos.y - node.pos.y) > 0;
      });

      var sameXNeg = sameX.filter(n => {
         return (n.pos.y - node.pos.y) < 0;
      });

      var sameY = this.nodes.filter(n => {
         return n.pos.y === y && n != node;
      });

      var sameYPos = sameY.filter(n => {
         return (n.pos.x - node.pos.x) > 0;
      });

      var sameYNeg = sameY.filter(n => {
         return (n.pos.x - node.pos.x) < 0;
      })

      var distanceFcn = (n) => {
         return n.pos.distance(node.pos);
      }

      var posX = this._findMinimum(sameXPos, distanceFcn);

      var negX = this._findMinimum(sameXNeg, distanceFcn);

      var posY = this._findMinimum(sameYPos, distanceFcn);

      var negY = this._findMinimum(sameYNeg, distanceFcn);

      var potentialNeighbors = [posX, negX, posY, negY].filter(n => { return n != null});

      var result = [];
      for(var n of potentialNeighbors){
         var tempRay = new ex.Ray(node.pos.clone(), n.pos.sub(node.pos));
         if(tempRay.dir.x === 0){
            tempRay.dir.x = .0001
         }
         if(tempRay.dir.y === 0){
            tempRay.dir.y = .0001
         }
         if(this.rayCast(tempRay, node.pos.distance(n.pos))) {
            ex.Logger.getInstance().debug("Waypoint Grid: invalid neighbor");            
         } else {
            result.push(n);
         }
      }
      return result;
   }

   
   // by default admissible heuristic of manhattan distance
   public heuristicFcn(start: WaypointNode, end: WaypointNode): number {
      return (Math.abs(start.pos.x - end.pos.x) + Math.abs(start.pos.y - end.pos.y));
   }

   private _buildPath(node: WaypointNode): WaypointNode[] {
      var path: WaypointNode[] = [];
      while(node._previousNode) {
         path.unshift(node);
         node = node._previousNode;
      }
      path.unshift(node);

      this.nodes.forEach(n => n.reset());

      return path;
   }

   public rayCast(ray: ex.Ray, distance: number): boolean {
      var result = false;
      for(var i = 0; i < this._wallBounds.length; i++){
          result = result || this._wallBounds[i].rayCast(ray, distance)
      }

      return result;
   }

   public rayCastTime(ray: ex.Ray, distance: number): number {
      
      var minTime: number = Infinity;
      for(var i = 0; i < this._wallBounds.length; i++){
          var time = this._wallBounds[i].rayCastTime(ray, distance)
          if(time !== -1){
             if(time < minTime){
                minTime = time;
             }
          }
      }

      if(minTime === Infinity){
         minTime = -1;
      }
      return minTime;
   }

   public findPath(start: WaypointNode, end: WaypointNode) {
      
      // reset each node
      this.nodes.forEach(n => n.reset());

      var startingNode = start;
      var endingNode = end;

      startingNode._gscore = 0;
      startingNode._hscore = startingNode._gscore + this.heuristicFcn(startingNode, endingNode);

      var openNodes: WaypointNode[] = [startingNode];
      var closedNodes: WaypointNode[] = []

     while(openNodes.length > 0){
         // Find the lowest heuristic node in the open nodes list
         var current = openNodes.sort((a,b) => {
           return a._hscore - b._hscore;
         })[0];

         // Done
         if(current == endingNode) {
            return this._buildPath(current);
         }

         // Remove current node from open
         ex.Util.removeItemToArray(current, openNodes);
         closedNodes.push(current);

         // Find neighbors we haven't explored
         var neighbors = current.neighbors.filter(n => { return !ex.Util.contains(closedNodes, n) });

         // Calculate neighbor heuristics
         neighbors.forEach(n => {
            if(!ex.Util.contains(openNodes, n)){
               n._previousNode = current;
               n._gscore = n._weight + current._gscore;
               n._hscore = n._gscore + this.heuristicFcn(n, endingNode);
               openNodes.push(n);
            }
         })
      }

      // no path found
      return [];

   }

   draw(ctx: CanvasRenderingContext2D){
      for(var node of this.nodes){
         ex.Util.DrawUtil.point(ctx, ex.Color.Green, node.pos);
         for(var neighbor of node.neighbors){
            ex.Util.DrawUtil.line(ctx, ex.Color.Green, node.pos.x, node.pos.y, neighbor.pos.x, neighbor.pos.y)
            var point = node.pos.sub(neighbor.pos).normalize().scale(10);
            var finalPoint = neighbor.pos.add(point);
            ex.Util.DrawUtil.point(ctx, ex.Color.Red, finalPoint);
         }
      }
   }

}