import React, { Component } from 'react';
import DisplayBox from './DisplayBox';
import Arrow from './Arrow';
import './ElectricityDisplay.css';

class ElectricityDisplay extends Component {
  render(){
    return (
      <div className="electricityDisplay">
        <DisplayBox name="Solar Generation" value={this.props.data.pv['power-generation']} unit="W" precision={0} max={2500} graphColor="#F2D599" />
        <Arrow />
        <DisplayBox name="Battery Bank" value={this.props.data.battery['state-of-charge']} unit="%" precision={1} max={100} min={95} rescale={false} graphColor="#A8EFAA"  />
        <Arrow />
        <DisplayBox name="AC Consumption" value={this.props.data.ac['power-usage']} unit="W" precision={0} max={4000} graphColor="#EFA8A8"  />
      </div>
    )
  }
}

export default ElectricityDisplay;

          