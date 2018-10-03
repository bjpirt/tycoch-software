import React, { Component } from 'react';
import './GraphDisplay.css';
import GraphData from './GraphData';
import Graph from './Graph';
import Plot from 'react-plotly.js';

let hour = 60 * 60 * 1000;
let day  = 24 * 60 * 60 * 1000;

class GraphDisplay extends Component {
  constructor(props){
    super(props);
    this.graphData = new GraphData();
    this.state = {
      duration: 'hour',
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
  
  componentDidMount(){
    this.setTimes(new Date(), _=>{
      this.fetchGraphData();
    })
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
    this.setState({startTime: start, endTime: end, st: new Date(start), et: new Date(end)}, cb);
  }
  
  fetchGraphData(){
    this.graphData.getThermalStoreData(this.state.startTime, this.state.endTime)
      .then((json) => {
        console.log(json)
        if(json.results && json.results[0] && json.results[0].series && json.results[0].series[0] && json.results[0].series[0].values){
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.thermalStore = {
              times:   json.results[0].series[0].values.map(x => new Date(x[0])),
              sensor1: json.results[0].series[0].values.map(x => x[1]),
              sensor2: json.results[0].series[0].values.map(x => x[2]),
              sensor3: json.results[0].series[0].values.map(x => x[3]),
              sensor4: json.results[0].series[0].values.map(x => x[4])
            }
            return {graphData: graphData};
          })
        }else{
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.thermalStore = {times: [],sensor1: [], sensor2: [], sensor3: [], sensor4: []}
            return {graphData: graphData};
          });
        }
      })
    this.graphData.getAcPvData(this.state.startTime, this.state.endTime)
      .then((json) => {
        console.log(json)
        if(json.results && json.results[0] && json.results[0].series && json.results[0].series[0] && json.results[0].series[0].values){
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.ac_pv = {
              times:   json.results[0].series[0].values.map(x => new Date(x[0])),
              ac: json.results[0].series[0].values.map(x => x[1]),
              pv: json.results[0].series[1].values.map(x => x[2])
            }
            return {graphData: graphData};
          })
        }else{
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.ac_pv = {ac_pv: {times: [], ac: [], pv: []}};
            return {graphData: graphData};
          })
        }
      })
    this.graphData.getTempData(this.state.startTime, this.state.endTime)
      .then((json) => {
        console.log(json)
        if(json.results && json.results[0] && json.results[0].series && json.results[0].series[0] && json.results[0].series[0].values){
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.temperature = {
              times:   json.results[0].series[0].values.map(x => new Date(x[0])),
              external: json.results[0].series[0].values.map(x => x[1]),
              house_downstairs: json.results[0].series[0].values.map(x => x[2]),
              house_upstairs: json.results[0].series[0].values.map(x => x[3])
            }
            return {graphData: graphData};
          })
        }else{
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.temperature = {times: [],external: [], house_downstairs: [], house_upstairs: []}
            return {graphData: graphData};
          });
        }
      })
    this.graphData.getBatteryData(this.state.startTime, this.state.endTime)
      .then((json) => {
        console.log(json)
        if(json.results && json.results[0] && json.results[0].series && json.results[0].series[0] && json.results[0].series[0].values){
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.battery = {
              times:   json.results[0].series[0].values.map(x => new Date(x[0])),
              state_of_charge: json.results[0].series[0].values.map(x => x[1])
            }
            return {graphData: graphData};
          })
        }else{
          this.setState((state, props) => {
            let graphData = state.graphData
            graphData.battery = {times: [],state_of_charge: []}
            return {graphData: graphData};
          });
        }
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
              data={[
                {
                  values: this.state.graphData.thermalStore.sensor4,
                  name: 'Sensor 4',
                  color: '#FF0'
                },
                {
                  values: this.state.graphData.thermalStore.sensor3,
                  name: 'Sensor 3',
                  color: '#0F0'
                },
                {
                  values: this.state.graphData.thermalStore.sensor2,
                  name: 'Sensor 2',
                  color: '#0FF'
                },
                {
                  values: this.state.graphData.thermalStore.sensor1,
                  name: 'Sensor 1',
                  color: '#00F'
                }
              ]}
              x_range={[this.state.startTime, this.state.endTime]}
              y_range={[0, 90]}
            />
            <h2>Electricity Usage vs Generation</h2>
            <Graph
              times={this.state.graphData.ac_pv.times}
              data={[
                {
                  values: this.state.graphData.ac_pv.pv,
                  name: 'PV Generation',
                  color: '#0FF'
                },
                {
                  values: this.state.graphData.ac_pv.ac,
                  name: 'AC Consumption',
                  color: '#0F0'
                }
              ]}
              x_range={[this.state.startTime, this.state.endTime]} 
            />
            <h2>Temperature</h2>
            <Graph
              times={this.state.graphData.temperature.times}
              data={[
                {
                  values: this.state.graphData.temperature.external,
                  name: 'External',
                  color: '#0FF'
                },
                {
                  values: this.state.graphData.temperature.house_downstairs,
                  name: 'Downstairs',
                  color: '#0F0'
                },
                {
                  values: this.state.graphData.temperature.house_upstairs,
                  name: 'Upstairs',
                  color: '#FF0'
                }
              ]}
              x_range={[this.state.startTime, this.state.endTime]} 
            />
            <h2>Battery Level</h2>
            <Graph
              times={this.state.graphData.battery.times}
              data={[
                {
                  values: this.state.graphData.battery.state_of_charge,
                  name: 'Battery Charge Level',
                  color: '#0FF'
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
