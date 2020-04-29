import Gamestate from './Gamestate.js';
import _ from 'lodash';

const EXPLORATION_PARAMETER = Math.sqrt(2);

export default function Node(gs) {
  this.gs = gs;
  this.children = new Map();
  this.simulations = 0;
  this.wins = {"B": 0, "W": 0};
  this.parent = null;
}

Node.prototype.toPrimitive = function(move) {
  return move.x * 100 + move.y
}

Node.prototype.get_child = function(move) {
  let child = this.children.get(this.toPrimitive(move));
  if (child == null) return this.expand(move);
  else return child;
}

// Expands the tree from this node by [d] layers
Node.prototype.expand = function(move) {
  let child = this.children.get(this.toPrimitive(move));
  if (child == null) {
    child = new Node(this.gs.clone().move(move));
    child.parent = this;
    this.children.set(this.toPrimitive(move), child);
  }
  return child;
}

// Chooses a random node from this nodes children
Node.prototype.choose = function() {
  return this.get_child(this.gs.random_move());
}

Node.prototype.advance = function(move) {
  let child = this.get_child(move);
  this.gs = child.gs;
  this.children = child.children;
  this.simulations = child.simulations;
  this.wins = child.wins;
  this.parent = null;
}

/* Plays out a game randomly from the current gamestate of this node. Returns
  true if ai wins, else false */
Node.prototype.simulate = function() {
  let gs = this.gs.clone();
  while (gs.winner == null) {
    gs.move(gs.random_move());
  }
  this.backpropogate(gs.winner);
}

Node.prototype.best_move = function() {
  let max_winrate = 0;
  let best_move = null;
  for (let i = 0; i < this.gs.possible_moves.length; i++) {
    let move = this.gs.possible_moves[i];
    let child = this.get_child(move);
    let winrate = child.wins[child.gs.turn] / child.simulations;
    if (winrate > max_winrate) {
      best_move = move;
      max_winrate = winrate;
    }
  }
  return best_move
}

/* Backpropogates the value of [b] from this node */
Node.prototype.backpropogate = function(w) {
  this.simulations++;
  this.wins[w]++;
  if (this.parent != null) this.parent.backpropogate(w);
}

//Returns the upper confidence bound of this node
Node.prototype.UCT = function() {
  if (this.parent == null) {
    return 0;
  }
  if (this.simulations == 0) {
    return 100;
  }
  return this.wins[this.gs.turn] / this.simulations + EXPLORATION_PARAMETER * Math.sqrt(Math.log(this.parent.simulations) / this.simulations);
}

// Returns true if current node is leaf, else false
Node.prototype.is_leaf = function() {
  return (this.children.size == 0 || this.gs.possible_moves.length == 0);
}

/* Travels down the tree until hitting a leaf node and returns it, selecting
   a new Node based on the max UCT among a node's children */
Node.prototype.select = function() {
  if (this.is_leaf()) return this;
  let maxUCT = 0;
  let selectedChild = null;
  for (let i = 0; i < this.gs.possible_moves.length; i++) {
    let move = this.gs.possible_moves[i];
    let child = this.get_child(move);
    let uct = child.UCT();
    if (uct > maxUCT) {
      selectedChild = child;
      maxUCT = uct;
    }
    if (maxUCT == 100) break;
  }
  return selectedChild.select()
}
