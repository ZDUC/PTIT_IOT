import React from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartOptions,
} from 'chart.js'

ChartJs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
)

const Chart = ({ dataSensor }: { dataSensor: any }) => {
  const lightData = dataSensor.map((sensor: any) => sensor.light).slice(-10);
  const temperatureData = dataSensor.map((sensor: any) => sensor.temperature).slice(-10);
  const humidityData = dataSensor.map((sensor: any) => sensor.humidity).slice(-10);
  const data = {
    labels: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ],
    datasets: [
      {
        label: 'Ánh sáng',
        data: lightData,
        backgroundColor: 'transparent',
        borderColor: '#fbc02d',
        pointBorderColor: 'transparent',
        pointBorderWidth: 4,
        tension: 0.4,
        yAxisID: 'y1',
        xAxisID: 'x1',
      },
      {
        label: 'Nhiệt độ',
        data: temperatureData,
        backgroundColor: 'transparent',
        borderColor: '#d32f2f',
        pointBorderColor: 'transparent',
        pointBorderWidth: 4,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Độ ẩm',
        data: humidityData,
        backgroundColor: 'transparent',
        borderColor: '#1e88e5',
        pointBorderColor: 'transparent',
        pointBorderWidth: 4,
        tension: 0.4,
        yAxisID: 'y',
      },
    ]
  };
  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 120,
        ticks: {
          stepSize: 20,
          callback: (value: string | number) => value,
        },
        position: 'left',
      },
      y1: {
        min: 0,
        max: 1200,
        ticks: {
          stepSize: 200,
          callback: (value: string | number) => value,
        },
        position: 'right',
        grid: {
          drawOnChartArea: false, // Không hiển thị lưới cho trục này
        },
      },
      x: {
        reverse: false, // Bình thường cho nhiệt độ và độ ẩm
      },
      x1: {
        reverse: true, // Đảo ngược trục x cho ánh sáng
        grid: {
          drawOnChartArea: false, // Không hiển thị lưới cho trục x1
        },
      },
    }
  }
  return (
    <div style={{ marginLeft: '20px'}} className='w-75 w-md-50 w-xl-50'>
      <div className='d-flex justify-content-between'>
        <div className='d-flex align-items-center'>
          <h3 className='text-gray-800'>Nhiệt độ</h3>
          <div style={{ width: '50px', height: '10px', backgroundColor: '#d32f2f', marginLeft: 5 }}></div>
        </div>
        <div className='d-flex align-items-center'>
          <h3 className='text-gray-800'>Độ ẩm</h3>
          <div style={{ width: '50px', height: '10px', backgroundColor: '#1e88e5', marginLeft: 5 }}></div>
        </div>
        <div className='d-flex align-items-center'>
          <h3 className='text-gray-800'>Ánh sáng</h3>
          <div style={{ width: '50px', height: '10px', backgroundColor: '#fbc02d', marginLeft: 5 }}></div>
        </div>
      </div>
      <Line data={data} options={options}></Line>
    </div>
  )
}

export default Chart
