import axios from 'axios';
import { AuthResponse } from '../types/response/authResponse';

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      try {
        const response = await axios.post<AuthResponse>(
          `${API_URL}/auth/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
            },
          },
        );
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        return api.request(originalRequest);
      } catch (e) {
        console.log(e);
      }
    }
    throw error;
  },
);
