import Gamestate from './Gamestate.js';
import _ from 'lodash';

const EXPLORATION_PARAMETER = Math.sqrt(2);

export default function Node(gs) {
  this.gs = gs;
  this.children = new Map();
  this.simulations = 0;
  this.wins = 0;
  this.parent = null;
}

// Expands the tree from this node by [d] layers
Node.prototype.expand = function(d) {
  if (d < 1) return;
  const parent = this;
  let children = this.children;
  this.gs.possible_moves.forEach(command => {
    let child = new Node(parent.gs.clone().move(command));
    child.parent = parent;
    children.set(command, child);
    if (parent.gs.turn === child.turn) child.expand(d);
    else child.expand(d - 1);
    return child;
  })
  this.children = children;
}

//Returns the upper confidence bound of this node
Node.prototype.UCT = function() {
  if (this.parent == null) return 0;
  if (this.simulations == 0) return 100;
  return this.wins / this.simulations + EXPLORATION_PARAMETER * Math.sqrt(Math.log(this.parent.simulations) / this.simulations);
}

// Returns true if current node is leaf, else false
Node.prototype.is_leaf = function() {
  return (this.children.size == 0);
}

// Travels down the tree until hitting a leaf node and returns it, selecting
// a new Node based on the max UCT among a node's children
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
