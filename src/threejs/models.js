import {AnimationMixer, SkinnedMesh} from 'three-full';
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
  character.receiveShadow = true;

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