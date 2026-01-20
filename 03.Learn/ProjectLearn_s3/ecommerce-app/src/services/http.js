import axios from 'axios';

const APP_BASE_URL = "http://localhost:4000/api/";

export const http = axios.create({
    // url base de la api 
    baseURL:APP_BASE_URL,
    // tiempo maximo de espera para que la peticion se realice correctamente
    // si se excede se cancela la peticion
    timeout: 8000,
});

http.interceptors.response.use(
    // si hay una respuesta correcta la retorna tal y como viene 
    response => response,
    error => {
        const message = error.response?.data?.message || error.message || "Ocurrio un error";
        // envio el error al catch
        // La promesa se rechaza con el error, lo que lanza el error al catch y 
        // se ejecuta el catch con el error
        return Promise.reject(new Error(message));
    }
);
