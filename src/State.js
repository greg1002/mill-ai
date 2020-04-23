import board_layouts from './Layouts.js';
import _ from 'lodash';

export default function State(board_type, turn) {
  //Player's whose turn it is
  this.turn = turn;
  //Action to do
  this.action = "place";
  //Moves since the beginning of the game
  this.move_count = 1;
  //Board type
  this.board_type = board_type;
  //Array representing the game board
  // For each tile on the board, "B" represents a black piece,
  // "W" a white piece, "E" an empty spot, and null no spot at all
  this.board = board_layouts[this.board_type].init;
  this.selected = null;
  this.possible_moves = this.get_possible_moves();
  this.pieces = {"B": 0, "W": 0};
  this.winner = null;
}

State.prototype.move = function(command) {
  let _this = this;
  const board_info = board_layouts[this.board_type];

  //checks command validity
  let valid_command = false;
  for (let i = 0; i < _this.possible_moves.length; i++) {
    if (_.isEqual(_this.possible_moves[i], command)) {
      valid_command = true;
       break;
    }
  }
  if (!valid_command) throw console.error("Invalid Command");

  const last_action = _this.action;

  //evaluates command and constructs new state
  if (_this.action == "place" || _this.action == "move_to") {
    _this.board[command.x][command.y] = _this.turn;

    if (_this.action == "move_to") {
      _this.board[_this.selected.x][_this.selected.y] = "E";
      _this.selected = null;
    } else {
      _this.pieces[_this.turn] += 1;
    }

    //checks if new place for piece would newly form a mill
    let is_new_mill = false;
    for (let i = 0; i < board_info.mills.length; i++) {
      const mill = board_info.mills[i];

      let new_piece_in_mill = false;
      let is_in_mill = true;
      mill.forEach(loc => {
        if (_this.board[loc.x][loc.y] != _this.turn) {
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
      _this.action = "take";
      _this.possible_moves = _this.get_possible_moves();
    }
    if (!is_new_mill || _this.possible_moves.length == 0) {
      _this.turn = _this.turn == "W" ? "B" : "W";
      _this.move_count += 1;
      if (_this.move_count > board_info.pieces * 2) {
        _this.action = "move_from";
      }
    }
  } else if (_this.action == "move_from") {
    _this.selected = command;
    _this.action = "move_to";
  } else if (_this.action == "take") {
    //evaluates command and constructs new state
    _this.board[command.x][command.y] = "E";
    const opp = _this.turn == "W" ? "B" : "W";
    _this.pieces[opp] -= 1;

    //makes adjustments to state based on move
    if (_this.move_count > board_info.pieces * 2) {
      if (_this.pieces[opp] < 3) {
        _this.winner = _this.turn;
      }
      _this.action = "move_from";
    } else {
      _this.action = "place";
    }
    _this.turn = opp;
  }
  _this.possible_moves = _this.get_possible_moves();
  if (_this.possible_moves.length == 0) {
    if (_this.action == "take") {
      _this.winner = _this.turn
    } else {
      _this.winner = _this.turn == "W" ? "B" : "W";
    }
  }
  console.log(_this);
  return _this;
}

State.prototype.get_possible_moves = function () {
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
          board_info.adjecencies[x][y].forEach(loc => {
            if (board[loc.x][loc.y] == "E") {
              possible_moves.push({x: x, y: y});
              return;
            }
          });
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
            console.log(mill);
            is_in_mill = true;
          }
        }

        //If tile is not in opposing mill, then taking it is possible
        if (!is_in_mill) {
          possible_moves.push({x: x, y: y});
        }
      } else {
        throw "State.action must be 'place', 'move_to', 'move_from', or 'take'";
        break;
      }
    }
  }
  return possible_moves;
}

var state = new State("board_standard", "B");
