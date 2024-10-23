import { SensorData } from '../mqtt';

import { API_BASE_URL } from '../../const/path';

import { DeviceSchema, HistorySchema } from '../../../pages/Dashboard/Device';

export const sendDataToDatabase = async (data: SensorData) => {
  console.log("data", JSON.stringify(data))
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error sending data to database:', error);
    throw error;
  }
};

export const saveHistoryToDatabase = async (history: HistorySchema) => {
  console.log("data", JSON.stringify(history))
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/history-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(history),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error sending data to database:', error);
    throw error;
  }
}
export const sendStateToDatabase = async (device: DeviceSchema) => {
  console.log("data", JSON.stringify(device))
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/update-device/${device._id}`, {
      method: 'PUT',
      body: JSON.stringify(device),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error sending data to database:', error);
    throw error;
  }
}

export const getDataByType = async ({ content, searchBy, orderBy, sortBy, page, pageSize }: { content: any, searchBy: any, orderBy: any, sortBy: any, page: any, pageSize: any }) => {
  try {
    // Tạo URL với query string từ các tham số
    const queryParams = new URLSearchParams({
      content,
      searchBy,
      orderBy,
      sortBy,
      page: page.toString(),
      pageSize: pageSize.toString(),
    }).toString();

    const response = await fetch(`${API_BASE_URL}/api/data/table-data?${queryParams}`, {
      method: 'GET',
    });

    // Kiểm tra nếu yêu cầu không thành công
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    // Chuyển đổi phản hồi thành JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
};

export const getDeviceByTime = async ({ startTime, page, pageSize }: { startTime: string, page: string, pageSize: string }) => {
  try {
    // Tạo query string từ các tham số
    const queryParams = new URLSearchParams({
      startTime,
      page: page.toString(),
      pageSize: pageSize.toString(),
    }).toString();

    // Gửi yêu cầu GET tới API với query string
    const response = await fetch(`${API_BASE_URL}/api/data/get-device/table_device?${queryParams}`, {
      method: 'GET',
    });

    // Kiểm tra nếu yêu cầu không thành công
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    // Chuyển đổi phản hồi thành JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
};



