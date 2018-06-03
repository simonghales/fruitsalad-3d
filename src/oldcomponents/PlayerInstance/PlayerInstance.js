import React, {Component} from 'react';
import {Group} from 'three-full';
import PlayerModel from '../PlayerModel/PlayerModel';
import {PlayerState} from '../../state/game';


class PlayerInstance extends Component {

  props: {
    xPosition: number,
    zPosition: number,
    addPlayerGroup(playerGroup: {}): void,
    removePlayerGroup(playerGroup: {}): void,
    addMixer(id: string, mixer: {}): void,
    removeMixer(id: string): void,
  };

  playerGroup;

  constructor(props) {
    super(props);
    this.playerGroup = new Group();
    this.addPlayerModelToGroup = this.addPlayerModelToGroup.bind(this);
    this.removePlayerModelFromGroup = this.removePlayerModelFromGroup.bind(this);
  }

  componentDidMount() {
    // add to scene
    this.addPlayerGroupToScene();
  }

  componentWillUnmount() {
    // remove from scene
    this.removePlayerGroupFromScene();
  }

  // custom

  addPlayerGroupToScene() {
    const {addPlayerGroup} = this.props;
    addPlayerGroup(this.playerGroup);
    this.playerGroup.scale.set(0.2, 0.2, 0.2);
    this.updatePlayerGroupPosition();
  }

  removePlayerGroupFromScene() {
    const {removePlayerGroup} = this.props;
    removePlayerGroup(this.playerGroup);
  }

  addPlayerModelToGroup(playerModel: {}, mixer: {}) {
    const {addMixer} = this.props;
    console.log('playerModel', playerModel);
    addMixer(playerModel.uuid, mixer);
    this.playerGroup.add(playerModel);
  }

  removePlayerModelFromGroup(playerModel: {}) {
    const {removeMixer} = this.props;
    removeMixer('todo');
    this.playerGroup.remove(playerModel);
  }

  updatePlayerGroupPosition() {
    const {xPosition, zPosition} = this.props;
    this.playerGroup.position.setX(xPosition);
    this.playerGroup.position.setZ(zPosition);
  }

  render() {
    const {playerState} = this.props;
    return <PlayerModel addPlayerModel={this.addPlayerModelToGroup}
                        removePlayerModel={this.removePlayerModelFromGroup}
                        playerState={playerState}/>;
  }
}

PlayerInstance.defaultProps = {};

export default PlayerInstance;
