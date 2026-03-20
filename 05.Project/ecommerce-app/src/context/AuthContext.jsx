import { createContext, useContext, useState, useEffect } from 'react';
import http from '../utils/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await http.post('/auth/login', { email, password });
    localStorage.setItem('token', response.token);
    const userData = {
      email,
      role: response.user?.role || 'guest'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return response;
  };

  const register = async (userData) => {
    const response = await http.post('/auth/register', userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => !!user && !!localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
