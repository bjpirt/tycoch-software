import React, { Component } from 'react';
import './HelpDisplay.css';

class HelpDisplay extends Component {
  render(){
    return (
      <div className="helpDisplay panelContainer">
        <div className="panel full">
          <h2>Help with the system</h2>
          <p>Ty Coch is off-grid and has a large system of renewables in place to provide
          power and heat. The system is quite complex and we have provided this display so
          that you can see what is going on with it.</p>
          <h3>Heating</h3>
          <p>In the barn next door is a large thermal store, which acts like a battery for
          heat energy. This gets charged up from a few different sources; solar panels on
          the roof, the log burner, an immersion heater for excess electrical energy and a
          gas boiler in case there is not enough renewable energy.</p>
          <p>There are four temperature sensors in the thermal store so we can see the
          temperature levels inside it and this is represented by the gradient on the left
          hand side of the display. It reaches a maximum temperature of 85&deg;C. Hot water
          for the kitchen and bathroom (including shower) are drawn off the top of the tank.
          The heat for the radiators is drawn off half way up the tank. If there is not
          enough heat for either the hot water or radiators the gas boiler will turn on to
          top up the tank.</p>
          <h3>Controlling the central heating</h3>
          <p>The heating is set to come up to a reasonable temperature (18&deg;C) when the
          house is occupied. If you are too cold, you can click on the "boost" button either
          upstairs or downstairs and the heating will come on for an hour. If you are cold
          it's best to light the log burner because this will heat the house most effectively
          as well as topping up the thermal store without using non-renewable gas.</p>
          <h3>Electricity</h3>
          <p>Electricity is generated through an array of solar panels on the roof. This
          energy is stored in a battery bank for use throughout the day and night. You can
          see how much energy is being generated or consumed on the right hand side of the
          display as well as how full the battery is.</p>
        </div>
      </div>
    )
  }
}

export default HelpDisplay;
