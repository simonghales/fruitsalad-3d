import React, {Component} from 'react';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshPhongMaterial,
  ShadowMaterial,
  Mesh,
  AmbientLight,
  DirectionalLight,
  PointLight,
  WebGLRenderer,
  JSONLoader,
  SkinnedMesh,
  AnimationMixer,
  PlaneBufferGeometry,
} from 'three-full';
import {GameContext, GamePlayersState} from '../../state/game';
import PlayerInstance from '../PlayerInstance/index';
import {initScene} from '../../threejs/models';

let loader = new JSONLoader();

const style = {
  backgroundColor: '#127DDA',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

class MainScene extends Component {


  clock = new Clock();
  camera;
  scene;
  renderer;
  lights: {
    ambient: {},
    directional: {},
  } = {};
  mixers = {};

  containerRef;

  props: {};

  state: {
    players: GamePlayersState,
  };

  constructor(props) {
    super(props);
    this.state = {
      players: {
        'simon': {
          name: 'Simon',
          fruit: 'banana',
          xPosition: 0,
          zPosition: 0,
        },
        'aya': {
          name: 'Aya',
          fruit: 'banana',
          xPosition: -5,
          zPosition: 0,
        },
        // 'aya2': {
        //   name: 'Aya',
        //   fruit: 'banana',
        //   xPosition: -4,
        // },
        // 'aya3': {
        //   name: 'Aya',
        //   fruit: 'banana',
        //   xPosition: -3,
        // },
        // 'aya4': {
        //   name: 'Aya',
        //   fruit: 'banana',
        //   xPosition: -2,
        // },
        'aya5': {
          name: 'Aya',
          fruit: 'banana',
          xPosition: -1,
          zPosition: -5,
        },
        // 'nathan': {
        //   name: 'Nathan',
        //   fruit: 'banana',
        //   xPosition: 1,
        // },
        // 'jono': {
        //   name: 'Jono',
        //   fruit: 'banana',
        //   xPosition: 2,
        // },
        // 'james': {
        //   name: 'James',
        //   fruit: 'banana',
        //   xPosition: 3,
        // },
        // 'james2': {
        //   name: 'James',
        //   fruit: 'banana',
        //   xPosition: 4,
        // },
        // 'james3': {
        //   name: 'James',
        //   fruit: 'banana',
        //   xPosition: 5,
        // },
      },
    };
    this.containerRef = React.createRef();
    this.scene = new Scene();
    this.animate = this.animate.bind(this);
    this.addPlayerGroup = this.addPlayerGroup.bind(this);
    this.removePlayerGroup = this.removePlayerGroup.bind(this);
    this.addMixer = this.addMixer.bind(this);
    this.removeMixer = this.removeMixer.bind(this);
  }

  componentDidMount() {
    this.initThree();
  }

  initThree() {

    const {
      camera,
      lights,
      renderer,
      ground,
    } = initScene(this.scene);

    this.camera = camera;
    this.lights = lights;
    this.renderer = renderer;
    this.ground = ground;

    this.containerRef.current.appendChild(this.renderer.domElement);

    this.animate();

  }

  animate() {

    const delta = this.clock.getDelta();

    for (let mixerId in this.mixers) {
      const mixer = this.mixers[mixerId];
      mixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate);

  }

  addPlayerGroup(playerGroup) {
    this.scene.add(playerGroup);
  }

  removePlayerGroup(playerGroup) {
    this.scene.remove(playerGroup);
  }

  addMixer(id: string, mixer) {
    this.mixers[id] = mixer;
  }

  removeMixer(id: string,) {
    this.mixers[id] = null;
    delete this.mixers[id];
  }

  // state

  renderPlayers() {
    const {players} = this.state;
    return Object.keys(players).map((playerKey) => {
      return (
        <PlayerInstance addPlayerGroup={this.addPlayerGroup} removePlayerGroup={this.removePlayerGroup}
                        addMixer={this.addMixer}
                        removeMixer={this.removeMixer}
                        playerKey={playerKey} key={playerKey}/>
      );
    });
  }

  // end state

  render() {
    return (
      <GameContext.Provider value={this.state}>
        <div className='MainScene' style={style} ref={this.containerRef}>
          {this.renderPlayers()}
        </div>
      </GameContext.Provider>
    );
  }
}

MainScene.defaultProps = {};

export default MainScene;
