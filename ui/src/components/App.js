import React, { Component } from 'react';
import './App.css';
import DataHandler from '../lib/DataHandler';
import MainDisplay from './MainDisplay';
import HeatingDisplay from './HeatingDisplay';
import GraphDisplay from './GraphDisplay';
import HelpDisplay from './HelpDisplay';
import DefaultStateData from '../lib/DefaultStateData.json'
import Nav from './Nav';

class App extends Component {
  constructor(props){
    super(props);
    this.dataHandler = new DataHandler();
    this.dataHandler.onChange = this.updateState;
    this.state = {
      data: DefaultStateData,
      selectedMenu: 1
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
      <HeatingDisplay data={this.state.data.heating} dataHandler={this.dataHandler} />,
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
