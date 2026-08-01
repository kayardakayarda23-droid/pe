import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Point this at your running backend. On a physical device/emulator,
// 'localhost' won't resolve to your dev machine — use your LAN IP instead,
// e.g. http://192.168.1.20:5000/api
export const BASE_URL = 'http://10.41.65.218:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; 
});

let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;
