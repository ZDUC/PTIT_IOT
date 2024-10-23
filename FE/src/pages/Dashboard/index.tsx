import React, { useState, useEffect, useCallback } from 'react';
import Overview from './Overview';
import Chart from './Chart';
import Device, { DeviceSchema } from './Device';
import { initializeMqttClient, SensorData } from '../../data/repositories/mqtt';
import { sendDataToDatabase } from '../../data/repositories/api';

const Dashboard = () => {
  const [mqttData, setMqttData] = useState<SensorData>({ temperature: null, humidity: null, light: null, fog: null });
  const [dataSensor, setDataSensor] = useState<SensorData[]>([]);
  const [devices, setDevices] = useState<DeviceSchema[]>([]);

  let newDataReal: SensorData;
  const initializeClient = useCallback(() => {
    const client = initializeMqttClient((newData) => {
      newDataReal = newData;
      console.log("newDataaReal", newDataReal);
      setMqttData(newData);
      setDataSensor((prevData) => [...prevData, newData]);
    });
    return client;
  }, []);

  useEffect(() => {
    const client = initializeClient(); // Khởi tạo client
    getDevices();

    return () => {
      client.end();
    };
  }, [initializeClient]);

  const getDevices = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/data/get-device');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setDevices(data.data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }, []); // Không có dependencies nên chỉ chạy một lần khi mount
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if(!newDataReal) return;
  //     console.log("mqtt", newDataReal);
  //     sendDataToDatabase(newDataReal);
  //     console.log("gửi data thành công")
  //   }, 2000); 

  //   return () => clearInterval(interval);
  // }, []);
  return (
    <div>
      <Overview mqttData={mqttData} />
      <div className='d-md-flex justify-content-between'>
        <Chart dataSensor={dataSensor} />
        <Device devices={devices} />
      </div>
    </div>
  );
};

export default Dashboard;
