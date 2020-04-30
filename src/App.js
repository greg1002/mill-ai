import React, { Component } from 'react';
import Board from './Board.js';
import AI from './AI.js';
import './style/app.css';
import Gamestate from './Gamestate.js';

const gameTypes = [
  {innerHTML: "Single Player vs AI", id: 'single_player'},
  {innerHTML: "Multiplayer", id: 'multi_player'}
]

const color = [
  {innerHTML: "Black", id: "B"},
  {innerHTML: "White", id: "W"}
]


class App extends Component {

  state = {
    gs: new Gamestate("board_standard", "W"),
    ai: null,
    game_type: "multi_player",
    color: "W"
  }

  makeMove = (x, y) => {
    let newState = this.state.gs.move({x: x, y: y});
    let ai = this.state.ai;
    if (ai != null) ai.registerMove({x: x, y: y});
    this.setState({gs: newState, ai: ai});
  }

  onGameTypeToggle = (game_type) => {
    this.setState({game_type: game_type});
  }

  onColorToggle = (color) => {
    this.setState({color: color});
  }

  onStart = () => {
    const gs = new Gamestate("board_standard", this.state.color);
    let ai = this.ai;
    if (ai != null) {
      ai.running = false;
      this.setState({ai: ai})
      ai = null;
    }
    if (this.state.game_type == "single_player") {
      ai = new AI(gs, this.state.color == "B" ? "W" : "B");
      ai.run();
    }
    this.setState({gs: gs, ai: ai});
  }

  getInfoText = () => {
    const {gs, ai, game_type} = this.state;
    return (
      <h2 style={{
          color: gs.turn == "B" ? 'black' : 'white'
      }}>{
        (ai == null ?
        (gs.turn == "B" ? "black" : "white") :
        gs.turn == ai.color ? "ai" : "player") +
        (gs.winner == "B" ? " wins!" :
        gs.winner == "W" ? " wins!" :
        (" to " + (gs.action == "place" ? "place" :
          gs.action == "take" ? "take" : "move")))
      }</h2>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="text"><h1>Mill</h1></div>
        <Board
          gs={this.state.gs}
          makeMove={this.makeMove}
        />
        <div className="text"><h2>{this.getInfoText()}</h2></div>
       <div className="menu">
          <div className="btn-group btn-group-toggle m-2">{
            gameTypes.map(type => (
              <label key={type.id} className={type.id === this.state.game_type ? "btn btn-primary active" : "btn btn-primary"}>
                <input type="radio" id={type.id} autoComplete="off" onClick={() => this.onGameTypeToggle(type.id)}/>{type.innerHTML}
              </label>
            ))}
          </div>
          {
            this.state.game_type === "single_player" ?
            <div className="btn-group btn-group-toggle m-2">{
              color.map(type => (
                <label key={type.id} className={type.id === this.state.color ? "btn btn-primary active" : "btn btn-primary"}>
                  <input type="radio" id={type.id} autoComplete="off" onClick={() => this.onColorToggle(type.id)}/>{type.innerHTML}
                </label>
              ))}
            </div> : <div />
          }
          <button type="button" className="btn btn-primary" onClick={this.onStart}>Start!</button>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
