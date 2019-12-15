import json
try:
  from urllib import urlencode
except:
  from urllib.parse import urlencode

try:
  from urllib2 import urlopen
except:
  from urllib.request import urlopen

influx_host = 'localhost'

flatten = lambda l: [item for sublist in l for item in sublist]

def query_influx(q):
  query = urlencode({'q': q})
  result = urlopen("http://" + influx_host + ":8086/query?" + query).read()
  return json.loads(result)['results'][0]

groups = flatten(query_influx("SHOW MEASUREMENTS ON tycoch")['series'][0]['values'])
results = []

for measurement in groups:
  if measurement != 'disk':
    print(measurement)
    print('SELECT * FROM "tycoch"."forever"."%s" WHERE time > now() - 1h' % measurement)
    results.append(query_influx('SELECT * FROM "tycoch"."forever"."%s" WHERE time > now() - 1h' % measurement))

results.append(query_influx('SELECT "mean_10m_used_percent" FROM "tycoch"."forever"."disk" WHERE time > now() - 1h AND "path"=\'/data\''))
results.append(query_influx('SELECT "mean_10m_used_percent" FROM "tycoch"."forever"."disk" WHERE time > now() - 1h AND "path"=\'/data-ramdisk\''))

print(results)

