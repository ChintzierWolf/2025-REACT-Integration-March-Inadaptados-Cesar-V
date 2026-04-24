import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Sesión expirada o no autorizada.');
      // Importación dinámica para evitar dependencias circulares
      import('../stores/authStore').then((module) => {
        module.useAuthStore.getState().logout();
      });
      // Fallback inmediato para el token
      localStorage.removeItem('token');
    }

    const customError = error.response?.data?.message || error.response?.data?.error || error.message || 'Error de conexión con el servidor';
    return Promise.reject(new Error(customError));
  }
);

export default http;
