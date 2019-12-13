class GraphData{
  getData(query, cb){
    let url = `http://${window.location.host.split(':')[0]}:8086/query?db=tycoch&precision=s&epoch=ms&q=${encodeURI(query)}`;
    
    return fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        cb(this.processResult(json));
      })
  }

  processResult(res){
    if(res.results && res.results[0] && res.results[0].series && res.results[0].series[0] && res.results[0].series[0].values){
      let out = {};
      let series = res.results[0].series;
      for(let i=0; i< series[0].columns.length; i++){
        if(series[0].columns[i] === 'time'){
          out.times = series[0].values.map(x => new Date(x[0]))
        }else{
          for(let j=0; j< series.length; j++){
            // go through multiple series until we find real data
            let data = series[j].values.map(x => x[i])
            if(data.reduce((v1, v2) => { return !!v1 || !!v2 }, false)){
              // The series had non-null data in it
              out[series[0].columns[i]] = data;
              break;
            }
          }
        }
      }
      return out;
    }else{
      return null;
    }
  }
  
  getRetentionPolicy(date){
    let day = 24 * 60 * 60 * 1000;
    let diff_days = ((new Date()).getTime() - date)/day;
    if(diff_days <= 1){
      return 'oneday';
    }else if(diff_days <= 90){
      return 'ninetyday';
    }else{
      return 'forever';
    }
  }

  getPrefix(rp){
    return {
      oneday: '',
      ninetyday: 'mean_1m_',
      forever: 'mean_10m_'
    }[rp]
  }
  
  getResolution(start, end, values){
    values = values || 400;
    start /= 1000;
    end /= 1000;
    let res = (end - start) / values;
    return res
  }
  
  getGraphData(type, start, end, cb){
    let rp = this.getRetentionPolicy(start);
    let prefix = this.getPrefix(rp);
    let fields = {
      thermalStore: `mean("${prefix}tank-sensor1") as "sensor1" , mean("${prefix}tank-sensor2") as "sensor2", mean("${prefix}tank-sensor3") as "sensor3", mean("${prefix}tank-sensor4") as "sensor4" FROM "tycoch"."${rp}"."thermal-store" `,
      temperature: `mean("${prefix}external") as "external", mean("${prefix}house-downstairs") as "house_downstairs", mean("${prefix}house-upstairs") as "house_upstairs" FROM "tycoch"."${rp}"."temperature"`,
      battery: `mean("${prefix}state-of-charge") as "state_of_charge" FROM "tycoch"."${rp}"."battery"`,
      ac_pv: `mean("${prefix}power-usage") as "ac", mean("${prefix}power-generation") as "pv" FROM "tycoch"."${rp}"."ac", "tycoch"."${rp}"."pv"`
    }
    let query = `SELECT ${fields[type]} WHERE time > ${start * 1000000} AND time < ${end * 1000000} GROUP BY time(${this.getResolution(start, end)}s) FILL(none)`
    return this.getData(query, cb);
  }
}

export default GraphData;