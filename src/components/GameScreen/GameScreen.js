import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import {
  GameContext, GamePlayersState, PLAYER_ANIMATION_STATE_IDLE, PLAYER_ANIMATION_STATE_WALKING,
  PLAYER_ANIMATION_STATE_WAVING
} from '../../state/game';
import PixiPlayer from '../PixiPlayer/PixiPlayer';

export function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const USERS = {
  'simon': {
    name: 'Simon',
    fruit: 'banana',
    score: 500,
  },
  'chiao': {
    name: 'Chiao',
    fruit: 'avocado',
    score: 250,
  },
  'aya': {
    name: 'Aya',
    fruit: 'pineapple',
    score: 1000,
  },
};

class GameScreen extends Component {

  // pixi
  app;

  // matter
  matterEngine;
  leftWall;
  rightWall;

  containerRef;
  playerRefs = {};

  state: {
    players: GamePlayersState,
  };

  positionCount = 0;

  constructor(props) {
    super(props);
    this.state = {
      players: {},
    };
    this.matterEngine = Matter.Engine.create({
      enableSleeping: true,
    });
    this.app = new PIXI.Application({
      transparent: true,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.containerRef = React.createRef();
    this.handleResize = this.handleResize.bind(this);
    this.resizeView = this.resizeView.bind(this);
    this.addPlayerToScene = this.addPlayerToScene.bind(this);
    this.removePlayerFromScene = this.removePlayerFromScene.bind(this);
    this.addMatterBody = this.addMatterBody.bind(this);
    this.removeMatterBody = this.removeMatterBody.bind(this);
    this.handlePlayerRef = this.handlePlayerRef.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.initMatter();
    this.initPixi();
    this.updatePlayerState();
    window.addEventListener('resize', this.handleResize);

    setInterval(() => {
      this.setState({
        players: {
          simon: {
            ...this.state.players.simon,
            displayName: !this.state.players.simon.displayName,
            waveAnimation: new Date().getTime(),
          }
        }
      });
    }, 5000);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.resizeView();
    this.updatePlayerState();
    this.updateMatterWalls();
  }

  handlePlayerRef(element, userKey: string) {
    if (!this.playerRefs[userKey]) {
      this.playerRefs[userKey] = element;
    }
  }

  // state

  updatePlayerState() {
    const players = {
      'simon': {
        animationState: PLAYER_ANIMATION_STATE_IDLE,
        animationDuration: 2000,
        waveAnimation: new Date().getTime(),
        wavingState: null,
        name: 'Simon',
        displayName: true,
        fruit: 'banana',
        xPosition: randomIntFromInterval(100, window.innerWidth - 100),
        yPosition: randomIntFromInterval(window.innerHeight, window.innerHeight - 200),
      },
    };
    this.setState({
      players: players,
    });
  }

  // pixi

  initPixi() {
    this.containerRef.current.appendChild(this.app.view);
  }

  resizeView() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  addPlayerToScene(player) {
    this.app.stage.addChild(player);
  }

  removePlayerFromScene(player) {
    this.app.stage.removeChild(player);
    // todo - delete ref
  }

  // matter

  initMatter() {
    const wallHeight = (window.innerHeight * 2);
    this.leftWall = Matter.Bodies.rectangle(0 - 50, window.innerHeight / 2, 50, wallHeight, {isStatic: true});
    this.rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, wallHeight, {isStatic: true});
    Matter.World.add(this.matterEngine.world, [this.leftWall, this.rightWall]);
    this.startMatter();
  }

  startMatter() {
    this.matterEngine.world.gravity.y = -1;
    Matter.Engine.run(this.matterEngine);
    this.animate();
  }

  addMatterBody(object) {
    Matter.World.add(this.matterEngine.world, object);
  }

  removeMatterBody(object) {
    Matter.World.remove(this.matterEngine.world, object);
  }

  updateMatterWalls() {
    Matter.Body.setPosition(this.leftWall, {
      x: 0 - 50,
      y: window.innerHeight / 2,
    });
    Matter.Body.setPosition(this.rightWall, {
      x: window.innerWidth,
      y: window.innerHeight / 2,
    });
  }

  animate() {

    for (let userKey in this.playerRefs) {
      this.playerRefs[userKey].updatePixiElements();
    }

    window.requestAnimationFrame(this.animate);
  }

  // render

  renderPlayers() {
    const {players} = this.state;
    return Object.keys(players).map((playerKey) => {
      return (
        <PixiPlayer player={players[playerKey]} key={playerKey}
                    addPlayerToScene={this.addPlayerToScene} removePlayerFromScene={this.removePlayerFromScene}
                    addMatterBody={this.addMatterBody}
                    removeMatterBody={this.removeMatterBody}
                    ref={(element) => {
                      this.handlePlayerRef(element, playerKey);
                    }}/>
      );
    });
  }

  render() {
    return (
      <GameContext.Provider value={this.state}>
        <div className='GameScreen' ref={this.containerRef}>
          {
            this.renderPlayers()
          }
        </div>
      </GameContext.Provider>
    );
  }
}

GameScreen.defaultProps = {};

export default GameScreen;
