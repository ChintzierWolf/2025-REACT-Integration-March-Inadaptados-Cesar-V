import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import http from '../utils/http';
import { useCartStore } from './cartStore';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,

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
          
          set({ user: userData, loading: false });
          
          // Sincronizar el carrito después del login
          useCartStore.getState().syncCartWithBackend();
          
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
        set({ user: null });
        useCartStore.getState().clearCart();
      },

      isAuthenticated: () => {
        const state = get();
        return !!state.user && !!localStorage.getItem('token');
      },

      setUser: (userData) => {
        set({ user: userData });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

