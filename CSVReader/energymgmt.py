import json
import time
import random
import csv
import pika

def read_config():
    with open('config.json', 'r') as config_file:
        config = json.load(config_file)
    return config

def send_measurement_to_queue(timestamp, deviceId, measurement_value):
    rabbit_host = 'localhost'
    rabbit_port = 5673
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbit_host, port=rabbit_port))
    channel = connection.channel()
    
    channel.queue_declare(queue='energyqueue1')

    message = {
        "timestamp": timestamp,
        "deviceId": deviceId,
        "hourlyConsumption": measurement_value
    }

    channel.basic_publish(exchange='', routing_key='energyqueue1', body=json.dumps(message))
    print(f"Sent measurement: {message}")

    connection.close()

config = read_config()
deviceId = config.get("deviceId",1)
# Change the path to reflect the location inside the container
with open('sensor.csv', 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)  # Skip header row

    for row in csvreader:
        timestamp = int(time.time()) * 1000  # Current timestamp in milliseconds
        measurement_value = float(row[0])  # Assuming the first column is the measurement value

        send_measurement_to_queue(timestamp, deviceId, measurement_value)
        time.sleep(5    )  # Wait for 6 minutes before sending the next measurement
