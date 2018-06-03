import React from 'react';
import PlayerInstance from './PlayerInstance';
import {connectGameContext, getPlayerStateByKey} from '../../state/game';

const mapContextToProps = (context, props) => {
  const {playerKey} = props;
  const playerState = getPlayerStateByKey(context.players, playerKey);
  return {
    xPosition: playerState.xPosition,
    zPosition: playerState.zPosition,
  };
};


export default connectGameContext(mapContextToProps, PlayerInstance);
