# smart-home-cloudRUN

Install gcloud CLI

- https://cloud.google.com/sdk/docs/install
- gcloud auth login
- gcloud auth configure-docker

.env file :

- MQTT_IP="ip"
- MQTT_PORT="port"
- MONGO_IP="ip"
- MONGO_PORT="port"
- MQTT_USERNAME="username"
- MQTT_PASSWORD="password"
- CRED="filenamePATH"

Note:

- https://cloud.google.com/run/docs/troubleshooting?&_ga=2.169408417.-127588082.1666004812&_gac=1.187289050.1670855951.CjwKCAiAv9ucBhBXEiwA6N8nYH2qIr8UjRfcyIg6BAn2FH2SwbP9T5LxBCkyLNz81FtW2986_E8CuhoCSFgQAvD_BwE#container-failed-to-start
- By default "PORT" env is set to 8080
- modify package.json -> "scripts" ->
  "start":"node index.js",

Build Docker and push to Container Registry

- docker build --platform linux/amd64 -t smart-home .
- docker tag smart-home gcr.io/gccp-project-373305/smart-home
- docker push gcr.io/gccp-project-373305/smart-home

POST
http://IP-ADDRESS:3000/smartdevices/createdevice
body : {
"deviceID": "0x01",
"deviceState": false,
"deviceName": "Lock",
"deviceType": "lock"
}

GET
http://localhost:3001/smartdevices/getDeviceID

POST
http://localhost:3001/smartdevices/updatedevice
body : {
"deviceID": "0x01",
"deviceState": false
}

GET
http://13.235.244.236:3000/smartdevices/deleteDeviceID
body : {"deviceID": "0x00"}

GET
http://IP-ADDRESS:3000/smartdevices/getAllDeviceID

Also setup
