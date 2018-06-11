#!/usr/bin/env python
import time
import ctypes
import sys
import random

def r(base, var):
  return base + (var * random.random())

#### Read the boiler sensor
readings = [r(20,2), r(40,4), r(8,2), r(2,1)]
print "gas-boiler in-temp=%f,out-temp=%f" % (readings[0], readings[1])
print "temperature internal=%f,external=%f" % (readings[2], readings[3])

#### Read the fire sensor
readings = [r(20,2), r(40,4), r(8,2), r(2,1)]
print "fire in-temp=%f,out-temp=%f" % (readings[0], readings[1])

#### Read the tank sensor
sensor_names = ["tank-sensor1", "tank-sensor2", "tank-sensor3", "tank-sensor4"]
max_temp = 85
min_temps = [20, 30, 40, 50]
readings = [r(30,2), r(40,4), r(60,2), r(70,1)]

out = []
for index, temp in enumerate(readings):
  if temp != -256:
    out.append("%s=%f" % (sensor_names[index],temp))

if len(out) > 0:
  #### Calculate the gradients and work out the % full
  total = 0
  for i in range(4):
    if(readings[i] > min_temps[i]):  
      total += (readings[i] - min_temps[i]) / (max_temp - min_temps[i])
  total = (total / 4) * 100
  out.append("tank-level=%f" % (total))
  print "thermal-store " + ','.join(out)
    