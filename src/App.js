import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import MainScene from './components/MainScene/MainScene';
import ThreeJSAssetsLoader from './components/ThreeJSAssetsLoader/ThreeJSAssetsLoader';

class App extends Component {
  render() {
    return (
      <ThreeJSAssetsLoader>
        <MainScene/>
      </ThreeJSAssetsLoader>
    );
  }
}

export default App;
