import React, { Component } from 'react';
import board_standard from './images/board_standard.png';
import './style/game.css';
import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';
import State from './State.js';


export default class Game extends Component {

  state = {

  }

  render() {
    return (
      <div className="game">
        <h1>Mill</h1>
        <div className="board">
            <Board
            />
        </div>
      </div>
    )
  }
}

class Board extends Component {

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

  render() {
    const pieces = this.state.gs.board.map((column,x) => {
      return (column.map((tile, y) => {
        return (<Space
          x={x} y={y} type={tile}
          makeMoveOnClick={this.makeMoveOnClick}
          />);
      }));
    });
    return (
      <React.Fragment>
        <img src={board_standard} />
        {pieces}
      </React.Fragment>
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
      <div className="piece"
        style={
          {
            top: 100 * this.props.y + 80,
            left: 100 * this.props.x + 80,
            backgroundColor: this.props.type == "B" ? '#404040' :
                                this.props.type == "W" ? '#F1E9C9' : ''
          }
        }/>
    </ReactCursorPosition>
    )
  }

}
