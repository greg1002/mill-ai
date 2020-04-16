import React, { Component } from 'react';

import Menu from './Menu.js';
import Game from './Game.js';

class App extends Component {

  state = {
    single_player: true
  }

  render() {
    return (
      <React.Fragment>
        <Game />
        <Menu
          single_player={this.state.single_player}
        />
      </React.Fragment>
    );
  }
}

export default App;
