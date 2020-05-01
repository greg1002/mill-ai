import board_layouts from './Layouts.js';
import _ from 'lodash';

export default function Gamestate(board_type, turn) {
  //Player's whose turn it is
  this.turn = turn;
  //Action to do
  this.action = "place";
  //Moves since the beginning of the game
  this.move_count = 1;
  //Board type
  this.board_type = board_type;
  /* Array representing the game board
     For each tile on the board, "B" represents a black piece,
     "W" a white piece, "E" an empty spot, and null no spot at all */
  this.board = JSON.parse(JSON.stringify(board_layouts[this.board_type].init));
  // Temporary placeholder for selected tile after 'move_from' command
  this.selected = null;
  // List of all possible moves from posititon
  this.possible_moves = [];
  // Tuple representing the pieces in game for black and white
  this.pieces = {"B": 0, "W": 0};
  this.winner = null;

  this.get_possible_moves();
}

/* Returns a random valid move for this gamestate */
Gamestate.prototype.random_move = function() {
  return this.possible_moves[Math.floor(Math.random()*this.possible_moves.length)];
}

/* Returns the score in [0,1] representing standing for both players
  1 if win, 0 if loss, or some value on (0,1) based on material
*/
Gamestate.prototype.score = function() {
  let diff = Math.abs(this.pieces["B"] - this.pieces["W"]);
  let score =
    this.winner == "B" ? 1 :
    this.winner == "W" ? 0 :
    // Temporary formula TODO
    this.pieces["B"] > this.pieces["W"] ? (diff + 1) / (diff + 2) :
    1 / (diff + 2);
  return {"B": score, "W": 1 - score}
}

/* Returns true if the placing phase has passed, else false */
Gamestate.prototype.second_phase = function() {
  return this.move_count > board_layouts[this.board_type].pieces * 2
}

/* Clones this game state */
Gamestate.prototype.clone = function() {
  let clone = new Gamestate(this.board_type, this.turn);
  clone.action = this.action;
  clone.move_count = this.move_count;
  clone.board = JSON.parse(JSON.stringify(this.board));
  clone.selected = Object.assign({},this.selected);
  clone.possible_moves = JSON.parse(JSON.stringify(this.possible_moves));
  clone.pieces = Object.assign({},this.pieces);
  clone.winner = this.winner;
  return clone;
}

// Executes a move based on the command and returns/updates the resulting state
Gamestate.prototype.move = function(command) {
  const board_info = board_layouts[this.board_type];

  //checks command validity
  let valid_command = false;
  for (let i = 0; i < this.possible_moves.length; i++) {
    if (_.isEqual(this.possible_moves[i], command)) {
      valid_command = true;
       break;
    }
  }
  if (!valid_command) throw console.error("Invalid Command:", command);

  const last_action = this.action;

  //evaluates command and constructs new state
  if (this.action == "place" || this.action == "move_to") {
    this.board[command.x][command.y] = this.turn;

    if (this.action == "move_to") {
      this.board[this.selected.x][this.selected.y] = "E";
      this.selected = null;
    } else {
      this.pieces[this.turn] += 1;
    }

    //checks if new place for piece would newly form a mill
    let is_new_mill = false;
    for (let i = 0; i < board_info.mills.length; i++) {
      const mill = board_info.mills[i];

      let new_piece_in_mill = false;
      let is_in_mill = true;
      mill.forEach(loc => {
        if (this.board[loc.x][loc.y] != this.turn) {
          is_in_mill = false;
        }
        if (_.isEqual(loc, command)) {
          new_piece_in_mill = true;
        }
      });
      if (is_in_mill && new_piece_in_mill) {
        is_new_mill = true;
        break;
      }
    }

    //makes adjustments to state based on move
    if (is_new_mill) {
      this.action = "take";
    } else {
      this.turn = this.turn == "W" ? "B" : "W";
      this.move_count += 1;
      if (this.second_phase()) {
        this.action = "move_from";
      }
    }
  } else if (this.action == "move_from") {
    this.selected = command;
    this.action = "move_to";
  } else if (this.action == "take") {
    //evaluates command and constructs new state
    this.board[command.x][command.y] = "E";
    const opp = this.turn == "W" ? "B" : "W";
    this.pieces[opp] -= 1;

    //makes adjustments to state based on move
    if (this.second_phase()) {
      if (this.pieces[opp] < 3) {
        this.winner = this.turn;
        return this;
      }
      this.action = "move_from";
    } else {
      this.action = "place";
    }
    this.turn = opp;
  }
  this.get_possible_moves();
  if (this.possible_moves.length == 0) {
      this.winner = this.turn == "W" ? "B" : "W";
  }
  return this;
}

// Returns/updates a list of possible moves from this state
Gamestate.prototype.get_possible_moves = function () {
  if (this.winner != null) return [];

  const possible_moves = [];
  const board = this.board;
  const board_info = board_layouts[this.board_type];
  if (this.action == "move_to") {
    board_info.adjecencies[this.selected.x][this.selected.y].forEach(loc => {
      if (board[loc.x][loc.y] == "E") {
        possible_moves.push({x: loc.x, y: loc.y});
      }
    });
    this.possible_moves = possible_moves;
    return possible_moves;
  }
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (this.action == "place") {
        if (board[x][y] == "E") {
          possible_moves.push({x: x, y: y});
        }
      } else if (this.action == "move_from") {
        //Checks if origin is of player int turn's color
        if (board[x][y] == this.turn) {
          //Checks for each adjacency wheter destination is empty
          let adjecencies = board_info.adjecencies[x][y];
          for (let i = 0; i < adjecencies.length; i++) {
            let loc = adjecencies[i];
            if (board[loc.x][loc.y] == "E") {
              possible_moves.push({x: x, y: y});
            }
          }
        }
      } else if (this.action == "take") {
        //check if tile to take is other player's
        const opposite = this.turn == "W" ? "B" : "W";
        if (board[x][y] != opposite) continue;

        //checks if tile to take is in mill
        let is_in_mill = false;
        for (let i = 0; i < board_info.mills.length; i++) {
          const mill = board_info.mills[i];
          let is_mill = true;
          let xy_in_this_mill = false;
          mill.forEach(loc => {
            if (board[loc.x][loc.y] != opposite) {
              is_mill = false;
              return;
            }
            if (x == loc.x && y == loc.y) {
              xy_in_this_mill = true;
            }
          });
          if (is_mill && xy_in_this_mill) {
            is_in_mill = true;
          }
        }

        //If tile is not in opposing mill, then taking it is possible
        if (!is_in_mill) {
          possible_moves.push({x: x, y: y});
        }
      } else {
        throw "Gamestate.action must be 'place', 'move_to', 'move_from', or 'take'";
        break;
      }
    }
  }
  this.possible_moves = possible_moves;
  return possible_moves;
}
