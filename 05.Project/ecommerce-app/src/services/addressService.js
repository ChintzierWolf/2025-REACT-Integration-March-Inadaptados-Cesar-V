import http from '../utils/http';
import { getCurrentUser } from '../utils/auth';

export const getUserAddresses = async () => {
  const user = getCurrentUser();
  if (!user?._id) return [];
  return await http.get(`/shipping-address/`);
};

export const createAddress = async (addressData) => {
  return await http.post('/shipping-address/', addressData);
};

export const deleteAddress = async (addressId) => {
  return await http.delete(`/shipping-address/${addressId}`);
};

export const getPaymentMethods = async () => {
  const user = getCurrentUser();
  if (!user?._id) return [];
  return await http.get(`/payment-methods/user/${user._id}`);
};

export const createPaymentMethod = async (paymentData) => {
  return await http.post('/payment-methods/', paymentData);
};

export const deletePaymentMethod = async (paymentId) => {
  return await http.delete(`/payment-methods/${paymentId}`);
};

export const setDefaultPaymentMethod = async (paymentId) => {
  return await http.patch(`/payment-methods/${paymentId}/set-default`);
};
