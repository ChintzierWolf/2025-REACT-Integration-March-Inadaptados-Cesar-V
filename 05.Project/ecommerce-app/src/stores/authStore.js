import { create } from 'zustand';
import http from '../utils/http';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  initialize: () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      set({ user: JSON.parse(userData), loading: false });
    } else {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await http.post('/auth/login', { email, password });
      
      localStorage.setItem('token', response.token);
      
      const userData = {
        _id: response.user?._id,
        email: response.user?.email || email,
        displayName: response.user?.displayName,
        role: response.user?.role || 'guest',
        phone: response.user?.phone,
        avatar: response.user?.avatar
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      set({ user: userData, loading: false });
      return { success: true, user: userData, token: response.token };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await http.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null });
    // Opcionalmente redirigir
    window.location.href = '/';
  },

  isAuthenticated: () => {
    const state = get();
    return !!state.user && !!localStorage.getItem('token');
  }
}));

// Iniciar sesión desde localStorage al cargar el archivo
useAuthStore.getState().initialize();
