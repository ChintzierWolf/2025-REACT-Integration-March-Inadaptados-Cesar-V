import { http } from "./http";

//export const register = async (displayName, email, password) => {
export const register = async (userData) => {
  try {
    const response = await http.post("auth/register", userData);
    const { displayName, email } = response.data;

    if (displayName && email) {
      return email;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al registrar un usuario", error.message, userData);
    return null;
  }
};

export const login = async (email, password) => {
  try {
    const response = await http.post("auth/login", { email, password });
    const { token, refreshToken } = response.data;
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al iniciar sesion del usuario", error.message, email);
    return null;
  }
};

export const refreshToken = async () => {
  try {
    // Ahora en la app se está generando un nuevo refreshToken cada vez que se inicia sesión
    // y se está guardando en localStorage, por lo que no es necesario guardarlo de nuevo.
    // Solo hay que recuperar el refreshToken de localStorage y enviarlo al backend.
    // Si no se recupera el refreshToken de localStorage, no se podrá generar un nuevo token.
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const response = await http.post("auth/refresh-token", { refreshToken });
    const { token, refreshToken: newRefreshToken } = response.data;
    
    if (token && newRefreshToken) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", newRefreshToken);

      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al refrescar el token", error.message);
    return null;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await http.get(`auth/check-email?email=${email}`);
    const { taken } = response.data;
    console.log(response.data);
    if (response.status === 200) {
      return taken;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      "Error al consultar la disponibilidad del email",
      error.message,
      email,
    );
    return null;
  }
};
