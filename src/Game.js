import React, { Component } from 'react';
import board_standard from './images/board_standard.png';
import './style/game.css';
import ReactCursorPosition from 'react-cursor-position';
import State from './State.js';


export default class Game extends Component {

  state = {}

  render() {
    return (
      <div className="game">
        <h1>Mill</h1>
        <div className="board">
          <ReactCursorPosition>
            <Board />
          </ReactCursorPosition>
        </div>
      </div>
    )
  }
}

class Board extends Component {

  state = new State("board_standard","B")

  onPositionChanged = (data) => {
    
  }

  render() {
    return (
      <img src={board_standard} />
    )
  }
}
