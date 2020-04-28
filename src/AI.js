import Node from './Node.js';

export default function AI(gs, color) {
  this.tree = new Node(gs, color);
  this.interval = null;
  this.color = color;
}

AI.prototype.run = function() {
  var ai = this;
  this.interval = setInterval(function () {ai.iteration()}, 10);
}

AI.prototype.iteration = function() {
  let chosen = this.tree.select().expand().choose();
  chosen.backpropogate(chosen.simulate());
  console.log(this.tree);
}

AI.prototype.registerMove = function(move) {
  this.tree = this.tree.advance(move);
}

AI.prototype.stop = function() {
  clearInterval(this.interval);
}
