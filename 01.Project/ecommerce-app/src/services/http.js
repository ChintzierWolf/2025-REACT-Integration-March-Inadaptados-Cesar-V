import axios from "axios";
import { useAuth } from "../context/AuthContext";

const APP_BASE_URL = process.env.REACT_APP_API_BASE_URL;

let logoutCallback = null;
const { getToken } = useAuth();

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

export const http = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    //const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Si el error es 401 y no es una petición ya reintentada
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Marcar la petición como reintentada
      originalRequest._retry = true;
      try{
        // Importar la función de refresh dinámicamente para evitar ciclos
        // Esto es necesario porque la función de refresh también usa http, lo que crearía un ciclo infinito
        // Por eso se importa solamanente dentro de la función asíncrona error, y no en la parte superior del archivo
        const { refresh } = await import ("./auth");
        const newToken = await refresh();
        // Si se obtiene un nuevo token, se debe actualizar la cabecera de la petición original
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Y se debe volver a ejecutar la petición original
          return http(originalRequest);
        }
      }catch(error){
        console.error("Error al refrescar el token (en refreshToken)", error);
      }
      // Si no se pudo obtener un nuevo token, se debe cerrar la sesión
      logoutCallback();
    }
    return Promise.reject(error);
  },
);
