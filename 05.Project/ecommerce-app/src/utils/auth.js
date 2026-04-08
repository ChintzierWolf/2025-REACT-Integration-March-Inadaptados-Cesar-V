import { useAuthStore } from '../stores/authStore';

export async function login(email, password) {
  return await useAuthStore.getState().login(email, password);
}

export async function register(userData) {
  return await useAuthStore.getState().register(userData);
}

export function logout() {
  useAuthStore.getState().logout();
}

export function getCurrentUser() {
  return useAuthStore.getState().user;
}

export function isAuthenticated() {
  return useAuthStore.getState().isAuthenticated();
}
