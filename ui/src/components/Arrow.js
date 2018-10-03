import React, { Component } from 'react';
import arrow from './icons/arrow.svg';

class Arrow extends Component {
  render(){
    return (
      <div className="arrow">
        <img src={arrow} alt=""/>
      </div>
    )
  }
}

export default Arrow;
