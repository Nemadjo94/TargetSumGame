import React from 'react';
import Game from './Game';


class App extends React.Component {
  //Instead of reseting the timers and all that in Game.js
  //We are remounting the Game component to make it easier
  //to restart the game
  state = {
    gameId: 1,
  };

  //Unmount the previous Game and remount it with new value
  resetGame = () =>{
    this.setState((prevState) =>{
      return { gameId: prevState.gameId + 1};
    });
  };
  render() {
    return (
      <Game 
        key={this.state.gameId} 
        onPlayAgain={this.resetGame}
        randomNumberCount={6} 
        initialSeconds={10} 
      />
    );
  }
}

export default App;




