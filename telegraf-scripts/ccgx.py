#!/usr/bin/env python
import time
import ctypes
import sys
import logging
import os
import random
# logging.basicConfig()
# log = logging.getLogger()
# log.setLevel(logging.DEBUG)

DUMMY = os.path.exists('/boot/dummy')


def r(base, var):
    return base + (var * random.random())


if len(sys.argv) < 2:
    pass
    sys.exit(1)
else:
    ip = sys.argv[1]

if not DUMMY:
    from pymodbus.client import ModbusTcpClient
    client = ModbusTcpClient(ip, port=502)
    client.connect()

# PV power generation
if DUMMY:
    gen = r(1760, 300)
    pv_bv = r(56, 3)
else:
    gen = client.read_holding_registers(789, 1, slave=245).registers[0]/10.0
    pv_bv = client.read_holding_registers(771, 1, slave=245).registers[0]/100.0
print("pv power-generation=%f,batt-voltage=%f" % (gen, pv_bv))

# AC Usage
if DUMMY:
    power = r(180, 300)
    ac_bv = r(56, 3)
else:
    res1 = client.read_holding_registers(15, 4, slave=246)
    ac_bv = client.read_holding_registers(26, 1, slave=246).registers[0]/100.0
    power = res1.registers[0]/10.0 * res1.registers[3]/10.0
if power < 10000:
    print("ac power-usage=%f,batt-voltage=%f" % (power, ac_bv))

# Battery status
if DUMMY:
    bv = r(56, 3)
    current = r(20, 5)
    soc = r(95, 5)
else:
    bv = client.read_holding_registers(259, 3, slave=247).registers[0]/100.0
    res2 = client.read_holding_registers(266, 1, slave=247)
    current = ctypes.c_short(res1.registers[2]).value/10.0
    soc = res2.registers[0]/10.0
print("battery voltage=%f,current=%f,state-of-charge=%f" % (bv, current, soc))

# Generator Input
if DUMMY:
    res = r(800, 900)
else:
    res = client.read_holding_registers(12, 4, slave=246).registers[0] * 10
print("ac generator-input=%f" % (res))

# except:
#  sys.exit(1)
