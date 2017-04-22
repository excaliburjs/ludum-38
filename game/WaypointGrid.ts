class WaypointGrid {
   public nodes: WaypointNode[] = [];
   private _cellWidth: number = 0;
   private _cellHeight: number = 0;


   constructor(tileMapCells: ex.Cell[]) {
      this._cellWidth = tileMapCells[0].width;
      this._cellHeight = tileMapCells[0].height;
      for(var cell of tileMapCells){
         this.nodes.push(new WaypointNode(cell.x, cell.y));  
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

   public findNeighbors(node: WaypointNode): WaypointNode[] {
      var nodes = [this.findNode(node.pos.x, node.pos.y - this._cellHeight),
                   this.findNode(node.pos.x - this._cellWidth, node.pos.y),
                   this.findNode(node.pos.x, node.pos.y + this._cellHeight),
                   this.findNode(node.pos.x + this._cellWidth, node.pos.y)].filter(n => {return !!n});

      return nodes;      
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

}