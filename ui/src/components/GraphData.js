class GraphData{
  getData(query){
    let url = `http://${window.location.host.split(':')[0]}:8086/query?db=tycoch&precision=s&epoch=ms&q=${encodeURI(query)}`;
    
    return fetch(url).then((res) => {
      return res.json();
    })
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
    return `${res}s`
  }
  
  getThermalStoreData(start, end){
    let rp = this.getRetentionPolicy(start);
    let prefix = this.getPrefix(rp);
    let query = `SELECT mean("${prefix}tank-sensor1"), mean("${prefix}tank-sensor2"), mean("${prefix}tank-sensor3"), mean("${prefix}tank-sensor4") FROM "tycoch"."${rp}"."thermal-store" WHERE time > ${start * 1000000} AND time < ${end * 1000000} GROUP BY time(${this.getResolution(start, end)}) FILL(none)`;
    console.log(query);
    return this.getData(query);
  }

  getAcPvData(start, end){
    let rp = this.getRetentionPolicy(start);
    let prefix = this.getPrefix(rp);
    let query = `SELECT mean("${prefix}power-usage"), mean("${prefix}power-generation") FROM "tycoch"."${rp}"."ac", "tycoch"."${rp}"."pv" WHERE time > ${start * 1000000} AND time < ${end * 1000000} GROUP BY time(${this.getResolution(start, end)}) FILL(none)`;
    console.log(query);
    return this.getData(query);
  }

  getTempData(start, end){
    let rp = this.getRetentionPolicy(start);
    let prefix = this.getPrefix(rp);
    let query = `SELECT mean("${prefix}external"), mean("${prefix}house-downstairs"), mean("${prefix}house-upstairs") FROM "tycoch"."${rp}"."temperature" WHERE time > ${start * 1000000} AND time < ${end * 1000000} GROUP BY time(${this.getResolution(start, end)}) FILL(none)`;
    console.log(query);
    return this.getData(query);
  }

  getBatteryData(start, end){
    let rp = this.getRetentionPolicy(start);
    let prefix = this.getPrefix(rp);
    let query = `SELECT mean("${prefix}state-of-charge") FROM "tycoch"."${rp}"."battery" WHERE time > ${start * 1000000} AND time < ${end * 1000000} GROUP BY time(${this.getResolution(start, end)}) FILL(none)`;
    console.log(query);
    return this.getData(query);
  }
}

export default GraphData;