#!/usr/bin/env python
import time
import ctypes
import sys
import os
import random
import logging

DUMMY = os.path.exists('/boot/dummy')

if not DUMMY:
  from pymodbus.client.sync import ModbusSerialClient as ModbusClient

RAD_CONTROL   = 0x04

if len(sys.argv) < 2:
  sys.exit(1)
else:
  port = sys.argv[1]

def r(base, var):
  return base + (var * random.random())

try:
  if not DUMMY:
    client = ModbusClient(method='rtu', port=port, baudrate=57600, timeout=1, debug=True)
    client.connect()
    time.sleep(2)

  #### Turn the radiators on or off based on the values in influx
  if not DUMMY:
    pass
    # Need to read from influx
    #client.write_registers(0, [1, 1], unit=RAD_CONTROL)

except:
  sys.exit(0)
