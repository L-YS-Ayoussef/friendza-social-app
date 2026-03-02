import axios from 'axios';
import { Platform } from 'react-native';

const LAN_IP = '192.168.1.10';

const API_ORIGIN = Platform.select({
  android: 'http://10.0.2.2:5000',   // Android emulator
  ios: 'http://localhost:5000',      // iOS simulator
  default: `http://${LAN_IP}:5000`,  // physical device
});

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  timeout: 15000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const resolveMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `${API_ORIGIN}${pathOrUrl}`;
};

export default api;