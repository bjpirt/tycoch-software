import React, { Component } from 'react';
import './HeatingOverride.css';

class HeatingOverride extends Component {
  button(type, amount, label){
    const data = (name) => this.props.data[this.props.zone + '-' + name];
    let buttonClass = "inactive";
  
    const clickHandler = (type, amount) => {
      return () => {
        this.setState({clicking: true});
        this.props.onClick && this.props.onClick(this.props.zone, type, amount);
      }
    }
    
    if(type === 'off-override'){
      if(data('off-override') > 60 && amount === 120) buttonClass = 'active';
      if(data('off-override') > 0 && data('off-override') <= 60 && amount === 60) buttonClass = 'active';
    } else if(type === 'timer'){
      if(data('off-override') === 0 && data('boost') === 0) buttonClass = 'active';
    } else if(type === 'boost'){
      if(data('boost') > 60 && amount === 120) buttonClass = 'active';
      if(data('boost') > 0 && data('boost') <= 60 && amount === 60) buttonClass = 'active';
    }

    return <button className={buttonClass} onClick={clickHandler(type, amount)}>{label}</button>
  }
  
  render(){
    return (
      <div className="heatingOverride">
        <h3>{this.props.zone.charAt(0).toUpperCase() + this.props.zone.substr(1)}</h3>
        { this.button('off-override', 120, 'Off 2h') }
        { this.button('off-override', 60, 'Off 1h') }
        { this.button('timer', null, 'Timer') }
        { this.button('boost', 60, 'Boost 1h') }
        { this.button('boost', 120, 'Boost 2h') }
      </div>
    )
  }
}

export default HeatingOverride;
