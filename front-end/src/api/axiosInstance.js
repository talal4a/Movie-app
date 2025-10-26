import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }

      return Promise.reject({ ...error, suppressError: true });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
