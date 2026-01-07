import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/";

export const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || "Error al realizar la petición";
        console.error(message);
        return Promise.reject(new Error(message));
    }
);