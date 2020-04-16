import React, { Component } from 'react';
import './style/menu.css'

const gameTypes = [
  {innerHTML: "Single Player vs AI", id: 'single_player'},
  {innerHTML: "Multiplayer", id: 'multi_player'}
]

const color = [
  {innerHTML: "Black", id: "black"},
  {innerHTML: "Color", id: "white"}
]

export default class Menu extends Component {

  state = {
    gameType: "single_player",
    color: "White",
    board: "standard"
  }



  onGameTypeToggle = (game_type) => {
    this.setState({gameType: game_type});
  }

  onColorToggle = (color) => {
    this.setState({color: color});
  }

  render() {
    return (
      <div className="menu">
        <div className="btn-group btn-group-toggle m-2">{
          gameTypes.map(type => (
            <label key={type.id} className={type.id === this.state.gameType ? "btn btn-primary active" : "btn btn-primary"}>
              <input type="radio" id={type.id} autoComplete="off" onClick={() => this.onGameTypeToggle(type.id)}/>{type.innerHTML}
            </label>
          ))}
        </div>
        {
          this.state.gameType === "single_player" ?
          <div className="btn-group btn-group-toggle m-2">{
            color.map(type => (
              <label key={type.id} className={type.id === this.state.color ? "btn btn-primary active" : "btn btn-primary"}>
                <input type="radio" id={type.id} autoComplete="off" onClick={() => this.onColorToggle(type.id)}/>{type.innerHTML}
              </label>
            ))}
          </div> : <div />
        }
      </div>
    )
  }
}
