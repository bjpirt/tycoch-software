#!/usr/bin/env python
import time
import ctypes
import sys
import os
import random
import json

try:
  from urllib import urlencode
except:
  from urllib.parse import urlencode
  
try:
  from urllib2 import urlopen
except:
  from urllib.request import urlopen

DUMMY = os.path.exists('/boot/dummy')

timetable = {
  'downstairs': [
    ['07:00', 18],
    ['10:00', 16],
    ['18:00', 18],
    ['22:00', 12]
  ],
  'upstairs': [
    ['06:00', 18],
    ['09:00', 13],
    ['20:00', 16],
    ['22:00', 14]
  ]
}
boost_temp = 18
off_temp = 12
hysteresis = 0.5

if not DUMMY:
  from pymodbus.client.sync import ModbusSerialClient as ModbusClient

HEATING = 0x04

if len(sys.argv) < 3:
  sys.exit(1)
else:
  port = sys.argv[1]
  influx_host = sys.argv[2]

def r(base, var):
  return base + (var * random.random())

def query_influx(q):
  query = urlencode({'q': q})
  result = urlopen("http://" + influx_host + ":8086/query?" + query).read()
  return json.loads(result)['results'][0]

def get_current_set_temp(zone):
  return 14

def calculate_heating_state(zone, current_temp, current_state, occupied):
  desired_temp = off_temp
  # Read the boost values from influx
  boost = "series" in query_influx('SELECT last("' + zone + '-boost") FROM "tycoch"."oneday"."heating" WHERE time > now() - 1h')
  if occupied:
    if boost:
      desired_temp = boost_temp
    else:
      desired_temp = get_current_set_temp(zone)
  
  if current_temp <= (desired_temp - hysteresis):
    return 1
  elif current_temp >= (desired_temp + hysteresis):
    return 0
  else:
    return current_state

try:
  # Connect to the Modbus network
  if not DUMMY:
    client = ModbusClient(method='rtu', port=port, baudrate=57600, timeout=1, debug=True)
    client.connect()
    # Not needed if on RS485
    #time.sleep(3)
except:
  exit(0)

for i in range(0,3):
  try:
    #### Read the house temperature sensors
    if DUMMY:
      registers = [int(r(1200,200)), int(r(2000,400)), r(0, 1), r(0,1), r(0, 1), r(0, 1), r(0, 1)]
    else:
      registers = client.read_holding_registers(0, 7, unit=HEATING).registers
    downstairs_temp, upstairs_temp = list(map(lambda x: ctypes.c_short(x).value * 0.0078125, registers[0:2]))

    print("temperature house-downstairs=%f,house-upstairs=%f" % (downstairs_temp, upstairs_temp))
    break
  except:
    pass
    
for i in range(0,3):
  try:
    occupied = False
    if registers[4] > 0:
      # There has been a movement event
      occupied = True
      client.write_register(4, 0, unit=HEATING)
      print("occupancy front-door=%d" % int(registers[3]))
    else:
      # Read last occupancy value from influx
      result = query_influx('SELECT count("front-door") FROM "tycoch"."oneday"."occupancy" WHERE time > now() - 24h')
      occupied = "series" in result

    downstairs_heating = calculate_heating_state('downstairs', downstairs_temp, registers[5], occupied)
    upstairs_heating = calculate_heating_state('upstairs', upstairs_temp, registers[6], occupied)

    if not DUMMY:
      #### Turn the radiators on or off based on the values in influx
      client.write_registers(5, [downstairs_heating, upstairs_heating], unit=HEATING)
      
    print("heating downstairs=%d,upstairs=%d" % (downstairs_heating, upstairs_heating))
    break
  except:
    pass
