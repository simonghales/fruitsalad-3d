import React, {Component} from 'react';
import * as PIXI from "pixi.js";
import {
  FRUIT_ASSETS, FruitAsset, MISC_ASSETS_TO_LOAD, pixiAssets,
  SPEECH_BUBBLE_ASSET
} from '../../pixi/assets';
import {SpritesheetHandler} from '../../pixi/spritesheet';

class PixiAssetsLoader extends Component {

  loader = PIXI.loader;

  state: {
    loadedAllAssets: boolean,
    loadingAssets: number,
    remainingAssets: number,
    processingAssets: boolean,
    loadingFruit: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      loadedAllAssets: false,
      loadingAssets: 0,
      remainingAssets: 0,
      processingAssets: false,
      loadingFruit: {},
    };
    this.loader = new PIXI.loaders.Loader();
    this.handleFruitLoaded = this.handleFruitLoaded.bind(this);
    this.handleLoaded = this.handleLoaded.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.checkIfAllAssetsLoaded = this.checkIfAllAssetsLoaded.bind(this);
  }

  componentDidMount() {
    this.loadAssets();
  }

  loadAssets() {

    let remainingAssets = 0;
    let loadingFruit = {};

    for (let fruitKey in FRUIT_ASSETS) {
      const fruit: FruitAsset = FRUIT_ASSETS[fruitKey];
      this.loader.add(fruitKey, fruit.image);
      this.loader.resources[fruitKey].onComplete.add(() => {
        this.handleFruitLoaded(fruitKey);
      });
      loadingFruit[fruitKey] = true;
      remainingAssets++;
    }

    this.loader.add(SPEECH_BUBBLE_ASSET, MISC_ASSETS_TO_LOAD[SPEECH_BUBBLE_ASSET]);
    remainingAssets++;

    this.loader.load(this.handleLoaded);

    this.loader.onProgress.add(this.handleProgress);

    this.setState({
      loadingAssets: remainingAssets,
      remainingAssets: remainingAssets,
      loadingFruit: loadingFruit,
    });

  }

  handleLoaded(loader, resources) {

    pixiAssets.speechBubble = resources[SPEECH_BUBBLE_ASSET];
    this.setState({
      remainingAssets: this.state.remainingAssets - 1,
      processingAssets: true,
    });
    this.checkIfAllAssetsLoaded();

    for (let fruitKey in FRUIT_ASSETS) {
      const fruit: FruitAsset = FRUIT_ASSETS[fruitKey];
      pixiAssets.fruit[fruitKey] = new SpritesheetHandler(resources[fruitKey].texture.baseTexture, fruit.json);
      pixiAssets.fruit[fruitKey].createFrames(true)
        .then(() => {
          this.setState({
            remainingAssets: this.state.remainingAssets - 1,
          }, () => {
            this.checkIfAllAssetsLoaded();
          });
        });
    }

  }

  handleFruitLoaded(fruitKey: string) {
    this.setState({
      loadingFruit: {
        ...this.state.loadingFruit,
        [fruitKey]: false,
      }
    });
  }

  handleProgress() {
    this.setState({
      loadingAssets: this.state.loadingAssets - 1,
    });
  }

  checkIfAllAssetsLoaded() {
    if (this.state.remainingAssets === 0) {
      console.log('all assets loaded', pixiAssets);
      this.setState({
        loadedAllAssets: true,
      });
    }
  }

  render() {
    const {loadedAllAssets, processingAssets} = this.state;
    if (loadedAllAssets) {
      return this.props.children;
    }
    return (
      <div className='PixiAssetsLoader'>
        <div className='PixiAssetsLoader__content'>
          <div className='PixiAssetsLoader__title'>loading assets</div>
          <div className='PixiAssetsLoader__subtitle'>this might take a minute</div>
          <div>
            <div></div>
            <div>
              {
                processingAssets ? 'processing fruit' : 'downloading fruit'
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PixiAssetsLoader.defaultProps = {};

export default PixiAssetsLoader;
