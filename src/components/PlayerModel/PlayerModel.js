import React, {Component} from 'react';
import {GeneratedFruitModel, generateFruitModel} from '../../threejs/models';
import {ASSET_FRUIT_BANANA_ID} from '../../threejs/assets';

class PlayerModel extends Component {

  props: {
    addPlayerModel(playerModel: {}): void,
    removePlayerModel(playerModel: {}): void,
  };

  playerModel: GeneratedFruitModel;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // add fruit model
    this.generateFruitModel();
    this.addFruitModel();
  }

  addFruitModel() {
    const {addPlayerModel} = this.props;
    console.log('playermodel', this.playerModel);
    this.playerModel.action.walk.play();
    addPlayerModel(this.playerModel.character, this.playerModel.mixer);
  }

  generateFruitModel() {
    this.playerModel = generateFruitModel(ASSET_FRUIT_BANANA_ID);
  }

  removeFruitModel() {
    const {removePlayerModel} = this.props;
    removePlayerModel(this.playerModel.character);
  }

  updateFruitModel() {

  }

  render() {
    return null;
  }
}

PlayerModel.defaultProps = {};

export default PlayerModel;
