import React, { Component } from 'react';
import board_layouts from './Layouts.js';
import './style/app.css';
import ReactCursorPosition, { INTERACTIONS } from 'react-cursor-position';

const SCALE = .75;

export default class Board extends Component {

  render() {
    const {gs, animation_progression, is_animating, makeMove, player_turn} = this.props;
    const board_layout = board_layouts[gs.board_type];
    return (
      <div className="board-backdrop">
        <div className="board" style={{width: (board_layout.x + 1) * 100 * SCALE, height: (board_layout.y + 1) * 100 * SCALE}}>
          <img src={board_layout.image} />
          <Bars
            gs={gs}
            animation_progression={animation_progression}
            is_animating={is_animating}
          />
          <Spaces
            gs={gs}
            player_turn={player_turn}
            animation_progression={animation_progression}
            makeMove={makeMove}
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
    if (gs.action === "move_to") return;

    if (this.state.update_lock && prev_props.is_animating !== is_animating) {
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
    } else if (!this.state.update_lock && prev_props.is_animating === is_animating) {
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
          for (let j = 0; j < mill.length; j++) {
            var loc = mill[j];
            if (last_move.command.x === loc.x && last_move.command.y === loc.y) {
              animation_type = {"target": j, "type":
                last_move.action === "take" || last_move.action === "move_from" ?
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
    return color === "B" ? 'black-background' :
        'white-background';
  }

  getBar = (dimensions) => {
    return (
      <div
        className={"bar " + this.getColor(this.props.color)}
        style={dimensions}
      />
    )
  }

  getBarSections = () => {
    const {animation_type, animation_progression, mill} = this.props;
    if (animation_type == null || animation_type.target !== 1) {
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
        top: (100 * (min_y + (max_y - min_y) * (1 - size) / 2) + 95) * SCALE,
        left: (100 * (min_x + (max_x - min_x) * (1 - size) / 2) + 95) * SCALE,
        width: (((max_x - min_x) * 100 * size) + 10) * SCALE,
        height: (((max_y - min_y) * 100 * size) + 10) * SCALE
      }
      return this.getBar(dimensions);
    } else {
      min_x = Math.min(mill[0].x,mill[2].x);
      min_y = Math.min(mill[0].y,mill[2].y);
      var mid_x = mill[1].x;
      var mid_y = mill[1].y;
      max_x = Math.max(mill[0].x,mill[2].x);
      max_y = Math.max(mill[0].y,mill[2].y);
      size = animation_type.type === "enter" ? animation_progression :
        1 - animation_progression;
      var dimensions1 = {
        top: (100 * min_y + 95) * SCALE,
        left: (100 * min_x + 95) * SCALE,
        width: (((mid_x - min_x) * 100 * size) + 10) * SCALE,
        height: (((mid_y - min_y) * 100 * size) + 10) * SCALE
      }
      var dimensions2 = {
        top: (100 * (mid_y + (max_y - mid_y) * (1 - size)) + 95) * SCALE,
        left: (100 * (mid_x + (max_x - mid_x) * (1 - size)) + 95) * SCALE,
        width: (((max_x - mid_x) * 100 * size) + 10) * SCALE,
        height: (((max_y - mid_y) * 100 * size) + 10) * SCALE
      }
      return (
        <React.Fragment>
          {this.getBar(dimensions1)}{this.getBar(dimensions2)}
        </React.Fragment>
      )
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
      if (x === item.x && y === item.y) {
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
              if (move.x === x && move.y === y) {
                possibleMove = true;
                return;
              }
            });
          }
          let animation_type = null;
          last_moves.forEach(move => {
            if (move.command.x === x && move.command.y === y) {
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
    return type === "B" ? "black-background" :
                 type === "W" ? "white-background" : '';
  }

  componentDidUpdate = (prev_props) => {
    if (prev_props.type === "E" && this.props.type !== "E") {
      this.setState({color: this.getColor(this.props.type)});
    }
  }

  getDimensions = () => {
    var {animation_type, animation_progression} = this.props;
    var size = animation_type === "enter" ? animation_progression :
               animation_type === "exit" ? 1 - animation_progression : 1;
    return {
      top: (100 * this.props.y + 80 +
      ((1 - size) * 20)) * SCALE,
      left: (100 * this.props.x + 80 +
      ((1 - size) * 20)) * SCALE,
      width: size * 40 * SCALE,
      height: size * 40 * SCALE
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
        {this.props.possibleMove ? <><div className="piece"
          style ={{
            top: (100 * this.props.y + 78) * SCALE,
            left: (100 * this.props.x + 78) * SCALE,
            width: 44 * SCALE,
            height: 44 * SCALE,
            backgroundColor: this.props.action === 'take' ? 'red' : 'black'
          }}/>
          <div className="piece"
            style={{
                top: (100 * this.props.y + 80) * SCALE,
                left: (100 * this.props.x + 80) * SCALE,
                width: 40 * SCALE,
                height: 40 * SCALE,
                backgroundColor: 'white'
          }}/></> : <div />}
          {this.props.type === "E" && this.props.animation_type == null ? <div /> :
          <div className={"piece " + this.state.color}
          style={this.getDimensions()}/>}
      </ReactCursorPosition>
    )
  }

}
