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


  state = {
    animation_interval: null,
    animation_progression: 1,
    color: 'white'
  }

  componentDidUpdate = (prev_props) => {
    if (prev_props.type != this.props.type) {
      if (prev_props.type === "E") {
        var color = this.props.type == "B" ? BLACK_COLOR :
                     WHITE_COLOR;
        this.setState({color});
        this.startAnimation(true);
      } else {
        this.startAnimation(false);
      }
    }
  }

  startAnimation = (forward) => {
    this.setState({animation_progression: forward ? 0 : 1});
    var animation_interval = setInterval(() => this.animate(forward), 10);
    this.setState({animation_interval});
  }

  animate = (forward) => {
    let animation_progression = this.state.animation_progression +
      (forward ? .05 : -.05)
    if (animation_progression > 1) {
      this.setState({animation_progression: 1})
      clearInterval(this.state.animation_interval);
    } else if (animation_progression < 0) {
      this.setState({animation_progression: 0});
      clearInterval(this.state.animation_interval);
    } else {
      this.setState({animation_progression});
    }
  }

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
              backgroundColor: 'white'
            }}/>
        <div className="piece"
          style={{
              top: 100 * this.props.y + 80 +
              ((1 - this.state.animation_progression) * 20),
              left: 100 * this.props.x + 80 +
              ((1 - this.state.animation_progression) * 20),
              width: this.state.animation_progression * 40,
              height: this.state.animation_progression * 40,
              backgroundColor: this.state.color
            }}/>
      </ReactCursorPosition>
    )
  }

}
