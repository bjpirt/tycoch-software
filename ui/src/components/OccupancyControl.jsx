import React, { Component } from 'react';
import './OccupancyControl.css';

class OccupancyControl extends Component {
  button(type, amount, label){
    let buttonClass = "inactive";
  
    const clickHandler = (type, amount) => {
      return () => {
        this.props.onSet && this.props.onSet({[type]: amount});
      }
    }

    if(this.props.data['occupied'] > 0 && amount > 0) buttonClass = 'active';
    if(this.props.data['occupied'] === 0 && amount === 0) buttonClass = 'active';

    return <button className={buttonClass} onClick={clickHandler(type, amount)}>{label}</button>
  }

  info(){
    if(this.props.data['occupied'] > 0){
      return <span className="info">{this.props.data['occupied']} minutes remaining</span>
    }
    return null;
  }
  
  render(){
    return (
      <div className="occupancyControl">
        <h3>Occupancy</h3>
        { this.button('occupied', 0, 'Away') }
        { this.button('occupied', 1440, 'Occupied') }
        { this.info()}
      </div>
    )
  }
}

export default OccupancyControl;
