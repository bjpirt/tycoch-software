import React, { Component } from 'react';
import './HeatingTiming.css';
import Timeline from './Timeline';

class Block extends Component {
  click = () => {
    this.props.onClick && this.props.onClick(this.props.slot)
  };

  style() {
    return {
      left: `${(this.props.start[0] / this.props.maxTime) * 100}%`,
      height: `${(this.props.start[1] / this.props.maxTemp) * 100}%`,
      width: `${((this.props.end[0] - this.props.start[0]) / this.props.maxTime) * 100}%`
    };
  }

  render() {
    let selectedClass = (this.props.slot === this.props.selectedSlot ? ' selected' : '');
    return (
      <div className={`block temp${this.props.start[1]}${selectedClass}`} 
           style={this.style()}
           onClick={this.click}>
        <span>{this.props.start[1]}&deg;C</span>
      </div>
    )
  }
}

class HeatingTiming extends Component {
  state = {
    selectedSlot: null,
    modified: false
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

    blocks.push(<Block key={-1} onClick={this.selectSlot} start={[0, timing[timing.length-1][1]]} end={timing[0]} maxTime={1440} maxTemp={maxTemp} slot={timing.length-1} selectedSlot={this.state.selectedSlot}/>)

    for(let i=0; i<timing.length; i++){
      let end=[24*60];
      if(i+1 < timing.length){
        end = timing[i+1];
      }
      blocks.push(<Block key={i} onClick={this.selectSlot} start={timing[i]} end={end} maxTime={1440} maxTemp={maxTemp} slot={i} selectedSlot={this.state.selectedSlot}/>)
    }
    return blocks;
  }

  marker(){
    const pos = (this.props.currentTime / 1440) * 100;
    const style = {left: `${pos}%`}
    return <div className="marker" style={style}></div>
  }

  updateTiming = (e) => {
    let timing = this.state.timing;
    if(e.target.name === 'startHour'){
      timing[this.state.selectedSlot][0] = (Number(e.target.value) * 60) + (timing[this.state.selectedSlot][0]%60);
    }
    if(e.target.name === 'startMinute'){
      timing[this.state.selectedSlot][0] = Number(e.target.value) + timing[this.state.selectedSlot][0] - (timing[this.state.selectedSlot][0]%60);
    }
    if(e.target.name === 'temperature'){
      timing[this.state.selectedSlot][1] = Number(e.target.value);
    }
    this.setState({timing, modified: true});
  }

  saveTiming = () => {
    this.props.onSet && this.props.onSet(this.props.zone, this.state.timing);
    this.setState({modified: false})
  }

  options(min, max, step){
    let zeropad = (number) => {
      let str = `${number}`;
      if(str.length === 1) str = `0${str}`;
      return str;
    }

    let options = [<option value="" key="empty"></option>]
    for(let i=min; i< max; i+=step){
      options.push(<option value={i} key={i}>{zeropad(i)}</option>);
    }
    return options;
  }

  render(){
    return (
      <div className="heatingTiming">
        <h3>{this.props.zone.charAt(0).toUpperCase() + this.props.zone.substr(1)}</h3>
        <div className="timeline">
          { this.marker() }
          { this.blocks() }
        </div>
        <Timeline />

        <label htmlFor="startHour">Start Time: </label>
        <select name="startHour"
                disabled={this.state.selectedSlot === null}
                onChange={this.updateTiming}
                value={this.state.selectedSlot === null ? '' : Math.floor(this.state.timing[this.state.selectedSlot][0]/60)}>
          {this.options(0, 24, 1)}
        </select>
        <select name="startMinute"
                disabled={this.state.selectedSlot === null}
                onChange={this.updateTiming}
                value={this.state.selectedSlot === null ? '' : this.state.timing[this.state.selectedSlot][0]%60}>
          {this.options(0, 60, 5)}
        </select>
        <label htmlFor="temperature"> Temperature: </label> 
        <select name="temperature"
                disabled={this.state.selectedSlot === null}
                onChange={this.updateTiming}
                value={this.state.selectedSlot === null ? '' : this.state.timing[this.state.selectedSlot][1]}>
          {this.options(10, 20, 1)}
        </select>
        <button className={this.state.modified ? '': 'deselected'}
                disabled={!this.state.modified}
                onClick={this.saveTiming}>Save</button>
      </div>
    )
  }
}

export default HeatingTiming;
