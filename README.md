# smart-home-cloudRUN

Install gcloud CLI
https://cloud.google.com/sdk/docs/install

.env file :
MQTT_IP="ip"
MQTT_PORT="port"
MONGO_IP="ip"
MQTT_USERNAME="username"
MQTT_PASSWORD="password"

Place the cred file :

- apiController -> creds -> cred.json

Note:

- https://cloud.google.com/run/docs/troubleshooting?&_ga=2.169408417.-127588082.1666004812&_gac=1.187289050.1670855951.CjwKCAiAv9ucBhBXEiwA6N8nYH2qIr8UjRfcyIg6BAn2FH2SwbP9T5LxBCkyLNz81FtW2986_E8CuhoCSFgQAvD_BwE#container-failed-to-start
- By default "PORT" env is set to 8080
- modify package.json -> "scripts" ->
  "start":"node index.js",

Clone the Repo

docker build --platform linux/amd64 -t smart-home .

docker tag smart-home gcr.io/gccp-project-373305/smart-home

docker push gcr.io/gccp-project-373305/smart-home

POST
http://localhost:3000/lock/postLockStatus
body : {"nodeId" : "ragsdgsdf","status" : "pdsgd","motion" : "gfdg"}

GET
http://localhost:3000/lock/getNodeID/
body : {"nodeId" : "ragsdgsdfdsfs"}

GET
