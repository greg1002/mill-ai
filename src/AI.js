import Node from './Node.js';

export default function AI(gs, color) {
  this.tree = new Node(gs, color);
  this.interval = null;
  this.color = color;
}

AI.prototype.iterate = function(n) {
  if (n <= 0) {
    return;
  }
  this.tree.select().expand().simulate(50);
  this.iterate(n-1);
}

AI.prototype.register_move = function(move) {
  this.tree.advance(move);
}

AI.prototype.best_move = function() {
  return this.tree.best_move();
}
