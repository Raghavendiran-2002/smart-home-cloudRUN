# smart-home-cloudRUN

In this project Cloud Run to run an API that connects to a MongoDB database and an MQTT server. This API serves as the main interface for interacting with our smart home system.

## Getting Started

Install gcloud CLI

- https://cloud.google.com/sdk/docs/install

```
gcloud auth login
gcloud auth configure-docker
```

.env file :

```
MQTT_IP="ip"
MQTT_PORT="port"
MONGO_IP="ip"
MONGO_PORT="port"
MQTT_USERNAME="username"
MQTT_PASSWORD="password"
CRED="filenamePATH"
```

Note:

- https://cloud.google.com/run/docs/troubleshooting?&_ga=2.169408417.-127588082.1666004812&_gac=1.187289050.1670855951.CjwKCAiAv9ucBhBXEiwA6N8nYH2qIr8UjRfcyIg6BAn2FH2SwbP9T5LxBCkyLNz81FtW2986_E8CuhoCSFgQAvD_BwE#container-failed-to-start
- By default "PORT" env is set to 8080
- modify package.json -> "scripts" ->
  "start":"node index.js",

Build Docker and push to Container Registry

```
docker build --platform linux/amd64 -t smart-home .
docker tag smart-home gcr.io/gccp-project-373305/smart-home
docker push gcr.io/gccp-project-373305/smart-home
```

## API Routes

IP-ADDRESS = CLOUD-RUN-URL

POST
http://IP-ADDRESS/smartdevices/createdevice
body : {
"deviceID": "0x01",
"deviceState": false,
"deviceName": "Lock",
"deviceType": "lock"
}

GET
http://IP-ADDRESS/smartdevices/getDeviceID

POST
http://IP-ADDRESS/smartdevices/updatedevice
body : {
"deviceID": "0x01",
"deviceState": false
}

GET
http://IP-ADDRESS/smartdevices/deleteDeviceID
body : {"deviceID": "0x00"}

GET
http://IP-ADDRESS:PORT/smartdevices/getAllDeviceID

Install Arduino IDE:
https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE

# IoT Device Setup

Install Arduino Library:

- PubSubClient.h
- WiFi.h
- ArduinoJson.h

Upload homeAutomation.ino located in ArduinoIDE folder to ESP32 microcontroller

homeAutomation.ino variables modify

```
const char *ssid = "Username";     // Enter your WiFi name
const char *password = "password"; // Enter WiFi password
const char *mqtt_broker = "IP-ADDRESS"; // Change IP-ADDRESS
const char *topic = "/<topic>/<topic>"; // Change TOPIC
const char *mqtt_username = "username";
const char *mqtt_password = "password";
```

Flutter APP : https://github.com/Raghavendiran-2002/smart-home-app
