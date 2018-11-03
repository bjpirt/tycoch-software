import React, { Component } from 'react';
import ThermalStoreDisplay from './ThermalStoreDisplay';
import TemperatureDisplay from './TemperatureDisplay';
import ElectricityDisplay from './ElectricityDisplay';
import './MainDisplay.css';

class MainDisplay extends Component {
  render(){
    return (
      <div className="mainDisplay panelContainer">
        <div className="panel half heatingPanel">
          <h2>Heating</h2>          
          <h3>Thermal Store</h3>
          <ThermalStoreDisplay values={this.props.data['thermal-store']} />
          <h3>Temperature</h3>
          <TemperatureDisplay zone="downstairs" temp={this.props.data.temperature['house-downstairs']} state={this.props.data.heating['downstairs']} />
          <TemperatureDisplay zone="upstairs" temp={this.props.data.temperature['house-upstairs']} state={this.props.data.heating['upstairs']} />
          <TemperatureDisplay zone="outside" temp={this.props.data.temperature['external']} control={false}/>
        </div>
        <div className="panel half electricityPanel">
          <h2>Electricity</h2>
          <ElectricityDisplay data={this.props.data}/>
        </div>
      </div>
    )
  }
}

export default MainDisplay;
