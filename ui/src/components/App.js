import React, { Component } from 'react';
import './App.css';
import DataHandler from './DataHandler';
import MainDisplay from './MainDisplay';
import GraphDisplay from './GraphDisplay';
import HelpDisplay from './HelpDisplay';
import Nav from './Nav';

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
        },
        temperature: {
          'house-downstairs': 0,
          'house-upstairs': 0,
          'external': 0
        },
        heating: {
          'downstairs-state': 0,
          'upstairs-state': 0
        }
      },
      selectedMenu: 0
    }
  }
  
  updateState = (state) => {
    this.setState((prevState) => {
      for(var key in state){
        prevState.data[key] = prevState.data[key] || {};
        for(var subKey in state[key]){
          prevState.data[key][subKey] = state[key][subKey];
        }
      }
      return prevState;
    });
  }
  
  selectMenu = (menuId) => {
    this.setState({selectedMenu: menuId});
  }
  
  mainScreen(){
    return [
      <MainDisplay data={this.state.data} />,
      <GraphDisplay />,
      <HelpDisplay />
    ][this.state.selectedMenu]
  }

  render() {
    return (
      <div className="App">
        <Nav selected={this.state.selectedMenu} onClick={this.selectMenu} />
        {this.mainScreen()}
      </div>
    );
  }
}

export default App;
