import React from 'react';

export const GameContext = React.createContext();

export const connectGameContext = (mapContextToProps, Component) => {

  return function WrappedComponent(props) {

    return (
      <GameContext.Consumer>
        {
          context => <Component {...props} {...mapContextToProps(context, props)}/>
        }
      </GameContext.Consumer>
    );

  };

};

export function getPlayerStateByKey(players: GamePlayersState, playerKey: string) {
  return (players[playerKey]) ? players[playerKey] : null;
}

export const PLAYER_ANIMATION_STATE_IDLE = 'idle';
export const PLAYER_ANIMATION_STATE_WALKING = 'walking';
export const PLAYER_ANIMATION_STATE_WAVING = 'waving';
export const PLAYER_ANIMATION_STATE_RUNNING = 'running';

export interface PlayerState {
  animationState: PLAYER_ANIMATION_STATE_IDLE | PLAYER_ANIMATION_STATE_WALKING | PLAYER_ANIMATION_STATE_WAVING,
  animationDuration: number,
  waveAnimation: number,
  isWalking: boolean,
  name: string,
  displayName: boolean,
  fruit: string,
  xPosition: number,
  yPosition: number,
}

export interface GamePlayersState {
  [string]: PlayerState,
}

// export interface PlayerModelState {
//
// }
//
// export interface GamePlayersModelsState {
//   [string]: PlayerModelState,
// }