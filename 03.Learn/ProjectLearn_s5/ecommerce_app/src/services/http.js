import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api/";

export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 8000,
});

http.interceptors.request.use(
    (config) => {
        // siempre 
        const token = localStorage.getItem("authToken");
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
    (response) => response,
    (error) => {
        // Manejar errores de autenticación
        if (error.response?.status === 401) {
            // El error 401 indica que la autenticación ha expirado
            // Por lo tanto, se debe limpiar los datos de autenticación
            // y redirigir al usuario a la pantalla de login
            // Limpiar datos de autenticación
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            // Opcional: redirigir al usuario a la pantalla de login
            // window.location.href = "/login";
            return Promise.reject(new Error("No autorizado"));
        }

        const message = error.response?.data?.message || error.message || "Ocurrio un error de red";
        return Promise.reject(new Error(message));
    }
);
