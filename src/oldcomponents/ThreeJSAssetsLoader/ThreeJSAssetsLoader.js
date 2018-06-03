import React, {Component} from 'react';
import {threejsAssets} from '../../threejs/assets';

class ThreeJSAssetsLoader extends Component {

  props: {
    children?: {},
  };

  state: {
    loaded: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    threejsAssets.loadRequiredAssets()
      .then(() => {
        this.setState({
          loaded: true,
        });
      });
  }

  render() {
    const {children} = this.props;
    const {loaded} = this.state;
    if (loaded) return children;
    return (
      <div className='ThreeJSAssetsLoader'>
        LOADING!!!
      </div>
    );
  }
}

ThreeJSAssetsLoader.defaultProps = {};

export default ThreeJSAssetsLoader;
