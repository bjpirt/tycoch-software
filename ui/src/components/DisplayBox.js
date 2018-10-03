import React, { Component } from 'react';

class DisplayBox extends Component {
  graphStyle(){
    let percent = 100 * this.props.value/this.props.max;
    return {backgroundImage: `linear-gradient(to top, ${this.props.graphColor} ${percent}%, rgba(0,0,0,0) ${percent}%)`}
  }
  
  render(){
    return (
      <div className="displayBox" style={this.graphStyle()}>
        <h3>{ this.props.name }</h3>
        <span>{this.props.value.toFixed(this.props.precision)}{this.props.unit}</span>
      </div>
    )
  }
}

export default DisplayBox;
