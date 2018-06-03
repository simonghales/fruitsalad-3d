import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import {pixiAssets} from '../../pixi/assets';
import {
  PLAYER_ANIMATION_STATE_IDLE, PLAYER_ANIMATION_STATE_RUNNING, PLAYER_ANIMATION_STATE_WALKING,
  PLAYER_ANIMATION_STATE_WAVING
} from '../../state/game';

class PixiPlayerModel extends Component {

  playerModel;

  animationState: string = PLAYER_ANIMATION_STATE_IDLE;

  waveAnimation: number;

  props: {
    addPlayerModelToContainer(): void,
    removePlayerModelFromContainer(): void,
    animationState: string,
    fruitType: string,
    waveAnimation: number,
    updatingXPosition: boolean,
    updatingYPosition: boolean,
  };

  constructor(props) {
    super(props);
    this.setAnimation = this.setAnimation.bind(this);
    this.updateAnimation = this.updateAnimation.bind(this);
    this.onWaveAnimationCompleted = this.onWaveAnimationCompleted.bind(this);
  }

  componentDidMount() {
    this.initFruit();
  }

  componentDidUpdate(previousProps) {
    this.checkAnimationState();
  }

  checkAnimationState() {
    const {waveAnimation, updatingXPosition, updatingYPosition} = this.props;
    if (waveAnimation && waveAnimation !== this.waveAnimation) {
      this.playWavingAnimation();
      return;
    }
    if (updatingXPosition) {
      this.playRunningAnimation();
    } else if (updatingYPosition) {
      this.playWalkingAnimation();
    } else {
      this.playIdleAnimation();
    }
  }

  initFruit() {
    const {animationState, fruitType} = this.props;
    const fruit = pixiAssets.getFruit(fruitType);
    this.animationState = animationState;
    this.playerModel = new PIXI.extras.AnimatedSprite(fruit.frames[animationState]);
    this.playerModel.position.y = -30;
    this.playerModel.anchor.set(0.5, 1);
    this.playerModel.animationSpeed = 0.5;
    this.playerModel.play();
    this.props.addPlayerModelToContainer(this.playerModel);
  }

  setAnimation(animationState: string) {
    this.animationState = animationState;
    this.updateAnimation(animationState);
  }

  updateAnimation(animationState: string) {
    if (animationState === PLAYER_ANIMATION_STATE_IDLE) {
      this.playIdleAnimation();
    } else if (animationState === PLAYER_ANIMATION_STATE_WALKING) {
      this.playWalkingAnimation();
    } else if (animationState === PLAYER_ANIMATION_STATE_WAVING) {
      this.playWavingAnimation();
    } else if (animationState === PLAYER_ANIMATION_STATE_RUNNING) {
      this.playRunningAnimation();
    }
  }

  playIdleAnimation() {
    this.animationState = PLAYER_ANIMATION_STATE_IDLE;
    const {fruitType} = this.props;
    const fruit = pixiAssets.getFruit(fruitType);
    this.playerModel.textures = fruit.frames[this.animationState];
    this.playerModel.loop = true;
    this.playerModel.gotoAndPlay(0);
  }

  playWalkingAnimation() {
    this.animationState = PLAYER_ANIMATION_STATE_WALKING;
    const {fruitType} = this.props;
    const fruit = pixiAssets.getFruit(fruitType);
    this.playerModel.textures = fruit.frames[this.animationState];
    this.playerModel.loop = true;
    this.playerModel.gotoAndPlay(0);
  }

  playWavingAnimation() {
    const {fruitType, waveAnimation} = this.props;
    this.animationState = PLAYER_ANIMATION_STATE_WAVING;
    this.waveAnimation = waveAnimation;
    const fruit = pixiAssets.getFruit(fruitType);
    this.playerModel.textures = fruit.frames[this.animationState];
    this.playerModel.loop = false;
    this.playerModel.gotoAndPlay(0);
    this.playerModel.onComplete = this.onWaveAnimationCompleted;
  }

  playRunningAnimation() {
    this.animationState = PLAYER_ANIMATION_STATE_RUNNING;
    const {fruitType} = this.props;
    const fruit = pixiAssets.getFruit(fruitType);
    this.playerModel.textures = fruit.frames[this.animationState];
    this.playerModel.loop = true;
    this.playerModel.gotoAndPlay(0);
  }

  onWaveAnimationCompleted() {
    this.checkAnimationState();
  }

  render() {
    return null;
  }
}

PixiPlayerModel.defaultProps = {};

export default PixiPlayerModel;
