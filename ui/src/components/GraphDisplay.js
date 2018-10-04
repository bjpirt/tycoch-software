import React, { Component } from 'react';
import './GraphDisplay.css';
import GraphData from './GraphData';
import Graph from './Graph';

let hour = 60 * 60 * 1000;
let day  = 24 * 60 * 60 * 1000;

class GraphDisplay extends Component {
  constructor(props){
    super(props);
    this.graphData = new GraphData();
    this.updateTimer = null;
    this.state = {
      duration: 'day',
      startTime: null,
      endTime: null,
      graphData: {
        thermalStore: {times:[], sensor1:[], sensor2:[], sensor3:[], sensor4:[]}, 
        ac_pv: {times:[], ac:[], pv:[]}, 
        temperature: {times:[], external:[], house_downstairs:[], house_upstairs:[]},
        battery: {times:[], state_of_charge:[]}
      }
    }
  }

  init(){
    this.setTimes(new Date(), _=>{
      this.fetchGraphData();
    })
  }
  
  componentDidMount(){
    this.init();
  }

  setGraphDuration(duration){
    if(duration !== this.state.duration){
      this.setState({duration: duration}, _ => {
        this.setTimes(new Date(), _=>{
          this.fetchGraphData();
        });
      });
    }
  }
  
  buttonClass(duration){
    return (duration === this.state.duration ? '' : 'deselected');
  }
  
  initUpdate(){
    if(this.lastPage()){
      if(this.updateTimer) window.clearTimeout(this.updateTimer);
      this.updateTimer = window.setTimeout(this.init.bind(this), this.graphData.getResolution(this.state.startTime, this.state.endTime) * 1000);
    }
  }

  setTimes(now, cb){
    let start, end;
    if(this.state.duration === 'hour'){
      start = now.getTime() - (now.getTime() % hour);
      end = start + hour;
    }else if(this.state.duration === 'day'){
      start = now.getTime() - (now.getTime() % day);
      end = start + day;
    }else if(this.state.duration === 'week'){
      let dow = now.getDay() -1;
      if(dow < 0) dow = 6;
      now = new Date(now.getTime() - (dow * day));
      start = now.getTime() - (now.getTime() % day);
      end = start + (7*day);
    }else if(this.state.duration === 'month'){
      let daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
      now = new Date(now.getTime() - ((now.getDate() -1) * day));
      start = now.getTime() - (now.getTime() % day);
      end = start + (daysInMonth * day);
    }
    this.setState({startTime: start, endTime: end, st: new Date(start), et: new Date(end)}, _ => {
      this.initUpdate();
      cb()
    });
  }
  
  fetchGraphData(){
    let params = ['thermalStore', 'temperature', 'battery', 'ac_pv']
    params.forEach(param => {
      this.graphData.getGraphData(param, this.state.startTime, this.state.endTime, data => {
        this.setState((state, props) => {
          let graphData = state.graphData
          graphData[param] = data;
          return {graphData: graphData};
        });
      });
    })
  }
  
  prevPeriod = () => {
    let offset = 30*60*1000;
    if(this.state.duration !== 'hour') offset *= 24;
    this.setTimes(new Date(this.state.startTime - offset), _=>{
      this.fetchGraphData();
    })
  }
  
  nextPeriod = () => {
    if(!this.lastPage()){
      let offset = 30*60*1000;
      if(this.state.duration !== 'hour') offset *= 24;
      this.setTimes(new Date(this.state.endTime + offset), _=>{
        this.fetchGraphData();
      })
    }
  }
  
  lastPage(){
    return this.state.endTime && this.state.endTime >= (new Date()).getTime()
  }
  
  render(){
    
    let duration = () => {
      function formatTime(date){
        function pad(t){
          let s = String(t);
          if(s.length === 1) s = '0' + s;
          return s
        }
        let d = new Date(date);
        return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
      function formatDate(date){
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let d = new Date(date);
        return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
      }
      
      if(this.state.duration === 'hour'){
        return `${formatDate(this.state.startTime)} ${formatTime(this.state.startTime)} - ${formatTime(this.state.endTime)}`;
      }else{
        return `${formatDate(this.state.startTime)} - ${formatDate(this.state.endTime)}`;
      }
    }

    return (
      
      <div className="graphDisplay panelContainer">
        <div className="panel full">
          <div className="tabs">
            <button onClick={this.prevPeriod.bind(this)}>{"<< Previous"}</button>
            <button onClick={this.setGraphDuration.bind(this, 'month')} className={this.buttonClass('month')}>Month</button>
            <button onClick={this.setGraphDuration.bind(this, 'week')} className={this.buttonClass('week')}>Week</button>
            <button onClick={this.setGraphDuration.bind(this, 'day')} className={this.buttonClass('day')}>Day</button>
            <button onClick={this.setGraphDuration.bind(this, 'hour')} className={this.buttonClass('hour')}>Hour</button>
            <button onClick={this.nextPeriod} disabled={this.lastPage()}>Next >></button>
          </div>
          <div className="graphList">
            <div className="duration">{duration()}</div>
            <h2>Thermal Store Temperatures</h2>
            <Graph
              times={this.state.graphData.thermalStore.times}
              y_title="&deg;C"
              data={[
                {
                  values: this.state.graphData.thermalStore.sensor4,
                  name: 'Sensor 4',
                  color: '#F25119'
                },
                {
                  values: this.state.graphData.thermalStore.sensor3,
                  name: 'Sensor 3',
                  color: '#F28519'
                },
                {
                  values: this.state.graphData.thermalStore.sensor2,
                  name: 'Sensor 2',
                  color: '#F2B919'
                },
                {
                  values: this.state.graphData.thermalStore.sensor1,
                  name: 'Sensor 1',
                  color: '#F2F219'
                }
              ]}
              x_range={[this.state.startTime, this.state.endTime]}
              y_range={[0, 90]}
            />
            <h2>Electricity Usage vs Generation</h2>
            <Graph
              times={this.state.graphData.ac_pv.times}
              y_title="Watts"
              data={[
                {
                  values: this.state.graphData.ac_pv.pv,
                  name: 'PV Generation',
                  color: '#FFC200'
                },
                {
                  values: this.state.graphData.ac_pv.ac,
                  name: 'AC Consumption',
                  color: '#FF008C'
                }
              ]}
              x_range={[this.state.startTime, this.state.endTime]} 
            />
            <h2>Temperature</h2>
            <Graph
              times={this.state.graphData.temperature.times}
              y_title="&deg;C"
              data={[
                {
                  values: this.state.graphData.temperature.house_upstairs,
                  name: 'Upstairs',
                  color: '#A84AE5'
                },
                {
                  values: this.state.graphData.temperature.house_downstairs,
                  name: 'Downstairs',
                  color: '#4A59E5'
                },
                {
                  values: this.state.graphData.temperature.external,
                  name: 'External',
                  color: '#4AE593'
                }
              ]}
              x_range={[this.state.startTime, this.state.endTime]} 
            />
            <h2>Battery Level</h2>
            <Graph
              times={this.state.graphData.battery.times}
              y_title="%"
              data={[
                {
                  values: this.state.graphData.battery.state_of_charge,
                  name: 'Battery Charge Level',
                  color: '#4AE56B'
                }
              ]}
              x_range={[this.state.startTime, this.state.endTime]} 
            />
          </div>
        </div>
      </div>
    )
  }
}

export default GraphDisplay;
