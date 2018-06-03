import React, {Component} from 'react';
import './App.css';
import GameScreen from './components/GameScreen';
import PixiAssetsLoader from './components/PixiAssetsLoader';

class App extends Component {
  render() {
    return (
      <PixiAssetsLoader>
        <GameScreen/>
      </PixiAssetsLoader>
    );
  }
}

export default App;
