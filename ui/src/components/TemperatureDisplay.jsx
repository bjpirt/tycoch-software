import React, { Component } from 'react';
import './TemperatureDisplay.css';

export default class TemperatureDisplay extends Component {
  render(){
    let heatingState = () => {
      return this.props.state ? 'on' : 'off'
    }
    return (
      <div className={'temperatureDisplay ' + heatingState()}>
        <h4>{this.props.zone.charAt(0).toUpperCase() + this.props.zone.substr(1)}</h4>
        <svg x="0px" y="0px" viewBox="0 0 400 80">
          <text transform="matrix(1 0 0 1 0.0034 61.5996)">
            <tspan font-size="72">{this.props.temp.toFixed(1)}</tspan><tspan className="subText" font-size="36">°C</tspan>
            {this.props.settemp !== undefined ? <tspan className="subText" font-size="36"> / {this.props.settemp.toFixed(0)}°C</tspan> : null }
          </text>
        </svg>
      </div>
    )
  }
}
