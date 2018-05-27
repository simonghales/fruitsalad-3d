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