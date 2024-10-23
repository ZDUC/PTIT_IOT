import React, { useState, useEffect, CSSProperties } from 'react';
import { FaTv, FaLightbulb, FaToggleOn, FaToggleOff, FaFan } from 'react-icons/fa';
import mqtt, { MqttClient } from 'mqtt';
import { saveHistoryToDatabase } from '../../data/repositories/api';
// import FaFan from '../../assets/images/FaFan.png';

export interface DeviceSchema {
  _id: string;
  name: string;
  action?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HistorySchema {
  deviceId: string;
  deviceName: string;
  action: boolean;
}

const Device = ({ devices }: { devices: DeviceSchema[] }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [deviceStates, setDeviceStates] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [numberNhay, setNumberNhay] = useState<number>(0);
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    const host = '667e33c453fe4f028d4486b0f821713b.s1.eu.hivemq.cloud';
    const port = 8884;
    const clientId = `mqttjs_${Math.random().toString(16).substr(2, 8)}`;
    const connectUrl = `wss://${host}:${port}/mqtt`;

    const options = {
      clientId,
      username: 'songcuon123',
      password: 'songcuon123',
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };

    const mqttClient = mqtt.connect(connectUrl, options);
    setClient(mqttClient);

    mqttClient.on('connect', () => {
      console.log('Device component connected to MQTT broker');

      // Đăng ký các topic esp8266/alert và esp8266/number
      mqttClient.subscribe('esp8266/alert', { qos: 0 });
      mqttClient.subscribe('esp8266/number', { qos: 0 });
    });

    mqttClient.on('message', (topic, message) => {
      // Xử lý tin nhắn từ các topic
      const msg = message.toString();
      if (topic === 'esp8266/alert') {
        // Xử lý giá trị boolean từ topic esp8266/alert
        const alertState = JSON.parse(msg).state;
        setAlert(alertState);
        // console.log('Alert State:', alertState);
      } else if (topic === 'esp8266/number') {
        // Xử lý giá trị từ topic esp8266/number
        const jsonData = JSON.parse(msg); // Phân tích cú pháp JSON
        const alertCount = jsonData.alert_count; // Lấy giá trị alert_count
        setNumberNhay(alertCount);
        // console.log('Alert Count:', alertCount);
      }
    });


  }, []);

  useEffect(() => {
    const initialStates: { [key: string]: boolean } = {};
    devices.forEach(device => {
      initialStates[device._id] = device.action || false;
      setLoading(prev => ({ ...prev, [device._id]: false }));
    });
    setDeviceStates(initialStates);
  }, [devices]);

  const toggleDevice = async (deviceId: string, deviceName: string) => {
    if (client) {
      const currentState = deviceStates[deviceId];
      const newState = !currentState;

      setDeviceStates(prev => ({ ...prev, [deviceId]: newState }));
      setLoading(prev => ({ ...prev, [deviceId]: true }));

      client.publish(`esp8266/${deviceName}`, JSON.stringify({ state: newState }));
      console.log(deviceName, newState)

      try {
        const response = await fetch(`http://localhost:3001/api/data/update-device/${deviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: newState }),
        });

        if (!response.ok) {
          throw new Error('Failed to update device action');
        }

        const result = await response.json();
        console.log('Device updated:', result.data);
        const historyEntry = {
          deviceId: deviceId,
          deviceName: deviceName,
          action: newState,
        };
        await saveHistoryToDatabase(historyEntry);

      } catch (error) {
        console.error('Error updating device action:', error);
      } finally {
        setLoading(prev => ({ ...prev, [deviceId]: false }));
      }
    }
  };

  const getContainerStyle = (isOn: boolean): CSSProperties => ({
    width: '300px',
    height: '240px',
    backgroundColor: isOn ? '#C3DBFF' : '#FFFFFF',
    marginLeft: '20px',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  });

  const iconStyle: CSSProperties = {
    fontSize: '80px',
  };

  const buttonStyle: CSSProperties = {
    fontSize: '40px',
    cursor: 'pointer',
    position: 'relative',
  };

  const tvStyle = (isOn: boolean): CSSProperties => ({
    background: isOn ? 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' : '#3E7EF7',
    borderRadius: '16px',
    width: '100px',
    height: '100px',
  });

  const bulbStyle = (isOn: boolean): CSSProperties => ({
    background: isOn ? 'gold' : '#3E7EF7',
    borderRadius: '16px',
    width: '100px',
    height: '100px',
    position: 'relative',
    boxShadow: isOn ? '0px 0px 15px 5px rgba(255, 215, 0, 0.5)' : 'none',
  });

  return (
    <div className='d-flex row justify-content-center align-items-center'>
      <div style={getContainerStyle(alert)} className='col-6 mb-3'>
        <div>Số lần cảnh báo: {numberNhay}</div>
        <h4 style={{ color: '#284680' }}>alert</h4>
        <div
          style={{}}
          className='d-flex justify-content-center align-items-center'
        >
          <FaFan style={{ ...iconStyle }} />
        </div>

        <div
          // onClick={() => toggleDevice(device._id, device.name)}
          style={{ ...buttonStyle, color: alert ? '#fff' : '#6c757d' }}
        >

          {alert ? <FaToggleOn /> : <FaToggleOff />}

        </div>
      </div>
      {devices.map((device) => {
        let Icon;
        let customStyle;
        switch (device.name.toLowerCase()) {
          case 'fan':
            Icon = () => (
              <img
                src={deviceStates[device._id]
                  ? "https://png.pngtree.com/png-clipart/20190614/original/pngtree-charging-fan-vector-icon-png-image_3720337.jpg"
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaXTXuP2taUTas5bWq4SuBG9MMa_ZlRnD-Bg&s"}
                alt="Fan"
                style={{ width: '100px', height: '100px' }}
              />
            );
            break;
          case 'tv':
            Icon = FaTv;
            customStyle = tvStyle(deviceStates[device._id]);
            break;
          case 'bulb':
            Icon = FaLightbulb;
            customStyle = bulbStyle(deviceStates[device._id]);
            break;
          default:
            Icon = FaFan;
        }
        return (
          <div style={getContainerStyle(deviceStates[device._id])} key={device._id} className='col-6 mb-3'>
            <h4 style={{ color: '#284680' }}>{device.name}</h4>
            <div
              style={customStyle || { width: '100px', height: '100px', backgroundColor: '#3E7EF7', borderRadius: '16px' }}
              className='d-flex justify-content-center align-items-center'
            >
              <Icon style={{ ...iconStyle, color: '#fff' }} />
            </div>
            <div
              onClick={() => toggleDevice(device._id, device.name)}
              style={{ ...buttonStyle, color: deviceStates[device._id] ? '#fff' : '#6c757d' }}
            >
              {loading[device._id] ? (
                <div className="spinner"></div>
              ) : (
                deviceStates[device._id] ? <FaToggleOn /> : <FaToggleOff />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Device;
