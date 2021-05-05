#include "SensorNetwork.h"
#include "config.h"
#include <ModbusRtu.h>   // https://github.com/smarmengol/Modbus-Master-Slave-for-Arduino

Modbus slave(BOILER_SENSOR, 0, TX_ENABLE);

uint16_t registers[TEMP_COUNT] = {
  DEVICE_DISCONNECTED_RAW,
  DEVICE_DISCONNECTED_RAW,
  DEVICE_DISCONNECTED_RAW,
  DEVICE_DISCONNECTED_RAW
};

SensorNetwork sensors[TEMP_COUNT] = {
  SensorNetwork(CHANNEL1, SAMPLING_PERIOD),
  SensorNetwork(CHANNEL2, SAMPLING_PERIOD),
  SensorNetwork(CHANNEL3, SAMPLING_PERIOD),
  SensorNetwork(CHANNEL4, SAMPLING_PERIOD)
};

void setupSensors(){
  for(int i=0; i<TEMP_COUNT; i++){
    sensors[i].begin();
    sensors[i].setResultsArray(&registers[i]);
  }
}

void setup() {
  slave.begin( 57600 );
  setupSensors();
}

void sampleTemperature(){
  for(int i=0; i<TEMP_COUNT; i++){
    sensors[i].loop();
  }
}

void loop() {
  sampleTemperature();
  slave.poll( registers, TEMP_COUNT );
}
