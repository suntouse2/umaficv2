import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://45.86.39.81:6080';

const AUTH_ERROR_STATUS = 401;
const NO_BALANCE_STATUS = 402;

export const $api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  },
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  return config;
});

//status handlers
$api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === NO_BALANCE_STATUS) {
      toast.error('У вас недостаточно баланса!');
    }

    if (error.response?.status === AUTH_ERROR_STATUS) {
      try {
        const response = await axios.get(`${BASE_URL}/auth/refresh`);
        localStorage.setItem('access_token', response.data.access_token);
        return originalRequest ? $api.request(originalRequest) : undefined;
      } catch {
        console.log('Не удалось обновить сессию через refresh_token');
      }
    }
    throw error;
  }
);
