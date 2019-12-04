import React, { Component } from 'react';
import HeatingOverride from './HeatingOverride';
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

  render(){
    return (
      <div className="heatingDisplay panelContainer">
        <div className="panel half timerPanel">
          <h2>Timing Control</h2>          
          
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
