#!/usr/bin/env python
import minimalmodbus
import time
import ctypes

minimalmodbus.BAUDRATE = 57600
instrument = minimalmodbus.Instrument('/dev/tty.usbserial-FTWE9QD5', 1) # port name, slave address (in decimal)

#### Read the tank sensor
sensor_names = ["tank-sensor1", "tank-sensor2", "tank-sensor3", "tank-sensor4"]
max_temp = 85
min_temps = [20, 30, 40, 50]
readings = map(lambda x: ctypes.c_short(x).value * 0.0078125, instrument.read_registers(0, 4, 3))

for index, temp in enumerate(readings):
  print "%s value=%f" % (sensor_names[index], temp)

#### Calculate the gradients and work out the % full
total = 0
for i in range(4):
  if(readings[i] > min_temps[i]):  
    total += (readings[i] - min_temps[i]) / (max_temp - min_temps[i])
total = (total / 4) * 100

print "tank-level value=%f" % (total)