class WaypointGrid {
   public nodes: WaypointNode[];

   constructor(tileMap: Extensions.Tiled.TiledResource) {

      tileMap.data.layers.filter(l => l.name === LAYER_IMPASSABLE).forEach(l => {
         if (typeof l.data == 'string') return;

         for (let i = 0; i < l.data.length; i++) {
            if (l.data[i] !== 0) {
               tileMap.data[i].solid = true;
            }
         }
      })
   }

   public findClosestNode(x, y): WaypointNode {
      return null;
   }


   // by default admissible heuristic of manhattan distance
   public heuristicFcn(start: WaypointNode, end: WaypointNode): number {
      return (Math.abs(start.pos.x - end.pos.x) + Math.abs(start.pos.y - end.pos.y));
   }

   private _buildPath(node: WaypointNode): WaypointNode[] {
      var path: WaypointNode[];
      while(node._previousNode) {
         path.unshift(node);
         node = node._previousNode;
      }
      path.unshift(node);

      return path;
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

      var path = {}
      var bestPathScore = 0;

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

         var neighbors = current.neighbors;

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