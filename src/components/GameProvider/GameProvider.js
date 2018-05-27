import React, {Component} from 'react';

class GameProvider extends Component {

  props: {
    children: any,
  };

  state: {};

  constructor(props) {
    super(props);
    this.state = {
      players: {
        'simon': true,
      },
    };
  }

  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

GameProvider.defaultProps = {};

export default GameProvider;
