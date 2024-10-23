import mqtt from 'mqtt'; // Import the MQTT library
import { sendDataToDatabase } from '../api'; // Import the function to send data to the database (commented out for now)
import { useState } from 'react';
// Define MQTT connection parameters
const host = '667e33c453fe4f028d4486b0f821713b.s1.eu.hivemq.cloud';
const port = 8884;
const clientId = `mqttjs_${Math.random().toString(16).substr(2, 8)}`; // Generate a random client ID
const connectUrl = `wss://${host}:${port}/mqtt`; // WebSocket connection URL

// Define the topics for sensor data
const topicSensor = "Data_Sensor";
const topicLight = "Light";
const topicFog = "Fog_Sensor";

// MQTT connection options
const options = {
  clientId,
  username: 'songcuon123', // Replace with your username
  password: 'songcuon123', // Replace with your password
  clean: true,
  reconnectPeriod: 3000, // Period for reconnection attempts
  connectTimeout: 30 * 1000, // Connection timeout
};

// Interface to define the structure of sensor data
export interface SensorData {
  temperature: number | null;
  humidity: number | null;
  light: number | null;
  fog: number | null;
}

// Function to initialize the MQTT client
export const initializeMqttClient = (onDataReceived: (data: SensorData) => void) => {
  const client = mqtt.connect(connectUrl, options); // Create a new MQTT client
  let data: SensorData = { // Initialize data object to store sensor readings
    temperature: null,
    humidity: null,
    light: null,
    fog: null,
  };

  // Event listener for successful connection to the MQTT broker
  client.on('connect', () => {
    console.log('Connected to MQTT broker'); // Log successful connection
    client.subscribe([topicSensor, topicLight, topicFog], (err) => { // Subscribe to the defined topics
      if (err) {
        console.error('Error subscribing to topics:', err); // Log any subscription errors
      }
    });
  });

  // Event listener for incoming messages
  client.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString()); // Parse the incoming message
      console.log("Received payload:", payload); // Log the received payload

      // Update data based on the topic
      if (topic === topicSensor) {
        data.humidity = payload.humidity;
        data.temperature = payload.temperature;
      } else if (topic === topicLight) {
        data.light = payload.lux;
      } else if (topic === topicFog) {
        data.fog = payload.fog;
      }

      // Check if all sensor data is available
      if (data.temperature !== null && data.humidity !== null && data.light !== null && data.fog !== null) {
        console.log("Sensor data:", data); // Log the complete sensor data
        onDataReceived({ ...data }); // Invoke the callback with the sensor data

        data = {
          temperature: null,
          humidity: null,
          light: null,
          fog: null
        };
      }
    } catch (error) {
      console.error('Error parsing message:', error); // Log any parsing errors
    }
  });

  return client; // Return the MQTT client instance
};
