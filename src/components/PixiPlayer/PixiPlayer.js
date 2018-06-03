import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import {TweenMax, Power0, Power1, Circ, SlowMo} from 'gsap';
import PixiPlayerModel from '../PixiPlayerModel/PixiPlayerModel';
import {PLAYER_ANIMATION_STATE_IDLE, PLAYER_ANIMATION_STATE_RUNNING, PlayerState} from '../../state/game';
import PixiPlayerName from '../PixiPlayerName/PixiPlayerName';
import interpolate from 'interpolate-range';

export function getTweenDuration(duration: number): number {
  return duration / 1000;
}

const MEASUREMENT_SIDE_PADDING = 100;

export function getMovementMaxDistance(): number {
  return window.innerWidth - (MEASUREMENT_SIDE_PADDING * 2);
}

export function getMappedMovementDuration(floor: number, ceil: number, distance: number, tweenDuration: number, minTweenDuration = 0): number {
  return interpolate({
    inputRange: [floor, ceil],
    outputRange: [minTweenDuration, tweenDuration],
    clamp: true,
  })(distance);
}

class PixiPlayer extends Component {

  bodyBox;
  playerContainer;

  playerModelRef;

  verticalTween;
  moveTween;

  props: {
    player: PlayerState,
    addPlayerToScene(): void,
    removePlayerFromScene(): void,
    addMatterBody(): void,
    removeMatterBody(): void,
  };

  state: {
    updatingYPosition: boolean,
    updatingXPosition: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {
      updatingYPosition: false,
      updatingXPosition: false,
    };
    this.addChildToContainer = this.addChildToContainer.bind(this);
    this.addPlayerModelToContainer = this.addPlayerModelToContainer.bind(this);
    this.removePlayerModelFromContainer = this.removePlayerModelFromContainer.bind(this);
    this.updatePixiElements = this.updatePixiElements.bind(this);

    this.updateXPosition = this.updateXPosition.bind(this);
    this.setXMovementState = this.setXMovementState.bind(this);
    this.finishedUpdatingXPosition = this.finishedUpdatingXPosition.bind(this);

    this.updateYPosition = this.updateYPosition.bind(this);
    this.finishedUpdatingYPosition = this.finishedUpdatingYPosition.bind(this);

    this.playerModelRef = React.createRef();
    this.playerContainer = new PIXI.Container();
    this.initBodyBox(props);
    this.setContainerPosition();
  }

  componentDidMount() {
    this.props.addPlayerToScene(this.playerContainer);
  }

  componentWillUnmount() {
    this.props.removePlayerFromScene(this.playerContainer);
    this.props.removeMatterBody(this.bodyBox);
  }

  componentDidUpdate(previousProps) {
    const {player} = this.props;
    const previousPlayer: PlayerState = previousProps.player;
    if (player.xPosition !== previousPlayer.xPosition) {
      this.updateXPosition(previousPlayer);
    }
    if (player.yPosition !== previousPlayer.yPosition) {
      this.updateYPosition(previousPlayer);
    }
  }

  // container

  initBodyBox(props) {
    const {addMatterBody, player} = props;
    this.bodyBox = Matter.Bodies.rectangle(player.xPosition, player.yPosition, 10, 10);
    Matter.Body.setStatic(this.bodyBox, true);
    addMatterBody(this.bodyBox);
  }

  setContainerPosition() {
    const {player} = this.props;
    this.playerContainer.position.x = player.xPosition;
    this.playerContainer.position.y = player.yPosition;
  }

  updatePixiElements() {
    if (!this.bodyBox || !this.playerContainer) return;
    this.playerContainer.position = this.bodyBox.position;
  }

  // end container

  // update

  updateYPosition() {
    const {player} = this.props;
    const tweenDuration = 1000;
    const {yPosition} = player;
    if (this.bodyBox.position.y === yPosition) {
      this.finishedUpdatingYPosition();
      return;
    }
    if (this.verticalTween) {
      this.verticalTween.kill();
    }
    this.verticalTween = TweenMax.to(this.bodyBox.position, getTweenDuration(tweenDuration), {
      y: yPosition,
      onComplete: this.finishedUpdatingYPosition,
    });
    this.setYMovementState();
  }

  finishedUpdatingYPosition() {
    this.setYMovementState(false);
  }

  setYMovementState(moving: boolean = true) {
    this.setState({
      updatingYPosition: moving,
    });
  }

  updateXPosition(previousPlayer: PlayerState) {
    const {player} = this.props;
    const tweenDuration = player.animationDuration;
    const {xPosition} = player;
    if (this.bodyBox.position.x === xPosition) {
      this.finishedUpdatingXPosition();
      return;
    }
    if (this.moveTween) {
      this.moveTween.kill();
    }
    const distance = Math.abs(this.bodyBox.position.x - xPosition);
    const duration = getTweenDuration(getMappedMovementDuration(0, getMovementMaxDistance(), distance, tweenDuration));
    this.moveTween = TweenMax.to(this.bodyBox.position, duration, {
      ease: Power1.easeInOut,
      x: xPosition,
      onComplete: this.finishedUpdatingXPosition,
    });
    this.setXMovementState();
  }

  finishedUpdatingXPosition() {
    this.setXMovementState(false);
  }

  setXMovementState(moving: boolean = true) {
    this.setState({
      updatingXPosition: moving,
    });
  }

  // end update

  addChildToContainer(child) {
    this.playerContainer.addChild(child);
  }

  addPlayerModelToContainer(playerModel) {
    this.playerContainer.addChild(playerModel);
  }

  removePlayerModelFromContainer(playerModel) {
    this.playerContainer.removeChild(playerModel);
  }

  render() {
    const {player} = this.props;
    const {updatingXPosition, updatingYPosition} = this.state;
    return (
      <React.Fragment>
        <PixiPlayerModel addPlayerModelToContainer={this.addPlayerModelToContainer}
                         removePlayerModelFromContainer={this.removePlayerModelFromContainer}
                         animationState={player.animationState}
                         updatingXPosition={updatingXPosition} updatingYPosition={updatingYPosition}
                         waveAnimation={player.waveAnimation}
                         fruitType={player.fruit} ref={this.playerModelRef}/>
        <PixiPlayerName name={player.name} displayName={player.displayName}
                        addChildToContainer={this.addChildToContainer}/>
      </React.Fragment>
    );
  }
}

PixiPlayer.defaultProps = {};

export default PixiPlayer;