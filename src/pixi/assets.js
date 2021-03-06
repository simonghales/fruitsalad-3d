import * as PIXI from "pixi.js";
import {SpritesheetHandler} from './spritesheet';
import speechBubble from '../assets/images/player/SpeechBubble.png';
import watermelonJSON from '../assets/animations/spritesheets/watermelon/combined/spritesheet.json';
import watermelonSpritesheet from '../assets/animations/spritesheets/watermelon/combined/spritesheet.png';
import bananaJSON from '../assets/animations/spritesheets/banana/combined/spritesheet.json';
import bananaSpritesheet from '../assets/animations/spritesheets/banana/combined/spritesheet.png';
import pineappleJSON from '../assets/animations/spritesheets/pineapple/combined/spritesheet.json';
import pineappleSpritesheet from '../assets/animations/spritesheets/pineapple/combined/spritesheet.png';
import avocadoJSON from '../assets/animations/spritesheets/avocado/combined/spritesheet.json';
import avocadoSpritesheet from '../assets/animations/spritesheets/avocado/combined/spritesheet.png';
import peachJSON from '../assets/animations/spritesheets/peach/combined/spritesheet.json';
import peachSpritesheet from '../assets/animations/spritesheets/peach/combined/spritesheet.png';

export interface FruitAsset {
  image: string,
  json: string,
  speechBubbleOffset: number,
}

export const FRUIT_ASSETS: {
  [string]: FruitAsset,
} = {
  'watermelon': {
    image: watermelonSpritesheet,
    json: watermelonJSON,
    speechBubbleOffset: -170,
  },
  'banana': {
    image: bananaSpritesheet,
    json: bananaJSON,
    speechBubbleOffset: -240,
  },
  'pineapple': {
    image: pineappleSpritesheet,
    json: pineappleJSON,
    speechBubbleOffset: -235,
  },
  'avocado': {
    image: avocadoSpritesheet,
    json: avocadoJSON,
    speechBubbleOffset: -235,
  },
  'peach': {
    image: peachSpritesheet,
    json: peachJSON,
    speechBubbleOffset: -180,
  },
};

export const SPEECH_BUBBLE_ASSET = 'speechBubble';

export const MISC_ASSETS_TO_LOAD = {
  [SPEECH_BUBBLE_ASSET]: speechBubble,
};

export class PixiAssets {

  fruit: {
    [string]: SpritesheetHandler,
  } = {};
  speechBubble;

  getFruit(fruit: string): SpritesheetHandler {
    return this.fruit[fruit];
  }

}

export const pixiAssets: PixiAssets = new PixiAssets();
