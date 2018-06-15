import React, { Component } from 'react';
import './App.css';
import DataHandler from './DataHandler';
import MainDisplay from './MainDisplay';

class App extends Component {
  constructor(props){
    super(props);
    this.dataHandler = new DataHandler();
    this.dataHandler.onChange = this.updateState;
    this.state = {
      data: {
        pv: {
          'power-generation': 0
        },
        battery: {
          'state-of-charge': 0
        },
        ac: {
          'power-usage': 0
        },
        'thermal-store': {
          'tank-sensor1': 0,
          'tank-sensor2': 0,
          'tank-sensor3': 0,
          'tank-sensor4': 0
        }
      }
    }
  }
  
  updateState = (state) => {
    this.setState((prevState) => {
      console.log(state)
      for(var key in state){
        prevState.data[key] = prevState.data[key] || {};
        for(var subKey in state[key]){
          prevState.data[key][subKey] = state[key][subKey];
        }
      }
      return prevState;
    });
  }

  render() {
    return (
      <div className="App">
        <nav>
        </nav>
        <MainDisplay data={this.state.data} />
      </div>
    );
  }
}

export default App;
