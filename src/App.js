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
    ai_interval: null,
    game_type: "multi_player",
    color: "W",
    think_time: 5
  }

  makeMove = (x, y) => {
    let newState = this.state.gs.move({x: x, y: y});
    let ai = this.state.ai;
    if (ai != null) ai.register_move({x: x, y: y});
    this.setState({gs: newState, ai: ai}, this.checkAIMove());
  }

  checkAIMove = () => {
    if (this.state.gs.winner != null) clearInterval(this.state.ai_interval)
    if (!this.player_turn()) {
      let timeout = this.state.think_time * 1000;
      if (this.state.gs.action === "move_to") timeout = 0;
      setTimeout(() => {
        let move = this.state.ai.best_move();
        this.makeMove(move.x,move.y);
      }, timeout)
    }
  }

  onGameTypeToggle = (game_type) => {
    this.setState({game_type: game_type});
  }

  onColorToggle = (color) => {
    this.setState({color: color});
  }

  player_turn = () => {
    return this.state.ai != null ?
      this.state.ai.color != this.state.gs.turn : true;
  }

  onStart = () => {
    let gs = new Gamestate("board_standard", "W");
    let ai = null;
    let ai_interval = null;
    clearInterval(this.state.ai_interval);
    if (this.state.game_type == "single_player") {
      ai = new AI(gs, this.state.color == "B" ? "W" : "B");
    }
    this.setState({gs, ai, ai_interval}, () => {
      if (ai != null) {
        let ai_interval = setInterval(function () {ai.iterate(30)}, 10);
        this.setState({ai_interval});
        this.checkAIMove()
      };
    });
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
          player_turn={this.player_turn()}
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
