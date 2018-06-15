import React, { Component } from 'react';
import DisplayBox from './DisplayBox';
import ThermalStoreDisplay from './ThermalStoreDisplay';

class MainDisplay extends Component {
  render(){
    return (
      <div className="mainDisplay">
        <h2>Heating</h2>
        <ThermalStoreDisplay values={this.props.data['thermal-store']} />
        <h2>Electricity</h2>
        <DisplayBox name="Solar Generation" value={this.props.data.pv['power-generation']} />
        <DisplayBox name="Battery Bank" value={this.props.data.battery['state-of-charge']} />
        <DisplayBox name="Consumption" value={this.props.data.ac['power-usage']} />
      </div>
    )
  }
}

export default MainDisplay;
