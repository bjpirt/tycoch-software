import React, { Component } from 'react';
import HeatingControl from './HeatingControl';
import OccupancyControl from './OccupancyControl';
import HeatingTiming from './HeatingTiming';
import './HeatingDisplay.css';

class HeatingDisplay extends Component {
  componentDidMount(){
    this.props.dataHandler.sendMessage({
      action: 'getHeatingTiming'
    })
  }

  nextChange(zone){
    const timings = this.props.data.timing[zone];
    if(timings.length === 0) return null;
    const now = this.props.data.utctime;
    let nextTime = timings[0][0];
    for(let i in timings){
      if(timings[i][0] > now){
        nextTime = timings[i][0];
        break;
      }
    };
    return nextTime;
  }

  minutesUntilNextChange(zone){
    const now = this.props.data.utctime;
    const diff = this.nextChange(zone) - now;
    if(diff < 0) return 1440 + diff;
    return diff;
  }

  handleOverride = (zone, type) => {
    let values = [];
    if(this.props.dataHandler){
      if(type === 'boost'){
        values.push({[`${zone}-boost`]: 60})
        values.push({[`${zone}-off-override`]: 0})
      }
      if(type === 'off-override'){
        values.push({[`${zone}-boost`]: 0})
        values.push({[`${zone}-off-override`]: this.minutesUntilNextChange(zone)})
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

  setHeatingTiming = (zone, timing) => {
    this.props.dataHandler.sendMessage({
      action: 'set',
      values: [{[`${zone}-timing`]: timing}]
    })
  }

  setOccupancy = (value) => {
    this.props.dataHandler.sendMessage({
      action: 'set',
      values: [value]
    })
  }

  render(){
    return (
      <div className="heatingDisplay panelContainer">
        <div className="panel full">
          <h2>Timing</h2>
          <HeatingTiming zone="upstairs" timing={this.props.data.timing.upstairs} onSet={this.setHeatingTiming} />
          <HeatingTiming zone="downstairs" timing={this.props.data.timing.downstairs} onSet={this.setHeatingTiming} />
          <h2>Controls</h2>
          <HeatingControl zone="upstairs" onClick={this.handleOverride} data={this.props.data} nextChange={this.nextChange('upstairs')} />
          <HeatingControl zone="downstairs" onClick={this.handleOverride} data={this.props.data} nextChange={this.nextChange('downstairs')} />
          <OccupancyControl data={this.props.data} onSet={this.setOccupancy} />
        </div>
      </div>
    )
  }
}

export default HeatingDisplay;
