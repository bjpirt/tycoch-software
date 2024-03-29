import React, { Component } from 'react';
import './HeatingControl.css';

class HeatingControl extends Component {
  button(type, label){
    const data = (name) => this.props.data[this.props.zone + '-' + name];
    let buttonClass = "inactive";
  
    const clickHandler = (type) => {
      return () => {
        this.setState({clicking: true});
        this.props.onClick && this.props.onClick(this.props.zone, type);
      }
    }
    
    if(type === 'off-override'){
      if(data('off-override') > 0) buttonClass = 'active';
    } else if(type === 'timer'){
      if(data('off-override') === 0 && data('boost') === 0) buttonClass = 'active';
    } else if(type === 'boost'){
      if(data('boost') > 0) buttonClass = 'active';
    }

    return <button className={buttonClass} onClick={clickHandler(type)}>{label}</button>
  }

  info(){
    const data = (name) => this.props.data[this.props.zone + '-' + name];
    if(data('off-override') > 0){
      return <span className="info">Off for {data('off-override')} minutes</span>
    }else if(data('boost') > 0){
      return <span className="info">Boosted for {data('boost')} minutes</span>
    }else{
      return null;
    }
  }

  offLabel(){
    let zeropad = (number) => {
      let str = `${number}`;
      if(str.length === 1) str = `0${str}`;
      return str;
    }
    if(this.props.nextChange){
      let t = `${zeropad(Math.floor(this.props.nextChange/60))}:${zeropad(this.props.nextChange%60)}`;
      return `Off until ${t}`;
    }else{
      return 'Off';
    }
  }
  
  render(){
    return (
      <div className="heatingControl">
        <h3>{this.props.zone.charAt(0).toUpperCase() + this.props.zone.substr(1)}</h3>
        { this.button('off-override', this.offLabel()) }
        { this.button('timer', 'Timer') }
        { this.button('boost', 'Boost 1h') }
        { this.info()}
      </div>
    )
  }
}

export default HeatingControl;
