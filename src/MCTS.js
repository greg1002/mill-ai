import score from './Score.js';

const EXPLORATION_PARAMETER = Math.sqrt(2);

export default function MCTS(gs, color) {
  this.tree = new Node(gs, color);
  this.interval = null;
  this.color = color;
}

MCTS.prototype.iterate = function(n) {
  if (n <= 0) {
    return;
  }
  this.tree.select().expand().simulate(25);
  this.iterate(n-1);
}

MCTS.prototype.register_move = function(move) {
  this.tree.advance(move);
}

MCTS.prototype.best_move = function() {
  return this.tree.best_move();
}

MCTS.prototype.win_chance = function() {
  return this.tree.score[this.color] / this.tree.simulations;
}

function Node(gs) {
  this.gs = gs;
  this.children = new Map();
  this.simulations = 0;
  this.score = {"B": 0, "W": 0};
  this.parent = null;
}

Node.prototype.toPrimitive = function(move) {
  return move.x * 100 + move.y
}

/* Returns the child of this node bound to [move]. Creates a new node if
  the child bound to [move] doesn't exist yet
*/
Node.prototype.get_child = function(move) {
  let child = this.children.get(this.toPrimitive(move));
  if (child == null) {
    child = new Node(this.gs.clone().move(move));
    child.parent = this;
    this.children.set(this.toPrimitive(move), child);
  }
  return child;
}

// Expands the tree from this node randomly
Node.prototype.expand = function() {
  if (this.gs.possible_moves.length === 0) return this;
  else return this.get_child(this.gs.random_move());
}

// Advances the tree by a move
Node.prototype.advance = function(move) {
  let child = this.get_child(move);
  this.gs = child.gs;
  this.children = child.children;
  this.simulations = child.simulations;
  this.score = child.score;
  this.parent = null;
}

/* Plays out a game randomly from the current gamestate of this node. Returns
  true if ai wins, else false */
Node.prototype.simulate = function(n) {
  let gs = this.gs.clone();
  let i = 0;
  while (i < n) {
    if (gs.winner != null) break;
    gs.move(gs.random_move());
    i++;
  }
  this.backpropogate(score(gs));
}

/* Returns the best move for player whose turn it is on this node's gamestate */
Node.prototype.best_move = function() {
  let max_winrate = 0;
  let best_move = null;
  for (let i = 0; i < this.gs.possible_moves.length; i++) {
    let move = this.gs.possible_moves[i];
    let child = this.get_child(move);
    let winrate = child.score[this.gs.turn] / child.simulations;
    if (winrate > max_winrate) {
      best_move = move;
      max_winrate = winrate;
    }
  }
  return best_move
}

/* Backpropogates the value of [s] from this node */
Node.prototype.backpropogate = function(s) {
  this.simulations++;
  this.score["B"] += s["B"];
  this.score["W"] += s["W"];
  if (this.parent != null) this.parent.backpropogate(s);
}

//Returns the upper confidence bound of this node
Node.prototype.UCT = function(move) {
  let child = this.get_child(move);
  if (child.simulations === 0) {
    return 100;
  }
  return child.score[this.gs.turn] / child.simulations + EXPLORATION_PARAMETER * Math.sqrt(Math.log(this.simulations) / child.simulations);
}

// Returns true if current node is leaf, else false
Node.prototype.is_leaf = function() {
  return (this.children.size === 0 || this.gs.possible_moves.length === 0);
}

/* Travels down the tree until hitting a leaf node and returns it, selecting
   a new Node based on the max UCT among a node's children */
Node.prototype.select = function() {
  if (this.is_leaf()) return this;
  let selectedMove = this.gs.possible_moves[0];
  let maxUCT = this.UCT(selectedMove);
  for (let i = 1; i < this.gs.possible_moves.length; i++) {
    let move = this.gs.possible_moves[i];
    let uct = this.UCT(move);
    if (uct > maxUCT) {
      selectedMove = move;
      maxUCT = uct;
    }
    if (maxUCT === 100) break;
  }
  return this.get_child(selectedMove).select()
}
