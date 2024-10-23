#include <ESP8266WiFi.h>
#include "DHTesp.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

#define DHTpin 12
#define FAN 13
#define TV 14
#define BULB 4  // GPIO15 - D8
#define ALERT 5 // GPIO cho đèn cảnh báo (alert)
DHTesp dht;

const char* ssid = "Zeros";      //Wifi connect
const char* password = "00000000";   //Password

const char* mqtt_server = "667e33c453fe4f028d4486b0f821713b.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "songcuon123"; //User
const char* mqtt_password = "songcuon123"; //Password
//--------------------------------------------------
WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];
const float maxLux = 1024;  
int alertCount = 0; // Biến đếm số lần đèn cảnh báo nháy


void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//------------Connect to MQTT Broker-----------------------------
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID =  "ESPClient-";
    clientID += String(random(0xffff), HEX);
    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("esp8266/client");
      client.subscribe("esp8266/fan");  // Ensure subscription to fan topic
      client.subscribe("esp8266/tv");   // TV subscription
      client.subscribe("esp8266/bulb"); // Bulb subscription
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

//-----Call back Method for Receiving MQTT Messages---------
void callback(char* topic, byte* payload, unsigned int length) {
  String incommingMessage = "";
  for (int i = 0; i < length; i++) incommingMessage += (char)payload[i];
  Serial.println("Message arrived [" + String(topic) + "]" + incommingMessage);
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, incommingMessage);

  if (strcmp(topic, "esp8266/fan") == 0) {
    bool fanState = doc["state"];
    digitalWrite(FAN, fanState ? HIGH : LOW);
    Serial.println(fanState ? "Fan On" : "Fan Off");
  } else if (strcmp(topic, "esp8266/tv") == 0) {
    bool tvState = doc["state"];
    digitalWrite(TV, tvState ? HIGH : LOW);
    Serial.println(tvState ? "TV On" : "TV Off");
  } else if (strcmp(topic, "esp8266/bulb") == 0) {
    bool bulbState = doc["state"];
    digitalWrite(BULB, bulbState ? HIGH : LOW);
    Serial.println(bulbState ? "Bulb On" : "Bulb Off");
  }
}

//-----Method for Publishing MQTT Messages---------
void publishMessage(const char* topic, String payload, boolean retained) {
  if (client.publish(topic, payload.c_str(), true))
    Serial.println("Message published [" + String(topic) + "]: " + payload);
}

void setup() {
  Serial.begin(9600);
  while (!Serial) delay(1);

  dht.setup(DHTpin, DHTesp::DHT11);

  pinMode(FAN, OUTPUT);
  pinMode(TV, OUTPUT);
  pinMode(BULB, OUTPUT);
  pinMode(ALERT, OUTPUT); // Khai báo chân cho đèn cảnh báo

  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

unsigned long timeUpdata = millis();
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // read DHT11
  if (millis() - timeUpdata > 2000) {
    delay(dht.getMinimumSamplingPeriod());
    float h = dht.getHumidity();
    float t = dht.getTemperature();
    t = round(t);
    
    // Publish temperature and humidity
    DynamicJsonDocument doc(1024);
    doc["humidity"] = h;
    doc["temperature"] = t;
    char mqtt_message[128];
    serializeJson(doc, mqtt_message);
    publishMessage("Data_Sensor", mqtt_message, true);

    // Read light sensor value
    int value = analogRead(A0); // Đọc giá trị từ cảm biến ánh sáng
    float lux = abs(1024 - value) * (maxLux / 1024.0); // Tính giá trị độ lux theo giá trị tuyệt đối

    // Publish light sensor value
    DynamicJsonDocument lightDoc(1024);
    lightDoc["lux"] = lux;
    char light_message[128];
    serializeJson(lightDoc, light_message);
    publishMessage("Light", light_message, true);

    // Generate random fog value (0-100)
    int fogValue = random(0, 101);
    Serial.print("Fog Value: ");
    Serial.println(fogValue);

    // Publish fog sensor value
    DynamicJsonDocument fogDoc(1024);
    fogDoc["fog"] = fogValue;
    char fog_message[128];
    serializeJson(fogDoc, fog_message);
    publishMessage("Fog_Sensor", fog_message, true);

    // If fog value > 60, blink the alert light
    if (fogValue > 60) {
      for (int i = 0; i < 1; i++) { // Nháy đèn alert 1 lần
        digitalWrite(ALERT, HIGH);
        delay(500);
        digitalWrite(ALERT, LOW);
        delay(500);
        alertCount++; // Tăng biến đếm mỗi khi đèn nháy

      }
      DynamicJsonDocument numberDoc(1024);
      numberDoc["alert_count"] = alertCount;
      char number_message[128];
      serializeJson(numberDoc, number_message);
      publishMessage("esp8266/number", number_message, true);

       DynamicJsonDocument alertDoc(1024);
      alertDoc["state"] = true;  // Gửi trạng thái là true khi đèn alert nháy
      char alert_message[128];
      serializeJson(alertDoc, alert_message);
      publishMessage("esp8266/alert", alert_message, true);
    } else {
      digitalWrite(ALERT, LOW); // Tắt đèn nếu fog <= 60
      DynamicJsonDocument alertDoc(1024);
      alertDoc["state"] = false;  // Gửi trạng thái là false khi đèn alert tắt
      char alert_message[128];
      serializeJson(alertDoc, alert_message);
      publishMessage("esp8266/alert", alert_message, true);
    }

    timeUpdata = millis();
  }
}
