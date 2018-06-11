#!/usr/bin/env python
from pymodbus.client.sync import ModbusTcpClient as ModbusClient
import time
import ctypes
import sys
import logging
#logging.basicConfig()
#log = logging.getLogger()
#log.setLevel(logging.DEBUG)

if len(sys.argv) < 2:
  pass
  sys.exit(1)
else:
  ip = sys.argv[1]

#try:
client = ModbusClient(ip, port=502)
client.connect()

#### PV power generation
res1 = client.read_holding_registers(789, 1, unit=245)
res2 = client.read_holding_registers(771, 1, unit=245)
print "pv power-generation=%f,batt-voltage=%f" % (res1.registers[0]/10.0, res2.registers[0]/100.0)

#### AC Usage
res1 = client.read_holding_registers(15, 4, unit=246)
res2 = client.read_holding_registers(26, 1, unit=246)
power = res1.registers[0]/10.0 * res1.registers[3]/10.0
print "ac power-usage=%f,batt-voltage=%f" % (power, res2.registers[0]/100.0)

#### Battery status
res1 = client.read_holding_registers(259, 3, unit=247)
res2 = client.read_holding_registers(266, 1, unit=247)
print "battery voltage=%f,current=%f,state-of-charge=%f" % (res1.registers[0]/100.0, ctypes.c_short(res1.registers[2]).value/10.0, res2.registers[0]/10.0)

#except:
#  sys.exit(1)
