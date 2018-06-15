import React, { Component } from 'react';

class ThermalStoreDisplay extends Component {
  render(){
    return (
      <div className="thermalStore">
        <h3>Thermal Store</h3>
        <p>{this.props.values['tank-sensor4']}</p>
        <p>{this.props.values['tank-sensor3']}</p>
        <p>{this.props.values['tank-sensor2']}</p>
        <p>{this.props.values['tank-sensor1']}</p>
      </div>
    )
  }
}

export default ThermalStoreDisplay;
