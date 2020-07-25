import React, { Component } from 'react';
import Board from './Board.js';
import MCTS from './MCTS.js';
import './style/app.css';
import Gamestate from './Gamestate.js';

import { AppBar, Button, Typography, Container, ButtonGroup, Grid, Paper, Card, CardContent, Toolbar, Box, LinearProgress} from "@material-ui/core";
import {spacing} from "@material-ui/system"

const gameTypes = [
  {innerHTML: "Single Player vs AI", id: 'single_player'},
  {innerHTML: "Multiplayer", id: 'multi_player'}
]

const boardTypes = [
  {innerHTML: "Small Board", id: "board_small"},
  {innerHTML: "Standard Board", id: "board_standard"}
]

const color = [
  {innerHTML: "White", id: "W"},
  {innerHTML: "Black", id: "B"}
]

const ANIMATION_LENGTH = 200;

class App extends Component {

  state = {
    gs: new Gamestate("board_standard", "W"),
    ai: null,
    animation_progression: 1,
    is_animating: false,
    ai_interval: null,
    game_type: "single_player",
    board_type: "board_standard",
    color: "W",
    think_time: 3,
    think_progression: 0,
    simulations: 0,
    ai_win_chance: .5
  };

  componentDidMount() {
    this.onStart();
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
    if (ai != null) {
      this.setState({
        simulations: ai.tree.simulations,
      });
      ai.register_move({x: x, y: y});
    }
    this.setState({gs, ai},
      this.state.gs.action !== "move_to" ? this.doMoveAnimation() : () => {},
      this.checkAIMove(),
      ai != null ? this.setState({ai_win_chance: ai.win_chance()}) : () => {}
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

  onBoardTypeToggle = (board_type) => {
    this.setState({board_type});
  }

  player_turn = () => {
    return this.state.ai != null ?
      this.state.ai.color !== this.state.gs.turn : true;
  }

  onStart = () => {
    let gs = new Gamestate(this.state.board_type, "W");
    let ai = null;
    let ai_interval = null;
    clearInterval(this.state.ai_interval);
    if (this.state.game_type === "single_player") {
      ai = new MCTS(gs, this.state.color === "B" ? "W" : "B");
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
            <React.Fragment>
              <Info
                gs={this.state.gs}
                ai={this.state.ai}
                think_progression={this.state.think_progression}
                simulations={this.state.simulations}
                ai_win_chance={this.state.ai_win_chance}
              />
              <Board
                gs={this.state.gs}
                makeMove={this.makeMove}
                player_turn={this.player_turn()}
                animation_progression={this.state.animation_progression}
                is_animating={this.state.is_animating}
              />
            </React.Fragment>,
            <Settings
              game_type={this.state.game_type}
              color={this.state.color}
              board_type={this.state.board_type}
              onGameTypeToggle={this.onGameTypeToggle}
              onColorToggle={this.onColorToggle}
              onBoardTypeToggle={this.onBoardTypeToggle}
              onStart={this.onStart}
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

  getButton = (options, activeOption, onToggle) => {
    return (
      <ButtonGroup size="small" variant="outlined" color="default" aria-label="outlined primary button group">{
        options.map(option => (
          <Button key={option.id} disabled={option.id === activeOption}
            variant={option.id === activeOption ? "contained" : "outlined"}
            onClick={() => onToggle(option.id)}>
            <Typography variant="button">{option.innerHTML}</Typography>
          </Button>
        ))}
      </ButtonGroup>
    )
  }

  render () {
    return (
      <div>
          <Box mb={2} display="flex">
            <Box flexGrow={1}>
              {this.getButton(gameTypes, this.props.game_type, this.props.onGameTypeToggle)}
            </Box>
            {
            this.props.game_type === "single_player" ?
            <Box ml={2}>
              {this.getButton(color, this.props.color, this.props.onColorToggle)}
            </Box> : <div />
            }
          </Box>
          <Box display="flex">
            <Box flexGrow={1}>
              {this.getButton(boardTypes, this.props.board_type, this.props.onBoardTypeToggle)}
            </Box>
            <Box ml={2}>
              <Button variant="contained" size = "small" color="primary" onClick={this.props.onStart}>Start!</Button>
            </Box>
          </Box>
      </div>
    )
  }
}

class Info extends Component {

  state = {
    win_chance: .5,
    simulations: 0
  }

  getMoveText = () => {
    const {gs, ai} = this.props;
    var color = gs.winner != null ? gs.winner : gs.turn;
    return (
      <Typography variant="subtitle1" className={color === "B" ? "var-black" : "var-white"}>{
        (ai == null ?
        (color === "B" ? "black" : "white") :
        color === ai.color ? "ai" : "player") +
        (gs.winner === "B" ? " wins!" :
        gs.winner === "W" ? " wins!" :
        (" to " + (gs.action === "place" ? "place" :
          gs.action === "take" ? "take" : "move")))
      }</Typography>
    )
  }

  getWinChanceText = () => {
    return (
      this.props.ai == null ? <div /> :
      <Typography variant="subtitle1">{'AI winning chance: ' + (this.props.ai_win_chance + "").substring(0,5)}</Typography>
    )
  }

  getSimCountText = () => {
    return (
      this.props.ai == null ? <div /> :
      <Typography variant="subtitle1">{'Simulations run: ' + this.props.simulations}</Typography>
    )
  }

  render () {
    return (
      <Box mb={2} display="flex">
        <Box flexGrow={1}>{this.getMoveText()}</Box><br />
      <Box mr={2}>{this.getWinChanceText()}</Box>
        <Box>{this.getSimCountText()}</Box>
      </Box>
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
