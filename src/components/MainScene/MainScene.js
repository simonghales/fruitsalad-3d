import React, {Component} from 'react';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshPhongMaterial,
  ShadowMaterial,
  FlatShading,
  Mesh,
  AmbientLight,
  DirectionalLight,
  PointLight,
  WebGLRenderer,
  JSONLoader,
  DoubleSide,
  ObjectLoader,
  // FBXLoader,
  SkinnedMesh,
  AnimationMixer,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  GLTFLoader,
} from 'three-full';
import FBXLoader from 'three-fbx-loader';

let loader = new JSONLoader();
// let loader = new FBXLoader();
let fbxLoader = new FBXLoader();
let gltfLoader = new GLTFLoader();

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

  geometry;
  material;
  mesh;

  action = {};
  mixer;
  character;

  fbxObject;
  fbxMixer;

  containerRef;

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.scene = new Scene();
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.initThree();
  }

  initThree() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.camera.position.z = 100;
    this.camera.position.y = 15;

    this.geometry = new BoxGeometry(0.2, 0.2, 0.2);
    this.material = new MeshPhongMaterial({
      color: 0x99FFFF,
      flatShading: true,
    });

    this.mesh = new Mesh(this.geometry, this.material);
    // this.scene.add(this.mesh);

    const light = new AmbientLight(0xffffff, 1);
    this.scene.add(light);

    let light3 = new PointLight(0x80ff80, 10, 200);
    // this.scene.add(light3);
    light3.position.y = -100;

    let directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(50, 70, 100).normalize();
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    this.scene.add(directionalLight);

    var geo = new PlaneBufferGeometry(2000, 2000, 8, 8);
    var mat = new ShadowMaterial();
    mat.opacity = 0.2;
    var plane = new Mesh(geo, mat);
    plane.rotation.x -= Math.PI / 2;
    // plane.position.y = -1;
    plane.receiveShadow = true;
    console.log('plane', plane);
    this.scene.add(plane);

    this.renderer = new WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.containerRef.current.appendChild(this.renderer.domElement);

    this.initModels();
    // this.initFbxModel();
    // this.initGltfModel();

    this.animate();

  }

  initModels() {

    loader.load(`${process.env.PUBLIC_URL}/assets/models/Banana/Banana_re25.json`, (geometry, materials) => {
      // loader.load(`${process.env.PUBLIC_URL}/assets/models/Banana/Whale.json`, (geometry, materials) => {
      console.log('banana results', geometry, materials);

      materials.forEach(function (material) {
        material.skinning = true;
        material.morphTargets = true;
        material.flatShading = true;
      });

      console.log('materials', materials);

      this.character = new SkinnedMesh(
        geometry,
        materials
      );

      this.scene.add(this.character);

      console.log('character', this.character);

      this.character.scale.set(1, 1, 1);
      this.character.rotateY(Math.PI / 2);
      this.character.castShadow = true;
      this.character.receiveShadow = true;

      this.mixer = new AnimationMixer(this.character);

      this.action.idle = this.mixer.clipAction(geometry.animations[0]);
      this.action.run = this.mixer.clipAction(geometry.animations[1]);
      this.action.walk = this.mixer.clipAction(geometry.animations[2]);
      this.action.wave = this.mixer.clipAction(geometry.animations[3]);

      this.action.idle.setEffectiveWeight(1);
      this.action.run.setEffectiveWeight(1);
      this.action.walk.setEffectiveWeight(1);
      this.action.wave.setEffectiveWeight(1);

      // this.action.wave.setLoop(THREE.LoopOnce, 0);
      // this.action.wave.clampWhenFinished = true;

      this.action.idle.enabled = true;
      this.action.run.enabled = true;
      this.action.walk.enabled = true;
      this.action.wave.enabled = true;

      console.log('mixer', this.mixer, this.action);

      this.action.walk.play();

      console.log('character', this.character);
      console.log('action', this.action);
    });

  }

  initFbxModel() {

    fbxLoader.load(`${process.env.PUBLIC_URL}/assets/models/Banana/Banana_re.fbx`, (object) => {
      console.log('response', object);

      this.fbxObject = object;

      this.fbxObject.mixer = new AnimationMixer(this.fbxObject);

      var action = this.fbxObject.mixer.clipAction(this.fbxObject.animations[0]);
      action.play();

      this.scene.add(this.fbxObject);

      this.fbxObject.position.y = -100;

      console.log('this.fbxObject', this.fbxObject);

    });

  }

  initGltfModel() {

    gltfLoader.load(`${process.env.PUBLIC_URL}/assets/models/Banana/Banana_2.gltf`, (gltf) => {
      console.log('gltf', gltf);
      this.scene.add(gltf.scene);
    });

  }

  animate() {

    requestAnimationFrame(this.animate);

    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    if (this.fbxObject) {
      this.fbxObject.mixer.update(this.clock.getDelta());
    }

    if (this.character) {
      // this.character.rotation.x += 0.01;
      // this.character.rotation.y += 0.02;
    }

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);

  }

  render() {
    return (
      <div className='MainScene' style={style} ref={this.containerRef}></div>
    );
  }
}

MainScene.defaultProps = {};

export default MainScene;
