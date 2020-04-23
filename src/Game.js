import React, { Component } from 'react';
import board_standard from './images/board_standard.png';
import './style/game.css';
import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';
import State from './State.js';

const WHITE_COLOR = '#F1E9C9';
const BLACK_COLOR = '#404040';

export default class Game extends Component {

  state = {
    gs: new State("board_standard","B")
  }

  makeMoveOnClick = (x, y) => {
    if (this.tileIsActive(x,y)) {
      var newState = this.state.gs.move({x: x, y: y});
      this.setState({gs: newState});
    }
  }

  tileIsActive = (x, y) => {
    let isActive = false;
    this.state.gs.possible_moves.forEach(item => {
      if (x == item.x && y == item.y) {
        isActive = true;
        return;
      }
    });
    return isActive;
  }

  getInfoText = () => {
    const {gs} = this.state;
    return (
      <h2 style={{
          color: gs.winner == "B" ? 'black' :
                 gs.winner == "W" ? 'white' :
                 gs.turn == "B" ? 'black' : 'white'
      }}>{
        gs.winner == "B" ? "Black wins!" :
        gs.winner == "W" ? "White wins!" :
        (gs.turn == "B" ? "black" : "white") + " to " +
        (gs.action == "place" ? "place" :
          gs.action == "take" ? "take" :
          "move")
      }</h2>
    )
  }

  getPieces = () => {
    const {gs} = this.state;
    let i = -1;
    return (
        gs.board.map((column,x) => {
        return (column.map((tile, y) => {
          i++;
          let possibleMove = false;
          gs.possible_moves.forEach(move => {
            if (move.x == x && move.y == y) {
              possibleMove = true;
              return;
            }
          })
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
        <h1>Mill</h1>
        <div className="board">
          <img src={board_standard} />
          {this.getPieces()}
        </div>
        <h2>{this.getInfoText()}</h2>
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
