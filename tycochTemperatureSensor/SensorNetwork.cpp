#include "SensorNetwork.h"

SensorNetwork::SensorNetwork(uint8_t pin, uint32_t _interval) {
  ow = new OneWire(pin);
  dt = new DallasTemperature(ow);
  dt->setWaitForConversion(false);
  interval = _interval;
}

void SensorNetwork::begin(){
  discoverSensors();
}

void SensorNetwork::loop(){
  if(!sensorCount) return;
  if(nextSample < millis() && !converting){
    startConversion();
    nextSample = millis() + interval;
  }
  if(conversionReady() && converting){
    converting = false;
    for(int i=0; i< sensorCount; i++){
      sensorValues[i] = dt->getTemp(sensors[i]);
    }
  }
}

void SensorNetwork::setResultsArray(uint16_t *arr){
  sensorValues = arr;
}

void SensorNetwork::discoverSensors(){
  sensorCount = 0;
  while (ow->search(sensors[sensorCount])) {
    sensorCount++;
  }
}

void SensorNetwork::startConversion(){
  dt->requestTemperatures();
  converting = true;
}

bool SensorNetwork::conversionReady(){
  return dt->isConversionComplete();
}

uint16_t SensorNetwork::getTemp(uint8_t index){
  return sensorValues[index];
}

