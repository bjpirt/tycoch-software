import React, { Component } from 'react';
import './ThermalStoreDisplay.css'

class ThermalStoreDisplay extends Component {
  linearGradient(){
    let max = 80;
    let min = 25;
    let mid = min + (max - min)/2;
    let maxCol = [255, 44,  61];
    let midCol = [140, 112, 157];
    let minCol = [25,  180, 254];
    
    function blend(maxColor, minColor, max, min, value){
      let out = []
      for(var i = 0; i<3; i++){
        out[i] = Math.floor(minColor[i] + (maxColor[i] - minColor[i]) * ((value - min) / (max - min)))
      }
      return out;
    }
    
    function calculateColor(temp){
      if(temp > max) temp = max;
      if(temp < min) temp = min;
      if(temp >= mid){
        return blend(maxCol, midCol, max, mid, temp);
      }else{
        return blend(midCol, minCol, mid, min, temp);
      }
    }
    return `linear-gradient(to top, #${calculateColor(this.props.values['tank-sensor1']).map(c => c.toString(16)).join('')} 0%, #${calculateColor(this.props.values['tank-sensor2']).map(c => c.toString(16)).join('')} 33%, #${calculateColor(this.props.values['tank-sensor3']).map(c => c.toString(16)).join('')} 66%, #${calculateColor(this.props.values['tank-sensor4']).map(c => c.toString(16)).join('')} 100%)`;
  }

  render(){
    return (
      <div className="thermalStore">
        <div className="diagram" style={{backgroundImage: this.linearGradient()}}>
          <p>{this.props.values['tank-sensor4'].toFixed(1)}&deg;C</p>
          <p>{this.props.values['tank-sensor3'].toFixed(1)}&deg;C</p>
          <p>{this.props.values['tank-sensor2'].toFixed(1)}&deg;C</p>
          <p>{this.props.values['tank-sensor1'].toFixed(1)}&deg;C</p>
        </div>
      </div>
    )
  }
}

export default ThermalStoreDisplay;
