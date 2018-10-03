import React, { Component } from 'react';
import './TemperatureDisplay.css';

class TemperatureDisplay extends Component {
  boost = () => {
    console.log("Boost " + this.props.zone)
    let data = `heating ${this.props.zone}-boost=1`;
    let url = `http://${window.location.host.split(':')[0]}:8086/write?db=tycoch&precision=s`;
    fetch(url, {
      method: 'GET',
      body: data
    }).then(() => {
      console.log('success');
    })
  }
  
  controlElement(){
    if(typeof this.props.control !== 'undefined' && !this.control){
      return <span/>
    }else{
      return <button onClick={this.boost}>+1h Boost</button>
    }
  }
  
  render(){
    let heatingState = () => {
      return this.props.state ? 'on' : 'off'
    }
    
    return (
      <div className="temperatureDisplay">
        <span className={'heating-state-' + heatingState()}>{this.props.zone.charAt(0).toUpperCase() + this.props.zone.substr(1)}</span>
        <span>{this.props.temp.toFixed(1)}°C</span>
        {this.controlElement()}
      </div>
    )
  }
}

export default TemperatureDisplay;
