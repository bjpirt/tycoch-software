#!/usr/bin/env python

import sys
import json
import time
import traceback
import zlib
from datetime import datetime
from datetime import timedelta
import requests

try:
  from urllib import urlencode
except:
  from urllib.parse import urlencode

try:
  from urllib2 import Request, urlopen
except:
  from urllib.request import Request, urlopen

if len(sys.argv) < 2:
  print("No conf file supplied")
  sys.exit(1)

conf_file_path = sys.argv[1]
conf_file = open(conf_file_path, "r").read()
conf = json.loads(conf_file)

influx_host = 'localhost'

flatten = lambda l: [item for sublist in l for item in sublist]

def query_influx(q, epoch=False):
  query = {'q': q}
  if epoch:
    query['epoch'] = 's'
  result = urlopen("http://" + influx_host + ":8086/query?" + urlencode(query)).read()
  return json.loads(result)['results'][0]

def write_time_log(t):
  data = ('uploads upload=1 %s' % (t)).encode('UTF-8')
  req = Request("http://" + influx_host + ":8086/write?db=logs&precision=s", data=data)
  request = urlopen(req)

def get_last_upload():
  return query_influx('SELECT last("upload") FROM "logs"."ninetyday"."uploads"')

def check_first_time():
  last_upload = get_last_upload()
  if 'series' not in last_upload.keys():
    # Get first record and upload by days
    first_record = query_influx('SELECT first("mean_1m_batt-voltage") FROM "tycoch"."ninetyday"."ac"', True)
    t = first_record['series'][0]['values'][0][0]
    write_time_log(t)

def get_start_time():
  check_first_time()
  last_upload = query_influx('SELECT last("upload") FROM "logs"."ninetyday"."uploads"')
  return datetime.strptime(last_upload['series'][0]['values'][0][0], "%Y-%m-%dT%H:%M:%SZ")

def fetch_data(start_time):
  results = []
  groups = flatten(query_influx("SHOW MEASUREMENTS ON tycoch")['series'][0]['values'])
  for measurement in groups:
    if measurement != 'disk':
      results.append(query_influx('SELECT * FROM "tycoch"."forever"."%s" WHERE time > \'%sZ\'' % (measurement, start_time.isoformat())))

  results.append(query_influx('SELECT "mean_10m_used_percent" FROM "tycoch"."forever"."disk" WHERE time > \'%sZ\' AND "path"=\'/data\'' % (start_time.isoformat())))
  results.append(query_influx('SELECT "mean_10m_used_percent" FROM "tycoch"."forever"."disk" WHERE time > time > \'%sZ\' AND "path"=\'/data-ramdisk\'' % (start_time.isoformat())))
  return normalise_data(results)
  
def write_log(data):
  sent_times = list(data['values'].keys())
  sent_times.sort()

  last_update = datetime.strptime(sent_times[-1], "%Y-%m-%dT%H:%M:%SZ")
  write_time_log(int(time.mktime(last_update.timetuple())))
  
  print("%d values sent between %s and %s" % (len(data['values']), sent_times[0], sent_times[-1]))

def reformat_columns(name, columns):
  filtered_columns = filter(lambda col: col != 'time', columns)
  return list(map(lambda col: '%s:%s' % (name, col.replace("mean_10m_", "")), filtered_columns))

def round_values(values):
  return list(map(lambda val: round(val, 1) if val else None, values))

def normalise_data(data):
  output = {'values': {}, 'columns': []}
  for group in data:
    if 'series' in group:
      for series in group['series']:
        output['columns'].extend(reformat_columns(series['name'], series['columns']))
        for value in series['values']:
          if value[0] in output['values']:
            output['values'][value[0]].extend(round_values(value[1:]))
          else:
            output['values'][value[0]] = round_values(value[1:])
  return output
  
def limit_data_size(data, limit):
  if len(data['values'].keys()) > limit:
    filter_keys = list(data['values'].keys())
    filter_keys.sort()
    f = lambda i: i[0] in filter_keys[0:limit]
    filtered = list(filter(f, data['values'].items()))
    data['values'] = dict(filtered)
  return data

def deflate(data, compresslevel=9):
    compress = zlib.compressobj(
      compresslevel,
      zlib.DEFLATED,
      zlib.MAX_WBITS | 16,
      zlib.DEF_MEM_LEVEL,
      zlib.Z_DEFAULT_STRATEGY
    )
    deflated = compress.compress(data)
    deflated += compress.flush()
    return deflated

def send_data(data, zip = True):
  data_to_send = json.dumps(data).encode('UTF-8')
  headers = {'Content-Type': 'application/json'}
  if zip:
    data_to_send = deflate(data_to_send)
    headers['Content-Encoding'] = 'gzip'
  res = requests.post(conf['remote_url'], data=data_to_send, headers=headers)
  if res.status_code >= 400:
    raise Exception("Error sending data. Status: %d" % res.status_code)

def upload():
  start_time = get_start_time()
  data = fetch_data(start_time)
  if len(data['values']) > 0:
    data = limit_data_size(data, 2)
    try:
      send_data(data, zip=True)
      write_log(data)
    except Exception:
      print("Error sending data")
      traceback.print_exc()

upload()

