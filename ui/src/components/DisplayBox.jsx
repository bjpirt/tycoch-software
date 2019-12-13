import React, { Component } from 'react';

class DisplayBox extends Component {
  graphStyle(){
    let percent = 100 * this.getValue()/this.props.max;
    return {backgroundImage: `linear-gradient(to top, ${this.props.graphColor} ${percent}%, rgba(0,0,0,0) ${percent}%)`}
  }

  getValue(){
    let val = this.props.value
    if(this.props.rescale && typeof this.props.min !== 'undefined'){
      val = ((val - this.props.min) * 100) / (this.props.max - this.props.min)
    }
    return val.toFixed(this.props.precision)
  }
  
  render(){
    return (
      <div className="displayBox" style={this.graphStyle()}>
        <h3>{ this.props.name }</h3>
        <span>{this.getValue()}{this.props.unit}</span>
      </div>
    )
  }
}

export default DisplayBox;
