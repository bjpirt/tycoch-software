import React, { Component } from 'react';

class DisplayBox extends Component {
  render(){
    return (
      <div className="displayBox">
        <h3>{ this.props.name }</h3>
        <span>{this.props.value}</span>
      </div>
    )
  }
}

export default DisplayBox;
