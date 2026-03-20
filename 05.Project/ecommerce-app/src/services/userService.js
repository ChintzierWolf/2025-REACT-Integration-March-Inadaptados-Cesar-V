import http from '../utils/http';
import { getCurrentUser } from '../utils/auth';

export const getProfile = async () => {
  return await http.get('/users/profile');
};

export const updateProfile = async (userData) => {
  return await http.put('/users/profile', userData);
};

export const changePassword = async (currentPassword, newPassword) => {
  return await http.put('/users/change-password', {
    currentPassword,
    newPassword
  });
};

export const getAllUsers = async () => {
  return await http.get('/users/');
};

export const getUserById = async (userId) => {
  return await http.get(`/users/${userId}`);
};

export const deactivateAccount = async () => {
  return await http.patch('/users/deactivate');
};
