#!/usr/bin/env python
import time
import ctypes
import sys
import logging
import os
import random

DUMMY = os.path.exists('/boot/dummy')

if not DUMMY:
  from pymodbus.client.sync import ModbusSerialClient as ModbusClient

def r(base, var):
  return base + (var * random.random())

if len(sys.argv) < 2:
  pass
  sys.exit(1)
else:
  port = sys.argv[1]

for i in range(0, 5):
  try:
    if not DUMMY:
      client = ModbusClient(method='rtu', port=port, baudrate=9600, parity='N', stopbits=2, timeout=1)
      client.connect()
    
      res = client.read_holding_registers(8, 5, unit=1)
      readings = map(lambda x: ctypes.c_short(x).value * 96.667 / (2**15), res.registers)
      power = readings[0] * readings[4]
      pwm = client.read_holding_registers(28, 1, unit=1).registers[0]
      temp = client.read_holding_registers(15, 1, unit=1).registers[0]
    else:
      readings = [r(56,2), None, None, None, r(20,4)]
      power = r(780,100)
      pwm = r(256, 20)
      temp = r(10, 10)
    print("immersion batt-voltage=%f,load-current=%f,power=%f,pwm-level=%f,batt-temperature=%d" % (readings[0], readings[4], power, pwm, temp))
    break
  except:
    pass
