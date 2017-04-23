class WaypointGrid {
   public nodes: WaypointNode[] = [];
   private _cellWidth: number = 0;
   private _cellHeight: number = 0;
   private _wallBounds: ex.BoundingBox[] = [];

   constructor(tileMapCells: ex.Cell[], impassableCells: ex.Cell[]) {
      this._cellWidth = tileMapCells[0].width;
      this._cellHeight = tileMapCells[0].height;
      for(var cell of tileMapCells){
         this.nodes.push(new WaypointNode(cell.x + this._cellWidth/2, cell.y + this._cellHeight/2));  
      }

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

   

   public findOrthogonalNeighbors(node: WaypointNode): WaypointNode[] {
      var x = node.pos.x;
      var y = node.pos.y;
      
      var sameX = this.nodes.filter(n => {
         return n.pos.x === x && n != node;
      });

      var sameY = this.nodes.filter(n => {
         return n.pos.y === y && n != node;
      });

      var minX: number = Infinity;
      var minXNode: WaypointNode;
      var oldMinXNode: WaypointNode;
      for(var i = 0; i < sameX.length; i++){
         var distanceX = sameX[i].pos.distance(node.pos);
         if(distanceX < minX) {
            oldMinXNode = minXNode;
            minXNode = node;
         }
      }

      var minY: number = Infinity;
      var minYNode: WaypointNode;
      var oldMinYNode: WaypointNode;
      for(var j = 0; j < sameY.length; j++){
         var distanceY = sameY[j].pos.distance(node.pos);
         if(distanceY < minY) {
            oldMinYNode = minYNode;
            minYNode = node;
         }
      }

      var potentialNeighbors = [minXNode, oldMinXNode, minYNode, oldMinYNode].filter(n => { return n != null});

      var result = [];
      for(var n of potentialNeighbors){
         var tempRay = new ex.Ray(node.pos.clone(), n.pos.sub(node.pos));
         if(!this.rayCast(tempRay, n.pos.sub(node.pos).magnitude())){
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
      for(var i = 0; i < this._wallBounds.length; i++){
         return this._wallBounds[i].rayCast(ray, distance)
      }
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
         var neighbors = this.findNeighbors(current).filter(n => { return !ex.Util.contains(closedNodes, n) });

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

}