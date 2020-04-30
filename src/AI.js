import Node from './Node.js';

export default function AI(gs, color) {
  this.tree = new Node(gs, color);
  this.interval = null;
  this.color = color;
}

AI.prototype.run = function() {
  var ai = this;
  this.interval = setInterval(function () {ai.iterate(30)}, 10);
}

AI.prototype.iterate = function(n) {
  if (n <= 0) {
    console.log(this.tree.best_move());
    console.log(this.tree);
    return;
  }
  this.tree.select().choose().simulate(50);
  this.iterate(n-1);
}

AI.prototype.registerMove = function(move) {
  this.tree.advance(move);
}
