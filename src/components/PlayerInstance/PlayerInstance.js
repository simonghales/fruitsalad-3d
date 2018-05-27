import React, {Component} from 'react';
import {Group} from 'three-full';
import PlayerModel from '../PlayerModel/PlayerModel';


class PlayerInstance extends Component {

  props: {
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

  render() {
    return <PlayerModel addPlayerModel={this.addPlayerModelToGroup}
                        removePlayerModel={this.removePlayerModelFromGroup}/>;
  }
}

PlayerInstance.defaultProps = {};

export default PlayerInstance;
