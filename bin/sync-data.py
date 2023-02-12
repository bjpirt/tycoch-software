#!/usr/bin/env python3

import sys
import json
from dateutil.parser import isoparse
from urllib.parse import urlencode
from urllib.request import Request, urlopen

if len(sys.argv) < 2:
    print("No conf file supplied")
    sys.exit(1)

conf_file_path = sys.argv[1]
conf_file = open(conf_file_path, "r").read()
conf = json.loads(conf_file)


def get_dataset():
    request = Request(conf["apiUrl"],
                      headers={
        "Authorization": "Bearer {}".format(conf["authToken"])})
    result = urlopen(request).read()
    return json.loads(result)


def update_dataset(data, zip=True):
    data_to_send = json.dumps(data).encode('UTF-8')
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer %s' % conf['authToken']}

    request = Request(conf["apiUrl"], headers=headers,
                      method="PUT", data=data_to_send)
    urlopen(request)


def query_influx(q, epoch=False):
    query = {'q': q}
    if epoch:
        query['epoch'] = 's'
    result = urlopen("http://" + conf["influxHost"] +
                     ":8086/query?" + urlencode(query)).read()
    return json.loads(result)['results'][0]


def get_start_time():
    dataset = get_dataset()
    times = [v["time"] for k, v in dataset["metrics"].items()]
    if len(times) == 0:
        return isoparse(conf["startTime"])
    else:
        return isoparse(max(times))


def fetch_data(start_time):
    result = query_influx(
        "SELECT * FROM tycoch.ninetyday./.*/ WHERE time > '{}'".format(start_time.isoformat()))
    return normalise_data(result)


def normalise_data(data):
    output = {}
    if 'series' in data:
        for series in data['series']:
            series_name = series['name']
            columns = series['columns']
            for valueGroup in series['values']:
                time = valueGroup[0]
                for index, value in enumerate(valueGroup[1:]):
                    if value != None:
                        column = "{}.{}".format(series_name,
                                                columns[index].replace("mean_1m_", ""))
                        if column not in output:
                            output[column] = []

                        output[column].append(
                            {"time": time, "value": round(value, 2)})
    return output


def group_by_time(data):
    output = {}
    for metric, values in data.items():
        for value in values:
            if value["time"] not in output:
                output[value["time"]] = {}
            output[value["time"]][metric] = value["value"]
    return output


def generate_payload(time, values):
    output = {"metrics": {}}
    for metric, value in values.items():
        output["metrics"][metric] = {"time": time, "value": value}
    return output


def send_by_time(data):
    for time in sorted(data.keys()):
        print("Sending {}".format(time))
        payload = generate_payload(time, data[time])
        update_dataset(payload)


def upload():
    start_time = get_start_time()
    data = fetch_data(start_time)
    data_by_time = group_by_time(data)
    send_by_time(data_by_time)


upload()
