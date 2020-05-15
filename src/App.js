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

const ANIMATION_LENGTH = 200;


class App extends Component {
  state = {
    gs: new Gamestate("board_standard", "W"),
    ai: null,
    animation_progression: 1,
    is_animating: false,
    ai_interval: null,
    game_type: "multi_player",
    color: "W",
    think_time: 5
  }

  runAI = () => {
    let ai_interval = setInterval(() => this.state.ai.iterate(30), 10);
    this.setState({ai_interval});
  }

  stopAI = () => {
    clearInterval(this.state.ai_interval);
  }

  makeMove = (x, y) => {
    let newState = this.state.gs.move({x: x, y: y});
    let ai = this.state.ai;
    if (ai != null) ai.register_move({x: x, y: y});
    this.setState({gs: newState, ai: ai},
      this.doMoveAnimation(),
      this.checkAIMove()
    );
  }

  doMoveAnimation = () => {
    this.setState({animation_progression: 0, is_animating: true});
    if (this.state.ai != null) this.stopAI();
    let animation_interval = setInterval(() => {
      this.setState({animation_progression:
        this.state.animation_progression + 10 / ANIMATION_LENGTH
      });
    }, 10);
    setTimeout(() => {
      clearInterval(animation_interval);
      this.setState({animation_progression: 1, is_animating: false});
      if (this.state.ai != null) this.runAI();
    }, ANIMATION_LENGTH);
  }

  checkAIMove = () => {
    if (this.state.gs.winner != null) this.stopAI();
    if (!this.player_turn()) {
      let timeout = this.state.think_time * 1000;
      if (this.state.gs.action === "move_to") timeout = 0;
      setTimeout(() => {
        if (this.state.ai == null) return;
        let move = this.state.ai.best_move();
        this.makeMove(move.x,move.y);
      }, timeout)
    }
  }

  onGameTypeToggle = (game_type) => {
    this.setState({game_type});
  }

  onColorToggle = (color) => {
    this.setState({color});
  }

  player_turn = () => {
    return this.state.ai != null ?
      this.state.ai.color !== this.state.gs.turn : true;
  }

  onStart = () => {
    let gs = new Gamestate("board_standard", "W");
    let ai = null;
    let ai_interval = null;
    clearInterval(this.state.ai_interval);
    if (this.state.game_type === "single_player") {
      ai = new AI(gs, this.state.color === "B" ? "W" : "B");
    }
    this.setState({gs, ai, ai_interval}, () => {
      if (ai != null) {
        this.runAI();
        this.checkAIMove()
      };
    });
  }

  getInfoText = () => {
    const {gs, ai} = this.state;
    var color = gs.winner != null ? gs.winner : gs.turn;
    return (
      <h2 style={{
          color: color === "B" ? 'black' : 'white'
      }}>{
        (ai == null ?
        (color === "B" ? "black" : "white") :
        color === ai.color ? "ai" : "player") +
        (gs.winner === "B" ? " wins!" :
        gs.winner === "W" ? " wins!" :
        (" to " + (gs.action === "place" ? "place" :
          gs.action === "take" ? "take" : "move")))
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
          animation_progression={this.state.animation_progression}
          is_animating={this.state.is_animating}
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
