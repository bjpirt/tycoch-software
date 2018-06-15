import mqtt from 'mqtt';

class DataHandler {
  constructor (){
    let client = mqtt.connect('ws://' + window.location.host.split(':')[0] + ':9001');
    this.data = {};

    client.on('connect', () => {
      client.subscribe('tycoch/#');
    })

    client.on('message', this.handleMessage)
  }
  
  handleMessage = (topic, message) => {
    let msg = JSON.parse(message);
    for(var key in msg.fields){
      this.data[msg.name] = this.data[msg.name] || {};
      this.data[msg.name][key] = msg.fields[key];
    }
    this.onChange && this.onChange(this.data);
  }
}

export default DataHandler;
