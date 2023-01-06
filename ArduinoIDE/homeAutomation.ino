#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

int variable = 0;
const int relay1 = 2;
const int relay2 = 4;
const int relay3 = 12;
const int relay4 = 14;
bool inits = true;

const char *ssid = "Username";     // Enter your WiFi name
const char *password = "password"; // Enter WiFi password

const char *mqtt_broker = "IP-ADDRESS";
const char *topic = "/device/status";
const char *mqtt_username = "username";
const char *mqtt_password = "password";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void setup()
{
  Serial.begin(115200);
  pinMode(relay, OUTPUT);

  digitalWrite(relay, LOW);
  WiFi.begin(ssid, password);
  WifiConnect();
  client.subscribe("/smarthome/publishStatus");
}

void WifiConnect()
{
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected())
  {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public GCP mqtt broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password))
    {
      {
        Serial.println("Public GCP broker connected");
      }
      else
      {
        Serial.print("failed with state ");
        Serial.print(client.state());
        delay(2000);
      }
    }
  }

  void PublishMessage(bool state)
  {
    DynamicJsonDocument doc(1024);
    doc["status"] = state;
    doc["nodeId"] = "0x01";
    char message[100];
    serializeJson(doc, message);
    client.publish(topic, message);
  }

  void callback(char *topic, byte *payload, unsigned int length)
  {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    char message[length];
    for (int i = 0; i < length; i++)
    {
      message[i] = ((char)payload[i]);
    }
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, message);
    bool state = doc["deviceState"];
    const char *deviceUID = doc["deviceID"];
    if (doc["deviceID"] == "0x01")
    {
      if (state)
      {
        Serial.println("Device1 is ON");
        digitalWrite(relay1, HIGH);
      }
      else if (state)
      {
        digitalWrite(relay1, LOW);
        Serial.println("Device1 is OFF");
      }
    }
    if (doc["deviceID"] == "0x02")
    {
      if (state)
      {
        Serial.println("Device2 is ON");
        digitalWrite(relay2, HIGH);
      }
      else if (state)
      {
        digitalWrite(relay2, LOW);
        Serial.println("Device2 is OFF");
      }
    }
    if (doc["deviceID"] == "0x03")
    {
      if (state)
      {
        Serial.println("Device3 is ON");
        digitalWrite(relay, HIGH);
      }
      else if (state)
      {
        digitalWrite(relay, LOW);
        Serial.println("Device3 is OFF");
      }
    }
    if (doc["deviceID"] == "0x04")
    {
      if (state)
      {
        Serial.println("Device4 is ON");
        digitalWrite(relay, HIGH);
      }
      else if (state)
      {
        digitalWrite(relay, LOW);
        Serial.println("Device4 is OFF");
      }
    }
  }
  void loop()
  {
    client.loop();
  }
