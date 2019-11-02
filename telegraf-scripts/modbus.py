#!/usr/bin/env python
import time
import ctypes
import sys
import os
import random
import logging
#logging.basicConfig()
#log = logging.getLogger()
#log.setLevel(logging.DEBUG)

DUMMY = os.path.exists('/boot/dummy')

if not DUMMY:
  from pymodbus.client.sync import ModbusSerialClient as ModbusClient

BOILER_SENSOR = 0x01
FIRE_SENSOR   = 0x02
TANK_SENSOR   = 0x03
HEATING       = 0x04

retries = 3

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
    # Needed when debugging using non RS485
    #time.sleep(2)
except:
  sys.exit(0)

for i in range(0, retries):
  try:
    #### Read the boiler sensor
    if DUMMY:
      readings = [r(20,2), r(40,4), r(8,2), r(2,1)]
    else:
      res = client.read_holding_registers(0, 4, unit=BOILER_SENSOR)
      readings = map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers)
  
    print("gas-boiler in-temp=%f,out-temp=%f" % (readings[0], readings[1]))
    print("temperature external=%f,monitor=%f" % (readings[2], readings[3]))
    break
  except:
    pass

for i in range(0, retries):
  try:
    #### Read the fire sensor
    if DUMMY:
      readings = [r(20,2), r(40,4), r(8,2), r(2,1)]
    else:
      res = client.read_holding_registers(0, 4, unit=FIRE_SENSOR)
      readings = map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers)
    print("fire in-temp=%f,out-temp=%f" % (readings[0], readings[1]))
    print("temperature plant-room=%f,barn=%f" % (readings[2], readings[3]))
    break
  except:
    pass

for i in range(0, retries):
  try:
    #### Read the tank sensor
    sensor_names = ["tank-sensor1", "tank-sensor2", "tank-sensor3", "tank-sensor4"]
    max_temp = 85
    min_temps = [20, 30, 40, 50]
    if DUMMY:
      readings = [r(20,10), r(40,8), r(60,5), r(75,5)]
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
    break
  except:
    pass

def unpackDate(date):
  year = (date >> 9)  & 0b01111111;
  month = (date >> 5) & 0b00001111;
  day = (date)        & 0b00011111;
  return (day, month, year)

def setHeatingTime(client):
  # Set time
  t = datetime.datetime.now()
  intTime = t.hour*60 + t.minute
  client.write_register(17, intTime, unit=HEATING)

  intDate = ((t.year % 100) << 9) | ((t.month) << 5) | t.day
  client.write_register(18, intDate, unit=HEATING)

#setHeatingTime(client)

for i in range(0, retries):
  #### Read the heating controller
  try:
    if DUMMY:
      tempsReadings = [r(20,2), r(20,2), r(20,2), r(20,2)]
      otherReadings = [int(r(16,6)), int(r(16,6)),
                       int(r(0,1)), int(r(0,1)),
                       int(r(0,1)), int(r(0,1)),
                       0, 0,
                       1,
                       120, 120, 0,
                       0]
    else:
      res = client.read_holding_registers(0, 17, unit=HEATING)
      tempsReadings = list(map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers[0:4]))
      otherReadings = list(map(lambda x: ctypes.c_ushort(x).value, res.registers[4:]))

    print("temperature house-downstairs=%f,house-upstairs=%f,backup=%f,rtc=%f" % (tempsReadings[0], tempsReadings[1], tempsReadings[2], tempsReadings[3]))
    print("heating downstairs-set-temp=%f,upstairs-set-temp=%f" % (otherReadings[0], otherReadings[1]))
    print("heating downstairs-state=%d,upstairs-state=%d" % (otherReadings[2], otherReadings[3]))
    print("heating downstairs-boost=%d,upstairs-boost=%d" % (otherReadings[4], otherReadings[5]))
    print("heating downstairs-off-override=%d,upstairs-off-override=%d" % (otherReadings[6], otherReadings[7]))
    print("heating occupied=%d" % int(otherReadings[8]))
    print("heating utctime=%d" % (otherReadings[9]))
    print("heating localtime=%d" % (otherReadings[9]))
    #print("heating utctime=%d:%d" % ((int(otherReadings[9])/60), int(otherReadings[9])%60))
    #print("heating localtime=%d:%d" % ((int(otherReadings[10])/60), int(otherReadings[10])%60))
    #print("heating date=%d/%d/20%d" % unpackDate(otherReadings[11]))
    print("errors heating=%d" % otherReadings[12])
    break
  except:
    pass
