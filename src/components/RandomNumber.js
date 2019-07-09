/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

class RandomNumber extends React.Component{
  //We are passing these elements from Game.js
  //Set props to required
  //also onPress function is required to pass the element index
  static propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  };
  //unique id for this number and basically the position
  handlePress = () =>{
    //if the element is disabled do nothing
    if(this.props.isDisabled){ return; }
    //else add it to array
    this.props.onPress(this.props.id);
  }

  render(){
    return(
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[styles.random,
          this.props.isDisabled && styles.selected]}
        >
          {this.props.number}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  random: {
    backgroundColor: 'rgba(204,204,204,0.5)',
    width: 100,
    marginHorizontal: 15,
    marginVertical: 25,
    paddingVertical: 50,
    fontSize: 35,
    textAlign: 'center',   
  },
  selected: {
    opacity: 0.3,
  }
});

export default RandomNumber;


