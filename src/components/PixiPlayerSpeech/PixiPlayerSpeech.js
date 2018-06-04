import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import {FRUIT_ASSETS, FruitAsset, pixiAssets} from '../../pixi/assets';

const leftAnchor = new PIXI.Point(0, 1);

class PixiPlayerSpeech extends Component {

  container;
  texture;
  sprite;

  matterBox;
  matterConstraint;

  width = 160;
  height = 210;

  released = false;
  offscreen = false;
  removed = false;
  removerTimer;

  props: {
    bodyBox: any,
    speechBubbleId: string,
    addChildToParentContainer(): void,
    addMatterBody(object: any): void,
    removeMatterBody(object: any): void,
    removeSpeechBubbleRef(id: string): void,
  };

  constructor(props) {
    super(props);
    this.container = new PIXI.Container();
    this.texture = pixiAssets.speechBubble.texture;
    this.sprite = new PIXI.Sprite.from(this.texture);
    this.sprite.anchor = leftAnchor;
    this.container.addChild(this.sprite);
    this.removeElement = this.removeElement.bind(this);
  }

  componentDidMount() {
    this.initSpeechBubble();
  }

  componentWillUnmount() {
    this.releaseConstraint();
    this.removerTimer = setTimeout(this.removeElement, 5000);
  }

  initSpeechBubble() {
    const {bodyBox, fruitType} = this.props;
    const xPos = bodyBox.position.x;
    const yPos = bodyBox.position.y;
    const width = this.width;
    const height = this.height;
    const fruit: FruitAsset = FRUIT_ASSETS[fruitType];
    const startingXPos = xPos - (width / 2);
    const startingYPos = yPos + fruit.speechBubbleOffset;
    this.matterBox = Matter.Bodies.rectangle(startingXPos, startingYPos, width, height);
    this.props.addMatterBody(this.matterBox);

    this.matterConstraint = Matter.Constraint.create({
      bodyA: bodyBox,
      bodyB: this.matterBox,
      stiffness: 0.5,
      damping: 0.1
      // stiffness: 0.1,
    });

    this.props.addMatterBody(this.matterConstraint);

    this.container.position = this.matterBox.position;
    this.props.addChildToParentContainer(this.container);

  }

  updateContainerElement() {
    if (this.removed) return;
    if (this.matterBox && !this.offscreen) {
      this.container.position = this.matterBox.position;
      this.container.rotation = this.matterBox.angle;
      if (this.matterBox.position.y < -400 && this.released) {
        this.offscreen = true;
        this.removeElement();
      }
    }
  }

  releaseConstraint() {
    if (this.released) return;
    this.released = true;
    const {removeMatterBody} = this.props;
    removeMatterBody(this.matterConstraint);
  }

  removeElement() {
    if (this.removed) return;
    const {speechBubbleId, removeMatterBody, removeSpeechBubbleRef} = this.props;
    removeMatterBody(this.matterBox);
    this.sprite.destroy();
    this.container.parent.removeChild(this.container);
    this.container.destroy({children: true, texture: true, baseTexture: true});
    this.removed = true;
    if (this.removerTimer) {
      clearTimeout(this.removerTimer);
    }
    removeSpeechBubbleRef(speechBubbleId);
  }

  render() {
    return null;
  }
}

PixiPlayerSpeech.defaultProps = {};

export default PixiPlayerSpeech;
