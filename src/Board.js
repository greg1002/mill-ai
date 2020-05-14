import React, { Component } from 'react';
import board_standard from './images/board_standard.png';
import './style/game.css';
import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';
import Gamestate from './Gamestate.js';
import _ from 'lodash';

const WHITE_COLOR = '#F1E9C9';
const BLACK_COLOR = '#404040';

export default class Board extends Component {

  render() {
    return (
      <div className="game">
        <div className="board">
          <img src={board_standard} />
          <Bars
            gs={this.props.gs}
            animation_progression={this.props.animation_progression}
            is_animating={this.props.is_animating}
          />
          <Spaces
            gs={this.props.gs}
            player_turn={this.props.player_turn}
            animation_progression={this.props.animation_progression}
            makeMove={this.props.makeMove}
          />
        </div>
      </div>
    )
  }
}

class Bars extends Component {

  state = {
    mills: [],
    update_lock: true
  }

  componentDidUpdate = (prev_props) => {
    const {gs, is_animating} = this.props;

    if (this.state.update_lock && prev_props.is_animating != is_animating) {
      console.log(is_animating);
      var mills = [];
      if (is_animating) {
        mills = this.state.mills;
      }
      gs.mills["B"].forEach(mill => {
        mills.push({mill: mill, color: "B"});
      });
      gs.mills["W"].forEach(mill => {
        mills.push({mill: mill, color: "W"});
      });
      this.setState({mills, update_lock: false});
    } else if (!this.state.update_lock && prev_props.is_animating == is_animating) {
      this.setState({update_lock: true})
    }
  }

  getBars = () => {
    const {gs, animation_progression} = this.props
    const last_moves = gs.last_moves();
    return this.state.mills.map((item, i) => {
        const {mill, color} = item;
        var animation_type = null;
        last_moves.forEach(last_move => {
          for (i = 0; i < mill.length; i++) {
            var loc = mill[i];
            if (last_move.command.x == loc.x && last_move.command.y == loc.y) {
              animation_type = {"target": i, "type":
                last_move.action == "take" || last_move.action == "move_from" ?
                  "exit" : "enter"
              };
              return;
            }
          }
        });

        return (
          <Bar
            key={i}
            color={color}
            mill={mill}
            animation_type={animation_type}
            animation_progression={animation_progression}
          />
        )
    });
  }

  render () {
    return (
      <React.Fragment>
        {this.getBars()}
      </React.Fragment>
    )
  }
}

class Bar extends Component {

  getColor = (color) => {
    return color == "B" ? BLACK_COLOR :
        WHITE_COLOR;
  }

  getBar = (dimensions) => {
    return (
      <div
        className="bar"
        style={{...dimensions,...{
          backgroundColor: this.getColor(this.props.color)
        }}}
      />
    )
  }

  getBarSections = () => {
    const {animation_type, animation_progression, mill, color} = this.props;
    if (animation_type == null || animation_type.target != 1) {
      var dimensions;
      var min_x = Math.min(mill[0].x,mill[2].x);
      var min_y = Math.min(mill[0].y,mill[2].y);
      var max_x = Math.max(mill[0].x,mill[2].x);
      var max_y = Math.max(mill[0].y,mill[2].y);
      var size = 1;
      if (animation_type != null) {
        size = animation_type.type === "enter" ? animation_progression :
         1 - animation_progression;
      }
      var dimensions = {
        top: 100 * (min_y + (max_y - min_y) * (1 - size) / 2) + 95,
        left: 100 * (min_x + (max_x - min_x) * (1 - size) / 2) + 95,
        width: ((max_x - min_x) * 100 * size) + 10,
        height: ((max_y - min_y) * 100 * size) + 10
      }
      return this.getBar(dimensions);
    } else {
      // TODO
      return <div />
    }
  }

  render () {
    return (
      <React.Fragment>{this.getBarSections()}</React.Fragment>
    )
  }
}

class Spaces extends Component {

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
    const {gs, player_turn} = this.props;
    var last_moves = gs.last_moves();
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
          let animation_type = null;
          last_moves.forEach(move => {
            if (move.command.x == x && move.command.y == y) {
              if (move.action === "move_from" || move.action === "take")
                animation_type = "exit";
              else animation_type = "enter";
              return;
            }
          });
          if (tile != null) {
            return (
                <Space
                x={x} y={y} type={tile} key={i}
                possibleMove={possibleMove}
                action={gs.action}
                makeMoveOnClick={this.makeMoveOnClick}
                animation_type={animation_type}
                animation_progression={this.props.animation_progression}
                />
            );
          } else return
        }));
      })
    )
  }

  render () {
    return this.getPieces()
  }
}

class Space extends Component {


  state = {
    color: 'white'
  }

  getColor = (type) => {
    return type == "B" ? BLACK_COLOR :
                 type == "W" ? WHITE_COLOR : 'white';
  }

  componentDidUpdate = (prev_props) => {
    if (prev_props.type === "E" && this.props.type !== "E") {
      var color = this.props.type == "B" ? BLACK_COLOR :
                   WHITE_COLOR;
      this.setState({color});
    }
  }

  getDimensions = () => {
    var {animation_type, animation_progression} = this.props;
    var size = animation_type === "enter" ? animation_progression :
               animation_type === "exit" ? 1 - animation_progression : 1;
    return {
      top: 100 * this.props.y + 80 +
      ((1 - size) * 20),
      left: 100 * this.props.x + 80 +
      ((1 - size) * 20),
      width: size * 40,
      height: size * 40
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
        {this.props.possibleMove ? <><div className="piece-outline"
          style ={{
            top: 100 * this.props.y + 78,
            left: 100 * this.props.x + 78,
            backgroundColor: this.props.action == 'take' ? 'red' : 'black'
          }}/>
          <div className="piece"
            style={{
                top: 100 * this.props.y + 80,
                left: 100 * this.props.x + 80,
                backgroundColor: 'white'
          }}/></> : <div />}
          {this.props.type === "E" && this.props.animation_type == null ? <div /> :
          <div className="piece"
          style={{...this.getDimensions(), ...{
              backgroundColor: this.state.color
          }}}/>}
      </ReactCursorPosition>
    )
  }

}
