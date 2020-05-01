import React, { Component } from 'react';
import board_standard from './images/board_standard.png';
import './style/game.css';
import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';
import Gamestate from './Gamestate.js';

const WHITE_COLOR = '#F1E9C9';
const BLACK_COLOR = '#404040';

export default class Board extends Component {

  makeMoveOnClick = (x, y) => {
    if (this.tileIsActive(x,y))
      this.props.makeMove(x,y)
  }

  tileIsActive = (x, y) => {
    if (!this.props.player_turn) return false;
    let isActive = false;
    this.props.gs.possible_moves.forEach(item => {
      if (x == item.x && y == item.y) {
        isActive = true;
        return;
      }
    });
    return isActive;
  }

  getPieces = () => {
    const {gs} = this.props;
    const {player_turn} = this.props;
    let i = -1;
    return (
        gs.board.map((column,x) => {
        return (column.map((tile, y) => {
          i++;
          let possibleMove = false;
          if (player_turn) {
            gs.possible_moves.forEach(move => {
              if (move.x == x && move.y == y) {
                possibleMove = true;
                return;
              }
            });
          }
          if (tile != null) {
          return (
              <Space
              x={x} y={y} type={tile} key={i}
              possibleMove={possibleMove}
              action={gs.action}
              makeMoveOnClick={this.makeMoveOnClick}
              />);
          } else return
        }));
      })
    )
  }

  onEnter = () => {
    console.log("works");
  }

  render() {
    return (
      <div className="game">
        <div className="board">
          <img src={board_standard} />
          {this.getPieces()}
        </div>
      </div>
    )
  }
}

class Space extends Component {


  state = {}

  onMouseClick = () => {
    this.props.makeMoveOnClick(this.props.x, this.props.y);
  }

  render() {
    return (
      <ReactCursorPosition
        activationInteractionMouse={INTERACTIONS.CLICK}
        onActivationChanged={this.onMouseClick}
      >
        {this.props.possibleMove ? <div className="piece-outline"
          style ={{
            top: 100 * this.props.y + 78,
            left: 100 * this.props.x + 78,
            backgroundColor: this.props.action == 'take' ? 'red' : 'black'
          }}/> : <div />}
        <div className="piece"
          style={{
              top: 100 * this.props.y + 80,
              left: 100 * this.props.x + 80,
              backgroundColor: this.props.type == "B" ? BLACK_COLOR :
                                  this.props.type == "W" ? WHITE_COLOR : 'white'
            }}/>
      </ReactCursorPosition>
    )
  }

}
