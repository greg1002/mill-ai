import React, { Component } from 'react';
import Board from './Board.js';
import AI from './AI.js';
import './style/app.css';
import Gamestate from './Gamestate.js';

import { AppBar, Button, Typography, Container, ButtonGroup, Grid, Paper, Card, CardContent, Toolbar} from "@material-ui/core";
import {spacing} from "@material-ui/system"

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
    think_time: 3,
    think_progression: 0
  }

  runAI = () => {
    let ai_interval = setInterval(() => this.state.ai.iterate(10), 10);
    this.setState({ai_interval});
  }

  stopAI = () => {
    clearInterval(this.state.ai_interval);
  }

  makeMove = (x, y) => {
    let gs = this.state.gs.move({x: x, y: y});
    let ai = this.state.ai;
    if (ai != null) ai.register_move({x: x, y: y});
    this.setState({gs, ai},
      this.state.gs.action !== "move_to" ? this.doMoveAnimation() : () => {},
      this.checkAIMove()
    );
  }

  doMoveAnimation = () => {
    this.setState({animation_progression: 0, is_animating: true});
    if (this.state.ai != null) this.stopAI();
    const start = Date.now();
    let animation_interval = setInterval(() => {
      this.setState({animation_progression:
        (Date.now() - start) / ANIMATION_LENGTH
      });
    }, 10);
    setTimeout(() => {
      clearInterval(animation_interval);
      this.setState({animation_progression: 1, is_animating: false});
      if (this.state.ai != null) this.runAI();
    }, ANIMATION_LENGTH);
  }

  checkAIMove = () => {
    if (this.state.gs.winner != null) {
      this.stopAI();
      return;
    }
    if (!this.player_turn()) {
      let timeout = this.state.think_time * 1000;
      if (this.state.gs.action === "move_to") timeout = 0;
      const start = Date.now();
      let think_interval = setInterval(() => {
        this.setState({think_progression:
          (Date.now() - start) / this.state.think_time / 1000
        });
      }, 10);
      setTimeout(() => {
        clearInterval(think_interval);
        this.setState({think_progression: 0});
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
        this.checkAIMove();
      };
    });
  }

  render() {
    return (
      <React.Fragment>
        <Nav />
        <Container maxWidth="sm">
          <Grid container direction="column" justify="center" alignItems="center stretch" spacing={3}>
            {[
            <Board
              gs={this.state.gs}
              makeMove={this.makeMove}
              player_turn={this.player_turn()}
              animation_progression={this.state.animation_progression}
              is_animating={this.state.is_animating}
            />,
            <Settings
              game_type={this.state.game_type}
              color={this.state.color}
              onGameTypeToggle={this.onGameTypeToggle}
              onColorToggle={this.onColorToggle}
              onStart={this.onStart}
            />,
            <Info
              gs={this.state.gs}
              ai={this.state.ai}
              think_progression={this.state.think_progression}
            />].map(element => {
              return (
                <Grid item xs={12}>
                  <Card elevation={3} className="fullWidth">
                    <CardContent>{element}</CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

class Settings extends Component {

  render () {
    return (
      <div>
          <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">{
            gameTypes.map(type => (
              <Button key={type.id} disabled={type.id === this.props.game_type} onClick={() => this.props.onGameTypeToggle(type.id)}>
                {type.innerHTML}
              </Button>
            ))}
          </ButtonGroup>
          {
            this.props.game_type === "single_player" ?
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">{
              color.map(type => (
                <Button key={type.id} disabled={type.id === this.props.color} onClick={() => this.props.onColorToggle(type.id)}>
                  {type.innerHTML}
                </Button>
              ))}
            </ButtonGroup> : <div />
          }
          <Button variant="contained" color="primary" onClick={this.props.onStart}>Start!</Button>
      </div>
    )
  }
}

class Info extends Component {

  getInfoText = () => {
    const {gs, ai} = this.props;
    var color = gs.winner != null ? gs.winner : gs.turn;
    return (
      <div className="menu-div">
        <h2 className={'info-font ' + (color === "B" ? "var-black" : "var-white")}>{
          (ai == null ?
          (color === "B" ? "black" : "white") :
          color === ai.color ? "ai" : "player") +
          (gs.winner === "B" ? " wins!" :
          gs.winner === "W" ? " wins!" :
          (" to " + (gs.action === "place" ? "place" :
            gs.action === "take" ? "take" : "move")))
        }</h2>
      </div>
    )
  }

  getProgressionBar = () => {
    return (
      this.props.ai == null || this.props.think_progression === 0 ? <div /> :
      <div className="bottom">
        <div className="menu-div progression-bar-outline">
          <div className="progression-bar" style={{
              width: (this.props.think_progression * 100) + '%'
            }}/>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        {this.getInfoText()}
        {this.getProgressionBar()}
      </div>
    )
  }
}

class Nav extends Component {
  render () {
    return (
      <AppBar position="static" style={{"margin-bottom": "16px"}}>
        <Toolbar style={{"min-height": "48px"}}>
          <Typography variant="h6" color="inherit">Mill-AI</Typography>
        </Toolbar>
      </AppBar>
    )
  }
}

export default App;
