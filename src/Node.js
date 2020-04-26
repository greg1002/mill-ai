import Gamestate from './Gamestate.js';
import _ from 'lodash';

const EXPLORATION_PARAMETER = Math.sqrt(2);

export default function Node(gs) {
  this.ai_color = "B";
  this.gs = gs;
  this.children = new Map();
  this.simulations = 0;
  this.wins = 0;
  this.parent = null;
}

// Expands the tree from this node by [d] layers
Node.prototype.expand = function() {
  const parent = this;
  let children = this.children;
  this.gs.possible_moves.forEach(command => {
    let child = new Node(parent.gs.clone().move(command));
    child.parent = parent;
    children.set(command, child);
    if (parent.gs.turn == child.turn) child.expand();
    return child;
  })
  this.children = children;
  return this;
}

// Chooses a random node from this nodes children
Node.prototype.choose = function() {
  if (this.children.size == 0) throw "This node has no children";
  let child = this.children.get(this.gs.random_move());
  if (child.gs.turn == this.gs.turn) return child.choose();
  else return child;
}

/* Plays out a game randomly from the current gamestate of this node. Returns
  true if ai wins, else false */
Node.prototype.simulate = function() {
  let gs = this.gs.clone();
  while (gs.winner == null) {
    let command = gs.random_move();
    gs.move(command);
  }
  if (gs.winner == this.ai_color) return true;
  else return false;
}

/* Backpropogates the value of [b] from this node */
Node.prototype.backpropogate = function(b) {
  this.simulations++;
  this.wins += this.gs.turn === this.ai_color ? b : !b
  if (this.parent != null) this.parent.backpropogate(b);
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

let t = new Node(new Gamestate("board_standard","B"));
t.expand(1);
for (let i = 0; i < 1000; i++) {
  let chosen = t.select().expand().choose();
  chosen.backpropogate(chosen.simulate());
}
console.log(t);
