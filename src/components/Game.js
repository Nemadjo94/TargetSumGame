/* eslint-disable linebreak-style */
import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component{
  //Props are passed through App.js
  //Using propTypes we inquire which values are required
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  //We keep the selected ids inside the array
  //which is empty at the beggining of the game
  //We are not placing the actual numbers but rather 
  //the positional order(index) of each number

  //remaining seconds are passed from App.js
  state = {
    selectedIDs: [],
    remainingSeconds: this.props.initialSeconds,
    currentSum: 0,
  };

  //Game status starts with 'PLAYING'
  gameStatus = 'PLAYING';

  //Generate an Array of number from randomNumberCount
  //Whis is parsed from App.js
  //Map is called on each member of the array
  randomNumbers = Array
    .from({ length: this.props.randomNumberCount})
    .map(() => 1 + Math.floor(10 * Math.random()));
  
  //Using lodash functions we are shuffling the randomNumbers
  //
  shuffledRandomNumbers = shuffle(this.randomNumbers)

  //Using slice get first four numbers of the array
  //Using reduce we sum up those numbers
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  
  //When the component mounts than start the interval
  //setInterval & 1000 means do this function every second
  //
  componentDidMount(){
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return { remainingSeconds: prevState.remainingSeconds - 1};
        //Second callback function which stops the timer at 0
      }, () => {
        if (this.state.remainingSeconds === 0){
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    //Clear the timer because we should not leave timers
    clearInterval(this.intervalId);
  }

  isNumberSelected = (numberIndex) => {
    //if number is not selected its -1 thats why >=0
    return this.state.selectedIDs.indexOf(numberIndex) >= 0;
  }

  //get the number value by passing the elements index
  //Explanation: every time we want to copy the existing selectedIDs
  //and then append this new numberIndex to the same array and return that
  //return new object to be merged with the state
  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIDs: [...prevState.selectedIDs, numberIndex],
    }));
  };

  //This method happens right before the render method
  //Compute the game status based on the nextState that is 
  //comming to this component
  // eslint-disable-next-line react/no-deprecated
  componentWillUpdate(nextProps, nextState){
    if(nextState.selectedIDs !== this.state.selectedIDs ||
       nextState.remainingSeconds === 0){
      this.gameStatus = this.calcGameStatus(nextState);
      //If the game is won/lost stop the timer
      if(this.gameStatus !== 'PLAYING'){
        clearInterval(this.intervalId); 
      }
    }
  }
  //Save the current sum of clicked number to display
  //Using setState we change the value on every press inside the calcGameStatus
  //Problem: it only works until the second last number than it stops
  //If i call the setState () => func than it works but its getting an infinite loop
  updateCurrentSum = (sumSelected) =>{
    //this.setState(() => {this.state.currentSum = sumSelected;});
    this.setState(() => ({
      currentSum: sumSelected,
    }));
  }

  //game status can be: PLAYING, WON, LOST
  //since selectedIDs keeps the array of selected elements ids(indexes)
  //we are using reduce to accumulate the numbers by accessing 
  //the shuffledRandomNumbers array using the selected elements ids(indexes)
  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIDs.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);

    //Call the updateCurrentSum func
    if(this.state.remainingSeconds !== 0){
      this.updateCurrentSum(sumSelected);
    }

    //Works but when timer hits 1, it errors
    //this.setState(() => ({
    // currentSum: sumSelected,
    //}));

    //this.setState({
    //  currentSum: sumSelected
    //});

    //Does not display an error but does not calculate the last input
    //this.updateCurrentSum(sumSelected);

    //Code here is self explanatory
    if(nextState.remainingSeconds === 0){
      return 'LOST';
    }
    if(sumSelected < this.target){
      return 'PLAYING';
    }
    if(sumSelected === this.target){
      return 'WON';
    }
    if(sumSelected > this.target){
      return 'LOST';
    }
    
  };

  getSelectedSum = (nextState) => {
    const sumSelected = nextState.selectedIDs.reduce((acc, curr) =>{
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    return sumSelected;
  }


  render(){

    //Only update the gameStatus when we press on the elements
    const gameStatus = this.gameStatus;

    //Generate boxes with our random numbers
    //Using map we generate random numbers
    //But jsx requires a key value which
    //is passed from index of the randomNumber array
    ///we are passing id to represent the index
    return(
      
      <View style={styles.container}>       
        <Text style={[styles.target, 
          /*Change style with game status */styles[`STATUS_${gameStatus}`]]}
        >{this.target}
        </Text>

        <View style={styles.currentSumContainer}>
          <Text style={[styles.currentSum, styles[`STATUS_${gameStatus}`]]}>
            {this.state.currentSum}
          </Text>
        </View>

        <View //This is the background timer 
          style={styles.timerContainer}>
          <Text style={styles.timerText}>{this.state.remainingSeconds}</Text>
        </View>

        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (        
            <RandomNumber 
              key={index} 
              id={index}
              number={randomNumber} 
              //Numbers are disabled onPress
              //Disable all numbers if the gameStatus is not 'PLAYING'
              isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
              onPress={this.selectNumber}
            />
          ))}
          
        </View>
        
        {
          //Display win/lose message
          this.gameStatus !== 'PLAYING' &&
          (
            <Text style={[styles.target, 
              /*Change style with game status */styles[`STATUS_${gameStatus}`]]}
            >{`YOU HAVE ${gameStatus}`}
            </Text>
          )
        }

        {
          //If the game is won/lost display the play again button
          this.gameStatus !== 'PLAYING' && 
          (<Button 
            title='Play again' 
            //On press restart the game
            onPress={this.props.onPlayAgain} 
          />) 
        }
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#ddd',
    flex: 1,
  },
  target: {
    fontSize: 50,
    backgroundColor: '#bbb',
    marginHorizontal: 15,
    marginTop: 50,
    marginBottom: 20,
    textAlign: 'center',
  },
  currentSumContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentSum: {
    fontSize: 25,
    width: 70,
    height: 70,
    textAlignVertical: 'center',
    borderRadius: 100/2,
    textAlign: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 200,
  },
  randomContainer: {
    flex: 1,
    zIndex: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;

