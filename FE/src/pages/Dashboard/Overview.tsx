import React from 'react'
import { Image } from 'react-bootstrap'

import Humidity from '../../assets/svg/humidity.svg'
import Heat from '../../assets/svg/heat.svg';
import Light from '../../assets/svg/light.svg';



const Overview = ({ mqttData }: { mqttData: any }) => {
  // console.log("mqtt", mqttData)
  const temperaturePercentage = Math.min(Math.max((mqttData.temperature / 100) * 100, 0), 100); // Giới hạn từ 0 - 100 độ C
  const humidityPercentage = Math.min(Math.max(mqttData.humidity, 0), 100); // Giới hạn từ 0 - 100%
  const lightPercentage = Math.min(Math.max((mqttData.light / 1024) * 100, 0), 100); // Giới hạn từ 0 - 1024 lux
  return (
    <div className="row mx-2">

      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card border-left-primary shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: '#d32f2f' }}>
                  Nhiệt độ
                </div>
                <div className="row no-gutters align-items-center">
                  <div className="col-2" style={{ marginLeft: '12px' }}>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">{Math.ceil(mqttData.temperature)}°C</div>
                  </div>
                  <div className="col-10" style={{ marginRight: '5px', width: '70%' }}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${temperaturePercentage}%`,
                          background: 'linear-gradient(to right, #ff6f61, #d32f2f)', // Gradient đỏ dần
                        }}
                        aria-valuenow={temperaturePercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <Image src={Heat} alt="Logo" height={50} width={50} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card border-left-primary shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-uppercase mb-1" style={{ color: '#29245A' }}>
                  Sương mù
                </div>
                <div className="row no-gutters align-items-center">
                  <div className="col-2" style={{ marginLeft: '12px' }}>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">{Math.ceil(mqttData.fog)}</div>
                  </div>
                  <div className="col-10" style={{ marginRight: '5px', width: '70%' }}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${temperaturePercentage}%`,
                          background: 'linear-gradient(to right, #E7CFE7, #29245A)', // Gradient đỏ dần
                        }}
                        aria-valuenow={temperaturePercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <Image src={Heat} alt="Logo" height={50} width={50} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card border-left-info shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Độ ẩm
                </div>
                <div className="row no-gutters align-items-center">
                  <div className="col-2" style={{ marginLeft: '12px' }}>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">{mqttData.humidity}%</div>
                  </div>
                  <div className="col-10" style={{ marginRight: '5px', width: '70%' }}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${humidityPercentage}%`,
                          background: 'linear-gradient(to right, #36a2eb, #0000FF)', // Gradient xanh dương dần
                        }}
                        aria-valuenow={humidityPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <Image src={Humidity} alt="Logo" height={50} width={50} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card border-left-warning shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Ánh sáng
                </div>
                <div className="row no-gutters align-items-center">
                  <div className="col-2" style={{ marginLeft: '12px' }}>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">{Math.ceil(mqttData.light)} lux</div>
                  </div>
                  <div className="col-10" style={{ marginRight: '5px', width: '70%' }}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${lightPercentage}%`,
                          background: 'linear-gradient(to right, #ffeb3b, #fbc02d)', // Gradient vàng dần
                        }}
                        aria-valuenow={lightPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <Image src={Light} alt="Logo" height={50} width={50} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Overview
