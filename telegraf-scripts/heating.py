#!/usr/bin/env python
import time
import ctypes
import sys
import os
import random
import logging
import urllib
import urllib2
import json

DUMMY = os.path.exists('/boot/dummy')

timetable = {
  'downstairs': [
    ['07:00': 18],
    ['10:00': 15],
    ['18:00': 18],
    ['22:00': 12]
  ],
  'upstairs': [
    ['06:00': 18],
    ['09:00': 13],
    ['20:00': 16],
    ['22:00': 14]
  ]
}
boost_temp = 18
off_temp = 12
hysteresis = 0.5

if not DUMMY:
  from pymodbus.client.sync import ModbusSerialClient as ModbusClient

RAD_CONTROL   = 0x04

if len(sys.argv) 3:
  sys.exit(1)
else:
  port = sys.argv[1]
  influx_host = sys.argv[2]

def r(base, var):
  return base + (var * random.random())

def query_influx(q):
  query = urllib.urlencode(q)
  result = urllib2.urlopen("http://" + influx_host + ":8086/query?q=" + query).read()
  return json.loads(result)

def get_current_set_temp(zone):
  return 14

def calculate_heating_state(zone, current_temp, current_state, occupied)
  desired_temp = off_temp
  # Read the boost values from influx
  upstairs_boost = "series" in query_influx('SELECT last("upstairs-boost") FROM "tycoch"."oneday"."heating" WHERE time > now() - 1h')
  downstairs_boost = "series" in query_influx('SELECT last("downstairs-boost") FROM "tycoch"."oneday"."heating" WHERE time > now() - 1h')
  
  if occupied:
    if (zone == 'upstairs' and upstairs_boost) or (zone == 'downstairs' and downstairs_boost):
      desired_temp = boost_temp
    else:
      desired_temp = get_current_set_temp(zone)
  
  if current_temp <= (desired_temp - hysteresis):
    return 1
  else if current_temp >= (desired_temp + hysteresis)
    return 0
  else
    return current_state

try:
  # Connect to the Modbus network
  if not DUMMY:
    client = ModbusClient(method='rtu', port=port, baudrate=57600, timeout=1, debug=True)
    client.connect()
    # Not needed if on RS485
    time.sleep(2)


  #### Read the house temperature sensors
  if DUMMY:
    registers = [r(20,2), r(40,4), r(0, 1), r(0, 1), r(0, 1), r(0, 1)]
  else:
    registers = client.read_holding_registers(0, 4, unit=RAD_CONTROL).registers
    readings = list(map(lambda x: ctypes.c_short(x).value * 0.0078125, res.registers[0:2]))
    downstairs_temp, upstairs_temp = readings

  print("temperature house-downstairs=%f,house-upstairs=%f" % (downstairs_temp, upstairs_temp))

  occupied = False
  if registers[2] > 0
    # There has been a movement event
    occupied = True
    print("occupancy front-door=%d" % int(res.registers[3]))
  else:
    # Read last occupancy value from influx
    result = query_influx('SELECT count("front-door") FROM "tycoch"."oneday"."occupancy" WHERE time > now() - 24h')
    occupied = "series" in result
  
  downstairs_heating = calculate_heating_state('downstairs', downstairs_temp, registers[4], occupied)
  upstairs_heating = calculate_heating_state('upstairs', upstairs_temp, registers[5], occupied)
  
  print("heating downstairs=%d,upstairs=%d" % (downstairs_heating, upstairs_heating))


  if not DUMMY:
    #### Turn the radiators on or off based on the values in influx
    client.write_registers(4, [downstairs_heating, upstairs_heating], unit=RAD_CONTROL)

except:
  sys.exit(0)
