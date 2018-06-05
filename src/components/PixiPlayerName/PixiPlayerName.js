import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import {TweenMax} from 'gsap';

const textAnchor = new PIXI.Point(0.5, 1);

const TEXT_STYLE = {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 0xffffff,
  align: 'center',
};

class PixiPlayerName extends Component {

  pixiText;

  alphaTween;

  props: {
    name: string,
    displayName: boolean,
    addChildToContainer(): void,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {displayName, name} = this.props;
    this.pixiText = new PIXI.Text(name, TEXT_STYLE);
    this.pixiText.anchor = textAnchor;
    this.pixiText.position.y = -10;
    this.pixiText.alpha = (displayName) ? 1 : 0;
    this.props.addChildToContainer(this.pixiText);
  }

  componentDidUpdate(previousProps) {
    if (this.props.displayName !== previousProps.displayName) {
      this.toggleAlpha();
    }
  }

  toggleAlpha() {
    const {displayName} = this.props;
    const alpha = (displayName) ? 1 : 0;
    if (this.alphaTween) {
      this.alphaTween.kill();
    }
    this.alphaTween = TweenMax.to(this.pixiText, 500 / 1000, {
      alpha: alpha,
    });
  }

  render() {
    return null;
  }
}

PixiPlayerName.defaultProps = {};

export default PixiPlayerName;
