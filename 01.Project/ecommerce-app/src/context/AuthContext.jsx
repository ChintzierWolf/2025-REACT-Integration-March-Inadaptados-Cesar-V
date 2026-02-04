import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, register as registerService } from "../services/auth";
import { getUserProfile } from "../services/userService";
import { setLogoutCallback } from "../services/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const saveToken = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuth(true);
  };

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setIsAuth(false);
  };

  const saveUserData = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    setIsAuth(true);
  };

  const getUserData = () => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  };
  
  useEffect(() => {
    const initAuth = async () => {
    try{
      const token = getToken();
      if(token){
        const userData = await getUserProfile();
        if(userData){
          setUser(userData);
          setIsAuth(true);
          saveUserData(userData);
        }else{
          removeToken();
          setUser(null);
          setIsAuth(false);
        }
      }
    }catch(error){
      console.error("Error al obtener la autenticación:", error);
      removeToken();
      setUser(null);
      setIsAuth(false);
    }finally{
      setLoading(false);
    }
    };
    initAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if(event.key === "authToken"){
        if(!event.newValue){
            setUser(null);
            setIsAuth(false);
        }else if(event.newValue && !isAuth){
            const userData = getUserData();
            if(userData){
                setUser(userData);
                setIsAuth(true);
            }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAuth]);

useEffect(() => {
  setLogoutCallback(logout);
}, [logout]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token } = await loginService(email, password);
      if(token){
        const userData = await getUserProfile();
        if(userData){
          setUser(userData);
          setIsAuth(true);
          saveToken(token);
          saveUserData(userData);
          return { success: true, user: userData };
        }
      }
      return { success: false, message: "No se pudo iniciar sesión" };

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return { success: false, message: error.message || "Error al iniciar sesión" };
    }finally{
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { result } = await registerService(userData);
      if(result){
        return { success: true, email: userData.email, message: "Usuario registrado exitosamente" };
      }
      return { success: false, message: "No se pudo registrar el usuario" };
    } catch (error) {
      console.error("Error al registrar:", error);
      return { success: false, message: error.message || "Error al registrar el usuario" };
    }finally{
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuth(false);
  };

  const hasRole = (role) => {
    return user?.roles.includes(role);
  };

  const value = {
      user,
      isAuth,
      loading,
      login,
      register,
      logout,
      hasRole,
      getToken,
    }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context){
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}