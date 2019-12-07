import React, { Component } from 'react';
import './HeatingTiming.css';

class Block extends Component {
  click = () => {
    this.props.onClick && this.props.onClick(this.props.slot)
  }

  style() {
    return {
      left: `${(this.props.start[0] / this.props.maxTime) * 100}%`,
      height: `${(this.props.start[1] / this.props.maxTemp) * 100}%`,
      width: `${((this.props.end[0] - this.props.start[0]) / this.props.maxTime) * 100}%`,
      borderColor: this.props.slot === this.props.selectedSlot ? '#F00' : ''
    };
  }

  render() {
    console.log()
    return (
      <div className="block" 
           style={this.style()}
           onClick={this.click}></div>
    )
  }
}

class HeatingTiming extends Component {
  state = {
    selectedSlot: null
  };

  static getDerivedStateFromProps(props, state){
    return {
      timing: props.timing
    }
  }

  selectSlot = (slot) => {
    this.setState({selectedSlot: slot === this.state.selectedSlot ? null : slot})
  }

  blocks(){
    if(this.state.timing.length === 0) return null;

    let blocks = [];
    let timing = this.state.timing

    let maxTemp = timing.reduce((acc, time) => {
      if(time[1] > acc) return time[1];
      return acc;
    }, 0);

    blocks.push(<Block onClick={this.selectSlot} start={[0, timing[timing.length-1][1]]} end={timing[0]} maxTime={1440} maxTemp={maxTemp} slot={timing.length-1} selectedSlot={this.state.selectedSlot}/>)

    for(let i=0; i<timing.length; i++){
      let end=[24*60];
      if(i+1 < timing.length){
        end = timing[i+1];
      }
      blocks.push(<Block onClick={this.selectSlot} start={timing[i]} end={end} maxTime={1440} maxTemp={maxTemp} slot={i} selectedSlot={this.state.selectedSlot}/>)
    }
    return blocks;
  }

  updateTiming = (e) => {
    let timing = this.state.timing;
    if(e.target.name === 'startTime'){
      timing[this.state.selectedSlot][0] = Number(e.target.value);
    }
    if(e.target.name === 'temperature'){
      timing[this.state.selectedSlot][1] = Number(e.target.value);
    }
    this.setState({timing});
  }

  render(){
    return (
      <div className="heatingTiming">
        <h3>{this.props.zone.charAt(0).toUpperCase() + this.props.zone.substr(1)}</h3>
        <div className="timeline">
          { this.blocks() }
        </div>
        Start Time: <input type="text" name="startTime" onChange={this.updateTiming} value={this.state.selectedSlot === null ? '' : this.state.timing[this.state.selectedSlot][0]}/>
        Temperature: <input type="text" name="temperature" onChange={this.updateTiming} value={this.state.selectedSlot === null ? '' : this.state.timing[this.state.selectedSlot][1]}/>
        <button>Save</button>
      </div>
    )
  }
}

export default HeatingTiming;
