import Node from './Node.js';

export default function AI(gs, color) {
  this.tree = new Node(gs, color);
  this.interval = null;
  this.color = color;
}

AI.prototype.run = function() {
  var ai = this;
  this.interval = setInterval(function () {ai.iteration()}, 5);
}

AI.prototype.iteration = function() {
  let chosen = this.tree.select().choose().simulate();
  console.log(this.tree.best_move());
  console.log(this.tree);
}

AI.prototype.registerMove = function(move) {
  this.tree.advance(move);
}

AI.prototype.stop = function() {
  clearInterval(this.interval);
}
