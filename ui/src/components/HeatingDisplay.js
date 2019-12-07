import React, { Component } from 'react';
import HeatingOverride from './HeatingOverride';
import HeatingTiming from './HeatingTiming';
import './HeatingDisplay.css';

class HeatingDisplay extends Component {
  componentDidMount(){
    this.props.dataHandler.sendMessage({
      action: 'getHeatingTiming'
    })
  }

  handleOverride = (zone, type, amount) => {
    let values = [];
    if(this.props.dataHandler){
      if(type === 'boost'){
        values.push({[`${zone}-boost`]: amount})
        values.push({[`${zone}-off-override`]: 0})
      }
      if(type === 'off-override'){
        values.push({[`${zone}-boost`]: 0})
        values.push({[`${zone}-off-override`]: amount})
      }
      if(type === 'timer'){
        values.push({[`${zone}-boost`]: 0})
        values.push({[`${zone}-off-override`]: 0})
      }

      this.props.dataHandler.sendMessage({
        action: 'set',
        values: values
      })
    }
  }

  setHeatingTiming = (timing) => {
    console.log(timing);
  }

  render(){
    return (
      <div className="heatingDisplay panelContainer">
        <div className="panel half timerPanel">
          <h2>Timing</h2>
          <HeatingTiming zone="upstairs" timing={this.props.data.timing.upstairs} onSet={this.setHeatingTiming} />
          <HeatingTiming zone="downstairs" timing={this.props.data.timing.downstairs} onSet={this.setHeatingTiming} />
        </div>
        <div className="panel half electricityPanel">
          <h2>Overrides</h2>
          <HeatingOverride zone="upstairs" onClick={this.handleOverride} data={this.props.data}/>
          <HeatingOverride zone="downstairs" onClick={this.handleOverride} data={this.props.data} />
        </div>
      </div>
    )
  }
}

export default HeatingDisplay;
