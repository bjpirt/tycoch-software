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

RELAY_OFFSET = 4

timetable = {
  'downstairs': [
    ['06:00', 18],
    ['10:30', 15],
    ['18:00', 18],
    ['22:00', 12]
  ],
  'upstairs': [
    ['06:00', 16],
    ['09:00', 13],
    ['20:00', 18],
    ['23:00', 14]
  ]
}
boost_temp = 20
off_temp = 8
upper_hysteresis = 0.5
lower_hysteresis = 1.0

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
  current_time = time.strftime('%H:%M')
  fill_t = timetable[zone][-1][1]
  for t in timetable[zone]:
    if t[0] > current_time:
      return fill_t
      break;
    else:
      fill_t = t[1]
  return fill_t

def get_desired_temp(zone, occupied):
  #return {'upstairs': 18, 'downstairs': 8}[zone]
  if occupied:
    # Read the boost values from influx
    boost = "series" in query_influx('SELECT last("' + zone + '-boost") FROM "tycoch"."oneday"."heating" WHERE time > now() - 1h')
    if boost:
      return boost_temp
    else:
      return get_current_set_temp(zone)
  else:
    return off_temp

def calculate_heating_state(zone, current_temp, current_state, occupied):
  desired_temp = get_desired_temp(zone, occupied)
  if current_temp <= (desired_temp - lower_hysteresis):
    return 1
  elif current_temp >= (desired_temp + upper_hysteresis):
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

result = query_influx('select count("power-usage") from "tycoch"."oneday"."ac" where "power-usage" > 200 and "power-usage" < 900')
occupied = "series" in result
print("heating occupied=%d" % int(occupied))
#occupied = False

for i in range(0,3):
  try:
    #### Read the house temperature sensors
    if DUMMY:
      registers = [int(r(1200,200)), int(r(2000,400)), r(0, 1), r(0,1), r(0, 1), r(0, 1)]
    else:
      registers = client.read_holding_registers(0, 6, unit=HEATING).registers

    upstairs_temp, downstairs_temp = list(map(lambda x: ctypes.c_short(x).value * 0.0078125, registers[0:2]))
    downstairs_heating = calculate_heating_state('downstairs', downstairs_temp, registers[RELAY_OFFSET], occupied)
    upstairs_heating = calculate_heating_state('upstairs', upstairs_temp, registers[RELAY_OFFSET+1], occupied)

    if not DUMMY:
      #### Turn the radiators on or off based on the values in influx
      client.write_registers(RELAY_OFFSET, [downstairs_heating, upstairs_heating, 1], unit=HEATING)
      relays = client.read_holding_registers(RELAY_OFFSET, 2, unit=HEATING).registers
      print("heating downstairs-actual=%d,upstairs-actual=%d" % (relays[0], relays[1]))

    print("heating downstairs=%d,upstairs=%d" % (downstairs_heating, upstairs_heating))
    print("temperature house-downstairs=%f,house-upstairs=%f" % (downstairs_temp, upstairs_temp))
    print("temperature house-downstairs-set-temp=%f,house-upstairs-set-temp=%f" % (get_desired_temp('downstairs', occupied), get_desired_temp('upstairs', occupied)))
    break
  except:
    pass
