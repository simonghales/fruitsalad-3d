import {
  AmbientLight,
  AnimationMixer,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  PlaneBufferGeometry,
  MeshPhongMaterial,
  ShadowMaterial,
  SkinnedMesh,
  WebGLRenderer, CameraHelper
} from 'three-full';
import type {FruitAssets} from './assets';
import {threejsAssets} from './assets';

export interface GeneratedFruitModel {
  character: {},
  mixer: {},
  action: {
    idle: {},
    run: {},
    walk: {},
    wave: {},
  },
}

export function generateFruitModel(fruit: string): GeneratedFruitModel {

  const fruitAssets: FruitAssets = threejsAssets.getFruitAssets(fruit);

  const geometry = fruitAssets.geometry;
  const materials = fruitAssets.materials;

  let character = new SkinnedMesh(
    geometry,
    materials
  );

  character.scale.set(1, 1, 1);
  character.rotateY(Math.PI / 2);
  character.castShadow = true;
  // character.receiveShadow = true;

  let mixer = new AnimationMixer(character);

  let action = {};

  action.idle = mixer.clipAction(geometry.animations[0]);
  action.run = mixer.clipAction(geometry.animations[1]);
  action.walk = mixer.clipAction(geometry.animations[2]);
  action.wave = mixer.clipAction(geometry.animations[3]);

  action.idle.setEffectiveWeight(1);
  action.run.setEffectiveWeight(1);
  action.walk.setEffectiveWeight(1);
  action.wave.setEffectiveWeight(1);

  action.idle.enabled = true;
  action.run.enabled = true;
  action.walk.enabled = true;
  action.wave.enabled = true;

  return {
    character: character,
    mixer: mixer,
    action: action,
  };

}

export function initScene(scene) {

  const width = window.innerWidth;
  const height = window.innerHeight;

  let camera = new PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.z = 20;
  camera.position.y = 2.75;
  camera.rotation.x = 0.03;

  const light = new AmbientLight(0xffffff, 1);
  scene.add(light);

  let directionalLight = new DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 70, 100).normalize();
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 2000;
  const distance = 10;
  directionalLight.shadow.camera.left = -distance;
  directionalLight.shadow.camera.top = -distance;
  directionalLight.shadow.camera.right = distance;
  directionalLight.shadow.camera.bottom = distance;

  scene.add(directionalLight);

  // var helper = new CameraHelper(directionalLight.shadow.camera);
  // scene.add(helper);

  let geo = new PlaneBufferGeometry(2000, 2000, 8, 8);
  let mat = new ShadowMaterial();
  // let mat = new MeshPhongMaterial({color: 0x127DDA, shininess: 0});
  mat.opacity = 0.2;
  let ground = new Mesh(geo, mat);
  ground.rotation.x -= Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  let renderer = new WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(1);

  return {
    camera,
    lights: {
      ambient: light,
      directional: directionalLight,
    },
    renderer,
    ground,
  };

}