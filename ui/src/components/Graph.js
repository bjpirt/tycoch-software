import React, { Component } from 'react';
import Plot from 'react-plotly.js';

let data_default = {
  type: 'scatter',
  mode: 'lines+points',
  line: {color: '#0F0', width: 1},
  fill: 'tozeroy'
}

class Graph extends Component {
  data(){
    return this.props.data.map(d => {
      let dataObj = JSON.parse(JSON.stringify(data_default));
      dataObj.x = this.props.times;
      dataObj.y = d.values;
      dataObj.name = d.name;
      dataObj.line.color = d.color;
      return dataObj;
    });
  }
  
  layout(){
    let layout = {
      height: 300,
      width: 800,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(255,255,255,0.1)',
      margin: {
        l: 50,
        r: 20,
        b: 40,
        t: 0,
        pad: 0
      },
      legend: {
        orientation: 'h',
        font: {
          color:'#CCC'
        }
      },
      xaxis: {
        range: this.props.x_range,
        type: 'date',
        gridcolor:'#888',
        tickfont: {
          color:'#CCC'
        }
      },
      yaxis: {
        gridcolor:'#888',
        tickfont: {
          color:'#CCC'
        },
        titlefont: {
          color:'#CCC'
        },
        title: this.props.y_title
      }
    }
    if(this.props.range){
      layout.yaxis = {range: this.props.y_range};
    }
    return layout;
  }
  
  render(){
    return <Plot
              data={this.data()}
              layout={this.layout()}
              config={{
                displayModeBar: false,
                staticPlot: true,
                responsive: true
              }}
            />
  }
}

export default Graph;