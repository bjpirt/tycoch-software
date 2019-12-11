import React, { Component } from 'react';
import './TemperatureDisplay.css';

class TemperatureDisplay extends Component {
  render(){
    let heatingState = () => {
      return this.props.state ? 'on' : 'off'
    }
    
    return (
      <div className="temperatureDisplay">
        <span className={'heating-state-' + heatingState()}>{this.props.zone.charAt(0).toUpperCase() + this.props.zone.substr(1)}</span>
        <span>{this.props.temp.toFixed(1)}°C</span>
      </div>
    )
  }
}

export default TemperatureDisplay;
