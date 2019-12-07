import mqtt from 'mqtt';

class DataHandler {
  constructor (){
    this.client = mqtt.connect('ws://' + window.location.host.split(':')[0] + ':9001');
    this.data = {};

    this.client.on('connect', () => {
      this.client.subscribe('tycoch/#');
    })

    this.client.on('message', this.handleMessage)
  }
  
  handleMessage = (topic, message) => {
    let msg = JSON.parse(message);
    if(!msg.timestamp) console.log(msg);
    for(var key in msg.fields){
      this.data[msg.name] = this.data[msg.name] || {};
      this.data[msg.name][key] = msg.fields[key];
    }
    this.onChange && this.onChange(this.data);
  }

  sendMessage(message){
    this.client.publish('tycoch-settings', JSON.stringify(message));
  }
}

export default DataHandler;
