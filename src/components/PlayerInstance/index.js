import React from 'react';
import PlayerInstance from './PlayerInstance';
import {connectGameContext} from '../../state/game';

const mapContextToProps = (context, props) => {
  console.log('context', context);
  return {
    test: 'boop',
  };
};


export default connectGameContext(mapContextToProps, PlayerInstance);
