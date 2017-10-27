#!/usr/bin/env python
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
import time
import ctypes
import sys

if len(sys.argv) < 2:
  sys.exit(1)
else:
  port = sys.argv[1]

try:
  client = ModbusClient(method='rtu', port=port, baudrate=57600, timeout=1)
  client.connect()
  
  #### Read the tank sensor
  res = client.read_holding_registers(0, 4, unit=0x01)
  sensor_names = ["tank-sensor1", "tank-sensor2", "tank-sensor3", "tank-sensor4"]
  max_temp = 85
  min_temps = [20, 30, 40, 50]
  readings = map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers)

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
    out.append("level=%f" % (total))
    print "thermal-store " + ','.join(out)
    
except:
  sys.exit(1)