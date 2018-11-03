import React, { Component } from 'react';
import arrow from './icons/arrow.svg';

class Arrow extends Component {
  render(){
    return (
      <div className="arrow" style={{color:'red', backgroundImage: 'url(' + arrow + ')'}}>
      </div>
    )
  }
}

export default Arrow;
