#!/usr/bin/env python
import time
import ctypes
import sys
import os
import random

DUMMY = os.path.exists('/boot/dummy')

if not DUMMY:
  from pymodbus.client.sync import ModbusSerialClient as ModbusClient

BOILER_SENSOR = 0x01
FIRE_SENSOR = 0x02
TANK_SENSOR = 0x03


if len(sys.argv) < 2:
  sys.exit(1)
else:
  port = sys.argv[1]

def r(base, var):
  return base + (var * random.random())

try:
  if not DUMMY:
    client = ModbusClient(method='rtu', port=port, baudrate=57600, timeout=1)
    client.connect()

  #### Read the boiler sensor
  if DUMMY:
    readings = [r(20,2), r(40,4), r(8,2), r(2,1)]
  else:
    res = client.read_holding_registers(0, 4, unit=BOILER_SENSOR)
    readings = map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers)

  print("gas-boiler in-temp=%f,out-temp=%f" % (readings[0], readings[1]))
  print("temperature internal=%f,external=%f" % (readings[2], readings[3]))

  #### Read the fire sensor
  if DUMMY:
    readings = [r(20,2), r(40,4), r(8,2), r(2,1)]
  else:
    res = client.read_holding_registers(0, 4, unit=FIRE_SENSOR)
    readings = map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers)
  print("fire in-temp=%f,out-temp=%f" % (readings[0], readings[1]))

  #### Read the tank sensor
  sensor_names = ["tank-sensor1", "tank-sensor2", "tank-sensor3", "tank-sensor4"]
  max_temp = 85
  min_temps = [20, 30, 40, 50]
  if DUMMY:
    readings = [r(30,2), r(40,4), r(60,2), r(70,1)]
  else:
    res = client.read_holding_registers(0, 4, unit=TANK_SENSOR)
    readings = map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers)

  out = []
  for index, temp in enumerate(readings):
    if temp != -256 and temp != -55:
      out.append("%s=%f" % (sensor_names[index],temp))

  if len(out) > 0:
    #### Calculate the gradients and work out the % full
    total = 0
    for i in range(4):
      if(readings[i] > min_temps[i]):
        total += (readings[i] - min_temps[i]) / (max_temp - min_temps[i])
    total = (total / 4) * 100
    out.append("level=%f" % (total))
    print("thermal-store " + ','.join(out))

except:
  sys.exit(0)
