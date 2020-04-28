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

Node.prototype.toPrimitive = function(command) {
  return command.x * 100 + command.y
}

// Expands the tree from this node by [d] layers
Node.prototype.expand = function() {
  const parent = this;
  let children = this.children;
  this.gs.possible_moves.forEach(command => {
    let child = new Node(parent.gs.clone().move(command));
    child.parent = parent;
    children.set(this.toPrimitive(command), child);
    if (parent.gs.turn == child.gs.turn) child.expand();
    return child;
  })
  this.children = children;
  return this;
}

// Chooses a random node from this nodes children
Node.prototype.choose = function() {
  if (this.children.size == 0) this.children.expand();
  let child = this.children.get(this.toPrimitive(this.gs.random_move()));
  if (child.gs.turn == this.gs.turn) return child.choose();
  else return child;
}

Node.prototype.advance = function(move) {
  let child = this.children.get(this.toPrimitive(move));
  child.parent = null;
  return child;
}

/* Plays out a game randomly from the current gamestate of this node. Returns
  true if ai wins, else false */
Node.prototype.simulate = function() {
  let gs = this.gs.clone();
  while (gs.winner == null) {
    let command = gs.random_move();
    gs.move(command);
  }
  return gs.winner;
}

/* Backpropogates the value of [b] from this node */
Node.prototype.backpropogate = function(w) {
  this.simulations++;
  this.wins[w]++;
  if (this.parent != null) this.parent.backpropogate(w);
}

//Returns the upper confidence bound of this node
Node.prototype.UCT = function() {
  if (this.parent == null) return 0;
  if (this.simulations == 0) return 100;
  return this.wins[this.gs.turn] / this.simulations + EXPLORATION_PARAMETER * Math.sqrt(Math.log(this.parent.simulations) / this.simulations);
}

// Returns true if current node is leaf, else false
Node.prototype.is_leaf = function() {
  return (this.children.size == 0);
}

/* Travels down the tree until hitting a leaf node and returns it, selecting
   a new Node based on the max UCT among a node's children */
Node.prototype.select = function() {
  if (this.children.size == 0) return this;
  let maxUCT = 0;
  let selectedChild = null;
  for (let [key, value] of this.children) {
    let uct = value.UCT();
    if (uct > maxUCT) {
      selectedChild = value;
      maxUCT = uct;
    }
  }
  return selectedChild.select()
}
